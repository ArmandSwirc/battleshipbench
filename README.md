<p align="center"><img src="assets/banner.svg" alt="BattleshipBench" width="100%"></p>

<p align="center">
  <code>Battleship 10x10</code> · <code>metric: shots to win</code> · <code>rating: Elo (K=32)</code> · <code>0 dependencies</code>
</p>

**BattleshipBench** measures how well language models play Battleship: spatial reasoning, keeping a board in mind, following a strict output format, and adapting after every hit or miss. Each turn the model sees only its own shot history and answers with one JSON move. No tools, no hand-holding.

## Leaderboard

<!-- LEADERBOARD:START -->
### 🎯 Gauntlet (solo, fixed boards, 0-100)

<p align="center"><img src="assets/leaderboard-gauntlet.svg" alt="Gauntlet leaderboard" width="100%"></p>

<details><summary>Table</summary>

| # | Model | Score | Avg shots | Boards | Auto-moves | Replay |
|--:|---|--:|--:|--:|--:|---|
| 1 | 🤖 Probability bot | **37.8** | 68.7 | 3 | 0 |  |
| 2 | 🤖 Random bot | **2.4** | 98 | 3 | 0 |  |

</details>

### ⚔️ Arena (head-to-head, Elo)

<p align="center"><img src="assets/leaderboard-arena.svg" alt="Arena leaderboard" width="100%"></p>

<details><summary>Table</summary>

| # | Model | Elo | Wins | Games |
|--:|---|--:|--:|--:|
| 1 | claude-sonnet-5-5 | **1016** | 1 | 1 |
| 2 | gpt-6.1-sol | **1016** | 1 | 1 |
| 3 | gpt-6.1-terra | **984** | 0 | 1 |
| 4 | claude-opus-5-5 | **984** | 0 | 1 |

**Game replays** (strategy, reasoning and every shot per game):

| Match-up | Games | Replay |
|---|--:|---|
| claude-opus-5-5 vs gpt-6.1-sol | 1 | [strategy & shots](results/arena/anthropic_claude-opus-5-5_vs_openrouter_openai_gpt-6.1-sol/games.md) · [boards](results/arena/anthropic_claude-opus-5-5_vs_openrouter_openai_gpt-6.1-sol/overview.svg) |
| claude-sonnet-5-5 vs gpt-6.1-terra | 1 | [strategy & shots](results/arena/anthropic_claude-sonnet-5-5_vs_openrouter_openai_gpt-6.1-terra/games.md) · [boards](results/arena/anthropic_claude-sonnet-5-5_vs_openrouter_openai_gpt-6.1-terra/overview.svg) |

</details>
<!-- LEADERBOARD:END -->

## How the scores work

### 🎯 Gauntlet: absolute score, 0–100

Every model plays **solo** on the *same* 3 seeded boards (same fleet positions for everyone), so results are reproducible and independent of any opponent.

```
score = 100 × (100 − average shots to sink the fleet) / 83
```

| Score | Meaning |
|--:|---|
| **100** | Perfect play: 17 shots, every shot a hit |
| **~38** | The probability-density bot on these boards (a strong algorithmic baseline) |
| **~2** | Random shooting (about 98 shots) |
| **0** | Fleet not sunk within 100 shots |

Invalid moves (off-board, already-fired cell, no JSON) get two retries with feedback; after that a random *auto-move* is played and counted. Bots (🤖) are the yardstick.

**Strategy first, then complete freedom** (same idea as the arena's free play). Every model gets the same two phases:

1. **Strategy:** before the first shot it writes its own game plan (how it searches, how it follows up a hit). The plan is fixed for the whole run and shown back on every turn of every board. Ship placement is skipped: the boards are fixed.
2. **Play:** each shot is the model's own call. The prompt holds only the rules, its own strategy and the board (finished ships `S`, open hits `X`, the unresolved hits, the smallest remaining ship and the list of cells already fired). No steps, no modes, no tips. Thinking is capped at 8000 tokens per shot (the same for every model and for the 1v1 arena), only as a guard against endless loops: when the cap is hit, or the model repeats itself, the reasoning is cut off and it must answer from it. The strategy written up front has no cap.

Each run saves the strategy and the reasoning of every shot in `results/<model>/strategy.md`.

### 🗺️ How the boards are made: difficult, but realistic

All models play the same first 3 of the 10 boards frozen in [`boards.json`](boards.json), so results are comparable and reproducible. The Gauntlet score is always computed on those 3 boards, bots included.

1. **Realistic:** standard fleet (Carrier 5, Battleship 4, Cruiser 3, Submarine 3, Destroyer 2); ships are straight and never overlap, may touch; mixed orientation (2–3 horizontal); at most 2 ships flush against the border.
2. **Difficult:** for each board, 300 random legal fleets are generated and each is played 3× by the probability-density bot. The fleet that bot needs the most shots to find is kept. These fleets sit where density heuristics look last, so lucky center-hunting does not pay off.
3. **Transparent:** regenerate with `node bench.mjs boards`. The live screen shows every ship by name so you can follow how each model hunts.

Caveat: boards are tuned against the density bot, which makes the bot a *harsh* yardstick. Compare models to each other and to the bots on the same boards.

### ⚔️ Arena: relative score, Elo

Two models play each other, each one placing its own fleet. Every finished game updates an **Elo** rating (start 1000, K = 32): beating a stronger model earns more than beating a weaker one. Swap sides across games to cancel out the first-move advantage. Also tracked per model: win rate, average shots per win, accuracy (hits / shots) and auto-moves.

**Dossier mode** (default): every game starts blank, no memory across games. Each turn the model gets, next to the board, a fresh dossier built from that game only: where it has searched (hits per ring from the edge to the centre) and how the opponent has shot at its fleet (recent shots, hit rate, parity, edge shots). It never sees the opponent's strategy text or reasoning. Every game is saved under `results/arena/<A>_vs_<B>/` with its strategy and every shot with reasoning.

## Run it

```bash
node server.mjs                                              # 1v1 arena at http://127.0.0.1:8791, live bench at /bench
node bench.mjs boards                                        # (re)generate the fixed boards
node bench.mjs bots                                          # measure the yardstick bots
node bench.mjs run anthropic/claude-haiku-5-5 --boards 3     # Gauntlet for one model
node bench.mjs readme                                        # refresh the leaderboard above
```

Add providers (OpenAI-compatible endpoints or Anthropic) with the **Providers** button. API keys stay in `providers.json` on your machine (mode 600, git-ignored). See `providers.example.json`. Results live in `bench.jsonl` (Gauntlet) and `matches.jsonl` (Arena).
