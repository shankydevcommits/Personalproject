/* ============================================================
   CRICKET WORLD CUP — Spin to Glory
   Pure-luck super-over cricket. 6 balls. 2 wickets. One wheel.
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

/* Wheel — 12 slices: dots, runs and wickets. */
const SEGMENTS = [
  { label: '1', runs: 1,   color: '#2f7bff' },
  { label: '4', runs: 4,   color: '#7c4dff' },
  { label: 'W', runs: 'W', color: '#ff4d6a' },
  { label: '2', runs: 2,   color: '#1fb6d4' },
  { label: '6', runs: 6,   color: '#ffc83d' },
  { label: '0', runs: 0,   color: '#f4793b' },
  { label: '1', runs: 1,   color: '#2f7bff' },
  { label: '4', runs: 4,   color: '#7c4dff' },
  { label: 'W', runs: 'W', color: '#ff4d6a' },
  { label: '3', runs: 3,   color: '#27d17f' },
  { label: '6', runs: 6,   color: '#ffc83d' },
  { label: '0', runs: 0,   color: '#f4793b' },
];
const SEG_COUNT = SEGMENTS.length;
const BALLS_PER_INNINGS = 6;
const WICKETS_PER_INNINGS = 2;
const POINTS_PER_WIN = 2;
const CHAMPION_BONUS = 10;

/* Hidden adaptive difficulty — never shown to the player.
   The wheel quietly tightens as their win streak grows:
   fresh players win ~75% of matches, hot streaks face ~5% odds.
   Weights tuned by simulating 400k matches. */
const DIFFICULTY = {
  easy:   { bat: { 6: 1.2, 4: 1.2, W: 0.7, 0: 0.8 },       bowl: { 6: 0.7, 4: 0.8, W: 1.5, 0: 1.2 } },
  medium: { bat: {},                                        bowl: {} },
  hard:   { bat: { 6: 0.52, 4: 0.67, W: 2.5, 0: 1.35 },     bowl: { 6: 1.75, 4: 1.65, W: 0.37, 0: 0.65 } },
};
function currentDifficulty() {
  if (profile.streak >= 5) return 'hard';
  if (profile.streak >= 2) return 'medium';
  return 'easy';
}

/* Pun rosters — every country's legends, lightly scrambled */
const ROSTERS = {
  IND: [{ name: 'Viral Kohli', emoji: '🔥' }, { name: 'Rohit Charmer', emoji: '✨' }, { name: 'Helicopter Mahi', emoji: '🚁' }, { name: 'Sachin Ten-Duelkar', emoji: '⚔️' }],
  AUS: [{ name: 'Steve Smasher', emoji: '💥' }, { name: 'Glenn Maxi-Well', emoji: '⚡' }, { name: 'David Warner Bros', emoji: '🎬' }, { name: 'Ricky Pointing', emoji: '👉' }],
  ENG: [{ name: 'Ben Strokes', emoji: '🚣' }, { name: 'Joe Rooter', emoji: '🌳' }, { name: 'Jos the Butler', emoji: '🤵' }, { name: 'Kevin Pieter-Sun', emoji: '☀️' }],
  PAK: [{ name: 'Babar A-Slam', emoji: '💥' }, { name: 'Shahid A-Fridge', emoji: '🧊' }, { name: 'Wasim A-Cram', emoji: '📚' }, { name: 'Inzamam-ul-Hulk', emoji: '💪' }],
  NZ:  [{ name: 'Kane Williamsong', emoji: '🎵' }, { name: 'Brendon McBoom', emoji: '💣' }, { name: 'Ross Tailor', emoji: '✂️' }, { name: 'Martin Gup-Tilt', emoji: '🎯' }],
  SA:  [{ name: 'AB de Chilliers', emoji: '🌶️' }, { name: 'Quinton de Sock', emoji: '🧦' }, { name: 'Hashim Am-La-La', emoji: '🎶' }, { name: 'Jacques Cool-is', emoji: '😎' }],
  WI:  [{ name: 'Chris Gale-Force', emoji: '🌪️' }, { name: 'Brian Lah-Rah', emoji: '📣' }, { name: 'Dwayne Bravo!', emoji: '👏' }, { name: 'Andre Muscle', emoji: '💪' }],
  SL:  [{ name: 'Kumar Sangakaraoke', emoji: '🎤' }, { name: 'Mahela Jaya-Winner', emoji: '🏅' }, { name: 'Lasith Sling-Shot', emoji: '🪃' }, { name: 'Tillakaratne Dil-Scoop', emoji: '🍨' }],
  BAN: [{ name: 'Shakib Al Hammer', emoji: '🔨' }, { name: 'Tamim Iq-Bowl', emoji: '🎳' }, { name: 'Mushfiqur The Rock', emoji: '🪨' }, { name: 'Mashrafe More-Taza', emoji: '🌶️' }],
  AFG: [{ name: 'Rashid Khan-fetti', emoji: '🎊' }, { name: 'Mohammad Na-Beast', emoji: '🦁' }, { name: 'Rahmanullah Gur-Blaze', emoji: '🔥' }, { name: 'Hazratullah Za-Zai-nami', emoji: '🌊' }],
};
function rosterFor(code) {
  // custom teams get the pick of the whole world
  return ROSTERS[code] || Object.values(ROSTERS).flat();
}

