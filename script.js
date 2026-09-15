const months=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const colors=[['#ff5c8a','صورتی'],['#ff8a3d','نارنجی'],['#ffd166','طلایی'],['#7ed957','سبز'],['#4dd0e1','فیروزه‌ای'],['#5b8def','آبی'],['#00ffff','Cyan'],['#8b5cf6','بنفش'],['#ec4899','سرخابی'],['#f43f5e','قرمز'],['#ffd700','زرد طلایی'],['#22c55e','سبز زمردی']];
const traits=['خلاقیت','اعتمادبه‌نفس','شادی','تعادل','آرامش','عزم','قدرت','شهود','جذابیت','جسارت','اصالت','امید'];
const specialDates={'7-10':{color:'#00ffff',colorName:'Cyan',trait:'قدرت',description:'انرژی بالا، حضور پررنگ و توانایی تأثیرگذاری از ویژگی‌های این روز است.'},'11-30':{color:'#ffd700',colorName:'زرد طلایی',trait:'اصالت',description:'ذهنی مستقل، شخصیت متفاوت و تمایل به ساختن مسیر مخصوص خودت از ویژگی‌های این روز است.'},'5-22':{color:'#90ee90',colorName:'سبز روشن',trait:'طراوت',description:'انرژی تازه، حس رشد و روحیه‌ای روشن و امیدوار از ویژگی‌های این روز است.'}};
const monthSelect=document.getElementById('month');
const daySelect=document.getElementById('day');
const result=document.getElementById('result');
const toast=document.getElementById('toast');
const faDigits=n=>String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);

months.forEach((name,index)=>{const o=document.createElement('option');o.value=String(index+1);o.textContent=name;monthSelect.appendChild(o)});

daySelect.disabled=true;
function fillDays(){
  const m=Number(monthSelect.value);
  daySelect.innerHTML='';
  const placeholder=document.createElement('option');
  placeholder.value='';
  placeholder.textContent=m?'روز را انتخاب کن':'اول ماه را انتخاب کن';
  daySelect.appendChild(placeholder);
  daySelect.disabled=!m;
  if(!m)return;
  const max=m<=6?31:m<=11?30:29;
  for(let d=1;d<=max;d++){
    const o=document.createElement('option');
    o.value=String(d);
    o.textContent=faDigits(d);
    daySelect.appendChild(o);
  }
}

monthSelect.addEventListener('change',()=>{fillDays();result.style.display='none'});
daySelect.addEventListener('change',()=>{result.style.display='none'});
fillDays();

function showResult(){
  const m=Number(monthSelect.value),d=Number(daySelect.value);
  if(!m){showToast('اول ماه تولدت رو انتخاب کن ✨');monthSelect.focus();return}
  const max=m<=6?31:m<=11?30:29;
  if(!d||d>max){showToast('حالا روز تولدت رو انتخاب کن ✨');daySelect.focus();return}
  const key=`${m}-${d}`;
  const fallbackIndex=(m+d-2)%colors.length;
  const x=specialDates[key]||{color:colors[fallbackIndex][0],colorName:colors[fallbackIndex][1],trait:traits[fallbackIndex],description:'این روز ترکیبی از انرژی، شخصیت و نگاه خاص تو به زندگی را نشان می‌دهد.'};
  document.documentElement.style.setProperty('--result-color',x.color);
  document.documentElement.style.setProperty('--result-glow',x.color+'33');
  document.getElementById('orb').style.background=x.color;
  document.getElementById('date').textContent=`${faDigits(d)} ${months[m-1]}`;
  document.getElementById('color').textContent=x.colorName;
  document.getElementById('trait').textContent=`✦ ${x.trait} ✦`;
  document.getElementById('desc').textContent=x.description;
  result.style.display='block';
  result.scrollIntoView({behavior:'smooth',block:'nearest'});
}

async function shareResult(){
  const text=`راز رنگ تولد من\n${document.getElementById('date').textContent}\nرنگ: ${document.getElementById('color').textContent}\nویژگی: ${document.getElementById('trait').textContent}`;
  if(navigator.share){try{await navigator.share({title:'راز رنگ تولد',text})}catch(e){}}
  else{try{await navigator.clipboard.writeText(text);showToast('نتیجه کپی شد ✨')}catch(e){showToast('اشتراک‌گذاری در این مرورگر در دسترس نیست')}}
}
function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.classList.remove('show'),2600)}
