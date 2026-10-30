# openrouter/openai/gpt-6-luna

**Strategy: Fleetwise Checkerhunt**

> Keep a ledger of every shot and its result. The primary method is to track all legal complete fleet layouts consistent with the evidence: ships are straight, in bounds, nonoverlapping, and may touch; every miss must be water, every hit must be occupied, and each reported sink must match that ship’s type and the shots already made. Treat legal layouts as equally likely unless evidence rules them out. For each unshot cell, count the surviving layouts in which it contains an unsunk ship. Fire at the cell with the highest fraction. If tied, choose the cell whose possible feedback outcomes (miss, hit, or a named sink) divide the layouts most evenly; then prefer the more central cell, breaking any remaining tie in row-major order. After each shot, discard layouts that would not have produced the actual feedback and repeat. This naturally favors follow-up shots near unresolved hits and uses the remaining ship lengths and orientations to rule out impossible targets. Do not assume adjacent hits belong to the same ship: ships may touch. Keep layouts that assign them either way until the evidence resolves it. Once all five ships are sunk, stop.
> 
> If you cannot maintain layout counts, use this concrete fallback. With no unresolved hits, hunt the checkerboard squares, starting near the center and moving outward; after a hit, pause the hunt and target it. Every straight ship of length at least two contains a square of either checkerboard color, so one color alone is a reliable search pattern. Resume the pattern after resolving the hit, skipping every cell already fired at.
> 
> For manual targeting, from a single unresolved hit, try its available orthogonal neighbors, never diagonals as extensions of that ship. A miss rules out that direction for the ship. Once two hits appear collinear and are plausibly the same ship, try the open ends of that line; after an end hits, continue outward, and stop extending at a miss, boundary, or sink. If the ship is not sunk, test any other still-possible direction. With several unresolved hits, handle them as separate possibilities rather than merging them merely because they touch; prioritize the hit and direction best supported by the remaining fleet and all prior results. Keep checking for other ships while targeting, since a nearby hit can belong to a different ship.