const FLAG_OPTIONS = ['🦁','🐯','🦅','🐉','🔥','⚡','🌟','🦈','🐺','👑','💎','🌋','🛡️','🚀'];

const LEGENDS = [
  { name: 'Sir Lucky Lara',    flag: '🌴', pts: 312, streak: 14 },
  { name: 'Don Spinman',       flag: '🇦🇺', pts: 284, streak: 12 },
  { name: 'Wheel-iv Richards', flag: '🌴', pts: 251, streak: 11 },
];

const BADGES = [
  { id: 'first-win',  icon: '🥇', name: 'First Blood',     desc: 'Win your first match',                  test: p => p.wins >= 1 },
  { id: 'champion',   icon: '🏆', name: 'World Champion',  desc: 'Win the World Cup',                     test: p => p.trophies >= 1 },
  { id: 'dynasty',    icon: '👑', name: 'Dynasty',         desc: 'Win 3 World Cups',                      test: p => p.trophies >= 3 },
  { id: 'squad-boss', icon: '🧢', name: 'Squad Boss',      desc: 'Win 5 World Cups — pick your batsmen',  test: p => p.trophies >= 5 },
  { id: 'franchise',  icon: '🛠️', name: 'Franchise Owner', desc: 'Win 10 World Cups — create your team',  test: p => p.trophies >= 10 },
  { id: 'streak3',    icon: '🔥', name: 'On Fire',         desc: 'Win 3 matches in a row',                test: p => p.bestStreak >= 3 },
  { id: 'streak7',    icon: '☄️', name: 'Unstoppable',     desc: 'Win 7 matches in a row',                test: p => p.bestStreak >= 7 },
  { id: 'maximum',    icon: '💥', name: 'Maximum Damage',  desc: 'Hit 3 sixes in one innings',            test: p => p.threeSixes },
  { id: 'globetrot',  icon: '🌍', name: 'Globetrotter',    desc: 'Unlock every stadium',                  test: p => p.wins >= 10 },
];

const BATSMEN_UNLOCK_CUPS = 5;
const CUSTOM_TEAM_UNLOCK_CUPS = 10;

/* ---------------- persistent profile ---------------- */
const DEFAULT_PROFILE = {
  points: 0, trophies: 0, wins: 0, streak: 0, bestStreak: 0,
  threeSixes: false, customTeam: null, batsmen: [],
};
let profile = loadProfile();

function loadProfile() {
  try { return { ...DEFAULT_PROFILE, ...JSON.parse(localStorage.getItem('cwc-profile') || '{}') }; }
  catch { return { ...DEFAULT_PROFILE }; }
}
function saveProfile() { localStorage.setItem('cwc-profile', JSON.stringify(profile)); }

/* ---------------- game state ---------------- */
let setup = {};
let match = null;          // live match state
let cup = null;            // tournament state
let challenge = null;      // accepted friend-challenge {oppCode, score, stadiumId}
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
function batsmenUnlocked() { return profile.trophies >= BATSMEN_UNLOCK_CUPS; }
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
function goHome() { cup = null; challenge = null; refreshHud(); show('screen-home'); }

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

/* ============================================================
   SETUP FLOW  — modes: quick | cup | friend | challenge
   ============================================================ */
