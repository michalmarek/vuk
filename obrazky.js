// Zpracování fotek referencí přes @11ty/eleventy-img.
// Originály: src/reference/<slug>/01.jpg, 02.jpg … (MIMO passthrough, na web se neservírují).
// Fotky reference se načítají automaticky z její složky, seřazené dle názvu (první = hlavní).
// Varianty na webu: /foto/<slug>-<poradi>-<sirka>-<hash>.<format>
//   – slug kvůli SEO/čitelnosti, hash kvůli cache-bustingu při výměně fotky.
import Image from "@11ty/eleventy-img";
import path from "node:path";
import fs from "node:fs";

const SRC_DIR = "src/reference";
const OUT_DIR = "_site/foto";
const URL_PATH = "/foto/";
const WIDTHS = [160, 320, 640, 1024, 1600];
const FORMATS = ["webp", "jpeg"];
const IMG_EXT = /\.(jpe?g|png)$/i;

// Fotky reference = obsah složky src/reference/<slug>/, seřazené podle názvu.
function fotaReference(slug) {
  if (!slug) return [];
  const dir = path.join(SRC_DIR, String(slug));
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => IMG_EXT.test(f))
    .sort()
    .map((f) => path.join(dir, f));
}

// Název varianty: <slug>-<poradi>-<sirka>-<hash>.<format>
function filenameFormat(id, src, width, format) {
  const slug = path.basename(path.dirname(src));           // název složky reference
  const poradi = path.basename(src, path.extname(src));    // 01, 02 …
  return `${slug}-${poradi}-${width}-${id.slice(0, 8)}.${format}`;
}

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Vygeneruje (a nacachuje) varianty jedné fotky.
const meta = (src) =>
  Image(src, { widths: WIDTHS, formats: FORMATS, outputDir: OUT_DIR, urlPath: URL_PATH, filenameFormat });

// <picture> se srcset + webp a jpeg fallbackem; sizes říká, jak je obrázek v layoutu velký.
async function obrazek(src, alt, sizes, trida) {
  const m = await meta(src);
  return Image.generateHTML(m, {
    alt: alt || "",
    sizes,
    loading: "lazy",
    decoding: "async",
    ...(trida ? { class: trida } : {}),
  });
}

// URL největší webp varianty – pro lightbox.
async function velkaUrl(src) {
  const m = await meta(src);
  return m.webp[m.webp.length - 1].url;
}

// Celá dlaždice realizace do galerie na stránce výrobku.
async function dlazdiceRealizace(r, otevrit, maxNahledu = 4) {
  const fota = fotaReference(r.slug);
  const popis = `${r.nazev}, ${r.mesto}`;
  let hlavni, thumbs, dataAttrs = "";

  if (fota.length) {
    const velke = await Promise.all(fota.map(velkaUrl));
    dataAttrs = ` data-fota="${esc(JSON.stringify(velke))}" data-popis="${esc(popis)}"`;

    const hImg = await obrazek(fota[0], popis, "(max-width: 700px) 50vw, 300px");
    hlavni = `<button type="button" class="pgalerie__hlavni" data-lb="0" aria-label="${esc(otevrit)}: ${esc(popis)}">${hImg}</button>`;

    if (fota.length > 1) {
      const zbyva = fota.length - 1 - maxNahledu;
      const kusy = [];
      for (let i = 1; i < fota.length && i <= maxNahledu; i++) {
        const nImg = await obrazek(fota[i], "", "80px");
        const more = i === maxNahledu && zbyva > 0 ? `<span class="pgalerie__more">+${zbyva}</span>` : "";
        kusy.push(`<button type="button" class="pgalerie__thumb" data-lb="${i}" aria-label="${esc(otevrit)}: ${esc(popis)}">${nImg}${more}</button>`);
      }
      thumbs = kusy.join("");
    } else {
      thumbs = `<span class="pgalerie__thumb pgalerie__thumb--spacer" aria-hidden="true"></span>`;
    }
  } else {
    hlavni = `<div class="pgalerie__hlavni ph" aria-hidden="true"></div>`;
    thumbs = `<span class="pgalerie__thumb pgalerie__thumb--spacer" aria-hidden="true"></span>`;
  }

  return `<div class="pgalerie__item"${dataAttrs}>${hlavni}<div class="pgalerie__thumbs">${thumbs}</div><div class="pgalerie__caption"><span class="pgalerie__name">${esc(r.nazev)}</span><span class="pgalerie__city">${esc(r.mesto)}</span></div></div>`;
}

