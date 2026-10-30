# anthropic/claude-haiku-5-5

**Strategy: Parity Hunt with Run-Length Finishing**

> GOAL: sink all five ships in as few shots as possible. Coordinates: column letter A-J gives x = 0-9 (A=0, J=9), row number 1-10 gives y = row-1 (0-9). Parity of a cell = (x + y) mod 2. A1 has parity 0.
> 
> PART 1 - SEARCH (while no ship is hit, or while all known hits are sunk):
> (a) Fire only at PARITY-0 cells: A1, C1, E1, G1, I1, B2, D2, F2, H2, J2, A3, C3, E3, G3, I3, B4, D4, F4, H4, J4, A5, C5, E5, G5, I5, B6, D6, F6, H6, J6, A7, C7, E7, G7, I7, B8, D8, F8, H8, J8, A9, C9, E9, G9, I9, B10, D10, F10, H10, J10. Every ship has length 2 or more, so every ship must cover at least one parity-0 cell. This guarantees the whole fleet is found using only these 50 cells in the worst case.
> (b) Within the parity-0 set, prefer the cell that lies in the most remaining possible placements, i.e. the cell whose open horizontal and vertical runs (unknown or hit cells, bounded by misses or edges) are longest and can hold the remaining ships. Edge and corner-adjacent lanes are fine; do not waste shots on regions where no run of length 2 or more remains.
> (c) Once the parity-0 set is exhausted or only dead cells remain, switch to parity-1 cells, choosing the same way (longest open runs).
> (d) Keep a running list of which cells are miss, hit-unsunk, or sunk, and which ship lengths (5,4,3,3,2) remain. Use this list to judge whether an open run is long enough to contain a remaining ship. A run shorter than the smallest remaining ship is dead; never fire into it.
> 
> PART 2 - FOLLOW-UP (after any hit that is not a sink):
> 1. Fire at the four orthogonal neighbors of the hit (up, down, left, right), skipping cells already fired at or off the board. Prefer the direction that lies along an existing open run of the right length.
> 2. When a second hit lines up with the first, the ship's orientation is known. Fire along that line in both directions, one cell at a time, until a miss or the edge is reached on each end, or until the sink message arrives. Do not fire perpendicular once the line is established.
> 3. If the ship sinks, cross off its length and mark all its cells as sunk. Its cells do not affect other ships since ships may touch.
> 4. The sink message tells which ship sank. Use it: if the sunk ship was length 5 and the run was longer than needed, the remaining hit cells belong to other ships.
> 5. If a line ends in a miss on one side and the ship is not yet sunk, extend the other side until it is sunk. A ship of known length L that is hit at position p in a line can only occupy a window of length L containing p, so check which windows remain consistent with misses and sunk cells.
> 
> MULTIPLE OPEN HITS:
> - Resolve the open hit with the fewest consistent placements first (most constrained), usually one whose ship orientation is still unknown but whose neighbors are mostly blocked.
> - Prefer finishing a near-sunk ship (two or more hits, orientation known) before starting a new hit.
> - Two open hits that might belong to one ship: test the cells between them first; they form a line if the cells between are unknown.
> 
> FINISHING:
> - With only the destroyer (2) left, any unknown cell adjacent to an existing unsunk hit is a candidate; otherwise look for any unknown cell with an unknown orthogonal neighbor in a run of at least 2, parity no longer matters.
> - With the cruiser or submarine (3) left, parity still applies, but only runs of at least 3 need consideration.
> - Never fire at a cell that is provably unreachable by any remaining ship given the miss map and sunk cells.
> 
> DEVIATION: deviate from parity only when the parity search has no high-value cell left, or when a single hit plus a sink message leaves a clear best cell elsewhere. Always prefer information that eliminates the most candidate placements per shot.

