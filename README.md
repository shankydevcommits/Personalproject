# 🏏 Cricket World Cup — Spin to Glory

A fast, pure-luck cricket game inspired by viral spin-the-wheel games.
Pick your country, pick the enemy, choose to bat or bowl, pick your favourite
stadium — then spin the wheel ball-by-ball in a 6-ball, 2-wicket super over.
Win four knockout matches in a row to lift the World Cup. 🏆

## ▶️ Play it now

**The game is live for free at:**
**https://shankydevcommits.github.io/Personalproject/**

(It deploys automatically from this repository via GitHub Pages — every push
updates the website within a couple of minutes.)

You can also download the repo as a ZIP and double-click `index.html`.

## Game modes

- **World Cup** — survive 4 knockout rounds (Group → Quarter-Final → Semi-Final → Final). Lose once and you're out.
- **Quick Match vs Bot** — pick both teams and play one super over.
- **VS Friend** — pass-and-play on one phone: Player 1 spins their innings, then hands the phone over.
- **Friend Challenge** — after any bot match, tap *🎯 Challenge a Friend* to get a short code
  (like `CWC-IND-14-1`). Your friend taps *🎯 Enter Code*, types it in, and chases your score.
  No internet or account needed — the code carries the whole challenge.

## The wheel

Every ball is one spin: `0, 1, 2, 3, 4, 6` or `W` (wicket).
6 balls or 2 wickets per innings. Highest score wins.
The wheel quietly adapts to your form to keep matches dramatic.

## Gamification (the hooks)

- ⭐ **2 points for every win**, +1 bonus while on a 3+ win streak, +10 for winning the World Cup
- 🌍 **World Rankings** — overtake the three all-time legends; live leaderboards coming soon
- 🔥 **Win streak** counter on the home screen, trophy room, and leaderboard
- 🏟️ **Stadium unlocks** — Wankhede, Newlands and Galle are locked until you win enough matches
- 🧢 **Pick your 3 batsmen** from your country's pun-legend roster (Viral Kohli, Ben Strokes,
  AB de Chilliers…) — unlocked after **5 World Cup wins**
- 🛠️ **Create your own team** — name, code and flag — unlocked after **10 World Cup wins**
- 🎖️ **9 badges** in the Trophy Room (First Blood, Dynasty, Franchise Owner…)
- 📣 **Share button** + challenge codes to spark "can you beat my luck?" battles
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
