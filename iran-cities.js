/* فهرست شهرهای ایران + مختصات خودکار برای نقشه آسمان */
(function(){
  const DATA_URL='https://raw.githubusercontent.com/arnpacc/iran-city-coordinates/main/geographic_coordinates_of_cities_in_iran.json';
  const $=id=>document.getElementById(id);
  function setupCities(){
    const city=$('skyCity'),lat=$('skyLat'),lon=$('skyLon'),offset=$('skyOffset');
    if(!city||!lat||!lon)return;
    city.outerHTML='<select id="skyCity" aria-label="شهر محل تولد"><option value="">در حال دریافت فهرست شهرها…</option></select>';
    const select=$('skyCity');
    lat.closest('.sky-field')?.classList.add('sky-auto-location');
    lon.closest('.sky-field')?.classList.add('sky-auto-location');
    offset?.closest('.sky-field')?.classList.add('sky-auto-location');
    fetch(DATA_URL).then(r=>{if(!r.ok)throw new Error('cities');return r.text()}).then(t=>JSON.parse(t.replace(/^\uFEFF/,''))).then(provinces=>{
      select.innerHTML='<option value="">شهر محل تولد را انتخاب کن</option>';
      (provinces||[]).forEach(p=>{
        const cities=Array.isArray(p.cities)?p.cities.filter(c=>Number.isFinite(Number(c.latitude))&&Number.isFinite(Number(c.longitude))):[];
        if(!cities.length)return;
        const group=document.createElement('optgroup');group.label=p.province||'';
        cities.sort((a,b)=>String(a.name).localeCompare(String(b.name),'fa')).forEach(c=>{
          const o=document.createElement('option');o.value=c.name;o.textContent=c.name;o.dataset.lat=c.latitude;o.dataset.lon=c.longitude;o.dataset.province=p.province||'';group.appendChild(o);
        });
        select.appendChild(group);
      });
      const tehran=[...select.options].find(o=>o.textContent==='تهران');if(tehran){select.value=tehran.value;applyCity()}
    }).catch(()=>{select.innerHTML='<option value="تهران">تهران</option>';select.value='تهران';lat.value='35.6944';lon.value='51.4215';applyCity()});
    select.addEventListener('change',applyCity);
    function applyCity(){
      const o=select.options[select.selectedIndex];
      if(o?.dataset.lat){lat.value=o.dataset.lat;lon.value=o.dataset.lon;select.title=`${o.dataset.province||'ایران'} · ${Number(o.dataset.lat).toFixed(4)}°، ${Number(o.dataset.lon).toFixed(4)}°`}
      if(offset)offset.value='3.5';
    }
    const hint=document.querySelector('.sky-hint');if(hint)hint.textContent='شهر محل تولد را انتخاب کن؛ مختصات جغرافیایی و منطقهٔ زمانی ایران خودکار تنظیم می‌شود. فقط ساعت محلی تولد را وارد کن.';
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(setupCities,80));
})();