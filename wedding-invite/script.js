// ============================================================================
// Shanky & Simran — Wedding Invitation
// ============================================================================

// ---- CONFIG ----------------------------------------------------------------
// Wedding dates. Today's date at build time was 14 Jul 2026, so the nearest
// upcoming 5-7 Feb window is 2027. Change WEDDING_YEAR below if that's wrong.
const WEDDING_YEAR = 2027;
const EVENT_DATES = {
  sagan:      new Date(WEDDING_YEAR, 1, 5, 11, 0, 0),  // 5 Feb, 11:00
  wedding:    new Date(WEDDING_YEAR, 1, 6, 19, 0, 0),  // 6 Feb, 19:00
  reception:  new Date(WEDDING_YEAR, 1, 7, 19, 0, 0),  // 7 Feb, 19:00
};

document.addEventListener('DOMContentLoaded', () => {
  initEnvelope();
  initNav();
  initReveal();
  initCountdowns();
  initEventTabs();
  initPetals();
  initBackToTop();
  initChime();
});

// ---- ENVELOPE INTRO ---------------------------------------------------------
function initEnvelope(){
  const screen = document.getElementById('envelope-screen');
  const envelope = document.getElementById('envelope');
  const seal = document.getElementById('seal');
  if(!screen || !envelope || !seal) return;

  const open = () => {
    if(envelope.classList.contains('open')) return;
    envelope.classList.add('open');
    playChime('open');
    setTimeout(() => {
      screen.classList.add('opened');
      document.body.style.overflow = '';
    }, 1100);
  };

  seal.addEventListener('click', open);
  document.body.style.overflow = 'hidden';

  // auto-open fallback after 6s in case a visitor doesn't notice the seal
  setTimeout(() => { if(!envelope.classList.contains('open')) { /* leave it, let them discover it */ } }, 6000);
}

// ---- NAV ---------------------------------------------------------------------
function initNav(){
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  const nav = document.getElementById('site-nav');

  toggle?.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });

  const sections = [...document.querySelectorAll('section[id]')];
  const navAnchors = [...document.querySelectorAll('.nav-links a')];

  const onScroll = () => {
    nav.style.boxShadow = window.scrollY > 20 ? '0 4px 20px -10px rgba(122,31,54,.2)' : 'none';
    let current = sections[0]?.id;
    for(const sec of sections){
      const rect = sec.getBoundingClientRect();
      if(rect.top <= 120) current = sec.id;
    }
    navAnchors.forEach(a => a.classList.toggle('active-link', a.getAttribute('href') === `#${current}`));
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ---- SCROLL REVEAL -------------------------------------------------------------
function initReveal(){
  const targets = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){
    targets.forEach(t => t.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach(t => io.observe(t));
}

// ---- COUNTDOWNS -----------------------------------------------------------------
function initCountdowns(){
  const heroEls = {
    d: document.getElementById('cd-days'),
    h: document.getElementById('cd-hours'),
    m: document.getElementById('cd-mins'),
    s: document.getElementById('cd-secs'),
  };
  const panelEls = [...document.querySelectorAll('[data-countdown]')].map(el => ({
    key: el.dataset.countdown,
    d: el.querySelector('[data-cd-d]'),
    h: el.querySelector('[data-cd-h]'),
    m: el.querySelector('[data-cd-m]'),
    s: el.querySelector('[data-cd-s]'),
  }));

  const pad = n => String(Math.max(0, n)).padStart(2, '0');

  const tick = () => {
    const now = new Date();

    // hero counts down to the first upcoming event (sagan, or whichever is next)
    const next = Object.entries(EVENT_DATES).find(([, date]) => date > now)?.[1] ?? EVENT_DATES.sagan;
    let diff = Math.max(0, next - now);
    let days = Math.floor(diff / 86400000);
    let hours = Math.floor((diff % 86400000) / 3600000);
    let mins = Math.floor((diff % 3600000) / 60000);
    let secs = Math.floor((diff % 60000) / 1000);
    if(heroEls.d){
      heroEls.d.textContent = pad(days);
      heroEls.h.textContent = pad(hours);
      heroEls.m.textContent = pad(mins);
      heroEls.s.textContent = pad(secs);
    }

    // per-event mini countdowns
    panelEls.forEach(p => {
      const target = EVENT_DATES[p.key];
      const dd = Math.max(0, target - now);
      p.d.textContent = Math.floor(dd / 86400000);
      p.h.textContent = pad(Math.floor((dd % 86400000) / 3600000));
      p.m.textContent = pad(Math.floor((dd % 3600000) / 60000));
      p.s.textContent = pad(Math.floor((dd % 60000) / 1000));
    });
  };

  tick();
  setInterval(tick, 1000);
}

// ---- EVENT TABS (swaps illustration outfits) -----------------------------------
function initEventTabs(){
  const tabs = document.querySelectorAll('.event-tab');
  const panels = document.querySelectorAll('.event-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.event;

      tabs.forEach(t => { t.classList.toggle('active', t === tab); t.setAttribute('aria-selected', String(t === tab)); });
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === key));

      document.body.setAttribute('data-active-event', key);
      playChime('tab');

      // little celebratory burst on the illustration when switching to wedding day
      if(key === 'wedding') burstSparkles();
    });
  });
}

