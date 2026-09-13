const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fineHover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

/* ---------- boot loader ---------- */
(function(){
  const loader = document.getElementById('bootLoader');
  const lineEl = document.getElementById('bootLine');
  if(!loader || !lineEl) return;
  if(reduceMotion || sessionStorage.getItem('bootDone')){
    loader.classList.add('hide');
    return;
  }
  const text = "booting syeda-naveera.dev ...";
  let i = 0;
  const safety = setTimeout(()=>{ loader.classList.add('hide'); }, 3000);
  function type(){
    lineEl.textContent = text.slice(0, i);
    i++;
    if(i <= text.length){
      setTimeout(type, 34);
    } else {
      clearTimeout(safety);
      setTimeout(()=>{
        loader.classList.add('hide');
        sessionStorage.setItem('bootDone', '1');
      }, 450);
    }
  }
  type();
})();

/* ---------- confetti burst ---------- */
function confettiBurst(x, y){
  if(reduceMotion) return;
  const colors = ['#22d3ee','#2563eb','#8b5cf6','#34d399','#f59e0b'];
  for(let i=0; i<22; i++){
    const p = document.createElement('span');
    p.className = 'confetti-piece';
    p.style.left = x+'px';
    p.style.top = y+'px';
    p.style.background = colors[i % colors.length];
    const angle = Math.random()*Math.PI*2;
    const dist = 55 + Math.random()*85;
    p.style.setProperty('--dx', Math.cos(angle)*dist+'px');
    p.style.setProperty('--dy', Math.sin(angle)*dist+'px');
    p.style.setProperty('--rot', (Math.random()*720-360)+'deg');
    document.body.appendChild(p);
    setTimeout(()=> p.remove(), 900);
  }
}

