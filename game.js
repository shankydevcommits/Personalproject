/* ============================================================
   CRICKET WORLD CUP — Spin to Glory
   Pure-luck cricket. Pick your length. One wheel decides all.
   ============================================================ */

const TEAMS = [
  { code: 'IND', name: 'India',        flag: '🇮🇳' },
  { code: 'AUS', name: 'Australia',    flag: '🇦🇺' },
  { code: 'ENG', name: 'England',      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'PAK', name: 'Pakistan',     flag: '🇵🇰' },
  { code: 'NZ',  name: 'New Zealand',  flag: '🇳🇿' },
  { code: 'SA',  name: 'South Africa', flag: '🇿🇦' },
  { code: 'WI',  name: 'West Indies',  flag: '🌴' },
  { code: 'SL',  name: 'Sri Lanka',    flag: '🇱🇰' },
  { code: 'BAN', name: 'Bangladesh',   flag: '🇧🇩' },
  { code: 'AFG', name: 'Afghanistan',  flag: '🇦🇫' },
];

const STADIUMS = [
  { id: 'mcg',     icon: '🏟️', name: 'The MCG',          city: 'Melbourne', unlock: 0 },
  { id: 'lords',   icon: '🏛️', name: "Lord's",           city: 'London',    unlock: 0 },
  { id: 'eden',    icon: '🎆', name: 'Eden Gardens',      city: 'Kolkata',   unlock: 1 },
  { id: 'wankhede',icon: '🌊', name: 'Wankhede Stadium',  city: 'Mumbai',    unlock: 3 },
  { id: 'newlands',icon: '⛰️', name: 'Newlands',          city: 'Cape Town', unlock: 5 },
  { id: 'galle',   icon: '🏰', name: 'Galle Fort Ground', city: 'Galle',     unlock: 10 },
];

/* Wheel — 8 slices, every cricket outcome exactly once. */
const SEGMENTS = [
  { label: '0', runs: 0,   color: '#f4793b' },
  { label: '1', runs: 1,   color: '#2f7bff' },
  { label: '2', runs: 2,   color: '#1fb6d4' },
  { label: '3', runs: 3,   color: '#27d17f' },
  { label: '4', runs: 4,   color: '#7c4dff' },
  { label: '5', runs: 5,   color: '#ff7ad9' },
  { label: '6', runs: 6,   color: '#ffc83d' },
  { label: 'W', runs: 'W', color: '#ff4d6a' },
];
const SEG_COUNT = SEGMENTS.length;
const POINTS_PER_WIN = 2;
const CHAMPION_BONUS = 10;

/* Match lengths: overs → balls and wickets in hand */
const FORMATS = {
  1: { balls: 6,  wkts: 2, label: '1 OVER' },
  2: { balls: 12, wkts: 3, label: '2 OVERS' },
  3: { balls: 18, wkts: 4, label: '3 OVERS' },
  5: { balls: 30, wkts: 4, label: 'FULL GAME' },
};

/* Wheel odds per difficulty (player picks; percentages stay our secret).
   `bat` biases your batting spins, `bowl` biases the bot's batting spins.
   Tuned by simulating 400k one-over matches. */
const DIFFICULTY = {
  easy:   { bat: { 6: 1.2, 5: 1.15, 4: 1.2, W: 0.7, 0: 0.85 },     bowl: { 6: 0.75, 5: 0.8, 4: 0.8, W: 1.5, 0: 1.2 } },
  medium: { bat: {},                                                bowl: {} },
  hard:   { bat: { 6: 0.52, 5: 0.57, 4: 0.62, W: 2.5, 0: 1.35 },   bowl: { 6: 1.85, 5: 1.75, 4: 1.75, W: 0.37, 0: 0.62 } },
};

