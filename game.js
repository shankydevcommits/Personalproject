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
  { id: 'mcg',     icon: '🏟️', name: 'The MCG',             city: 'Melbourne', unlock: 0 },
  { id: 'lords',   icon: '🏛️', name: "Lord's",              city: 'London',    unlock: 0 },
  { id: 'eden',    icon: '🎆', name: 'Eden Gardens',         city: 'Kolkata',   unlock: 1 },
  { id: 'wankhede',icon: '🌊', name: 'Wankhede Stadium',     city: 'Mumbai',    unlock: 3 },
  { id: 'newlands',icon: '⛰️', name: 'Newlands',             city: 'Cape Town', unlock: 5 },
  { id: 'galle',   icon: '🏰', name: 'Galle Fort Ground',    city: 'Galle',     unlock: 10 },
];

/* Wheel segments — the entire game. 12 slices, pure luck. */
const SEGMENTS = [
  { label: '1', runs: 1, color: '#2f7bff' },
  { label: '4', runs: 4, color: '#7c4dff' },
  { label: 'W', runs: 'W', color: '#ff4d6a' },
  { label: '2', runs: 2, color: '#1fb6d4' },
  { label: '6', runs: 6, color: '#ffc83d' },
  { label: '0', runs: 0, color: '#41507a' },
  { label: '1', runs: 1, color: '#2f7bff' },
  { label: '4', runs: 4, color: '#7c4dff' },
  { label: 'W', runs: 'W', color: '#ff4d6a' },
  { label: '3', runs: 3, color: '#27d17f' },
  { label: '6', runs: 6, color: '#ffc83d' },
  { label: '0', runs: 0, color: '#41507a' },
];
const SEG_COUNT = SEGMENTS.length;
const BALLS_PER_INNINGS = 6;
const WICKETS_PER_INNINGS = 2;

const BADGES = [
  { id: 'first-win',  icon: '🥇', name: 'First Blood',      desc: 'Win your first match',            test: p => p.wins >= 1 },
  { id: 'champion',   icon: '🏆', name: 'World Champion',   desc: 'Win the World Cup',               test: p => p.trophies >= 1 },
  { id: 'dynasty',    icon: '👑', name: 'Dynasty',          desc: 'Win 3 World Cups',                test: p => p.trophies >= 3 },
  { id: 'streak3',    icon: '🔥', name: 'On Fire',          desc: 'Win 3 matches in a row',          test: p => p.bestStreak >= 3 },
  { id: 'streak7',    icon: '☄️', name: 'Unstoppable',      desc: 'Win 7 matches in a row',          test: p => p.bestStreak >= 7 },
  { id: 'maximum',    icon: '💥', name: 'Maximum Damage',   desc: 'Hit 3 sixes in one innings',      test: p => p.threeSixes },
  { id: 'globetrot',  icon: '🌍', name: 'Globetrotter',     desc: 'Unlock every stadium',            test: p => p.wins >= 10 },
];

/* ---------------- persistent profile ---------------- */
const DEFAULT_PROFILE = { points: 0, trophies: 0, wins: 0, streak: 0, bestStreak: 0, threeSixes: false };
let profile = loadProfile();

function loadProfile() {
  try { return { ...DEFAULT_PROFILE, ...JSON.parse(localStorage.getItem('cwc-profile') || '{}') }; }
  catch { return { ...DEFAULT_PROFILE }; }
}
function saveProfile() { localStorage.setItem('cwc-profile', JSON.stringify(profile)); }

/* ---------------- game state ---------------- */
let setup = { mode: 'quick', myTeam: null, oppTeam: null, batFirst: null, stadium: null };
let match = null;       // live match state
let cup = null;         // tournament state
let spinning = false;
let wheelAngle = 0;

const CUP_ROUNDS = ['GROUP STAGE', 'QUARTER-FINAL', 'SEMI-FINAL', 'THE FINAL'];

const $ = id => document.getElementById(id);

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

/* ============================================================
   SETUP FLOW
   ============================================================ */
