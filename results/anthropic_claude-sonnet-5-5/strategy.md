# anthropic/claude-sonnet-5-5

**Strategy: Parity Density Hunter**

> Core idea: always fire the cell that fits the most possible placements of the ships still afloat, while never shooting cells that cannot matter. Track the remaining ships (5,4,3,3,2) after every shot.
> 
> PART 1: SEARCH (no open hits)
> 1. Use parity based on the shortest remaining ship L.
>  - If the Destroyer (2) is afloat: shoot only cells where (column number + row number) is even (A=1 ... J=10). This is a checkerboard, and every ship of length 2 or more must cover at least one such cell.
>  - If the Destroyer is sunk and the shortest remaining ship is 3: shoot only cells where (col + row) mod 3 equals one fixed residue. Every straight line of 3 or more cells contains one cell of each residue. Choose the residue that has the most unshot, still-possible cells, and stay on it.
>  - If only the 4 and/or 5 remain: use mod 4 the same way.
>  - If the parity cells run out in an area, fall back to any cell that can still hold a ship.
> 2. Within the parity class, prefer high-density cells. Roughly estimate how many placements of the remaining ships pass through each cell. Central cells score higher than edges and corners. Cells inside large open areas score higher than cells boxed in by misses, edges, or sunk ships. A cell between misses where no remaining ship fits is worthless, so skip it.
> 3. Open with the center region (E5, F6, E7, F4 and similar parity cells). Then spread out so that each shot covers new territory, for example with diagonal sweeps. Do not shoot cells right next to earlier misses when a far, open cell is available.
> 4. Corners and edge cells are the lowest priority. Visit them last, because they hold the fewest placements.
> 
> PART 2: TARGETING (at least one open hit)
> An open hit is a hit that is not yet explained by a sunk ship. Finish all open hits before returning to search.
> 1. Single open hit: shoot an orthogonal neighbor. Pick the neighbor with the most room, meaning the longest free stretch in that line, and favor the direction that leads toward the open center. Skip neighbors off the board or already shot. Skip a direction if the free stretch through the hit is shorter than the smallest remaining ship. Use all four neighbors if needed.
> 2. Two or more collinear adjacent hits: the orientation is known. Extend along the line, at the end with more free space first, then the other end. Continue until the ship sinks or both ends are blocked by a miss or the edge. Do not fire perpendicular to a confirmed line, because that wastes shots.
> 3. If a line is blocked at both ends and the ship is not sunk, the hits belong to more than one ship. Look at the neighbors perpendicular to the line next, starting with the hits at the ends of the segment.
> 4. Segment length check: if a run of hits is longer than the longest remaining ship, it is two ships side by side. Probe perpendicular around it.
> 5. On a sink message, remove that ship from the remaining list. Assign it to the straight run of hits that includes the sinking shot and has exactly that length. Any hits left over stay open, and you continue targeting them. Prefer the assignment that leaves the leftover hits most easily explained. Mark the neighbors of a sunk ship as ordinary unknown cells, since ships may touch.
> 6. When there are several open hits, work first on the one with the strongest information, meaning two or more aligned hits. Then take the cell that can complete or extend multiple hits at once. For example, a cell adjacent to two separate open hits gets priority.
> 7. Targeting shots count as hits or misses for density estimates. After all open hits are resolved, return to search with the updated remaining-ship list and parity.
> 
> OTHER RULES
> - Never fire a cell already shot.
> - Parity is a guide, not a cage. In targeting mode, ignore it completely.
> - Late game: when few ships remain, enumerate the placements that fit the unknown cells and shoot the cell that appears in the most placements. If the remaining ships are only the Destroyer and one other, switch back to a checkerboard on the unexplored area.
> - Keep a written count of the remaining ships so the parity step is updated immediately after every sink.