/* Squads — 5 batsmen + 3 bowlers per country, every name a loving pun */
const SQUADS = {
  IND: {
    bat: [{ name: 'Viral Kohli', emoji: '🔥' }, { name: 'Rohit Charmer', emoji: '✨' }, { name: 'Helicopter Mahi', emoji: '🚁' }, { name: 'Sachin Ten-Duelkar', emoji: '⚔️' }, { name: 'Gautam Gambler', emoji: '🎲' }],
    bowl: [{ name: 'Jasprit Boom-rah', emoji: '💣' }, { name: 'Kul-Deep Spinner', emoji: '🌀' }, { name: 'Bhuvi Swing-Kumar', emoji: '🎺' }],
  },
  AUS: {
    bat: [{ name: 'Steve Smasher', emoji: '💥' }, { name: 'Glenn Maxi-Well', emoji: '⚡' }, { name: 'David Warner Bros', emoji: '🎬' }, { name: 'Ricky Pointing', emoji: '👉' }, { name: 'Travis Headbanger', emoji: '🤘' }],
    bowl: [{ name: 'Mitch Starc-Struck', emoji: '🌟' }, { name: 'Pat Express Cummins', emoji: '🚄' }, { name: 'Nathan the Lion', emoji: '🦁' }],
  },
  ENG: {
    bat: [{ name: 'Ben Strokes', emoji: '🚣' }, { name: 'Joe Rooter', emoji: '🌳' }, { name: 'Jos the Butler', emoji: '🤵' }, { name: 'Kevin Pieter-Sun', emoji: '☀️' }, { name: 'Harry Brookworm', emoji: '📖' }],
    bowl: [{ name: 'Jimmy Anders-Swing', emoji: '🌬️' }, { name: 'Stuart Broad-Smile', emoji: '😁' }, { name: 'Jofra Archer-y', emoji: '🏹' }],
  },
  PAK: {
    bat: [{ name: 'Babar A-Slam', emoji: '💥' }, { name: 'Inzamam-ul-Hulk', emoji: '💪' }, { name: 'Shahid A-Fridge', emoji: '🧊' }, { name: 'Mohammad Rizz-wan', emoji: '😏' }, { name: 'Fakhar Zaman-ia', emoji: '🎉' }],
    bowl: [{ name: 'Wasim A-Cram', emoji: '📚' }, { name: 'Shaheen Shah of Swing', emoji: '🦅' }, { name: 'Waqar Yorker-nis', emoji: '🎯' }],
  },
  NZ: {
    bat: [{ name: 'Kane Williamsong', emoji: '🎵' }, { name: 'Brendon McBoom', emoji: '💣' }, { name: 'Ross Tailor', emoji: '✂️' }, { name: 'Martin Gup-Tilt', emoji: '🎯' }, { name: 'Devon Conway-or-Highway', emoji: '🛣️' }],
    bowl: [{ name: 'Trent Bolt', emoji: '🔩' }, { name: 'Tim Southee-Paw', emoji: '🐾' }, { name: 'Daniel Vettori-ous', emoji: '🏆' }],
  },
  SA: {
    bat: [{ name: 'AB de Chilliers', emoji: '🌶️' }, { name: 'Quinton de Sock', emoji: '🧦' }, { name: 'Hashim Am-La-La', emoji: '🎶' }, { name: 'Jacques Cool-is', emoji: '😎' }, { name: 'Faf the Laugh', emoji: '😂' }],
    bowl: [{ name: 'Dale Steyn-less Steel', emoji: '🔪' }, { name: 'Kagiso Ra-bada-boom', emoji: '💥' }, { name: 'Allan Donald Duck', emoji: '🦆' }],
  },
  WI: {
    bat: [{ name: 'Chris Gale-Force', emoji: '🌪️' }, { name: 'Brian Lah-Rah', emoji: '📣' }, { name: 'Dwayne Bravo!', emoji: '👏' }, { name: 'Andre Muscle', emoji: '💪' }, { name: 'Shimron Sky-Hetmyer', emoji: '🚀' }],
    bowl: [{ name: 'Curtly Ambrose-ia', emoji: '🍯' }, { name: 'Courtney Walsh-ing Machine', emoji: '🌀' }, { name: 'Sunil Narine-ja', emoji: '🥷' }],
  },
  SL: {
    bat: [{ name: 'Kumar Sangakaraoke', emoji: '🎤' }, { name: 'Mahela Jaya-Winner', emoji: '🏅' }, { name: 'Tillakaratne Dil-Scoop', emoji: '🍨' }, { name: 'Sanath Jaya-Sunya', emoji: '☀️' }, { name: 'Angelo Math-ews', emoji: '➗' }],
    bowl: [{ name: 'Lasith Sling-Shot', emoji: '🪃' }, { name: 'Muttiah Murali-Whirl', emoji: '🌀' }, { name: 'Chaminda Vaas-t Ocean', emoji: '🌊' }],
  },
  BAN: {
    bat: [{ name: 'Shakib Al Hammer', emoji: '🔨' }, { name: 'Tamim Iq-Bowl', emoji: '🎳' }, { name: 'Mushfiqur The Rock', emoji: '🪨' }, { name: 'Litton Das-h', emoji: '💨' }, { name: 'Silent Killer Riyad', emoji: '🤫' }],
    bowl: [{ name: 'Mustafizur The Fizz', emoji: '🥤' }, { name: 'Mashrafe More-Taza', emoji: '🌶️' }, { name: 'Taskin Tornado', emoji: '🌪️' }],
  },
  AFG: {
    bat: [{ name: 'Rahmanullah Gur-Blaze', emoji: '🔥' }, { name: 'Hazratullah Za-Zai-nami', emoji: '🌊' }, { name: 'Ibrahim Zad-Sprint', emoji: '🏃' }, { name: 'Mohammad Na-Beast', emoji: '🦁' }, { name: 'Najibullah Zad-Boom', emoji: '💥' }],
    bowl: [{ name: 'Rashid Khan-fetti', emoji: '🎊' }, { name: 'Mujeeb Mystery-Zad', emoji: '🔮' }, { name: 'Mohammad Nabi-Strike', emoji: '🎯' }],
  },
};
function squadBat(code) {
  return SQUADS[code] ? SQUADS[code].bat : Object.values(SQUADS).flatMap(s => s.bat);
}
function squadBowl(code) {
  return SQUADS[code] ? SQUADS[code].bowl : Object.values(SQUADS).flatMap(s => s.bowl);
}

const FLAG_OPTIONS = ['🦁','🐯','🦅','🐉','🔥','⚡','🌟','🦈','🐺','👑','💎','🌋','🛡️','🚀'];

const LEGENDS = [
  { name: 'Sir Lucky Lara',    flag: '🌴', pts: 312, streak: 14 },
  { name: 'Don Spinman',       flag: '🇦🇺', pts: 284, streak: 12 },
  { name: 'Wheel-iv Richards', flag: '🌴', pts: 251, streak: 11 },
];

const BADGES = [
  { id: 'first-win',  icon: '🥇', name: 'First Blood',     desc: 'Win your first match',                 test: p => p.wins >= 1 },
  { id: 'champion',   icon: '🏆', name: 'World Champion',  desc: 'Win the World Cup',                    test: p => p.trophies >= 1 },
  { id: 'dynasty',    icon: '👑', name: 'Dynasty',         desc: 'Win 3 World Cups',                     test: p => p.trophies >= 3 },
  { id: 'squad-boss', icon: '🧢', name: 'Squad Boss',      desc: 'Win 5 World Cups',                     test: p => p.trophies >= 5 },
  { id: 'franchise',  icon: '🛠️', name: 'Franchise Owner', desc: 'Win 10 World Cups — create your team', test: p => p.trophies >= 10 },
  { id: 'streak3',    icon: '🔥', name: 'On Fire',         desc: 'Win 3 matches in a row',               test: p => p.bestStreak >= 3 },
  { id: 'streak7',    icon: '☄️', name: 'Unstoppable',     desc: 'Win 7 matches in a row',               test: p => p.bestStreak >= 7 },
  { id: 'maximum',    icon: '💥', name: 'Maximum Damage',  desc: 'Hit 3 sixes in one innings',           test: p => p.threeSixes },
  { id: 'globetrot',  icon: '🌍', name: 'Globetrotter',    desc: 'Unlock every stadium',                 test: p => p.wins >= 10 },
];

