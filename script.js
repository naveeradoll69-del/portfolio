const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fineHover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

/* ---------- 3D tilt on cards + avatar ---------- */
if(fineHover && !reduceMotion){
  function tiltify(el, opts){
    const { lift = 0, maxDeg = 7 } = opts || {};
    el.addEventListener('mousemove', e=>{
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left)/r.width - 0.5;
      const py = (e.clientY - r.top)/r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-py*maxDeg).toFixed(2)}deg) rotateY(${(px*maxDeg).toFixed(2)}deg) translateY(${lift}px)`;
    });
    el.addEventListener('mouseleave', ()=>{ el.style.transform=''; });
  }
  tiltify(document.querySelector('.avatar-frame'), { maxDeg: 9 });
  document.querySelectorAll('.project-card').forEach(el=> tiltify(el, { lift:-4, maxDeg:4 }));
  document.querySelectorAll('.service-card').forEach(el=> tiltify(el, { lift:-4, maxDeg:5 }));
}

/* ---------- hero entrance ---------- */
requestAnimationFrame(()=>{
  const hero = document.querySelector('.hero');
  if(hero) hero.classList.add('hero-ready');
});

/* ---------- scroll reveal (staggered within a shared group) ---------- */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const group = e.target.closest('[data-stagger]');
      const delay = group ? Array.from(group.children).indexOf(e.target) * 70 : 0;
      e.target.style.transitionDelay = delay + 'ms';
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, {threshold:0.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ---------- count-up stats ---------- */
const statIo = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    statIo.unobserve(el);
    if(reduceMotion){ el.textContent = target; return; }
    const duration = 900;
    const start = performance.now();
    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
      if(progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}, {threshold:0.4});
document.querySelectorAll('.stat-num[data-count], .skill-level-pct[data-count]').forEach(el=>statIo.observe(el));

/* ---------- skill level bars ---------- */
const fillIo = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    entry.target.style.width = entry.target.dataset.fill + '%';
    fillIo.unobserve(entry.target);
  });
}, {threshold:0.4});
document.querySelectorAll('.skill-level-fill[data-fill]').forEach(el=>fillIo.observe(el));

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

/* ---------- code peek reveal ---------- */
(function(){
  const btn = document.getElementById('codePeekBtn');
  const panel = document.getElementById('codePeek');
  const codeEl = document.getElementById('codePeekText');
  if(!btn || !panel || !codeEl) return;

  const plainCode =
`const developer = {
  name: 'Syeda Naveera',
  role: 'Frontend Developer',
  stack: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'Bootstrap'],
  status: 'available for internships' // let's build something
};`;

  const highlightedCode =
`<span class="k">const</span> developer = {
  name: <span class="s">'Syeda Naveera'</span>,
  role: <span class="s">'Frontend Developer'</span>,
  stack: [<span class="s">'HTML5'</span>, <span class="s">'CSS3'</span>, <span class="s">'JavaScript'</span>, <span class="s">'PHP'</span>, <span class="s">'Bootstrap'</span>],
  status: <span class="s">'available for internships'</span> <span class="c">// let's build something</span>
};`;

  let typed = false;
  function typeCode(){
    if(typed) return;
    typed = true;
    if(reduceMotion){ codeEl.innerHTML = highlightedCode; return; }
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'code-peek-cursor';
    function tick(){
      codeEl.textContent = plainCode.slice(0, i);
      codeEl.appendChild(cursor);
      i++;
      if(i <= plainCode.length){
        setTimeout(tick, 14);
      } else {
        codeEl.innerHTML = highlightedCode;
      }
    }
    tick();
  }

  btn.addEventListener('click', ()=>{
    const isOpen = panel.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
    if(isOpen) typeCode();
  });

  const copyBtn = document.getElementById('codePeekCopy');
  if(copyBtn){
    copyBtn.addEventListener('click', e=>{
      e.stopPropagation();
      navigator.clipboard.writeText(plainCode).then(()=>{
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        showToast('Code copied!');
        const r = copyBtn.getBoundingClientRect();
        if(typeof heartBurst === 'function') heartBurst(r.left + r.width/2, r.top);
        setTimeout(()=>{
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
        }, 1600);
      }).catch(()=> showToast('Could not copy — select the code manually'));
    });
  }
})();

/* ---------- avatar click: greeting ---------- */
document.getElementById('avatarFrame').addEventListener('click', function(){
  showToast("Hey, I'm Syeda Naveera");
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
  showToast('Opening your email app… thank you!');
  if(!reduceMotion){
    const btn = this.querySelector('button[type="submit"]');
    const r = btn.getBoundingClientRect();
    heartBurst(r.left + r.width/2, r.top);
  }
});

/* ---------- gentle heart burst (SVG icons) ---------- */
const HEART_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 21s-6.7-4.35-9.3-8.1C.8 10.3 1.4 6.9 4.3 5.4c2.2-1.15 4.7-.4 6 1.4.4.5.7 1 1 1.5.3-.5.6-1 1-1.5 1.3-1.8 3.8-2.55 6-1.4 2.9 1.5 3.5 4.9 1.6 7.5C18.7 16.65 12 21 12 21z"/></svg>';
const SPARKLE_SVG = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/></svg>';
const BURST_ICONS = [HEART_SVG, SPARKLE_SVG, HEART_SVG];
const BURST_COLORS = ['var(--accent)', 'var(--accent-soft)', '#e6b45c'];
function heartBurst(x, y){
  for(let i=0;i<5;i++){
    const h = document.createElement('span');
    h.className = 'heart-piece';
    h.innerHTML = BURST_ICONS[i % BURST_ICONS.length];
    h.style.color = BURST_COLORS[i % BURST_COLORS.length];
    h.style.left = (x + (Math.random()*60-30)) + 'px';
    h.style.top = y + 'px';
    h.style.animationDelay = (i*70) + 'ms';
    document.body.appendChild(h);
    setTimeout(()=> h.remove(), 1400);
  }
}
