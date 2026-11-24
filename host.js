/* Seite für die Moderation: QR-Code zeigen, Blöcke freigeben, Antworten live auswerten. */
(function () {
  "use strict";
  var h = Live.h, put = Live.put, BLOCKS = window.BLOCKS;
  var HKEY = "gynoplive-host";
  var $ = function (id) { return document.getElementById(id); };
  var stage = $("stage"), rail = $("rail"), join = $("join");

  var S = null;              // { room, bi, open:[blocknr] }
  var link = null;
  var online = false;
  var parts = new Map();     // Geräte-ID -> { "03.2": 1, ... }
  var sel = 0, qi = 0;       // gewählter Block, gewählte Frage
  var reveal = new Set();    // Fragen, deren Lösung gerade gezeigt wird
  var joinOpen = false;

  /* gültige Fragen-Kennungen, damit fremde Daten nichts durcheinanderbringen */
  var VALID = {};
  BLOCKS.forEach(function (b) { b.fragen.forEach(function (f, i) { VALID[Live.qid(b, i)] = f.o.length; }); });

  /* ----- Sitzung ----- */
  function code() { return Live.makeCode(S.bi, S.room); }
  function joinUrl() { return new URL("./", location.href).href + "?c=" + code(); }
  function saveS() { Live.store(HKEY, S); }
  function sendState() { if (link) link.send("state", { open: S.open }); }

  function connect() {
    link = Live.open(S.room, S.bi, {
      subs: ["p/+"],
      onStatus: function (ok) {
        online = ok;
        $("dot").className = "dot" + (ok ? " on" : "");
        $("conntext").textContent = ok ? "verbunden" : "keine Verbindung";
        if (ok) sendState();
      },
      onMessage: function (sub, obj) {
        if (sub.indexOf("p/") !== 0 || !obj.a || typeof obj.a !== "object") return;
        var clean = {}, k;
        for (k in obj.a) if (VALID[k] && Number.isInteger(obj.a[k]) && obj.a[k] >= 0 && obj.a[k] < VALID[k]) clean[k] = obj.a[k];
        parts.set(sub.slice(2, 40), clean);
        schedule();
      }
    });
  }

  function newSession() {
    if (link) { link.send("state", { open: [] }); var old = link; setTimeout(function () { old.close(); }, 600); link = null; }
    parts = new Map(); reveal = new Set(); sel = 0; qi = 0; S = null; online = false;
    Live.store(HKEY, null);
    $("dot").className = "dot"; $("conntext").textContent = "verbinde …";
    put(stage, h("section", { class: "panel" }, h("p", { class: "eyebrow" }, "Einen Moment"), h("h2", { class: "hq" }, "Die Verbindung wird aufgebaut …")));
    put(rail);
    Live.pickBroker(8000).then(function (bi) {
      S = { room: Live.rand(5), bi: bi, open: [] };
      saveS(); connect(); joinOpen = true; render();
    }).catch(function () {
      put(stage, h("section", { class: "panel" },
        h("p", { class: "eyebrow" }, "Keine Verbindung"),
        h("h2", { class: "hq" }, "Der Live-Dienst ist von diesem Netz aus nicht erreichbar."),
        h("p", { class: "muted" }, "Prüfen Sie die Internetverbindung oder wechseln Sie das Netz, zum Beispiel auf einen Handy-Hotspot. Manche Kliniknetze sperren die nötigen Verbindungen."),
        h("div", { class: "row", style: "margin-top:18px" }, h("button", { class: "btn", onclick: newSession }, "Noch einmal versuchen"))));
    });
  }

  /* ----- Auswertung ----- */
  function statsFor(b) {
    var n = b.fragen.length, total = parts.size, finished = 0, given = 0, right = 0;
    var per = b.fragen.map(function (f) { return { counts: f.o.map(function () { return 0; }), n: 0, right: 0 }; });
    parts.forEach(function (a) {
      var done = 0;
      b.fragen.forEach(function (f, i) {
        var v = a[Live.qid(b, i)];
        if (typeof v !== "number") return;
        done++; per[i].n++; per[i].counts[v]++; given++;
        if (v === f.c) { per[i].right++; right++; }
      });
      if (done === n) finished++;
    });
    return { total: total, finished: finished, given: given, right: right, per: per };
  }
  var pct = function (a, b) { return b ? Math.round(100 * a / b) + " %" : "–"; };

  /* ----- Darstellung ----- */
  var timer = null;
  function schedule() { if (!timer) timer = setTimeout(function () { timer = null; render(); }, 350); }

  function toggleOpen(b) {
    var i = S.open.indexOf(b.nr);
    if (i >= 0) S.open.splice(i, 1); else S.open.push(b.nr);
    saveS(); sendState(); render();
  }

  function render() {
    if (!S) return;
    $("count").textContent = parts.size;
    renderRail(); renderStage(); renderJoin();
  }

  function renderRail() {
    put(rail, BLOCKS.map(function (b, bi) {
      var isOpen = S.open.indexOf(b.nr) >= 0, st = statsFor(b);
      return h("li", {}, h("button", { class: "blk", "aria-current": String(bi === sel), onclick: function () { sel = bi; qi = 0; render(); } },
        h("span", { class: "nr" }, b.nr), h("span", {}, b.title),
        h("span", { class: "meta" },
          h("span", { class: "chip" + (isOpen ? " open" : "") }, isOpen ? "freigegeben" : "gesperrt"),
          st.given ? st.finished + " fertig · " + pct(st.right, st.given) + " richtig" : null)));
    }));
  }

  function renderStage() {
    var b = BLOCKS[sel], isOpen = S.open.indexOf(b.nr) >= 0, st = statsFor(b);
    var head = h("div", { class: "bhead" },
      h("div", {}, h("p", { class: "eyebrow" }, "Block " + b.nr + " · " + b.fragen.length + " Fragen"), h("h2", {}, b.title)),
      isOpen ? h("div", { class: "row" }, h("span", { class: "chip open" }, "freigegeben"),
          h("button", { class: "btn ghost", id: "btn-lock", onclick: function () { toggleOpen(b); } }, "Wieder sperren"))
        : (st.given ? h("button", { class: "btn", id: "btn-release", onclick: function () { toggleOpen(b); } }, "Wieder freigeben") : null));

    if (!isOpen && !st.given) {
      put(stage, h("section", { class: "panel" }, head,
        h("div", { class: "locked" },
          h("p", {}, "Dieser Block ist noch gesperrt. Mit der Freigabe erscheinen die " + b.fragen.length + " Fragen auf den Handys."),
          h("button", { class: "btn big", id: "btn-release", onclick: function () { toggleOpen(b); } }, "Block " + b.nr + " freigeben"))));
      return;
    }

    if (qi >= b.fragen.length) qi = 0;
    var f = b.fragen[qi], id = Live.qid(b, qi), p = st.per[qi], shown = reveal.has(id);
    var strip = h("div", { class: "strip", role: "tablist", "aria-label": "Fragen" }, b.fragen.map(function (_, i) {
      return h("button", { class: "qtab", role: "tab", "aria-selected": String(i === qi), onclick: function () { qi = i; render(); } },
        h("b", {}, "Frage " + (i + 1)), h("span", {}, pct(st.per[i].right, st.per[i].n) + " richtig"));
    }));
    var bars = h("div", { class: "bars" }, f.o.map(function (text, k) {
      var c = p.counts[k];
      return h("div", { class: "bar" + (shown && k === f.c ? " right" : "") },
        h("span", { class: "k" }, "ABCD".charAt(k)),
        h("span", { class: "body" }, h("span", { class: "fill", style: "width:" + (p.n ? 100 * c / p.n : 0) + "%" }), h("span", { class: "txt" }, text)),
        h("span", { class: "n" }, h("b", {}, c), " · " + pct(c, p.n)));
    }));
    put(stage, h("section", { class: "panel" }, head,
      h("div", { class: "kpis" },
        h("div", { class: "kpi" }, h("b", {}, st.total), h("span", {}, "Geräte dabei")),
        h("div", { class: "kpi" }, h("b", {}, st.finished), h("span", {}, "mit dem Block fertig")),
        h("div", { class: "kpi" }, h("b", {}, pct(st.right, st.given)), h("span", {}, "richtige Antworten im Block"))),
      strip,
      h("p", { class: "muted", style: "margin:0;font-variant-numeric:tabular-nums" }, "Frage " + (qi + 1) + " von " + b.fragen.length + " · " + p.n + (p.n === 1 ? " Antwort" : " Antworten")),
      h("h3", { class: "hq" }, f.q),
      bars,
      shown ? h("div", { class: "fb good", role: "status", style: "font-size:clamp(1rem,1.4vw,1.3rem)" }, h("strong", {}, "Richtig ist " + "ABCD".charAt(f.c) + ". "), f.e || "") : null,
      h("div", { class: "row", style: "margin-top:20px" },
        h("button", { class: "btn", id: "btn-reveal", onclick: toggleReveal }, shown ? "Lösung verbergen" : "Lösung zeigen"),
        h("button", { class: "btn ghost", id: "btn-prev", disabled: qi === 0, onclick: function () { stepQ(-1); } }, "← Frage"),
        h("button", { class: "btn ghost", id: "btn-next", disabled: qi === b.fragen.length - 1, onclick: function () { stepQ(1); } }, "Frage →"))));
  }

  function toggleReveal() {
    var id = Live.qid(BLOCKS[sel], qi);
    if (reveal.has(id)) reveal.delete(id); else reveal.add(id);
    render();
  }
  function stepQ(d) {
    var n = BLOCKS[sel].fragen.length;
    if (qi + d >= 0 && qi + d < n) { qi += d; render(); }
  }

  var qrFor = "";
  function renderJoin() {
    join.hidden = !joinOpen;
    if (!joinOpen) return;
    var url = joinUrl();
    if (qrFor !== url) {
      qrFor = url;
      var qr = qrcode(0, "M");
      qr.addData(url); qr.make();
      var box = h("div", { class: "qr", role: "img", "aria-label": "QR-Code zum Mitmachen" });
      box.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 8, scalable: true });
      var base = new URL("./", location.href);
      put(join, h("div", { class: "joinbox" }, box,
        h("div", {},
          h("p", { class: "eyebrow" }, "Mitmachen mit dem Handy"),
          h("h2", {}, "QR-Code scannen"),
          h("ol", { class: "steps" },
            h("li", {}, "Kamera auf den QR-Code richten und den Link öffnen."),
            h("li", {}, "Warten, bis die Fragen freigegeben werden."),
            h("li", {}, "Antworten. Alles ist anonym.")),
          h("p", { class: "muted", style: "margin:0" }, "Ohne Kamera: diese Adresse öffnen und den Code eingeben."),
          h("p", { class: "url" }, base.host + base.pathname),
          h("p", { class: "bigcode", style: "margin:0 0 .3em" }, code()),
          h("p", { style: "font-size:clamp(1.1rem,1.8vw,1.6rem)" }, h("b", { id: "join-count" }, String(parts.size)), " dabei"),
          h("button", { class: "btn big", id: "btn-join-close", onclick: function () { joinOpen = false; render(); } }, "Zur Moderation"))));
    } else {
      var jc = $("join-count");
      if (jc) jc.textContent = String(parts.size);
    }
  }

  /* ----- Bedienung ----- */
  $("btn-qr").addEventListener("click", function () { if (S) { joinOpen = !joinOpen; render(); } });
  $("btn-full").addEventListener("click", function () {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else { var p = document.documentElement.requestFullscreen(); if (p && p.catch) p.catch(function () {}); }
    } catch (e) {}
  });
  var armed = null;
  $("btn-new").addEventListener("click", function () {
    var btn = $("btn-new");
    if (armed) { clearTimeout(armed); armed = null; btn.textContent = "Neue Sitzung"; qrFor = ""; newSession(); return; }
    btn.textContent = "Sicher? Alle Antworten gehen verloren";
    armed = setTimeout(function () { armed = null; btn.textContent = "Neue Sitzung"; }, 4000);
  });
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey || !S) return;
    if (e.key === "Escape" && joinOpen) { joinOpen = false; render(); return; }
    if (joinOpen) return;
    if (e.key === "ArrowRight") { stepQ(1); e.preventDefault(); }
    else if (e.key === "ArrowLeft") { stepQ(-1); e.preventDefault(); }
    else if (e.key === "l" || e.key === "L") { if ($("btn-reveal")) toggleReveal(); }
  });

  /* ----- Start ----- */
  S = Live.store(HKEY);
  if (S && typeof S.room === "string" && Live.BROKERS[S.bi] && Array.isArray(S.open)) { connect(); render(); }
  else newSession();
})();