const CUSTOM_TEAM_UNLOCK_CUPS = 10;

/* ---------------- persistent profile ---------------- */
const DEFAULT_PROFILE = {
  points: 0, trophies: 0, wins: 0, streak: 0, bestStreak: 0,
  threeSixes: false, customTeam: null, batsmen: [], bowler: null,
};
let profile = loadProfile();

function loadProfile() {
  try { return { ...DEFAULT_PROFILE, ...JSON.parse(localStorage.getItem('cwc-profile') || '{}') }; }
  catch { return { ...DEFAULT_PROFILE }; }
}
function saveProfile() { localStorage.setItem('cwc-profile', JSON.stringify(profile)); }

/* ---------------- game state ---------------- */
let setup = {};
let match = null;
let cup = null;
let spinning = false;
let wheelAngle = 0;
let pickedFlag = null;

const CUP_ROUNDS = ['GROUP STAGE', 'QUARTER-FINAL', 'SEMI-FINAL', 'THE FINAL'];

const $ = id => document.getElementById(id);

function allTeams() {
  return profile.customTeam ? [...TEAMS, profile.customTeam] : TEAMS;
}
function team(code) {
  return allTeams().find(t => t.code === code) || { code, name: code, flag: '🏴‍☠️' };
}
function stadium(id) { return STADIUMS.find(s => s.id === id) || STADIUMS[0]; }
function customTeamUnlocked() { return profile.trophies >= CUSTOM_TEAM_UNLOCK_CUPS; }

/* ============================================================
   SOUND — tiny WebAudio synth, no audio files needed
   ============================================================ */
let audioCtx = null;
function ac() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function tone(freq, dur, type = 'square', vol = .08, when = 0) {
  try {
    const ctx = ac(), o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, ctx.currentTime + when);
    g.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + when + dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(ctx.currentTime + when); o.stop(ctx.currentTime + when + dur);
  } catch {}
}
function crowdCheer() {
  try {
    const ctx = ac(), len = ctx.sampleRate * 1.2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.5);
    const src = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = .6;
    g.gain.value = .25;
    src.buffer = buf; src.connect(f); f.connect(g); g.connect(ctx.destination); src.start();
  } catch {}
}
const sfx = {
  tick: () => tone(1400, .03, 'square', .04),
  pick: () => tone(660, .08, 'triangle', .1),
  six: () => { crowdCheer(); tone(523, .12, 'triangle', .12); tone(659, .12, 'triangle', .12, .1); tone(784, .25, 'triangle', .12, .2); },
  four: () => { crowdCheer(); tone(523, .12, 'triangle', .12); tone(659, .2, 'triangle', .12, .1); },
  run: () => tone(440, .1, 'triangle', .1),
  dot: () => tone(220, .15, 'sine', .1),
  wicket: () => { tone(180, .3, 'sawtooth', .14); tone(120, .4, 'sawtooth', .14, .12); },
  win: () => { crowdCheer(); [523,659,784,1047].forEach((f,i)=>tone(f,.22,'triangle',.12,i*.14)); },
  lose: () => { [392,330,262].forEach((f,i)=>tone(f,.3,'sine',.1,i*.18)); },
};

/* ============================================================
   SCREENS
   ============================================================ */
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}
function goHome() { cup = null; refreshHud(); show('screen-home'); }

function refreshHud() {
  $('hud-trophies').textContent = profile.trophies;
  $('hud-points').textContent = profile.points;
  $('hud-streak').textContent = profile.streak;
}

