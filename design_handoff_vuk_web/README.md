# Handoff: Web VUK objekt (vuk.cz), redesign

## Přehled
Nový web zakázkové keramické dílny VUK objekt s.r.o. (Plzeň). Cílem je převést návrh do znovupoužitelné šablony (téma pro CMS nebo statický generátor) se třemi typy stránek:
1. **Úvodní stránka** (desktop 1440 px + mobil 390 px)
2. **Detail výrobku**. Vzorem je *Historická dlažba*, stejnou šablonu použije všech 6 výrobků.
3. **Obecná podstránka** (Jak objednat, Časté dotazy, O nás, Kontakt). Samostatně navržená není: použije hlavičku, submenu výrobků a patičku z detailu výrobku a obsahové bloky z úvodní stránky.

Jazyky jsou CZ / DE / EN. Šablona musí počítat s vícejazyčným obsahem.

## O souborech návrhu
Soubory v `design/` jsou **referenční návrh v HTML**, ne produkční kód. Úkolem je **znovu vytvořit tento návrh v cílovém prostředí** (např. WordPress téma, Astro, Eleventy, Nuxt…) jeho vlastními postupy. Pokud prostředí ještě neexistuje, zvol vhodný framework. Návrh používá inline styly a vlastní runtime (`support.js`), ten do produkce nepřenášej. Hodnoty z něj převeď do CSS proměnných a komponent.

- `design/VUK Web.dc.html`: zdroj pravdy. Otevři v prohlížeči přes lokální server (např. `npx serve design`). Všechny tři obrazovky jsou vedle sebe.
- `VUK web - navrh (offline nahled).html`: samostatný náhled (funguje i bez serveru) s lištou přepínačů variant.
- `screenshots/`: finální podoba tří obrazovek (01 úvod desktop, 02 úvod mobil, 03 výrobek desktop).

## Finální volba variant
- **Úvodní stránka: hero „split“** (text vlevo, fotka vpravo). Fakta zapnutá, mobilní lišta Zavolat/Napsat zapnutá.
- **Detail výrobku: hero „fullbleed“** (fotka přes celou šířku). Všechny sekce zapnuté.
Druhou variantu hero implementovat nemusíš. Popis je níže jen pro úplnost.

## Věrnost
**High-fidelity.** Barvy, typografie, rozměry a texty jsou finální. Výjimkou jsou zástupné šrafované plochy (fotky realizací) a IČO `00000000`.

## Rozvržení obecně
- Obsahový kontejner: `max-width: 1200px; margin: 0 auto; padding: 0 40px` (mobil `padding: 0 20px`).
- Vertikální rytmus sekcí: 112 px (hlavní sekce), 96–104 px (detail výrobku), 72–88 px (menší pásy). Mobil: 40–56 px.
- Sekce se střídají mezi bílým (`#FFFFFF`) a krémovým (`#F4F1EA`) pozadím. Dva krémové pásy nesmí jít po sobě.
- Žádné zaoblené rohy (`border-radius: 0` všude).
- Mřížky: `grid-template-columns: minmax(0,5fr) minmax(0,7fr)` (text / obraz), 3 sloupce pro karty výrobků, 4 sloupce pro galerii realizací.

## Obrazovky

### Hlavička (desktop, všechny stránky)
- Výška 92 px, `border-bottom: 1px solid #E7E3DC`. Flex `space-between`, gap 40 px.
- Logo `assets/vuk-logo.svg`, výška 50 px.
- Navigace: Výrobky · Jak objednat · Časté dotazy · O nás · Kontakt. 15 px / 500, gap 32 px, barva `#2E2A2C`. Aktivní položka: `#AE4A84` + `border-bottom: 2px solid #AE4A84; padding-bottom: 4px`.
- Vpravo kontakt: telefon `+420 603 168 843` (Zilla Slab 700 18 px, `#AE4A84`), pod ním e-mail `vuk@vuk.cz` (14 px, `#5F595C`), gap 4 px, zarovnání vpravo.
- Přepínač jazyka CZ / DE / EN: 13 px / 600, letter-spacing .04em, gap 10 px, `padding-left: 24px; border-left: 1px solid #E7E3DC`. Aktivní jazyk `#2E2A2C` + podtržení 2 px `#AE4A84`, ostatní `#8D8589`.

