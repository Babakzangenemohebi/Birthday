/* فهرست شهرهای ایران + انتخاب سریع با تب استان و جستجوی زنده */
(function(){
  const DATA_URL='https://raw.githubusercontent.com/arnpacc/iran-city-coordinates/main/geographic_coordinates_of_cities_in_iran.json';
  const $=id=>document.getElementById(id);
  let data=[];
  function setupCities(){
    const city=$('skyCity'),lat=$('skyLat'),lon=$('skyLon'),offset=$('skyOffset');
    if(!city||!lat||!lon)return;
    const field=city.closest('.sky-field');
    if(!field)return;
    field.innerHTML=`<label>📍 شهر / شهرستان</label><div class="city-picker" id="cityPicker"><div class="city-search-wrap"><span>🔎</span><input id="skyCity" class="city-search" autocomplete="off" placeholder="جستجوی شهر یا شهرستان…" aria-label="جستجوی شهر یا شهرستان"><button type="button" id="cityClear" class="city-clear" aria-label="پاک کردن">×</button></div><div id="cityPanel" class="city-panel"><div class="city-tabs" id="cityTabs"></div><div class="city-results" id="cityResults"></div></div></div>`;
    lat.closest('.sky-field')?.classList.add('sky-auto-location');
    lon.closest('.sky-field')?.classList.add('sky-auto-location');
    offset?.closest('.sky-field')?.classList.add('sky-auto-location');
    const input=$('skyCity'),panel=$('cityPanel'),tabs=$('cityTabs'),results=$('cityResults');
    let active='همه';
    function norm(s){return String(s||'').replace(/[يى]/g,'ی').replace(/ك/g,'ک').replace(/ۀ/g,'ه').trim().toLowerCase()}
    function allCities(){return data.flatMap(p=>(p.cities||[]).filter(c=>Number.isFinite(Number(c.latitude))&&Number.isFinite(Number(c.longitude))).map(c=>({...c,province:p.province||''})))}
    function applyCity(c){
      input.value=c.name;lat.value=c.latitude;lon.value=c.longitude;if(offset)offset.value='3.5';
      input.dataset.province=c.province||'';input.dataset.lat=c.latitude;input.dataset.lon=c.longitude;
      panel.classList.remove('open');
      input.dispatchEvent(new Event('input',{bubbles:true}));
    }
    function renderTabs(){
      const provinces=['همه',...data.map(p=>p.province).filter(Boolean)];
      tabs.innerHTML=provinces.map(p=>`<button type="button" class="city-tab ${p===active?'active':''}" data-province="${p}">${p}</button>`).join('');
      tabs.querySelectorAll('.city-tab').forEach(b=>b.onclick=()=>{active=b.dataset.province;renderTabs();renderResults(input.value)});
    }
    function renderResults(q=''){
      const query=norm(q);let rows=allCities();
      if(active!=='همه')rows=rows.filter(c=>c.province===active);
      if(query)rows=rows.filter(c=>norm(c.name).includes(query)||norm(c.province).includes(query));
      rows.sort((a,b)=>String(a.name).localeCompare(String(b.name),'fa'));
      if(!rows.length){results.innerHTML='<div class="city-empty">شهری با این عبارت پیدا نشد.</div>';return}
      results.innerHTML=rows.slice(0,80).map(c=>`<button type="button" class="city-option" data-name="${String(c.name).replace(/"/g,'&quot;')}" data-province="${String(c.province).replace(/"/g,'&quot;')}" data-lat="${c.latitude}" data-lon="${c.longitude}"><span>📍</span><span><b>${c.name}</b><small>${c.province}</small></span></button>`).join('');
      results.querySelectorAll('.city-option').forEach(b=>b.onclick=()=>applyCity({name:b.dataset.name,province:b.dataset.province,latitude:b.dataset.lat,longitude:b.dataset.lon}));
    }
    function open(){panel.classList.add('open');renderTabs();renderResults(input.value)}
    input.addEventListener('focus',open);input.addEventListener('input',()=>{open();renderResults(input.value)});
    $('cityClear').onclick=()=>{input.value='';input.focus();renderResults('')};
    document.addEventListener('click',e=>{if(!field.contains(e.target))panel.classList.remove('open')});
    fetch(DATA_URL).then(r=>{if(!r.ok)throw new Error('cities');return r.text()}).then(t=>JSON.parse(t.replace(/^\uFEFF/,''))).then(provinces=>{
      data=Array.isArray(provinces)?provinces:[];
      const tehran=allCities().find(c=>c.name==='تهران')||allCities()[0];
      if(tehran)applyCity(tehran);
      renderTabs();renderResults('');
    }).catch(()=>{data=[{province:'تهران',cities:[{name:'تهران',latitude:35.6944,longitude:51.4215}]}];const tehran=allCities()[0];applyCity(tehran);renderTabs();renderResults('')});
    const hint=document.querySelector('.sky-hint');if(hint)hint.textContent='استان را از تب‌ها انتخاب کن یا نام شهر/شهرستان را جستجو کن؛ با انتخاب نتیجه، مختصات و منطقهٔ زمانی خودکار تنظیم می‌شود.';
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(setupCities,80));
})();