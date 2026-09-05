const fs = require('fs');
const path = require('path');
const sharp = require('C:/Users/DELL/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');

const ROOT = path.resolve(__dirname, '..');
const EXPORT = path.join(ROOT, 'export');
const API = path.join(ROOT, 'api');
const PROOF = path.join(ROOT, 'proof');
const GENERATED = path.join(ROOT, 'source', 'generated');

const MARK_BODY = 'M0 0C-47.329 0-94.659 .079-141.987-.109-147.361-.13-149.127 .765-148.932 6.685-145.396 113.504-67.17 202.038 39.933 220.075 163.383 240.865 281.376 157.595 301.093 35.814 302.718 25.78 303.618 15.721 303.844 5.561 303.937 1.357 302.908-.302 298.314-.099 290.255 .256 282.15 .32 274.1-.118 269.081-.391 267.717 1.42 267.155 6.075 264.596 27.269 258.701 47.466 247.117 65.766 244.03 70.642 240.486 75.17 236.316 79.23 217.989 97.077 195.294 96.394 178.151 77.297 162.984 60.401 155.981 39.881 151.496 18.292 151.093 16.351 150.7 14.406 150.384 12.45 148.373 .001 148.381 0 135.931 0 90.62 0 45.31 0 0 0';
const MARK_EYE = 'M0 0C0-8.048-6.524-14.573-14.573-14.573-22.621-14.573-29.145-8.048-29.145 0-29.145 8.048-22.621 14.573-14.573 14.573-6.524 14.573 0 8.048 0 0';

function mark(x, y, width, color, background) {
  return `<svg x="${x}" y="${y}" width="${width}" height="${width * 0.55}" viewBox="0 40 574 280"><path transform="matrix(1,0,0,-1,209.5484,319.1825)" d="${MARK_BODY}" fill="${color}"/><path transform="matrix(1,0,0,-1,377.4265,177.51068)" d="${MARK_EYE}" fill="${background}"/></svg>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <rect width="1080" height="1920" fill="#0A0C0B"/>
  ${mark(858, 92, 150, '#F1EDE4', '#0A0C0B')}
  <text x="72" y="148" fill="#1DBA8B" font-family="'Cascadia Mono','SFMono-Regular',monospace" font-size="23" font-weight="800" letter-spacing="3">CUMARTESİ NOTU · 05.09</text>

  <text x="72" y="515" fill="#F1EDE4" font-family="'Segoe UI',Arial,sans-serif" font-size="84" font-weight="800" letter-spacing="-3.2">
    <tspan x="72">Cumartesi çalışmak</tspan>
    <tspan x="72" dy="98">bazen disiplin değil,</tspan>
  </text>
  <text x="72" y="790" fill="#1DBA8B" font-family="'Segoe UI',Arial,sans-serif" font-size="84" font-weight="800" letter-spacing="-3.2">
    <tspan x="72">pazar günkü kendine</tspan>
    <tspan x="72" dy="98">güvenmemektir.</tspan>
  </text>

  <text x="76" y="1076" fill="#98A09B" font-family="'Segoe UI',Arial,sans-serif" font-size="40" font-weight="620">Haklı bir tedbir.</text>

  <g transform="translate(72 1260)">
    <path d="M80 106H856" stroke="#27322E" stroke-width="5" stroke-linecap="round"/>
    <path d="M80 106H548" stroke="#1DBA8B" stroke-width="5" stroke-linecap="round"/>
    <circle cx="80" cy="106" r="20" fill="#1DBA8B"/>
    <circle cx="856" cy="106" r="20" fill="#0A0C0B" stroke="#27322E" stroke-width="5"/>
    <text x="0" y="18" fill="#F1EDE4" font-family="'Cascadia Mono','SFMono-Regular',monospace" font-size="22" font-weight="800" letter-spacing="2">CMT</text>
    <text x="0" y="178" fill="#98A09B" font-family="'Segoe UI',Arial,sans-serif" font-size="28" font-weight="600">müdahale edildi</text>
    <text x="936" y="18" text-anchor="end" fill="#F1EDE4" font-family="'Cascadia Mono','SFMono-Regular',monospace" font-size="22" font-weight="800" letter-spacing="2">PAZ</text>
    <text x="936" y="178" text-anchor="end" fill="#98A09B" font-family="'Segoe UI',Arial,sans-serif" font-size="28" font-weight="600">güven sınırlı</text>
  </g>

  <path d="M72 1718H1008" stroke="#27322E" stroke-width="2"/>
  <text x="72" y="1784" fill="#98A09B" font-family="'Cascadia Mono','SFMono-Regular',monospace" font-size="19" font-weight="750" letter-spacing="1.8">FİL LAB · HAFTA SONU KAYDI</text>
</svg>`;

(async () => {
  fs.mkdirSync(EXPORT, { recursive: true });
  fs.mkdirSync(API, { recursive: true });
  fs.mkdirSync(PROOF, { recursive: true });
  fs.mkdirSync(GENERATED, { recursive: true });
  fs.writeFileSync(path.join(GENERATED, '01-cumartesi-notu-1080x1920.svg'), svg, 'utf8');
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(EXPORT, '01-cumartesi-notu-1080x1920.png'));
  await sharp(Buffer.from(svg)).flatten({ background: '#0A0C0B' }).jpeg({ quality: 94, chromaSubsampling: '4:4:4' }).toFile(path.join(API, '01-cumartesi-notu-1080x1920.jpg'));
  await sharp(Buffer.from(svg)).resize(540, 960).png().toFile(path.join(PROOF, 'cumartesi-notu-onizleme.png'));
  console.log('Cumartesi Story görseli hazırlandı.');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