## Board 11 · 57 shots

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | D5 | miss | The central cell has the highest occupancy probability, with symmetric central ties broken row-major. |
| 2 | E5 | miss | It is an unshot central cell with a high chance of containing a ship. |
| 3 | F6 | miss | It is a central, unshot cell with strong coverage by placements of the remaining ships. |
| 4 | G4 | hit | It is central and avoids rows and columns containing the previous misses, preserving many possible ship placements. |
| 5 | G5 | miss | It is an orthogonal neighbor of the unresolved hit and a central follow-up that could extend or sink its ship. |
| 6 | F4 | hit | F4 is an open orthogonal neighbor of G4 and fits many plausible horizontal ship placements. |
| 7 | E4 | hit | The adjacent hits likely belong to one longer horizontal ship, making an open endpoint the strongest target. |
| 8 | D4 | hit | The three consecutive hits may belong to a longer horizontal ship, making an open endpoint the strongest target; D4 wins the symmetric tie by row-major order. |
| 9 | C4 | sunk Carrier | It may be the fifth cell of a carrier extending the four aligned hits. |
| 10 | E8 | miss | With no unresolved hits, this central unshot cell has many legal ship placements through it and avoids the known misses. |
| 11 | H7 | miss | It is an unshot central cell with the most clear ship placements crossing it in both directions. |
| 12 | C7 | miss | With no unresolved hits, C7 is an open checkerboard square with many legal remaining-ship placements through it. |
| 13 | H3 | miss | With no unresolved hits, H3 offers strong coverage in both orientations and avoids the known misses and sunk-ship cells. |
| 14 | E2 | miss | It is an untouched, central checkerboard cell with many legal placements for the remaining ships. |
| 15 | D3 | miss | It has the most plausible remaining-ship placements across both the open row and the space above. |
| 16 | G9 | miss | It lies in a clear vertical run and an open row, making it a strong target for the remaining ships. |
| 17 | B6 | miss | It lies in a long clear column and a clear row, giving many legal placements for the remaining ships. |
| 18 | D7 | miss | It lies in several viable horizontal and vertical placements for the remaining ships. |
| 19 | I8 | miss | It lies at the intersection of many legal placements for the remaining ships, especially the Battleship. |
| 20 | F10 | hit | It is clear and lies in several viable placements for the remaining ships, including a Battleship-length line. |
| 21 | F9 | hit | It is the most likely continuation of the unresolved hit at F10, especially for a vertical ship. |
| 22 | F8 | sunk Submarine | It extends the consecutive hits at F9 and F10 and can reveal or sink their ship. |
| 23 | I4 | miss | It has many legal placements across all three remaining ship lengths and is the strongest central hunt target. |
| 24 | J6 | miss | The clear stretch in column J and row 6 gives several remaining ship placements through this cell. |
| 25 | F1 | miss | It has one of the highest estimated fleet-occupancy probabilities among unshot cells and is near the center. |
| 26 | H2 | miss | It lies in several strong remaining-ship placements, giving it the highest estimated chance of a hit. |
| 27 | A5 | miss | It lies in several legal placements of the remaining ships, including long vertical placements along column A. |
| 28 | B2 | miss | It lies in several viable long horizontal and vertical placements for the remaining ships. |
| 29 | D9 | miss | D9 lies in many viable horizontal and vertical placements for the remaining ships. |
| 30 | B10 | miss | It lies in the most possible placements of the remaining four-cell ship, with shorter-ship placements as well. |
| 31 | A8 | miss | It lies in several plausible placements of the remaining ships, including two possible Battleship placements. |
| 32 | J1 | miss | It lies in several viable placements for the remaining Battleship and is also a candidate cell for smaller ships. |
| 33 | C1 | hit | It lies in several viable placements for the remaining ships, including length-four placements. |
| 34 | D1 | hit | It extends the unresolved C1 hit horizontally and is also compatible with more remaining-ship placements than the other adjacent cells. |
| 35 | B1 | hit | It is the more likely extension of the adjacent hits at C1 and D1, especially given the miss at F1. |
| 36 | A1 | miss | The three consecutive hits likely belong to one ship, and A1 can extend that line or start a touching ship. |
| 37 | E1 | sunk Battleship | B1–D1 must belong to the unsunk Battleship, so E1 is its remaining cell. |
| 38 | J9 | hit | It lies in the most surviving cruiser and destroyer placements, making it the best shot by the layout count. |
| 39 | J8 | hit | It is a plausible continuation of the unresolved hit at J9 and fits more remaining ship placements than J10. |
| 40 | J7 | miss | It tests whether J8 belongs to a separate vertical destroyer or extends the ship containing J9. |
| 41 | J10 | sunk Cruiser | J8 and J9 must belong to the same vertical ship, and J10 is the only possible extension. |
| 42 | H6 | miss | It has three legal neighboring cells for the remaining destroyer, tied for the best target and closest to the board’s center. |
| 43 | G7 | miss | It is a central unknown cell adjacent to three possible destroyer placements, maximizing the chance of a hit. |
| 44 | F3 | miss | It belongs to the most possible destroyer placements among the central unshot cells. |
| 45 | I5 | miss | It has three possible destroyer neighbors and is the most central of the best hunt cells. |
| 46 | C8 | miss | It has three legal adjacent Destroyer-pair placements, tied for the highest chance of a hit, and is the most central such cell. |
| 47 | G2 | miss | It belongs to the most possible remaining destroyer placements, and is among the most central tied cells. |
| 48 | B4 | miss | It belongs to the most possible destroyer placements among unshot cells, with a centrality tie-break. |
| 49 | H9 | miss | It belongs to three legal destroyer placements, tied for the best odds and closest to the board’s center. |
| 50 | D10 | miss | It has the highest number of adjacent unknown cells, tying for best odds, and is the most central such choice. |
| 51 | I2 | miss | It belongs to the most legal destroyer placements, tied for best and closest to the center. |
| 52 | B9 | miss | It belongs to three possible destroyer placements, tied for the highest count, and is the most central of those targets. |
| 53 | A3 | miss | It belongs to the most remaining destroyer placements, and ties favor row-major order. |
| 54 | J3 | miss | It has three adjacent unshot cells, giving it the highest chance of hitting the remaining destroyer. |
| 55 | E6 | miss | It belongs to two possible destroyer placements, tying for the best odds and favoring the more central cell. |
| 56 | C3 | hit | It belongs to two legal destroyer placements, tying for the best hit chance while being the most central tied cell. |
| 57 | B3 | sunk Destroyer | C3’s destroyer can extend only to B3 or C2, and B3 wins the tie by row-major order. |