## Board 11 · 44 shots

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | E5 | miss | Opening with a central cell on the even-parity checkerboard (E=5, row 5, sum 10), where the most ship placements overlap. |
| 2 | F6 | miss | Even-parity central cell diagonal to the E5 miss, covering new territory with high placement density. |
| 3 | F4 | hit | Even-parity central cell (F=6, row 4) in open territory, away from the E5 and F6 misses. |
| 4 | G4 | hit | Extend the F4 hit horizontally toward the open side where the most placements fit. |
| 5 | E4 | hit | F4 and G4 are two adjacent hits in a row, so the ship runs horizontally; E4 extends the line toward the side with more free space. |
| 6 | D4 | hit | E4-F4-G4 is a horizontal run, so I extend it at the end with more free space (columns A-D on the left, only H-J on the right). |
| 7 | H4 | miss | The D4-G4 run is four hits long, so it may be the Battleship or the Carrier needing one more cell. I'm extending at the right end; C4 would be equally good since both ends have three free cells. |
| 8 | C4 | sunk Carrier | D4-G4 is four hits with no sink message and H4 is a miss, so the run is probably the Carrier and needs C4 to finish. |
| 9 | E7 | miss | Even-parity cell in the large open lower-center area, away from the earlier misses and the sunk Carrier. |
| 10 | G7 | miss | Even-parity cell (7+7=14) in the large open lower-right area, away from the earlier misses, with room for horizontal and vertical placements. |
| 11 | D8 | miss | Even-parity cell in the large open lower-left area, with room for both horizontal and vertical placements of the remaining ships. |
| 12 | D6 | miss | Even-parity cell in the large open lower-left area, with room for both horizontal and vertical placements of the remaining ships. |
| 13 | H6 | miss | Even-parity cell in the open lower-right area with room for both horizontal and vertical placements of the remaining ships. |
| 14 | F8 | hit | F8 is an even-parity cell in the open lower-middle area, with room for both horizontal and vertical placements of the remaining ships. |
| 15 | G8 | miss | F8 is an open hit, and G8 has the most ship placements through F8 because the row extends right to J8 while E8 is boxed in by the D8 miss. |
| 16 | F9 | hit | F8 is boxed in by misses at G8, F6, E7 and G7, so the longest free line through it runs down column F, and F9 fits the most remaining ship placements. |
| 17 | F7 | miss | F8 and F9 are two adjacent hits in column F, so the ship is vertical, and F7 extends that line upward toward the free cells. |
| 18 | F10 | sunk Submarine | F8 and F9 are adjacent hits in column F with F7 a miss, so the only way to extend the line is downward to F10. |
| 19 | I5 | miss | Even-parity cell with open lines both along row 5 (F5-J5) and down column I, so it fits the most placements of the remaining Battleship, Cruiser and Destroyer. |
| 20 | E3 | miss | Even-parity cell in the large open top area, where the Battleship, Cruiser and Destroyer all have many horizontal placements through it. |
| 21 | C7 | miss | Even-parity cell in the open lower-left area, where the Battleship, Cruiser and Destroyer all have many horizontal and vertical placements. |
| 22 | F2 | miss | Even-parity cell in the large open top area, where the Battleship, Cruiser and Destroyer all have many horizontal placements through row 2. |
| 23 | I3 | miss | Even-parity cell in the open top-right area with room for horizontal (F3-J3) and vertical (I1-I4) placements of the Battleship, Cruiser and Destroyer. |
| 24 | I9 | miss | Even-parity cell in the open lower-right area, where a horizontal run (G9-J9) and a vertical run (I6-I10) both fit the Battleship, Cruiser and Destroyer. |
| 25 | B2 | miss | Column B is fully open and row 2 has a free A-E stretch, so B2 is an even-parity cell that fits the most Battleship, Cruiser and Destroyer placements. |
| 26 | B6 | miss | B6 is an even-parity cell in the open left area, with a long free stretch down column B and a row A6-C6, so it fits the most Battleship, Cruiser and Destroyer placements. |
| 27 | G1 | miss | Row 1 is a fully open 10-cell stretch, so G1 fits the most Battleship, Cruiser and Destroyer placements, both along the row and down column G. |
| 28 | C9 | miss | C9 is an even-parity cell in the open lower-left block, where the Battleship, Cruiser and Destroyer have the most remaining placements, both along row 9 and down column C. |
| 29 | J8 | hit | J8 is an even-parity cell in the open right-hand column, with many Battleship, Cruiser and Destroyer placements both down column J and along row 8 (H8-J8). |
| 30 | J7 | miss | J7 extends the open J8 hit up column J, where the most Battleship, Cruiser and Destroyer placements fit, more than J9 or I8. |
| 31 | I8 | miss | J8 is an open hit with J7 a miss, so the ship runs either left along row 8 (H8-J8) or down column J; I8 fits as many placements as J9 and I'll check the other next. |
| 32 | J9 | hit | J8 is an open hit with J7 and I8 both misses, so the ship can only continue down column J through J9. |
| 33 | J10 | sunk Cruiser | J8 and J9 are two vertical hits with J7 a miss and no sink message, so the ship must continue down to J10. |
| 34 | A5 | miss | Only the Battleship (4) and Destroyer (2) remain; column A is a fully open 10-cell stretch, and A5 also lies on the open A5-D5 row, so it fits the most Battleship placements. |
| 35 | J4 | miss | Column J has a long open stretch (J1-J6), and J4 fits the most Battleship and Destroyer placements among the cells that can still hold a ship. |
| 36 | D1 | hit | With only the Battleship and Destroyer left, D1 sits on three of the possible Battleship placements in row 1 (A1-D1, B1-E1, C1-F1), tied for the most of any open cell, and also fits several Destroyer spots. |
| 37 | C1 | hit | D1 is an open hit and vertical Battleship placements are impossible there, so C1 lies on the most remaining placements (Battleship A1-D1, B1-E1, C1-F1 and Destroyer C1-D1). |
| 38 | B1 | hit | C1 and D1 must lie in row 1 (column placements are blocked by the sunk Carrier at C4/D4), so B1 sits on two of the three Battleship placements and is tied with E1 for the most. |
| 39 | E1 | sunk Battleship | B1-C1-D1 must be part of a Battleship in row 1 (A1-D1, B1-E1, or C1-F1 with a Destroyer at A1-B1), and E1 lies on two of those three options. |
| 40 | B8 | miss | Only the Destroyer remains, and B8 has four open neighbors (A8, C8, B7, B9), so it lies on the most possible Destroyer placements. |
| 41 | C3 | hit | Only the Destroyer remains, and C3 has three open neighbors (B3, D3, C2), so it lies on as many possible placements as any open cell. |
| 42 | D3 | miss | C3 is the last open hit and only the Destroyer remains, so its partner cell is B3, D3 or C2 with equal odds; D3 is as good as any. |
| 43 | C2 | miss | Only the Destroyer remains and C3 is the open hit; D3 is a miss and C4 is part of a sunk ship, so the partner cell is C2 or B3, and I'm picking C2. |
| 44 | B3 | sunk Destroyer | Only the Destroyer remains, and C3's other neighbors (C2, D3, C4) are misses or sunk, so B3 must be its partner cell. |