## Board 11 · 59 shots

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | E5 | miss | Opening shot on a central parity-0 cell, where the open horizontal and vertical runs are longest and can hold the largest ships. |
| 2 | G5 | miss | Another central parity-0 cell, keeping the parity search while covering open lanes away from the E5 miss. |
| 3 | D4 | hit | Continues the parity-0 search with a central cell whose row and column runs are still fully open, away from the E5 and G5 misses. |
| 4 | D3 | miss | D4 is an unresolved hit, so I'm testing its vertical neighbour D3 to find the ship's orientation. |
| 5 | D5 | miss | D3 was a miss, so if the ship runs vertically it must extend downward from D4; D5 tests that orientation. |
| 6 | E4 | hit | D3 and D5 are misses, so the D4 hit must lie on a horizontal ship in row 4; E4 tests the east side of that line. |
| 7 | F4 | hit | D4 and E4 are hits on a horizontal line, and D3, D5, E5 and G5 are misses, so the ship extends along row 4; F4 is the east end to test. |
| 8 | G4 | hit | D4, E4 and F4 form a horizontal hit line in row 4, so I extend it east to find the other end and the ship's length. |
| 9 | C4 | sunk Carrier | D4 to G4 is a horizontal hit line, so C4 is one of its two open ends and tests whether the ship extends west. |
| 10 | F6 | miss | Parity-0 cell in the largest open area, below the sunk carrier, with open runs in both row 6 and column F. |
| 11 | E7 | miss | Parity-0 cell with the longest open runs left: all of row 7 and column E from E6 to E10 are unknown, so it can hold any remaining ship. |
| 12 | G7 | miss | Parity-0 cell with long open runs: column G from G6 to G10 and row 7 from F7 to J7 are both unknown and can hold the remaining ships. |
| 13 | D8 | miss | Parity-0 cell in the largest remaining open area: row 8 is fully unknown and column D runs from D6 to D10, so it can hold any remaining ship. |
| 14 | H6 | miss | Parity-0 cell with a fully open column H and an open run G6-J6 in row 6, so it can test any remaining ship. |
| 15 | F8 | hit | Parity-0 cell with long open runs: row 8 from E8 to J8 and column F from F7 to F10, so it can test several remaining ship placements. |
| 16 | G8 | miss | G8 is the east neighbour of the unresolved hit F8, and row 8 east of F is a long open run that can hold the remaining ships. |
| 17 | F9 | hit | F8 is an open hit; F9 tests the vertical orientation, since a horizontal ship through F8 could only be the destroyer (D8 and G8 are misses). |
| 18 | F10 | sunk Submarine | F8 and F9 form a vertical hit line, and F10 is the open cell that extends it downward, so firing there tests the ship's far end. |
| 19 | H2 | miss | Parity-0 cell at the intersection of the fully open row 2 and the open column H run H1-H5, so it can test any remaining ship. |
| 20 | I3 | miss | Parity-0 cell in fully open column I and row 3 (E3-J3), so it can test a battleship, cruiser or destroyer placement. |
| 21 | I7 | miss | Parity-0 cell in the longest open column run (I4-I10) and it splits that run evenly, so it tests many possible battleship, cruiser and destroyer placements. |
| 22 | C7 | miss | Parity-0 cell in the largest remaining open area: column C from C5 to C10 and row 7 from A7 to D7 are both unknown and can hold the battleship, cruiser or destroyer. |
| 23 | B6 | miss | Parity-0 cell in the longest open lanes: row 6 from A6 to E6 and the fully unknown column B, so it can test battleship, cruiser and destroyer placements. |
| 24 | E9 | miss | Parity-0 cell at the junction of the open row 9 run (A9-E9) and the short column E run (E8-E10), so it can test several remaining ship placements. |
| 25 | C9 | miss | Parity-0 cell at the junction of the open row-9 run A9-D9 (length 4, fits the Battleship) and the column-C run C8-C10 (length 3), so it tests several remaining placements. |
| 26 | B2 | miss | Parity-0 cell at the intersection of the open row 2 run (A2-G2) and the open column B run (B1-B5), so it can test battleship, cruiser and destroyer placements. |
| 27 | H8 | miss | Parity-0 cell where the open column H run H7-H10 and the open row 8 run H8-J8 can both hold the remaining ships. |
| 28 | I9 | miss | Parity-0 cell where the open row run G9-J9 (fits the Battleship) and the column run I8-I10 (fits a 3-length ship) both test remaining placements. |
| 29 | F2 | miss | Parity-0 cell at the junction of the open row-2 run C2-G2 (length 5) and the open column-F run F1-F3, so it tests many remaining placements. |
| 30 | G3 | miss | Parity-0 cell at the junction of the open row-3 run E3-H3 (length 4, fits the Battleship) and the column-G run G1-G3 (length 3), so it tests many remaining placements. |
| 31 | J4 | miss | Parity-0 cell on the fully open column J (length 10) that also sits in the open row-4 run H4-J4, so it tests several remaining placements. |
| 32 | A5 | miss | Parity-0 cell on the fully open column A, where it lies in the most remaining battleship, cruiser and destroyer placements, and also on the open row 5 run A5-C5. |
| 33 | B8 | miss | Parity-0 cell where column B (B7-B10, length 4) and row 8 (A8-C8, length 3) are both open, so it tests several remaining placements. |
| 34 | J6 | miss | Parity-0 cell in the longest open column run (J5-J10, length 6), so it tests many remaining Battleship, Cruiser and Destroyer placements. |
| 35 | H4 | miss | Parity-0 cell where the open column H run H1-H5 (length 5, fits the Battleship) meets the open row-4 run H4-I4, so it tests many remaining placements. |
| 36 | E1 | hit | Row 1 is fully open and E1 is a parity-0 cell that lies in the most remaining Battleship, Cruiser and Destroyer placements, with column E1-E3 also open. |
| 37 | F1 | miss | E1 is an open hit with unknown orientation, and F1 tests the long eastward row-1 run, which can hold the battleship, cruiser or destroyer. |
| 38 | E2 | miss | E1 is an open hit with unknown orientation, and E2 tests the vertical direction, where E3 is the only other open cell below it. |
| 39 | D1 | hit | E1 is an open hit, and F1 and E2 are misses, so any ship through E1 must extend west along row 1; D1 tests that line. |
| 40 | C1 | hit | D1 and E1 are both hit with F1 and E2 missed, so any ship on them most likely extends west along row 1; C1 is the next cell on that line and is also a parity-0 cell. |
| 41 | B1 | sunk Battleship | C1, D1 and E1 form a row-1 hit line bounded by the F1 miss, so B1 tests whether a Battleship covers B1-E1 and otherwise narrows the Cruiser placement. |
| 42 | H10 | miss | Parity-0 cell at the junction of the open column H run H7-H10 and the open row 10 run G10-J10, both long enough for the cruiser or destroyer. |
| 43 | A9 | miss | A9 lies in the most remaining cruiser and destroyer placements (column A run A6-A10 and row 9 run A9-B9) and is a parity-0 cell. |
| 44 | I5 | miss | I5 is a parity-0 cell where the open row run H5-J5 and the open column run I4-I6 can each hold the cruiser or destroyer, so it tests many remaining placements. |
| 45 | A3 | miss | A3 is a parity-0 cell in the open column-A run A1-A4 and the row-3 run A3-C3, so it lies in the most remaining cruiser and destroyer placements. |
| 46 | D10 | miss | D10 sits in the open row-10 run A10-E10 (length 5) and the column-D run D9-D10, so it can test both the cruiser and destroyer placements. |
| 47 | J8 | hit | J8 is an unknown parity-0 cell lying in the open column J run J7-J10 and the row-8 run I8-J8, so it fits the most remaining cruiser and destroyer placements. |
| 48 | J9 | hit | J8 is an open hit; J9 tests the vertical line below it, which is the only run long enough for a cruiser or destroyer through J8 other than the I8-J8 destroyer. |
| 49 | J10 | sunk Cruiser | J8 and J9 are open hits in column J, bounded above by the J6 miss, so J10 tests whether the ship extends downward and is also a parity-0 cell. |
| 50 | D6 | miss | D6 has three unknown orthogonal neighbours (C6, D7, E6), so it lies in more possible destroyer placements than most remaining cells. |
| 51 | I1 | miss | The destroyer is a 2-cell domino, so it must cover a parity-0 cell; I1 is one of the few unknown parity-0 cells with three open neighbours (H1, J1, I2). |
| 52 | J2 | miss | J2 borders three unknown cells (I2, J1, J3), so it lies in more possible destroyer placements than any other open cell. |
| 53 | B10 | miss | B10 lies in more remaining destroyer dominoes (B9-B10, A10-B10, B10-C10) than any other open cell, so it gives the most information toward finding the last ship. |
| 54 | B4 | miss | B4 lies in three of the remaining possible destroyer dominoes (with B3, A4, B5), tied for the most, so it gives the best chance of a hit. |
| 55 | A7 | miss | A7 lies in three of the remaining possible destroyer dominoes (A6-A7, A7-B7, A7-A8), more than any other unknown cell, so it has the best chance of a hit. |
| 56 | G9 | miss | G9 lies in two of the remaining possible destroyer dominoes (G9-H9 and G9-G10), tied for the most of any unknown cell, and is a parity-0 cell. |
| 57 | C3 | hit | Only nine two-cell domino placements remain, and C3 lies in two of them (C2-C3 and B3-C3), tied for the most of any unknown cell. |
| 58 | C2 | miss | The destroyer must be C2-C3 or B3-C3, and C2 is one of only two remaining candidate cells, so firing it either hits or leaves B3 as the answer. |
| 59 | B3 | sunk Destroyer | C3 is the only open hit, and its only remaining unknown orthogonal neighbour is B3, so the destroyer must be B3-C3. |