/* ---------- custom cursor ---------- */
if(fineHover && !reduceMotion){
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  const label = ring.querySelector('.cursor-label');
  let mx=0,my=0, rx=0, ry=0;
  window.addEventListener('mousemove', e=>{ mx=e.clientX; my=e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px'; });
  function loop(){ rx += (mx-rx)*0.16; ry += (my-ry)*0.16; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(loop); }
  loop();

  document.querySelectorAll('.clickable').forEach(el=>{
    el.addEventListener('mouseenter', ()=>{
      ring.classList.add('hover');
      label.textContent = el.dataset.cursor || '';
    });
    el.addEventListener('mouseleave', ()=>{ ring.classList.remove('hover'); label.textContent=''; });
  });

  /* magnetic buttons */
  document.querySelectorAll('.btn, .nav-cta, .float-chip').forEach(el=>{
    el.addEventListener('mousemove', e=>{
      const r = el.getBoundingClientRect();
      const relX = e.clientX - (r.left + r.width/2);
      const relY = e.clientY - (r.top + r.height/2);
      el.style.transform = `translate(${relX*0.18}px, ${relY*0.18}px)`;
    });
    el.addEventListener('mouseleave', ()=>{ el.style.transform=''; });
  });

  /* 3D tilt on project + service cards */
  document.querySelectorAll('.project-card, .service-card').forEach(el=>{
    el.addEventListener('mousemove', e=>{
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left)/r.width - 0.5;
      const py = (e.clientY - r.top)/r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-py*6).toFixed(2)}deg) rotateY(${(px*6).toFixed(2)}deg) translateY(-4px)`;
    });
    el.addEventListener('mouseleave', ()=>{ el.style.transform=''; });
  });
} else {
  document.querySelector('.cursor-dot').style.display='none';
  document.querySelector('.cursor-ring').style.display='none';
}

/* ---------- scroll reveal ---------- */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, {threshold:0.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ---------- nav active link + scroll-top + scroll progress ---------- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const scrollTopBtn = document.getElementById('scrollTop');
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', ()=>{
  let current='';
  sections.forEach(sec=>{ if(window.scrollY >= sec.offsetTop - 140) current = sec.id; });
  navLinks.forEach(a=>{ a.classList.toggle('active', a.getAttribute('href') === '#'+current); });
  scrollTopBtn.classList.toggle('show', window.scrollY > 500);
  const docEl = document.documentElement;
  const scrollable = docEl.scrollHeight - docEl.clientHeight;
  scrollProgress.style.width = (scrollable > 0 ? (docEl.scrollTop / scrollable) * 100 : 0) + '%';
});
scrollTopBtn.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

/* ---------- mobile nav toggle ---------- */
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');
function closeMobileNav(){
  navLinksEl.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
}
navToggle.addEventListener('click', ()=>{
  const isOpen = navLinksEl.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});
navLinksEl.querySelectorAll('a').forEach(a=> a.addEventListener('click', closeMobileNav));
document.addEventListener('click', e=>{
  if(navLinksEl.classList.contains('open') && !navLinksEl.contains(e.target) && e.target !== navToggle && !navToggle.contains(e.target)){
    closeMobileNav();
  }
});

/* ---------- logo click: reveal full name ---------- */
const brandLogo = document.getElementById('brandLogo');
brandLogo.addEventListener('click', function(e){
  e.preventDefault();
  this.classList.toggle('expanded');
  clearTimeout(brandLogo._t);
  if(this.classList.contains('expanded')){
    brandLogo._t = setTimeout(()=> this.classList.remove('expanded'), 3200);
  }
});

/* ---------- avatar click: greeting ---------- */
document.getElementById('avatarFrame').addEventListener('click', function(e){
  this.style.transform = 'scale(0.97)';
  setTimeout(()=> this.style.transform = '', 180);
  showToast("Hey, I'm Syeda Naveera 👋");
  confettiBurst(e.clientX, e.clientY);
});

/* ---------- floating chips: fact toast ---------- */
document.querySelectorAll('.float-chip[data-fact]').forEach(chip=>{
  chip.addEventListener('click', function(){
    this.style.transform = 'translateY(-4px) scale(0.95)';
    setTimeout(()=> this.style.transform = '', 200);
    showToast(this.dataset.fact);
  });
});

/* ---------- skill chip pop ---------- */
document.querySelectorAll('.skill-chip').forEach(chip=>{
  chip.addEventListener('click', ()=>{
    chip.classList.remove('pop'); void chip.offsetWidth; chip.classList.add('pop');
  });
});

/* ---------- service card expand ---------- */
document.querySelectorAll('.service-card').forEach(card=>{
  card.addEventListener('click', ()=> card.classList.toggle('open'));
  card.addEventListener('keydown', e=>{
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); card.classList.toggle('open'); }
  });
});

/* ---------- toast + copy ---------- */
const toast = document.getElementById('toast');
const toastText = document.getElementById('toastText');
function showToast(msg){
  toastText.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=> toast.classList.remove('show'), 2200);
}
document.querySelectorAll('[data-copy]').forEach(el=>{
  el.addEventListener('click', ()=>{
    const val = el.dataset.copy;
    navigator.clipboard.writeText(val).then(()=> showToast('Copied: '+val)).catch(()=> showToast('Copy this: '+val));
  });
});

/* ---------- project preview modal ---------- */
const modalBg = document.getElementById('modalBg');
const modalIframe = document.getElementById('modalIframe');
const cellinfoSrc = "cellinfo-preview.html";
function openModal(){ modalIframe.src = cellinfoSrc; modalBg.classList.add('show'); document.body.style.overflow='hidden'; }
function closeModal(){ modalBg.classList.remove('show'); document.body.style.overflow=''; setTimeout(()=> modalIframe.src='about:blank', 300); }
document.getElementById('openPreview').addEventListener('click', openModal);
document.getElementById('openPreviewBtn').addEventListener('click', openModal);
document.getElementById('modalClose').addEventListener('click', closeModal);
modalBg.addEventListener('click', e=>{ if(e.target === modalBg) closeModal(); });
window.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });

/* ---------- contact form -> mailto ---------- */
document.getElementById('contactForm').addEventListener('submit', function(e){
  e.preventDefault();
  const inputs = this.querySelectorAll('input,textarea');
  const name = inputs[0].value, email = inputs[1].value, msg = inputs[2].value;
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`);
  window.location.href = `mailto:syeda.naveera.19@gmail.com?subject=${encodeURIComponent('Portfolio inquiry from '+name)}&body=${body}`;
  showToast('Opening your email app…');
  const btn = this.querySelector('button[type="submit"]');
  const r = btn.getBoundingClientRect();
  confettiBurst(r.left + r.width/2, r.top + r.height/2);
});

/* ---------- rotating tagline (typewriter) ---------- */
const taglines = [
  "Frontend developer focused on clean code, considered motion, and interfaces that feel good to use.",
  "I turn plain ideas into interfaces people actually enjoy using.",
  "Building with HTML5, CSS3, JavaScript, PHP, and Bootstrap 5 — responsive from the first line."
];
let tIdx=0;
const rotatingSubEl = document.getElementById('rotatingSub');
if(!reduceMotion && rotatingSubEl){
  function typeTagline(text, cb){
    let i = 0;
    const iv = setInterval(()=>{
      rotatingSubEl.textContent = text.slice(0, i);
      i++;
      if(i > text.length){
        clearInterval(iv);
        if(cb) setTimeout(cb, 2600);
      }
    }, 20);
  }
  function eraseTagline(cb){
    let text = rotatingSubEl.textContent;
    const iv = setInterval(()=>{
      text = text.slice(0, -1);
      rotatingSubEl.textContent = text;
      if(text.length === 0){ clearInterval(iv); if(cb) cb(); }
    }, 10);
  }
  function cycle(){
    eraseTagline(()=>{
      tIdx = (tIdx+1)%taglines.length;
      typeTagline(taglines[tIdx], cycle);
    });
  }
  setTimeout(cycle, 4200);
}
