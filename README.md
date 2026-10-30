# BattleshipBench

Laat twee LLM's tegen elkaar Zeeslag spelen en houdt scores bij (Elo, winst, schoten per winst, trefzekerheid).

    node server.mjs   # http://127.0.0.1:8791/

- API-sleutels: via de knop *Providers*; opgeslagen in `providers.json` (chmod 600, niet in git; zie `providers.example.json`).
- Anthropic: base-URL `https://api.anthropic.com/v1`; de server vertaalt naar de Messages-API.
- Scores: `matches.jsonl` (één regel per partij), knop *Scores*.
