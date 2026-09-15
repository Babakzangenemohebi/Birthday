const months=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const monthDays=[31,31,31,31,31,31,30,30,30,30,30,29];
const traits=['خلاقیت','اعتمادبه‌نفس','شادی','تعادل','آرامش','عزم','قدرت','شهود','جذابیت','جسارت','اصالت','امید','طراوت','وفاداری','ماجراجویی'];
const elements=['آتش','آب','خاک','هوا'];
const stones=['زمرد','یاقوت','آمتیست','فیروزه','کهربا','الماس','لاجورد','اونیکس'];
const symbols=['🌿','🔥','🌊','🌙','🌸','⭐','🦋','☀️'];
const specialDates={
 '7-10':{color:'#00FFFF',colorName:'Cyan',trait:'قدرت',description:'انرژی بالا، حضور پررنگ و توانایی تأثیرگذاری از ویژگی‌های این روز است.'},
 '11-30':{color:'#FFD700',colorName:'زرد طلایی',trait:'اصالت',description:'ذهنی مستقل، شخصیت متفاوت و تمایل به ساختن مسیر مخصوص خودت از ویژگی‌های این روز است.'},
 '5-22':{color:'#90EE90',colorName:'سبز روشن',trait:'طراوت',description:'انرژی تازه، حس رشد و روحیه‌ای روشن و امیدوار از ویژگی‌های این روز است.'}
};
const colorNames=['قرمز مرجانی','نارنجی آفتابی','زرد لیمویی','سبز بهاری','فیروزه‌ای','آبی آسمانی','نیلی','بنفش رویایی','صورتی شکوفه‌ای','سرخابی','طلایی گرم','سبز زمردی','آبی اقیانوسی','یاسی','هلویی'];
const faDigits=n=>String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
const monthSelect=document.getElementById('month'),daySelect=document.getElementById('day'),result=document.getElementById('result'),toast=document.getElementById('toast');

function hashDate(m,d){let n=0;for(let i=1;i<m;i++)n+=monthDays[i-1];return n+d-1}
function hslToHex(h,s,l){s/=100;l/=100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return '#'+[f(0),f(8),f(4)].map(x=>Math.round(255*x).toString(16).padStart(2,'0')).join('').toUpperCase()}
function getData(m,d){
 const key=`${m}-${d}`;
 if(specialDates[key]) return {...specialDates[key],m,d,index:hashDate(m,d)};
 const i=hashDate(m,d), hue=(i*47+13)%360, color=hslToHex(hue,78,61);
 const trait=traits[(i*7+m+d)%traits.length];
 const colorName=colorNames[i%colorNames.length];
 const descriptions=[`ترکیبی از انرژی ${trait}، نگاه مثبت و حضور خاص تو، امضای این روز را می‌سازد.`,`آرامش درونی، خلاقیت و میل به رشد از انرژی‌های پررنگ این روز هستند.`,`این روز نماد شخصیتی مستقل، پرانرژی و متفاوت است که مسیر خودش را پیدا می‌کند.`];
 return {m,d,index:i,color,colorName,trait,description:descriptions[i%descriptions.length]};
}
function allDates(){const a=[];for(let m=1;m<=12;m++)for(let d=1;d<=monthDays[m-1];d++)a.push(getData(m,d));return a}
const all=allDates();

function fillMonth(sel,withPlaceholder=true){sel.innerHTML=withPlaceholder?'<option value="">ماه را انتخاب کن</option>':'';months.forEach((name,i)=>{const o=document.createElement('option');o.value=i+1;o.textContent=name;sel.appendChild(o)})}
function fillDaysFor(sel,m,withPlaceholder=true){sel.innerHTML=withPlaceholder?'<option value="">روز را انتخاب کن</option>':'';if(!m)return;for(let d=1;d<=monthDays[m-1];d++){const o=document.createElement('option');o.value=d;o.textContent=faDigits(d);sel.appendChild(o)}}
fillMonth(monthSelect);daySelect.disabled=true;
monthSelect.addEventListener('change',()=>{fillDaysFor(daySelect,Number(monthSelect.value));daySelect.disabled=!monthSelect.value;result.style.display='none'});
daySelect.addEventListener('change',()=>result.style.display='none');

