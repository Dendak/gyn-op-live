# Poznámky

## 2026-11-25

**Hotovo**
- Na přání uživatele odstraněna 4. otázka v bloku 02 („Warum entstehen an der Vulva leicht Hämatome?“). Blok 02 má teď 3 otázky, celkem 43 úloh (29 otázek A–D).
- Uživatel bude uvolňovat bloky ručně na `host.html` v Edgi; do PowerPointu se nic nevkládá.

**Otevřené a další krok:** beze změny, viz 2026-11-24.

## 2026-11-24

**Hotovo**
- Uvolňuje se vždy celý blok (kapitola), ne jednotlivé úlohy; telefony pak projdou úlohy bloku samy po sobě. Uživatel to výslovně chtěl takto.
- Přestavba na přání uživatele: účastníci si nic nevybírají, úloha se na telefonu objeví sama po kliknutí na „Freigeben“. Uvolňuje se po jedné úloze, případně celý blok najednou.
- Na telefony převedeny i interaktivní úlohy: řazení kroků (5), přiřazování (2), výběr na stůl (4), hodiny na portiu (2), anatomie (1). S 30 otázkami A–D celkem 44 úloh.
- Statistika pro přednášející podle typu úlohy (kde se lidé spletli, co kdo vybral, rozložení na hodinách). Otestováno lokálně všech 44 úloh na obou brokerech.
- Založen projekt: živý kvíz ve stylu Mentimeteru k přednášce Teil 1 (13:15–16:30).
- Stránka pro účastníky (QR kód nebo kód z obrazovky), stránka pro přednášející (uvolňování bloků, živá statistika, zobrazení řešení).
- Otázky A–D v `fragen.js` převzaty z kontrolních otázek v prezentaci (verze 14).
- Spojení přes veřejný MQTT broker; vyzkoušeno: HiveMQ a test.mosquitto.org fungují včetně retained zpráv, EMQX a Eclipse z této sítě ne.
- Lokálně otestováno: připojení účastníka, uvolnění bloku, odpovědi, statistika s 9 simulovanými zařízeními, obnovení stránky přednášejícího.
- `buehne.html`: dřívější stránka „Mitmachrunde“ pro promítání bez telefonů (22 úloh).

**Otevřené**
- Vyzkoušet se skutečnými telefony, hlavně na nemocniční wifi (porty 8884 a 8081 mohou být blokované).
- Odborná kontrola špatných odpovědí a kazuistik v `fragen.js`.
- Anatomie na telefonu: portio je malý cíl (asi 42 × 28 px), ověřit na skutečném telefonu.
- V PowerPointu (verze 14) zůstávají nedostatky: snímky 28, 45, 46, 60 bez nadpisu, snímek 36 přeplněný, 62 malé písmo, tabulka časů na snímku 4.

**Další krok**
- Podle zkoušky rozhodnout, jestli stačí veřejný broker, nebo založit vlastní (např. HiveMQ Cloud zdarma) a přihlašovací údaje dát mimo repozitář.