## Board 23 · 47 shots

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | E5 | miss | E5 is a parity-0 cell near the centre, where the most ship placements pass through it. |
| 2 | F6 | miss | Parity-0 cell near the centre, lying in many possible ship placements and not yet fired at. |
| 3 | D4 | miss | D4 is an unfired parity-0 cell with long open horizontal and vertical runs, so it lies in many remaining ship placements. |
| 4 | G3 | hit | G3 is an unfired parity-0 cell whose row 3 and column G are fully open, so it lies on many remaining ship placements. |
| 5 | G4 | hit | Follow up the unsunk hit at G3 by testing a neighbour; G4 lies on the open vertical line through G3. |
| 6 | G5 | hit | G3 and G4 are both hits, so the ship is likely vertical; G5 extends the line downward. |
| 7 | G6 | hit | G3, G4 and G5 form a vertical line, so I extend it downward; G6 is open and the run below (G6 to G10) is long enough for the larger ships. |
| 8 | G7 | sunk Carrier | G3-G6 is a vertical line of four unsunk hits, and G7 extends it into the longer open run below. |
| 9 | D8 | miss | Row 8 is fully open and column D has a long open run below D4, so D8 lies in many remaining placements of the battleship, cruiser, submarine and destroyer. |
| 10 | C5 | miss | C5 is an unfired parity-0 cell with long open runs in row 5 (A5-D5) and column C, so it lies on many remaining placements. |
| 11 | H2 | miss | H2 is a parity-0 cell in fully open row 2 and fully open column H, so it lies on many remaining placements of the battleship, cruiser, submarine and destroyer. |
| 12 | H8 | miss | H8 is an unfired parity-0 cell on the long open column H run (H3-H10) and the open row 8 run (E8-J8), so it lies on many remaining placements. |
| 13 | B6 | miss | Column B is fully open and row 6 has a run of five (A6-E6), so B6 lies on many remaining placements of the 4, 3, 3 and 2 ships. |
| 14 | I5 | miss | Parity-0 cell with a full-length open column I (10 cells) and a 3-cell row run, so it lies on many remaining placements of the 4, 3, 3 and 2 ships. |
| 15 | F2 | miss | Parity-0 cell with long open runs in both row 2 (A2-G2) and column F (F1-F5), so it lies on many remaining placements of the 4, 3, 3 and 2 ships. |
| 16 | E3 | miss | E3 is a parity-0 cell with long open runs in row 3 (A3-F3) and column E (E1-E4), so it lies on many remaining placements. |
| 17 | E7 | miss | E7 is an unfired parity-0 cell on a 6-cell open row run (A7-F7) and a 5-cell open column run (E6-E10), so it lies on many remaining placements. |
| 18 | C7 | miss | Parity-0 cell with long open runs in column C (C6-C10) and row 7 (A7-D7), so it lies on many remaining placements of the 4, 3, 3 and 2 ships. |
| 19 | F8 | miss | F8 is an unfired parity-0 cell on the open column F run F7-F10 and the row 8 run E8-G8, so it lies on many remaining placements. |
| 20 | H6 | miss | H6 sits in the long open column H run (H3-H7) and the open row 6 run (H6-J6), so it lies on many remaining placements while staying on parity 0. |
| 21 | I9 | miss | Parity-0 cell on the open row 9 (full length) and the open column I run I6-I10, so it lies on many remaining placements of the 4, 3, 3 and 2 ships. |
| 22 | A9 | miss | Parity-0 cell on the fully open column A (10 cells) and the long open row 9 run A9-H9, so it lies on many remaining placements. |
| 23 | A1 | miss | A1 is a parity-0 cell on the fully open row 1 (10 cells) and the long open column A run (A1-A8), so it lies on many remaining placements. |
| 24 | J4 | miss | Parity-0 cell on the fully open column J (10 cells), so it lies on many placements of the remaining 4, 3, 3 and 2 ships. |
| 25 | C3 | miss | C3 is a parity-0 cell at the junction of open row 3 (A3-D3) and open column C (C1-C4), so it lies on many remaining placements of the 4, 3, 3 and 2 ships. |
| 26 | B2 | miss | B2 is an unfired parity-0 cell where column B (B1-B5) and row 2 (A2-E2) both offer open runs of length 5, so it lies on many remaining placements of the 4, 3, 3 and 2 ships. |
| 27 | E9 | hit | E9 is an unfired parity-0 cell on the long open row 9 run (B9-H9) and the open column E run E8-E10, so it lies on many remaining placements. |
| 28 | F9 | hit | E9 is an unresolved hit, and its horizontal run B9-H9 is the longest open line through it, so F9 tests the most likely ship orientation. |
| 29 | D9 | miss | E9 and F9 form a horizontal pair, so I test the open cell D9 on the left end of that line. |
| 30 | G9 | hit | E9 and F9 are hits on a horizontal line, and D9 is a miss, so the ship must extend to the right through G9. |
| 31 | H9 | sunk Battleship | E9, F9 and G9 are hit on row 9 with D9 and I9 already missed, so H9 is the only open cell that would extend the line and tell me whether this is a 4-long ship. |
| 32 | I3 | miss | I3 lies on the open column I run I1-I4 and the open row 3 run H3-J3, so it sits in several remaining 3-cell placements while staying on parity 0. |
| 33 | A5 | miss | A5 sits in the longest open run left on the board (column A, A2-A8), so it lies in the most remaining 3-cell placements while staying on parity 0. |
| 34 | B8 | miss | B8 is an unfired parity-0 cell on the open column B run (B7-B10) and the open row 8 run (A8-C8), so it lies on several remaining 3- and 2-cell placements. |
| 35 | J8 | hit | J8 sits on the long open column J run (J5-J10) and the I8-J8 pair, so it lies in the most remaining 3-cell and 2-cell placements while staying on parity 0. |
| 36 | J9 | hit | J8 is a hit with horizontal room limited to I8-J8, so the ship is most likely vertical; J9 tests the downward direction and sits in the open J5-J10 run. |
| 37 | J10 | sunk Cruiser | J8 and J9 are hits, and a vertical line downward is the likely orientation; J10 tests whether the ship extends to the bottom edge. |
| 38 | F10 | miss | Parity-0 cell on the longest open run left (row 10, A10-I10), where the submarine or destroyer can fit in several placements. |
| 39 | D6 | miss | D6 is an unfired parity-0 cell on open runs of three both vertically (D5-D7) and horizontally (C6-E6), so it lies in the most remaining submarine and destroyer placements. |
| 40 | E1 | miss | E1 is an unfired parity-0 cell on the long open row 1 run (B1-J1) and the open column E run E1-E2, so it lies in the most remaining 3- and 2-cell placements. |
| 41 | D2 | hit | D2 is an unfired parity-0 cell in the open row 2 run (C2-E2) and column D run (D1-D3), so it lies in the most remaining submarine and destroyer placements. |
| 42 | D3 | miss | D2 is an unresolved hit, and D3 is one of its open neighbours; a hit there would fix the vertical orientation. |
| 43 | E2 | hit | D2 is an unresolved hit, and E2 tests the horizontal line since E1 and E3 are misses, so a hit there would confirm the orientation. |
| 44 | C2 | sunk Submarine | D2 and E2 form a horizontal pair that cannot be a destroyer (it would already be sunk), so the submarine must be C2-D2-E2 and C2 is a certain hit. |
| 45 | B4 | miss | B4 has four unknown neighbours (A4, B3, B5, C4), so it lies in more remaining destroyer placements than any other parity-0 cell. |
| 46 | I7 | hit | Only the Destroyer (length 2) remains, and I7 has four unknown orthogonal neighbours, so it lies in more possible destroyer placements than most other cells. |
| 47 | I6 | sunk Destroyer | The destroyer must cover I7 with one orthogonal neighbour, and I6 is an unknown neighbour of the open hit. |