function toast(msg, ms = 2400) {
  const t = $('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), ms);
}

function openModal(id) { $(id).classList.add('open'); }
function closeModal(id) { $(id).classList.remove('open'); }

/* ---------------- quitting a match ---------------- */
function confirmQuit() { sfx.pick(); openModal('modal-quit'); }
function quitMatch() {
  closeModal('modal-quit');
  match = null;      // stops any in-flight spin from resolving
  spinning = false;
  $('btn-spin').classList.remove('spinning');
  goHome();
}

/* ============================================================
   SETUP FLOW  — modes: quick | cup
   ============================================================ */
function startSetup(mode) {
  sfx.pick();
  setup = {
    mode, myTeam: null, oppTeam: null, batFirst: null,
    overs: null, difficulty: null, stadium: null,
    batsmen: [], bowler: null,
  };

  $('setup-title').textContent = mode === 'cup' ? '🏆 WORLD CUP' : '⚡ QUICK MATCH';
  $('step-opp').style.display = mode === 'quick' ? '' : 'none';

  renderTeamGrid('grid-myteam', t => {
    setup.myTeam = t;
    if (setup.oppTeam === t) setup.oppTeam = null;
    // squad picks belong to a country — keep only ones still valid
    const validBat = squadBat(t).map(p => p.name);
    const validBowl = squadBowl(t).map(p => p.name);
    setup.batsmen = (profile.batsmen || []).filter(n => validBat.includes(n)).slice(0, 3);
    setup.bowler = validBowl.includes(profile.bowler) ? profile.bowler : null;
    renderSquad();
    renderSetup();
  }, true);
  renderTeamGrid('grid-oppteam', t => { setup.oppTeam = t; renderSetup(); }, false);
  renderSquad();
  renderStadiums();
  renderSetup();
  show('screen-setup');
}

function renderTeamGrid(gridId, onPick, isMyGrid) {
  const grid = $(gridId);
  grid.innerHTML = '';
  allTeams().forEach(t => {
    const b = document.createElement('button');
    b.className = 'team-card';
    b.dataset.code = t.code;
    b.innerHTML = `<span class="flag">${t.flag}</span><span class="code">${t.code}</span>`;
    b.onclick = () => { sfx.pick(); onPick(t.code); };
    grid.appendChild(b);
  });

  if (isMyGrid && !profile.customTeam) {
    const c = document.createElement('button');
    c.className = 'team-card create';
    if (customTeamUnlocked()) {
      c.innerHTML = `<span class="flag">➕</span><span class="code">CREATE</span>`;
      c.onclick = () => { sfx.pick(); openTeamModal(); };
    } else {
      c.innerHTML = `<span class="flag">🔒</span><span class="code">10 🏆</span>`;
      c.onclick = () => toast(`🔒 Win ${CUSTOM_TEAM_UNLOCK_CUPS} World Cups to create your own team! (${profile.trophies}/${CUSTOM_TEAM_UNLOCK_CUPS})`);
    }
    grid.appendChild(c);
  }
}

function renderSquad() {
  const batGrid = $('grid-batsmen');
  const bowlGrid = $('grid-bowler');
  batGrid.innerHTML = '';
  bowlGrid.innerHTML = '';
  if (!setup.myTeam) {
    batGrid.innerHTML = '<div class="locked-banner">👆 Pick your country first to meet its legends</div>';
    bowlGrid.innerHTML = '<div class="locked-banner">👆 Pick your country first</div>';
    return;
  }
  squadBat(setup.myTeam).forEach(p => {
    const b = document.createElement('button');
    b.className = 'batsman-card';
    b.innerHTML = `<span class="b-emoji">${p.emoji}</span>${p.name}`;
    b.dataset.name = p.name;
    b.onclick = () => {
      sfx.pick();
      const i = setup.batsmen.indexOf(p.name);
      if (i >= 0) setup.batsmen.splice(i, 1);
      else if (setup.batsmen.length < 3) setup.batsmen.push(p.name);
      else { toast('🧢 Top 3 is full — tap a picked batsman to swap out'); return; }
      renderSetup();
    };
    batGrid.appendChild(b);
  });
  squadBowl(setup.myTeam).forEach(p => {
    const b = document.createElement('button');
    b.className = 'batsman-card';
    b.innerHTML = `<span class="b-emoji">${p.emoji}</span>${p.name}`;
    b.dataset.name = p.name;
    b.onclick = () => {
      sfx.pick();
      setup.bowler = setup.bowler === p.name ? null : p.name;
      renderSetup();
    };
    bowlGrid.appendChild(b);
  });
}

function pickBatBowl(choice) { sfx.pick(); setup.batFirst = choice === 'bat'; renderSetup(); }
function pickOvers(o) { sfx.pick(); setup.overs = o; renderSetup(); }
function pickDifficulty(d) { sfx.pick(); setup.difficulty = d; renderSetup(); }

function renderStadiums() {
  const list = $('grid-stadium');
  list.innerHTML = '';
  STADIUMS.forEach(s => {
    const locked = profile.wins < s.unlock;
    const b = document.createElement('button');
    b.className = 'stadium-card' + (locked ? ' locked' : '');
    b.innerHTML = `<span class="s-icon">${s.icon}</span>
      <span class="s-meta"><b>${s.name}</b><small>${s.city}</small></span>
      <span class="s-lock">${locked ? `🔒<br>Win ${s.unlock}` : ''}</span>`;
    b.onclick = () => {
      if (locked) { toast(`🔒 Win ${s.unlock} matches to unlock ${s.name}`); return; }
      sfx.pick(); setup.stadium = s.id; renderSetup();
    };
    list.appendChild(b);
  });
}

function renderSetup() {
  document.querySelectorAll('#grid-myteam .team-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.code === setup.myTeam);
  });
  document.querySelectorAll('#grid-oppteam .team-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.code === setup.oppTeam);
    c.classList.toggle('disabled', c.dataset.code === setup.myTeam);
  });
  $('pick-bat').classList.toggle('selected', setup.batFirst === true);
  $('pick-bowl').classList.toggle('selected', setup.batFirst === false);
  [1, 2, 3, 5].forEach(o => $('overs-' + o).classList.toggle('selected', setup.overs === o));
  ['easy', 'medium', 'hard'].forEach(d => $('diff-' + d).classList.toggle('selected', setup.difficulty === d));
  document.querySelectorAll('#grid-stadium .stadium-card').forEach((c, i) => {
    c.classList.toggle('selected', STADIUMS[i].id === setup.stadium);
  });
  document.querySelectorAll('#grid-batsmen .batsman-card').forEach(c => {
    const order = setup.batsmen.indexOf(c.dataset.name);
    c.classList.toggle('selected', order >= 0);
    const old = c.querySelector('.order-pip');
    if (old) old.remove();
    if (order >= 0) {
      const pip = document.createElement('span');
      pip.className = 'order-pip';
      pip.textContent = order + 1;
      c.appendChild(pip);
    }
  });
  document.querySelectorAll('#grid-bowler .batsman-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.name === setup.bowler);
  });

  const ready =
    setup.myTeam && setup.batFirst !== null && setup.overs &&
    setup.difficulty && setup.stadium &&
    (setup.mode !== 'quick' || setup.oppTeam);
  $('btn-start').disabled = !ready;
}

/* ---------------- custom team ---------------- */
function openTeamModal() {
  pickedFlag = null;
  $('ct-name').value = '';
  $('ct-code').value = '';
  const fg = $('ct-flags');
  fg.innerHTML = '';
  FLAG_OPTIONS.forEach(f => {
    const o = document.createElement('div');
    o.className = 'flag-opt';
    o.textContent = f;
    o.onclick = () => {
      sfx.pick(); pickedFlag = f;
      fg.querySelectorAll('.flag-opt').forEach(x => x.classList.toggle('selected', x.textContent === f));
    };
    fg.appendChild(o);
  });
  openModal('modal-team');
}

