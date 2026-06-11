# 🏏 Cricket World Cup — Spin to Glory

A fast, pure-luck cricket game inspired by viral spin-the-wheel games.
Pick your country, pick the enemy, choose to bat or bowl, pick your favourite
stadium — then spin the wheel ball-by-ball in a 6-ball, 2-wicket super over.
Win four knockout matches in a row to lift the World Cup. 🏆

## How to play it right now (no coding needed)

1. Download this project (on GitHub click the green **Code** button → **Download ZIP**, then unzip it).
2. Double-click **`index.html`** — it opens in your web browser and the game runs immediately.
3. It works on a phone browser too, and looks best there.

## Game modes

- **World Cup** — survive 4 knockout rounds (Group → Quarter-Final → Semi-Final → Final). Lose once and you're out.
- **Quick Match vs Bot** — pick both teams and play one super over.
- **VS Friend** — pass-and-play on one phone: Player 1 spins their innings, then hands the phone over.
- **Friend Challenge** — after any bot match, tap *🎯 Challenge a Friend* to get a short code
  (like `CWC-IND-14-M-1`). Your friend taps *🎯 Enter Code*, types it in, and chases your score.
  No internet or account needed — the code carries the whole challenge.

## The wheel

Every ball is one spin: `1, 2, 3, 4, 6` or `W` (wicket) — **every slot counts, no empty slots**.
6 balls or 2 wickets per innings. Highest score wins.

Three difficulty levels change the wheel's luck (verified by simulating 300,000 matches):

| Difficulty | Your win odds |
|---|---|
| 😎 Easy | ~75% |
| ⚖️ Medium | ~50% |
| 💀 Hard | ~5% |

## Gamification (the hooks)

- ⭐ **2 points for every win**, +1 bonus while on a 3+ win streak, +10 for winning the World Cup
- 🌍 **World Rankings leaderboard** — climb past 20 legend players as your points grow
- 🔥 **Win streak** counter on the home screen, trophy room, and leaderboard
- 🏟️ **Stadium unlocks** — Wankhede, Newlands and Galle are locked until you win enough matches
- 🧢 **Pick your 3 batsmen** (in batting order) — unlocked after **5 World Cup wins**
- 🛠️ **Create your own team** — name, code and flag — unlocked after **10 World Cup wins**
- 🎖️ **9 badges** in the Trophy Room (First Blood, Dynasty, Franchise Owner…)
- 📣 **Share button** + challenge codes to spark "can you beat my luck?" battles
- Confetti, crowd-roar sound effects, and last-ball chase drama

All progress is saved automatically on the player's device.

> **Note on the leaderboard:** it's an offline ladder of in-game legends. A live leaderboard of
> real players (and live online multiplayer instead of codes) needs a small server backend —
> a good v2 once the game has fans.

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
