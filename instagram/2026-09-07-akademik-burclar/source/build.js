const fs = require('fs');
const path = require('path');
const sharp = require('C:/Users/DELL/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');

const ROOT = path.resolve(__dirname, '..');
const GENERATED = path.join(ROOT, 'source', 'generated');
const EXPORT = path.join(ROOT, 'export');
const API = path.join(ROOT, 'api');
const PROOF = path.join(ROOT, 'proof');

const C = {
  cream: '#F1EDE4',
  paper: '#FBF9F5',
  ink: '#141816',
  muted: '#68706C',
  line: '#D9D3C7',
  green: '#0B6E52',
  bright: '#1DBA8B',
  mint: '#DDE9E2',
  night: '#0A0C0B',
  nightSurface: '#141917',
  nightLine: '#27322E',
  nightMuted: '#98A09B',
};

const FONT = `'Segoe UI', Arial, sans-serif`;
const MONO = `'Cascadia Mono', 'SFMono-Regular', monospace`;
const MARK_BODY = 'M0 0C-47.329 0-94.659 .079-141.987-.109-147.361-.13-149.127 .765-148.932 6.685-145.396 113.504-67.17 202.038 39.933 220.075 163.383 240.865 281.376 157.595 301.093 35.814 302.718 25.78 303.618 15.721 303.844 5.561 303.937 1.357 302.908-.302 298.314-.099 290.255 .256 282.15 .32 274.1-.118 269.081-.391 267.717 1.42 267.155 6.075 264.596 27.269 258.701 47.466 247.117 65.766 244.03 70.642 240.486 75.17 236.316 79.23 217.989 97.077 195.294 96.394 178.151 77.297 162.984 60.401 155.981 39.881 151.496 18.292 151.093 16.351 150.7 14.406 150.384 12.45 148.373 .001 148.381 0 135.931 0 90.62 0 45.31 0 0 0';
const MARK_EYE = 'M0 0C0-8.048-6.524-14.573-14.573-14.573-22.621-14.573-29.145-8.048-29.145 0-29.145 8.048-22.621 14.573-14.573 14.573-6.524 14.573 0 8.048 0 0';