// Jedna fotka realizace pro úvodní stránku (1 foto = 1 reference), jinak placeholder.
async function realizaceFoto(r, variant) {
  const foto = fotaReference(r.slug)[0];
  const popis = `${r.nazev}, ${r.mesto}`;
  const trida = `realizace realizace--${variant}`;
  const sizes = variant === "wide" ? "(max-width: 700px) 100vw, 66vw" : "(max-width: 700px) 50vw, 33vw";
  if (foto) return obrazek(foto, popis, sizes, trida);
  return `<div class="${trida} ph"><span>${esc(popis)}</span></div>`;
}

// ---------------------------------------------------------------------------
// Prezentační fotky (hero, o nás, nabídka, kontakt …) – oddělené od referencí.
// Originály: src/media/ (MIMO passthrough). Varianty na web: /assets/img/.
// ---------------------------------------------------------------------------
const MEDIA_DIR = "src/media";
const MEDIA_OUT = "_site/assets/img";
const MEDIA_URL = "/assets/img/";

// Sady šířek podle role fotky na stránce.
const PROFILY = {
  hero: [480, 768, 1280, 1920, 2560], // fullbleed / velké přes půl šířky
  obsah: [480, 768, 1200],            // běžná obsahová fotka
  karta: [320, 480, 768],             // karty výrobků, foto-pás
};

// Cesta v datech ("/assets/img/09.jpg" i "09.jpg") → originál v src/media/.
const mediaZdroj = (cesta) => path.join(MEDIA_DIR, path.basename(String(cesta)));

const mediaFilename = (id, src, width, format) =>
  `${path.basename(src, path.extname(src))}-${width}-${id.slice(0, 8)}.${format}`;

async function obrazekMedia(cesta, alt, trida, sizes, profil) {
  const src = mediaZdroj(cesta);
  if (!fs.existsSync(src)) {
    console.warn(`[media] fotka chybí: ${cesta} (${src})`);
    return "";
  }
  const m = await Image(src, {
    widths: PROFILY[profil] || PROFILY.obsah,
    formats: ["webp"], // jen webp → generateHTML vrátí čistý <img srcset> bez <picture> wrapperu
    outputDir: MEDIA_OUT,
    urlPath: MEDIA_URL,
    filenameFormat: mediaFilename,
  });
  const jeHero = profil === "hero";
  return Image.generateHTML(m, {
    alt: alt || "",
    sizes: sizes || "100vw",
    loading: jeHero ? "eager" : "lazy",      // hero je nad přehybem
    decoding: "async",
    ...(jeHero ? { fetchpriority: "high" } : {}),
    ...(trida ? { class: trida } : {}),
  });
}

export function registrujObrazky(eleventyConfig) {
  eleventyConfig.addNunjucksAsyncShortcode("dlazdiceRealizace", (r, otevrit) => dlazdiceRealizace(r, otevrit));
  eleventyConfig.addNunjucksAsyncShortcode("realizaceFoto", (r, variant) => realizaceFoto(r, variant));
  // obrazek(cesta, alt, trida, sizes, profil) – profil: "hero" | "obsah" | "karta"
  eleventyConfig.addNunjucksAsyncShortcode("obrazek", (cesta, alt, trida, sizes, profil) =>
    obrazekMedia(cesta, alt, trida, sizes, profil)
  );
}