### Hlavička (mobil)
- Výška 64 px, sticky nahoře, bílé pozadí, spodní linka `#E7E3DC`.
- Logo výška 34 px. Vpravo tlačítko „Menu“ + hamburger (3 × 20×2 px, gap 5 px), výška 44 px.
- **Jazyk v hlavičce není.** Je až v rozbaleném menu.
- Rozbalené menu: absolutně pod hlavičkou, bílé. Položky Zilla Slab 700 24 px, padding 16 px 0, linka `#EFEBE3`. Pod nimi CZ / DE / EN (14 px / 600).

### Submenu výrobků (všechny podstránky kromě úvodní)
Pruh hned pod hlavičkou, na úvodní stránce **není** (duplikoval by sekci „Co vyrábíme“).
- Pozadí `#F4F1EA`, `border-bottom: 1px solid #E7E3DC`.
- Uvnitř kontejneru mřížka `repeat(6, minmax(0,1fr))`.
- Položka: flex, gap 12 px, padding 16 px 14px, min-height 88 px. Ikona 44×44 px + název (Zilla Slab 700 17 px / 1.15).
- Neaktivní: průhledné pozadí, text `#2E2A2C`, ikona `#AE4A84`. Hover: pozadí `#FFFFFF`, text `#AE4A84`.
- Aktivní: pozadí `#AE4A84`, text i ikona `#FFFFFF`.
- Mobil: v návrhu není. Doporučení: vodorovně posuvný řádek ikon pod hlavičkou, nebo seznam s ikonami v rozbaleném menu.

### 1a Úvodní stránka (desktop)
1. **Hero (FINÁLNÍ: varianta „split“, popsaná na konci tohoto bodu).** Varianta „přes celou šířku“ (nepoužije se): výška 620 px, pozadí `#2E2A2C`, fotka `img/09.jpg` přes celou plochu s `opacity: .72`. Obsah zarovnán dolů, `padding-bottom: 104px`, gap 24 px, bílý text:
   - nadtitulek „Zakázková keramická dílna · Plzeň“ (13 px / 600, uppercase, letter-spacing .14em)
   - H1 „Tvoříme keramiku, která vydrží generace.“ (Zilla Slab 700 76 px / 1, max-width 760 px, text-wrap balance)
   - perex (20 px / 1.5, max-width 560 px)
   - tlačítka (padding-top 12 px, gap 12 px): primární „Zavolejte: +420 603 168 843“ (bg `#AE4A84`, padding 17px 26px, 16 px / 600, hover `#7E2F5E`), sekundární „Napište nám“ (border 1.5 px bílá, padding 16px 24px).
   **Varianta „split“ (finální)**: grid 5fr / 7fr, gap 64 px, padding 56px 0 72px. Vlevo text (H1 64 px / 1.02, text tmavý, nadtitulek `#AE4A84`, perex 19 px `#5F595C`, sekundární tlačítko s tmavým rámečkem), vpravo `img/57.jpg` výška 500 px.
2. **Co vyrábíme**: krémový pás, padding 80px 0 96px, gap 48 px.
   - Záhlaví: vlevo nadtitulek „6 oborů výroby“ (`#AE4A84`) + H2 „Co vyrábíme“ (Zilla Slab 700 56 px / 1), vpravo perex (17 px, `#5F595C`, max-width 460 px).
   - Mřížka 3 × 2, gap 24 px. **Karta**: bílé pozadí, `box-shadow: 0 1px 0 #DDD7CC`, hover `box-shadow: 0 0 0 2px #AE4A84` + název `#AE4A84`. Fotka 16:10. Přes spodní hranu fotky bílá dlaždice 96×96 px (left 28 px, bottom −44 px, `box-shadow: 0 2px 10px rgba(46,42,44,.12)`) s ikonou 68×68 px v `#AE4A84`. Tělo karty padding 64px 28px 30px: název (Zilla Slab 700 30 px / 1.08) + šipka „→“ (22 px, `#AE4A84`), pod tím popis (16 px / 1.5, `#5F595C`).
