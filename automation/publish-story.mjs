import fs from 'node:fs/promises';

const GRAPH_VERSION = 'v23.0';
const planPath = process.argv[2];
const token = process.env.META_ACCESS_TOKEN?.trim();

if (!planPath) throw new Error('Story yayın planı eksik.');
if (!token) throw new Error('META_ACCESS_TOKEN tanımlı değil.');

const plan = JSON.parse(await fs.readFile(planPath, 'utf8'));

function istanbulDate() {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: plan.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
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
    const url = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/${containerId}`);
    url.searchParams.set('fields', 'status_code');
    url.searchParams.set('access_token', token);
    const response = await fetch(url);
    const payload = await response.json();
    if (payload.status_code === 'FINISHED') return;
    if (payload.status_code === 'ERROR' || payload.status_code === 'EXPIRED' || payload.error) {
      throw new Error(payload?.error?.message || payload.status_code);
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  throw new Error('Meta Story görselini zamanında hazırlayamadı.');
}

async function main() {
  if (process.env.GITHUB_EVENT_NAME === 'schedule' && istanbulDate() !== plan.publishDate) {
    console.log('Hedef tarih değil; Story yayınlanmadı.');
    return;
  }
  const media = await fetch(plan.mediaUrl, { method: 'HEAD' });
  if (!media.ok || !(media.headers.get('content-type') || '').startsWith('image/jpeg')) {
    throw new Error('Story görseline erişilemiyor.');
  }
  const container = await graphPost(`${plan.instagramUserId}/media`, {
    image_url: plan.mediaUrl,
    media_type: 'STORIES',
  });
  await waitUntilReady(container.id);
  const published = await graphPost(`${plan.instagramUserId}/media_publish`, { creation_id: container.id });
  console.log(`Cumartesi Story yayınlandı: ${published.id}`);
}

main().catch((error) => {
  console.error(`Story yayını durduruldu: ${error.message}`);
  process.exitCode = 1;
});