function saveCustomTeam() {
  const name = $('ct-name').value.trim();
  const code = $('ct-code').value.trim().toUpperCase();
  if (name.length < 3) { toast('Team name needs at least 3 letters'); return; }
  if (!/^[A-Z]{3}$/.test(code)) { toast('Code must be exactly 3 letters, e.g. TTN'); return; }
  if (TEAMS.some(t => t.code === code)) { toast(`${code} is taken by a real team — pick another`); return; }
  if (!pickedFlag) { toast('Pick a flag for your team!'); return; }
  profile.customTeam = { code, name, flag: pickedFlag, custom: true };
  saveProfile();
  closeModal('modal-team');
  toast(`🛠️ ${name} (${code}) created! They're in your team list now.`);
  startSetup(setup.mode);
}

/* ============================================================
   MATCH ENGINE
   ============================================================ */
function battingLineup() {
  const roster = squadBat(setup.myTeam).map(p => p.name);
  const picked = (setup.batsmen || []).filter(n => roster.includes(n));
  const rest = roster.filter(n => !picked.includes(n));
  return [...picked, ...rest].slice(0, 5);
}
function myBowlerName() {
  const roster = squadBowl(setup.myTeam).map(p => p.name);
  return roster.includes(setup.bowler) ? setup.bowler : roster[0];
}

function startMatch() {
  if (setup.batsmen.length || setup.bowler) {
    profile.batsmen = [...setup.batsmen];
    profile.bowler = setup.bowler;
    saveProfile();
  }
  if (setup.mode === 'cup' && !cup) {
    const pool = allTeams().filter(t => t.code !== setup.myTeam).sort(() => Math.random() - .5);
    cup = { round: 0, opponents: pool.slice(0, 4).map(t => t.code) };
  }

  const opp = setup.mode === 'cup' ? cup.opponents[cup.round] : setup.oppTeam;
  const fmt = FORMATS[setup.overs];

  match = {
    opp,
    ballsLimit: fmt.balls,
    maxWkts: fmt.wkts,
    innings: 1,
    myBatting: setup.batFirst,
    balls: 0, wickets: 0,
    myScore: 0, myWkts: 0,
    oppScore: 0, oppWkts: 0,
    sixesThisInnings: 0,
    target: null,
    over: false,
    log: [],
    batters: battingLineup(),
    oppBatters: squadBat(opp).slice(0, 5).map(p => p.name),
    myBowler: myBowlerName(),
    oppBowler: squadBowl(opp)[0].name,
  };

  const st = stadium(setup.stadium);
  $('match-stadium').textContent = `${st.icon} ${st.name}, ${st.city}`;
  $('match-stage').textContent =
    (setup.mode === 'cup' ? CUP_ROUNDS[cup.round] : 'QUICK MATCH') + ' · ' + fmt.label;

  $('sb-flag-a').textContent = team(setup.myTeam).flag;
  $('sb-name-a').textContent = setup.myTeam;
  $('sb-flag-b').textContent = team(opp).flag;
  $('sb-name-b').textContent = team(opp).code;

  setCommentary(match.myBatting
    ? `You're batting first at ${st.name}. Spin to face the first ball!`
    : `${team(opp).name} bat first. Spin to bowl the first ball!`);
  $('btn-spin').textContent = match.myBatting ? '🏏 SPIN TO BAT!' : '🥎 SPIN TO BOWL!';
  refreshMatchUI();
  show('screen-match');
  drawWheel(wheelAngle);
}

function battingNow() {
  return match.innings === 1 ? match.myBatting : !match.myBatting;
}

function fmtOvers(balls) { return `${Math.floor(balls / 6)}.${balls % 6}`; }

function batterIdx(wkts, lineup) { return Math.min(wkts, lineup.length - 1); }

function sideStatus(isA) {
  if (match.over) return isA === (match.myScore > match.oppScore) ? '🏆 Winner' : '';
  const batting = isA ? battingNow() : !battingNow();
  if (batting) return `⚪ ${fmtOvers(match.balls)}/${match.ballsLimit / 6} ov`;
  return match.innings === 2 ? '✅ Innings done' : '🥎 Bowling';
}

function refreshMatchUI() {
  $('sb-score-a').textContent = `${match.myScore}/${match.myWkts}`;
  $('sb-score-b').textContent = `${match.oppScore}/${match.oppWkts}`;
  $('sb-team-a').classList.toggle('batting', battingNow() && !match.over);
  $('sb-team-b').classList.toggle('batting', !battingNow() && !match.over);
  $('sb-status-a').textContent = sideStatus(true);
  $('sb-status-b').textContent = sideStatus(false);
  $('sb-innings').textContent = match.over ? 'MATCH OVER'
    : match.innings === 1 ? '1ST INNINGS' : '2ND INNINGS';

  if (match.target !== null && !match.over) {
    const who = battingNow() ? 'You need' : `${team(match.opp).code} need`;
    const scoreNow = battingNow() ? match.myScore : match.oppScore;
    const need = match.target - scoreNow;
    const left = match.ballsLimit - match.balls;
    $('sb-target').textContent = `${who} ${need} off ${left}`;
  } else {
    $('sb-target').textContent = '';
  }

  // who's on strike and who's steaming in
  const chip = $('batter-chip');
  if (!match.over) {
    const meBat = battingNow();
    const batter = meBat ? match.batters[batterIdx(match.myWkts, match.batters)]
                         : match.oppBatters[batterIdx(match.oppWkts, match.oppBatters)];
    const bowler = meBat ? match.oppBowler : match.myBowler;
    chip.textContent = `🏏 ${batter}  ·  ⚡ ${bowler} bowling`;
  } else {
    chip.textContent = '';
  }

  // current over's six balls
  const totalOvers = match.ballsLimit / 6;
  const overIdx = match.balls === 0 ? 0 : Math.floor((match.balls - 1) / 6);
  $('over-label').textContent = totalOvers > 1 ? `OVER ${overIdx + 1} OF ${totalOvers}` : '';
  const start = overIdx * 6;
  const row = $('balls-row');
  row.innerHTML = '';
  for (let i = start; i < start + 6; i++) {
    const d = document.createElement('div');
    d.className = 'ball-dot';
    const r = match.log[i];
    if (r !== undefined) {
      d.classList.add('filled');
      d.textContent = r === 'W' ? 'W' : r;
      d.classList.add(r === 'W' ? 'bW' : r === 6 ? 'b6' : r === 4 ? 'b4' : 'bR');
    }
    row.appendChild(d);
  }
}

