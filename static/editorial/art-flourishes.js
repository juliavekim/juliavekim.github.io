(()=>{
const drawings=[
'<path d="M43 35C25 11 5 18 16 38c7 12 22 7 27-3Zm4 0C65 11 85 18 74 38c-7 12-22 7-27-3Z" fill="#f3bdcf"/><path d="m42 39-9 22 12-7 7 6-4-22" fill="#f3bdcf"/><ellipse cx="45" cy="35" rx="6" ry="7" fill="#e69db8"/><path d="M8 11 3 5m77 9 7-5"/>',
'<path d="M31 48V19l30-6v30M31 26l30-6"/><ellipse cx="23" cy="50" rx="9" ry="6" fill="#e6c86b"/><ellipse cx="53" cy="45" rx="9" ry="6" fill="#e6c86b"/><path d="m12 17-3-7m61 47 8 4m-7-34 8-3"/>',
'<path d="M43 38C12 3 4 30 26 44 6 62 29 76 44 45c16 31 39 17 19-1C85 30 77 3 46 38" fill="#ddc7ef"/><path d="M45 33v19m-2-18-6-9m9 9 6-9"/><path d="m8 49-6 3m74-39 5-6"/>',
'<circle cx="44" cy="37" r="17" fill="#f4df8f"/><path d="m44 9 1-7m22 16 6-6m-4 25 9 1m-14 21 6 6M44 63v8M22 57l-6 6M17 37l-9-1m14-19-5-6"/>'
];
const slugs=['tutoring','teaching','website-design','outreach'];
function add(){document.querySelectorAll('.service-tile,.service-artwork>a').forEach(a=>{if(a.querySelector('.art-flourish'))return;let i=a.classList.contains('service-tile')?[...a.classList].find(c=>/^tile-\d$/.test(c))?.slice(-1):slugs.indexOf(location.pathname.split('/').filter(Boolean).pop());i=Number(i);if(i<0||!Number.isFinite(i))return;a.classList.add('art-playful','art-playful-'+i);const el=document.createElement('span');el.className='art-flourish';el.setAttribute('aria-hidden','true');el.innerHTML='<svg viewBox="0 0 90 80" fill="none" stroke="#3a5147" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+drawings[i]+'</svg>';a.append(el);});}
new MutationObserver(add).observe(document.querySelector('main')||document.body,{childList:true,subtree:true});add();
})();