function burstSparkles(){
  const stage = document.getElementById('couple-stage');
  if(!stage) return;
  for(let i = 0; i < 10; i++){
    const dot = document.createElement('span');
    dot.textContent = '✦';
    dot.style.cssText = `
      position:absolute; left:${45 + Math.random()*20}%; top:${30 + Math.random()*20}%;
      color:#C9A15A; font-size:${10 + Math.random()*10}px; pointer-events:none;
      animation: sparkle-burst .9s ease-out forwards;
    `;
    stage.appendChild(dot);
    setTimeout(() => dot.remove(), 950);
  }
  if(!document.getElementById('sparkle-burst-style')){
    const style = document.createElement('style');
    style.id = 'sparkle-burst-style';
    style.textContent = `@keyframes sparkle-burst{ from{ opacity:1; transform: translateY(0) scale(0.6);} to{ opacity:0; transform: translateY(-60px) scale(1.3);} }`;
    document.head.appendChild(style);
  }
}

// ---- FLOATING PETALS BACKGROUND ------------------------------------------------
function initPetals(){
  const canvas = document.getElementById('petal-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, petals;
  const COUNT = window.innerWidth < 700 ? 16 : 28;

  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const rand = (a, b) => a + Math.random() * (b - a);
  const colors = ['#E8A6BC', '#D46A8C', '#F7DCE6', '#C9A15A'];

  petals = Array.from({ length: COUNT }, () => ({
    x: rand(0, w), y: rand(-h, 0),
    size: rand(6, 14), speed: rand(0.4, 1.1),
    drift: rand(-0.6, 0.6), angle: rand(0, Math.PI * 2),
    spin: rand(-0.02, 0.02), color: colors[Math.floor(Math.random() * colors.length)],
  }));

  function drawPetal(p){
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size / 1.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  let reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function loop(){
    ctx.clearRect(0, 0, w, h);
    petals.forEach(p => {
      if(!reduceMotion){
        p.y += p.speed;
        p.x += p.drift;
        p.angle += p.spin;
        if(p.y > h + 20){ p.y = -20; p.x = rand(0, w); }
      }
      drawPetal(p);
    });
    requestAnimationFrame(loop);
  }
  loop();
}

// ---- BACK TO TOP ---------------------------------------------------------------
function initBackToTop(){
  const btn = document.getElementById('back-to-top');
  if(!btn) return;
  document.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ---- TINY PROCEDURAL SOUND (no audio files needed) --------------------------------
let audioCtx = null;
let soundEnabled = true;

function initChime(){
  const btn = document.getElementById('chime-toggle');
  const onIcon = btn?.querySelector('.icon-sound-on');
  const offIcon = btn?.querySelector('.icon-sound-off');
  btn?.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    btn.setAttribute('aria-pressed', String(soundEnabled));
    onIcon.hidden = !soundEnabled;
    offIcon.hidden = soundEnabled;
    if(soundEnabled) playChime('tab');
  });
}

function playChime(kind){
  if(!soundEnabled) return;
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const notesByKind = {
      open: [523.25, 659.25, 783.99],
      tab: [659.25, 783.99],
      success: [523.25, 659.25, 783.99, 1046.5],
    };
    const notes = notesByKind[kind] || notesByKind.tab;
    notes.forEach((freq, i) => {
      const t = audioCtx.currentTime + i * 0.09;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.06, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.4);
    });
  } catch(err){ /* audio not available — ignore */ }
}
