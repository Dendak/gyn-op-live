# Gyn-OP Live

Živý kvíz k německé přednášce „Anatomie und kleine gynäkologische Eingriffe“ (Teil 1) pro OP-Pflege, ve stylu Mentimeteru.
Rozhraní je německy, s uživatelem se mluví česky.

## Struktura

- `index.html` + `teilnehmen.js`: stránka pro účastníky (telefon), kód přichází v `?c=`.
- `host.html` + `host.js`: stránka pro přednášející: QR kód, uvolňování vždy celého bloku (přání uživatele: ne po jedné otázce), živá statistika podle typu úlohy.
- `live.js`: společné: spojení přes veřejný MQTT broker, formát kódu, kontrola a vyhodnocení odpovědí (`valid`, `richtig`), kresba anatomie.
- `fragen.js`: všech 44 úloh. Typy: `wahl`, `reihe`, `paare`, `auswahl`, `uhr`, `anatomie`; popis nahoře v souboru.
- `app.css` společný vzhled, `aufgaben.css` vzhled interaktivních typů úloh.
- `buehne.html`: samostatná stránka „Mitmachrunde“ pro promítání bez telefonů (jeden soubor, vše uvnitř).
- `lib/`: MQTT.js a qrcode-generator, vložené přímo, žádné CDN.

## Jak to funguje

Bez serveru a bez buildu. Kód pro účastníky = číslice brokeru (1, 2) + název místnosti.
Témata: `q7lv2/<místnost>/state` (přednášející, seznam uvolněných úloh v pořadí uvolnění) a `q7lv2/<místnost>/p/<id>` (odpovědi jednoho zařízení).
Účastník si nic nevybírá: telefon ukáže první uvolněnou úlohu, kterou ještě nemá hotovou. ID úlohy = číslo bloku + pozice (`03.2`), takže přeskládání úloh v `fragen.js` mění ID.
Při změně formátu odpovědí zvýšit číslo v `PREFIX` (`live.js`) i v klíčích localStorage.
Obojí jsou retained zprávy, takže obnovení stránky nic neztratí. Přes broker nejdou jména ani texty otázek.

## Nasazení

GitHub Pages z větve `main`, kořen repozitáře. Push na `main` = nasazeno.
Kontrola po nasazení: https://dendak.github.io/gyn-op-live/host.html

## Pozor

- Odborný obsah: správné odpovědi a vysvětlení jsou ze snímků přednášky, špatné možnosti jsou doplněné a čekají na odbornou kontrolu.
- Veřejný broker nemá zaručenou dostupnost. Při změně brokerů v `live.js` se mění i číslice v kódu.
