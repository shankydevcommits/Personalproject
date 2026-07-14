// ============================================================================
// Shanky & Simran — Wedding Invitation
// ============================================================================

const WEDDING_TARGET = new Date('2027-02-05T00:00:00').getTime();

document.addEventListener('DOMContentLoaded', () => {
  initEnvelope();
  initReveal();
  initCountdown();
  initEventTabs();
  initMusic();
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

// ---- COUNTDOWN -----------------------------------------------------------------
function initCountdown(){
  const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins: document.getElementById('cd-mins'),
    secs: document.getElementById('cd-secs'),
  };
  if(!els.days) return;

  const pad = n => String(n).padStart(2, '0');

  function tick(){
    const diff = Math.max(0, WEDDING_TARGET - Date.now());
    els.days.textContent = pad(Math.floor(diff / 86400000));
    els.hours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    els.mins.textContent = pad(Math.floor((diff % 3600000) / 60000));
    els.secs.textContent = pad(Math.floor((diff % 60000) / 1000));
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

// ---- AMBIENT MUSIC TOGGLE (procedural drone — swap for a real audio track when available) ----
let audioCtx = null;
let master = null;
let oscs = null;
let musicOn = false;

function initMusic(){
  const btn = document.getElementById('music-btn');
  if(!btn) return;
  btn.addEventListener('click', () => {
    musicOn = !musicOn;
    btn.innerHTML = musicOn ? '&#9835;' : '&#9834;';
    if(musicOn) startMusic(); else stopMusic();
  });
}

function startMusic(){
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const ctx = audioCtx;
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.2);

    const freqs = [196.00, 246.94, 293.66]; // G3, B3, D4
    oscs = freqs.map(f => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.5;
      o.connect(g);
      g.connect(master);
      o.start();
      return o;
    });
  } catch(err) { /* Web Audio unavailable — no-op */ }
}

function stopMusic(){
  if(oscs){ oscs.forEach(o => { try{ o.stop(); } catch(err){} }); oscs = null; }
  master = null;
}
