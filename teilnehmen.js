/* Seite für Teilnehmende: Code aus dem QR-Code lesen und warten.
   Sobald die Moderation eine Aufgabe freigibt, erscheint sie von selbst. Auswählen kann man nichts. */
(function () {
  "use strict";
  var h = Live.h, put = Live.put, shake = Live.shake, shuffle = Live.shuffle;
  var IDX = Live.index(window.BLOCKS);
  var app = document.getElementById("app");
  var sess = Live.parseCode(new URLSearchParams(location.search).get("c"));
  var NS = "http://www.w3.org/2000/svg";

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
  var KEY = "gynoplive2:" + sess.code;
  var saved = Live.store(KEY) || {};
  var pid = saved.pid || Live.rand(8);
  var answers = saved.a && typeof saved.a === "object" ? saved.a : {};
  var open = [];        // freigegebene Aufgaben in der Reihenfolge der Freigabe
  var online = false;
  var cur = null;       // Aufgabe, die gerade auf dem Bildschirm ist (auch während der Auflösung)

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
      if (cur === null) wait();
    },
    onMessage: function (sub, obj) {
      if (sub !== "state" || !Array.isArray(obj.open)) return;
      open = obj.open.filter(function (x) { return typeof x === "string" && IDX.byId[x]; });
      /* Nur wechseln, wenn gerade nichts läuft oder die laufende Aufgabe wieder gesperrt wurde. */
      if (cur === null || (open.indexOf(cur) < 0 && !(cur in answers))) advance();
    }
  });

  function advance() {
    var next = null;
    for (var i = 0; i < open.length; i++) if (!(open[i] in answers)) { next = open[i]; break; }
    cur = next;
    window.scrollTo(0, 0);
    if (next === null) return wait();
    var r = IDX.byId[next];
    TASK[r.item.typ](r, function (v) { answers[r.id] = v; save(); publish(); });
  }

  /* ----- gemeinsame Teile ----- */
  function eyebrow(r) { return h("p", { class: "eyebrow" }, "Block " + r.block.nr + " · " + Live.TYPNAME[r.item.typ]); }
  function weiter() { return h("div", { class: "row", style: "margin-top:18px" }, h("button", { class: "btn", id: "weiter", onclick: advance }, "Weiter")); }
  function fb(ok, lead, text) { return h("div", { class: "fb" + (ok ? " good" : ""), role: "status" }, h("strong", {}, lead + " "), text || ""); }
  var tries = function (n) { return n === 0 ? "ohne Fehlversuch" : n === 1 ? "mit 1 Fehlversuch" : "mit " + n + " Fehlversuchen"; };
  var sum = function (a) { return a.reduce(function (x, y) { return x + y; }, 0); };

  function wait() {
    var n = 0, ok = 0, id;
    for (id in answers) if (IDX.byId[id] && Live.valid(IDX.byId[id].item, answers[id])) { n++; if (Live.richtig(IDX.byId[id].item, answers[id])) ok++; }
    put(app, h("section", { class: "panel" },
      h("p", { class: "eyebrow" }, "Code " + sess.code),
      h("h2", {}, "Bitte warten"),
      h("p", { style: "margin:0" }, online ? "Die nächste Aufgabe erscheint hier von selbst, sobald sie freigegeben wird." : "Die Verbindung wird aufgebaut …"),
      n ? h("p", { class: "muted", style: "margin:14px 0 0" }, "Bisher " + n + (n === 1 ? " Aufgabe" : " Aufgaben") + ", davon " + ok + " fehlerfrei.") : null),
      h("p", { class: "muted", style: "font-size:.85rem;margin-top:18px" }, "Die Antworten sind anonym. Übertragen werden nur Zahlen, keine Namen."));
  }

  /* ----- Aufgabentypen ----- */
  var TASK = {};

  TASK.wahl = function (r, done) {
    var f = r.item;
    var box = h("div", {});
    var btns = f.o.map(function (text, k) {
      return h("button", { class: "popt", onclick: function () {
        btns.forEach(function (bt, j) { bt.disabled = true; bt.classList.add(j === f.c ? "ok" : j === k ? "bad" : "dim"); });
        done(k);
        put(box, fb(k === f.c, k === f.c ? "Richtig." : "Nicht ganz.", f.e), weiter());
      } }, h("span", { class: "k" }, "ABCD".charAt(k)), h("span", {}, text));
    });
    put(app, eyebrow(r), h("h2", {}, f.q), h("div", { class: "popts" }, btns), box);
  };

  TASK.reihe = function (r, done) {
    var it = r.item;
    var steps = it.schritte.map(function (s, i) { return { i: i, t: s[0], d: s[1] }; });
    var pos = 0, errs = steps.map(function () { return 0; }), pool;
    do { pool = shuffle(steps); } while (pool.every(function (s, k) { return s.i === k; }));
    function draw() {
      var fin = pos >= steps.length;
      var seq = h("ol", { class: "seq" }, steps.slice(0, pos).map(function (s) { return h("li", {}, h("div", {}, h("b", {}, s.t), fin && s.d ? h("span", {}, s.d) : null)); }),
        fin ? null : h("li", { class: "slot" }, h("div", {}, "Welcher Schritt kommt jetzt?")));
      var cards = h("div", { class: "cards" }, pool.filter(function (s) { return s.i >= pos; }).map(function (s) {
        var b = h("button", { class: "cardbtn", onclick: function () {
          if (s.i === pos) { pos++; if (pos >= steps.length) done(errs); draw(); }
          else { errs[pos]++; shake(b); }
        } }, h("b", {}, s.t), s.d ? h("span", {}, s.d) : null);
        return b;
      }));
      put(app, eyebrow(r), h("h2", {}, it.titel),
        fin ? null : h("p", { class: "muted", style: "margin:0 0 12px" }, "Tippen Sie die Karten in der Reihenfolge an, in der operiert wird."),
        seq,
        fin ? [fb(sum(errs) === 0, "Geschafft,", tries(sum(errs)) + "."), weiter()] : [h("p", { class: "coltitle" }, "Karten"), cards]);
    }
    draw();
  };

  TASK.paare = function (r, done) {
    var it = r.item;
    var pairs = it.paare.map(function (p, i) { return { i: i, l: p[0], r: p[1] }; });
    var order = shuffle(pairs), rights = shuffle(pairs), k = 0, errs = pairs.map(function () { return 0; });
    function draw() {
      if (k >= order.length) {
        put(app, eyebrow(r), h("h2", {}, it.titel),
          h("ul", { class: "pairs" }, pairs.map(function (p) { return h("li", {}, h("b", {}, p.l), h("span", {}, p.r)); })),
          fb(sum(errs) === 0, "Alle " + pairs.length + " zugeordnet,", tries(sum(errs)) + "."), weiter());
        return;
      }
      var now = order[k];
      var solved = order.slice(0, k).map(function (p) { return p.i; });
      var opts = rights.filter(function (p) { return solved.indexOf(p.i) < 0; }).map(function (p) {
        var b = h("button", { class: "popt one", onclick: function () {
          if (p.i === now.i) { k++; if (k >= order.length) done(errs); draw(); window.scrollTo(0, 0); }
          else { errs[now.i]++; shake(b); }
        } }, p.r);
        return b;
      });
      put(app, eyebrow(r), h("p", { class: "count" }, it.titel + " · " + (k + 1) + " von " + order.length),
        h("p", { class: "muted", style: "margin:.6em 0 0" }, it.frage),
        h("h2", { class: "term" }, now.l),
        h("div", { class: "popts" }, opts));
    }
    draw();
  };

  TASK.auswahl = function (r, done) {
    var it = r.item;
    var all = it.ja.map(function (t, i) { return { i: i, t: t, y: true }; })
      .concat(it.nein.map(function (t, i) { return { i: it.ja.length + i, t: t, y: false }; }));
    var shown = shuffle(all), chosen = [], checked = false;
    function draw() {
      var chips = shown.map(function (x) {
        var on = chosen.indexOf(x.i) >= 0, cls = "pchip";
        if (checked) cls += x.y ? (on ? " ok" : " miss") : (on ? " bad" : "");
        return h("button", { class: cls, "aria-pressed": String(on), disabled: checked, onclick: function () {
          if (on) chosen.splice(chosen.indexOf(x.i), 1); else chosen.push(x.i);
          draw();
        } }, x.t);
      });
      var hit = all.filter(function (x) { return x.y && chosen.indexOf(x.i) >= 0; }).length;
      var wrong = chosen.length - hit;
      put(app, eyebrow(r), h("h2", {}, it.titel), h("p", { style: "margin:0 0 14px" }, it.text),
        h("div", { class: "pchips" }, chips),
        checked ? [
          h("div", { class: "legend" }, h("span", {}, h("i", {}), "richtig gewählt"), h("span", {}, h("i", { class: "m" }), "hat gefehlt"), h("span", {}, h("i", { class: "b" }), "gehört nicht dazu")),
          fb(hit === it.ja.length && wrong === 0, hit + " von " + it.ja.length + " richtig" + (wrong ? ", " + wrong + " zu viel." : "."), it.e), weiter()
        ] : h("div", { class: "row", style: "margin-top:18px" },
          h("button", { class: "btn", id: "pruefen", disabled: chosen.length === 0, onclick: function () { checked = true; done(chosen.slice().sort(function (a, b) { return a - b; })); draw(); } }, "Prüfen"),
          h("span", { class: "muted" }, chosen.length + " gewählt")));
    }
    draw();
  };

  TASK.uhr = function (r, done) {
    var it = r.item, need = it.richtig.length, chosen = [], checked = false;
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 400 400");
    svg.setAttribute("class", "clock");
    svg.setAttribute("role", "group");
    svg.setAttribute("aria-label", "Portio mit Uhrzeiten von 1 bis 12");
    svg.innerHTML = '<circle class="portio" cx="200" cy="200" r="88"></circle><ellipse class="os" cx="200" cy="200" rx="24" ry="8"></ellipse><text class="svgnote" x="200" y="246">Portio</text>';
    var groups = {}, below = h("div", {});
    function paint() {
      for (var n = 1; n <= 12; n++) {
        var on = chosen.indexOf(n) >= 0, cls = "hr";
        if (checked) cls += it.richtig.indexOf(n) >= 0 ? " ok" : (on ? " bad" : "");
        else if (on) cls += " on";
        groups[n].setAttribute("class", cls);
      }
      if (checked) {
        var ok = Live.sameSet(chosen, it.richtig);
        put(below, fb(ok, ok ? "Richtig." : "Nicht ganz.", it.e), weiter());
      } else {
        put(below, h("div", { class: "row", style: "margin-top:10px" },
          h("button", { class: "btn", id: "pruefen", disabled: chosen.length !== need, onclick: function () { checked = true; done(chosen.slice().sort(function (a, b) { return a - b; })); paint(); } }, "Prüfen"),
          h("span", { class: "muted" }, need === 1 ? "Eine Position antippen." : chosen.length + " von " + need + " Positionen gewählt.")));
      }
    }
    function make(n) {
      var ang = (n * 30 - 90) * Math.PI / 180, x = 200 + 150 * Math.cos(ang), y = 200 + 150 * Math.sin(ang);
      var g = document.createElementNS(NS, "g");
      g.setAttribute("tabindex", "0"); g.setAttribute("role", "button"); g.setAttribute("aria-label", n + " Uhr");
      g.innerHTML = '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="31"></circle><text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '">' + n + '</text>';
      var hit = function () {
        if (checked) return;
        var i = chosen.indexOf(n);
        if (i >= 0) chosen.splice(i, 1);
        else { if (chosen.length >= need) chosen.shift(); chosen.push(n); }
        paint();
      };
      g.addEventListener("click", hit);
      g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); hit(); } });
      groups[n] = g; svg.appendChild(g);
    }
    for (var n = 1; n <= 12; n++) make(n);
    put(app, eyebrow(r), h("h2", {}, it.q), h("p", { class: "muted", style: "margin:0" }, "Blick auf die Portio wie in Steinschnittlage."), svg, below);
    paint();
  };

  TASK.anatomie = function (r, done) {
    var ANA = Live.ANA, order = shuffle(ANA.map(function (_, i) { return i; })), k = 0, solved = false, msg = null;
    var first = ANA.map(function () { return -1; });
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", Live.ANA_VIEWBOX);
    svg.setAttribute("class", "ana");
    svg.setAttribute("role", "group");
    svg.setAttribute("aria-label", "Schematische Zeichnung des inneren Genitales von vorne");
    svg.innerHTML = Live.ANA_SVG;
    var top = h("div", {}), below = h("div", {});
    function draw() {
      if (k >= order.length) {
        var wrong = first.filter(function (x, i) { return x !== i; }).length;
        put(top, h("h2", {}, "Wo liegt was?"));
        put(below, fb(wrong === 0, "Alle " + ANA.length + " Strukturen gefunden,", (ANA.length - wrong) + " davon beim ersten Versuch."), weiter());
        return;
      }
      var a = ANA[order[k]];
      put(top, h("p", { class: "count" }, "Struktur " + (k + 1) + " von " + order.length), h("h2", {}, "Tippen Sie auf " + a.art + "."));
      put(below,
        solved ? h("div", { class: "info" }, h("h3", {}, a.name),
          a.note ? h("p", { style: "margin:0" }, a.note) : h("dl", {},
            h("div", {}, h("dt", {}, "Typische Erkrankungen"), h("dd", {}, a.ill)),
            h("div", {}, h("dt", {}, "Eingriff"), h("dd", {}, a.op)))) : (msg ? h("div", { class: "fb", role: "status" }, msg) : null),
        solved ? h("div", { class: "row", style: "margin-top:14px" }, h("button", { class: "btn", id: "next-struct", onclick: function () {
          k++; solved = false; msg = null;
          if (k >= order.length) done(first);
          draw(); window.scrollTo(0, 0);
        } }, k === order.length - 1 ? "Fertig" : "Nächste Struktur")) : null);
    }
    Array.prototype.forEach.call(svg.querySelectorAll(".reg"), function (g) {
      var idx = -1;
      ANA.forEach(function (a, i) { if (a.key === g.getAttribute("data-id")) idx = i; });
      g.setAttribute("tabindex", "0"); g.setAttribute("role", "button"); g.setAttribute("aria-label", "Struktur in der Zeichnung");
      var hit = function () {
        if (k >= order.length || solved) return;
        var want = order[k];
        if (first[want] < 0) first[want] = idx;
        if (idx === want) { g.classList.add("found"); solved = true; msg = null; }
        else {
          if (!g.classList.contains("found")) { g.classList.add("wrong"); setTimeout(function () { g.classList.remove("wrong"); }, 900); }
          msg = "Das ist " + ANA[idx].art + ". Versuchen Sie es noch einmal.";
        }
        draw();
      };
      g.addEventListener("click", hit);
      g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); hit(); } });
    });
    put(app, eyebrow(r), top, svg, below);
    draw();
  };

  wait();
})();