## Board 37 · 49 shots

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | E5 | hit | Opens the search on a parity-0 cell near the centre, which lies on the most possible ship placements. |
| 2 | F5 | miss | Follow up the unsunk hit at E5 by testing an orthogonal neighbor to establish the ship's orientation. |
| 3 | E6 | miss | E5 is an unsunk hit and F5 is a miss, so I test the vertical neighbour E6 to find the ship's orientation. |
| 4 | E4 | hit | E5 is an unsunk hit with misses at F5 and E6, so the ship must run horizontally through D5 or vertically through E4; testing E4 checks the vertical option. |
| 5 | E3 | sunk Cruiser | E4 and E5 form a vertical pair with E6 and F5 missed, so E3 tests whether the ship extends upward while staying on a parity-0 cell. |
| 6 | G3 | miss | Parity-0 cell with long open runs in both row 3 (F3-J3) and the fully open column G, so it can hold several remaining ships. |
| 7 | G7 | miss | G7 is a parity-0 cell with long open runs both across row 7 (10 cells) and down column G (G4-G10), so it lies on many remaining placements. |
| 8 | D6 | miss | D6 is a parity-0 cell on the fully open column D (10 cells) and the open row-6 run A6-D6, so it lies on many remaining placements. |
| 9 | H6 | miss | H6 is a parity-0 cell on the fully open column H and the open row-6 run F6-J6, so it lies on many remaining placements. |
| 10 | F8 | miss | F8 is a parity-0 cell on the fully open row 8 and the open column F run F6-F10, so it lies on many remaining placements. |
| 11 | H4 | miss | H4 is a parity-0 cell on open row 4 (F4-J4) and open column H (H1-H5), so it lies on many remaining placements for the larger ships. |
| 12 | C7 | miss | Parity-0 cell on the fully open column C and the long open row-7 run A7-F7, so it lies on many remaining placements. |
| 13 | B8 | miss | B8 is a parity-0 cell on the fully open column B and the open row-8 run A8-E8, so it lies on many remaining placements. |
| 14 | I5 | miss | I5 is a parity-0 cell on the fully open column I and the open row-5 run G5-J5, so it can hold several remaining ships. |
| 15 | D4 | miss | D4 is a parity-0 cell on the open column D run D1-D5 and the open row-4 run A4-D4, so it can hold several remaining ships. |
| 16 | B2 | hit | B2 is a parity-0 cell on the open row 2 and the long open column B run (B1-B7), so it lies on many remaining placements for the larger ships. |
| 17 | B3 | miss | B2 is an unresolved hit, so I test its orthogonal neighbour B3 to establish whether the ship runs vertically down column B. |
| 18 | C2 | hit | B3 was a miss, so the B2 hit must lie horizontally in row 2 or be part of a B1-B2 destroyer; C2 tests the horizontal option toward the open side of the board. |
| 19 | D2 | hit | B2 and C2 are an unsunk horizontal pair, so extending the line to D2 tests the most likely continuation of that ship. |
| 20 | E2 | hit | B2, C2 and D2 form an unsunk horizontal line, so extending it to E2 tests the open side with the most room for a 3-5 cell ship. |
| 21 | F2 | miss | B2-E2 is an unsunk horizontal line, and F2 is the open end that can extend it toward a 4- or 5-cell ship. |
| 22 | A2 | sunk Carrier | B2-E2 is an unsunk horizontal line blocked at F2, so A2 is the only remaining extension and would confirm a 5-cell Carrier or leave the Battleship as B2-E2. |
| 23 | H8 | miss | H8 is a parity-0 cell on the open column H run H7-H10 and the open row-8 run G8-J8, so it lies in many remaining placements for the 4, 3, 3 and 2 ships. |
| 24 | E9 | miss | E9 is a parity-0 cell on the fully open row 9 and the open column E run E7-E10, so it can hold the battleship or submarine. |
| 25 | J2 | hit | J2 is a parity-0 cell on the fully open column J and the open row-2 run G2-J2, so it can hold several remaining ships. |
| 26 | I2 | miss | J2 is an unresolved hit; I2 is its horizontal neighbour, and firing there tests the row-2 orientation (G2-J2 is the only open horizontal run) while also being a cheap check against vertical placements. |
| 27 | J3 | sunk Destroyer | J2 is an unresolved hit with I2 missed, so the ship must run vertically in column J; J3 tests the downward direction and splits the candidate placements. |
| 28 | J6 | miss | J6 is a parity-0 cell on the long open column J run (J4-J10) and lies in about six possible placements for the Battleship and Submarine. |
| 29 | D10 | miss | D10 sits on the fully open row 10 and the open column D run D7-D10, so it lies on many placements for the remaining Battleship and Submarine. |
| 30 | A5 | hit | A5 is a parity-0 cell on the long open column A run (A3-A10) and the open row-5 run A5-D5, so it lies in the most remaining Battleship and Submarine placements. |
| 31 | A6 | hit | A5 is an unresolved hit, and A6 tests the vertical orientation in column A, which holds most of the remaining placements for the Battleship and Submarine. |
| 32 | A7 | miss | A5 and A6 are unsunk hits that most likely form a vertical ship in column A, so A7 tests the downward extension and leaves the 4- and 3-cell placements to be resolved. |
| 33 | A4 | hit | A5 and A6 form an unsunk vertical pair with A7 missed and A2 taken by the Carrier, so the ship must extend up through A4 whether it is the Battleship or Submarine. |
| 34 | A3 | sunk Battleship | A4-A6 is an unsunk vertical hit line blocked at A7, so the ship is either A3-A6 (Battleship) or A4-A6 (Submarine); A3 resolves which and sinks it either way. |
| 35 | I9 | miss | I9 is a parity-0 cell lying in about four remaining 3-cell placements (row 9 G-I and H-J, column I I7-I9 and I8-I10), the most of any parity-0 cell. |
| 36 | G10 | miss | G10 lies in the most remaining 3-cell submarine placements (row 10 E-G, F-H, G-I and column G G8-G10), so it is the highest-information shot. |
| 37 | H1 | miss | H1 lies in the most remaining 3-cell submarine placements (4 of the 29 open ones), so it is the highest-information shot. |
| 38 | C9 | miss | C9 lies in the most remaining submarine placements (3 of about 25), so it gives the most information for one shot. |
| 39 | C5 | miss | Only 22 submarine placements remain, and C5 lies in the most of them (3), so it gives the best chance of a hit. |
| 40 | D1 | miss | D1 lies in three of the remaining submarine placements, the most of any unknown cell, so it gives the best chance of a hit. |
| 41 | D8 | miss | Only 16 three-cell submarine placements remain, and D8 lies in two of them (C8-E8 and D7-D9), tied for the most of any unknown cell. |
| 42 | B6 | miss | B6 lies in two of the 14 remaining submarine placements (B4-B6 and B5-B7), tied for the highest count of any unknown cell. |
| 43 | I7 | miss | I7 lies in two of the 12 remaining submarine placements (I6-I8 and H7-J7), tied for the highest count, and it splits the candidates across different areas. |
| 44 | J9 | miss | J9 lies in two of the nine remaining submarine placements (J7-J9 and J8-J10), tied for the highest count of any unknown cell. |
| 45 | A10 | miss | Only 8 submarine placements remain, and A10 lies in two of them (A10-C10 and A8-A10), more than any other unknown cell. |
| 46 | G5 | miss | Only six 3-cell submarine placements remain, each unknown cell lies in exactly one, and G5 sits in the vertical G4-G6 run, so this shot is as informative as any other. |
| 47 | F9 | hit | Only five 3-cell submarine placements remain (A1-C1, E1-G1, D7-F7, F9-H9, H10-J10), each cell belongs to exactly one, so any shot is equally informative; F9 sits in F9-H9. |
| 48 | G9 | hit | F9 is the only hit left, and the only possible submarine placement through it is F9-G9-H9, so G9 is a sure-fire next shot. |
| 49 | H9 | sunk Submarine | The submarine is the only ship left, and with E9 already missed, the only 3-cell placement through the F9 and G9 hits is F9-G9-H9. |

