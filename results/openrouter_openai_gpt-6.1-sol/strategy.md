# openrouter/openai/gpt-6.1-sol

**Strategy: Posterior Crossfire**

> OBJECTIVE AND RECORDKEEPING
> Minimize the total shots needed to sink all five ships. There are exactly 17 occupied cells, so avoiding misses is the main objective, but information that prevents later misses also matters. Maintain a precise board of untried cells, misses, and hits; the chronological shot results; the named ships sunk; and the remaining length multiset, initially {5,4,3,3,2}. Never repeat a shot. Recalculate after every result rather than following a predetermined sequence.
> 
> NONNEGOTIABLE GEOMETRY
> Ships are straight, horizontal or vertical, and cannot overlap. They MAY touch, including side by side and end to end. Never mark the neighbors of a sunk ship as water merely because they are adjacent. Adjacent hits need not belong to the same ship, and a long run of hits may contain several touching ships. Only actual misses, already occupied cells assigned to other ships, board boundaries, and the full observation history exclude placements.
> 
> THE UNDERLYING MODEL
> Treat complete legal fleet arrangements as equally likely initially; do not assume an undisclosed preference for edges, corners, or separation. Retain arrangements consistent with every observation. A miss must be empty. A plain hit must occupy a ship that was not yet completely hit on that turn. A named sinking result means that particular ship became completely hit on that shot, not earlier. Thus an unsunk ship cannot have all its cells among previously fired hits.
> 
> Use the surviving arrangements to estimate p(x), the probability that an untried cell x contains an unsunk ship. Prefer joint fleet reasoning over independent ship counts: all observed hits must be explained simultaneously, ships must not overlap, and remaining ship multiplicities matter. Exact enumeration is not required for hand play, but these are the constraints every approximation must respect.
> 
> A sinking announcement does not necessarily identify the whole footprint when ships touch. Retain every plausible footprint consistent with the named length and shot history. Do not arbitrarily assign all neighboring hits to the sunk ship. Track alternative assignments until further evidence resolves them. Within each alternative, only the hits not assigned to sunk ships need further targeting.
> 
> SHOT SELECTION
> If an untried cell is certainly occupied, take that guaranteed hit. Never choose a cell that cannot belong to any consistent remaining fleet.
> 
> The ideal decision minimizes expected remaining shots, not merely the chance of an immediate hit. If the remaining possibilities are small enough to solve, use V(S)=min_x[1+sum_o P(o|S,x)V(S after o)], with V=0 once the fleet is sunk; outcomes distinguish misses, ordinary hits, and named sinkings. This is especially valuable in small endgames.
> 
> For normal play, use the best reliable probability estimates available. If reliable conditional estimates permit two-shot lookahead, maximize p(x)+sum_o P(o|x) max_y p(y|o), recalculating after the actual result. Otherwise choose the largest p(x). Do not invent numerical precision or pretend to enumerate fleets that have not actually been considered. For essentially tied choices, prefer a likely sinking shot, then a shot that distinguishes important orientations or hit assignments, then the better search coverage. Break any remaining tie deterministically by row and then column. With an untouched board and no other information, open at E5.
> 
> HUNTING: NO UNRESOLVED LIVE HITS
> Build a heatmap from legal placements of the remaining ships. A placement must fit on the board, avoid misses and occupied sunk footprints, and be compatible with at least one explanation of the history. Recompute after each shot and each sinking; do not continue using the original fleet lengths.
> 
> A concrete hand-computable approximation is W(x)=sum_l n_l C_l(x)/N_l. Here n_l is the number of remaining ships of length l, N_l is the number of currently viable horizontal and vertical placements for one such ship, and C_l(x) counts those placements containing x. Initially N_l=20(11-l). Normalizing by N_l avoids treating ships with different numbers of placements as though they had the same prior weight per placement. Count the two length-three ships separately through their multiplicity. Use joint-fleet compatibility to remove impossible placements whenever practical. Shoot the largest estimated occupancy, not merely the center of the largest-looking empty region.
> 
> Use spacing as a coverage aid. Let k be the shortest remaining ship length. A diagonal residue pattern (column number + row number) mod k = r intersects every horizontal or vertical ship of length at least k. For k=2 this is a checkerboard; when the destroyer is gone, k may become 3 or larger. Favor a useful residue among otherwise comparable hunt shots and avoid wasting a sequence of misses on neighboring cells with heavily overlapping coverage. These patterns are not evidence that other cells are empty: do not reject a substantially better probability merely to preserve parity. Reassess the pattern when remaining lengths change. Centerward cells generally score well early, but depleted central lines and constrained edge placements can make edges preferable later.
> 
> TARGETING: ONE OR MORE UNRESOLVED HITS
> Immediately condition on the hit. Consider all remaining ship lengths and every feasible placement containing it. The strongest next targets are usually orthogonal neighbors, but rank them by the support of those placements rather than using a fixed north/east/south/west order. A direction with insufficient available space for every possible ship is impossible. Misses and board edges are hard stops for that individual ship.
> 
> For a single isolated hit h, a useful local approximation is to count candidate placements containing both h and each proposed target x, weighting a placement of length l by n_l/N_l. Normalize over all candidate placements containing h if comparing this track with another hit track. This rewards directions supported by many plausible ships and lengths instead of guessing an orientation blindly. Include the possibility of other ships when estimating overall occupancy.
> 
> After a second collinear hit, continuation along that line usually becomes best. Compare both ends using remaining lengths, misses, boundaries, and the number of legal ways each end can complete the ship. Fill an internal gap when the observations strongly support one ship spanning it. If an end misses, stop extending that hypothesized ship through it and investigate the other end. Do not abandon the original hit after just one unsuccessful neighbor probe.
> 
> Do not make collinearity an irreversible commitment. Touching ships can produce misleading adjacent hits. Maintain alternative explanations whenever one ship cannot explain the observations or the evidence remains ambiguous. Never extend a supposed single ship beyond the longest remaining length. If a run reaches an expected length without a sinking announcement, reconsider its assignment instead of declaring it finished.
> 
> With several open hits, consider assignments of hits to the available ships. Collinear hits may share a ship only if a feasible placement spans them; noncollinear hits cannot share one straight ship. Distinct assignments must respect ship multiplicities and nonoverlap. Do not count the same candidate ship independently once for every hit it contains. Prefer shots supported across many assignments, especially forced gaps or high-probability endpoints. Work on whichever unresolved track offers the best expected progress, not automatically the oldest or newest hit. A shot supported by several otherwise different explanations is particularly valuable.
> 
> Following a sinking, remove exactly the announced ship, update possible footprints, and recompute. Continue targeting any hits that may belong to another unsunk ship. Return to pure hunting only when no unresolved live hits remain. If targeting becomes weak and a hunt shot genuinely has better expected value, take the hunt shot; target mode is a probability advantage, not an obligation to shoot low-probability neighbors.
> 
> ENDGAME AND FINAL CHECK
> As possibilities shrink, explicitly list the remaining placements and their compatible combinations. Exploit forced cells, eliminate impossible assignments, and use outcome lookahead where manageable. For the final ship, choose shots from its surviving placements, favoring those that cover many possibilities and leave easy follow-ups; do not continue a stale checkerboard unnecessarily. Before every shot verify: the cell is untried, some consistent remaining ship can occupy it, touching has not been incorrectly forbidden, all open hits are accounted for, and the current remaining lengths—not the original fleet—were used. Stop immediately after all five named ships are sunk.

