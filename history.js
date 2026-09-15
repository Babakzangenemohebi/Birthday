/* روز در تاریخ: Wikimedia On This Day + ترجمه فارسی */
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
  async function getJSON(url){const r=await fetch(url,{headers:{Accept:'application/json'}});if(!r.ok)throw new Error('Wikimedia '+r.status);return r.json()}
  function pageLink(item){return item?.pages?.[0]?.content_urls?.desktop?.page||item?.pages?.[0]?.content_urls?.mobile?.page||''}
  function pageTitle(item){return item?.pages?.[0]?.normalizedtitle||item?.pages?.[0]?.title||''}
  async function cards(items,icon,title,limit=3){
    const selected=(items||[]).slice(0,limit); if(!selected.length)return `<div class="history-card"><h3>${icon} ${title}</h3><p>برای این بخش دادهٔ شاخصی پیدا نشد.</p></div>`;
    const rows=await Promise.all(selected.map(async x=>({year:x.year,text:await translate(x.text||x.description||pageTitle(x)),link:pageLink(x)})));
    return `<div class="history-card"><h3>${icon} ${title}</h3>`+rows.map(x=>`<div style="margin:10px 0"><span class="history-year">${faDigits(x.year)}</span><p>${esc(x.text)}</p>${x.link?`<a href="${esc(x.link)}" target="_blank" rel="noreferrer">📚 منبع ویکی‌پدیا</a>`:''}</div>`).join('')+`</div>`;
  }
  async function render(g){
    const box=document.getElementById('historyCard');if(!box||!g)return;
    const key=g[1]+'-'+g[2]; if(cache[key]){box.innerHTML=cache[key];return;}
    const mm=String(g[1]).padStart(2,'0'),dd=String(g[2]).padStart(2,'0');
    box.innerHTML='<div class="history-loading">⏳ در حال پیدا کردن اتفاق‌های واقعی این روز از منابع تاریخی…</div>';
    try{
      const base='https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/';
      const [all,births,deaths]=await Promise.all([getJSON(base+'all/'+mm+'/'+dd),getJSON(base+'births/'+mm+'/'+dd),getJSON(base+'deaths/'+mm+'/'+dd)]);
      const events=(all?.events||[]).filter(x=>x?.text||x?.description);
      const selected=(all?.selected||[]).filter(x=>x?.text||x?.description);
      const holiday=(all?.holidays||[]).filter(x=>x?.text||x?.description);
      const parts=[];
      parts.push(await cards(births?.births||[],'👤','چهره‌های مشهور متولدشده',3));
      parts.push(await cards(events,'🏛️','اتفاق‌های تاریخی مهم',3));
      parts.push(await cards(selected,'⭐','اتفاق‌های منتخب و جالب',3));
      parts.push(await cards(deaths?.deaths||[],'🕯️','چهره‌های سرشناس درگذشته',2));
      if(holiday.length)parts.push(await cards(holiday,'🌍','مناسبت‌ها و رویدادهای فرهنگی',2));
      const dayName=faMonths[g[1]-1]+' '+faDigits(g[2]);
      const html=`<div class="history-grid">${parts.join('')}</div><div class="history-source">📌 داده‌های تاریخی از سرویس «On This Day» ویکی‌پدیا گرفته می‌شود و متن انگلیسی در صورت نیاز به فارسی ترجمه می‌شود. ترجمه ماشینی ممکن است خطا داشته باشد؛ برای متن اصلی روی «منبع ویکی‌پدیا» بزن.</div>`;
      cache[key]=html;box.innerHTML=html;
    }catch(e){box.innerHTML='<div class="history-error">فعلاً سرویس تاریخ در دسترس نبود. بعداً دوباره امتحان کن.</div>'}
  }
  function faDigits(n){return String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d])}
  window.renderHistory=function(g){return render(g)};
  const old=window.showResult;
  if(typeof old==='function')window.showResult=async function(...args){const r=await old.apply(this,args);try{const y=Number(document.getElementById('year')?.value),m=Number(document.getElementById('month')?.value),d=Number(document.getElementById('day')?.value);if(window.jalaliToGregorian&&y&&m&&d)await render(window.jalaliToGregorian(y,m,d))}catch(e){}return r};
  document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{const y=Number(document.getElementById('year')?.value),m=Number(document.getElementById('month')?.value),d=Number(document.getElementById('day')?.value);if(window.jalaliToGregorian&&y&&m&&d)render(window.jalaliToGregorian(y,m,d))},500));
})();