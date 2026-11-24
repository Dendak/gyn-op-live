/*
  Gemeinsame Bausteine für beide Seiten (Teilnehmende und Moderation).

  Verbindung: Die Seiten sind statisch (GitHub Pages) und haben keinen eigenen Server.
  Die Live-Daten laufen über einen öffentlichen MQTT-Broker per WebSocket:
    <PREFIX><raum>/state    von der Moderation: welche Blöcke freigegeben sind
    <PREFIX><raum>/p/<id>   von jedem Gerät: die bisher gegebenen Antworten (nur Zahlen)
  Beide Nachrichten sind "retained": Wer neu lädt oder später dazukommt, bekommt den Stand sofort.
  Über den Broker gehen keine Namen und keine Fragetexte, nur Fragenummer und gewählte Position.
*/
(function () {
  "use strict";

  var BROKERS = [
    "wss://broker.hivemq.com:8884/mqtt",
    "wss://test.mosquitto.org:8081/mqtt"
  ];
  var PREFIX = "q7lv1/";
  var ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  function rand(n) {
    var a = new Uint8Array(n), s = "";
    crypto.getRandomValues(a);
    for (var i = 0; i < n; i++) s += ALPHABET[a[i] % ALPHABET.length];
    return s;
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

  /* Kleiner DOM-Helfer */
  function h(tag, attrs) {
    var e = document.createElement(tag), k;
    for (k in (attrs || {})) {
      var v = attrs[k];
      if (v === false || v == null) continue;
      if (k === "class") e.className = v;
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? "" : v);
    }
    var kids = Array.prototype.slice.call(arguments, 2);
    (function add(list) {
      list.forEach(function (c) {
        if (c == null || c === false) return;
        if (Array.isArray(c)) return add(c);
        e.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
      });
    })(kids);
    return e;
  }
  function put(el) {
    var kids = Array.prototype.slice.call(arguments, 1);
    el.textContent = "";
    (function add(list) {
      list.forEach(function (c) {
        if (c == null || c === false) return;
        if (Array.isArray(c)) return add(c);
        el.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
      });
    })(kids);
  }

  function store(key, val) {
    try {
      if (val === undefined) return JSON.parse(localStorage.getItem(key) || "null");
      if (val === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
    return null;
  }

  /* Fragen bekommen feste Kennungen: Blocknummer.Fragenummer, z. B. "03.2" */
  function qid(block, i) { return block.nr + "." + (i + 1); }

  window.Live = {
    BROKERS: BROKERS, rand: rand, makeCode: makeCode, parseCode: parseCode,
    open: open, pickBroker: pickBroker, h: h, put: put, store: store, qid: qid
  };
})();
