/* روز در تاریخ: Wikimedia + NASA APOD + MusicBrainz + ترجمه فارسی */
(function(){
  const cache={};
  const faMonths=['ژانویه','فوریه','مارس','آوریل','مه','ژوئن','ژوئیه','اوت','سپتامبر','اکتبر','نوامبر','دسامبر'];
  const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const translateCache={};
  async function translate(text){
    text=String(text||'').trim(); if(!text)return '';
    if(/^[\u0600-\u06ff\s\d۰-۹،؛:«»()\-–—.,!?]+$/.test(text))return text;
    if(translateCache[text])return translateCache[text];
    try{
      const url='https://api.mymemory.translated.net/get?q='+encodeURIComponent(text.slice(0,500))+'&langpair=en|fa';
      const r=await fetch(url); if(!r.ok)throw new Error('translation');
      const j=await r.json(); const out=j?.responseData?.translatedText;
      if(out&&out!==text){translateCache[text]=out;return out}
    }catch(e){}
    return text;
  }
  async function getJSON(url,opts={}){const r=await fetch(url,{headers:{Accept:'application/json',...(opts.headers||{})}});if(!r.ok)throw new Error('API '+r.status);return r.json()}
  function pageLink(item){return item?.pages?.[0]?.content_urls?.desktop?.page||item?.pages?.[0]?.content_urls?.mobile?.page||''}
  function pageTitle(item){return item?.pages?.[0]?.normalizedtitle||item?.pages?.[0]?.title||''}
  async function cards(items,icon,title,limit=3){
    const selected=(items||[]).slice(0,limit); if(!selected.length)return `<div class="history-card"><h3>${icon} ${title}</h3><p>برای این بخش دادهٔ شاخصی پیدا نشد.</p></div>`;
    const rows=await Promise.all(selected.map(async x=>({year:x.year,text:await translate(x.text||x.description||pageTitle(x)),link:pageLink(x)})));
    return `<div class="history-card"><h3>${icon} ${title}</h3>`+rows.map(x=>`<div style="margin:10px 0"><span class="history-year">${faDigits(x.year)}</span><p>${esc(x.text)}</p>${x.link?`<a href="${esc(x.link)}" target="_blank" rel="noreferrer">📚 منبع ویکی‌پدیا</a>`:''}</div>`).join('')+`</div>`;
  }
  async function nasaCard(iso){
    try{
      const j=await getJSON('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date='+iso+'&thumbs=true');
      if(!j?.title)return '';
      const title=await translate(j.title); const explanation=await translate(j.explanation||'');
      const media=j.media_type==='image'?(j.hdurl||j.url):j.thumbnail_url;
      return `<div class="history-card nasa-card"><h3>🚀 تصویر نجومی ناسا در این تاریخ</h3>${media?`<a href="${esc(j.hdurl||j.url||j.thumbnail_url||'')}" target="_blank" rel="noreferrer"><img class="history-apod" src="${esc(media)}" alt="${esc(title)}" loading="lazy"></a>`:''}<div class="history-nasa-title">${esc(title)}</div><p>${esc(explanation)}</p><a href="${esc(j.url||j.hdurl||'')}" target="_blank" rel="noreferrer">🔭 منبع NASA APOD</a></div>`;
    }catch(e){return ''}
  }
  async function musicCard(iso){
    try{
      const q='date:'+iso;
      const url='https://musicbrainz.org/ws/2/release/?query='+encodeURIComponent(q)+'&fmt=json&limit=5';
      const j=await getJSON(url);
      const rows=(j?.releases||[]).filter(x=>x?.title).slice(0,4);
      if(!rows.length)return '';
      return `<div class="history-card"><h3>🎵 آثار موسیقی ثبت‌شده در این تاریخ</h3>`+rows.map(x=>{
        const artists=(x['artist-credit']||[]).map(a=>a?.name||a?.artist?.name).filter(Boolean).join('، ');
        const mb='https://musicbrainz.org/release/'+encodeURIComponent(x.id||'');
        return `<div style="margin:10px 0"><div class="history-nasa-title">${esc(x.title)}</div><p>${artists?`هنرمند: ${esc(artists)}<br>`:''}تاریخ انتشار: ${esc(x.date||iso)}</p>${x.id?`<a href="${mb}" target="_blank" rel="noreferrer">🎼 منبع MusicBrainz</a>`:''}</div>`;
      }).join('')+`</div>`;
    }catch(e){return ''}
  }
  async function render(g){
    const box=document.getElementById('historyCard');if(!box||!g)return;
    const key=g[1]+'-'+g[2]+'-'+g[0]; if(cache[key]){box.innerHTML=cache[key];return;}
    const mm=String(g[1]).padStart(2,'0'),dd=String(g[2]).padStart(2,'0');
    const iso=`${g[0]}-${mm}-${dd}`;
    box.innerHTML='<div class="history-loading">⏳ در حال پیدا کردن داده‌های واقعی این روز از چند منبع معتبر…</div>';
    try{
      const base='https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/';
      const [all,births,deaths,nasa,music]=await Promise.all([
        getJSON(base+'all/'+mm+'/'+dd),
        getJSON(base+'births/'+mm+'/'+dd),
        getJSON(base+'deaths/'+mm+'/'+dd),
        Number(g[0])>=1995 && Number(g[0])<=new Date().getFullYear() ? nasaCard(iso) : Promise.resolve(''),
        musicCard(iso)
      ]);
      const events=(all?.events||[]).filter(x=>x?.text||x?.description);
      const selected=(all?.selected||[]).filter(x=>x?.text||x?.description);
      const holiday=(all?.holidays||[]).filter(x=>x?.text||x?.description);
      const parts=[];
      parts.push(await cards(births?.births||[],'👤','چهره‌های مشهور متولدشده',3));
      parts.push(await cards(events,'🏛️','اتفاق‌های تاریخی مهم',3));
      parts.push(await cards(selected,'⭐','اتفاق‌های منتخب و جالب',3));
      parts.push(await cards(deaths?.deaths||[],'🕯️','چهره‌های سرشناس درگذشته',2));
      if(holiday.length)parts.push(await cards(holiday,'🌍','مناسبت‌ها و رویدادهای فرهنگی',2));
      if(nasa)parts.push(nasa);
      if(music)parts.push(music);
      const html=`<div class="history-grid">${parts.join('')}</div><div class="history-source">📌 منابع: Wikimedia On This Day برای تاریخ و چهره‌ها، NASA APOD برای تصویر نجومی روز و MusicBrainz برای آثار موسیقی. متن انگلیسی در صورت نیاز به فارسی ترجمه می‌شود؛ ترجمه ماشینی ممکن است خطا داشته باشد.</div>`;
      cache[key]=html;box.innerHTML=html;
    }catch(e){box.innerHTML='<div class="history-error">فعلاً یکی از سرویس‌های تاریخ در دسترس نبود. بعداً دوباره امتحان کن.</div>'}
  }
  function faDigits(n){return String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d])}
  window.renderHistory=function(g){return render(g)};
  const old=window.showResult;
  if(typeof old==='function')window.showResult=async function(...args){const r=await old.apply(this,args);try{const y=Number(document.getElementById('year')?.value),m=Number(document.getElementById('month')?.value),d=Number(document.getElementById('day')?.value);if(window.jalaliToGregorian&&y&&m&&d)await render(window.jalaliToGregorian(y,m,d))}catch(e){}return r};
  document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{const y=Number(document.getElementById('year')?.value),m=Number(document.getElementById('month')?.value),d=Number(document.getElementById('day')?.value);if(window.jalaliToGregorian&&y&&m&&d)render(window.jalaliToGregorian(y,m,d))},500));
})();