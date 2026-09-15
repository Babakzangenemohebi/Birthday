/* همسان‌سازی نام رنگ با رنگ واقعی محاسبه‌شده */
(function(){
  const special={
    '7-10':{color:'#00FFFF',colorName:'Cyan',trait:'قدرت',description:'انرژی بالا، حضور پررنگ و توانایی تأثیرگذاری از ویژگی‌های این روز است.'},
    '11-30':{color:'#FFD700',colorName:'زرد طلایی',trait:'اصالت',description:'ذهنی مستقل، شخصیت متفاوت و تمایل به ساختن مسیر مخصوص خودت از ویژگی‌های این روز است.'},
    '5-22':{color:'#90EE90',colorName:'سبز روشن',trait:'طراوت',description:'انرژی تازه، حس رشد و روحیه‌ای روشن و امیدوار از ویژگی‌های این روز است.'}
  };
  function hueName(h){
    h=((Number(h)%360)+360)%360;
    if(h<15||h>=345)return'قرمز';
    if(h<45)return'نارنجی';
    if(h<70)return'زرد';
    if(h<150)return'سبز';
    if(h<180)return'سبز فیروزه‌ای';
    if(h<200)return'فیروزه‌ای';
    if(h<225)return'آبی آسمانی';
    if(h<250)return'آبی';
    if(h<275)return'نیلی';
    if(h<300)return'بنفش';
    if(h<330)return'سرخابی';
    return'صورتی';
  }
  function generated(m,d){
    const key=`${m}-${d}`;
    if(special[key])return{...special[key],m,d,index:hashDate(m,d)};
    const i=hashDate(m,d),h=(i*47+13)%360,color=hslToHex(h,78,61);
    const traitsList=['خلاقیت','اعتمادبه‌نفس','شادی','تعادل','آرامش','عزم','قدرت','شهود','جذابیت','جسارت','اصالت','امید','طراوت','وفاداری','ماجراجویی'];
    const trait=traitsList[(i*7+m+d)%traitsList.length];
    const descriptions=[`ترکیبی از ویژگی «${trait}» و یک هویت بصری منحصربه‌فرد برای این تاریخ.`,`این رنگ از یک الگوی محاسباتی HSL بر پایه روز تقویمی ساخته شده و تفسیر ویژگی آن جنبه سرگرمی دارد.`,`رنگ این تاریخ یک امضای بصری محاسباتی است؛ ویژگی آن شخصیت‌شناسی علمی محسوب نمی‌شود.`];
    return{m,d,index:i,color,colorName:hueName(h),trait,description:descriptions[i%descriptions.length]};
  }
  window.getData=generated;
  window.searchColors=function(){
    const box=document.getElementById('searchBox'),out=document.getElementById('searchResults');
    if(!box||!out)return;
    const q=String(box.value||'').trim().toLowerCase();
    if(!q){out.innerHTML='';return;}
    const rows=[];
    for(let m=1;m<=12;m++)for(let d=1;d<=31;d++){
      if(m===12&&d>30)continue;
      if(m>6&&m<12&&d>30)continue;
      const x=generated(m,d);
      if(x.color.toLowerCase().includes(q)||x.colorName.toLowerCase().includes(q)||x.trait.toLowerCase().includes(q))rows.push(x);
    }
    out.innerHTML=rows.slice(0,24).map(x=>`<div class="search-item"><span class="search-swatch" style="background:${x.color}"></span><div><b>${x.colorName}</b><small>${months[x.m-1]} ${faDigits(x.d)} · ${x.color} · ${x.trait}</small></div></div>`).join('')||'<div class="empty">رنگی با این مشخصات پیدا نشد.</div>';
  };
})();