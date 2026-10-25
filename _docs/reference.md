# Jak přidat referenci (realizaci)

Reference = ukázka realizace, která se zobrazuje v galerii na stránce výrobku
a (volitelně) v mozaice na úvodní stránce. Přidání má **dva kroky**: záznam
v datech a složka s fotkami.

---

## 1. Záznam v `src/_data/reference.json`

Do pole přidej objekt reference:

```json
{
  "nazev": "Café Imperial",
  "mesto": "Praha",
  "slug": "cafe-imperial-praha",
  "typ": "dlazba",
  "vyrobek": ["dlazba", "obklady"],
  "homepage": true
}
```

| Pole | Význam |
|------|--------|
| `nazev` | Název objektu/realizace (zobrazí se pod fotkou). |
| `mesto` | Město (zobrazí se pod názvem). |
| `slug` | **Identifikátor** – zároveň název složky s fotkami a základ názvu souborů na webu. Viz pravidla níže. |
| `typ` | Informativní štítek u reference na homepage (např. `dlazba`, `obklady`). |
| `vyrobek` | **Pole** klíčů výrobků, pod kterými se reference ukáže v galerii. Může jich být víc – reference pak patří do víc galerií. Klíče: `dlazba`, `obklady`, `exterier`, `kachle`, `specialni`, `technicka`. |
| `homepage` | `true` = reference se objeví v mozaice na úvodní stránce (tam platí 1 reference = 1 fotka). |

### Pravidla pro `slug`

- jen malá písmena, čísla a pomlčky, **bez diakritiky a mezer** (`cafe-imperial-praha`);
- **unikátní** napříč všemi referencemi;
- **stabilní** – jednou zvolený slug neměň (je navázaný na složku fotek i na URL
  obrázků). Název reference (`nazev`) klidně měň, slug ne.

---

## 2. Fotky – složka `src/reference/<slug>/`

Pro referenci vytvoř složku pojmenovanou **přesně podle slugu** a nahraj do ní fotky:

```
src/reference/
  cafe-imperial-praha/
    01.jpg
    02.jpg
    03.jpg
```

- Fotky se **načtou automaticky** – nikde je nevypisuješ, stačí je nasypat do složky.
- **Pořadí = podle názvu souboru**, proto čísluj `01`, `02`, … (dvojciferně kvůli řazení nad 9).
- **První fotka (`01`) je hlavní** – použije se jako velká v dlaždici i na homepage.
- **Originály nahrávej velké** (ideálně min. **1600 px** na delší straně, klidně 2000 px+
  a nekomprimované jako záloha). Plugin nikdy nezvětšuje – z malého zdroje nebude ostrá velká varianta.
- Povolené formáty originálů: `jpg`, `jpeg`, `png`.
- Originály se **na web neservírují**, zůstávají tu jen jako zdroj/záloha.

Reference **bez fotek** (složka chybí nebo je prázdná) se zobrazí se šrafovaným
placeholderem – můžeš tedy záznam založit dřív než máš fotky.

---

## Co se stane na webu

- **Stránka výrobku**: velká hlavní fotka + až 4 mini náhledy s odznakem „+N",
  po kliknutí **lightbox** s velkým fotem, náhledy a listováním. Galerie odkrývá
  realizace po dávkách (tlačítko „Zobrazit další").
- **Homepage**: hlavní fotka reference v mozaice (jen reference s `homepage: true`).
- Z každého originálu se při buildu vygenerují varianty **160 / 320 / 640 / 1024 / 1600 px**
  ve **webp + jpeg**, se `srcset` – prohlížeč sám stáhne nejmenší vyhovující
  (náhled jen pár KB, lightbox velkou).

### Výsledné URL obrázků

```
/foto/<slug>-<poradi>-<sirka>-<hash>.webp
```

Příklad: `/foto/cafe-imperial-praha-01-640-a1b2c3d4.webp`

Slug v názvu pomáhá SEO/čitelnosti, `hash` se mění s obsahem fotky a zajišťuje
**cache-busting** (po výměně fotky si prohlížeč stáhne novou, ne starou z cache).

---

## Kde se mění nastavení

Generované velikosti, formáty, cílová cesta (`/foto/`) a pojmenování variant
jsou v [`obrazky.js`](../obrazky.js) v kořeni projektu. Změna velikostí se projeví
při dalším buildu (stačí přegenerovat, originály se nahrávat znovu nemusí).

## Build

```bash
npm run build
```

Nebo `npm run dev` pro živý náhled. První build s mnoha fotkami chvíli trvá
(generují se varianty), další jsou rychlé díky cache.
