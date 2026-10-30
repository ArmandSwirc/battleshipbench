<p align="center"><img src="assets/banner.svg" alt="BattleshipBench" width="100%"></p>

<p align="center">
  <img alt="game" src="https://img.shields.io/badge/game-Battleship_10×10-ee7a45?style=flat-square&labelColor=151514">
  <img alt="metric" src="https://img.shields.io/badge/metric-shots_to_win-2fc08d?style=flat-square&labelColor=151514">
  <img alt="rating" src="https://img.shields.io/badge/rating-Elo_K%3D32-aeaca5?style=flat-square&labelColor=151514">
  <img alt="deps" src="https://img.shields.io/badge/dependencies-0-4cbf68?style=flat-square&labelColor=151514">
</p>

**BattleshipBench** measures how well language models play Battleship: spatial reasoning, keeping a board in mind, following a strict output format, and adapting after every hit or miss. Each turn the model sees only its own shot history and answers with one JSON move. No tools, no hand-holding.

## Leaderboard

<!-- LEADERBOARD:START -->
### 🎯 Gauntlet (solo, fixed boards, 0-100)

| # | Model | Score | Avg shots | Boards | Auto-moves |
|--:|---|--:|--:|--:|--:|
| 1 | 🤖 Probability bot | **60.1** | 50.1 | 10 | 0 |
| 2 | 🤖 Random bot | **4.8** | 96 | 10 | 0 |

### ⚔️ Arena (head-to-head, Elo)

_No games played yet._
<!-- LEADERBOARD:END -->

## How the scores work

### 🎯 Gauntlet: absolute score, 0–100

Every model plays **solo** on the *same* 10 seeded boards (same fleet positions for everyone), so results are reproducible and independent of any opponent.

```
score = 100 × (100 − average shots to sink the fleet) / 83
```

| Score | Meaning |
|--:|---|
| **100** | Perfect play: 17 shots, every shot a hit |
| **60** | About a probability-density bot (the best a clean algorithm does) |
| **5** | Random shooting (about 96 shots) |
| **0** | Fleet not sunk within 100 shots |

Invalid moves (off-board, already-fired cell, no JSON) get two retries with feedback; after that a random *auto-move* is played and counted. Bots (🤖) are the yardstick.

### ⚔️ Arena: relative score, Elo

Two models play each other, each one placing its own fleet. Every finished game updates an **Elo** rating (start 1000, K = 32): beating a stronger model earns more than beating a weaker one. Swap sides across games to cancel out the first-move advantage. Also tracked per model: win rate, average shots per win, accuracy (hits / shots) and auto-moves.

## Run it

```bash
node server.mjs                                              # UI at http://127.0.0.1:8791 (Arena)
node bench.mjs bots                                          # measure the yardstick bots
node bench.mjs run anthropic/claude-haiku-5-5 --boards 5     # Gauntlet for one model
node bench.mjs readme                                        # refresh the leaderboard above
```

Add providers (OpenAI-compatible endpoints or Anthropic) with the **Providers** button. API keys stay in `providers.json` on your machine (mode 600, git-ignored). See `providers.example.json`. Results live in `bench.jsonl` (Gauntlet) and `matches.jsonl` (Arena).
