/* Seite für Teilnehmende: Code aus dem QR-Code lesen, auf die Freigabe warten, Fragen beantworten. */
(function () {
  "use strict";
  var h = Live.h, put = Live.put, BLOCKS = window.BLOCKS;
  var app = document.getElementById("app");
  var sess = Live.parseCode(new URLSearchParams(location.search).get("c"));

  /* ----- ohne Code: Eingabe ----- */
  if (!sess) {
    var input = h("input", { id: "code", type: "text", inputmode: "text", autocomplete: "off", autocapitalize: "characters", maxlength: "12", "aria-label": "Code", placeholder: "Code" });
    var err = h("p", { class: "muted", hidden: true }, "Diesen Code gibt es nicht. Bitte noch einmal vom Bildschirm ablesen.");
    put(app, h("section", { class: "panel" },
      h("p", { class: "eyebrow" }, "Mitmachen"),
      h("h2", {}, "Code eingeben"),
      h("p", { class: "muted", style: "margin:0" }, "Der Code steht vorne auf dem Bildschirm, direkt unter dem QR-Code."),
      h("form", { class: "codeform", onsubmit: function (e) {
        e.preventDefault();
        var p = Live.parseCode(input.value);
        if (p) location.href = "?c=" + p.code; else err.hidden = false;
      } }, input, h("button", { class: "btn", type: "submit" }, "Los")),
      err));
    return;
  }

  /* ----- Zustand ----- */
  var KEY = "gynoplive:" + sess.code;
  var saved = Live.store(KEY) || {};
  var pid = saved.pid || Live.rand(8);
  var answers = saved.a && typeof saved.a === "object" ? saved.a : {};
  var open = [];          // freigegebene Blocknummern
  var gotState = false;   // schon etwas von der Moderation gehört?
  var online = false;
  var view = { name: "home" };

  function save() { Live.store(KEY, { pid: pid, a: answers }); }
  function publish() { link.send("p/" + pid, { a: answers }); }
  save();

  var link = Live.open(sess.room, sess.bi, {
    subs: ["state"],
    onStatus: function (ok) {
      online = ok;
      document.getElementById("conn").hidden = false;
      document.getElementById("dot").className = "dot" + (ok ? " on" : "");
      document.getElementById("conntext").textContent = ok ? "verbunden" : "keine Verbindung";
      if (ok) publish();
      if (view.name === "home") render();
    },
    onMessage: function (sub, obj) {
      if (sub !== "state" || !Array.isArray(obj.open)) return;
      gotState = true;
      open = obj.open.filter(function (x) { return typeof x === "string"; });
      if (view.name === "block" && open.indexOf(view.block.nr) < 0) view = { name: "home" };
      if (view.name === "home") render();
    }
  });

  /* ----- Hilfen ----- */
  function progress(b) {
    var done = 0, right = 0;
    b.fragen.forEach(function (f, i) {
      var a = answers[Live.qid(b, i)];
      if (typeof a === "number") { done++; if (a === f.c) right++; }
    });
    return { done: done, right: right, n: b.fragen.length };
  }
  function firstOpenQuestion(b) {
    for (var i = 0; i < b.fragen.length; i++) if (typeof answers[Live.qid(b, i)] !== "number") return i;
    return b.fragen.length;
  }

  /* ----- Ansichten ----- */
  function render() {
    if (view.name === "block") return renderQuestion();
    if (view.name === "result") return renderResult();
    renderHome();
  }

  function renderHome() {
    var anyOpen = false;
    var items = BLOCKS.map(function (b) {
      var isOpen = open.indexOf(b.nr) >= 0, p = progress(b);
      var finished = p.done === p.n;
      var todo = isOpen && !finished;
      if (todo) anyOpen = true;
      var chip = finished ? h("span", { class: "chip done" }, p.right + " von " + p.n + " richtig")
        : isOpen ? h("span", { class: "chip open" }, p.done ? "weiter (" + p.done + "/" + p.n + ")" : "Start")
        : h("span", { class: "chip" }, "gesperrt");
      return h("li", {}, h("button", { class: "bitem" + (todo ? " go" : ""), disabled: !isOpen, onclick: function () {
        view = finished ? { name: "result", block: b } : { name: "block", block: b, i: firstOpenQuestion(b) };
        render(); window.scrollTo(0, 0);
      } }, h("span", { class: "nr" }, b.nr), h("span", { class: "t" }, b.title), chip));
    });
    var lead = !online ? "Die Verbindung wird aufgebaut …"
      : anyOpen ? "Es sind Fragen freigegeben. Tippen Sie auf den markierten Block."
      : gotState ? "Im Moment ist nichts Neues freigegeben. Die nächsten Fragen erscheinen hier von selbst."
      : "Sie sind dabei. Die Fragen erscheinen hier, sobald sie freigegeben werden.";
    put(app,
      h("p", { class: "eyebrow" }, "Code " + sess.code),
      h("h2", {}, anyOpen ? "Los geht’s" : "Bitte warten"),
      h("p", { class: "muted", style: "margin:0" }, lead),
      h("ul", { class: "blist" }, items),
      h("p", { class: "muted", style: "font-size:.85rem;margin-top:22px" }, "Die Antworten sind anonym. Übertragen wird nur, welche Antwort gewählt wurde."));
  }

  function renderQuestion() {
    var b = view.block, i = view.i, f = b.fragen[i], id = Live.qid(b, i);
    if (!f) { view = { name: "result", block: b }; return render(); }
    var given = answers[id];
    var fb = h("div", { class: "fb", hidden: true, role: "status" });
    var next = h("button", { class: "btn", hidden: true, onclick: function () {
      view = i + 1 < b.fragen.length ? { name: "block", block: b, i: i + 1 } : { name: "result", block: b };
      render(); window.scrollTo(0, 0);
    } }, i + 1 < b.fragen.length ? "Weiter" : "Ergebnis");
    var btns = f.o.map(function (text, k) {
      return h("button", { class: "popt", onclick: function () { choose(k); } }, h("span", { class: "k" }, "ABCD".charAt(k)), h("span", {}, text));
    });
    function show(k) {
      btns.forEach(function (bt, j) {
        bt.disabled = true;
        bt.classList.add(j === f.c ? "ok" : j === k ? "bad" : "dim");
      });
      fb.hidden = false;
      fb.className = "fb" + (k === f.c ? " good" : "");
      put(fb, h("strong", {}, k === f.c ? "Richtig. " : "Nicht ganz. "), f.e || "");
      next.hidden = false;
    }
    function choose(k) {
      if (typeof answers[id] === "number") return;
      answers[id] = k; save(); publish(); show(k);
    }
    put(app,
      h("p", { class: "eyebrow" }, "Block " + b.nr + " · " + b.title),
      h("p", { class: "count" }, "Frage " + (i + 1) + " von " + b.fragen.length),
      h("h2", {}, f.q),
      h("div", { class: "popts" }, btns),
      fb,
      h("div", { class: "row", style: "margin-top:18px" }, next,
        h("button", { class: "btn ghost", onclick: function () { view = { name: "home" }; render(); } }, "Übersicht")));
    if (typeof given === "number") show(given);
  }

  function renderResult() {
    var b = view.block, p = progress(b);
    put(app, h("section", { class: "panel" },
      h("p", { class: "eyebrow" }, "Block " + b.nr + " · " + b.title),
      h("p", { class: "score" }, p.right + " von " + p.n),
      h("p", {}, p.right === p.n ? "Alles richtig." : "richtig beantwortet. Die Auflösung besprechen wir gleich gemeinsam."),
      h("div", { class: "row", style: "margin-top:18px" },
        h("button", { class: "btn", onclick: function () { view = { name: "home" }; render(); } }, "Zur Übersicht"),
        h("button", { class: "btn ghost", onclick: function () { view = { name: "block", block: b, i: 0 }; render(); } }, "Fragen ansehen"))));
  }

  render();
})();
