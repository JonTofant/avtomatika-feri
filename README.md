# Avtomatika FERI

Statična spletna stran o študiju avtomatike in robotike na UM FERI.
HTML, CSS in JavaScript so ločeni; namestitev paketov ali gradnja nista potrebni.

## Struktura

- `index.html` – vsebina, struktura in obe SVG-ilustraciji v uvodu.
- `css/styles.css` – tema, postavitev in odzivni slogi, razdeljeni po sklopih.
- `js/main.js` – interaktivna zanka ter predmetnika UN in VS.
- `js/hero.js` – premikanje drona in satelita glede na položaj strani.
- `assets/images/` – fotografije projektov.
- `tests/hero.test.cjs` – preverjanje pomikanja in geometrije sledenja.

## Ogled

Odpri `index.html` v brskalniku. Mape `css`, `js` in `assets` naj ostanejo ob njem.
Stran uporablja sistemske pisave in nima zunanjih odvisnosti.

Po želji v korenski mapi zaženi strežnik:

```sh
python3 -m http.server 8000
```

Nato odpri <http://localhost:8000>.

## Urejanje

Barve, širino vsebine in odmike nastavi v `:root` na začetku CSS-ja.
Besedila in povezave urejaj v HTML-ju, podatke predmetnikov pa v `js/main.js`.

### Animaciji v uvodu

Obe ilustraciji sta shematski in nista v merilu. Celotna geometrija je zapisana
v SVG-ju, brez slik ali animacijskih knjižnic.

- Pot drona določa atribut `d` elementa `#drone-path` (kubična Bézierjeva krivulja).
- Orbitalni lok določa `#satellite-path`. Premik navzdol vodi satelit z leve na desno;
  pomik navzgor gibanje obrne.
- `js/hero.js` bere točke na poteh in usmerja radarsko anteno ter oba snopa.
- Koordinate radarja in Zemlje v SVG-ju morajo ustrezati konstantama `RADAR` in `EARTH`.
- Pri širini vsaj 1000 px in višini vsaj 800 px uvod ostane pripet med pomikanjem.
  Dolžino tega dela določa višina `.hero` v CSS-ju. Na manjših zaslonih vsaka scena
  sledi svojemu položaju v vidnem delu strani.
- `prefers-reduced-motion` prikaže mirujoči ilustraciji in izklopi pripenjanje.
  Brez JavaScripta sta obe ilustraciji še vedno vidni v začetnem položaju.

Animacija se posodobi ob pomiku ali spremembi velikosti okna, največ enkrat na
izrisni okvir. Časovnikov, neprekinjene animacijske zanke in prestrezanja pomikanja ni.

## Preverjanje

Z nameščenim Node.js:

```sh
node --check js/main.js
node --check js/hero.js
node --test tests/hero.test.cjs
```

Testi preverjajo obratno pomikanje, sledenje radarja, lego odtisa SAR na Zemlji,
omejitve gibanja, združevanje dogodkov in zmanjšano gibanje. Uporabljajo nadomestno
geometrijo SVG in ne nadomeščajo pregleda v brskalniku.

V brskalniku preveri obe ilustraciji pri pomikanju navzdol in navzgor, mobilni
prikaz, tipkovnično navigacijo, vseh šest gradnikov zanke ter oba predmetnika.