function setCommentary(text) {
  const c = $('commentary');
  c.textContent = text;
  c.classList.remove('flash');
  void c.offsetWidth;
  c.classList.add('flash');
}

/* ---------------- the wheel ---------------- */
const canvas = $('wheel');
const ctx2d = canvas.getContext('2d');

function drawWheel(angle) {
  const W = canvas.width, R = W / 2;
  ctx2d.clearRect(0, 0, W, W);
  ctx2d.save();
  ctx2d.translate(R, R);
  ctx2d.rotate(angle);
  const arc = (Math.PI * 2) / SEG_COUNT;

  for (let i = 0; i < SEG_COUNT; i++) {
    const a0 = i * arc - Math.PI / 2 - arc / 2;
    const grad = ctx2d.createRadialGradient(0, 0, R * .2, 0, 0, R);
    grad.addColorStop(0, shade(SEGMENTS[i].color, 30));
    grad.addColorStop(1, SEGMENTS[i].color);
    ctx2d.beginPath();
    ctx2d.moveTo(0, 0);
    ctx2d.arc(0, 0, R - 6, a0, a0 + arc);
    ctx2d.closePath();
    ctx2d.fillStyle = grad;
    ctx2d.fill();
    ctx2d.strokeStyle = 'rgba(255,255,255,.25)';
    ctx2d.lineWidth = 3;
    ctx2d.stroke();

    // rotate(i*arc) puts the label dead-centre of slice i — the slice
    // spans i*arc - PI/2 ± arc/2 and (0,-r) sits at -PI/2 pre-rotation
    ctx2d.save();
    ctx2d.rotate(i * arc);
    ctx2d.textAlign = 'center';
    ctx2d.textBaseline = 'middle';
    ctx2d.font = `800 ${R * .22}px Rubik, sans-serif`;
    ctx2d.fillStyle = SEGMENTS[i].runs === 6 ? '#1a1300' : '#ffffff';
    ctx2d.shadowColor = 'rgba(0,0,0,.4)';
    ctx2d.shadowBlur = 6;
    ctx2d.fillText(SEGMENTS[i].label, 0, -R * .72);
    ctx2d.restore();
  }

  // studs sit on the slice boundaries
  for (let i = 0; i < SEG_COUNT; i++) {
    const a = i * arc - Math.PI / 2 - arc / 2;
    ctx2d.beginPath();
    ctx2d.arc(Math.cos(a) * (R - 14), Math.sin(a) * (R - 14), 6, 0, Math.PI * 2);
    ctx2d.fillStyle = '#fff';
    ctx2d.shadowColor = 'rgba(0,0,0,.5)';
    ctx2d.shadowBlur = 4;
    ctx2d.fill();
  }
  ctx2d.restore();
}

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (n >> 16) + amt), g = Math.min(255, ((n >> 8) & 255) + amt), b = Math.min(255, (n & 255) + amt);
  return `rgb(${r},${g},${b})`;
}

function pickSegment() {
  const diff = DIFFICULTY[setup.difficulty || 'medium'];
  const weights = battingNow() ? diff.bat : diff.bowl;
  const w = SEGMENTS.map(s => weights[s.runs] ?? 1);
  const total = w.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < SEG_COUNT; i++) { r -= w[i]; if (r <= 0) return i; }
  return SEG_COUNT - 1;
}

function spin() {
  if (spinning || !match || match.over) return;
  spinning = true;
  ac(); // unlock audio on user gesture
  const btn = $('btn-spin');
  btn.classList.add('spinning');

  const segIndex = pickSegment();
  const arc = (Math.PI * 2) / SEG_COUNT;
  const jitter = (Math.random() - .5) * arc * .7;
  const targetAngle = -(segIndex * arc) + jitter;
  const spins = 5 + Math.floor(Math.random() * 3);
  const finalAngle = targetAngle + spins * Math.PI * 2;

  const startAngle = wheelAngle % (Math.PI * 2);
  const delta = finalAngle - startAngle;
  const dur = 2600 + Math.random() * 700;
  const t0 = performance.now();
  let lastTickSeg = -1;

  function frame(now) {
    if (!match) { spinning = false; return; }  // player quit mid-spin
    const t = Math.min(1, (now - t0) / dur);
    const eased = 1 - Math.pow(1 - t, 3);
    wheelAngle = startAngle + delta * eased;
    drawWheel(wheelAngle);

    const passSeg = Math.floor(wheelAngle / arc);
    if (passSeg !== lastTickSeg) { sfx.tick(); lastTickSeg = passSeg; }

    if (t < 1) requestAnimationFrame(frame);
    else {
      spinning = false;
      btn.classList.remove('spinning');
      resolveBall(SEGMENTS[segIndex].runs);
    }
  }
  requestAnimationFrame(frame);
}

