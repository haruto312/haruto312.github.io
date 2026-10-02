import fs from 'node:fs/promises';
const CONFIG_FILE=new URL('../crcup_streams_v2.json',import.meta.url);
const STATUS_FILE=new URL('../live-status.json',import.meta.url);
const UA='Mozilla/5.0 Chrome/124 CR-Cup-Personal-Viewer/2';
const TIMEOUT_MS=12000;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

async function get(url,opt={}){
  const c=new AbortController(),t=setTimeout(()=>c.abort(),TIMEOUT_MS);
  try{return await fetch(url,{...opt,signal:c.signal,headers:{'user-agent':UA,'accept-language':'ja,en-US;q=0.8,en;q=0.6',...(opt.headers||{})}})}
  finally{clearTimeout(t)}
}
function type(url){if(/twitch\.tv/i.test(url))return'twitch';if(/youtube\.com|youtu\.be/i.test(url))return'youtube';return'other'}
function decodeHtml(s=''){return s.replace(/&quot;/g,'"').replace(/&#39;|&#x27;/g,"'").replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')}
function meta(body,key){const e=key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const patterns=[new RegExp(`<meta[^>]+(?:property|name)=["']${e}["'][^>]+content=["']([^"']*)["']`,'i'),new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${e}["']`,'i')];for(const p of patterns){const m=body.match(p);if(m)return decodeHtml(m[1])}return null}

async function twitch(url){
  const u=new URL(url),login=u.pathname.split('/').filter(Boolean)[0];
  if(!login)return{live:false,platform:'twitch',liveUrl:url,title:null,thumbnail:null};
  const liveUrl=`https://www.twitch.tv/${login}`;
  const preview=`https://static-cdn.jtvnw.net/previews-ttv/live_user_${encodeURIComponent(login.toLowerCase())}-640x360.jpg?cb=${Date.now()}`;
  const r=await get(preview,{method:'HEAD',redirect:'manual',cache:'no-store'}),loc=r.headers.get('location')||'';
  let isLive=false;
  if(/404_preview/i.test(loc)||r.status===404)isLive=false;
  else if(r.status===200)isLive=true;
  else if(r.status>=300&&r.status<400&&loc){const f=await get(new URL(loc,preview),{method:'HEAD',redirect:'follow',cache:'no-store'});isLive=f.ok&&!/404_preview/i.test(f.url)}
  else throw new Error(`Twitch HTTP ${r.status}`);
  if(!isLive)return{live:false,platform:'twitch',liveUrl,title:null,thumbnail:null};
  let title=null,thumbnail=preview;
  try{const page=await get(liveUrl,{redirect:'follow',cache:'no-store'});if(page.ok){const body=await page.text();title=meta(body,'og:description')||meta(body,'twitter:description')||meta(body,'og:title');const image=meta(body,'og:image')||meta(body,'twitter:image');if(image)thumbnail=image}}catch{}
  if(title&&/^Twitch$/i.test(title.trim()))title=null;
  return{live:true,platform:'twitch',liveUrl,title,thumbnail};
}

async function youtube(url){
  const ch=url.replace(/\/$/,'').replace(/\/(live|streams)$/,'');
  const entry=`${ch}/live`;
  const r=await get(entry,{redirect:'follow',cache:'no-store'});
  if(!r.ok)throw new Error(`YouTube HTTP ${r.status}`);
  const body=await r.text(),final=r.url,watch=/youtube\.com\/watch\?v=|youtu\.be\//i.test(final),up=/"isUpcoming"\s*:\s*true/.test(body),now=/"isLiveNow"\s*:\s*true|"isLive"\s*:\s*true/.test(body),content=/"isLiveContent"\s*:\s*true/.test(body);
  let videoId=null;
  try{const fu=new URL(final);videoId=fu.searchParams.get('v')}catch{}
  if(!videoId){const m=body.match(/"videoId"\s*:\s*"([A-Za-z0-9_-]{11})"/);if(m)videoId=m[1]}
  if((watch&&!up&&(now||content))||(now&&!up)){
    const liveUrl=videoId?`https://www.youtube.com/watch?v=${videoId}`:final;
    const title=meta(body,'title')||meta(body,'og:title')||meta(body,'twitter:title');
    const thumbnail=meta(body,'og:image')||meta(body,'twitter:image')||(videoId?`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`:null);
    return{live:true,platform:'youtube',liveUrl,title,thumbnail};
  }
  return{live:false,platform:'youtube',liveUrl:ch,title:null,thumbnail:null};
}

async function source(url){const t=type(url);return t==='twitch'?twitch(url):t==='youtube'?youtube(url):{live:null,platform:t,liveUrl:url,title:null,thumbnail:null}}
async function player(row,old){const [team,name,urls]=row;let offline=null,ok=false;for(const url of urls||[]){try{const r=await source(url);if(r.live===true)return r;if(r.live===false){ok=true;offline??=r}}catch(e){console.warn(`[warn] ${name} ${url}: ${e?.message||e}`)}await sleep(80)}return ok?(offline||{live:false,platform:null,liveUrl:urls?.[0]||null,title:null,thumbnail:null}):(old||{live:null,platform:null,liveUrl:urls?.[0]||null,title:null,thumbnail:null})}
async function limit(items,n,fn){const out=new Array(items.length);let next=0;async function w(){while(true){const i=next++;if(i>=items.length)return;out[i]=await fn(items[i],i)}}await Promise.all(Array.from({length:Math.min(n,items.length)},w));return out}

const cfg=JSON.parse(await fs.readFile(CONFIG_FILE,'utf8'));
let prev={players:{}};try{prev=JSON.parse(await fs.readFile(STATUS_FILE,'utf8'))}catch{}
const now=new Date().toISOString(),rows=cfg.players||[],results=await limit(rows,8,async r=>({r,v:await player(r,prev.players?.[`t${r[0]}-${r[1]}`])})),players={};
for(const {r,v} of results){
  const id=`t${r[0]}-${r[1]}`,old=prev.players?.[id]||{};
  const live=v.live??null,title=live===true?(v.title||null):null,thumbnail=live===true?(v.thumbnail||null):null;
  const same=old.live===live&&old.platform===v.platform&&old.liveUrl===v.liveUrl&&old.title===title&&old.thumbnail===thumbnail;
  players[id]={live,platform:v.platform??null,liveUrl:v.liveUrl||r[2]?.[0]||null,title,thumbnail,changedAt:same?(old.changedAt||null):now};
  console.log(`${live===true?'LIVE ':live===false?'OFF  ':'?    '} ${r[1]} ${v.platform||''}${title?` | ${title}`:''}`);
}
await fs.writeFile(STATUS_FILE,JSON.stringify({version:3,generatedAt:now,players},null,2)+'\n','utf8');
console.log(`checked ${rows.length} players at ${now}`);