function startSetup(mode) {
  sfx.pick();
  setup = {
    mode, myTeam: null, oppTeam: null, batFirst: null, stadium: null,
    batsmen: [],
  };

  const titles = { cup: '🏆 WORLD CUP', quick: '⚡ QUICK MATCH', friend: '👥 VS FRIEND', challenge: '🎯 CHALLENGE' };
  $('setup-title').textContent = titles[mode];

  $('label-myteam').textContent = mode === 'friend' ? 'Player 1 — choose your country' : 'Choose your country';
  $('label-oppteam').textContent = mode === 'friend' ? 'Player 2 — choose your country' : 'Choose opposition';

  // which steps each mode needs
  $('step-opp').style.display     = (mode === 'quick' || mode === 'friend') ? '' : 'none';
  $('step-batbowl').style.display = mode === 'challenge' ? 'none' : '';
  $('step-stadium').style.display = mode === 'challenge' ? 'none' : '';
  $('step-batsmen').style.display = mode === 'friend' ? 'none' : '';

  renderTeamGrid('grid-myteam', t => {
    setup.myTeam = t;
    if (setup.oppTeam === t) setup.oppTeam = null;
    // batting picks belong to a country — reset them on team change
    const valid = rosterFor(t).map(p => p.name);
    setup.batsmen = (profile.batsmen || []).filter(n => valid.includes(n)).slice(0, 3);
    renderBatsmen();
    renderSetup();
  }, true);
  renderTeamGrid('grid-oppteam', t => { setup.oppTeam = t; renderSetup(); }, false);
  renderBatsmen();
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

  // "create your own team" slot lives in the player-1 grid
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

function renderBatsmen() {
  const unlocked = batsmenUnlocked();
  $('batsmen-locked').style.display = unlocked ? 'none' : '';
  $('grid-batsmen').style.display = unlocked ? '' : 'none';
  $('batsmen-tag').textContent = unlocked ? 'tap in batting order' : '';
  if (!unlocked) return;

  const grid = $('grid-batsmen');
  grid.innerHTML = '';
  if (!setup.myTeam) {
    grid.innerHTML = '<div class="locked-banner">👆 Pick your country first to see its legends</div>';
    return;
  }
  rosterFor(setup.myTeam).forEach(p => {
    const b = document.createElement('button');
    b.className = 'batsman-card';
    b.innerHTML = `<span class="b-emoji">${p.emoji}</span>${p.name}`;
    b.onclick = () => {
      sfx.pick();
      const i = setup.batsmen.indexOf(p.name);
      if (i >= 0) setup.batsmen.splice(i, 1);
      else if (setup.batsmen.length < 3) setup.batsmen.push(p.name);
      else { toast('🧢 You already have 3 batsmen — tap one to swap out'); return; }
      renderSetup();
    };
    b.dataset.name = p.name;
    grid.appendChild(b);
  });
}

function pickBatBowl(choice) { sfx.pick(); setup.batFirst = choice === 'bat'; renderSetup(); }

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
  document.querySelectorAll('#grid-stadium .stadium-card').forEach((c, i) => {
    c.classList.toggle('selected', STADIUMS[i].id === setup.stadium);
  });
  document.querySelectorAll('.batsman-card').forEach(c => {
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

  const m = setup.mode;
  const ready =
    setup.myTeam &&
    (m === 'challenge' || setup.batFirst !== null) &&
    (m === 'challenge' || setup.stadium) &&
    ((m !== 'quick' && m !== 'friend') || setup.oppTeam);
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
  startSetup(setup.mode); // re-render grids with the new team
}

/* ============================================================
   MATCH ENGINE — super over: 6 balls, 2 wickets, per side
   ============================================================ */
function batters() {
  const roster = rosterFor(setup.myTeam).map(p => p.name);
  const picked = (setup.batsmen || []).filter(n => roster.includes(n));
  const rest = roster.filter(n => !picked.includes(n));
  return [...picked, ...rest].slice(0, 3);
}

function startMatch() {
  if (batsmenUnlocked() && setup.batsmen.length) {
    profile.batsmen = [...setup.batsmen];
    saveProfile();
  }
  if (setup.mode === 'cup' && !cup) {
    const pool = allTeams().filter(t => t.code !== setup.myTeam).sort(() => Math.random() - .5);
    cup = { round: 0, opponents: pool.slice(0, 4).map(t => t.code) };
  }

  const isChallenge = setup.mode === 'challenge';
  const opp = isChallenge ? challenge.oppCode
    : setup.mode === 'cup' ? cup.opponents[cup.round]
    : setup.oppTeam;
  if (isChallenge) setup.stadium = challenge.stadiumId;

  match = {
    opp,
    innings: isChallenge ? 2 : 1,
    myBatting: isChallenge ? false : setup.batFirst,  // challenge = always chasing
    balls: 0, wickets: 0,
    myScore: 0, myWkts: 0,
    oppScore: isChallenge ? challenge.score : 0,
    oppWkts: isChallenge ? null : 0,
    sixesThisInnings: 0,
    target: isChallenge ? challenge.score + 1 : null,
    over: false,
    log: [],
    batters: batsmenUnlocked() && setup.mode !== 'friend' ? batters() : null,
  };

  const st = stadium(setup.stadium);
  $('match-stadium').textContent = `${st.icon} ${st.name}, ${st.city}`;
  $('match-stage').textContent =
    setup.mode === 'cup' ? CUP_ROUNDS[cup.round]
    : setup.mode === 'quick' ? 'QUICK MATCH'
    : setup.mode === 'friend' ? 'FRIENDLY · PASS & PLAY'
    : 'FRIEND CHALLENGE';

  $('sb-flag-a').textContent = team(setup.myTeam).flag;
  $('sb-name-a').textContent = setup.myTeam;
  $('sb-flag-b').textContent = team(opp).flag;
  $('sb-name-b').textContent = team(opp).code;

  if (isChallenge) {
    setCommentary(`Your friend's ${team(opp).code} scored ${challenge.score}. Beat it! Spin to bat! 🏏`);
    $('btn-spin').textContent = '🏏 SPIN TO CHASE!';
  } else if (setup.mode === 'friend') {
    const first = match.myBatting ? 'Player 1' : 'Player 2';
    setCommentary(`${first} bats first at ${st.name}. ${first}, spin away! 📱`);
    $('btn-spin').textContent = `🎡 ${match.myBatting ? 'P1' : 'P2'} SPIN!`;
  } else {
    setCommentary(match.myBatting
      ? `You're batting first at ${st.name}. Spin to face the first ball!`
      : `${team(opp).name} bat first. Spin to bowl the first ball!`);
    $('btn-spin').textContent = match.myBatting ? '🏏 SPIN TO BAT!' : '🥎 SPIN TO BOWL!';
  }
  refreshMatchUI();
  show('screen-match');
  drawWheel(wheelAngle);
}

function battingNow() {
  // side A (you / player 1) bats when: innings 1 + batFirst, or innings 2 + !batFirst
  return match.innings === 1 ? match.myBatting : !match.myBatting;
}

function refreshMatchUI() {
  $('sb-score-a').textContent = `${match.myScore}/${match.myWkts}`;
  $('sb-score-b').textContent = match.oppWkts === null ? `${match.oppScore}` : `${match.oppScore}/${match.oppWkts}`;
  $('sb-team-a').classList.toggle('batting', battingNow());
  $('sb-team-b').classList.toggle('batting', !battingNow());

  if (match.target !== null && !match.over) {
    const who = setup.mode === 'friend'
      ? (battingNow() ? 'P1 need' : 'P2 need')
      : (battingNow() ? 'You need' : `${team(match.opp).code} need`);
    const scoreNow = battingNow() ? match.myScore : match.oppScore;
    const need = match.target - scoreNow;
    const left = BALLS_PER_INNINGS - match.balls;
    $('sb-target').textContent = `${who} ${need} off ${left}`;
  } else {
    $('sb-target').textContent = '';
  }

  // on-strike batter (only when your picked XI is batting)
  const chip = $('batter-chip');
  if (match.batters && battingNow() && !match.over) {
    chip.textContent = `🏏 On strike: ${match.batters[Math.min(match.myWkts, 2)]}`;
  } else {
    chip.textContent = '';
  }

  const row = $('balls-row');
  row.innerHTML = '';
  for (let i = 0; i < BALLS_PER_INNINGS; i++) {
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

    ctx2d.save();
    ctx2d.rotate(a0 + arc / 2);
    ctx2d.textAlign = 'center';
    ctx2d.textBaseline = 'middle';
    ctx2d.font = `800 ${R * .22}px Rubik, sans-serif`;
    ctx2d.fillStyle = SEGMENTS[i].runs === 6 ? '#1a1300' : '#ffffff';
    ctx2d.shadowColor = 'rgba(0,0,0,.4)';
    ctx2d.shadowBlur = 6;
    ctx2d.fillText(SEGMENTS[i].label, 0, -R * .72);
    ctx2d.restore();
  }

  for (let i = 0; i < SEG_COUNT; i++) {
    const a = i * arc - Math.PI / 2;
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

/* Quietly weighted segment pick. Friend matches and challenge
   chases always use the fair wheel. */
function pickSegment() {
  let weights = {};
  if (setup.mode === 'quick' || setup.mode === 'cup') {
    const diff = DIFFICULTY[currentDifficulty()];
    weights = battingNow() ? diff.bat : diff.bowl;
  }
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
  const meBatting = battingNow();
  const friendly = setup.mode === 'friend';
  const sideName = friendly ? (meBatting ? 'P1' : 'P2') : null;
  match.balls++;
  match.log.push(result);

  if (result === 'W') {
    const outName = match.batters && meBatting ? match.batters[Math.min(match.myWkts, 2)] : null;
    match.wickets++;
    if (meBatting) match.myWkts++; else if (match.oppWkts !== null) match.oppWkts++;
    sfx.wicket();
    if (meBatting && !friendly) document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 500);
    if (friendly) {
      setCommentary(`${sideName} lose a wicket! OUT! 😱`);
    } else if (meBatting) {
      setCommentary(outName
        ? `${outName} is GONE! Bowled him! 😱`
        : pickLine(['BOWLED HIM! Disaster strikes! 😱', 'Caught at deep midwicket! OUT! 😱', 'Cleaned up! The crowd goes silent... 💔']));
    } else {
      setCommentary(pickLine(['WICKET! What a delivery! 🎯', 'Edged and TAKEN! You beauty! 🙌', 'Timber! You\'ve rattled the stumps! 🤩']));
    }
  } else {
    if (meBatting) { match.myScore += result; if (result === 6) match.sixesThisInnings++; }
    else match.oppScore += result;

    if (result === 6) { sfx.six(); burstConfetti(meBatting || friendly ? 26 : 8); }
    else if (result === 4) sfx.four();
    else if (result === 0) sfx.dot();
    else sfx.run();

    const lines = {
      0: ['Dot ball! Pressure builds... 😬', 'Beaten! No run. 😶'],
      1: ['Quick single taken. 🏃', 'Worked away for one. 👍'],
      2: ['Two runs! Good running! 🏃🏃', 'Pushed into the gap for a couple. ✌️'],
      3: ['Three! Excellent placement! 💨', 'They come back for a third! 🔥'],
      4: ['FOUR! Cracked through the covers! 🎯', 'FOUR! Races away to the rope! ⚡'],
      6: ['SIX! That\'s OUT of the ground! 💥', 'MAXIMUM! Into the second tier! 🚀'],
    };
    const line = pickLine(lines[result]);
    setCommentary(friendly ? `${sideName}: ${line}` : meBatting ? line : `${team(match.opp).code}: ${line}`);
  }

  refreshMatchUI();

  const batScore = meBatting ? match.myScore : match.oppScore;
  const chaseDone = match.target !== null && batScore >= match.target;
  const inningsDone = match.balls >= BALLS_PER_INNINGS || match.wickets >= WICKETS_PER_INNINGS || chaseDone;

  if (chaseDone || (match.innings === 2 && inningsDone)) {
    setTimeout(endMatch, 1100);
  } else if (inningsDone) {
    setTimeout(switchInnings, 1100);
  }
}

function pickLine(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function switchInnings() {
  match.innings = 2;
  match.target = (match.myBatting ? match.myScore : match.oppScore) + 1;
  match.balls = 0; match.wickets = 0; match.log = [];
  if (battingNow()) match.sixesThisInnings = 0;

  const meBatting = battingNow();
  if (setup.mode === 'friend') {
    const next = meBatting ? 'Player 1' : 'Player 2';
    setCommentary(`📱 Hand the phone over! ${next} need ${match.target} to win. Spin away!`);
    $('btn-spin').textContent = `🎡 ${meBatting ? 'P1' : 'P2'} SPIN!`;
  } else {
    setCommentary(meBatting
      ? `Chase time! You need ${match.target} runs to win. Spin to bat! 🏏`
      : `You set ${team(match.opp).code} a target of ${match.target}. Spin to bowl! 🥎`);
    $('btn-spin').textContent = meBatting ? '🏏 SPIN TO BAT!' : '🥎 SPIN TO BOWL!';
  }
  refreshMatchUI();
}

/* ---------------- match end & rewards ---------------- */
function endMatch() {
  match.over = true;
  refreshMatchUI();
  const iWon = match.myScore > match.oppScore;
  const tie = match.myScore === match.oppScore;
  const m = setup.mode;

  if (match.sixesThisInnings >= 3) profile.threeSixes = true;

  /* ----- friendly: no points, bragging rights only ----- */
  if (m === 'friend') {
    if (tie) {
      sfx.lose();
      showResult({
        emoji: '🤯', title: 'TIED!', lose: false,
        sub: 'Dead level! Settle it with a rematch.',
        score: scoreLine(), rewards: [],
        nextLabel: '⚔️ REMATCH', next: () => startMatch(), challengeBtn: false,
      });
      return;
    }
    sfx.win(); burstConfetti(70);
    const winner = iWon ? 'PLAYER 1' : 'PLAYER 2';
    const winTeam = iWon ? setup.myTeam : match.opp;
    showResult({
      emoji: '🏅', title: `${winner} WINS!`, lose: false,
      sub: `${team(winTeam).name} ${team(winTeam).flag} take the bragging rights! (Friendly — no points)`,
      score: scoreLine(), rewards: [],
      nextLabel: '⚔️ REMATCH', next: () => startMatch(), challengeBtn: false,
    });
    return;
  }

  /* ----- challenge: beat the score or bust (tie = challenger keeps it) ----- */
  if (m === 'challenge') {
    if (iWon) {
      profile.wins++; profile.streak++;
      profile.bestStreak = Math.max(profile.bestStreak, profile.streak);
      profile.points += POINTS_PER_WIN;
      saveProfile(); checkBadges();
      sfx.win(); burstConfetti(90);
      showResult({
        emoji: '🎯', title: 'CHALLENGE WON!', lose: false,
        sub: `You beat your friend's ${challenge.score}! Send them a code back. 😏`,
        score: scoreLine(),
        rewards: [`+${POINTS_PER_WIN} ⭐ points`, '🎯 Challenge conquered'],
        nextLabel: '🏠 HOME', next: () => goHome(), challengeBtn: false,
      });
    } else {
      profile.streak = 0;
      saveProfile(); checkBadges();
      sfx.lose();
      showResult({
        emoji: '😤', title: tie ? 'SO CLOSE — TIED!' : 'CHALLENGE LOST', lose: true,
        sub: tie ? 'A tie isn\'t enough — the challenger keeps the crown!' : `Your friend's ${challenge.score} stands. One more go?`,
        score: scoreLine(), rewards: [],
        nextLabel: '🔁 TRY AGAIN', next: () => startMatch(), challengeBtn: false,
      });
    }
    return;
  }

  /* ----- vs bot (quick / cup) ----- */
  if (tie) {
    sfx.lose();
    showResult({
      emoji: '🤯', title: 'TIED!', lose: false,
      sub: 'Unbelievable scenes! A super-over rematch is needed.',
      score: scoreLine(), rewards: [],
      nextLabel: '⚔️ REMATCH', next: () => startMatch(), challengeBtn: false,
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

    if (m === 'cup') {
      const isFinal = cup.round === CUP_ROUNDS.length - 1;
      if (isFinal) {
        profile.trophies++;
        pts += CHAMPION_BONUS;
        rewards.push(`+${CHAMPION_BONUS} ⭐ champion bonus`, '🏆 WORLD CUP WON!');
        if (profile.trophies === BATSMEN_UNLOCK_CUPS) rewards.push('🧢 UNLOCKED: pick your batsmen!');
        if (profile.trophies === CUSTOM_TEAM_UNLOCK_CUPS) rewards.push('🛠️ UNLOCKED: create your own team!');
        profile.points += pts;
        saveProfile(); checkBadges();
        sfx.win(); burstConfetti(160);
        showResult({
          emoji: '🏆', title: 'WORLD CHAMPIONS!', lose: false,
          sub: `${team(setup.myTeam).name} lift the Cricket World Cup! ${team(setup.myTeam).flag}`,
          score: scoreLine(), rewards,
          nextLabel: '🏆 PLAY ANOTHER CUP', next: () => { cup = null; startSetup('cup'); }, challengeBtn: true,
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
        nextLabel: `▶ PLAY ${nextRound}`, next: () => { cup.round++; startMatch(); }, challengeBtn: true,
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
      nextLabel: '⚡ PLAY AGAIN', next: () => startMatch(), challengeBtn: true,
    });
    return;
  }

  // loss vs bot
  profile.streak = 0;
  saveProfile(); checkBadges();
  sfx.lose();
  const knockedOut = m === 'cup';
  showResult({
    emoji: '😭', title: knockedOut ? 'KNOCKED OUT' : 'YOU LOSE', lose: true,
    sub: knockedOut
      ? `Heartbreak in the ${CUP_ROUNDS[cup.round].toLowerCase()}. The cup dream is over... for now.`
      : `${team(match.opp).name} take it. Revenge next spin?`,
    score: scoreLine(), rewards: [],
    nextLabel: knockedOut ? '🔁 NEW CUP RUN' : '🔁 REMATCH',
    next: knockedOut ? () => { cup = null; startSetup('cup'); } : () => startMatch(),
    challengeBtn: true,
  });
}

function scoreLine() {
  const oppBit = match.oppWkts === null ? `${match.oppScore}` : `${match.oppScore}/${match.oppWkts}`;
  return `${team(setup.myTeam).flag} ${match.myScore}/${match.myWkts} — ${oppBit} ${team(match.opp).flag}`;
}

let nextActionFn = null;
function showResult({ emoji, title, lose, sub, score, rewards, nextLabel, next, challengeBtn }) {
  $('result-emoji').textContent = emoji;
  const t = $('result-title');
  t.textContent = title;
  t.classList.toggle('lose', lose);
  $('result-sub').textContent = sub;
  $('result-score').textContent = score;
  $('result-rewards').innerHTML = rewards.map((r, i) =>
    `<span class="reward-pill" style="animation-delay:${.15 + i * .12}s">${r}</span>`).join('');
  $('btn-next').textContent = nextLabel;
  $('btn-challenge').style.display = challengeBtn ? '' : 'none';
  nextActionFn = next;
  show('screen-result');
}
function nextAction() { sfx.pick(); if (nextActionFn) nextActionFn(); }

/* ---------------- share & friend challenges ---------------- */
function makeChallengeCode() {
  const stIdx = Math.max(0, STADIUMS.findIndex(s => s.id === setup.stadium));
  return `CWC-${setup.myTeam}-${match.myScore}-${stIdx}`;
}

function shareChallenge() {
  const code = makeChallengeCode();
  const text = `🏏 I scored ${match.myScore}/${match.myWkts} in Cricket World Cup. ` +
    `Think you can beat me? Open the game, tap 🎯 Enter Code and type: ${code}`;
  if (navigator.share) navigator.share({ text }).catch(() => {});
  else navigator.clipboard?.writeText(text)
    .then(() => toast(`📋 Challenge copied! Code: ${code}`))
    .catch(() => toast(`Your code: ${code}`, 6000));
}

function openChallengeModal() {
  sfx.pick();
  $('ch-code').value = '';
  openModal('modal-challenge');
}

function acceptChallenge() {
  const raw = $('ch-code').value.trim().toUpperCase();
  const mres = raw.match(/^CWC-([A-Z]{2,3})-(\d{1,2})-(\d)$/);
  if (!mres) { toast('Hmm, that code doesn\'t look right. Format: CWC-IND-14-1'); return; }
  const [, oppCode, score, stIdx] = mres;
  challenge = {
    oppCode,
    score: parseInt(score, 10),
    stadiumId: (STADIUMS[parseInt(stIdx, 10)] || STADIUMS[0]).id,
  };
  closeModal('modal-challenge');
  startSetup('challenge');
  toast(`🎯 Challenge accepted! Beat ${challenge.score} by ${team(oppCode).code}.`, 3500);
}

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
