// ============================================================================
// Shanky & Simran — Wedding Invitation
// ============================================================================

const WEDDING_YEAR = 2027;
const EVENT_DATES = [
  new Date(WEDDING_YEAR, 1, 5, 11, 0, 0), // 0: Ring Ceremony & Sagan
  new Date(WEDDING_YEAR, 1, 6, 17, 0, 0), // 1: Wedding & Baraat
  new Date(WEDDING_YEAR, 1, 7, 19, 0, 0), // 2: Reception
];

document.addEventListener('DOMContentLoaded', () => {
  initEnvelope();
  initReveal();
  initCountdowns();
  initEventTabs();
});

// ---- ENVELOPE INTRO ---------------------------------------------------------
function initEnvelope(){
  const screen = document.getElementById('envelope-screen');
  const card = document.getElementById('envelope-card');
  if(!screen || !card) return;

  card.addEventListener('click', () => {
    screen.classList.add('opening');
  });
  screen.addEventListener('transitionend', () => {
    if(screen.classList.contains('opening')) screen.classList.add('gone');
  });
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
      if(entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.15 });
  targets.forEach(t => io.observe(t));
}

// ---- COUNTDOWNS -----------------------------------------------------------------
function initCountdowns(){
  const pad = n => String(Math.max(0, n)).padStart(2, '0');

  const heroEls = {
    d: document.getElementById('cd-days'),
    h: document.getElementById('cd-hours'),
    m: document.getElementById('cd-mins'),
    s: document.getElementById('cd-secs'),
  };
  const panelEls = [...document.querySelectorAll('[data-countdown]')].map(el => ({
    target: EVENT_DATES[Number(el.dataset.countdown)],
    d: el.querySelector('[data-cd-d]'),
    h: el.querySelector('[data-cd-h]'),
    m: el.querySelector('[data-cd-m]'),
    s: el.querySelector('[data-cd-s]'),
  }));

  function tick(){
    const now = new Date();
    const next = EVENT_DATES.find(d => d > now) || EVENT_DATES[0];
    const diff = Math.max(0, next - now);
    if(heroEls.d){
      heroEls.d.textContent = pad(Math.floor(diff / 86400000));
      heroEls.h.textContent = pad(Math.floor((diff % 86400000) / 3600000));
      heroEls.m.textContent = pad(Math.floor((diff % 3600000) / 60000));
      heroEls.s.textContent = pad(Math.floor((diff % 60000) / 1000));
    }
    panelEls.forEach(p => {
      const dd = Math.max(0, p.target - now);
      p.d.textContent = Math.floor(dd / 86400000);
      p.h.textContent = pad(Math.floor((dd % 86400000) / 3600000));
      p.m.textContent = pad(Math.floor((dd % 3600000) / 60000));
      p.s.textContent = pad(Math.floor((dd % 60000) / 1000));
    });
  }
  tick();
  setInterval(tick, 1000);
}

// ---- EVENT TABS -----------------------------------------------------------------
function initEventTabs(){
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.event-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const idx = tab.dataset.index;
      tabs.forEach(t => {
        const active = t === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', String(active));
      });
      panels.forEach(p => p.classList.toggle('active', p.dataset.index === idx));
    });
  });
}
