const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
const navToggleIcon = navToggle.querySelector('i');
function closeMobileNav(){
  navLinksEl.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggleIcon.className = 'fa-solid fa-bars';
}
navToggle.addEventListener('click', ()=>{
  const isOpen = navLinksEl.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggleIcon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
});
navLinksEl.querySelectorAll('a').forEach(a=> a.addEventListener('click', closeMobileNav));
document.addEventListener('click', e=>{
  if(navLinksEl.classList.contains('open') && !navLinksEl.contains(e.target) && e.target !== navToggle && !navToggle.contains(e.target)){
    closeMobileNav();
  }
});

/* ---------- avatar click: greeting ---------- */
document.getElementById('avatarFrame').addEventListener('click', function(){
  showToast("Hey, I'm Syeda Naveera 👋");
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
function openModal(){ modalIframe.src = "cellinfo-preview.html"; modalBg.classList.add('show'); document.body.style.overflow='hidden'; }
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
});