## Board 11 · 48 shots

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | E5 | miss | A central opening covers many possible placements of every ship length. |
| 2 | F6 | miss | F6 has the strongest remaining placement coverage without sharing the depleted row or column of E5. |
| 3 | D4 | hit | D4 ties for the strongest remaining ship-placement coverage while avoiding both depleted rows and columns. |
| 4 | E4 | hit | E4 is supported by the most plausible ship placements extending from D4. |
| 5 | F4 | hit | F4 extends the two-hit line and is also supported by plausible touching-ship arrangements. |
| 6 | G4 | hit | G4 tests a likely continuation of the unsunk three-hit line while retaining strong coverage of other possible ships. |
| 7 | C4 | sunk Carrier | C4 tests one end of the likely carrier spanning the four unsunk hits. |
| 8 | D7 | miss | D7 ties for the strongest placement coverage across the remaining ship lengths. |
| 9 | H7 | miss | H7 has maximal remaining ship-placement coverage across the four unsunk ships. |
| 10 | G8 | miss | G8 has the strongest placement coverage across the four remaining ships. |
| 11 | H3 | miss | H3 ties for the strongest remaining ship-placement coverage and wins the row-order tiebreak. |
| 12 | C8 | miss | C8 has the strongest remaining ship-placement coverage across the four unsunk ships. |
| 13 | I5 | miss | I5 ties for the strongest remaining ship-placement coverage and wins the row-order tiebreak. |
| 14 | B6 | miss | B6 ties for the strongest remaining ship-placement coverage and wins the row-order tiebreak. |
| 15 | E9 | miss | E9 has the strongest remaining ship-placement coverage across the four unsunk ships. |
| 16 | B3 | hit | B3 has the strongest normalized placement coverage across the four remaining ships. |
| 17 | B2 | miss | B2 strongly supports ships through B3 while offering better coverage of other ships than the alternative neighbors. |
| 18 | C3 | sunk Destroyer | C3 has the strongest support among legal ship placements through B3 after the miss at B2. |
| 19 | A5 | miss | A5 ties for the strongest normalized placement coverage of the three remaining ships. |
| 20 | J6 | miss | J6 ties for the strongest normalized placement coverage across the three remaining ships. |
| 21 | F10 | hit | F10 has the highest normalized placement coverage for the three remaining ships. |
| 22 | G10 | miss | G10 is strongly supported by the remaining horizontal ship placements through F10. |
| 23 | F9 | hit | F9 tests the vertical ship through F10 and can also hit a separate ship if F10 belongs to a horizontal one. |
| 24 | F8 | sunk Submarine | F8 extends the two vertical hits and is supported by most plausible ship assignments through F9 and F10. |
| 25 | D1 | hit | D1 has the highest occupancy probability across compatible placements of the remaining battleship and cruiser. |
| 26 | C1 | hit | C1 has the strongest support among compatible placements of the battleship and cruiser through D1. |
| 27 | B1 | hit | B1 has the strongest support among compatible placements and could immediately sink the cruiser. |
| 28 | A1 | miss | A1 ties for the highest hit probability and can immediately sink either the battleship or the cruiser. |
| 29 | E1 | sunk Battleship | B1 must belong to the battleship spanning B1–E1, making E1 a guaranteed sinking shot. |
| 30 | F2 | miss | F2 covers four of the 51 legal cruiser placements, tying for the highest hit probability. |
| 31 | I2 | miss | I2 covers four of the 47 remaining cruiser placements, tying for the highest hit probability and winning the row-order tiebreak. |
| 32 | I8 | miss | I8 covers four of the 43 remaining cruiser placements, tying for the highest hit probability and winning the row-order tiebreak. |
| 33 | B9 | miss | B9 covers four of the 39 remaining cruiser placements, more than any other untried cell. |
| 34 | G1 | miss | G1 covers three of the 35 remaining cruiser placements, tying for the highest hit probability. |
| 35 | J4 | miss | J4 covers three remaining cruiser placements and preserves stronger follow-up coverage if it misses. |
| 36 | A7 | miss | A7 covers three remaining cruiser placements while preserving strong follow-up coverage if it misses. |
| 37 | H9 | miss | H9 covers three of the 26 remaining cruiser placements and leaves efficient follow-up shots. |
| 38 | D10 | miss | D10 covers three of the 23 remaining cruiser placements and preserves stronger follow-up coverage if it misses. |
| 39 | J1 | miss | J1 covers two of the 20 remaining cruiser placements while preserving efficient follow-up coverage. |
| 40 | E3 | miss | E3 covers two of the 18 remaining cruiser placements and guarantees F3 is occupied if it hits. |
| 41 | C5 | miss | C5 covers two of the 16 remaining cruiser placements and leaves efficient follow-up shots. |
| 42 | G5 | miss | G5 covers two of the 14 remaining cruiser placements while preserving efficient follow-up coverage. |
| 43 | E6 | miss | E6 covers two of the 12 remaining cruiser placements, tying for the highest hit probability. |
| 44 | H6 | miss | H6 covers two of the ten remaining cruiser placements, tying for the highest hit probability. |
| 45 | J8 | hit | J8 covers two of the eight remaining cruiser placements, tying for the best hit chance and allowing efficient follow-up shots. |
| 46 | J9 | hit | J9 is occupied in both remaining cruiser placements through J8, making it a guaranteed hit. |
| 47 | J7 | miss | J7 can sink the cruiser and wins the row-order tie between its two equally likely endpoints. |
| 48 | J10 | sunk Cruiser | J10 is the cruiser’s only possible remaining cell and will sink it. |

