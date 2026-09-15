/* کارت‌های دسترسی سریع به بخش‌های صفحه */
(function(){
  const items=[
    ['result','🎨','رنگ تولد','رنگ و ویژگی روز'],
    ['historyCard','📜','در چنین روزی','اتفاق‌های واقعی'],
    ['skyCard','🔭','آسمان تولد','آسمان لحظه تولد'],
    ['famousList','👤','چهره‌های مشهور','سه هم‌تاریخ'],
    ['searchBox','🔎','جستجوی رنگ','پیدا کردن رنگ'],
    ['compareResult','💞','مقایسه تولدها','مقایسه دو تاریخ'],
    ['soundBtn','🎵','فضای صفحه','صدا و حال‌وهوا']
  ];
  function setup(){
    const birth=document.querySelector('.panel'); if(!birth||document.getElementById('quickNav'))return;
    const nav=document.createElement('nav');nav.id='quickNav';nav.className='quick-nav';nav.setAttribute('aria-label','دسترسی سریع به اطلاعات');
    nav.innerHTML='<div class="quick-nav-title">⚡ انتخاب کن چه چیزی می‌خواهی ببینی</div><div class="quick-nav-grid">'+items.map((x,i)=>`<button class="quick-nav-card" data-target="${x[0]}"><span class="quick-nav-icon">${x[1]}</span><strong>${x[2]}</strong><small>${x[3]}</small><span class="quick-nav-arrow">←</span></button>`).join('')+'</div>';
    birth.after(nav);
    nav.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{
      const target=document.getElementById(btn.dataset.target); if(!target)return;
      const section=target.closest('section')||target.closest('.result')||target;
      section.scrollIntoView({behavior:'smooth',block:'start'});
      setTimeout(()=>{if(target.focus)try{target.focus({preventScroll:true})}catch(e){}},450);
    }));
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(setup,120));
})();