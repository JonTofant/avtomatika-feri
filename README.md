# Avtomatika FERI

Statična spletna stran o študiju avtomatike in robotike na UM FERI.
HTML, CSS in JavaScript so ločeni; namestitev paketov ali gradnja nista potrebni.

## Struktura

- `index.html` – vsebina, struktura in SVG-prizori drona, satelita, robotov in vlečnega stolpa.
- `css/styles.css` – tema, postavitev in odzivni slogi, razdeljeni po sklopih.
- `js/main.js` – interaktivna zanka ter predmetnika UN in VS.
- `js/hero.js` – premikanje drona in satelita glede na položaj strani.
- `js/fiber.js` – vlečenje optičnega vlakna, valji in navijalni kolut LEOSS.
- `js/robotics.js` – vožnja dvokolesnega robota ter hoja dvonožca in štirinožca.
- `assets/images/` – fotografije projektov.
- `tests/hero.test.cjs` – preverjanje pomikanja in geometrije sledenja.
- `tests/fiber.test.cjs` – smer vlečenja, obračanje, zmanjšano gibanje in oba načina postavitve.
- `LEOSS_SOURCES.md` – viri opisa LEOSS in pojasnilo shematskega prikaza.
- `tests/robotics.test.cjs` – hoja, obračanje koles in vidnost vseh treh robotov.
- `STUDENT_PROJECT_SOURCES.md` – preverjeni viri in podatki o fotografijah študentskih del.

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

### Barve in podrobnosti ilustracij

Osnovna stran uporablja temno modro besedilo in zelen poudarek. Prizor z dronom
ima toplo ozadje, satelitski prizor modro, roboti pa mint, jantarno in vijolično
barvo. Barvne spremenljivke so v `:root`; podrobnosti SVG so v 11. sklopu CSS-ja.

Kamere, rotorji, radarski sprejemnik, sončne celice in motorni sklepi so del
obstoječih SVG-skupin, zato sledijo njihovemu gibanju. Notranji obrisi nog uporabljajo
`<use>` in lastnosti `--link-color` ter `--link-width`, da ostanejo povezani z isto
animirano potjo. Ilustracije so shematske in ne predstavljajo določene opreme inštituta.

### Animaciji v uvodu

Obe ilustraciji sta shematski in nista v merilu. Celotna geometrija je zapisana
v SVG-ju, brez slik ali animacijskih knjižnic.

- Pot drona določa atribut `d` elementa `#drone-path` (kubična Bézierjeva krivulja).
- Orbitalni lok določa `#satellite-path`. Premik navzdol vodi satelit z leve na desno;
  pomik navzgor gibanje obrne.
- `js/hero.js` bere točke na poteh in usmerja radarsko anteno ter oba snopa.
- Koordinate radarja in Zemlje v SVG-ju morajo ustrezati konstantama `RADAR` in `EARTH`.
- Pri širini vsaj 1000 px in višini vsaj 900 px uvod ostane pripet med pomikanjem.
  Dolžino tega dela določa višina `.hero` v CSS-ju. Na manjših zaslonih vsaka scena
  sledi svojemu položaju v vidnem delu strani.
- `prefers-reduced-motion` prikaže mirujoči ilustraciji in izklopi pripenjanje.
  Brez JavaScripta sta obe ilustraciji še vedno vidni v začetnem položaju.

Animacija se posodobi ob pomiku ali spremembi velikosti okna, največ enkrat na
izrisni okvir. Časovnikov, neprekinjene animacijske zanke in prestrezanja pomikanja ni.

### Robotika in berljivost

Pod prvim uvodom je temen razdelek `#robotika` s tremi SVG-roboti. Pomik strani
neposredno določa njihov položaj, vrtenje koles in korake. Noge uporabljajo
geometrijo dveh členov; med fazo opore stopalo ostane na tleh. Namizni prizor
se pripne za dodatnih 900 px pomika. Roboti se premaknejo po kratki poti
(200 SVG-enot na namizju, 80 na telefonu); vsi trije ves čas ostanejo vidni. Pomik navzgor obrne
gibanje. Zmanjšano gibanje in izklopljen JavaScript ohranita mirujoč prikaz.
Gre za shematsko ilustracijo principov, ne za simulacijo konkretnih robotov.

Opisi imajo krajše odstavke in poudarjene ključne misli. Predmetnik je privzeto
zložen; odpre se s klikom na naslov ali z izbiro študijskega programa.

### LEOSS / fotonika

Razdelek `#fotonika` za robotiko prikazuje poenostavljen vlečni stolp.
`js/fiber.js` z istim napredkom pomika poganja oznake podajanja predoblike,
tok vlakna, nasprotno vrteča se vlečna valja in navijalni kolut. Vroč vrat
predoblike ostane v peči. Pomik navzgor vrne vse dele v isti predhodni položaj.
Ne gre za procesno simulacijo ali prikaz konkretne naprave v laboratoriju.

Na dovolj velikem zaslonu se prizor pripne za dodatnih 600 px. Na manjšem
zaslonu se premika glede na lasten položaj, brez pripenjanja. Oznake korakov
so na telefonu pod ilustracijo, da ostanejo berljive. Zmanjšano gibanje
izklopi pripenjanje in prikaže mirujoč položaj; brez JS je prikaz prav tako viden.

### Študentski projekti

Razdelek `#studentski-projekti` je pred vpisom. Predstavlja magistrska dela Jona
Tofanta (2025), Paneta Andova (2025) in Uroša Kukoviča (2026), s povezavami v DKUM.
Viri, uradni naslovi in izvor slik so v `STUDENT_PROJECT_SOURCES.md`.
Slike so lokalne, prikazane v celoti (`object-fit: contain`) in imajo navedene vire.

## Preverjanje

Z nameščenim Node.js:

```sh
node --check js/main.js
node --check js/hero.js
node --check js/robotics.js
node --check js/fiber.js
node --test tests/*.test.cjs
```

Testi preverjajo obratno pomikanje, sledenje radarja, lego odtisa SAR na Zemlji,
omejitve gibanja, združevanje dogodkov in zmanjšano gibanje. Uporabljajo nadomestno
geometrijo SVG in ne nadomeščajo pregleda v brskalniku.

Dodatni regresijski test preveri, da celotne silhuete vseh treh robotov ostanejo
znotraj prizora skozi 101 položaj pomikanja na namizju in telefonu.

V brskalniku preveri obe ilustraciji pri pomikanju navzdol in navzgor, mobilni
prikaz, tipkovnično navigacijo, vseh šest gradnikov zanke ter oba predmetnika.

### Logotip Univerze v Mariboru

V glavi strani je lokalna, nespremenjena SVG-datoteka `assets/images/um-logo.svg`
namesto začetne oznake »F.«. Ohranjeni sta izvirna barva in razmerje stranic.
Vir: https://www.um.si/wp-content/themes/um_si/assets/images/logo.svg
Pravila CGP: https://www.um.si/medijsko-sredisce/komunikacijske-vsebine/cgp/
