# deepseek/deepseek-flash

**Strategy: Bayes Afloat**

> Coordinate convention: columns A-J are 1-10, rows 1-10. A cell is (c,r). Parity is even if c+r is even.
> 
> Keep state: M=missed cells, K=cells of sunk ships, H=hit cells not yet on a sunk ship, R=multiset of remaining ship lengths. A legal placement for remaining length L is any L consecutive cells in one row or column, wholly on board, using no cell of M or K. Let T_L be the number of legal placements of length L. Let mult(L) be how many unsunk ships of that length remain.
> 
> MAIN LOOP
> 1. After each shot update M/K/H/R. If H is empty go to HUNT; otherwise go to TARGET.
> 2. HUNT (no open hits): For every unshot cell x, for each remaining length L count N_L(x)=number of legal length-L placements containing x. Set S(x)=sum_L mult(L)*N_L(x)/T_L. Fire the unshot cell with largest S(x). This is the posterior probability that x is occupied by a remaining ship under uniform legal placements. Initially it favors the center. Do not fire cells with S=0 unless all have S=0.
> 3. TARGET (one or more open hits): For every unshot cell x, for each remaining length L count N_L^H(x)=number of legal length-L placements that contain x and also contain at least one cell of H. Set S(x)=sum_L mult(L)*N_L^H(x)/T_L. Fire the unshot cell with largest S(x). This automatically extends straight runs and fills gaps between collinear hits; do not switch back to HUNT until H is empty.
> 4. If the chosen shot is a miss, add it to M and continue the same mode. If it is a hit but not sunk, add to H and continue TARGET. If it sinks a ship, remove exactly that ship's cells from H to K, delete its length from R, then continue TARGET if H is nonempty, otherwise HUNT.
> 
> TIE-BREAKING (use in order)
> (a) In TARGET, prefer a cell in the same row or column as more open hits with no missed cell between it and that hit. This favors finishing an already-damaged line.
> (b) Prefer even parity (c+r even). In pure HUNT, if the best odd-parity cell is only slightly better (within 10%) than the best even-parity cell, choose the even-parity cell; every ship of length at least 2 has an even-parity cell, so this prevents leaving a ship completely undiscovered.
> (c) Prefer cells nearer the center using B=[1,2,3,4,5,5,4,3,2,1] for column/row indices 1..10; higher B(c)+B(r) first.
> (d) If still tied, prefer smaller row number r, then smaller column index c.
> 
> FALLBACK SEARCH ORDER
> If exact counting is impractical or all scores are zero, use this deterministic hunt order: among all unshot cells, take even-parity cells first in descending B(c)+B(r), ties by smaller row then smaller column; when even-parity cells that can belong to a legal placement are exhausted, do the same for odd-parity cells. Center starts are E5 and F6, then other high-B even cells. Resume this order after each sink, skipping shot cells. After any hit, switch immediately to TARGET.
> 
> TARGET SPECIAL RULES
> - With a single open hit, test the four neighbors that still allow a legal placement; the score formula chooses the best. If scores are near equal, prefer the direction with more room for the longest remaining ship and/or toward the center.
> - With two or more collinear open hits, keep extending that same line at either open end before testing perpendicular cells. If both ends are blocked by a miss or the board edge and the hits have not sunk a ship, those hits cannot all be one unsunk ship; treat them as separate ships and probe perpendicular from each hit.
> - If a hit cluster bends or is not collinear, it must involve different ships touching; do not assume one ship contains all of them. Apply the TARGET score to each hit/possible placement and choose the globally best constrained cell.
> - A run longer than every remaining ship length cannot be one ship; split it into separate ships and resolve the most constrained hit first.
> - When a ship sinks, only remove exactly the announced sunk cells from H. Any other open hits, even if adjacent, remain open and may belong to other touching ships.
> 
> GENERAL RULES
> - Never repeat a shot. Never fire a cell that belongs to no legal placement for any remaining ship, unless all unshot cells are impossible; in that error case use the fallback order over unshot cells.
> - Use remaining lengths relentlessly: in HUNT and TARGET ignore placements whose length is not in R or that would cross a missed cell or sunk-ship cell. When a length is eliminated by a sink, recompute scores immediately; do not keep using a pattern that assumed the sunk length still existed.
> - If there are several open hits far apart, TARGET score naturally picks the one with the most/extensions. If scores tie, resolve the cluster with fewer possible placements first, because the most constrained hit minimizes wasted probing.
> - The plan is probabilistic with a checkerboard tie-break: no guessing and no fixed ship assumption until the game announces a sink.

