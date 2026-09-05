const fs = require('fs');
const path = require('path');
const sharp = require('C:/Users/DELL/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');

const ROOT = path.resolve(__dirname, '..');
const VECTOR = path.join(ROOT, 'source', 'vector');
const EXPORT = path.join(ROOT, 'export');
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
};

const FONT = `'Segoe UI', Arial, sans-serif`;
const MONO = `'Cascadia Mono', 'SFMono-Regular', monospace`;

// Orijinal FilMark vektör yolu. Bu sabit varyantlar için değiştirilmez.
const MARK_BODY = 'M0 0C-47.329 0-94.659 .079-141.987-.109-147.361-.13-149.127 .765-148.932 6.685-145.396 113.504-67.17 202.038 39.933 220.075 163.383 240.865 281.376 157.595 301.093 35.814 302.718 25.78 303.618 15.721 303.844 5.561 303.937 1.357 302.908-.302 298.314-.099 290.255 .256 282.15 .32 274.1-.118 269.081-.391 267.717 1.42 267.155 6.075 264.596 27.269 258.701 47.466 247.117 65.766 244.03 70.642 240.486 75.17 236.316 79.23 217.989 97.077 195.294 96.394 178.151 77.297 162.984 60.401 155.981 39.881 151.496 18.292 151.093 16.351 150.7 14.406 150.384 12.45 148.373 .001 148.381 0 135.931 0 90.62 0 45.31 0 0 0';
const MARK_EYE = 'M0 0C0-8.048-6.524-14.573-14.573-14.573-22.621-14.573-29.145-8.048-29.145 0-29.145 8.048-22.621 14.573-14.573 14.573-6.524 14.573 0 8.048 0 0';

function filMark(id, color = C.green) {
  return `
    <defs>
      <mask id="${id}-eye" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width="574" height="318">
        <rect x="0" y="0" width="574" height="318" fill="white"/>
        <circle cx="362.8535" cy="177.51068" r="14.573" fill="black"/>
      </mask>
    </defs>
    <g mask="url(#${id}-eye)">
      <path transform="matrix(1,0,0,-1,209.5484,319.1825)" d="${MARK_BODY}" fill="${color}"/>
    </g>`;
}

function svgDoc(body, background = null) {
  const bg = background ? `<rect width="760" height="680" fill="${background}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="680" viewBox="0 0 760 680">${bg}${body}</svg>`;
}

function baseMark(id, color = C.green) {
  return `<g transform="translate(93 170)">${filMark(id, color)}</g>`;
}

function original() {
  return svgDoc(baseMark('original'));
}

function barista() {
  return svgDoc(`
    <g id="barista-accessories">
      <path d="M230 474C244 446 275 430 312 430H431C470 430 501 448 514 480L549 641H194Z" fill="${C.ink}"/>
      <path d="M267 439L310 493M473 439L431 493" fill="none" stroke="${C.cream}" stroke-width="14" stroke-linecap="round"/>
      <path d="M322 550H420V600C420 613 410 623 397 623H345C332 623 322 613 322 600Z" fill="none" stroke="${C.bright}" stroke-width="9"/>
      <path d="M565 493H642V566C642 586 626 602 606 602H601C581 602 565 586 565 566Z" fill="${C.cream}" stroke="${C.ink}" stroke-width="9"/>
      <path d="M642 515H657C677 515 686 530 686 546C686 565 673 577 653 577H642" fill="none" stroke="${C.ink}" stroke-width="9" stroke-linecap="round"/>
      <path d="M583 463C568 442 594 430 580 408M617 463C602 442 628 430 614 408" fill="none" stroke="${C.green}" stroke-width="8" stroke-linecap="round"/>
    </g>
    ${baseMark('barista')}
  `);
}

function doctor() {
  return svgDoc(`
    <g id="doctor-accessories">
      <path d="M202 309C211 215 281 160 373 160C464 160 533 216 541 309Z" fill="${C.cream}" stroke="${C.ink}" stroke-width="10" stroke-linejoin="round"/>
      <path d="M211 290C281 269 463 269 532 290" fill="none" stroke="${C.green}" stroke-width="15" stroke-linecap="round"/>
      <path d="M219 473C237 444 269 430 308 430H436C476 430 507 447 524 477L559 641H184Z" fill="${C.paper}" stroke="${C.ink}" stroke-width="9"/>
      <path d="M282 447L371 525L461 447" fill="none" stroke="${C.green}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M302 515V551C302 597 328 620 365 620C403 620 429 597 429 558V514" fill="none" stroke="${C.ink}" stroke-width="10" stroke-linecap="round"/>
      <circle cx="430" cy="504" r="22" fill="${C.cream}" stroke="${C.ink}" stroke-width="9"/>
      <circle cx="430" cy="504" r="7" fill="${C.green}"/>
    </g>
    ${baseMark('doctor')}
  `);
}

function researcher() {
  return svgDoc(`
    <g id="researcher-accessories">
      <g transform="rotate(-7 196 466)">
        <rect x="85" y="335" width="194" height="268" rx="22" fill="${C.cream}" stroke="${C.ink}" stroke-width="10"/>
        <path d="M139 335V315C139 300 151 288 166 288H199C214 288 226 300 226 315V335" fill="${C.green}" stroke="${C.ink}" stroke-width="9"/>
        <path d="M126 412H238M126 458H219M126 504H229" stroke="${C.green}" stroke-width="9" stroke-linecap="round"/>
        <circle cx="127" cy="555" r="9" fill="${C.ink}"/>
        <path d="M154 555H222" stroke="${C.line}" stroke-width="9" stroke-linecap="round"/>
      </g>
      <path d="M246 479C267 446 301 430 340 430H449C489 430 521 449 537 483L566 641H217Z" fill="${C.mint}" stroke="${C.ink}" stroke-width="9"/>
      <path d="M300 454L372 524L451 452" fill="none" stroke="${C.green}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
      <g transform="rotate(36 613 492)">
        <rect x="600" y="406" width="25" height="161" rx="12" fill="${C.green}"/>
        <path d="M600 424H625" stroke="${C.cream}" stroke-width="7"/>
        <path d="M600 557L612.5 584L625 557Z" fill="${C.ink}"/>
      </g>
    </g>
    ${baseMark('researcher')}
  `);
}