## Board 23 · 49 shots

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | E5 | miss | A central opening covers many possible placements of all five ships. |
| 2 | F6 | miss | F6 retains maximum central ship coverage without sharing a row or column with the miss at E5. |
| 3 | D4 | miss | D4 has strong coverage across all remaining ship lengths without sharing a row or column with either miss. |
| 4 | G7 | hit | G7 has the highest remaining ship-placement coverage while avoiding rows and columns depleted by misses. |
| 5 | G6 | hit | G6 is supported by the most viable ship placements extending from the hit at G7. |
| 6 | G5 | hit | G5 extends the two aligned hits and could complete a three-cell ship. |
| 7 | G4 | hit | G4 extends the three aligned hits and is supported by several possible carrier or battleship placements. |
| 8 | G3 | sunk Carrier | G3 may complete the carrier and is also supported by split-ship explanations of the four-hit run. |
| 9 | C7 | miss | C7 has the strongest estimated coverage across the remaining ship lengths in the open lower-left region. |
| 10 | D8 | miss | D8 has the strongest remaining ship-placement coverage across its open row and long vertical run. |
| 11 | H8 | miss | H8 has strong placement coverage for all remaining ship lengths in the open lower-right region. |
| 12 | C3 | miss | C3 has the strongest weighted coverage of legal placements for the four remaining ships. |
| 13 | F2 | miss | F2 ties for the highest weighted coverage of legal placements for the four remaining ships. |
| 14 | B6 | miss | B6 ties for the highest weighted coverage of legal placements for the four remaining ships. |
| 15 | E9 | hit | E9 has the strongest weighted coverage of legal placements for the four remaining ships. |
| 16 | F9 | hit | F9 has strong support from ships extending through E9 and additional vertical placements. |
| 17 | G9 | hit | G9 extends the two aligned hits and also has support from vertical ship placements. |
| 18 | H9 | sunk Battleship | H9 extends the three-hit run and has stronger support because G9 has fewer viable vertical ship placements. |
| 19 | B9 | miss | B9 has strong coverage for the remaining short ships across several low-conflict horizontal and vertical placements. |
| 20 | B2 | miss | B2 has strong coverage for both remaining ship lengths across relatively low-conflict placements. |
| 21 | H2 | miss | H2 has top-tier coverage for the remaining short ships and strong follow-up targets in both orientations. |
| 22 | I3 | miss | I3 has top short-ship placement coverage and strong follow-up options in both orientations. |
| 23 | I7 | hit | I7 has maximum short-ship coverage, with candidate placements that leave more room for the other ships. |
| 24 | I6 | sunk Destroyer | I6 is supported by two three-cell extensions of I7 and has stronger additional ship coverage than I8. |
| 25 | H5 | miss | H5 ties for the highest remaining ship coverage and offers strong vertical follow-ups. |
| 26 | A8 | miss | A8 ties for the highest fleet-consistent occupancy and offers strong follow-up shots. |
| 27 | C10 | miss | C10 has the highest occupancy across compatible placements of the two remaining three-cell ships. |
| 28 | J4 | miss | J4 has the highest occupancy across compatible placements of the two remaining three-cell ships. |
| 29 | A4 | miss | A4 ties for the highest occupancy across compatible placements of the two remaining three-cell ships. |
| 30 | D1 | miss | D1 has the highest occupancy across compatible placements of the two remaining three-cell ships. |
| 31 | F10 | miss | F10 offers high occupancy and the strongest expected hit coverage over the next two shots. |
| 32 | I10 | miss | I10 has the highest fleet-consistent occupancy and strong follow-up targets in both orientations. |
| 33 | J7 | miss | J7 ties for the highest occupancy across compatible placements of the two remaining three-cell ships. |
| 34 | G1 | miss | G1 ties for maximum fleet-consistent occupancy and offers the strongest two-shot follow-up. |
| 35 | E2 | hit | E2 has the highest occupancy across compatible placements of the two remaining three-cell ships. |
| 36 | E3 | miss | E3 is shared by both possible vertical ships through E2, giving it the strongest hit support. |
| 37 | C2 | hit | C2 is a guaranteed hit because the only possible ship through E2 occupies C2, D2, and E2. |
| 38 | D2 | sunk Submarine | D2 is a guaranteed hit that completes the only possible three-cell ship through E2. |
| 39 | B5 | miss | B5 covers three of the 16 possible cruiser placements and preserves better follow-up coverage than C5. |
| 40 | A1 | miss | A1 covers two possible cruiser placements while preserving optimal follow-up coverage. |
| 41 | J1 | miss | J1 covers two of the 11 remaining cruiser placements while preserving optimal follow-up coverage. |
| 42 | C6 | miss | C6 covers two remaining cruiser placements while preserving optimal follow-up coverage. |
| 43 | D7 | miss | D7 covers two of the seven possible cruiser placements while preserving the best follow-up coverage. |
| 44 | E8 | miss | E8 covers two of the five remaining cruiser placements, giving the highest chance of a hit. |
| 45 | F3 | miss | F3 tests one of the three equally likely remaining cruiser placements. |
| 46 | A5 | miss | A5 tests one of the two remaining cruiser placements, A5–A7 and J8–J10. |
| 47 | J8 | hit | J8 is a guaranteed hit in the only remaining cruiser placement, J8–J10. |
| 48 | J9 | hit | J9 is a guaranteed hit in the only remaining cruiser placement, J8–J10. |
| 49 | J10 | sunk Cruiser | J10 is a guaranteed hit that sinks the cruiser and completes the fleet. |