function startSetup(mode) {
  sfx.pick();
  setup = { mode, myTeam: null, oppTeam: null, batFirst: null, stadium: null };
  $('setup-title').textContent = mode === 'cup' ? '🏆 WORLD CUP' : '⚡ QUICK MATCH';

  // In cup mode the bracket picks your opponents for you
  $('step-opp').style.display = mode === 'cup' ? 'none' : '';
  $('num-batbowl').textContent = mode === 'cup' ? '2' : '3';
  $('num-stadium').textContent = mode === 'cup' ? '3' : '4';

  renderTeamGrid('grid-myteam', t => { setup.myTeam = t; if (setup.oppTeam === t) setup.oppTeam = null; renderSetup(); });
  renderTeamGrid('grid-oppteam', t => { setup.oppTeam = t; renderSetup(); });
  renderStadiums();
  renderSetup();
  show('screen-setup');
}

function renderTeamGrid(gridId, onPick) {
  const grid = $(gridId);
  grid.innerHTML = '';
  TEAMS.forEach(t => {
    const b = document.createElement('button');
    b.className = 'team-card';
    b.dataset.code = t.code;
    b.innerHTML = `<span class="flag">${t.flag}</span><span class="code">${t.code}</span>`;
    b.onclick = () => { sfx.pick(); onPick(t.code); };
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

  const ready = setup.myTeam && setup.batFirst !== null && setup.stadium &&
    (setup.mode === 'cup' || setup.oppTeam);
  $('btn-start').disabled = !ready;
}

/* ============================================================
   MATCH ENGINE — super over: 6 balls, 2 wickets, per side
   ============================================================ */
function team(code) { return TEAMS.find(t => t.code === code); }
function stadium(id) { return STADIUMS.find(s => s.id === id); }

function startMatch() {
  if (setup.mode === 'cup' && !cup) {
    // Build a 4-round bracket from random distinct opponents
    const pool = TEAMS.filter(t => t.code !== setup.myTeam).sort(() => Math.random() - .5);
    cup = { round: 0, opponents: pool.slice(0, 4).map(t => t.code) };
  }
  const opp = setup.mode === 'cup' ? cup.opponents[cup.round] : setup.oppTeam;

  match = {
    opp,
    innings: 1,
    myBatting: setup.batFirst,
    balls: 0, wickets: 0,
    myScore: 0, myWkts: 0,
    oppScore: 0, oppWkts: 0,
    sixesThisInnings: 0,
    target: null,
    over: false,
    log: [],
  };

  const st = stadium(setup.stadium);
  $('match-stadium').textContent = `${st.icon} ${st.name}, ${st.city}`;
  $('match-stage').textContent = setup.mode === 'cup' ? CUP_ROUNDS[cup.round] : 'QUICK MATCH';

  $('sb-flag-a').textContent = team(setup.myTeam).flag;
  $('sb-name-a').textContent = setup.myTeam;
  $('sb-flag-b').textContent = team(opp).flag;
  $('sb-name-b').textContent = opp;

  setCommentary(match.myBatting
    ? `You're batting first at ${st.name}. Spin to face the first ball!`
    : `${team(opp).name} bat first. Spin to bowl the first ball!`);
  $('btn-spin').textContent = match.myBatting ? '🏏 SPIN TO BAT!' : '🥎 SPIN TO BOWL!';
  refreshMatchUI();
  show('screen-match');
  drawWheel(wheelAngle);
}

function battingNow() {
  // Whose innings is it? innings 1 = setup.batFirst side, innings 2 = the other
  return match.innings === 1 ? match.myBatting : !match.myBatting;
}

function refreshMatchUI() {
  $('sb-score-a').textContent = `${match.myScore}/${match.myWkts}`;
  $('sb-score-b').textContent = `${match.oppScore}/${match.oppWkts}`;
  $('sb-team-a').classList.toggle('batting', battingNow());
  $('sb-team-b').classList.toggle('batting', !battingNow());

  if (match.target !== null && !match.over) {
    const chasing = battingNow() ? 'You need' : `${team(match.opp).code} need`;
    const scoreNow = battingNow() ? match.myScore : match.oppScore;
    const need = match.target - scoreNow;
    const left = BALLS_PER_INNINGS - match.balls;
    $('sb-target').textContent = `${chasing} ${need} off ${left}`;
  } else {
    $('sb-target').textContent = '';
  }

  // ball-by-ball dots for the current innings
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
    // slice
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

    // label
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

  // rim studs
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

function spin() {
  if (spinning || !match || match.over) return;
  spinning = true;
  ac(); // unlock audio on user gesture
  const btn = $('btn-spin');
  btn.classList.add('spinning');

  const segIndex = Math.floor(Math.random() * SEG_COUNT);   // pure luck
  const arc = (Math.PI * 2) / SEG_COUNT;
  // land segIndex under the top pointer; add jitter inside the slice
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
    const eased = 1 - Math.pow(1 - t, 3); // cubic ease-out
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
  match.balls++;
  match.log.push(result);

  if (result === 'W') {
    match.wickets++;
    if (meBatting) match.myWkts++; else match.oppWkts++;
    sfx.wicket();
    if (meBatting) document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 500);
    setCommentary(meBatting
      ? pickLine(['BOWLED HIM! Disaster strikes! 😱', 'Caught at deep midwicket! OUT! 😱', 'Cleaned up! The crowd goes silent... 💔'])
      : pickLine(['WICKET! What a delivery! 🎯', 'Edged and TAKEN! You beauty! 🙌', 'Timber! You\'ve rattled the stumps! 🤩']));
  } else {
    if (meBatting) { match.myScore += result; if (result === 6) match.sixesThisInnings++; }
    else match.oppScore += result;

    if (result === 6) { sfx.six(); burstConfetti(meBatting ? 26 : 8); }
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
    setCommentary(meBatting ? line : `${team(match.opp).code}: ${line}`);
  }

  refreshMatchUI();

  // innings / match end checks
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
  setCommentary(meBatting
    ? `Chase time! You need ${match.target} runs to win. Spin to bat! 🏏`
    : `You set ${team(match.opp).code} a target of ${match.target}. Spin to bowl! 🥎`);
  $('btn-spin').textContent = meBatting ? '🏏 SPIN TO BAT!' : '🥎 SPIN TO BOWL!';
  refreshMatchUI();
}

/* ---------------- match end & rewards ---------------- */
function endMatch() {
  match.over = true;
  const iWon = match.myScore > match.oppScore;
  const tie = match.myScore === match.oppScore;

  const rewards = [];
  if (match.sixesThisInnings >= 3 && !profile.threeSixes) { profile.threeSixes = true; }

  if (tie) {
    // Sudden-death: replay the same fixture
    sfx.lose();
    showResult({
      emoji: '🤯', title: 'TIED!', lose: false,
      sub: 'Unbelievable scenes! A super-over rematch is needed.',
      score: scoreLine(), rewards: [],
      nextLabel: '⚔️ REMATCH', next: () => startMatch(),
    });
    return;
  }

  if (iWon) {
    profile.wins++;
    profile.streak++;
    profile.bestStreak = Math.max(profile.bestStreak, profile.streak);
    let pts = 10 + (profile.streak >= 3 ? 5 : 0);
    rewards.push(`+${pts} ⭐ points`);
    if (profile.streak >= 2) rewards.push(`🔥 ${profile.streak} win streak`);

    const unlocked = STADIUMS.find(s => s.unlock === profile.wins);
    if (unlocked) rewards.push(`🔓 ${unlocked.name} unlocked!`);

    if (setup.mode === 'cup') {
      const isFinal = cup.round === CUP_ROUNDS.length - 1;
      if (isFinal) {
        profile.trophies++;
        pts += 50;
        rewards.push('+50 ⭐ champion bonus', '🏆 WORLD CUP WON!');
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
      showResult({
        emoji: '✅', title: 'YOU WIN!', lose: false,
        sub: `Through to the ${nextRound.toLowerCase()}! Next up: ${team(cup.opponents[cup.round + 1]).name} ${team(cup.opponents[cup.round + 1]).flag}`,
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
    `🏆 ${profile.trophies} cups · 🔥 best streak ${profile.bestStreak}. Can you beat my luck?`;
  if (navigator.share) {
    navigator.share({ text }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(text)
      .then(() => toast('📋 Result copied — paste it anywhere!'))
      .catch(() => toast(text, 5000));
  }
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
    <div class="trophy-slot"><span class="t-icon">🔥</span><b>${profile.streak}</b><small>Streak</small></div>
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
