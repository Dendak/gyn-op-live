# Poznámky

## 2026-11-24

**Hotovo**
- Založen projekt: živý kvíz ve stylu Mentimeteru k přednášce Teil 1 (13:15–16:30).
- Stránka pro účastníky (QR kód nebo kód z obrazovky), stránka pro přednášející (uvolňování bloků, živá statistika, zobrazení řešení).
- 31 otázek v 7 blocích v `fragen.js`, převzato z kontrolních otázek v prezentaci (verze 14).
- Spojení přes veřejný MQTT broker; vyzkoušeno: HiveMQ a test.mosquitto.org fungují včetně retained zpráv, EMQX a Eclipse z této sítě ne.
- Lokálně otestováno: připojení účastníka, uvolnění bloku, odpovědi, statistika s 9 simulovanými zařízeními, obnovení stránky přednášejícího.
- `buehne.html`: dřívější stránka „Mitmachrunde“ pro promítání bez telefonů (22 úloh).

**Otevřené**
- Vyzkoušet se skutečnými telefony, hlavně na nemocniční wifi (porty 8884 a 8081 mohou být blokované).
- Odborná kontrola špatných odpovědí v `fragen.js`.
- V PowerPointu (verze 14) zůstávají nedostatky: snímky 28, 45, 46, 60 bez nadpisu, snímek 36 přeplněný, 62 malé písmo, tabulka časů na snímku 4.

**Další krok**
- Podle zkoušky rozhodnout, jestli stačí veřejný broker, nebo založit vlastní (např. HiveMQ Cloud zdarma) a přihlašovací údaje dát mimo repozitář.
