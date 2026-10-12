import fs from "node:fs";

export default function (eleventyConfig) {
  // Statická kopie všeho z src/assets → /assets (CSS, fonty, obrázky)
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

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

  // Reference daného výrobku (pro galerii na stránce výrobku)
  eleventyConfig.addFilter("proVyrobek", (items, key) =>
    (items || []).filter((r) => r.vyrobek === key)
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

  // Vrať první fotku, jejíž soubor na disku skutečně existuje; jinak null
  // (chybějící/překlepnutou cestu tak nahradíme placeholderem a upozorníme).
  eleventyConfig.addFilter("existujiciFoto", (foto) => {
    for (const p of foto || []) {
      const disk = String(p).replace(/^\/assets\//, "src/assets/");
      if (fs.existsSync(disk)) return p;
      console.warn(`[realizace] fotka zadaná, ale soubor chybí: ${p} → placeholder`);
    }
    return null;
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
