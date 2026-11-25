/*
  Aufgaben für Gyn-OP Live, Teil 1.
  Hier werden Aufgaben geändert, ergänzt oder gelöscht. Sonst muss nichts angepasst werden.
  Die Reihenfolge in dieser Datei ist die Reihenfolge, in der die Moderation freigibt.

  Aufgabentypen (typ):
    "wahl"      Frage mit vier Antworten.  q Frage, o Antworten A bis D, c richtige Position (0 = A), e Erklärung
    "reihe"     Schritte in die richtige Reihenfolge bringen.  titel, schritte: [Titel, Detail] in der richtigen Reihenfolge
    "paare"     Zuordnen.  titel, frage, links, rechts (Spaltennamen), paare: [links, rechts]
    "auswahl"   Alles Richtige auswählen.  titel, text, ja: gehört dazu, nein: gehört nicht dazu, e Erklärung
    "uhr"       Uhrzeit an der Portio antippen.  titel, q, richtig: Uhrzeiten, e Erklärung
    "anatomie"  Strukturen in der Zeichnung finden.  titel

  Die richtigen Antworten, Abläufe und Erklärungen stammen aus den Folien von Teil 1.
  Die falschen Antworten und die Fallbeispiele sind ergänzt und sollten fachlich geprüft werden.
*/
window.BLOCKS = [
  { nr: "01", title: "Grundlagen im OP", aufgaben: [
    { typ: "wahl", q: "Welcher Nerv ist in Steinschnittlage durch die Beinstütze besonders gefährdet?",
      o: ["N. femoralis", "N. peroneus", "N. ischiadicus", "Plexus brachialis"], c: 1,
      e: "Druck am Fibulaköpfchen durch die Beinstütze. Folge ist eine Fußheberschwäche." },
    { typ: "wahl", q: "Welche drei Zeitpunkte umfasst die Sicherheitscheckliste?",
      o: ["Aufklärung, Lagerung, Zählkontrolle", "Einleitung, Schnitt, Hautnaht", "Sign-in, Team-Time-out, Sign-out", "Schleuse, OP-Saal, Aufwachraum"], c: 2,
      e: "Sign-in vor der Einleitung, Team-Time-out vor dem Schnitt, Sign-out vor Verlassen des OP." },
    { typ: "wahl", q: "Wann wird die Kopftieflage (Trendelenburg) eingestellt?",
      o: ["Erst nach Anlage des Pneumoperitoneums", "Direkt nach der Narkoseeinleitung", "Vor dem Einführen der Veres-Nadel", "Erst bei der Hautnaht"], c: 0,
      e: "Dann gleitet der Dünndarm in den Oberbauch und das kleine Becken wird übersichtlich." },
    { typ: "wahl", q: "Auf dem Instrumentiertisch liegt eine unbeschriftete Spritze. Was passiert damit?",
      o: ["Sie wird nachträglich beschriftet", "Sie wird für die Spülung verwendet", "Sie wird der Anästhesie übergeben", "Sie wird verworfen"], c: 3,
      e: "Alle Medikamente brauchen eine Markierung, die für alle im Team gilt." },
    { typ: "paare", titel: "Instrumente", frage: "Welches Merkmal gehört zu diesem Instrument?", links: "Instrument", rechts: "Merkmal", paare: [
      ["Spekulum nach Breisky", "Einstellung in alle Richtungen"],
      ["Spekulum nach Kristeller", "Vorderes und hinteres Blatt, Rinne für Flüssigkeit"],
      ["Spekulum nach Scherback", "Hält durch Eigengewicht"],
      ["Hakenzange nach Schröder", "Heißt im Alltag Kugelzange, fasst die Portio"],
      ["Uterussonde nach Mayo", "Biegsam, mit Zentimeterskala"],
      ["Hegar-Stifte", "Zum Dilatieren, der Reihe nach anreichen"],
      ["Kürette nach Bumm", "Scharf oder stumpf, zum Abradieren"]
    ]}
  ]},
  { nr: "02", title: "Äußeres Genitale", aufgaben: [
    { typ: "wahl", q: "Welche Struktur gehört nicht zur Vulva?",
      o: ["Labia minora pudendi", "Klitoris", "Portio", "Vestibulum vaginae"], c: 2,
      e: "Zur Vulva gehören große und kleine Labien, Klitoris, Vestibulum vaginae und Perineum. Die Portio ist ein Abschnitt des Uterus." },
    { typ: "wahl", q: "Wo mündet der Ausführungsgang der Bartholin-Drüse?",
      o: ["Neben der Urethra", "An der Innenseite der kleinen Labie", "Am Perineum", "An der Portio"], c: 1,
      e: "Verschließt sich der Gang, entsteht zuerst eine schmerzlose Zyste, bei Infektion ein Bartholin-Abszess. Neben der Urethra liegen die Skene-Gänge." },
    { typ: "wahl", q: "Was passiert bei einer Hymenalatresie ab der Menarche?",
      o: ["Die Regelblutung ist besonders stark", "Es bildet sich ein Bartholin-Abszess", "Die Harnröhre verschließt sich", "Das Menstrualblut staut sich in der Vagina"], c: 3,
      e: "Das heißt Hämatokolpos. Die Mädchen haben zyklische Unterbauchschmerzen ohne sichtbare Blutung." }
  ]},
  { nr: "03", title: "Eingriffe an Vulva und Vagina", aufgaben: [
    { typ: "reihe", titel: "Marsupialisation", schritte: [
      ["Inzision", "Hautinzision über der Mündung des Gangs an der Innenseite der kleinen Labie"],
      ["Abstrich", "Gegebenenfalls Abstrich für die Bakteriologie"],
      ["Ausräumen", "Digitales Ausräumen der Abszesshöhle"],
      ["Fixieren", "Zystenwand hervorziehen und mit resorbierbaren Einzelknopfnähten an die Schleimhaut nähen"],
      ["Drainage", "Gegebenenfalls Lasche einlegen, um den neuen Gang offen zu halten"],
      ["Nachsorge", "Sitzbäder unterstützen die Wundheilung"]
    ]},
    { typ: "reihe", titel: "Hymenalspaltung", schritte: [
      ["Vorbereitung", "Steinschnittlage, Desinfektion, Blase entleeren"],
      ["Inzision", "Kreuz- oder sternförmige Inzision des vorgewölbten Hymens"],
      ["Entleerung", "Altes Blut absaugen, kein Druck auf den Bauch"],
      ["Exzision", "Hymenallappen sparsam abtragen"],
      ["Naht", "Wundränder mit feinen resorbierbaren Einzelknopfnähten versorgen"],
      ["Abschluss", "Vorlage, Menge des entleerten Blutes dokumentieren"]
    ]},
    { typ: "auswahl", titel: "Tisch richten: Bartholin-Abszess",
      text: "Angemeldet ist eine Patientin mit schmerzhafter, zunehmender Schwellung am Introitus. Geplant ist die Marsupialisation. Was legen Sie bereit?",
      ja: ["Skalpell", "Pinzette", "Feiner Nadelhalter", "Resorbierbares Nahtmaterial", "Abstrichröhrchen", "Lasche als Drainage"],
      nein: ["Hegar-Stifte", "Lugol-Lösung", "Veres-Nadel", "Blaulösung"],
      e: "Der Abstrich liegt bereit, bevor inzidiert wird. Positionierung: Steinschnittlage mit hochgestellten Beinen." },
    { typ: "auswahl", titel: "Fall: 13-Jährige",
      text: "13 Jahre, noch keine Regelblutung, seit Monaten zyklische Unterbauchschmerzen. Befund: bläulich vorgewölbtes Hymen. Geplant ist die Hymenalspaltung. Was legen Sie bereit?",
      ja: ["Großlumiger Sauger", "Feine Schere und Pinzette", "Resorbierbares Nahtmaterial", "Vorlage"],
      nein: ["Scharfe Kürette", "Portioadapter", "Neutralelektrode", "Konisationsmesser"],
      e: "Hymenalatresie mit Hämatokolpos. Mit viel altem Blut rechnen und die Menge dokumentieren. Die Patientinnen sind meist Jugendliche." },
    { typ: "wahl", q: "Warum wird ein Bartholin-Abszess marsupialisiert und nicht nur inzidiert?",
      o: ["Die Inzision blutet stärker", "Eine reine Stichinzision verschließt sich rasch wieder", "Die Marsupialisation geht schneller", "Für die Inzision braucht es eine Vollnarkose"], c: 1,
      e: "Die Marsupialisation schafft eine bleibende Öffnung, über die das Sekret dauerhaft abfließt." },
    { typ: "wahl", q: "Was ist ein Hämatokolpos?",
      o: ["Ein Bluterguss an der Labie", "Eine Blutung aus der Portio", "Gestautes Menstrualblut in der Vagina", "Blut in der freien Bauchhöhle"], c: 2,
      e: "Ursache ist die Hymenalatresie. Bei längerem Verlauf staut sich das Blut bis in Uterus und Tuben." },
    { typ: "wahl", q: "Wie wird das Präparat einer Probeexzision an der Vulva beschriftet?",
      o: ["Mit der Lokalisation nach Uhrzeit", "Nur mit dem Namen der Patientin", "Mit der Größe der Stanze", "Die Pathologie ordnet es selbst zu"], c: 0,
      e: "Mehrere Proben kommen in getrennte, nummerierte Gefäße." },
    { typ: "wahl", q: "Wie wird ein Labienabszess versorgt?",
      o: ["Marsupialisation wie beim Bartholin-Abszess", "Kürettage", "Verschluss mit fortlaufender Naht", "Inzision, Entleerung, Spülung, offene Wundbehandlung"], c: 3,
      e: "Hier wird nicht marsupialisiert. Abstrich für die Bakteriologie nicht vergessen." }
  ]},
  { nr: "04", title: "Inneres Genitale", aufgaben: [
    { typ: "anatomie", titel: "Wo liegt was?" },
    { typ: "paare", titel: "Von der Erkrankung zum Eingriff", frage: "Welcher Eingriff gehört zu diesem Befund?", links: "Befund", rechts: "Eingriff", paare: [
      ["Bartholin-Abszess", "Marsupialisation"],
      ["Hymenalatresie mit Hämatokolpos", "Hymenalspaltung"],
      ["Dysplasie der Zervix (PAP IV)", "Konisation"],
      ["Postmenopausenblutung", "Hysteroskopie und fraktionierte Abrasio"],
      ["IUP ohne sichtbare Fäden", "Entfernung unter hysteroskopischer Sicht"],
      ["Tubargravidität", "Laparoskopie mit Salpingotomie oder Salpingektomie"],
      ["Sterilität, Verdacht auf Tubenverschluss", "Laparoskopie mit Chromopertubation"]
    ]},
    { typ: "wahl", q: "Welche vier Abschnitte hat der Uterus?",
      o: ["Fundus, Korpus, Tube, Ovar", "Perimetrium, Myometrium, Endometrium, Cavum", "Fundus, Korpus, Zervix, Portio", "Korpus, Zervix, Vagina, Vulva"], c: 2,
      e: "Perimetrium, Myometrium und Endometrium sind die drei Wandschichten." },
    { typ: "wahl", q: "Was bedeutet der Begriff Adnexe?",
      o: ["Ovar und Tube einer Seite", "Uterus und Vagina", "Beide Ovarien ohne Tuben", "Harnblase und Ureter"], c: 0,
      e: "Adnexektomie heißt: Ovar und Tube einer Seite werden entfernt." },
    { typ: "wahl", q: "Welche drei Nachbarorgane liegen bei jedem gynäkologischen Eingriff im Operationsgebiet?",
      o: ["Harnblase, Niere, Milz", "Ureter, Appendix, Leber", "Rektum, Magen, Niere", "Harnblase, Ureter, Rektum"], c: 3,
      e: "Der Ureter unterkreuzt die A. uterina und ist bei tiefen Umstechungen gefährdet." },
    { typ: "wahl", q: "Wie liegt der Uterus physiologisch?",
      o: ["Retrovertiert und retroflektiert", "Antevertiert und anteflektiert", "Gestreckt, ohne Neigung", "Zur Seite gekippt"], c: 1,
      e: "Die Lage wird vor jedem intrauterinen Eingriff bimanuell geprüft. Bei anderer Lage steigt das Perforationsrisiko." }
  ]},
  { nr: "05", title: "Konisation", aufgaben: [
    { typ: "reihe", titel: "Konisation", schritte: [
      ["Desinfektion, Abdeckung", "Steinschnittlage"],
      ["Einstellen", "Hinteres und vorderes Blatt"],
      ["Desinfektion der Scheide", "Mit Braunol"],
      ["Anklemmen, Dilatation", "Kugelzangen, Hegar 8 bis 8,5"],
      ["Anfärben", "Lugol: Gesundes wird braun"],
      ["Umschneiden", "Konus entnehmen, Faden bei 12 Uhr"],
      ["Blutstillung", "Am Rand sehr wichtig"],
      ["Abrasio", "Fraktionierte Abrasio"],
      ["Instrumente entfernen", "Danach die Scheide abschließend mit Braunol desinfizieren"]
    ]},
    { typ: "uhr", titel: "Konisat markieren", q: "Wo sitzt der Markierungsfaden am Konisat?", richtig: [12],
      e: "Immer bei 12 Uhr, Lage wie in der Zervix. Nur so kann die Pathologie befallene Schnittränder einer Stelle zuordnen. Davon hängt ab, wo nachreseziert wird." },
    { typ: "wahl", q: "Bei welchen Befunden wird eine Konisation durchgeführt?",
      o: ["Postmenopausenblutung", "Auffällige Zytologie: PAP III D und PAP IV", "Tubenverschluss", "Bartholin-Zyste"], c: 1,
      e: "Zwei Ziele: exakte Histologie und zugleich Therapie durch Entfernung im Gesunden." },
    { typ: "wahl", q: "Wie sieht der Konus bei einer jungen Frau aus?",
      o: ["Schmal und hoch", "Lang und spitz", "Unabhängig vom Alter immer gleich", "Breit und flach"], c: 3,
      e: "Bei älteren Frauen liegt die gefährdete Zone im Zervikalkanal, der Konus ist dann schmal und hoch." },
    { typ: "wahl", q: "Wozu dient die Lugol-Lösung?",
      o: ["Gesundes Gewebe wird braun: Die Resektionsgrenzen werden sichtbar", "Sie stillt die Blutung", "Sie desinfiziert die Scheide", "Sie prüft die Durchgängigkeit der Tuben"], c: 0,
      e: "Verändertes Gewebe bleibt hell." },
    { typ: "wahl", q: "Welche Komplikation ist nach der Konisation am wichtigsten?",
      o: ["Die Tubenruptur", "Die Nachblutung, auch verzögert", "Die Hyponatriämie", "Die Peroneusläsion"], c: 1,
      e: "Sie kann auftreten, wenn sich der Wundschorf löst. Bereit sein müssen Spekula, Licht, Koagulation oder Umstechung und eine Streifentamponade." }
  ]},
  { nr: "06", title: "Cavum uteri", aufgaben: [
    { typ: "reihe", titel: "Fraktionierte Abrasio", schritte: [
      ["Desinfektion, Abdeckung", "Steinschnittlage"],
      ["Einstellen", "Hinteres und vorderes Blatt"],
      ["Desinfektion der Scheide", ""],
      ["Kugelzangen setzen", "Bei 11 und 1 Uhr"],
      ["Sondieren", "Länge und Richtung"],
      ["Dilatieren", "Hegar-Stifte, schrittweise"],
      ["Hysteroskopie", "Cavum beurteilen"],
      ["Zervixabrasio", "Präparat 1"],
      ["Korpusabrasio", "Präparat 2"]
    ]},
    { typ: "uhr", titel: "Kugelzangen", q: "Wo werden die beiden Kugelzangen bei der fraktionierten Abrasio gesetzt?", richtig: [11, 1],
      e: "Bei 11 und 1 Uhr. Bei der diagnostischen Hysteroskopie alternativ eine Kugelzange bei 12 Uhr." },
    { typ: "auswahl", titel: "Tisch richten: Postmenopausenblutung",
      text: "68 Jahre, Blutung nach den Wechseljahren. Geplant sind Hysteroskopie und fraktionierte Abrasio. Was legen Sie bereit?",
      ja: ["Zwei vorab beschriftete Histologiegefäße", "Scharfe Küretten", "Hegar-Stifte", "Uterussonde", "Optik, Kamera, Lichtkabel", "Spülsystem, entlüftet"],
      nein: ["Saugkürette", "Blaulösung", "Veres-Nadel", "Lugol-Lösung"],
      e: "Die Gefäße werden vor Beginn mit Zervix und Korpus beschriftet. Die beiden Abradate dürfen nie vermischt werden. Die Sondenlänge wird laut angesagt." },
    { typ: "wahl", q: "Was ist die häufigste Indikation für Hysteroskopie und Kürettage?",
      o: ["Die Sterilitätsabklärung", "Die Tubargravidität", "Die Blutung, vor allem in der Postmenopause", "Die Dysplasie der Zervix"], c: 2,
      e: "Dazu kommen auffällige Ultraschallbefunde, Polypen, submuköse Myome und Karzinomverdacht." },
    { typ: "wahl", q: "Was heißt fraktionierte Kürettage?",
      o: ["Zervix und Korpus werden getrennt ausgeschabt: zwei Präparate", "Die Kürettage wird auf zwei Tage verteilt", "Es wird abwechselnd gesaugt und geschabt", "Nur eine Hälfte des Cavums wird ausgeschabt"], c: 0,
      e: "So kann die Pathologie den Sitz eines Karzinoms bestimmen." },
    { typ: "wahl", q: "Woran erkennt man eine Perforation des Uterus?",
      o: ["Die Spülflüssigkeit wird trüb", "Die Hakenzange reißt aus", "Die Patientin bekommt Fieber", "Ein Instrument gleitet tiefer als die gemessene Sondenlänge"], c: 3,
      e: "Eingriff stoppen, nicht saugen, eventuell Laparoskopie." },
    { typ: "wahl", q: "Warum wird bei der Abortkürettage nicht sondiert?",
      o: ["Die Sonde ist zu kurz", "Der schwangere Uterus ist weich: hohe Perforationsgefahr", "Die Sondenlänge ist schon bekannt", "Die Sonde würde das Präparat zerstören"], c: 1,
      e: "Deshalb auch keine scharfen Küretten, und gearbeitet wird unter Ultraschallkontrolle." },
    { typ: "wahl", q: "Wie wird ein IUP entfernt, wenn die Fäden nicht sichtbar sind?",
      o: ["Blind mit der scharfen Kürette", "Immer per Laparoskopie", "Lagekontrolle im Ultraschall, dann hysteroskopisch mit der Fasszange", "Mit der Saugkürette"], c: 2,
      e: "Eine Laparoskopie ist nur nötig, wenn das IUP außerhalb des Cavums liegt. Das entfernte IUP auf Vollständigkeit prüfen." }
  ]},
  { nr: "07", title: "Laparoskopie", aufgaben: [
    { typ: "reihe", titel: "Chromopertubation", schritte: [
      ["Vaginal", "Portioadapter oder Uterusmanipulator dicht einsetzen"],
      ["Laparoskopie", "Zugang, Inspektion von Uterus, Tuben und Ovarien"],
      ["Injektion", "Blaulösung langsam über den Adapter in das Cavum spritzen"],
      ["Beobachten", "Füllung der Tube und Austritt des Farbstoffs am Fimbrienende, beide Seiten"],
      ["Befund", "Frei, verzögert oder verschlossen; Ort des Verschlusses proximal oder distal"],
      ["Dokumentation", "Foto oder Video, Befund im OP-Bericht"]
    ]},
    { typ: "auswahl", titel: "Notfall: Tubenruptur",
      text: "Notfallanmeldung: Verdacht auf rupturierte Tubargravidität mit Blutung in den Bauchraum. Was muss bereitstehen?",
      ja: ["Sauger", "Spülung", "Blutkonserven", "Laparoskopie-Turm mit Videooptik", "Instrumentarium für eine Kürettage"],
      nein: ["Lugol-Lösung", "Konisationsmesser", "Intrauterinpessar", "Stanzen in mehreren Größen"],
      e: "Die Kürettage kann sich anschließen, deshalb liegt ihr Instrumentarium zusätzlich bereit." },
    { typ: "wahl", q: "Wo wird der erste Zugang bei der Laparoskopie gesetzt?",
      o: ["Suprasymphysär, mit dem 5-mm-Trokar", "Am Unterrand des Nabels, mit der Veres-Nadel", "Im linken Oberbauch", "Über den Douglas-Raum"], c: 1,
      e: "Die Arbeitstrokare folgen erst danach unter Sicht." },
    { typ: "wahl", q: "Ab welchem Beta-HCG-Wert sollte im Uterus eine Fruchthöhle sichtbar sein?",
      o: ["Ab etwa 10 IE", "Ab etwa 100 IE", "Ab etwa 1000 IE", "Erst ab 100 000 IE"], c: 2,
      e: "Fehlt sie bei diesem Wert, besteht der Verdacht auf eine Extrauteringravidität." },
    { typ: "wahl", q: "Worin unterscheiden sich Salpingotomie und Salpingektomie?",
      o: ["Salpingotomie erhält die Tube, Salpingektomie entfernt sie", "Salpingotomie entfernt die Tube, Salpingektomie erhält sie", "Beide entfernen Tube und Ovar", "Die Salpingotomie ist nur offen möglich"], c: 0,
      e: "Die Salpingektomie ist bei ausgedehntem Defekt nötig." },
    { typ: "wahl", q: "Was zeigt die Blauprobe bei durchgängiger Tube?",
      o: ["Die Tube bläht sich auf, ohne Austritt", "Der Farbstoff bleibt im Cavum", "Das Ovar färbt sich blau", "Der Farbstoff tritt am Fimbrienende aus"], c: 3,
      e: "Bei einem Verschluss treibt sich die Tube auf, ohne dass Farbstoff austritt." },
    { typ: "wahl", q: "Bei der Blauprobe tritt der Farbstoff an der Portio zurück. Was bedeutet das?",
      o: ["Beide Tuben sind verschlossen", "Der Adapter sitzt nicht dicht", "Der Uterus ist perforiert", "Die Blaulösung ist zu dünn"], c: 1,
      e: "Der Portioadapter oder Uterusmanipulator muss dicht eingesetzt sein." }
  ]}
];
