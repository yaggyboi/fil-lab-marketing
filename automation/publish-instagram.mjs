import fs from 'node:fs/promises';

const GRAPH_VERSION = 'v23.0';
const planPath = process.argv[2];
const token = process.env.META_ACCESS_TOKEN?.trim();

if (!planPath) throw new Error('Yayın planı yolu eksik.');
if (!token) throw new Error('META_ACCESS_TOKEN tanımlı değil.');

const plan = JSON.parse(await fs.readFile(planPath, 'utf8'));

function istanbulDate() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: plan.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function mediaUrl(relativePath) {
  return `${plan.mediaBaseUrl.replace(/\/$/, '')}/${relativePath.split('/').map(encodeURIComponent).join('/')}`;
}

async function graphGet(endpoint, params = {}) {
  const url = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/${endpoint}`);
  for (const [key, value] of Object.entries({ ...params, access_token: token })) url.searchParams.set(key, value);
  const response = await fetch(url);
  const payload = await response.json();
  if (!response.ok || payload.error) throw new Error(payload?.error?.message || `Meta HTTP ${response.status}`);
  return payload;
}

async function graphPost(endpoint, params) {
  const response = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${endpoint}`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ ...params, access_token: token }),
  });
  const payload = await response.json();
  if (!response.ok || payload.error) throw new Error(payload?.error?.message || `Meta HTTP ${response.status}`);
  return payload;
}

async function waitUntilReady(containerId) {
  for (let attempt = 0; attempt < 18; attempt += 1) {
    const payload = await graphGet(containerId, { fields: 'status_code' });
    if (payload.status_code === 'FINISHED') return;
    if (payload.status_code === 'ERROR' || payload.status_code === 'EXPIRED') {
      throw new Error(`Meta görsel hazırlama durumu: ${payload.status_code}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  throw new Error('Meta görselleri zamanında hazırlayamadı.');
}

async function assertMediaAccessible() {
  for (const item of plan.media) {
    const response = await fetch(mediaUrl(item.path), { method: 'HEAD' });
    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || !contentType.startsWith('image/jpeg')) {
      throw new Error(`Görsel erişilemiyor: ${item.path}`);
    }
  }
}

async function alreadyPublished() {
  const recent = await graphGet(`${plan.instagramUserId}/media`, {
    fields: 'id,caption,timestamp',
    limit: '25',
  });
  return (recent.data || []).some((item) => item.caption?.trim() === plan.caption.trim());
}

async function main() {
  if (process.env.GITHUB_EVENT_NAME === 'schedule' && istanbulDate() !== plan.publishDate) {
    console.log('Hedef tarih değil; yayın yapılmadı.');
    return;
  }
  if (plan.format !== 'CAROUSEL' || plan.media.length < 2 || plan.media.length > 10) {
    throw new Error('Karusel planı 2–10 görsel içermeli.');
  }

  await assertMediaAccessible();
  if (await alreadyPublished()) {
    console.log('Aynı gönderi Instagram’da zaten var; tekrar yayınlanmadı.');
    return;
  }

  const children = [];
  for (const item of plan.media) {
    const child = await graphPost(`${plan.instagramUserId}/media`, {
      image_url: mediaUrl(item.path),
      is_carousel_item: 'true',
      alt_text: item.altText,
    });
    await waitUntilReady(child.id);
    children.push(child.id);
  }

  const parent = await graphPost(`${plan.instagramUserId}/media`, {
    media_type: 'CAROUSEL',
    children: children.join(','),
    caption: plan.caption,
    location_id: plan.locationId,
  });
  await waitUntilReady(parent.id);
  const published = await graphPost(`${plan.instagramUserId}/media_publish`, { creation_id: parent.id });
  console.log(`Akademik Burçlar karuseli Fil Lab konumuyla yayınlandı: ${published.id}`);
}

main().catch((error) => {
  console.error(`Yayın durduruldu: ${error.message}`);
  process.exitCode = 1;
});