## Board 23 · 55 shots

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | E5 | miss | Opening with a central cell on the even-parity checkerboard (col 5 + row 5 = 10), where the most ship placements pass through. |
| 2 | F6 | miss | Central even-parity cell (6+6=12) diagonal to the E5 miss, covering new central territory. |
| 3 | F4 | miss | Central even-parity cell in open territory, covering new ground away from the E5 and F6 misses. |
| 4 | G7 | hit | Even-parity cell (7+7=14) in open territory, away from the three central misses, to cover new ground. |
| 5 | H7 | miss | H7 is a neighbor of the open hit at G7 with a long open stretch along row 7, and it is not boxed in by the nearby misses. |
| 6 | G8 | miss | G7 is the only open hit and H7 is a miss, so I probe the vertical line through G7, which has the most free room. G8 sits in more open territory than G6, which is next to the F6 miss. |
| 7 | G6 | hit | G7 is the only open hit with H7 and G8 already misses, so the ship must extend up through G6 or left through F7, and G6 has a long free stretch above it. |
| 8 | G5 | hit | G6 and G7 are two vertical hits with G8 a miss below, so the ship must extend upward through G5. |
| 9 | G4 | hit | Three vertical hits G5-G7 with G8 a miss, so the line must extend upward through G4. |
| 10 | G3 | sunk Carrier | Four vertical hits G4-G7 are not sunk and G8 is a miss, so the ship must extend upward through G3 (likely the Carrier). |
| 11 | D6 | miss | Even-parity cell in the large open left side, with long free stretches along both row 6 and column D, which gives the most placements for the remaining 4, 3, 3 and 2 ships. |
| 12 | D4 | miss | Even-parity cell in the large open upper-left area with long free stretches along both row 4 and column D, which fits the most placements for the remaining 4, 3, 3 and 2 ships. |
| 13 | E7 | miss | Even-parity cell in the large open lower-left region with long free runs along row 7 (A-F) and column E (6-10), fitting many placements of the 4, 3, 3 and 2 ships. |
| 14 | C3 | miss | Even-parity cell with long open runs along row 3 (A-F) and column C, so it fits many placements of the remaining 4, 3, 3 and 2 ships. |
| 15 | D8 | miss | Even-parity cell in the open lower-left area, with a 6-cell free run along row 8 and a 4-cell run down column D, so it fits many placements of the 4, 3, 3 and 2 ships. |
| 16 | I5 | miss | Even-parity cell in the large open right side, with a full 10-cell free run down column I and a 3-cell run along row 5, so it fits many placements of the 4, 3, 3 and 2 ships. |
| 17 | H2 | miss | Even-parity cell with a fully open row 2 and a 6-cell free run down column H, so it fits many placements of the remaining 4, 3, 3 and 2 ships. |
| 18 | E9 | hit | Even-parity cell with a fully open row 9 and a 3-cell run down column E, so it fits many placements of the remaining 4, 3, 3 and 2 ships. |
| 19 | F9 | hit | E9 is the only open hit, and row 9 is fully open, so I probe the neighbor F9 on the side with the most free room. |
| 20 | G9 | hit | E9 and F9 are two adjacent hits in row 9, so I extend along the row; G9 is as open as D9, and I picked it. |
| 21 | H9 | sunk Battleship | E9, F9 and G9 form a horizontal line, so I extend it at the right end (H9) to see whether it is a 4-ship or a 3-ship that sinks. |
| 22 | C5 | miss | Even-parity cell in the large open left region, with a 4-cell run along row 5 and a 7-cell run down column C, so it fits many placements of the 3, 3 and 2 ships. |
| 23 | D2 | hit | Even-parity cell in the open upper-left area with a 7-cell free run along row 2, so it fits many placements of the Cruiser, Submarine and Destroyer. |
| 24 | E2 | hit | D2 is the only open hit, and row 2 gives it the longest free stretch (A2-G2), so I probe the neighbor E2 on the side toward the open center. |
| 25 | F2 | miss | D2 and E2 are two adjacent hits in row 2, so I extend the line at the right end (F2), which is open to G2, and C2 remains for the other end. |
| 26 | C2 | sunk Submarine | D2 and E2 are adjacent hits in row 2 with F2 a miss, so the line can only extend left through C2. |
| 27 | B8 | miss | Only the Cruiser and Destroyer remain, so I take an even-parity cell in the large open left region, where column B is fully open and row 8 has a 3-cell run. |
| 28 | I3 | miss | Only the Cruiser and Destroyer remain, and I3 lies on the open right side where it fits about 7 placements (row 3 run H3-J3 and column I1-I4), the most of the cells I counted. |
| 29 | C7 | miss | Only the Cruiser and Destroyer remain, and C7 lies on open runs in both row 7 (A7-D7) and column C (C6-C10), which fits about as many placements as any other cell. |
| 30 | I8 | miss | Only the Cruiser and Destroyer remain, and I8 lies on open runs in column I (rows 6-10) and row 8 (H8-J8). By my count it fits the most placements of the two ships. |
| 31 | B4 | miss | Only the Cruiser and Destroyer remain, and B4 sits on the most open runs (column B rows 1-7 and row 4 A-C), so it fits the most remaining placements. |
| 32 | J4 | miss | Only the Cruiser and Destroyer remain; J4 lies on the open J column and the H4-J4 run, which gives it about the most placements (tied with a few other cells) by my count. |
| 33 | C9 | miss | Only the Cruiser and Destroyer remain, and by my placement count C9 fits as many of their placements as any open cell (tied at about 7), through the open runs along row 9 (A-D) and column C (8-10). |
| 34 | A6 | miss | Only the Cruiser and Destroyer remain, and A6 fits the most of their placements by my count (about 7), through column A and the A6-C6 run in row 6. |
| 35 | J7 | miss | Only the Cruiser and Destroyer remain, and by my count J7 fits about 6 of their placements (vertical runs in column J plus the I7-J7 run), tied for the most of any open cell. |
| 36 | A3 | miss | Only the Cruiser and Destroyer remain, and by my count A3 lies on the most of their possible placements (three vertical Cruiser spots in column A plus several Destroyer spots). |
| 37 | G1 | miss | Only the Cruiser and Destroyer remain, and by my placement count G1 fits as many of their placements as any open cell (about 6, tied with B1 and D10). |
| 38 | D10 | miss | Only the Cruiser and Destroyer remain, and D10 fits about as many of their placements as any open cell (three Cruiser spots in row 10 plus three Destroyer spots). |
| 39 | H4 | miss | H4 fits the most remaining Cruiser and Destroyer placements by my count (two vertical Cruiser spots plus three Destroyer spots), tied with several other cells. |
| 40 | B1 | miss | By my count of remaining Cruiser and Destroyer placements, B1 fits the most (3 Cruiser plus 3 Destroyer, about 6). |
| 41 | H10 | miss | Only the Cruiser and Destroyer remain; by my placement count H10 fits about 5 of their placements (3 Cruiser spots plus 2 Destroyer spots), tied for the most of any open cell. |
| 42 | A9 | miss | Only the Cruiser and Destroyer remain, and by my placement count A9 lies on the most of their possible placements (about 5), more than any other open cell. |
| 43 | I6 | hit | Only the Cruiser and Destroyer remain, and I6 lies on about as many of their possible placements as any open cell (the H6-J6 Cruiser spot plus three Destroyer spots), tied with several others. |
| 44 | J6 | miss | I6 is the only open hit; I5 and I8 are misses, so the ship runs horizontally (H6-I6-J6 for the Cruiser, or a Destroyer pair) or is the Destroyer at I6-I7. J6 and H6 each fit two of these placements, I7 fits only one. |
| 45 | H6 | miss | I6 can only be the Destroyer, either H6-I6 or I6-I7, since I5, I8 and J6 are misses and G6 is a sunk ship. H6 and I7 are equally likely, so I'll try H6 first. |
| 46 | I7 | sunk Destroyer | I6 is the only open hit, and I5, H6 and J6 are all misses, so the Destroyer must be I6-I7. |
| 47 | D1 | miss | Only the Cruiser remains; D1 lies on two of the nine possible 3-cell placements (C1-E1 and D1-F1), tied with E1 for the most. |
| 48 | J1 | miss | Only the Cruiser remains, and J1 lies on two of the seven possible 3-cell placements (H1-J1 and J1-J3), more than any other open cell. |
| 49 | D3 | miss | Only five Cruiser placements remain (D3-F3, A10-C10, E10-G10, B5-B7, J8-J10), all equally likely, so I'll start with D3. |
| 50 | B6 | miss | Only four Cruiser placements remain (A10-C10, E10-G10, B5-B7, J8-J10), so I shoot the middle cell of one of them. |
| 51 | B10 | miss | Only three Cruiser placements remain (A10-C10, E10-G10, J8-J10), so I shoot the middle cell of one of them. |
| 52 | F10 | miss | Only two Cruiser placements remain (E10-G10 and J8-J10), so I shoot the middle cell of one of them. |
| 53 | J9 | hit | J8-J10 is the only remaining straight run of three unknown cells, so the Cruiser must be there and J9 is its middle. |
| 54 | J8 | hit | The Cruiser must occupy J8-J10, the only remaining run of three cells through the J9 hit, so J8 is a sure hit. |
| 55 | J10 | sunk Cruiser | J8 and J9 are hits, J7 is a miss, so the Cruiser must end at J10. |

