(function(){
  const AUDIO_API='https://discoveryprovider.audius.co/v1';
  let musicAudio=null;
  function boot(){
    document.body.insertAdjacentHTML('afterbegin',`<div class="app-loader" id="appLoader" aria-label="در حال آماده‌سازی"><div class="loader-box"><div class="loader-logo-wrap"><div class="loader-ring"></div><img class="loader-logo-img" src="zad-logo.svg" alt="زاد"></div><div class="loader-title">زاد</div><div class="loader-sub">در حال آماده‌سازی تجربهٔ تولد...</div></div></div>`);
    const panels=[...document.querySelectorAll('main.page > section')];
    const hero=document.querySelector('.hero'), birth=hero?.nextElementSibling;
    const history=panels.find(x=>x.querySelector('#historyCard'));
    const sky=panels.find(x=>x.querySelector('#skyCard'));
    const famous=panels.find(x=>x.querySelector('#famousList'));
    const search=panels.find(x=>x.querySelector('#searchBox'));
    const compare=panels.find(x=>x.querySelector('#compareResult'));
    const sound=panels.find(x=>x.querySelector('#soundBtn'));
    if(!birth)return;
    panels.forEach(x=>x.classList.add('app-view'));
    if(hero)hero.classList.add('app-view','active');
    birth.classList.add('app-view','active','home-panel');
    [history,sky,famous,search,compare,sound].forEach(x=>{if(x)x.classList.add('app-view')});
    if(hero)hero.dataset.app='home';birth.dataset.app='home';
    if(history)history.dataset.app='history';if(sky)sky.dataset.app='sky';if(famous)famous.dataset.app='famous';if(search)search.dataset.app='search';if(compare)compare.dataset.app='compare';if(sound)sound.dataset.app='sound';
    const nav=document.createElement('nav');nav.className='app-tabs';nav.setAttribute('aria-label','ناوبری اصلی');
    const tabs=[['home','⌂','خانه'],['history','📜','تاریخ'],['sky','🔭','آسمان'],['famous','👤','چهره‌ها'],['more','☷','بیشتر']];
    nav.innerHTML=tabs.map(t=>`<button class="app-tab ${t[0]==='home'?'active':''}" data-tab="${t[0]}"><span class="app-tab-icon">${t[1]}</span><span class="app-tab-label">${t[2]}</span></button>`).join('');document.body.appendChild(nav);
    function activate(tab){
      let targets=[];
      if(tab==='home')targets=[birth];
      else if(tab==='history')targets=[history];
      else if(tab==='sky')targets=[sky];
      else if(tab==='famous')targets=[famous];
      else targets=[search,compare,sound];
      panels.forEach(x=>x.classList.remove('active'));if(hero)hero.classList.remove('active');birth.classList.remove('active');
      document.querySelectorAll('.app-tab').forEach(x=>x.classList.toggle('active',x.dataset.tab===tab));
      targets.filter(Boolean).forEach(x=>x.classList.add('active'));
      window.scrollTo({top:0,behavior:'smooth'});
    }
    nav.addEventListener('click',e=>{const b=e.target.closest('.app-tab');if(b)activate(b.dataset.tab)});
    setupMusic();
    setTimeout(()=>document.getElementById('appLoader')?.classList.add('hide'),900);
  }
  async function setupMusic(){
    const old=document.getElementById('soundBtn');
    const host=old?.parentElement;
    if(!host)return;
    const player=document.createElement('div');player.className='ambient-player';player.innerHTML=`<button class="ambient-toggle" id="ambientToggle" aria-label="پخش موسیقی">▶</button><div class="ambient-info"><b>موسیقی آرام</b><span id="ambientStatus">در حال آماده‌سازی…</span></div><div class="ambient-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><button class="ambient-mute" id="ambientMute" aria-label="قطع صدا">🔊</button>`;host.insertBefore(player,old);old.style.display='none';
    const toggle=document.getElementById('ambientToggle'),mute=document.getElementById('ambientMute'),status=document.getElementById('ambientStatus');
    try{
      const r=await fetch(`${AUDIO_API}/tracks/search?query=ambient%20calm&limit=8`);const j=await r.json();
      const tracks=(j.data||[]).filter(t=>t.duration>=60&&t.duration<=420&&t.streamable!==false);
      const track=tracks[0];
      if(!track)throw new Error('no-track');
      musicAudio=new Audio(`${AUDIO_API}/tracks/${track.id}/stream`);musicAudio.loop=true;musicAudio.preload='none';musicAudio.volume=.16;
      status.textContent=`${track.title||'Ambient'} • موسیقی پس‌زمینه`;
      toggle.onclick=async()=>{if(musicAudio.paused){try{await musicAudio.play();toggle.textContent='❚❚';player.classList.add('playing')}catch(e){status.textContent='برای پخش، یک‌بار روی دکمه بزن'} }else{musicAudio.pause();toggle.textContent='▶';player.classList.remove('playing')}};
      mute.onclick=()=>{musicAudio.muted=!musicAudio.muted;mute.textContent=musicAudio.muted?'🔇':'🔊'};
      status.title='موسیقی از کاتالوگ Audius انتخاب می‌شود.';
    }catch(e){status.textContent='موسیقی آنلاین در دسترس نیست';toggle.disabled=true;toggle.textContent='—'}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