function showResult(m=Number(monthSelect.value),d=Number(daySelect.value),scroll=true){
 if(!m){showToast('اول ماه تولدت رو انتخاب کن ✨');monthSelect.focus();return}
 if(!d){showToast('حالا روز تولدت رو انتخاب کن ✨');daySelect.focus();return}
 const x=getData(m,d);
 document.documentElement.style.setProperty('--result-color',x.color);document.documentElement.style.setProperty('--result-glow',x.color+'44');
 const orb=document.getElementById('orb');orb.style.background=x.color;orb.style.boxShadow=`0 20px 60px ${x.color},inset -18px -18px 35px #0002,inset 12px 12px 25px #fff8`;
 document.getElementById('date').textContent=`${faDigits(d)} ${months[m-1]}`;document.getElementById('color').textContent=x.colorName;document.getElementById('hex').textContent=x.color;document.getElementById('trait').textContent=`✦ ${x.trait} ✦`;document.getElementById('desc').textContent=x.description;
 const i=x.index;document.getElementById('stats').innerHTML=`<div class="stat"><b>💎 سنگ</b><span>${stones[i%stones.length]}</span></div><div class="stat"><b>🔥 عنصر</b><span>${elements[i%elements.length]}</span></div><div class="stat"><b>🔢 عدد</b><span>${faDigits((i%9)+1)}</span></div><div class="stat"><b>🌟 نماد</b><span>${symbols[i%symbols.length]}</span></div>`;
 result.style.display='block';if(scroll)result.scrollIntoView({behavior:'smooth',block:'nearest'});playTone(x.color);
}
function randomDate(){const x=all[Math.floor(Math.random()*all.length)];monthSelect.value=x.m;fillDaysFor(daySelect,x.m);daySelect.disabled=false;daySelect.value=x.d;showResult(x.m,x.d);}

function setupCompare(){[document.getElementById('cm1'),document.getElementById('cm2')].forEach(fillMonth);[1,2].forEach(n=>{const m=document.getElementById('cm'+n),d=document.getElementById('cd'+n);d.innerHTML='<option value="">روز</option>';m.addEventListener('change',()=>fillDaysFor(d,Number(m.value),true))})}setupCompare();
function compareDates(){const m1=Number(document.getElementById('cm1').value),d1=Number(document.getElementById('cd1').value),m2=Number(document.getElementById('cm2').value),d2=Number(document.getElementById('cd2').value);if(!m1||!d1||!m2||!d2){showToast('هر دو تاریخ را کامل انتخاب کن 💞');return}const a=getData(m1,d1),b=getData(m2,d2),compat=Math.max(62,100-Math.abs(a.index-b.index)%39);document.getElementById('compareResult').innerHTML=`<div class="compare-result"><div class="compare-colors"><div><div class="compare-ball" style="background:${a.color}"></div><b>${months[m1-1]} ${faDigits(d1)}</b><small>${a.trait}</small></div><div><div class="compare-ball" style="background:${b.color}"></div><b>${months[m2-1]} ${faDigits(d2)}</b><small>${b.trait}</small></div></div><div class="compat">${faDigits(compat)}٪ هماهنگی</div><p>رنگ‌های شما ${compat>=85?'انرژی بسیار هماهنگی':compat>=72?'ارتباط و تعادل خوبی':'تفاوت‌های جذابی'} دارند. این ترکیب می‌تواند مکمل هم باشد.</p></div>`}

function searchColors(){const q=document.getElementById('searchBox').value.trim().toLowerCase(),box=document.getElementById('searchResults');if(!q){box.innerHTML='';return}const hits=all.filter(x=>x.colorName.toLowerCase().includes(q)||x.trait.toLowerCase().includes(q)||x.color.toLowerCase().includes(q)).slice(0,12);box.innerHTML=hits.length?hits.map(x=>`<button class="search-card" onclick="selectSearch(${x.m},${x.d})"><i class="swatch" style="background:${x.color}"></i><span><strong>${x.colorName}</strong><small>${faDigits(x.d)} ${months[x.m-1]} · ${x.trait}</small></span></button>`).join(''):'<div>نتیجه‌ای پیدا نشد ✨</div>'}
function selectSearch(m,d){monthSelect.value=m;fillDaysFor(daySelect,m);daySelect.disabled=false;daySelect.value=d;showResult(m,d)}

