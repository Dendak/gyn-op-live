# Gyn-OP Live

Live-Quiz zur Fortbildung „Anatomie und kleine gynäkologische Eingriffe“ (Teil 1), ähnlich wie Mentimeter:
Die Teilnehmenden scannen einen QR-Code, die Moderation gibt nach jedem Kapitel den Abschnitt frei und sieht live, wie geantwortet wurde.
Auf den Handys kann nichts ausgewählt werden: Die Aufgaben des freigegebenen Abschnitts erscheinen von selbst, eine nach der anderen.

- **Moderation:** https://dendak.github.io/gyn-op-live/host.html
- **Teilnehmende:** https://dendak.github.io/gyn-op-live/ (über den QR-Code oder mit dem Code vom Bildschirm)
- **Aufgaben für die Bühne** (ohne Handys, die Moderation klickt): https://dendak.github.io/gyn-op-live/buehne.html

## Ablauf

1. `host.html` auf dem Präsentationsrechner öffnen. Der QR-Code erscheint.
2. Die Teilnehmenden scannen den Code. Oben steht, wie viele Geräte dabei sind.
3. Nach jedem Kapitel den Block auswählen und „Block … freigeben“ klicken. Die Aufgaben des Abschnitts erscheinen nacheinander auf den Handys.
4. Die Auswertung füllt sich live. Oben die Aufgaben des Abschnitts zum Durchblättern, „Lösung zeigen“ markiert die richtige Antwort.
5. „Neue Sitzung“ beginnt mit leerem Stand und neuem Code.

Die Sitzung bleibt beim Neuladen erhalten, auf beiden Seiten.

## Aufgaben ändern

Alle 43 Aufgaben stehen in `fragen.js`: Fragen mit vier Antworten, Reihenfolge, Zuordnen, Auswählen, Uhr und Anatomie.
Oben in der Datei ist erklärt, wie jeder Aufgabentyp aufgebaut ist. Die Reihenfolge in der Datei ist die Reihenfolge der Freigabe.

## Technik

Statische Seiten auf GitHub Pages, kein eigener Server, kein Build.
Die Live-Daten laufen über einen öffentlichen MQTT-Broker (`live.js`); übertragen werden nur Aufgabennummer und Zahlen, keine Namen.
Ein öffentlicher Broker hat keine Verfügbarkeitsgarantie. Fällt er aus, bleiben die Aufgaben für die Bühne als Ersatz.

Bibliotheken in `lib/`: [MQTT.js](https://github.com/mqttjs/MQTT.js) 5.10.1 (MIT), [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) 1.4.4 (MIT).
