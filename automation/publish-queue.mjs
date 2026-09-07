import fs from 'node:fs/promises';
import { decision } from './queue-core.mjs';

const repo = 'yaggyboi/fil-lab-marketing';
const stateBranch = 'codex/instagram-yayin-kayitlari';
const statePath = 'automation/yayin-kayitlari.json';
const queue = JSON.parse(await fs.readFile(new URL('./week-2026-09-07.json', import.meta.url), 'utf8'));
const checkOnly = !process.argv.includes('--publish');
const selected = process.argv.find(x => x.startsWith('--only='))?.slice(7);
const metaToken = process.env.META_ACCESS_TOKEN?.trim();
const githubToken = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const ig = '17841419549632456';
if (!metaToken || !githubToken) throw new Error('Yayın bağlantılarından biri eksik.');

async function github(endpoint, method='GET', body) {
  const r = await fetch(`https://api.github.com/repos/${repo}/${endpoint}`, {
    method, headers:{Authorization:`Bearer ${githubToken}`,Accept:'application/vnd.github+json'},
    ...(body ? {body:JSON.stringify(body)} : {}), signal:AbortSignal.timeout(30000)
  });
  const d = await r.json();
  if (!r.ok) throw new Error(`GitHub ${r.status}: yayın kaydı okunamadı/yazılamadı.`);
  return d;
}
async function state() {
  const d = await github(`contents/${statePath}?ref=${encodeURIComponent(stateBranch)}`);
  return {sha:d.sha, data:JSON.parse(Buffer.from(d.content,'base64').toString('utf8'))};
}
async function save(id, value) {
  const s = await state();
  s.data[id] = value;
  await github(`contents/${statePath}`, 'PUT', {
    message:`chore: yayın kaydı ${id} ${value.status}`, branch:stateBranch, sha:s.sha,
    content:Buffer.from(JSON.stringify(s.data,null,2)+'\n').toString('base64')
  });
}
async function graph(endpoint, params={}, method='GET') {
  const u = new URL(`https://graph.facebook.com/v23.0/${endpoint}`);
  if (method==='GET') for (const [k,v] of Object.entries(params)) u.searchParams.set(k,v);
  const r = await fetch(u, {method, headers:{Authorization:`Bearer ${metaToken}`},
    ...(method==='POST'?{body:new URLSearchParams(params)}:{}),signal:AbortSignal.timeout(45000)});
  const d = await r.json();
  if (!r.ok || d.error) throw new Error(`Meta ${r.status} / ${d.error?.code || 'hata'}: ${d.error?.message || 'İşlem doğrulanamadı.'}`);
  return d;
}
async function accessible(item) {
  const r = await fetch(item.url,{method:'HEAD',signal:AbortSignal.timeout(30000)});
  if(!r.ok || !(r.headers.get('content-type')||'').startsWith('image/jpeg')) throw new Error(`Görsel erişilemiyor: ${item.id}`);
}
async function ready(id) {
  for(let i=0;i<18;i++) {
    const s=await graph(id,{fields:'status_code'});
    if(s.status_code==='FINISHED')return;
    if(['ERROR','EXPIRED'].includes(s.status_code))throw new Error(`Görsel hazırlama başarısız: ${s.status_code}`);
    await new Promise(r=>setTimeout(r,5000));
  }
  throw new Error('Görsel hazırlama zaman aşımı.');
}
async function main() {
  const account=await graph(ig,{fields:'id,username'});
  if(account.username!=='fillaborg')throw new Error('Hedef hesap uyuşmuyor.');
  let s=await state();
  if(checkOnly)await save('_connectionCheck',{status:'checked',at:new Date().toISOString(),runId:process.env.GITHUB_RUN_ID||'local'});
  const issues=[];
  for(const item of queue.items) {
    if(selected && selected!==item.id)continue;
    try {
    const status=decision(item,s.data[item.id]);
    if(checkOnly){await accessible(item);console.log(`${item.id}: ${status} · görsel erişilebilir`);continue;}
    if(status==='review')throw new Error(`${item.id}: Önceki işlem belirsiz veya yarım; tekrar paylaşım durduruldu.`);
    if(status==='expired')throw new Error(`${item.id}: Yayın aralığı kaçırıldı; geç saatte otomatik paylaşılmadı.`);
    if(status!=='due')continue;
    if(item.dependsOn && s.data[item.dependsOn]?.status!=='published')throw new Error(`${item.id}: Önceki gönderi henüz doğrulanmadı.`);
    await accessible(item);
    // Kalıcı kilit dış etki ÖNCESİNDE yazılır. Çökme/zaman aşımında otomatik tekrar yok.
    let record={status:'preparing',at:new Date().toISOString(),title:item.title};
    await save(item.id,record);
    if(item.type==='feed') {
      const recent=await graph(`${ig}/media`,{fields:'id,caption,timestamp,permalink',limit:'25'});
      const same=recent.data?.find(x=>x.caption?.trim()===item.caption.trim());
      if(same){record={...record,status:'published',mediaId:same.id,permalink:same.permalink,publishedAt:same.timestamp};await save(item.id,record);s.data[item.id]=record;continue;}
    }
    const params={image_url:item.url};
    if(item.type==='story')params.media_type='STORIES';
    else Object.assign(params,{caption:item.caption,alt_text:item.altText,location_id:'107931614024789'});
    const container=await graph(`${ig}/media`,params,'POST');
    record={...record,containerId:container.id};await save(item.id,record);
    await ready(container.id);
    record={...record,status:'publishing'};await save(item.id,record);
    const result=await graph(`${ig}/media_publish`,{creation_id:container.id},'POST');
    // Önce medya kimliğini sakla; doğrulama kesilirse aynı içerik yeniden basılmaz.
    record={...record,status:'published',mediaId:result.id,publishedAt:new Date().toISOString()};
    await save(item.id,record);s.data[item.id]=record;
    const verified=await graph(result.id,{fields:'id,timestamp,permalink'});
    record={...record,permalink:verified.permalink,verifiedAt:new Date().toISOString()};
    await save(item.id,record);s.data[item.id]=record;
    console.log(JSON.stringify({id:item.id,mediaId:result.id,permalink:verified.permalink,status:'published'}));
    } catch(e) {
      issues.push(`${item.id}: ${e.message}`);
      console.error(issues.at(-1));
      // Sonucu belirsiz yayını tekrar etme; bağımsız sonraki günleri engelleme.
    }
  }
  if(issues.length)throw new Error(`${issues.length} yayın inceleme gerektiriyor. Başarılı yayınlar tekrar edilmeyecek.`);
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