function toggleTheme(){document.body.classList.toggle('dark');localStorage.setItem('birthday-dark',document.body.classList.contains('dark'));document.getElementById('themeBtn').textContent=document.body.classList.contains('dark')?'☀️':'🌙'}
if(localStorage.getItem('birthday-dark')==='true'){document.body.classList.add('dark');document.getElementById('themeBtn').textContent='☀️'}
let soundOn=true,audioCtx;function toggleSound(){soundOn=!soundOn;document.getElementById('soundBtn').textContent=soundOn?'🔊 صدا روشن است':'🔇 صدا خاموش است';if(soundOn)playTone('#7c3aed')}
function playTone(hex){if(!soundOn)return;try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.frequency.value=440+parseInt(hex.slice(1,3),16);o.type='sine';g.gain.setValueAtTime(.0001,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.035,audioCtx.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.22);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+.23)}catch(e){}}

async function shareResult(){const text=`راز رنگ تولد من\n${document.getElementById('date').textContent}\nرنگ: ${document.getElementById('color').textContent} ${document.getElementById('hex').textContent}\nویژگی: ${document.getElementById('trait').textContent}`;if(navigator.share){try{await navigator.share({title:'راز رنگ تولد',text})}catch(e){}}else{try{await navigator.clipboard.writeText(text);showToast('نتیجه کپی شد ✨')}catch(e){showToast('اشتراک‌گذاری در این مرورگر در دسترس نیست')}}}
function downloadCard(){const m=Number(monthSelect.value),d=Number(daySelect.value);if(!m||!d){showToast('اول رنگ تولدت را کشف کن ✨');return}const x=getData(m,d),c=document.createElement('canvas');c.width=1200;c.height=1500;const ctx=c.getContext('2d');const grad=ctx.createLinearGradient(0,0,1200,1500);grad.addColorStop(0,x.color);grad.addColorStop(.48,'#ffffff');grad.addColorStop(1,'#eef2ff');ctx.fillStyle=grad;ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='rgba(255,255,255,.82)';roundRect(ctx,90,100,1020,1300,55);ctx.fill();ctx.textAlign='center';ctx.fillStyle='#101828';ctx.font='bold 42px sans-serif';ctx.fillText('راز رنگ تولد',600,200);ctx.font='bold 70px sans-serif';ctx.fillText(`${faDigits(d)} ${months[m-1]}`,600,330);ctx.beginPath();ctx.arc(600,570,170,0,Math.PI*2);ctx.fillStyle=x.color;ctx.shadowColor=x.color;ctx.shadowBlur=55;ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#101828';ctx.font='bold 64px sans-serif';ctx.fillText(x.colorName,600,850);ctx.font='bold 54px sans-serif';ctx.fillText(`✦ ${x.trait} ✦`,600,950);ctx.font='bold 30px monospace';ctx.fillText(x.color,600,1015);ctx.font='30px sans-serif';ctx.fillText(`سنگ: ${stones[x.index%stones.length]}  ·  عنصر: ${elements[x.index%elements.length]}  ·  عدد: ${(x.index%9)+1}`,600,1100);ctx.font='26px sans-serif';ctx.fillStyle='#667085';wrapText(ctx,x.description,600,1190,800,45);ctx.font='22px sans-serif';ctx.fillText('birthday color experience ✨',600,1330);const a=document.createElement('a');a.download=`birthday-color-${m}-${d}.jpg`;a.href=c.toDataURL('image/jpeg',.94);a.click();showToast('کارت JPG آماده شد 🖼️')}
function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);}
function wrapText(ctx,text,x,y,max,lh){const words=text.split(' ');let line='';for(const word of words){const test=line+word+' ';if(ctx.measureText(test).width>max){ctx.fillText(line,x,y);line=word+' ';y+=lh}else line=test}ctx.fillText(line,x,y)}
function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.classList.remove('show'),2600)}