const variants = [
  ['filmark-orijinal', original()],
  ['filmark-barista', barista()],
  ['filmark-doktor', doctor()],
  ['filmark-arastirmaci', researcher()],
];

function label(x, code, title, note) {
  return `
    <text x="${x}" y="830" fill="${C.green}" font-family="${MONO}" font-size="18" font-weight="800" letter-spacing="2">${code}</text>
    <text x="${x}" y="884" fill="${C.ink}" font-family="${FONT}" font-size="38" font-weight="800" letter-spacing="-1">${title}</text>
    <text x="${x}" y="926" fill="${C.muted}" font-family="${FONT}" font-size="21" font-weight="600">${note}</text>`;
}

async function buildBoard() {
  const iconWidth = 360;
  const iconHeight = 322;
  const xPositions = [60, 540, 1020, 1500];
  const composites = [];

  for (let index = 0; index < variants.length; index += 1) {
    const icon = await sharp(Buffer.from(variants[index][1]))
      .resize(iconWidth, iconHeight, { fit: 'contain' })
      .png()
      .toBuffer();
    composites.push({ input: icon, left: xPositions[index], top: 372 });
  }

  const boardSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
    <rect width="1920" height="1080" fill="${C.cream}"/>
    <text x="60" y="78" fill="${C.green}" font-family="${MONO}" font-size="20" font-weight="800" letter-spacing="2.4">FİLMARK · KARAKTER SİSTEMİ / 01</text>
    <text x="60" y="171" fill="${C.ink}" font-family="${FONT}" font-size="74" font-weight="820" letter-spacing="-3">Aynı Fil. Farklı hâller.</text>
    <text x="60" y="226" fill="${C.muted}" font-family="${FONT}" font-size="28" font-weight="620">Ana silüet kilitli; rolü yalnızca aksesuarlar anlatıyor.</text>
    <path d="M60 292H1860" stroke="${C.line}" stroke-width="3"/>
    <path d="M480 344V974M960 344V974M1440 344V974" stroke="${C.line}" stroke-width="2"/>
    ${label(60, '00 · REFERANS', 'Orijinal', 'Değişmeyen ana katman')}
    ${label(540, '01 · KAHVE', 'Barista Fil', 'Önlük + fincan')}
    ${label(1020, '02 · SINAV', 'Doktor Fil', 'Bone + stetoskop')}
    ${label(1500, '03 · İÇERİK', 'Araştırmacı Fil', 'Notluk + kalem')}
    <path d="M60 995H1860" stroke="${C.line}" stroke-width="2"/>
    <text x="60" y="1040" fill="${C.muted}" font-family="${MONO}" font-size="16" font-weight="700" letter-spacing="1.4">V01 · AĞIZ / KOL / BACAK YOK · FİLMARK GEOMETRİSİ DEĞİŞMEDİ</text>
  </svg>`;

  await sharp(Buffer.from(boardSvg)).composite(composites).png().toFile(path.join(PROOF, 'filmark-halleri-v01.png'));
}

async function buildSmallSizeTest() {
  const xPositions = [92, 310, 528, 746];
  const labels = ['ORİJİNAL', 'BARİSTA', 'DOKTOR', 'ARAŞTIRMACI'];
  const composites = [];

  for (let index = 0; index < variants.length; index += 1) {
    const icon = await sharp(Buffer.from(variants[index][1]))
      .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    composites.push({ input: icon, left: xPositions[index], top: 102 });
  }

  const testSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="250" viewBox="0 0 900 250">
    <rect width="900" height="250" fill="${C.cream}"/>
    <text x="40" y="48" fill="${C.green}" font-family="${MONO}" font-size="16" font-weight="800" letter-spacing="1.8">64 PX OKUNURLUK KONTROLÜ</text>
    <path d="M40 72H860" stroke="${C.line}" stroke-width="2"/>
    ${labels.map((item, index) => `<text x="${xPositions[index] + 32}" y="205" text-anchor="middle" fill="${C.muted}" font-family="${MONO}" font-size="13" font-weight="800" letter-spacing="1">${item}</text>`).join('')}
  </svg>`;

  await sharp(Buffer.from(testSvg)).composite(composites).flatten({ background: C.cream }).png().toFile(path.join(PROOF, 'filmark-64px-okunurluk.png'));
}

async function main() {
  fs.mkdirSync(VECTOR, { recursive: true });
  fs.mkdirSync(EXPORT, { recursive: true });
  fs.mkdirSync(PROOF, { recursive: true });

  for (const [name, svg] of variants) {
    fs.writeFileSync(path.join(VECTOR, `${name}.svg`), svg, 'utf8');
    await sharp(Buffer.from(svg)).resize(1200, 1074, { fit: 'contain' }).png().toFile(path.join(EXPORT, `${name}-1200.png`));
  }

  await buildBoard();
  await buildSmallSizeTest();
  console.log('4 FilMark varyantı, karşılaştırma panosu ve 64 px testi hazırlandı.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
