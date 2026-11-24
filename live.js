/*
  Gemeinsame Bausteine für beide Seiten (Teilnehmende und Moderation).

  Verbindung: Die Seiten sind statisch (GitHub Pages) und haben keinen eigenen Server.
  Die Live-Daten laufen über einen öffentlichen MQTT-Broker per WebSocket:
    <PREFIX><raum>/state    von der Moderation: welche Aufgaben freigegeben sind, in der Reihenfolge der Freigabe
    <PREFIX><raum>/p/<id>   von jedem Gerät: die bisher abgegebenen Antworten (nur Zahlen)
  Beide Nachrichten sind "retained": Wer neu lädt oder später dazukommt, bekommt den Stand sofort.
  Über den Broker gehen keine Namen und keine Aufgabentexte, nur Aufgabennummer und Zahlen.
*/
(function () {
  "use strict";

  var BROKERS = [
    "wss://broker.hivemq.com:8884/mqtt",
    "wss://test.mosquitto.org:8081/mqtt"
  ];
  var PREFIX = "q7lv2/";
  var ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  function rand(n) {
    var a = new Uint8Array(n), s = "";
    crypto.getRandomValues(a);
    for (var i = 0; i < n; i++) s += ALPHABET[a[i] % ALPHABET.length];
    return s;
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i];
      a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* Der Code, den Teilnehmende sehen: erste Stelle = Broker (1, 2, …), danach der Raum. */
  function makeCode(bi, room) { return String(bi + 1) + room; }
  function parseCode(raw) {
    var c = String(raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    var bi = parseInt(c.charAt(0), 10) - 1;
    var room = c.slice(1);
    if (!(bi >= 0 && bi < BROKERS.length) || room.length < 4 || room.length > 10) return null;
    return { bi: bi, room: room, code: makeCode(bi, room) };
  }

  /* Verbindung öffnen. opt: { subs:[...], onStatus(bool), onMessage(sub, obj) } */
  function open(room, bi, opt) {
    var base = PREFIX + room + "/";
    var client = mqtt.connect(BROKERS[bi], {
      clientId: "c" + rand(10), clean: true, keepalive: 30,
      reconnectPeriod: 2500, connectTimeout: 9000
    });
    client.on("connect", function () {
      (opt.subs || []).forEach(function (s) { client.subscribe(base + s, { qos: 1 }); });
      if (opt.onStatus) opt.onStatus(true);
    });
    client.on("close", function () { if (opt.onStatus) opt.onStatus(false); });
    client.on("error", function () {});
    client.on("message", function (topic, payload) {
      if (topic.indexOf(base) !== 0) return;
      var obj;
      try { obj = JSON.parse(new TextDecoder().decode(payload)); } catch (e) { return; }
      if (obj && typeof obj === "object" && opt.onMessage) opt.onMessage(topic.slice(base.length), obj);
    });
    return {
      send: function (sub, obj) { client.publish(base + sub, JSON.stringify(obj), { qos: 1, retain: true }); },
      close: function () { try { client.end(true); } catch (e) {} }
    };
  }

  /* Für die Moderation: den ersten Broker nehmen, der antwortet. */
  function pickBroker(timeoutMs) {
    return new Promise(function (resolve, reject) {
      var done = false, clients = [];
      function finish(i) {
        if (done) return;
        done = true;
        clients.forEach(function (c) { try { c.end(true); } catch (e) {} });
        if (i < 0) reject(new Error("kein Broker erreichbar")); else resolve(i);
      }
      BROKERS.forEach(function (url, i) {
        var c = mqtt.connect(url, { clientId: "t" + rand(10), reconnectPeriod: 0, connectTimeout: timeoutMs });
        clients.push(c);
        c.on("connect", function () { finish(i); });
        c.on("error", function () {});
      });
      setTimeout(function () { finish(-1); }, timeoutMs + 500);
    });
  }

  /* Kleine DOM-Helfer */
  function addKids(el, list) {
    list.forEach(function (c) {
      if (c == null || c === false) return;
      if (Array.isArray(c)) return addKids(el, c);
      el.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
    });
  }
  function h(tag, attrs) {
    var e = document.createElement(tag), k;
    for (k in (attrs || {})) {
      var v = attrs[k];
      if (v === false || v == null) continue;
      if (k === "class") e.className = v;
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? "" : v);
    }
    addKids(e, Array.prototype.slice.call(arguments, 2));
    return e;
  }
  function put(el) {
    el.textContent = "";
    addKids(el, Array.prototype.slice.call(arguments, 1));
  }
  function shake(el) { el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake"); }

  function store(key, val) {
    try {
      if (val === undefined) return JSON.parse(localStorage.getItem(key) || "null");
      if (val === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
    return null;
  }

  /* ---------- Aufgaben ---------- */
  var TYPNAME = { wahl: "Frage", reihe: "Reihenfolge", paare: "Zuordnen", auswahl: "Auswählen", uhr: "Uhr", anatomie: "Anatomie" };

  /* Jede Aufgabe bekommt eine feste Kennung: Blocknummer.Position, z. B. "03.2" */
  function index(blocks) {
    var byId = {}, list = [];
    blocks.forEach(function (b, bi) {
      b.aufgaben.forEach(function (item, i) {
        var r = { id: b.nr + "." + (i + 1), block: b, bi: bi, i: i, item: item };
        byId[r.id] = r; list.push(r);
      });
    });
    return { byId: byId, list: list };
  }
  function titel(item) { return item.q || item.titel; }

  function ints(v, len, min, max) {
    if (!Array.isArray(v) || (len != null && v.length !== len)) return false;
    return v.every(function (x) { return Number.isInteger(x) && x >= min && x <= max; });
  }
  function distinct(v) { return v.every(function (x, i) { return v.indexOf(x) === i; }); }
  function sameSet(a, b) { return a.length === b.length && a.every(function (x) { return b.indexOf(x) >= 0; }); }

  /* Was ein Gerät pro Aufgabe schickt:
     wahl      gewählte Position
     reihe     Fehlversuche je Schritt
     paare     Fehlversuche je Paar
     auswahl   gewählte Einträge (Position in ja + nein)
     uhr       gewählte Uhrzeiten
     anatomie  je Struktur: welche Struktur zuerst angetippt wurde */
  function valid(item, v) {
    switch (item.typ) {
      case "wahl": return Number.isInteger(v) && v >= 0 && v < item.o.length;
      case "reihe": return ints(v, item.schritte.length, 0, 99);
      case "paare": return ints(v, item.paare.length, 0, 99);
      case "auswahl": return ints(v, null, 0, item.ja.length + item.nein.length - 1) && distinct(v);
      case "uhr": return ints(v, null, 1, 12) && distinct(v);
      case "anatomie": return ints(v, ANA.length, 0, ANA.length - 1);
    }
    return false;
  }
  function richtig(item, v) {
    switch (item.typ) {
      case "wahl": return v === item.c;
      case "reihe": case "paare": return v.every(function (x) { return x === 0; });
      case "auswahl": return sameSet(v, item.ja.map(function (_, i) { return i; }));
      case "uhr": return sameSet(v, item.richtig);
      case "anatomie": return v.every(function (x, i) { return x === i; });
    }
    return false;
  }

  /* Schematische Zeichnung des inneren Genitales von vorne */
  var ANA = [
    { key: "fundus", name: "Fundus uteri", art: "den Fundus uteri", note: "Der oberste Abschnitt des Uterus. Seitlich entspringen hier die Tuben. Ein IUP wird mit dem Applikator bis zum Fundus eingelegt." },
    { key: "corpus", name: "Corpus und Cavum uteri", art: "Corpus und Cavum uteri", ill: "Blutungsstörung, Polyp, Karzinomverdacht, Abort", op: "Hysteroskopie und Kürettage, IUP-Einlage und -Entfernung" },
    { key: "cervix", name: "Cervix uteri", art: "die Cervix uteri", ill: "Dysplasie (PAP III D, PAP IV)", op: "Konisation" },
    { key: "portio", name: "Portio", art: "die Portio", note: "Der Teil der Zervix, der in die Scheide ragt. Hier werden die Kugelzangen gesetzt, und hier wird vor der Konisation mit Lugol angefärbt." },
    { key: "vagina", name: "Vagina", art: "die Vagina", ill: "Hymenalatresie mit Hämatokolpos", op: "Hymenalspaltung" },
    { key: "tube", name: "Tuba uterina", art: "die Tuba uterina", ill: "Tubargravidität, Tubenverschluss", op: "Laparoskopie, Chromopertubation" },
    { key: "ovar", name: "Ovar", art: "das Ovar", ill: "Ovarialzyste, Ovarialtumor", op: "Laparoskopie" }
  ];
  var ANA_VIEWBOX = "74 78 492 366";
  var ANA_SVG =
    '<g class="reg" data-id="tube"><path class="s" d="M252,140 C206,112 150,98 108,126"></path><path class="s" d="M388,140 C434,112 490,98 532,126"></path>' +
    '<path class="s2" d="M108,126 l-18,0 M108,126 l-15,12 M108,126 l-7,19 M108,126 l5,19 M532,126 l18,0 M532,126 l15,12 M532,126 l7,19 M532,126 l-5,19"></path></g>' +
    '<path class="deco ln" d="M162,182 L258,172 M478,182 L382,172"></path>' +
    '<g class="reg" data-id="ovar"><ellipse class="f" cx="128" cy="188" rx="37" ry="24"></ellipse><ellipse class="f" cx="512" cy="188" rx="37" ry="24"></ellipse></g>' +
    '<circle class="deco dot" cx="116" cy="184" r="5"></circle><circle class="deco dot" cx="134" cy="194" r="4"></circle><circle class="deco dot" cx="140" cy="181" r="3"></circle>' +
    '<circle class="deco dot" cx="524" cy="184" r="5"></circle><circle class="deco dot" cx="506" cy="194" r="4"></circle><circle class="deco dot" cx="500" cy="181" r="3"></circle>' +
    '<g class="reg" data-id="vagina"><path class="f" d="M270,326 C270,368 287,398 289,434 L351,434 C353,398 370,368 370,326 L352,326 L352,338 L350,338 C350,366 339,378 320,378 C301,378 290,366 290,338 L288,338 L288,326 Z"></path></g>' +
    '<g class="reg" data-id="fundus"><path class="f" d="M244,148 C230,90 410,90 396,148 Z"></path></g>' +
    '<g class="reg" data-id="corpus"><path class="f" d="M244,148 L396,148 C392,202 360,246 352,290 L288,290 C280,246 248,202 244,148 Z"></path></g>' +
    '<path class="deco cav" d="M282,160 L358,160 C350,204 331,252 325,286 L315,286 C309,252 290,204 282,160 Z"></path>' +
    '<g class="reg" data-id="cervix"><path class="f" d="M288,290 L352,290 L352,338 L288,338 Z"></path></g>' +
    '<g class="reg" data-id="portio"><path class="f" d="M290,338 L350,338 C350,366 339,378 320,378 C301,378 290,366 290,338 Z"></path></g>' +
    '<path class="deco ln" d="M320,288 L320,376"></path>';

  window.Live = {
    BROKERS: BROKERS, rand: rand, shuffle: shuffle, makeCode: makeCode, parseCode: parseCode,
    open: open, pickBroker: pickBroker, h: h, put: put, shake: shake, store: store,
    TYPNAME: TYPNAME, index: index, titel: titel, valid: valid, richtig: richtig, sameSet: sameSet,
    ANA: ANA, ANA_SVG: ANA_SVG, ANA_VIEWBOX: ANA_VIEWBOX
  };
})();
