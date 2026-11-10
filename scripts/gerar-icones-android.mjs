// Ícones do APK a partir de public/icon.svg: ícone comum, redondo e a frente do ícone adaptável (fundo em cor sólida).
//   node scripts/gerar-icones-android.mjs   (roda no npm run apk)
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const svg = readFileSync("public/icon.svg", "utf8");
const FUNDO = svg.match(/<rect[^>]*fill="([^"]+)"/)[1];
// sem o fundo arredondado: o Android aplica a máscara dele
const desenho = svg.replace(/<rect[^>]*\/>/, "");
const RES = "android/app/src/main/res";
const TAMANHOS = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };

for (const [dens, px] of Object.entries(TAMANHOS)) {
  const cheio = svg.replace(/rx="\d+"/, 'rx="0"');
  await sharp(Buffer.from(cheio)).resize(px, px).png().toFile(`${RES}/mipmap-${dens}/ic_launcher.png`);
  const redondo = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}"><circle cx="${px / 2}" cy="${px / 2}" r="${px / 2}" fill="#fff"/></svg>`);
  await sharp(Buffer.from(cheio)).resize(px, px).composite([{ input: redondo, blend: "dest-in" }]).png().toFile(`${RES}/mipmap-${dens}/ic_launcher_round.png`);
  // frente do adaptável: 108 dp, com o desenho dentro da área segura (66 dp)
  const f = Math.round((px * 108) / 48);
  const dentro = Math.round(f * 0.66);
  const glifo = await sharp(Buffer.from(desenho)).resize(dentro, dentro).png().toBuffer();
  await sharp({ create: { width: f, height: f, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: glifo, gravity: "center" }])
    .png()
    .toFile(`${RES}/mipmap-${dens}/ic_launcher_foreground.png`);
}
writeFileSync(
  `${RES}/values/ic_launcher_background.xml`,
  `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${FUNDO}</color>\n</resources>\n`,
);
console.log("ícones gerados");