3. **Fakta** (volitelné): 4 sloupce, padding 40 px, linky nahoře i dole `#E7E3DC`. Velké číslo Zilla Slab 700 34 px `#AE4A84` + popis 15 px `#5F595C`.
4. **Jak objednat**: bílé, padding 112 px, grid 5fr / 7fr, gap 72 px. Vlevo H2 (44 px) + perex + foto `img/25.jpg` 4:3. Vpravo 6 kroků: grid 64 px / 1fr, padding 24 px 0, horní linka `#DDD7CC`. Číslo „01“ až „06“ Zilla Slab 22 px `#AE4A84`, název Zilla Slab 22 px, popis 15 px. Odkaz „Celý postup objednávky →“ (podtržení 1.5 px `#AE4A84`).
5. **Reference**: krémový pás, padding 112 px, 2 sloupce, gap 72 px. Vlevo H2 „Od Hlavního nádraží v Praze po nemocnici v Ósace“, perex, seznam 6 referencí (název 600 / typ `#8D8589`, linka `#E7E3DC`). Vpravo mozaika fotek: 1 široká 16:10 + 2 čtvercové, gap 16 px (zatím zástupné plochy).
6. **O nás**: grid 7fr / 5fr. Foto `img/61.jpg` 3:2 + H2 a dva odstavce + odkaz „Více o dílně →“.
7. **Kontaktní CTA**: pozadí `#AE4A84`, bílý text, padding 88 px, grid 7fr / 5fr. H2 48 px, perex 18 px, telefon a e-mail Zilla Slab 700 40 px. Vpravo adresa s levou linkou `rgba(255,255,255,.5)`.
8. **Patička**: `#2E2A2C`, text `#C9C3C6`, 14 px, padding 36 px. Bílé logo (výška 30 px), navigace, kontakt, © `#8D8589`.

### 1b Úvodní stránka (mobil 390 px)
Pořadí: hlavička → foto `img/57.jpg` (výška 280 px) → hero text (H1 40 px) → Co vyrábíme (krémový pás, mřížka 2 sloupce, gap 12 px, foto 4:3, dlaždice s ikonou 56×56 px / ikona 40 px, left 12 px, bottom −26 px, název Zilla Slab 18 px) → fakta 2×2 → Jak objednat (jen čísla a názvy kroků) → reference (1 foto + 4 názvy) → CTA → patička.
**Spodní lišta** (sticky bottom, výška 72 px, 2 sloupce): „Zavolat“ (bg `#AE4A84`, bílá) | „Napsat e-mail“ (bílá, tmavý text). Patička má padding-bottom 100 px, aby ji lišta nepřekrývala.

### 1c Detail výrobku (desktop)
1. Hlavička (aktivní „Výrobky“) + **submenu výrobků**.
2. **Hero (FINÁLNÍ: „přes celou šířku“)**: výška 560 px, `img/09.jpg` s opacity .7 na `#2E2A2C`, padding-bottom 88 px, gap 20 px. Drobečková navigace (13 px), H1 „Historická dlažba“ (Zilla Slab 700 80 px), podtitulek (Zilla Slab 600 26 px), tlačítka jako na úvodní stránce. Pod hero úvodní odstavec 21 px / 1.6, max-width 820 px, padding 72px 0 64px.
   Varianta „split“ (nepoužije se): grid 6fr / 6fr, gap 64 px. Text vlevo (H1 68 px, podtitulek 24 px `#AE4A84`, perex 18 px), foto 5:4 vpravo.
3. **Tři bloky**: 3 sloupce, gap 48 px, horní linka, padding-top 56 px. H3 Zilla Slab 26 px + text 16 px / 1.65.
4. **Tradiční vzory a technologie**: krémový pás, grid 7fr / 5fr. Dvě fotky 4:5 (druhá posunutá o 48 px dolů) + H2 40 px, seznam se 4 položkami (17 px / 600, linky `#DDD7CC`), poznámka 15 px.
5. **Ukázky realizací**: H2 44 px + „+42 dalších realizací“ vpravo. Mřížka 4 × 2, gap 16 px, čtvercová foto + název (15 px / 600) + město (14 px `#8D8589`).
6. **FAQ + kontakt**: grid 7fr / 5fr. FAQ jako `<details>`: otázka Zilla Slab 700 21 px, „+“ `#AE4A84`, odpověď 16 px / 1.65. Vpravo malinový box (padding 40 px): H3 30 px, text, kontaktní osoba **Jana Fialová, +420 605 217 473**, e-mail.
7. **Další výrobky**: krémový pás, 5 sloupců (zbylé výrobky), foto 4:3 + název Zilla Slab 19 px, hover `#AE4A84`.
8. Patička (s adresou).

