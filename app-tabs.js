(function(){
function setupAppTabs(){
 const main=document.querySelector('main.page');if(!main)return;const sections=[...main.querySelectorAll('section')];
 const home=sections.find(s=>s.querySelector('#year')&&s.querySelector('#month')&&s.querySelector('#day'));if(!home)return;
 home.classList.add('app-tab-panel','active');sections.forEach(s=>{if(s!==home)s.classList.add('app-tab-panel')});
 const groups=[['home','🏠','خانه',home],['history','📜','تاریخ',sections.find(s=>s.querySelector('#historyCard'))],['sky','🔭','آسمان',sections.find(s=>s.querySelector('#skyCard'))],['people','👤','چهره‌ها',sections.find(s=>s.querySelector('#famousList'))],['more','☰','بیشتر',null]];
 const more=sections.filter(s=>s.querySelector('#searchBox,#compareResult,#soundBtn'));
 const nav=document.createElement('nav');nav.className='app-bottom-tabs';nav.setAttribute('aria-label','ناوبری اصلی');
 groups.forEach(g=>{const b=document.createElement('button');b.className='app-tab'+(g[0]==='home'?' active':'');b.dataset.tab=g[0];b.innerHTML=`<span>${g[1]}</span><small>${g[2]}</small>`;b.onclick=()=>activate(g[0]);nav.appendChild(b)});document.body.appendChild(nav);
 function activate(id){document.querySelectorAll('.app-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));sections.forEach(s=>s.classList.remove('active'));if(id==='more')more.forEach(s=>s.classList.add('active'));else{const g=groups.find(x=>x[0]===id);if(g&&g[3])g[3].classList.add('active')}window.scrollTo({top:0,behavior:'smooth'})}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(setupAppTabs,200));else setTimeout(setupAppTabs,200);
})();