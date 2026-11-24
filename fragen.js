/*
  Fragen für Gyn-OP Live, Teil 1.
  Hier werden Fragen geändert, ergänzt oder gelöscht. Sonst muss nichts angepasst werden.

  Pro Frage:
    q  Frage
    o  vier Antworten in der Reihenfolge A, B, C, D
    c  Position der richtigen Antwort: 0 = A, 1 = B, 2 = C, 3 = D
    e  Erklärung, die nach der Antwort erscheint

  Die richtigen Antworten und Erklärungen stammen aus den Folien von Teil 1.
  Die falschen Antworten sind ergänzt und sollten fachlich geprüft werden.
*/
window.BLOCKS = [
  { nr: "01", title: "Grundlagen im OP", fragen: [
    { q: "Welcher Nerv ist in Steinschnittlage durch die Beinstütze besonders gefährdet?",
      o: ["N. femoralis", "N. peroneus", "N. ischiadicus", "Plexus brachialis"], c: 1,
      e: "Druck am Fibulaköpfchen durch die Beinstütze. Folge ist eine Fußheberschwäche." },
    { q: "Welche drei Zeitpunkte umfasst die Sicherheitscheckliste?",
      o: ["Aufklärung, Lagerung, Zählkontrolle", "Einleitung, Schnitt, Hautnaht", "Sign-in, Team-Time-out, Sign-out", "Schleuse, OP-Saal, Aufwachraum"], c: 2,
      e: "Sign-in vor der Einleitung, Team-Time-out vor dem Schnitt, Sign-out vor Verlassen des OP." },
    { q: "Wann wird die Kopftieflage (Trendelenburg) eingestellt?",
      o: ["Erst nach Anlage des Pneumoperitoneums", "Direkt nach der Narkoseeinleitung", "Vor dem Einführen der Veres-Nadel", "Erst bei der Hautnaht"], c: 0,
      e: "Dann gleitet der Dünndarm in den Oberbauch und das kleine Becken wird übersichtlich." },
    { q: "Auf dem Instrumentiertisch liegt eine unbeschriftete Spritze. Was passiert damit?",
      o: ["Sie wird nachträglich beschriftet", "Sie wird für die Spülung verwendet", "Sie wird der Anästhesie übergeben", "Sie wird verworfen"], c: 3,
      e: "Alle Medikamente brauchen eine Markierung, die für alle im Team gilt." }
  ]},
  { nr: "02", title: "Äußeres Genitale", fragen: [
    { q: "Welche Struktur gehört nicht zur Vulva?",
      o: ["Labia minora pudendi", "Klitoris", "Portio", "Vestibulum vaginae"], c: 2,
      e: "Zur Vulva gehören große und kleine Labien, Klitoris, Vestibulum vaginae und Perineum. Die Portio ist ein Abschnitt des Uterus." },
    { q: "Wo mündet der Ausführungsgang der Bartholin-Drüse?",
      o: ["Neben der Urethra", "An der Innenseite der kleinen Labie", "Am Perineum", "An der Portio"], c: 1,
      e: "Verschließt sich der Gang, entsteht zuerst eine schmerzlose Zyste, bei Infektion ein Bartholin-Abszess. Neben der Urethra liegen die Skene-Gänge." },
    { q: "Was passiert bei einer Hymenalatresie ab der Menarche?",
      o: ["Die Regelblutung ist besonders stark", "Es bildet sich ein Bartholin-Abszess", "Die Harnröhre verschließt sich", "Das Menstrualblut staut sich in der Vagina"], c: 3,
      e: "Das heißt Hämatokolpos. Die Mädchen haben zyklische Unterbauchschmerzen ohne sichtbare Blutung." },
    { q: "Warum entstehen an der Vulva leicht Hämatome?",
      o: ["Wegen der ausgeprägten venösen Plexus", "Weil die Haut dort besonders dick ist", "Weil dort keine Lymphgefäße liegen", "Weil die Nähte nicht resorbierbar sind"], c: 0,
      e: "Für den OP: bipolare Koagulation bereithalten, feine resorbierbare Nähte, auf Nachblutung achten." }
  ]},
  { nr: "03", title: "Eingriffe an Vulva und Vagina", fragen: [
    { q: "Warum wird ein Bartholin-Abszess marsupialisiert und nicht nur inzidiert?",
      o: ["Die Inzision blutet stärker", "Eine reine Stichinzision verschließt sich rasch wieder", "Die Marsupialisation geht schneller", "Für die Inzision braucht es eine Vollnarkose"], c: 1,
      e: "Die Marsupialisation schafft eine bleibende Öffnung, über die das Sekret dauerhaft abfließt." },
    { q: "Was ist ein Hämatokolpos?",
      o: ["Ein Bluterguss an der Labie", "Eine Blutung aus der Portio", "Gestautes Menstrualblut in der Vagina", "Blut in der freien Bauchhöhle"], c: 2,
      e: "Ursache ist die Hymenalatresie. Bei längerem Verlauf staut sich das Blut bis in Uterus und Tuben." },
    { q: "Wie wird das Präparat einer Probeexzision an der Vulva beschriftet?",
      o: ["Mit der Lokalisation nach Uhrzeit", "Nur mit dem Namen der Patientin", "Mit der Größe der Stanze", "Die Pathologie ordnet es selbst zu"], c: 0,
      e: "Mehrere Proben kommen in getrennte, nummerierte Gefäße." },
    { q: "Wie wird ein Labienabszess versorgt?",
      o: ["Marsupialisation wie beim Bartholin-Abszess", "Kürettage", "Verschluss mit fortlaufender Naht", "Inzision, Entleerung, Spülung, offene Wundbehandlung"], c: 3,
      e: "Hier wird nicht marsupialisiert. Abstrich für die Bakteriologie nicht vergessen." }
  ]},
  { nr: "04", title: "Inneres Genitale", fragen: [
    { q: "Welche vier Abschnitte hat der Uterus?",
      o: ["Fundus, Korpus, Tube, Ovar", "Perimetrium, Myometrium, Endometrium, Cavum", "Fundus, Korpus, Zervix, Portio", "Korpus, Zervix, Vagina, Vulva"], c: 2,
      e: "Perimetrium, Myometrium und Endometrium sind die drei Wandschichten." },
    { q: "Was bedeutet der Begriff Adnexe?",
      o: ["Ovar und Tube einer Seite", "Uterus und Vagina", "Beide Ovarien ohne Tuben", "Harnblase und Ureter"], c: 0,
      e: "Adnexektomie heißt: Ovar und Tube einer Seite werden entfernt." },
    { q: "Welche drei Nachbarorgane liegen bei jedem gynäkologischen Eingriff im Operationsgebiet?",
      o: ["Harnblase, Niere, Milz", "Ureter, Appendix, Leber", "Rektum, Magen, Niere", "Harnblase, Ureter, Rektum"], c: 3,
      e: "Der Ureter unterkreuzt die A. uterina und ist bei tiefen Umstechungen gefährdet." },
    { q: "Wie liegt der Uterus physiologisch?",
      o: ["Retrovertiert und retroflektiert", "Antevertiert und anteflektiert", "Gestreckt, ohne Neigung", "Zur Seite gekippt"], c: 1,
      e: "Die Lage wird vor jedem intrauterinen Eingriff bimanuell geprüft. Bei anderer Lage steigt das Perforationsrisiko." }
  ]},
  { nr: "05", title: "Konisation", fragen: [
    { q: "Bei welchen Befunden wird eine Konisation durchgeführt?",
      o: ["Postmenopausenblutung", "Auffällige Zytologie: PAP III D und PAP IV", "Tubenverschluss", "Bartholin-Zyste"], c: 1,
      e: "Zwei Ziele: exakte Histologie und zugleich Therapie durch Entfernung im Gesunden." },
    { q: "Wie sieht der Konus bei einer jungen Frau aus?",
      o: ["Schmal und hoch", "Lang und spitz", "Unabhängig vom Alter immer gleich", "Breit und flach"], c: 3,
      e: "Bei älteren Frauen liegt die gefährdete Zone im Zervikalkanal, der Konus ist dann schmal und hoch." },
    { q: "Wozu dient die Lugol-Lösung?",
      o: ["Gesundes Gewebe wird braun: Die Resektionsgrenzen werden sichtbar", "Sie stillt die Blutung", "Sie desinfiziert die Scheide", "Sie prüft die Durchgängigkeit der Tuben"], c: 0,
      e: "Verändertes Gewebe bleibt hell." },
    { q: "Wo sitzt der Markierungsfaden am Konisat?",
      o: ["Bei 3 Uhr", "Bei 6 Uhr", "Bei 12 Uhr", "Bei 9 Uhr"], c: 2,
      e: "Immer bei 12 Uhr, Lage wie in der Zervix. Nur so kann die Pathologie befallene Schnittränder einer Stelle zuordnen." },
    { q: "Welche Komplikation ist nach der Konisation am wichtigsten?",
      o: ["Die Tubenruptur", "Die Nachblutung, auch verzögert", "Die Hyponatriämie", "Die Peroneusläsion"], c: 1,
      e: "Sie kann auftreten, wenn sich der Wundschorf löst. Bereit sein müssen Spekula, Licht, Koagulation oder Umstechung und eine Streifentamponade." }
  ]},
  { nr: "06", title: "Cavum uteri", fragen: [
    { q: "Was ist die häufigste Indikation für Hysteroskopie und Kürettage?",
      o: ["Die Sterilitätsabklärung", "Die Tubargravidität", "Die Blutung, vor allem in der Postmenopause", "Die Dysplasie der Zervix"], c: 2,
      e: "Dazu kommen auffällige Ultraschallbefunde, Polypen, submuköse Myome und Karzinomverdacht." },
    { q: "Was heißt fraktionierte Kürettage?",
      o: ["Zervix und Korpus werden getrennt ausgeschabt: zwei Präparate", "Die Kürettage wird auf zwei Tage verteilt", "Es wird abwechselnd gesaugt und geschabt", "Nur eine Hälfte des Cavums wird ausgeschabt"], c: 0,
      e: "So kann die Pathologie den Sitz eines Karzinoms bestimmen." },
    { q: "Woran erkennt man eine Perforation des Uterus?",
      o: ["Die Spülflüssigkeit wird trüb", "Die Hakenzange reißt aus", "Die Patientin bekommt Fieber", "Ein Instrument gleitet tiefer als die gemessene Sondenlänge"], c: 3,
      e: "Eingriff stoppen, nicht saugen, eventuell Laparoskopie." },
    { q: "Warum wird bei der Abortkürettage nicht sondiert?",
      o: ["Die Sonde ist zu kurz", "Der schwangere Uterus ist weich: hohe Perforationsgefahr", "Die Sondenlänge ist schon bekannt", "Die Sonde würde das Präparat zerstören"], c: 1,
      e: "Deshalb auch keine scharfen Küretten, und gearbeitet wird unter Ultraschallkontrolle." },
    { q: "Wie wird ein IUP entfernt, wenn die Fäden nicht sichtbar sind?",
      o: ["Blind mit der scharfen Kürette", "Immer per Laparoskopie", "Lagekontrolle im Ultraschall, dann hysteroskopisch mit der Fasszange", "Mit der Saugkürette"], c: 2,
      e: "Eine Laparoskopie ist nur nötig, wenn das IUP außerhalb des Cavums liegt. Das entfernte IUP auf Vollständigkeit prüfen." }
  ]},
  { nr: "07", title: "Laparoskopie", fragen: [
    { q: "Wo wird der erste Zugang bei der Laparoskopie gesetzt?",
      o: ["Suprasymphysär, mit dem 5-mm-Trokar", "Am Unterrand des Nabels, mit der Veres-Nadel", "Im linken Oberbauch", "Über den Douglas-Raum"], c: 1,
      e: "Die Arbeitstrokare folgen erst danach unter Sicht." },
    { q: "Ab welchem Beta-HCG-Wert sollte im Uterus eine Fruchthöhle sichtbar sein?",
      o: ["Ab etwa 10 IE", "Ab etwa 100 IE", "Ab etwa 1000 IE", "Erst ab 100 000 IE"], c: 2,
      e: "Fehlt sie bei diesem Wert, besteht der Verdacht auf eine Extrauteringravidität." },
    { q: "Worin unterscheiden sich Salpingotomie und Salpingektomie?",
      o: ["Salpingotomie erhält die Tube, Salpingektomie entfernt sie", "Salpingotomie entfernt die Tube, Salpingektomie erhält sie", "Beide entfernen Tube und Ovar", "Die Salpingotomie ist nur offen möglich"], c: 0,
      e: "Die Salpingektomie ist bei ausgedehntem Defekt nötig." },
    { q: "Was zeigt die Blauprobe bei durchgängiger Tube?",
      o: ["Die Tube bläht sich auf, ohne Austritt", "Der Farbstoff bleibt im Cavum", "Das Ovar färbt sich blau", "Der Farbstoff tritt am Fimbrienende aus"], c: 3,
      e: "Bei einem Verschluss treibt sich die Tube auf, ohne dass Farbstoff austritt." },
    { q: "Bei der Blauprobe tritt der Farbstoff an der Portio zurück. Was bedeutet das?",
      o: ["Beide Tuben sind verschlossen", "Der Adapter sitzt nicht dicht", "Der Uterus ist perforiert", "Die Blaulösung ist zu dünn"], c: 1,
      e: "Der Portioadapter oder Uterusmanipulator muss dicht eingesetzt sein." }
  ]}
];