/* ---------------- ball outcome ---------------- */
function resolveBall(result) {
  if (!match || match.over) return;
  const meBatting = battingNow();
  match.balls++;
  match.log.push(result);

  const batterName = meBatting
    ? match.batters[batterIdx(match.myWkts, match.batters)]
    : match.oppBatters[batterIdx(match.oppWkts, match.oppBatters)];
  const bowlerName = meBatting ? match.oppBowler : match.myBowler;

  if (result === 'W') {
    match.wickets++;
    if (meBatting) match.myWkts++; else match.oppWkts++;
    sfx.wicket();
    if (meBatting) document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 500);
    setCommentary(pickLine([
      `${batterName} is GONE! ${bowlerName} strikes! 😱`,
      `${bowlerName} cleans up ${batterName}! TIMBER! 🎯`,
      `Edged and TAKEN! ${bowlerName} sends ${batterName} packing! 🙌`,
    ]));
  } else {
    if (meBatting) { match.myScore += result; if (result === 6) match.sixesThisInnings++; }
    else match.oppScore += result;

    if (result === 6) { sfx.six(); burstConfetti(meBatting ? 26 : 8); }
    else if (result === 4 || result === 5) sfx.four();
    else if (result === 0) sfx.dot();
    else sfx.run();

    const lines = {
      0: [`Dot ball! ${bowlerName} piles on the pressure... 😬`, `${bowlerName} beats the bat! No run. 😶`],
      1: [`${batterName} takes a quick single. 🏃`, `${batterName} works it away for one. 👍`],
      2: [`Two runs! Great running by ${batterName}! 🏃🏃`, `${batterName} pushes into the gap for a couple. ✌️`],
      3: [`Three! Brilliant placement from ${batterName}! 💨`, `${batterName} comes back for a third! 🔥`],
      4: [`FOUR! ${batterName} cracks it through the covers! 🎯`, `FOUR! ${batterName} finds the rope! ⚡`],
      5: [`FIVE! Overthrows — total chaos in the field! 🤪`, `Five runs! Wild throw and ${batterName} just keeps running! 😵`],
      6: [`SIX! ${batterName} sends it OUT of the ground! 💥`, `MAXIMUM! ${batterName} deposits it into the second tier! 🚀`],
    };
    setCommentary(pickLine(lines[result]));
  }

  refreshMatchUI();

  const batScore = meBatting ? match.myScore : match.oppScore;
  const chaseDone = match.target !== null && batScore >= match.target;
  const inningsDone = match.balls >= match.ballsLimit || match.wickets >= match.maxWkts || chaseDone;

  if (chaseDone || (match.innings === 2 && inningsDone)) {
    setTimeout(endMatch, 1100);
  } else if (inningsDone) {
    setTimeout(switchInnings, 1100);
  }
}

