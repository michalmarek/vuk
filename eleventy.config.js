import { registrujObrazky } from "./obrazky.js";

export default function (eleventyConfig) {
  // Statická kopie všeho z src/assets → /assets (CSS, fonty, obrázky)
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Zpracování fotek referencí (eleventy-img): shortcody dlazdiceRealizace, realizaceFoto
  registrujObrazky(eleventyConfig);

  // src/reference = jen originály pro eleventy-img, Eleventy odtud nic nerenderuje
  eleventyConfig.ignores.add("src/reference/**");

  // Kolekce výrobků, seřazená podle pole `order` (napříč jazyky)
  eleventyConfig.addCollection("vyrobek", (c) =>
    c.getFilteredByTag("vyrobek").sort((a, b) => a.data.order - b.data.order)
  );

  // Najdi překlady stránky podle sdíleného translationKey
  eleventyConfig.addFilter("translations", (all, key) =>
    (all || [])
      .filter((p) => key && p.data.translationKey === key)
      .map((p) => ({ lang: p.data.lang, url: p.url }))
  );

  // Vyber z kolekce jen položky daného jazyka
  eleventyConfig.addFilter("byLang", (items, lang) =>
    (items || []).filter((p) => p.data.lang === lang)
  );

  // Najdi URL překladu pro daný jazyk, jinak vrať fallback
  eleventyConfig.addFilter("findUrl", (alts, code, fallback) => {
    const hit = (alts || []).find((a) => a.lang === code);
    return hit ? hit.url : fallback;
  });

  // Reference ručně označené pro úvodní stránku (homepage: true)
  eleventyConfig.addFilter("naHp", (items) =>
    (items || []).filter((r) => r.homepage)
  );

  // Reference daného výrobku (pro galerii na stránce výrobku).
  // "vyrobek" smí být řetězec i pole – reference může patřit víc výrobkům.
  eleventyConfig.addFilter("proVyrobek", (items, key) =>
    (items || []).filter((r) => [].concat(r.vyrobek || []).includes(key))
  );

  // Přeložené typy reference oddělené čárkou ("typ" smí být řetězec i pole).
  eleventyConfig.addFilter("typyPopis", (typ, slovnik) =>
    [].concat(typ || []).map((k) => (slovnik && slovnik[k]) || k).join(", ")
  );

  // Název výrobku podle translationKey (pro štítky u FAQ, přeloží se sám)
  eleventyConfig.addFilter("nazevVyrobku", (items, key) => {
    const p = (items || []).find((x) => x.data.translationKey === key);
    return p ? p.data.name : key;
  });

  // FAQ relevantní k danému výrobku (q.vyrobky obsahuje klíč)
  eleventyConfig.addFilter("faqProVyrobek", (list, key) =>
    (list || []).filter((q) => (q.vyrobky || []).includes(key))
  );

  // Seskup FAQ po kategoriích, pořadí dle prvního výskytu
  eleventyConfig.addFilter("seskupKategorie", (list) => {
    const out = [];
    const idx = {};
    (list || []).forEach((q) => {
      if (!(q.kategorie in idx)) {
        idx[q.kategorie] = out.length;
        out.push({ kategorie: q.kategorie, items: [] });
      }
      out[idx[q.kategorie]].items.push(q);
    });
    return out;
  });

  // Omez pole na prvních n položek
  eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
