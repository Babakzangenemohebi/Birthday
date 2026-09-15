(function(){
  function boot(){
    document.body.insertAdjacentHTML('afterbegin',`<div class="app-loader" id="appLoader" aria-label="در حال آماده‌سازی"><div class="loader-box"><div style="position:relative;width:94px;height:94px;margin:auto"><div class="loader-ring"></div><div class="loader-logo">🔭</div></div><div class="loader-title">رنگِ درون من</div><div class="loader-sub">در حال آماده‌سازی تجربهٔ تولد...</div></div></div>`);
    const panels=[...document.querySelectorAll('main.page > section')];
    const hero=document.querySelector('.hero'), birth=hero?.nextElementSibling;
    const history=panels.find(x=>x.querySelector('#historyCard'));
    const sky=panels.find(x=>x.querySelector('#skyCard'));
    const famous=panels.find(x=>x.querySelector('#famousList'));
    const search=panels.find(x=>x.querySelector('#searchBox'));
    const compare=panels.find(x=>x.querySelector('#compareResult'));
    const sound=panels.find(x=>x.querySelector('#soundBtn'));
    if(!birth)return;
    /* Home must start with the birth-date action. */
    if(hero && birth)birth.before(hero);
    panels.forEach(x=>x.classList.add('app-view'));
    hero.classList.add('app-view','active');
    birth.classList.add('app-view','active','home-panel');
    [history,sky,famous,search,compare,sound].forEach(x=>{if(x)x.classList.add('app-view')});
    hero.dataset.app='home';birth.dataset.app='home';
    if(history)history.dataset.app='history';if(sky)sky.dataset.app='sky';if(famous)famous.dataset.app='famous';if(search)search.dataset.app='search';if(compare)compare.dataset.app='compare';if(sound)sound.dataset.app='sound';
    const nav=document.createElement('nav');nav.className='app-tabs';nav.setAttribute('aria-label','ناوبری اصلی');
    const tabs=[['home','⌂','خانه'],['history','📜','تاریخ'],['sky','🔭','آسمان'],['famous','👤','چهره‌ها'],['more','☷','بیشتر']];
    nav.innerHTML=tabs.map(t=>`<button class="app-tab ${t[0]==='home'?'active':''}" data-tab="${t[0]}"><span class="app-tab-icon">${t[1]}</span><span class="app-tab-label">${t[2]}</span></button>`).join('');document.body.appendChild(nav);
    function activate(tab){
      let targets=[];
      if(tab==='home')targets=[birth,hero];
      else if(tab==='history')targets=[history];
      else if(tab==='sky')targets=[sky];
      else if(tab==='famous')targets=[famous];
      else targets=[search,compare,sound];
      panels.forEach(x=>x.classList.remove('active'));hero.classList.remove('active');birth.classList.remove('active');
      document.querySelectorAll('.app-tab').forEach(x=>x.classList.toggle('active',x.dataset.tab===tab));
      targets.filter(Boolean).forEach(x=>x.classList.add('active'));
      window.scrollTo({top:0,behavior:'smooth'});
    }
    nav.addEventListener('click',e=>{const b=e.target.closest('.app-tab');if(b)activate(b.dataset.tab)});
    setTimeout(()=>document.getElementById('appLoader')?.classList.add('hide'),650);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