## Interakce a chování
- Hover odkazů: `#AE4A84` → `#7E2F5E`. Primární tlačítko hover `#7E2F5E`. Sekundární tmavé tlačítko hover: pozadí `#2E2A2C`, text bílý.
- Mobilní menu: přepínač otevřeno/zavřeno (tlačítko „Menu“). Doplň zavření klávesou Esc / kliknutím mimo a `aria-expanded`.
- FAQ: nativní `<details>/<summary>`. Skrytý marker, vlastní „+“ (při otevření lze otočit na „–“).
- Telefon a e-mail jsou vždy `tel:` / `mailto:` odkazy.
- Animace žádné, přechody volitelně 150 ms ease.
- Responzivita: návrh má breakpointy 1440 a 390. Mezi nimi mřížky skládej (3 → 2 → 1 sloupec pro karty, 6 → posuvný řádek pro submenu, 5fr/7fr → pod sebou pod ~900 px).

## Finální nastavení variant
- Úvodní hero: `split`
- Hero výrobku: `fullbleed`
- Fakta: zapnuto
- Mobilní lišta Zavolat/Napsat: zapnuto

## Datový model (doporučení)
- **Výrobek**: název, slug, krátký popis (karta), ikona (SVG), náhledová fotka, hero fotka, podtitulek, úvodní text, bloky (nadpis + text) ×3, seznam „nabídka zahrnuje“, galerie realizací (foto, název, město), FAQ (otázka, odpověď), kontaktní osoba (jméno, telefon, e-mail).
- **Reference**: název, město, typ výrobku, fotky.
- **Kroky objednávky**: číslo, název, popis.
- **Globální nastavení**: telefon, e-mail, adresa, IČO, jazyky.

Pořadí výrobků: Historická dlažba, Obklady a tvarovky, Exteriérová keramika, Technická keramika, Speciální výroba, Kachle a vytápění.

## Design tokeny
**Barvy**
- `--brand` `#AE4A84` (malinová z loga)
- `--brand-dark` `#7E2F5E` (hover)
- `--ink` `#2E2A2C` (text, tmavé pozadí, patička)
- `--ink-2` `#5F595C` (sekundární text)
- `--muted` `#8D8589` (popisky, neaktivní jazyky)
- `--footer-text` `#C9C3C6`
- `--cream` `#F4F1EA` (sekundární pozadí)
- `--line` `#E7E3DC` (linky), `--line-2` `#DDD7CC` (linky na krémové), `--line-3` `#EFEBE3` (menu)
- `--white` `#FFFFFF`

**Typografie**
- Nadpisy: **Zilla Slab** 600/700 (Google Fonts).
- Text: systémové bezpatkové `"Helvetica Neue", Helvetica, Arial, sans-serif`, `-webkit-font-smoothing: antialiased`.
- Škála nadpisů (desktop): 80 / 76 / 68 / 64 / 56 / 48 / 44 / 40 / 34 / 32 / 30 / 26 / 24 / 22 / 21 / 19 / 18 / 17 px. Line-height 1–1.15.
- Text: 21 / 20 / 19 / 18 / 17 / 16 / 15 / 14 / 13 px. Line-height 1.45–1.65.
- Nadtitulky: 13 px / 600, uppercase, letter-spacing .14em.
- Mobil: H1 40, H2 30–36, karty 18 px.

**Ostatní**
- Radius: 0.
- Stíny: karta `0 1px 0 #DDD7CC`, hover karty `0 0 0 2px #AE4A84`, dlaždice ikony `0 2px 10px rgba(46,42,44,.12)`.
- Tlačítka: primární padding 17px 26px, sekundární 16px 24px s rámečkem 1.5 px. Min. dotyková plocha na mobilu 44 px.

## Assety
- `design/assets/vuk-logo.svg`, `vuk-logo-white.svg`: logo z logomanuálu.
- `design/icons/*.svg`: ikony výrobků (autor: klient), černé originály. Hotové barevné verze bez metadat: `*-brand.svg` (#AE4A84) a `*-white.svg` (aktivní položka submenu). V produkci je lepší vložit SVG inline s `fill="currentColor"` a barvit přes CSS (kvůli hoveru). Soubory obsahují velký blok `<metadata>` (C2PA), před nasazením ho odstraň nebo SVG optimalizuj (SVGO).
- `design/img/*.jpg`: fotky z dílny. Jsou dočasné, klient je nahradí fotkami hotových výrobků. Před nasazením převeď do WebP/AVIF a ve více velikostech (`srcset`).
- Fotky realizací zatím chybí (šrafované zástupné plochy).

## Otevřené body
- IČO, finální texty DE / EN.
- Fotky hotových výrobků a realizací.
- Návrh mobilního submenu výrobků a obecné podstránky.