## Board 11 · 47 shots

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | E5 | miss | Center-opening shot maximizes placement probability under the given hunt heuristic. |
| 2 | F6 | miss | Best remaining central cell on even parity after E5 miss, maximizing weighted legal placements. |
| 3 | D4 | hit | Highest posterior ship-occupancy score, central and even parity. |
| 4 | E4 | hit | It is the highest-scoring extension from open hit D4, allowing the most remaining-ship placements. |
| 5 | F4 | hit | Extending the D4-E4 hit run at the open right end gives the best carrier placement count and even parity. |
| 6 | G4 | hit | Extend the D4-F4 hit run right; G4 maximizes legal placements for remaining lengths, especially the 5-cell Carrier. |
| 7 | C4 | sunk Carrier | Extend the four collinear hits toward the center-adjacent end to complete a likely length-5 carrier. |
| 8 | D7 | miss | Best posterior score: full row plus long vertical run in column D. |
| 9 | E3 | miss | central cell with high posterior probability, avoiding fired cells and sunk carrier row |
| 10 | H7 | miss | Highest combined placement score for remaining ships (N4=7 plus strong N3/N2), favoring the central damaged area. |
| 11 | B3 | hit | Highest posterior density for remaining ships, favoring central even-parity cells after the carrier sink. |
| 12 | B4 | miss | Extending the open hit at B3 vertically is the highest-scoring placement for remaining ships, especially the 4-length battleship. |
| 13 | C3 | sunk Destroyer | Best target score: it extends B3 and lies in two possible remaining 3-cell placements. |
| 14 | H4 | miss | Central high-probability cell extending the dense hit cluster near the sunk ships, maximizing weighted placement count for the remaining 4- and 3-cell ships. |
| 15 | E8 | miss | Highest combined posterior coverage for remaining length-4 and length-3 ships near center. |
| 16 | I5 | miss | Highest-probability remaining ship placement cell from the coverage count. |
| 17 | D2 | miss | Highest weighted posterior: strong horizontal run D2 plus vertical length-3 support in column D. |
| 18 | E9 | miss | Highest posterior coverage for remaining 4/3 ships near center-bottom with no open hits. |
| 19 | H8 | miss | Highest combined placement score from row and column coverage for remaining lengths. |
| 20 | F1 | miss | Highest posterior score among reachable cells for remaining Battleship/Cruiser/Submarine placements. |
| 21 | C1 | hit | Highest weighted placement score among evaluated cells, favoring central coverage for remaining ships. |
| 22 | D1 | hit | Best extension of the open hit at C1, appearing in the most legal 3- and 4-cell placements and favored by center tie-break. |
| 23 | B1 | hit | B1 lies in the most likely length-3/4 placements extending the adjacent C1/D1 hit cluster. |
| 24 | E1 | sunk Battleship | The three-hit run must be a length-4 battleship needing one end; E1 is the more probable end and preserves A1 for a possible vertical 3-ship. |
| 25 | B8 | miss | Highest-probability even-parity cell with five legal length-3 placements through it. |
| 26 | C6 | miss | It is the unknown cell covered by the most legal length-3 placements for the remaining Cruiser and Submarine. |
| 27 | G2 | miss | Highest combined placement count among free cells (4), with parity and center tie-break. |
| 28 | G7 | miss | Maximal placement likelihood tied at 4, and G7 is the best even-parity, central option. |
| 29 | A5 | miss | Highest posterior placement count for remaining 3-cell ships in the constrained board. |
| 30 | F10 | hit | Center-weighted even-parity cell with maximal legal-placement coverage for the remaining 3-length ships. |
| 31 | E10 | miss | E10 extends the F10 hit horizontally and participates in the most legal length-3 placements containing that hit. |
| 32 | F8 | hit | Only vertical length-3 placement F8-F10 remains plausible around the hit; F8 is even-parity and more central than H10. |
| 33 | F9 | sunk Submarine | It fills the gap between open hits F8 and F10, completing the only length-3 vertical placement covering both. |
| 34 | J6 | miss | Highest legal-placement coverage (4) among unknown cells, with even parity and best center tie-break. |
| 35 | I3 | miss | It is tied for the highest number of legal Cruiser placements and wins the even-parity/center tie-break. |
| 36 | C9 | miss | C9 is tied for the most legal Cruiser placements (4) and wins the center/parity tie-break. |
| 37 | I9 | miss | It appears in the most legal Cruiser placements (4), maximizing hit probability. |
| 38 | A7 | miss | Highest-probability cell for the remaining Cruiser, with three legal placements and preferred even parity/center tie-break. |
| 39 | J2 | miss | Among the highest-probability Cruiser cells, J2 is the even-parity choice. |
| 40 | H1 | miss | It appears in the most legal Cruiser placements, tied for highest probability and favored by the center/row tie-break. |
| 41 | A2 | miss | A2 lies in the most legal placements (3) for the remaining 3-cell cruiser. |
| 42 | D10 | miss | It is a highest-probability cell for the remaining Cruiser and the best even-parity central tie-break. |
| 43 | I10 | miss | Highest-probability remaining Cruiser cell, shared by multiple legal placements. |
| 44 | J8 | hit | It lies in the most legal Cruiser placements and has the preferred even parity. |
| 45 | J9 | hit | Both possible cruiser placements through J8 include J9, making it a guaranteed hit. |
| 46 | J7 | miss | Both unresolved hits J8 and J9 must belong to the remaining vertical Cruiser, so testing the upper end J7 completes it if present. |
| 47 | J10 | sunk Cruiser | J8 and J9 are vertical hits; the only legal third cell for the remaining Cruiser is J10. |

