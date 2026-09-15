(function(){
  function setup(){
    const panel=document.querySelector('.panel');
    const grid=document.getElementById('year')?.closest('.birth-date-grid');
    if(!panel||!grid||panel.dataset.dateCardReady)return;
    panel.dataset.dateCardReady='1';
    const label=panel.querySelector('.label');
    if(label){label.outerHTML='<div class="date-card-head"><div class="date-card-title">تاریخ تولدت را انتخاب کن</div><div class="date-card-badge">اولین قدم ✦</div></div>'}
    const live=document.createElement('div');
    live.className='date-live';
    live.innerHTML='<span class="date-live-dot"></span><span id="dateLiveText">سال، ماه و روز را انتخاب کن</span>';
    grid.insertAdjacentElement('afterend',live);
    const y=document.getElementById('year'),m=document.getElementById('month'),d=document.getElementById('day');
    const names=['','فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
    function update(){
      const yt=y?.value, mt=m?.value, dt=d?.value, out=document.getElementById('dateLiveText');
      if(!out)return;
      if(yt&&mt&&dt) out.innerHTML='<strong>'+dt+' '+names[Number(mt)]+' '+yt+'</strong> · آمادهٔ تحلیل';
      else if(yt&&mt) out.textContent='روز را انتخاب کن تا تاریخ کامل شود';
      else if(yt) out.textContent='حالا ماه و روز تولدت را انتخاب کن';
      else out.textContent='سال، ماه و روز را انتخاب کن';
    }
    [y,m,d].forEach(el=>el&&el.addEventListener('change',update));
    update();
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(setup,180));
})();