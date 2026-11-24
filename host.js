/* Seite für die Moderation: QR-Code zeigen, Aufgaben einzeln freigeben, Antworten live auswerten. */
(function () {
  "use strict";
  var h = Live.h, put = Live.put, BLOCKS = window.BLOCKS, IDX = Live.index(BLOCKS);
  var HKEY = "gynoplive-host2";
  var NS = "http://www.w3.org/2000/svg";
  var $ = function (id) { return document.getElementById(id); };
  var stage = $("stage"), rail = $("rail"), join = $("join");

  var S = null;              // { room, bi, open:[Aufgaben-Kennungen in der Reihenfolge der Freigabe] }
  var link = null;
  var parts = new Map();     // Geräte-ID -> { "03.2": Antwort, ... }
  var sel = 0, ti = 0;       // gewählter Block, gewählte Aufgabe
  var reveal = new Set();    // Aufgaben, deren Lösung gerade gezeigt wird
  var joinOpen = false;

  /* ----- Sitzung ----- */
  function code() { return Live.makeCode(S.bi, S.room); }
  function joinUrl() { return new URL("./", location.href).href + "?c=" + code(); }
  function saveS() { Live.store(HKEY, S); }
  function sendState() { if (link) link.send("state", { open: S.open }); }
  function isOpen(id) { return S.open.indexOf(id) >= 0; }
  function rec(bi, i) { var b = BLOCKS[bi]; return IDX.byId[b.nr + "." + (i + 1)]; }

  function connect() {
    link = Live.open(S.room, S.bi, {
      subs: ["p/+"],
      onStatus: function (ok) {
        $("dot").className = "dot" + (ok ? " on" : "");
        $("conntext").textContent = ok ? "verbunden" : "keine Verbindung";
        if (ok) sendState();
      },
      onMessage: function (sub, obj) {
        if (sub.indexOf("p/") !== 0 || !obj.a || typeof obj.a !== "object") return;
        var clean = {}, k;
        for (k in obj.a) if (IDX.byId[k] && Live.valid(IDX.byId[k].item, obj.a[k])) clean[k] = obj.a[k];
        parts.set(sub.slice(2, 40), clean);
        schedule();
      }
    });
  }

  function newSession() {
    if (link) { link.send("state", { open: [] }); var old = link; setTimeout(function () { old.close(); }, 600); link = null; }
    parts = new Map(); reveal = new Set(); sel = 0; ti = 0; S = null;
    Live.store(HKEY, null);
    $("dot").className = "dot"; $("conntext").textContent = "verbinde …"; $("count").textContent = "0";
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

  /* ----- Freigabe ----- */
  function release(id) { if (!isOpen(id)) { S.open.push(id); saveS(); sendState(); } }
  function lock(id) { var i = S.open.indexOf(id); if (i >= 0) { S.open.splice(i, 1); saveS(); sendState(); } }
  function releaseNext() {
    var b = BLOCKS[sel];
    if (ti + 1 < b.aufgaben.length) { ti++; release(rec(sel, ti).id); render(); }
  }
  function releaseBlock() {
    var b = BLOCKS[sel], changed = false;
    b.aufgaben.forEach(function (_, i) { var id = rec(sel, i).id; if (!isOpen(id)) { S.open.push(id); changed = true; } });
    if (changed) { saveS(); sendState(); }
    render();
  }

  /* ----- Auswertung ----- */
  function stats(r) {
    var vals = [];
    parts.forEach(function (a) { if (a[r.id] !== undefined) vals.push(a[r.id]); });
    return { vals: vals, n: vals.length, right: vals.filter(function (v) { return Live.richtig(r.item, v); }).length };
  }
  var pct = function (a, b) { return b ? Math.round(100 * a / b) + " %" : "–"; };
  var word = function (item) { return item.typ === "wahl" || item.typ === "uhr" || item.typ === "auswahl" ? "richtig" : "fehlerfrei"; };

  function bar(k, text, frac, ntext, cls) {
    return h("div", { class: "bar" + (cls ? " " + cls : "") },
      h("span", { class: "k" }, k),
      h("span", { class: "body" }, h("span", { class: "fill", style: "width:" + Math.round(100 * (frac || 0)) + "%" }), h("span", { class: "txt" }, text)),
      h("span", { class: "n" }, ntext));
  }
  function nOf(c, n) { return [h("b", {}, c), " · " + pct(c, n)]; }

  var BODY = {};
  BODY.wahl = function (it, st, shown) {
    var counts = it.o.map(function () { return 0; });
    st.vals.forEach(function (v) { counts[v]++; });
    return h("div", { class: "bars" }, it.o.map(function (text, k) {
      return bar("ABCD".charAt(k), text, st.n ? counts[k] / st.n : 0, nOf(counts[k], st.n), shown && k === it.c ? "right" : "");
    }));
  };
  function errBars(labels, st, hint) {
    var counts = labels.map(function () { return 0; });
    st.vals.forEach(function (v) { v.forEach(function (e, i) { if (e > 0) counts[i]++; }); });
    return [h("p", { class: "muted", style: "margin:0 0 10px" }, hint),
      h("div", { class: "bars" }, labels.map(function (text, i) { return bar(String(i + 1), text, st.n ? counts[i] / st.n : 0, nOf(counts[i], st.n), counts[i] ? "err" : ""); }))];
  }
  BODY.reihe = function (it, st, shown) {
    return errBars(it.schritte.map(function (s, i) { return shown ? s[0] + (s[1] ? " · " + s[1] : "") : "Schritt " + (i + 1); }), st,
      "Wie viele haben sich an welchem Schritt vertippt?" + (shown ? "" : " Die Schritte erscheinen mit der Lösung."));
  };
  BODY.paare = function (it, st, shown) {
    return errBars(it.paare.map(function (p) { return shown ? p[0] + " → " + p[1] : p[0]; }), st, "Wie viele haben sich bei welchem Begriff vertippt?");
  };
  BODY.auswahl = function (it, st, shown) {
    var all = it.ja.map(function (t, i) { return { i: i, t: t, y: true }; }).concat(it.nein.map(function (t, i) { return { i: it.ja.length + i, t: t, y: false }; }));
    var counts = all.map(function () { return 0; });
    st.vals.forEach(function (v) { v.forEach(function (i) { counts[i]++; }); });
    all.sort(function (a, b) { return a.t.localeCompare(b.t, "de"); });
    return [h("p", { style: "margin:0 0 12px;font-size:clamp(1rem,1.4vw,1.3rem)" }, it.text),
      h("p", { class: "muted", style: "margin:0 0 10px" }, "Wie viele haben was auf den Tisch gelegt?"),
      h("div", { class: "bars two" }, all.map(function (x) {
        return bar(shown ? (x.y ? "✓" : "✗") : "", x.t, st.n ? counts[x.i] / st.n : 0, nOf(counts[x.i], st.n), shown ? (x.y ? "right" : "wrongitem") : "");
      }))];
  };
  BODY.uhr = function (it, st, shown) {
    var counts = []; for (var n = 0; n <= 12; n++) counts.push(0);
    st.vals.forEach(function (v) { v.forEach(function (x) { counts[x]++; }); });
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 460 460"); svg.setAttribute("class", "clock big"); svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Verteilung der Antworten auf die Uhrzeiten");
    var s = '<circle class="portio" cx="230" cy="230" r="84"></circle><ellipse class="os" cx="230" cy="230" rx="24" ry="8"></ellipse><text class="svgnote" x="230" y="276">Portio</text>';
    for (var k = 1; k <= 12; k++) {
      var ang = (k * 30 - 90) * Math.PI / 180, c = Math.cos(ang), si = Math.sin(ang);
      var cls = "hc" + (shown && it.richtig.indexOf(k) >= 0 ? " ok" : "") + (counts[k] ? " has" : "");
      s += '<g class="' + cls + '"><circle cx="' + (230 + 142 * c).toFixed(1) + '" cy="' + (230 + 142 * si).toFixed(1) + '" r="' + (20 + (st.n ? 14 * counts[k] / st.n : 0)).toFixed(1) + '"></circle>' +
        '<text class="cnt" x="' + (230 + 142 * c).toFixed(1) + '" y="' + (230 + 142 * si).toFixed(1) + '">' + counts[k] + '</text>' +
        '<text class="lab" x="' + (230 + 205 * c).toFixed(1) + '" y="' + (230 + 205 * si).toFixed(1) + '">' + k + '</text></g>';
    }
    svg.innerHTML = s;
    return [h("p", { class: "muted", style: "margin:0" }, "In den Kreisen: wie oft die Uhrzeit gewählt wurde."), svg];
  };
  BODY.anatomie = function (it, st) {
    var ANA = Live.ANA, ok = ANA.map(function () { return 0; });
    st.vals.forEach(function (v) { v.forEach(function (x, i) { if (x === i) ok[i]++; }); });
    return [h("p", { class: "muted", style: "margin:0 0 10px" }, "Wie viele haben die Struktur beim ersten Versuch gefunden?"),
      h("div", { class: "bars" }, ANA.map(function (a, i) { return bar(String(i + 1), a.name, st.n ? ok[i] / st.n : 0, nOf(ok[i], st.n), "good"); }))];
  };
  function solution(it) {
    switch (it.typ) {
      case "wahl": return [h("strong", {}, "Richtig ist " + "ABCD".charAt(it.c) + ". "), it.e || ""];
      case "uhr": return [h("strong", {}, "Richtig: " + it.richtig.map(function (x) { return x + " Uhr"; }).join(" und ") + ". "), it.e || ""];
      case "auswahl": return [h("strong", {}, "Auf den Tisch gehören die markierten Einträge. "), it.e || ""];
      case "reihe": return [h("strong", {}, "Die Schritte stehen jetzt in der richtigen Reihenfolge.")];
      case "paare": return [h("strong", {}, "Die Zuordnung steht jetzt neben jedem Begriff.")];
    }
    return null;
  }

  /* ----- Darstellung ----- */
  var timer = null;
  function schedule() { if (!timer) timer = setTimeout(function () { timer = null; render(); }, 350); }

  function render() {
    if (!S) return;
    $("count").textContent = parts.size;
    renderRail(); renderStage(); renderJoin();
  }

  function renderRail() {
    put(rail, BLOCKS.map(function (b, bi) {
      var n = b.aufgaben.length, o = 0;
      b.aufgaben.forEach(function (_, i) { if (isOpen(rec(bi, i).id)) o++; });
      return h("li", {}, h("button", { class: "blk", "aria-current": String(bi === sel), onclick: function () { sel = bi; ti = 0; render(); } },
        h("span", { class: "nr" }, b.nr), h("span", {}, b.title),
        h("span", { class: "meta" }, h("span", { class: "chip" + (o === n ? " done" : o ? " open" : "") }, o + " von " + n + " freigegeben"))));
    }));
  }

  function renderStage() {
    var b = BLOCKS[sel];
    if (ti >= b.aufgaben.length) ti = 0;
    var r = rec(sel, ti), it = r.item, openNow = isOpen(r.id), st = stats(r), shown = reveal.has(r.id);
    var allOpen = b.aufgaben.every(function (_, i) { return isOpen(rec(sel, i).id); });
    var last = ti === b.aufgaben.length - 1;
    var sol = shown ? solution(it) : null;

    var strip = h("div", { class: "strip", role: "tablist", "aria-label": "Aufgaben" }, b.aufgaben.map(function (a, i) {
      var ri = rec(sel, i), si = stats(ri), o = isOpen(ri.id);
      return h("button", { class: "qtab" + (o ? " isopen" : ""), role: "tab", "aria-selected": String(i === ti), onclick: function () { ti = i; render(); } },
        h("b", {}, (i + 1) + " " + Live.TYPNAME[a.typ]),
        h("span", {}, o || si.n ? (si.n ? pct(si.right, si.n) + " " + word(a) : "freigegeben") : "gesperrt"));
    }));

    put(stage, h("section", { class: "panel" },
      h("div", { class: "bhead" },
        h("div", {}, h("p", { class: "eyebrow" }, "Block " + b.nr + " · " + b.aufgaben.length + " Aufgaben"), h("h2", {}, b.title)),
        allOpen ? null : h("button", { class: "btn ghost", id: "btn-block", onclick: releaseBlock }, "Ganzen Block freigeben")),
      strip,
      h("div", { class: "bhead", style: "margin-bottom:0" },
        h("p", { class: "muted", style: "margin:0;font-variant-numeric:tabular-nums" },
          "Aufgabe " + (ti + 1) + " von " + b.aufgaben.length + " · " + Live.TYPNAME[it.typ] + " · " + st.n + " von " + parts.size + " Geräten" + (st.n ? " · " + pct(st.right, st.n) + " " + word(it) : "")),
        h("span", { class: "chip" + (openNow ? " open" : "") }, openNow ? "freigegeben" : "gesperrt")),
      h("h3", { class: "hq" }, Live.titel(it)),
      BODY[it.typ](it, st, shown),
      sol ? h("div", { class: "fb good", role: "status", style: "font-size:clamp(1rem,1.4vw,1.3rem)" }, sol) : null,
      h("div", { class: "row", style: "margin-top:22px" },
        openNow ? null : h("button", { class: "btn big", id: "btn-release", onclick: function () { release(r.id); render(); } }, "Freigeben"),
        openNow && !last ? h("button", { class: "btn", id: "btn-next-release", onclick: releaseNext }, "Nächste Aufgabe freigeben →") : null,
        it.typ === "anatomie" ? null : h("button", { class: "btn" + (openNow && !last ? " ghost" : openNow ? "" : " ghost"), id: "btn-reveal", onclick: toggleReveal }, shown ? "Lösung verbergen" : "Lösung zeigen"),
        openNow ? h("button", { class: "btn ghost", id: "btn-lock", onclick: function () { lock(r.id); render(); } }, "Wieder sperren") : null)));
  }

  function toggleReveal() {
    var id = rec(sel, ti).id;
    if (reveal.has(id)) reveal.delete(id); else reveal.add(id);
    render();
  }
  function stepT(d) {
    var n = BLOCKS[sel].aufgaben.length;
    if (ti + d >= 0 && ti + d < n) { ti += d; render(); }
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
            h("li", {}, "Handy offen lassen. Die Aufgaben erscheinen von selbst."),
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
    var k = e.key.toLowerCase();
    if (e.key === "ArrowRight") { stepT(1); e.preventDefault(); }
    else if (e.key === "ArrowLeft") { stepT(-1); e.preventDefault(); }
    else if (k === "l") { if ($("btn-reveal")) toggleReveal(); }
    else if (k === "f") { release(rec(sel, ti).id); render(); }
    else if (k === "n") { if (isOpen(rec(sel, ti).id)) releaseNext(); }
  });

  /* ----- Start ----- */
  S = Live.store(HKEY);
  if (S && typeof S.room === "string" && Live.BROKERS[S.bi] && Array.isArray(S.open)) {
    S.open = S.open.filter(function (x) { return IDX.byId[x]; });
    connect(); render();
  } else newSession();
})();
