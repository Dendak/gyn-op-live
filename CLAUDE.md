# Gyn-OP Live

Živý kvíz k německé přednášce „Anatomie und kleine gynäkologische Eingriffe“ (Teil 1) pro OP-Pflege, ve stylu Mentimeteru.
Rozhraní je německy, s uživatelem se mluví česky.

## Struktura

- `index.html` + `teilnehmen.js`: stránka pro účastníky (telefon), kód přichází v `?c=`.
- `host.html` + `host.js`: stránka pro přednášející: QR kód, uvolňování bloků, živá statistika.
- `live.js`: společné: spojení přes veřejný MQTT broker, formát kódu, pomocné funkce.
- `fragen.js`: všechny otázky. `c` je pozice správné odpovědi (0 = A).
- `buehne.html`: samostatná stránka „Mitmachrunde“ pro promítání bez telefonů (jeden soubor, vše uvnitř).
- `lib/`: MQTT.js a qrcode-generator, vložené přímo, žádné CDN.

## Jak to funguje

Bez serveru a bez buildu. Kód pro účastníky = číslice brokeru (1, 2) + název místnosti.
Témata: `q7lv1/<místnost>/state` (přednášející, seznam uvolněných bloků) a `q7lv1/<místnost>/p/<id>` (odpovědi jednoho zařízení).
Obojí jsou retained zprávy, takže obnovení stránky nic neztratí. Přes broker nejdou jména ani texty otázek.

## Nasazení

GitHub Pages z větve `main`, kořen repozitáře. Push na `main` = nasazeno.
Kontrola po nasazení: https://dendak.github.io/gyn-op-live/host.html

## Pozor

- Odborný obsah: správné odpovědi a vysvětlení jsou ze snímků přednášky, špatné možnosti jsou doplněné a čekají na odbornou kontrolu.
- Veřejný broker nemá zaručenou dostupnost. Při změně brokerů v `live.js` se mění i číslice v kódu.
