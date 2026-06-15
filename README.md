# 🏏 Cricket World Cup — Spin to Glory

A fast, pure-luck cricket game inspired by viral spin-the-wheel games.
Pick your country, your top-order batsmen and strike bowler, the opposition,
match length, difficulty and stadium — then spin the wheel ball-by-ball.
Win four knockout matches in a row to lift the World Cup. 🏆

## ▶️ Play it now

**The game is live for free at:**
**https://shankydevcommits.github.io/Personalproject/**

(It deploys automatically from this repository via GitHub Pages — every push
updates the website within a couple of minutes.)

## Game modes

- **World Cup** — survive 4 knockout rounds (Group → Quarter-Final → Semi-Final → Final). Lose once and you're out.
- **Quick Match** — pick both teams and play a one-off game.

## Match setup

- **Match length**: 1 over (6 balls, 2 wkts), 2 overs (12 balls, 3 wkts),
  3 overs (18 balls, 4 wkts) or Full Game (30 balls, 4 wkts)
- **Difficulty**: Easy, Medium or Hard
- **Squad**: choose your top 3 batsmen (in order) and your strike bowler from
  each country's 8 pun legends (Viral Kohli, Jasprit Boom-rah, Ben Strokes,
  Shaheen Shah of Swing, AB de Chilliers…)
- **Bat or bowl first**, and your favourite stadium
- A **back button** during the match lets you leave any time (with a confirm prompt)

## Real cricket rules

- Two batsmen are at the crease; the striker is marked with a `*`
- Odd runs (1, 3 or 5) rotate the strike
- At the end of each over the batsmen change ends and the **next bowler comes on**
  (your picked strike bowler opens, the other two rotate through)
- A wicket brings the next batsman in — and yes, the bowler bats at the end if needed

## 📊 Owner dashboard (player analytics)

The site sends anonymous events (page visits, matches started/won/lost, cups won)
to [GoatCounter](https://www.goatcounter.com) — a free, privacy-friendly analytics
service. The dashboard shows **unique visitors and event counts by day, week or month**.

One-time setup for the owner:
1. Sign up free at https://www.goatcounter.com/signup
2. Choose the site code **`cricketworldcup`** (it must match the code in `index.html`;
   if that name is taken, pick another and update the `data-goatcounter` URL in `index.html`)
3. Your dashboard lives at `https://cricketworldcup.goatcounter.com`

Until that account exists, the tracking calls are simply ignored — the game is unaffected.

## The wheel

Every ball is one spin: `0, 1, 2, 3, 4, 5, 6`, `W` (wicket), plus `WD` (wide)
and `NB` (no-ball). Whatever the pointer lands on is what happens. Wides and
no-balls add 1 run and are **not** counted as a legal ball — the bowler re-bowls,
so you spin again (just like real cricket). Run out of legal balls or wickets and
the innings closes. Highest score wins.

## Gamification (the hooks)

- ⭐ **2 points for every win**, +1 bonus while on a 3+ win streak, +10 for winning the World Cup
- 🌍 **World Rankings** — overtake the three all-time legends; live leaderboards coming soon
- 🔥 **Win streak** counter on the home screen, trophy room, and leaderboard
- 🏟️ **Stadium unlocks** — Wankhede, Newlands and Galle are locked until you win enough matches
- 🛠️ **Create your own team** — name, code and flag — unlocked after **10 World Cup wins**
- 🎖️ **9 badges** in the Trophy Room (First Blood, Dynasty, Franchise Owner…)
- 📣 **Share button** for "can you beat my luck?" bragging
- Live scoreboard with ball-by-ball dots, over counter, batter on strike and bowler
- Confetti, crowd-roar sound effects, and last-ball chase drama

All progress is saved automatically on the player's device.

## Getting it on the App Store / Play Store for $1

The game is a standard web app, which is exactly what app-store wrappers expect.
The route (when you're ready):

1. **Wrap it** with [Capacitor](https://capacitorjs.com) — a free tool that turns
   this folder into a real iPhone/Android app. A developer can do this in under a day.
2. **Apple App Store**: create an Apple Developer account (US$99/year) and submit
   via App Store Connect, with the price tier set to $0.99.
3. **Google Play**: create a Play Console account (US$25, one-time) and submit,
   price set to $0.99.
4. Both stores review the app (usually a few days) before it goes live.

No servers, accounts, or running costs — the whole game lives on the player's phone.