function esc(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function doc(background, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350"><rect width="1080" height="1350" fill="${background}"/>${body}</svg>`;
}

function mark(x, y, width, color, background) {
  return `<svg x="${x}" y="${y}" width="${width}" height="${width * 0.55}" viewBox="0 40 574 280"><path transform="matrix(1,0,0,-1,209.5484,319.1825)" d="${MARK_BODY}" fill="${color}"/><path transform="matrix(1,0,0,-1,377.4265,177.51068)" d="${MARK_EYE}" fill="${background}"/></svg>`;
}

function textLines(x, y, rows, color, size, gap, weight = 680, spacing = -1.2) {
  return `<text x="${x}" y="${y}" fill="${color}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" letter-spacing="${spacing}">${rows.map((row, index) => `<tspan x="${x}" dy="${index ? gap : 0}">${esc(row)}</tspan>`).join('')}</text>`;
}

function mono(x, y, value, color, size = 20, anchor = 'start') {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${color}" font-family="${MONO}" font-size="${size}" font-weight="800" letter-spacing="2.2">${esc(value)}</text>`;
}

function orbit(cx, cy, radius, color, dotColor, phase = 0) {
  const x = cx + Math.cos(phase) * radius;
  const y = cy + Math.sin(phase) * radius;
  return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${color}" stroke-width="3" stroke-dasharray="7 12"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" fill="${dotColor}"/>`;
}

function footer(index, dark = false) {
  const muted = dark ? C.nightMuted : C.muted;
  const line = dark ? C.nightLine : C.line;
  return `<path d="M72 1234H1008" stroke="${line}" stroke-width="2"/><text x="72" y="1286" fill="${muted}" font-family="${MONO}" font-size="18" font-weight="750" letter-spacing="1.4">AKADEMİK GÖKYÜZÜ · 7—13 EYLÜL</text><text x="1008" y="1286" text-anchor="end" fill="${muted}" font-family="${MONO}" font-size="18" font-weight="750">${String(index).padStart(2, '0')} / 08</text>`;
}

function cover() {
  return doc(C.cream, `
    ${mono(72, 96, 'HAFTALIK GÖZLEM · 01', C.green)}
    ${mark(858, 70, 150, C.green, C.cream)}
    ${textLines(72, 315, ['HAFTANIN', 'AKADEMİK', 'BURÇLARI'], C.ink, 93, 96, 820, -3.8)}
    <text x="76" y="684" fill="${C.green}" font-family="${FONT}" font-size="43" font-weight="720">Merkür notlarda.</text>
    <text x="76" y="743" fill="${C.muted}" font-family="${FONT}" font-size="43" font-weight="620">Mola yükselende.</text>
    <g transform="translate(764 830)">
      ${orbit(102, 102, 92, C.line, C.green, -0.35)}
      ${orbit(102, 102, 53, C.line, C.ink, 2.35)}
      <circle cx="102" cy="102" r="18" fill="${C.green}"/>
    </g>
    ${mono(72, 1080, 'KAYDIR · BURCUNU BUL', C.muted, 19)}
    <path d="M72 1116H398" stroke="${C.green}" stroke-width="5" stroke-linecap="round"/>
    <path d="M374 1094l24 22-24 22" fill="none" stroke="${C.green}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    ${footer(1)}
  `);
}

const pairs = [
  {
    top: { sign: 'KOÇ', code: '01', lines: ['Bu hafta sorunun cevabı C çıkacak.', 'Sen cevabını değiştirmeyecek, soruyla', 'kişisel husumet başlatacaksın.'] },
    bottom: { sign: 'BOĞA', code: '02', lines: ['Her zamanki masan bir kez dolu çıkabilir.', 'Başka yere oturacaksın; ruhun yine', 'o masada kalacak.'] },
  },
  {
    top: { sign: 'İKİZLER', code: '03', lines: ['Üç ders, altı sekme, iki video açacaksın.', 'Henüz hiçbirine çalışmıyorsun.', 'Şu an sistem kuruluyor.'] },
    bottom: { sign: 'YENGEÇ', code: '04', lines: ['2019’dan kalma notlarını yine atamayacaksın.', 'Çalışmıyorsun ama aranızda', 'duygusal bir bağ var.'] },
  },
  {
    top: { sign: 'ASLAN', code: '05', lines: ['Bir konu bitecek. Defter yavaşça kapanacak.', 'Kimse fark etmese de görünmez kameraya', 'başarı pozu verilecek.'] },
    bottom: { sign: 'BAŞAK', code: '06', lines: ['Başlıklar hizalı, renk kodları kusursuz.', 'Konu daha başlamadı ama sayfan', 'akademik kadroya hazır.'] },
  },
  {
    top: { sign: 'TERAZİ', code: '07', lines: ['Hangi derse çalışacağına karar veremeyip', 'ikisini de açacaksın. Üçüncü seçenek', 'olarak kahve güçlü görünüyor.'] },
    bottom: { sign: 'AKREP', code: '08', lines: ['Deneme sonucun sorulacak.', '“Normal.” deyip kişisel rekorunu yine', 'devlet sırrı yapacaksın.'] },
  },
  {
    top: { sign: 'YAY', code: '09', lines: ['Beş dakikalık molaya çıkacaksın.', 'Konum bilgin en son kahve sırasında', 'görülecek.'] },
    bottom: { sign: 'OĞLAK', code: '10', lines: ['Mola 10.00’da. 09.59’da mola teklif eden', 'arkadaşınla akademik ilişkilerini', 'gözden geçireceksin.'] },
  },
  {
    top: { sign: 'KOVA', code: '11', lines: ['Herkes aynı kaynaktayken 2008’de yüklenmiş,', '14 kez indirilmiş bir PDF bulacaksın.', '“Asıl kaynak bu.”'] },
    bottom: { sign: 'BALIK', code: '12', lines: ['Bir paragraf okuyup zihninde mezun olacak,', 'taşınacak ve hayatını kuracaksın.', 'Kitap aynı paragrafta kalacak.'] },
  },
];

function signBlock(item, y, colors, variant) {
  const symbol = variant === 0
    ? `<circle cx="926" cy="${y + 38}" r="34" fill="none" stroke="${colors.line}" stroke-width="3"/><circle cx="926" cy="${y + 38}" r="8" fill="${colors.accent}"/>`
    : `<path d="M884 ${y + 38}H968M926 ${y - 4}V${y + 80}" stroke="${colors.line}" stroke-width="3" stroke-linecap="round"/><circle cx="926" cy="${y + 38}" r="11" fill="${colors.accent}"/>`;
  return `
    ${mono(72, y, item.code, colors.accent, 18)}
    <text x="72" y="${y + 91}" fill="${colors.fg}" font-family="${FONT}" font-size="69" font-weight="820" letter-spacing="-2.5">${esc(item.sign)}</text>
    ${symbol}
    ${textLines(76, y + 169, item.lines, colors.muted, 34, 48, 610, -0.5)}
  `;
}

function pairCard(pair, index) {
  const dark = index % 2 === 1;
  const background = dark ? C.night : C.cream;
  const colors = {
    fg: dark ? C.cream : C.ink,
    muted: dark ? C.nightMuted : C.muted,
    accent: dark ? C.bright : C.green,
    line: dark ? C.nightLine : C.line,
  };
  return doc(background, `
    ${mono(72, 84, 'AKADEMİK GÖKYÜZÜ', colors.accent, 18)}
    ${mark(890, 54, 118, colors.fg, background)}
    ${signBlock(pair.top, 168, colors, 0)}
    <path d="M72 651H1008" stroke="${colors.line}" stroke-width="3"/>
    ${signBlock(pair.bottom, 742, colors, 1)}
    ${footer(index + 2, dark)}
  `);
}

function close() {
  return doc(C.mint, `
    ${mono(72, 96, 'ARAŞTIRMA SONUCU', C.green)}
    ${mark(858, 70, 150, C.green, C.mint)}
    ${textLines(72, 312, ['Bilimsel', 'dayanak:'], C.ink, 86, 92, 800, -3)}
    <text x="72" y="510" fill="${C.green}" font-family="${FONT}" font-size="86" font-weight="820" letter-spacing="-3">aramızda yok.</text>
    <rect x="72" y="627" width="936" height="168" rx="34" fill="${C.paper}" stroke="${C.line}" stroke-width="3"/>
    ${mono(112, 683, 'ŞÜPHELİ DERECEDE TANIDIK', C.muted, 18)}
    <text x="112" y="756" fill="${C.ink}" font-family="${FONT}" font-size="54" font-weight="780">evet.</text>
    ${textLines(72, 952, ['Bir arkadaşın aklına geldiyse', 'yıldızlar görevini yaptı.'], C.ink, 43, 58, 680, -1.2)}
    <path d="M72 1110H544" stroke="${C.green}" stroke-width="5" stroke-linecap="round"/>
    <circle cx="572" cy="1110" r="9" fill="${C.green}"/>
    <circle cx="613" cy="1110" r="5" fill="${C.green}"/>
    ${footer(8)}
  `);
}

const assets = [
  ['01-kapak-1080x1350', cover()],
  ...pairs.map((pair, index) => [`${String(index + 2).padStart(2, '0')}-${pair.top.sign.toLocaleLowerCase('tr-TR')}-${pair.bottom.sign.toLocaleLowerCase('tr-TR')}-1080x1350`, pairCard(pair, index)]),
  ['08-kapanis-1080x1350', close()],
];

async function render(name, svg) {
  fs.mkdirSync(GENERATED, { recursive: true });
  fs.mkdirSync(EXPORT, { recursive: true });
  fs.mkdirSync(API, { recursive: true });
  fs.writeFileSync(path.join(GENERATED, `${name}.svg`), svg, 'utf8');
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(EXPORT, `${name}.png`));
  const apiName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/İ/g, 'I');
  await sharp(Buffer.from(svg)).flatten({ background: '#ffffff' }).jpeg({ quality: 94, chromaSubsampling: '4:4:4' }).toFile(path.join(API, `${apiName}.jpg`));
}

async function contactSheet() {
  const width = 1280;
  const thumbWidth = 250;
  const thumbHeight = 313;
  const columns = 4;
  const parts = [];

  for (let index = 0; index < assets.length; index += 1) {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const x = 58 + col * 305;
    const y = 170 + row * 388;
    const thumb = await sharp(path.join(EXPORT, `${assets[index][0]}.png`)).resize(thumbWidth, thumbHeight).png().toBuffer();
    parts.push({ input: thumb, left: x, top: y });
    parts.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${thumbWidth}" height="42"><text x="${thumbWidth / 2}" y="28" text-anchor="middle" fill="${C.ink}" font-family="${MONO}" font-size="16" font-weight="800">${String(index + 1).padStart(2, '0')}</text></svg>`), left: x, top: y + thumbHeight + 14 });
  }

  parts.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="130">${mono(58, 42, 'PAZARTESİ · 7 EYLÜL 2026', C.green, 18)}<text x="58" y="100" fill="${C.ink}" font-family="${FONT}" font-size="38" font-weight="800">Haftanın Akademik Burçları</text></svg>`), left: 0, top: 30 });
  fs.mkdirSync(PROOF, { recursive: true });
  await sharp({ create: { width, height: 980, channels: 4, background: C.paper } }).composite(parts).png().toFile(path.join(PROOF, 'akademik-burclar-genel-gorunum.png'));
}

(async () => {
  for (const [name, svg] of assets) await render(name, svg);
  await contactSheet();
  console.log('8 carousel kartı ve genel görünüm hazırlandı.');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
