/* Interactive astronomical sky map powered by Astronomy Engine. */
(function(){
  const stars=[
    ['شباهنگ',6.7525,-16.716, -1.46],['سهیل',6.3992,-52.695,-0.72],['آخرالنهر',5.2423,-8.202,0.46],['رجل‌الجبار',5.2423,-8.202,0.50],
    ['ابط‌الجوزا',5.9195,7.407,0.50],['الدبران',4.5987,16.509,0.85],['رِجل‌الجبار',5.2423,-8.202,0.50],['شعرای شامی',6.9771,-28.972,0.38],
    ['منکب‌الجوزا',5.6036,-1.201,1.65],['رِجل‌الجبار',5.5334,-0.299,1.64],['قلب‌العقرب',16.4901,-26.432,0.96],['سماک‌رامح',14.261,19.182,-0.05],
    ['نسر واقع',18.6156,38.783,0.03],['ذنب',20.6905,45.280,1.25],['طائر',20.6905,-1.449,0.77],['فم‌الحوت',22.9608,-29.622,1.16],
    ['قنطورس آلفا',14.660,-60.833,-0.27],['سماک اعزل',13.4199,-11.161,0.98],['رأس‌الغول',3.1361,40.956,2.12],['دبران',4.5987,16.509,0.85],
    ['کاپلا',5.2782,45.998,0.08],['پروسیون',7.6550,5.225,0.34],['کاستور',7.5767,31.888,1.58],['پولوکس',7.7553,28.026,1.14],
    ['آلتایر',19.8464,8.868,0.77],['فم‌الحوت',22.9608,-29.622,1.16],['آرکتوروس',14.261,19.182,-0.05],['رِجل',5.5334,-0.299,1.64],
    ['وگا',18.6156,38.783,0.03],['مینتاکا',5.5334,-0.299,2.23],['النظام',5.6793,-1.942,1.70]
  ];
  const planets=[['خورشید','Sun','☀️'],['ماه','Moon','🌙'],['عطارد','Mercury','☿'],['زهره','Venus','♀'],['مریخ','Mars','♂'],['مشتری','Jupiter','♃'],['زحل','Saturn','♄'],['اورانوس','Uranus','♅'],['نپتون','Neptune','♆']];
  let state={lat:35.6892,lon:51.389,offset:3.5,time:'21:00',city:'تهران',zoom:1,az:0,labels:true};
  let drag=false,lastX=0,lastY=0;
  const $=id=>document.getElementById(id);
  function getInputs(){
    const lat=parseFloat($('skyLat')?.value),lon=parseFloat($('skyLon')?.value),offset=parseFloat($('skyOffset')?.value);
    state.lat=Number.isFinite(lat)?Math.max(-90,Math.min(90,lat)):35.6892;
    state.lon=Number.isFinite(lon)?Math.max(-180,Math.min(180,lon)):51.389;
    state.offset=Number.isFinite(offset)?offset:3.5; state.time=$('skyTime')?.value||'21:00'; state.city=$('skyCity')?.value?.trim()||'محل تولد';
    return state;
  }
  function makeUTC(g){
    const [h,m]=(state.time||'21:00').split(':').map(Number); return new Date(Date.UTC(g[0],g[1]-1,g[2],h||0,(m||0))-state.offset*3600000);
  }
  function proj(alt,az,cx,cy,r){const rr=(90-alt)/90*r;const a=(az+state.az-0)*Math.PI/180;return[cx+Math.sin(a)*rr,cy-Math.cos(a)*rr,rr]}
  function starSize(m){return Math.max(1.2,Math.min(5.2,5.3-m*1.45))}
  function horizonPoint(az,cx,cy,r){const a=(az+state.az)*Math.PI/180;return[cx+Math.sin(a)*r,cy-Math.cos(a)*r]}
  function bodyHorizon(body,date,obs){const eq=Astronomy.Equator(Astronomy.Body[body],date,obs,true,true);return Astronomy.Horizon(date,obs,eq.ra,eq.dec,'normal')}
  function setup(){
    const box=$('skyCard'); if(!box)return;
    box.innerHTML=`<div class="sky-controls"><div class="sky-field"><label>📍 محل</label><input id="skyCity" value="تهران" placeholder="نام شهر یا محل"></div><div class="sky-field"><label>🌐 عرض جغرافیایی</label><input id="skyLat" type="number" step="0.0001" value="35.6892"></div><div class="sky-field"><label>🌐 طول جغرافیایی</label><input id="skyLon" type="number" step="0.0001" value="51.389"></div><div class="sky-field"><label>🕐 ساعت محلی</label><input id="skyTime" type="time" value="21:00"></div><div class="sky-field"><label>UTC</label><select id="skyOffset"></select></div></div><div class="sky-actions"><button id="skyDraw">🌌 رسم آسمان</button><button id="skyReset">↺ بازنشانی</button><button id="skyLabels">🏷️ برچسب‌ها</button></div><div class="sky-hint">برای دقت واقعی، زمان محلی، عرض و طول جغرافیایی محل تولد را وارد کن. نقشه قابل کشیدن و بزرگ‌نمایی است.</div><div class="sky-map-wrap"><canvas id="skyCanvas" aria-label="نقشه تعاملی آسمان لحظه تولد"></canvas><div id="skyTooltip" class="sky-tooltip"></div></div><div id="skyReadout" class="sky-readout"></div>`;
    const off=$('skyOffset'); for(let i=-12;i<=14;i+=.5){const o=document.createElement('option');o.value=i;o.textContent=(i>=0?'+':'')+i;off.appendChild(o)} off.value='3.5';
    $('skyDraw').onclick=()=>{getInputs();drawSky(currentBirthGregorian())}; $('skyReset').onclick=()=>{state.zoom=1;state.az=0;drawSky(currentBirthGregorian())}; $('skyLabels').onclick=()=>{state.labels=!state.labels;drawSky(currentBirthGregorian())};
    const c=$('skyCanvas'); c.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY;c.setPointerCapture(e.pointerId)}); c.addEventListener('pointermove',e=>{if(!drag)return;state.az+=(e.clientX-lastX)*0.35;lastX=e.clientX;lastY=e.clientY;drawSky(currentBirthGregorian())}); c.addEventListener('pointerup',()=>drag=false); c.addEventListener('pointercancel',()=>drag=false); c.addEventListener('wheel',e=>{e.preventDefault();state.zoom=Math.max(.65,Math.min(1.55,state.zoom*(e.deltaY<0?1.08:.92)));drawSky(currentBirthGregorian())},{passive:false});
  }
  function currentBirthGregorian(){const y=Number(document.getElementById('year')?.value),m=Number(document.getElementById('month')?.value),d=Number(document.getElementById('day')?.value);return window.jalaliToGregorian?window.jalaliToGregorian(y,m,d):null}
  function drawSky(g){
    if(!g||!window.Astronomy)return; getInputs(); const c=$('skyCanvas'),rect=c.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1),w=Math.max(320,rect.width),h=Math.max(330,Math.min(600,w*.88)); c.width=w*dpr;c.height=h*dpr;c.style.height=h+'px';const ctx=c.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);
    const cx=w/2,cy=h/2,r=Math.min(w,h)*.43*state.zoom,date=makeUTC(g),obs=new Astronomy.Observer(state.lat,state.lon,0);ctx.clearRect(0,0,w,h);
    const grad=ctx.createRadialGradient(cx,cy,r*.05,cx,cy,r*1.15);grad.addColorStop(0,'#18265c');grad.addColorStop(.55,'#080f30');grad.addColorStop(1,'#02040e');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
    ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.clip();
    for(let i=0;i<120;i++){const a=(i*137.5)%360,rr=((i*73)%100)/100*r*.98;const x=cx+Math.sin(a*Math.PI/180)*rr,y=cy-Math.cos(a*Math.PI/180)*rr;ctx.globalAlpha=.16+((i*17)%50)/100;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y,.55+((i*7)%12)/10,0,Math.PI*2);ctx.fill()}
    ctx.globalAlpha=1;
    ctx.strokeStyle='#7f8fc855';ctx.lineWidth=1;for(let alt=15;alt<90;alt+=15){ctx.beginPath();ctx.arc(cx,cy,(90-alt)/90*r,0,Math.PI*2);ctx.stroke()}
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle='#b7c6ff99';ctx.lineWidth=2;ctx.stroke();
    for(let az=0;az<360;az+=30){const p=horizonPoint(az,cx,cy,r);ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(p[0],p[1]);ctx.strokeStyle='#7f8fc833';ctx.stroke()}
    const starPts=[]; for(const s of stars){try{const eq=Astronomy.DefineStar?null:null;const hq=Astronomy.Horizon(date,obs,s[1],s[2],null);if(hq.altitude>-5){const p=proj(hq.altitude,hq.azimuth,cx,cy,r);starPts.push({x:p[0],y:p[1],s})}}catch(e){}}
    for(const q of starPts){ctx.fillStyle='#fff';ctx.shadowColor='#fff';ctx.shadowBlur=state.labels?5:3;ctx.beginPath();ctx.arc(q.x,q.y,starSize(q.s[3]),0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;if(state.labels&&q.s[3]<1.1){ctx.font='11px Vazirmatn';ctx.fillStyle='#dce5ff';ctx.fillText(q.s[0],q.x+6,q.y-5)}}
    const bodyData=[]; for(const p of planets){try{const hq=bodyHorizon(p[1],date,obs);if(hq.altitude>-2){const pt=proj(hq.altitude,hq.azimuth,cx,cy,r);bodyData.push({name:p[0],icon:p[2],alt:hq.altitude,az:hq.azimuth,x:pt[0],y:pt[1]});ctx.fillStyle=p[1]==='Sun'?'#ffd86b':p[1]==='Moon'?'#f1f4ff':'#8fe7ff';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=16;ctx.beginPath();ctx.arc(pt[0],pt[1],p[1]==='Moon'?7:5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;if(state.labels){ctx.font='bold 11px Vazirmatn';ctx.fillStyle='#fff';ctx.fillText(p[0],pt[0]+8,pt[1]+4)}}}catch(e){}}
    ctx.restore();
    ctx.font='bold 15px Vazirmatn';ctx.fillStyle='#fff';[['شمال',0],['شرق',90],['جنوب',180],['غرب',270]].forEach(([t,a])=>{const p=horizonPoint(a,cx,cy,r+18);ctx.fillText(t,p[0]-12,p[1]+5)});ctx.font='11px Vazirmatn';ctx.fillStyle='#aebeff';ctx.fillText('سمت‌الرأس',cx-22,cy+4);
    const visible=bodyData.filter(x=>x.alt>-1).sort((a,b)=>b.alt-a.alt);$('skyReadout').innerHTML=`<div><b>📍 ${state.city}</b><span>${state.lat.toFixed(4)}°، ${state.lon.toFixed(4)}°</span></div><div><b>🕐 ${state.time}</b><span>UTC ${state.offset>=0?'+':''}${state.offset}</span></div><div><b>🪐 اجرام قابل مشاهده</b><span>${visible.length?visible.map(x=>x.name+' '+Math.round(x.alt)+'°').join(' · '):'در این لحظه بالای افق نیستند'}</span></div><div class="sky-readout-note">نمایش اجرام منظومه شمسی از محاسبات Astronomy Engine استفاده می‌کند؛ ستاره‌ها با مختصات آسمانی J2000 به افق محلی تبدیل شده‌اند.</div>`;
  }
  window.renderSkyAndFamous=function(g){setup();drawSky(g); if(window.loadFamous){window.loadFamous(g[1],g[2]).then(people=>{const box=$('famousList'); if(!box)return; box.innerHTML=people.length?people.map(p=>`<div class="famous"><div class="famous-year">${faDigits(p.year)}</div><div><strong>${p.name}</strong><span>متولد ${faDigits(p.year)}</span><small>${p.note}</small></div></div>`).join(''):`<div class="empty">دادهٔ مشاهیر برای این تاریخ در دسترس نبود؛ دوباره تلاش کن.</div>`})} return Promise.resolve();};
  document.addEventListener('DOMContentLoaded',()=>{setTimeout(()=>{if(document.getElementById('skyCard'))setup()},0)});
})();