## Board 37 · 52 shots

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | E5 | hit | Opening with a central cell on the even-parity checkerboard (col 5 + row 5 = 10), where the most ship placements overlap. |
| 2 | F5 | miss | Single open hit at E5; probe an orthogonal neighbor with plenty of free room toward the open center. |
| 3 | E6 | miss | Single open hit at E5 with F5 a miss; probe the vertical neighbor with the longest free stretch (toward the open lower center). |
| 4 | E4 | hit | Single open hit at E5 with F5 and E6 misses; probe the upward neighbor, which has a long free stretch. |
| 5 | E3 | sunk Cruiser | E4 and E5 are collinear vertical hits and E6 is a miss, so the ship must extend upward through E3. |
| 6 | G7 | miss | Searching with the Destroyer still afloat, I use even parity (7+7=14) and pick G7, an open central cell away from the earlier shots. |
| 7 | H4 | miss | Even-parity cell (8+4) in the large open upper-right area, away from earlier shots and misses. |
| 8 | F8 | miss | Even-parity cell (6+8) in the large open lower-center area, away from earlier shots and misses, while the Destroyer is still afloat. |
| 9 | G3 | miss | Even-parity cell in the large open upper-right area, with long free stretches both across row 3 and down column G, away from earlier misses. |
| 10 | C7 | miss | Even-parity cell (3+7) in the large open lower-left area, far from earlier misses, with long free stretches in both directions. |
| 11 | D8 | miss | Even-parity cell with long open stretches along column D and row 8, covering the unexplored lower-left while the Destroyer is still afloat. |
| 12 | H6 | miss | Even-parity cell in the large open right-center area with long free stretches along row 6 and column H, while the Destroyer is still afloat. |
| 13 | D2 | hit | Even-parity cell in the large open upper-left area with a full open row 2 and a long free stretch down column D. |
| 14 | E2 | hit | D2 is the only open hit, and E2 is the neighbor with the most free room along the fully open row 2. |
| 15 | F2 | miss | D2 and E2 are two adjacent hits in row 2, so the ship runs horizontally; I extend toward the right, where row 2 has more free space (F2 to J2). |
| 16 | C2 | hit | D2 and E2 are adjacent hits in row 2 with F2 a miss, so the ship runs horizontally and must extend left through C2. |
| 17 | B2 | hit | C2-D2-E2 is a horizontal run blocked by a miss at F2, so I extend left through B2 in case the ship is longer than 3. |
| 18 | A2 | sunk Carrier | B2-E2 is a run of four blocked on the right by the miss at F2, so A2 is the only cell that can extend it to a Carrier (5). |
| 19 | E9 | miss | Even-parity cell with a fully open row 9 and four free cells down column E, covering the unexplored bottom while the Destroyer is still afloat. |
| 20 | I5 | miss | Even-parity cell in the large open right side, with a full open column I and four free cells along row 5, while the Destroyer is still afloat. |
| 21 | D4 | miss | Even-parity cell in the large open left block, with a four-cell stretch along row 4 and five free cells down column D, which fits the Battleship, Submarine and Destroyer. |
| 22 | H8 | miss | Even-parity cell in the open lower-right with a free stretch of 4 both along row 8 (G-J) and down column H (7-10), so it fits the Battleship, Submarine and Destroyer. |
| 23 | C5 | miss | Even-parity cell in the large open left block, with 4-cell stretches along row 5 (A-D) and column C (3-6), so it fits the Battleship, Submarine and Destroyer. |
| 24 | I9 | miss | Even-parity cell in the open lower-right, covered by a 5-cell stretch along row 9 (F-J) and one down column I (6-10), so it fits the Battleship, Submarine and Destroyer. |
| 25 | B6 | miss | Even-parity cell in the open left block, where column B and row 6 both fit the Battleship, Submarine and Destroyer. |
| 26 | J8 | miss | Even-parity cell in the open right-edge column J, which has a long free stretch for the Battleship, Submarine and Destroyer. |
| 27 | H2 | miss | Even-parity cell in the open upper-right with a 4-cell stretch along row 2 (G-J) and 3 cells down column H, so it fits the Battleship, Submarine and Destroyer. |
| 28 | G1 | miss | Row 1 is a fully open row where the Battleship, Submarine and Destroyer all fit, and G1 lies on many placements, including a vertical Destroyer through G2. |
| 29 | A7 | miss | Column A is a long open stretch (A3-A10), and A7 lies on the most remaining Battleship, Submarine and Destroyer placements. |
| 30 | D10 | miss | Even-parity cell in the wide-open bottom row, lying on many Battleship, Submarine and Destroyer placements. |
| 31 | G10 | miss | G10 lies on the most remaining Battleship, Submarine and Destroyer placements: the open stretch E10-J10 plus the three-cell column G8-G10. |
| 32 | J4 | miss | J4 lies on the most remaining Battleship, Submarine and Destroyer placements, since column J has a 7-cell open stretch and row 4 adds I4-J4. |
| 33 | B9 | miss | The Battleship, Submarine and Destroyer all fit through B9 in the open lower-left (row 9 A-D and column B7-B10), more placements than any other cell. |
| 34 | D1 | miss | Row 1 holds the most Battleship placements left (A-D, B-E, C-F all include D1) and also fits the Submarine and Destroyer. |
| 35 | A3 | hit | The Battleship (4) only fits in three places (A3-D3, A3-A6, I1-I4), and A3 lies on two of them, so it also serves the Submarine and Destroyer. |
| 36 | B3 | miss | A3 is the only open hit; B3 extends along row 3, where a Destroyer, Submarine or Battleship (A3-D3) could all fit. |
| 37 | A4 | hit | A3 is the only open hit, with A2 sunk above it and B3 a miss, so the ship must continue down column A through A4. |
| 38 | A5 | hit | A3 and A4 are a vertical run with A2 sunk above, so the ship can only extend down through A5. |
| 39 | A6 | sunk Battleship | A3-A5 is a vertical run capped by the sunk Carrier at A2 and a miss at B3, so A6 is the only cell that can extend it (to a Battleship) or confirm a 3-cell Submarine. |
| 40 | I3 | miss | I3 lies on the most remaining Submarine and Destroyer placements, because the upper-right block is open along both row 3 and column I. |
| 41 | I7 | miss | I7 lies on the most remaining Submarine and Destroyer placements (two Submarine lines and four Destroyer lines). |
| 42 | D7 | miss | D7 lies on two Submarine lines (D5-D7 and D7-F7) and two Destroyer lines (D6-D7 and D7-E7), among the most placements of any open cell. |
| 43 | G5 | miss | G5 lies on the G4-G6 Submarine line and three Destroyer placements (G4-G5, G5-G6, G5-H5), tied for the most remaining placements, and it is an even-parity cell. |
| 44 | C8 | miss | C8 lies on two Submarine lines (A8-C8 and C8-C10) and two Destroyer lines, tied for the most placements among the remaining open cells. |
| 45 | G9 | hit | G9 lies on the F9-H9 Submarine line and three Destroyer placements (F9-G9, G9-H9, G8-G9), tied for the most remaining placements. |
| 46 | H9 | hit | G9 is the only open hit; the free run F9-H9 can hold the Submarine and also a Destroyer, so a horizontal neighbor covers more placements than G8. |
| 47 | F9 | sunk Submarine | G9 and H9 are an unsunk horizontal pair, I9 is a miss, so F9 is the only cell that completes a 3-cell Submarine along row 9. |
| 48 | I1 | miss | Only the Destroyer remains, and I1 lies on three possible 2-cell placements (H1-I1, I1-J1, I1-I2), tied for the most of any open cell. |
| 49 | J6 | miss | Only the Destroyer remains, and J6 lies on three possible 2-cell placements (J5-J6, I6-J6, J6-J7), tied with J2 for the most of any open cell. |
| 50 | J2 | hit | Only the Destroyer remains, and J2 lies on three possible 2-cell placements (J1-J2, I2-J2, J2-J3), the most of any open cell. |
| 51 | I2 | miss | J2 is the only open hit and the Destroyer is the last ship, so I fire an orthogonal neighbor; J1, I2 and J3 are all still possible and I pick I2. |
| 52 | J3 | sunk Destroyer | J2 is the only open hit and I2 is a miss, so the Destroyer must be J1-J2 or J2-J3; both fit equally, so I pick J3. |