function pickLine(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function switchInnings() {
  if (!match) return;
  match.innings = 2;
  match.target = (match.myBatting ? match.myScore : match.oppScore) + 1;
  match.balls = 0; match.wickets = 0; match.log = [];
  if (battingNow()) match.sixesThisInnings = 0;

  const meBatting = battingNow();
  setCommentary(meBatting
    ? `Chase time! You need ${match.target} runs to win. Spin to bat! 🏏`
    : `You set ${team(match.opp).code} a target of ${match.target}. Spin to bowl! 🥎`);
  $('btn-spin').textContent = meBatting ? '🏏 SPIN TO BAT!' : '🥎 SPIN TO BOWL!';
  refreshMatchUI();
}

/* ---------------- match end & rewards ---------------- */
function endMatch() {
  if (!match) return;
  match.over = true;
  refreshMatchUI();
  const iWon = match.myScore > match.oppScore;
  const tie = match.myScore === match.oppScore;

  if (match.sixesThisInnings >= 3) profile.threeSixes = true;

  if (tie) {
    sfx.lose();
    showResult({
      emoji: '🤯', title: 'TIED!', lose: false,
      sub: 'Unbelievable scenes! A rematch is needed.',
      score: scoreLine(), rewards: [],
      nextLabel: '⚔️ REMATCH', next: () => startMatch(),
    });
    return;
  }

  if (iWon) {
    profile.wins++;
    profile.streak++;
    profile.bestStreak = Math.max(profile.bestStreak, profile.streak);
    let pts = POINTS_PER_WIN + (profile.streak >= 3 ? 1 : 0);
    const rewards = [`+${pts} ⭐ points`];
    if (profile.streak >= 2) rewards.push(`🔥 ${profile.streak} win streak`);

    const unlocked = STADIUMS.find(s => s.unlock === profile.wins);
    if (unlocked) rewards.push(`🔓 ${unlocked.name} unlocked!`);

    if (setup.mode === 'cup') {
      const isFinal = cup.round === CUP_ROUNDS.length - 1;
      if (isFinal) {
        profile.trophies++;
        pts += CHAMPION_BONUS;
        rewards.push(`+${CHAMPION_BONUS} ⭐ champion bonus`, '🏆 WORLD CUP WON!');
        if (profile.trophies === CUSTOM_TEAM_UNLOCK_CUPS) rewards.push('🛠️ UNLOCKED: create your own team!');
        profile.points += pts;
        saveProfile(); checkBadges();
        sfx.win(); burstConfetti(160);
        showResult({
          emoji: '🏆', title: 'WORLD CHAMPIONS!', lose: false,
          sub: `${team(setup.myTeam).name} lift the Cricket World Cup! ${team(setup.myTeam).flag}`,
          score: scoreLine(), rewards,
          nextLabel: '🏆 PLAY ANOTHER CUP', next: () => { cup = null; startSetup('cup'); },
        });
        return;
      }
      profile.points += pts;
      saveProfile(); checkBadges();
      sfx.win(); burstConfetti(70);
      const nextRound = CUP_ROUNDS[cup.round + 1];
      const nextOpp = team(cup.opponents[cup.round + 1]);
      showResult({
        emoji: '✅', title: 'YOU WIN!', lose: false,
        sub: `Through to the ${nextRound.toLowerCase()}! Next up: ${nextOpp.name} ${nextOpp.flag}`,
        score: scoreLine(), rewards,
        nextLabel: `▶ PLAY ${nextRound}`, next: () => { cup.round++; startMatch(); },
      });
      return;
    }

    profile.points += pts;
    saveProfile(); checkBadges();
    sfx.win(); burstConfetti(70);
    showResult({
      emoji: '🎉', title: 'YOU WIN!', lose: false,
      sub: `${team(setup.myTeam).name} beat ${team(match.opp).name}!`,
      score: scoreLine(), rewards,
      nextLabel: '⚡ PLAY AGAIN', next: () => startMatch(),
    });
    return;
  }

  // loss
  profile.streak = 0;
  saveProfile(); checkBadges();
  sfx.lose();
  const knockedOut = setup.mode === 'cup';
  showResult({
    emoji: '😭', title: knockedOut ? 'KNOCKED OUT' : 'YOU LOSE', lose: true,
    sub: knockedOut
      ? `Heartbreak in the ${CUP_ROUNDS[cup.round].toLowerCase()}. The cup dream is over... for now.`
      : `${team(match.opp).name} take it. Revenge next spin?`,
    score: scoreLine(), rewards: [],
    nextLabel: knockedOut ? '🔁 NEW CUP RUN' : '🔁 REMATCH',
    next: knockedOut ? () => { cup = null; startSetup('cup'); } : () => startMatch(),
  });
}

function scoreLine() {
  return `${team(setup.myTeam).flag} ${match.myScore}/${match.myWkts} — ${match.oppScore}/${match.oppWkts} ${team(match.opp).flag}`;
}

let nextActionFn = null;
function showResult({ emoji, title, lose, sub, score, rewards, nextLabel, next }) {
  $('result-emoji').textContent = emoji;
  const t = $('result-title');
  t.textContent = title;
  t.classList.toggle('lose', lose);
  $('result-sub').textContent = sub;
  $('result-score').textContent = score;
  $('result-rewards').innerHTML = rewards.map((r, i) =>
    `<span class="reward-pill" style="animation-delay:${.15 + i * .12}s">${r}</span>`).join('');
  $('btn-next').textContent = nextLabel;
  nextActionFn = next;
  show('screen-result');
}
function nextAction() { sfx.pick(); if (nextActionFn) nextActionFn(); }

function shareResult() {
  const st = stadium(setup.stadium);
  const text = `🏏 Cricket World Cup: ${scoreLine()} at ${st.name}! ` +
    `🏆 ${profile.trophies} cups · ⭐ ${profile.points} pts · 🔥 best streak ${profile.bestStreak}. Can you beat my luck?`;
  if (navigator.share) navigator.share({ text }).catch(() => {});
  else navigator.clipboard?.writeText(text)
    .then(() => toast('📋 Result copied — paste it anywhere!'))
    .catch(() => toast(text, 5000));
}

/* ---------------- leaderboard ---------------- */
function showLeaderboard() {
  sfx.pick();
  const myFlag = profile.customTeam ? profile.customTeam.flag : '🫵';
  const rows = [
    ...LEGENDS.map(l => ({ ...l, me: false })),
    { name: 'YOU', flag: myFlag, pts: profile.points, streak: profile.bestStreak, me: true },
  ].sort((a, b) => b.pts - a.pts || (a.me ? -1 : 1));

  $('lb-list').innerHTML = rows.map((r, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`;
    return `<div class="lb-row ${r.me ? 'me' : ''} ${i < 3 ? 'top3' : ''}">
      <span class="lb-rank">${medal}</span>
      <span class="lb-flag">${r.flag}</span>
      <span class="lb-name">${r.name}</span>
      <span class="lb-streak">🔥 ${r.streak}</span>
      <span class="lb-pts">⭐ ${r.pts}</span>
    </div>`;
  }).join('');
  show('screen-leaderboard');
}

/* ---------------- badges & trophy room ---------------- */
function checkBadges() {
  const earned = JSON.parse(localStorage.getItem('cwc-badges') || '[]');
  BADGES.forEach(b => {
    if (!earned.includes(b.id) && b.test(profile)) {
      earned.push(b.id);
      toast(`${b.icon} Badge earned: ${b.name}!`);
    }
  });
  localStorage.setItem('cwc-badges', JSON.stringify(earned));
}

function showTrophyRoom() {
  sfx.pick();
  $('trophy-cabinet').innerHTML = `
    <div class="trophy-slot"><span class="t-icon">🏆</span><b>${profile.trophies}</b><small>World Cups</small></div>
    <div class="trophy-slot"><span class="t-icon">✅</span><b>${profile.wins}</b><small>Match Wins</small></div>
    <div class="trophy-slot"><span class="t-icon">⭐</span><b>${profile.points}</b><small>Cup Points</small></div>
    <div class="trophy-slot"><span class="t-icon">🔥</span><b>${profile.streak}</b><small>Win Streak</small></div>
    <div class="trophy-slot"><span class="t-icon">☄️</span><b>${profile.bestStreak}</b><small>Best Streak</small></div>
    <div class="trophy-slot"><span class="t-icon">🏟️</span><b>${STADIUMS.filter(s => profile.wins >= s.unlock).length}/${STADIUMS.length}</b><small>Stadiums</small></div>`;

  const earned = JSON.parse(localStorage.getItem('cwc-badges') || '[]');
  $('badge-list').innerHTML = BADGES.map(b => `
    <div class="badge-row ${earned.includes(b.id) ? '' : 'locked'}">
      <span class="b-icon">${earned.includes(b.id) ? b.icon : '🔒'}</span>
      <span><b>${b.name}</b> — ${b.desc}</span>
    </div>`).join('');
  show('screen-trophy');
}

/* ---------------- confetti & stars ---------------- */
function burstConfetti(n) {
  const layer = $('confetti-layer');
  const colors = ['#ffc83d', '#2f7bff', '#27d17f', '#ff4d6a', '#7c4dff', '#ffffff'];
  for (let i = 0; i < n; i++) {
    const c = document.createElement('div');
    c.className = 'confetto';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDuration = (1.8 + Math.random() * 1.6) + 's';
    c.style.animationDelay = Math.random() * .4 + 's';
    c.style.transform = `rotate(${Math.random() * 360}deg)`;
    layer.appendChild(c);
    setTimeout(() => c.remove(), 4200);
  }
}

(function initStars() {
  const s = $('stars');
  for (let i = 0; i < 40; i++) {
    const star = document.createElement('i');
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top = Math.random() * 100 + 'vh';
    star.style.animationDelay = Math.random() * 3 + 's';
    s.appendChild(star);
  }
})();

/* ---------------- boot ---------------- */
refreshHud();
drawWheel(0);
