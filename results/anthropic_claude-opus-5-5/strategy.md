# anthropic/claude-opus-5-5

**Strategy: Parity Hunter with Density Targeting**

> COORDINATES: Columns A-J map to 1-10, rows 1-10. A cell's parity is (column number + row number) mod 2. Example: E5 = 5+5 = 10, which is even.
> 
> GENERAL RULES (every turn)
> 1. Keep track of all misses, all open hits (hit but not yet part of a sunk ship), all sunk ships, and which ship lengths are still afloat.
> 2. Never fire at a cell that no remaining ship could occupy. Example: an empty gap of 2 cells walled in by misses, edges or sunk ships, both horizontally and vertically, when the smallest ship still afloat has length 3.
> 3. If any open hit exists, you are in TARGET mode. Otherwise you are in HUNT mode.
> 
> PART 1: HUNT MODE (no open hits)
> A. Parity. While the Destroyer (2) is afloat, fire only at EVEN-parity cells. Every ship covers at least one even cell, so this alone guarantees finding every ship.
> B. Preferred opening order. Use these cells in order, skipping any that are already shot or useless: E5, F6, D7, G4, C3, H8, E9, I5, B6, F2, H2, B8, D1, J1, A1? NO, skip corners early. Continue with the remaining even cells: C5, G6, E7, F4, D3, G8, I3, I7, C9, B2, E1, J9, A7, H10, F10, A3, J5, B10, I1, A5? NO, A5 is odd, so ignore it. Instead, use the density rule below whenever the board has become irregular. In general, prefer central cells and cells far from previous shots.
> C. Density rule (the main decider once some misses or sinks exist). For each candidate cell, roughly count how many ways the largest remaining ship could be placed horizontally plus vertically through that cell, using only unshot non-sunk cells. Give extra weight to cells that also fit the other remaining ships. Fire at the candidate of the correct parity with the highest count. Break ties by choosing the cell nearest the board center or in the largest untouched open region.
> D. Spacing upgrade. Once the Destroyer is sunk, the smallest remaining length L is 3 or more. Switch to a lattice where (column + row) mod L equals a fixed value. Choose the value that matches the most cells you have already fired at, so previous shots keep counting. Within that lattice, still apply the density rule. If only the Carrier remains, use mod 5. If only the Battleship and Carrier remain, use mod 4.
> E. Region logic. Ships hide where the board is still empty. Fire into the biggest empty region that can still hold the largest remaining ship. Do not waste shots on narrow strips that can only hold short ships while long ships are unfound, unless density says otherwise.
> 
> PART 2: TARGET MODE (open hits exist)
> Step 1, single isolated hit. Fire at one of its 4 neighbors. Choose the direction (horizontal or vertical axis) with the most open unshot space, because more placements fit there and a longer remaining ship is more likely. Within that axis, first try the side with more room. If it misses, try the opposite side on the same axis. If both sides miss, switch to the other axis.
> Step 2, two or more adjacent hits in a line. The axis is probably known. Extend along the line. Keep firing past one end until you get a miss or reach the edge, then fire past the other end. Always fire the end that has more open room first. Never fire perpendicular while the line can still grow, unless both ends are blocked.
> Step 3, sunk message. Mark that ship's cells as sunk.
> - Compare the number of hits in the line with the sunk ship's length. If the line has MORE hits than the sunk length, the extra hits belong to another ship. The sunk ship occupies the run of exactly its length that ends at the last cell you fired, so the remainder stays open.
> - Treat each leftover open hit as a new Step 1 hit, but probe perpendicular first, since it was not part of the line's ship.
> Step 4, line blocked at both ends without a sink. You are looking at side-by-side ships. Each hit in the line is a separate ship running perpendicular. Fire perpendicular neighbors of those hits, starting with the hit that has the most open perpendicular room.
> Step 5, length logic. Use the remaining ship lengths. If a line of 3 hits is not sunk and both 3-ships are already sunk, a 4- or 5-ship must extend further. If an end cannot possibly extend to fit any remaining ship, do not shoot it.
> Step 6, multiple open hit clusters. Finish the cluster that has 2+ aligned hits first, because its direction is known. Then handle single hits.
> Step 7, return to HUNT mode only when no open hits remain.
> 
> EXTRA
> - After each sink, recompute which ships remain. Update the parity or lattice and the density estimates.
> - When a ship sinks, also ask whether its earlier misses nearby create dead zones. Never shoot dead zones.
> - When few ships remain and the open area is small, enumerate the possible placements explicitly. Shoot the cell covered by the most placements, which may break parity.
> - Avoid corners and edges early. They hold fewer placements.

## Board 11 · 51 shots

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | E5 | miss | Opening shot on a central even-parity cell, where the most ship placements overlap. |
| 2 | F6 | miss | Next central even-parity cell in my opening order, and it covers the most placements on a nearly empty board. |
| 3 | D7 | miss | Next cell in my opening order: a central even-parity cell away from the two misses that still fits many ship placements. |
| 4 | G4 | hit | Next even-parity cell in my opening order, central and away from the previous misses, so it still sits in many ship placements. |
| 5 | G5 | miss | Target mode on the lone hit at G4: rows and columns offer equal open room around it, and the side toward G10 has six open cells, so I probe that side first. |
| 6 | F4 | hit | G5 missed, so the row axis has more open room around G4 than the column, and the left side (F4 to A4) is the longer open stretch. |
| 7 | E4 | hit | F4 and G4 form a horizontal line, so I extend it toward the left end, which has more open room (A4 to E4) than the right end. |
| 8 | D4 | hit | E4-F4-G4 is an unsunk horizontal line, so I keep extending left, where there is more open room (A4-D4) than on the right. |
| 9 | H4 | miss | The four-hit horizontal line D4-G4 is not sunk, so it is probably the Carrier and must extend to C4 or H4; both ends have equal open room, so I try H4. |
| 10 | C4 | sunk Carrier | The unsunk four-hit line D4-G4 is blocked by the miss at H4, so the only way it can continue is left to C4. |
| 11 | H8 | miss | Even-parity cell from my opening order that sits in the large open lower-right region, where the Battleship and the other remaining ships have many possible placements. |
| 12 | E9 | miss | Even-parity cell with the highest Battleship placement count, six ways, in the open lower area. |
| 13 | B6 | miss | Even-parity cell in the untouched left region, with about six possible Battleship placements through it, tied for the highest count on the board. |
| 14 | I3 | miss | I3 is an even-parity cell with the highest Battleship placement count, seven ways across the open row 3 and the fully open column I. |
| 15 | I7 | miss | I7 is an even-parity cell with the highest Battleship placement count, six ways: four down the open I4-I10 column and two along row 7 from E7 to J7. |
| 16 | F2 | miss | F2 is an even-parity cell in the large untouched top region, where the Battleship has four placements along open row 2 and the 3-ships fit both ways. |
| 17 | J6 | miss | Even-parity cell tied for the most Battleship placements (five): four down the fully open J column and one along G6-J6, and it also fits many 3-ship placements. |
| 18 | F10 | hit | F10 is an even-parity cell tied for the most Battleship placements (five), with four along the fully open row 10 and one down F7-F10, plus several 3-ship placements. |
| 19 | E10 | miss | Row 10 offers far more open room around the F10 hit than column F does, and the left side is the longer open stretch. |
| 20 | G10 | miss | E10 missed, so the F10 hit must continue up or right, and row 10 to the right has the longest open stretch, G10 through J10. |
| 21 | F9 | hit | E10 and G10 both missed, so the F10 hit has to run vertically and F9 is the only open neighbor left. |
| 22 | F8 | sunk Submarine | F9-F10 is an unsunk vertical line, F10 sits on the bottom edge, so the only way it can grow is upward to F8 (room up to F7 before the F6 miss). |
| 23 | A5 | miss | Even-parity cell with the highest Battleship placement count (five: four down the fully open A column and one along A5-D5), and it also fits several Cruiser placements. |
| 24 | E3 | miss | E3 is an even-parity cell in the large open top region, tied for the most Battleship placements (four along row 3), and it also fits several Cruiser and Destroyer placements. |
| 25 | C8 | miss | C8 is the even-parity cell with the most Battleship placements (five: three down the open C5-C10 column and two along A8-E8), and it also fits many Cruiser and Destroyer placements. |
| 26 | B2 | miss | B2 is an even-parity cell tied for the most Battleship placements (four, two along row 2 and two down column B) and also fits several Cruiser placements, while lying off the edge. |
| 27 | D1 | hit | D1 is tied for the most Battleship placements (four along the fully open row 1), and it also fits a vertical Cruiser in D1-D3 plus many row-1 Cruiser and Destroyer placements. |
| 28 | E1 | hit | Row 1 is wide open around the D1 hit while column D is capped by the sunk Carrier at D4, so E1 (on the side with more room) covers the most remaining ship placements through D1. |
| 29 | F1 | miss | D1-E1 is an open horizontal line, so I extend it toward the right end, which has more open room (F1 to J1) than the left. |
| 30 | C1 | hit | D1-E1 is an unsunk horizontal line blocked by the miss at F1, so the ship most likely continues left to C1. |
| 31 | B1 | sunk Battleship | C1-D1-E1 is an unsunk line blocked at F1, so a 3-ship would already have sunk; the Battleship most likely ends at B1. |
| 32 | G7 | miss | G7 is the even-parity cell that fits the most Cruiser placements (four: E7-G7, F7-H7, G6-G8, G7-G9) and also covers many Destroyer placements. |
| 33 | I9 | miss | I9 is an even-parity cell tied for the most Cruiser placements (G9-I9, H9-J9, I8-I10) and has all four neighbors open for the Destroyer. |
| 34 | H2 | miss | H2 is an even-parity cell tied for the most Cruiser placements (three) in the open top-right region, and all four of its neighbors are open for the Destroyer. |
| 35 | B9 | miss | B9 lies in the large open lower-left area and fits four Cruiser placements (A9-C9, B9-D9, B7-B9, B8-B10), more than any other cell, and all four of its neighbors are open for the Destroyer. |
| 36 | A7 | miss | A7 is an even-parity cell covering the most Cruiser placements (four: three in the open A6-A10 column and one along A7-C7), and it also fits several Destroyer placements. |
| 37 | A3 | miss | A3 is the even-parity cell covering the most remaining Cruiser placements (A1-A3, A2-A4, A3-C3), and it also fits Destroyer placements. |
| 38 | I5 | miss | I5 is an even-parity cell that fits two Cruiser placements (I4-I6 and H5-J5) and four Destroyer placements, tied for the best count on the board. |
| 39 | H6 | miss | H6 is an even-parity cell with two Cruiser placements (G6-I6 and H5-H7) and four Destroyer placements, the best combined count left on the board. |
| 40 | J3 | miss | J3 fits three Cruiser placements in the open top of column J (J1-J3, J2-J4, J3-J5), more than any other cell, and also fits two Destroyer placements. |
| 41 | J8 | hit | J8 sits in two possible Cruiser placements down column J (J7-J9 and J8-J10) and three Destroyer placements, tied for the best combined count among even-parity cells. |
| 42 | J9 | hit | Of J8's open neighbors, J9 lies in the most remaining placements: both vertical Cruiser fits (J7-J9 and J8-J10) and the J8-J9 Destroyer. |
| 43 | J7 | miss | J8-J9 did not sink after two hits, so it is most likely the Cruiser running J7-J9 or J8-J10, and J7 tests one of those two equally likely ends. |
| 44 | J10 | sunk Cruiser | J7 missed and the unsunk J8-J9 pair cannot be a lone Destroyer (it would have sunk), so the Cruiser must run J8-J10. |
| 45 | D6 | miss | Only the Destroyer is left, and D6 is tied for the most possible Destroyer placements (C6-D6, D6-E6, D5-D6) in the open middle-left area. |
| 46 | D2 | miss | Only the Destroyer is left, and D2 is an even-parity cell tied for the most Destroyer placements (C2-D2, D2-E2, D2-D3) in the open top-left pocket. |
| 47 | E7 | miss | Only the Destroyer remains, and E7 is tied for the most possible Destroyer placements (E6-E7, E7-F7, E7-E8); E6 and F7 can only be covered through E7. |
| 48 | C3 | hit | Only the Destroyer remains, and C3 is covered by three of its possible placements (B3-C3, C3-D3, C2-C3), tied for the most on the board. |
| 49 | D3 | miss | C3 is a hit on the last ship, the Destroyer, so it must continue to an open neighbor (B3, D3 or C2), and D3 is one of these equally likely cells. |
| 50 | C2 | miss | The Destroyer hit at C3 can only continue to C2 or B3, since D3 missed and C4 belongs to the sunk Carrier, so C2 is a 50/50 shot to sink it. |
| 51 | B3 | sunk Destroyer | The Destroyer hit at C3 can only continue to B3, since D3 and C2 missed and C4 belongs to the sunk Carrier. |

## Board 23 · 39 shots

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | E5 | miss | Opening shot at a central even-parity cell, where the most ship placements can fit. |
| 2 | F6 | miss | Next cell in the opening order: central, even parity, and not adjacent to the E5 miss along a row or column. |
| 3 | D7 | miss | Next cell in the opening order: an even-parity, central cell in open space away from the earlier misses. |
| 4 | G4 | hit | Next cell in the opening order: an even-parity central cell in open space, away from the earlier misses. |
| 5 | F4 | miss | G4 is an isolated hit, and F4 extends it toward the side of row 4 with the most open room. |
| 6 | G5 | hit | F4 missed and only three cells remain to the right of G4, so far more ship placements run vertically through G4, and G5 is the neighbor covered by the most of them. |
| 7 | G6 | hit | G4 and G5 are vertical hits, and G6 extends the line toward its end with more open room (rows 6-10 versus rows 1-3). |
| 8 | G7 | hit | G4-G6 form a vertical line, so I extend it toward the end with more open room below (rows 7-10). |
| 9 | G8 | miss | Four vertical hits G4-G7 with no sink suggest the 5-cell Carrier, so I extend the line downward, though G3 above is equally likely. |
| 10 | G3 | sunk Carrier | G8 missed, so the unsunk vertical line G4-G7 most likely continues upward to G3 as the Carrier. |
| 11 | C3 | miss | Next even-parity cell in my opening order; it sits in the large open upper-left region, where the 4-long Battleship has many placements. |
| 12 | E9 | hit | Even-parity cell in the open lower region, where row 9 and column E together allow the most Battleship placements. |
| 13 | F9 | hit | E9 is an isolated hit and row 9 is completely open, so the horizontal axis fits more ship placements, and the right side has more room. |
| 14 | D9 | miss | E9 and F9 form a horizontal line with equal open room on both sides, so I extend it to the left, where D9 fits as many placements as G9. |
| 15 | G9 | hit | E9-F9 is a horizontal line and D9 missed, so the ship must continue to the right into G9. |
| 16 | H9 | sunk Battleship | E9-G9 is a horizontal line of three hits that has not sunk, and D9 is a miss, so the ship most likely continues right to H9 as the 4-cell Battleship. |
| 17 | B6 | miss | B6 is an even-parity cell in the large open left region and fits the most 3-long ship placements, with 2 horizontal and 3 vertical. |
| 18 | H2 | miss | H2 is an even-parity cell in the open upper-right region, and it fits about 5 placements of the 3-long ships (3 horizontal, 2 vertical), tied for the most on the board. |
| 19 | D4 | miss | D4 is an even-parity cell in the open upper-left region and fits about 5 placements of the 3-long ships (2 along row 4, 3 along column D), the most on the board. |
| 20 | I5 | miss | Even-parity cell in the largest open region, the right side, where it fits about 4 placements of the 3-long ships (mostly vertical along column I). |
| 21 | C5 | miss | C5 is an even-parity cell in the open left-middle area with about 4 Cruiser/Submarine placements and 4 Destroyer placements, tied for the most on the board. |
| 22 | E2 | hit | E2 is an even-parity cell in the open top region with about 5 possible placements for the 3-long ships (3 along row 2, 2 down column E), the most on the board. |
| 23 | D2 | hit | E2 is an isolated hit and row 2 has more open room than column E, so I probe horizontally, starting toward the more open left side. |
| 24 | C2 | sunk Submarine | D2 and E2 are adjacent hits that did not sink a Destroyer, so a 3-long ship covers C2-E2 or D2-F2, and C2 tests the first of those. |
| 25 | B8 | miss | With the Cruiser and Destroyer left, B8 is an even-parity cell in the open lower-left area and fits about 4 Cruiser and 4 Destroyer placements, tied for the most on the board. |
| 26 | H6 | miss | H6 is an even-parity cell in the open right-side region and fits the most Cruiser and Destroyer placements, with 4 each along column H and row 6. |
| 27 | J8 | hit | J8 is an even-parity cell in the open right-side region and fits about 4 Cruiser and 3 Destroyer placements, tied with J4 and A4 for the most on the board. |
| 28 | J7 | miss | J8 is an isolated hit, and column J fits more Cruiser and Destroyer placements through it than row 8, where G8 is a miss; J7 is tied with J9 and sits on the side with more open room. |
| 29 | J9 | hit | J7 missed, so the open hit at J8 must continue either down to J9 or left to I8. Both cells fit the same number of Cruiser and Destroyer placements, and J9 tests the vertical option first. |
| 30 | J10 | sunk Cruiser | J8 and J9 are vertical hits that have not sunk a ship, and J7 is a miss, so the 3-long Cruiser most likely ends at J10. |
| 31 | I3 | miss | Only the Destroyer remains, and I3 is an even-parity cell with all four neighbors open, giving 4 possible Destroyer placements, tied with B4 for the most on the board. |
| 32 | B4 | miss | Only the 2-cell Destroyer remains, and B4 is an even-parity cell with all four neighbors open, so it fits 4 Destroyer placements, the most of any remaining cell. |
| 33 | E7 | miss | Only the 2-cell Destroyer is left, and E7 is an even-parity cell with three open neighbors, the most possible on this board, in the open middle area. |
| 34 | H4 | miss | Only the 2-cell Destroyer remains, and H4 is an even-parity cell with three open neighbors, the most any remaining cell has, so it fits as many Destroyer placements as any cell. |
| 35 | D6 | miss | Only the 2-cell Destroyer remains, and D6 is an even-parity cell with three open neighbors, the most any cell has, in the open middle-left area. |
| 36 | C9 | miss | Only the 2-cell Destroyer is left, and C9 is an even-parity cell with three open neighbors in the dense open lower-left area, so it covers as many Destroyer placements as any cell. |
| 37 | I7 | hit | Only the 2-cell Destroyer is left, and I7 is an even-parity cell with three open neighbors, so it fits as many Destroyer placements as any remaining cell. |
| 38 | I8 | miss | Only the 2-cell Destroyer remains and it must include I7, so it continues into I6, H7 or I8; all three are equally likely and I8 tests one of them. |
| 39 | I6 | sunk Destroyer | The Destroyer must include the hit at I7, and with J7 and I8 already missed, only I6 or H7 can complete it, so I test I6. |

## Board 37 · 53 shots

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | E5 | hit | Opening shot at a central even-parity cell, where the most ship placements overlap. |
| 2 | E4 | hit | Probe a neighbor of the single hit at E5; the vertical and horizontal axes are equally open, so start with E4. |
| 3 | E6 | miss | Extend the vertical E4-E5 hit line toward the end with more open room (5 cells below vs 3 above). |
| 4 | E3 | sunk Cruiser | The vertical line E4-E5 is blocked below by the miss at E6, so I extend it upward at E3. |
| 5 | F6 | miss | Hunting on even parity: F6 is a central cell in the large open area with many possible ship placements through it. |
| 6 | D8 | miss | D8 is an even-parity cell whose row and column are both completely open, far from earlier shots, so many ship placements pass through it. |
| 7 | G7 | miss | G7 is an even-parity cell whose row and column are both fully open, so the most remaining ship placements pass through it. |
| 8 | I5 | miss | Even-parity cell in the large untouched upper-right region, with the most Carrier and Battleship placements through it. |
| 9 | H8 | miss | Even-parity cell in the open lower-right area with a fully open column and long open row, giving many Carrier and Battleship placements. |
| 10 | D2 | hit | Even-parity cell in the large open upper-left area, with a fully open row 2 and column D open from rows 1 to 7, so many Carrier and Battleship placements pass through it. |
| 11 | E2 | hit | Row 2 is fully open while column D is blocked at D8, and most horizontal placements through D2 also cover E2. |
| 12 | F2 | miss | D2-E2 is an unsunk horizontal line, so it extends to at least 3 cells; F2 is the end with more open room in row 2 (and E3 below is already sunk). |
| 13 | C2 | hit | D2-E2 is an unsunk horizontal line blocked by the miss at F2, so the ship most likely extends west to C2. |
| 14 | B2 | hit | The C2-D2-E2 line is blocked at F2 and still not sunk, so it must be the Battleship or Carrier continuing west to B2. |
| 15 | A2 | sunk Carrier | The four hits B2-E2 are blocked by the miss at F2 and not yet sunk, so the Carrier most likely ends at A2. |
| 16 | C7 | miss | C7 is an even-parity cell in the open lower-left region, and about 7 Battleship placements pass through it, the most of any candidate. |
| 17 | H4 | miss | H4 is an even-parity cell in the open upper-right region; with about 6 placements (2 horizontal, 4 vertical), it fits more Battleship positions than any other candidate. |
| 18 | E9 | miss | E9 is an even-parity cell in the fully open bottom rows; about 5 Battleship placements pass through it, tied for the most, and many Submarine and Destroyer placements fit there too. |
| 19 | G3 | miss | G3 is an even-parity cell in the open upper-right area that ties for the most Battleship, Submarine and Destroyer placements, with 2 horizontal and 3 vertical Battleship fits. |
| 20 | B6 | miss | B6 is an even-parity cell in the large open left region, and it ties for the most Battleship placements (4 vertical, 1 horizontal) while also fitting the most Submarine placements. |
| 21 | F10 | miss | F10 is an even-parity cell in the wide-open bottom rows, and it ties for the most Battleship placements (5) while also fitting many Submarine placements. |
| 22 | J6 | miss | J6 is an even-parity cell with the most Battleship placements on the board (4 vertical in the open J column plus 1 horizontal in G6-J6). |
| 23 | I9 | miss | I9 is an even-parity cell that ties for the most Battleship placements (4) and has the most Submarine placements, in the open lower-right area. |
| 24 | A5 | hit | A5 is an even-parity cell in the open left column that fits 4 Battleship placements, tied for the most on the board, plus the most Submarine placements among those ties. |
| 25 | A6 | hit | Column A around the A5 hit has far more room for the remaining ships than row 5, and A6 lies in the most Battleship, Submarine and Destroyer placements through A5. |
| 26 | A7 | miss | A5-A6 form a vertical line, so I extend it toward A7, the end with more open room (A7-A10 below versus only A3-A4 above). |
| 27 | A4 | hit | A6 can only belong to a vertical ship because B6 and A7 are misses, and A5-A6 is not sunk yet, so the ship must extend upward to A4. |
| 28 | A3 | sunk Battleship | A4-A6 is an unsunk vertical line blocked by the miss at A7, and it would already have sunk if it were the Submarine or Destroyer, so it must be the Battleship ending at A3. |
| 29 | C9 | miss | C9 is an even-parity cell in the open lower-left area, tied for the most Submarine and Destroyer placements (about 7) of any candidate. |
| 30 | C5 | miss | C5 is an even-parity cell in the open B3-D7 pocket; it ties for the most Submarine placements and has four open neighbours for the Destroyer. |
| 31 | H2 | miss | H2 is an even-parity cell in the open upper-right pocket and ties for the most Submarine (3) and Destroyer (4) placements of any candidate. |
| 32 | B8 | miss | B8 is an even-parity cell tied for the most Submarine placements (3) and the most Destroyer placements (4), in the open lower-left pocket. |
| 33 | I3 | miss | I3 is an even-parity cell that ties for the most Submarine placements (3) and has four open neighbours for the Destroyer, in the open upper-right pocket. |
| 34 | D4 | miss | D4 is an even-parity cell tied for the most Submarine placements (3, in row 4 and column D) and has three open neighbours that can still hold the Destroyer. |
| 35 | E1 | miss | Row 1 is fully open, so the even-parity cell E1 fits 3 Submarine placements, the most of any candidate on the board. |
| 36 | H6 | miss | H6 is an even-parity cell tied for the most Submarine placements (2) and has the most Destroyer placements (4), in the open right-centre pocket. |
| 37 | F8 | miss | F8 is an even-parity cell tied for the most Submarine placements (2) and has four open neighbours for the Destroyer, in the open lower-centre pocket. |
| 38 | G5 | miss | G5 is an even-parity cell tied for the most Submarine placements (2, in F5-H5 and G4-G6) and has four open neighbours that could hold the Destroyer. |
| 39 | I7 | miss | I7 is an even-parity cell tied for the most Submarine placements (H7-J7 and I6-I8), and all four of its neighbours are open, so it also fits the most Destroyer placements. |
| 40 | C10 | miss | C10 lies in three Submarine placements along A10-E10 (A-C, B-D, C-E), tied for the most on the board, and both of its open row neighbours can also hold the Destroyer. |
| 41 | G9 | hit | G9 lies on 2 possible Submarine placements (F9-H9 and G8-G10) and 4 possible Destroyer placements, the highest combined total of any open cell. |
| 42 | F9 | hit | The G9 hit can only extend along row 9 (F9-H9) or column G (G8-G10), and both axes are equally open, so F9 is as good a first neighbor as any. |
| 43 | H9 | sunk Submarine | F9 can only connect horizontally to G9, and the pair did not sink as the Destroyer, so it must be the Submarine; with E9 a miss, it can only end at H9. |
| 44 | E7 | miss | Only the Destroyer is left, and E7 is an even-parity cell that three Destroyer placements pass through (with D7, F7 or E8), the highest count on the board, and it is the most central of the tied cells. |
| 45 | C3 | miss | Only the 2-cell Destroyer remains, and C3 is an even-parity cell with three open neighbours (B3, D3, C4), tied for the most possible Destroyer placements. |
| 46 | F4 | miss | Only the 2-cell Destroyer remains, and F4 is an even-parity cell tied for the most possible Destroyer placements (three: F3-F4, F4-F5 and F4-G4). |
| 47 | D6 | miss | Only the Destroyer remains, and D6 is an even-parity cell where three Destroyer placements fit (with C6, D5 or D7), tied for the most; it is also the most central of the tied cells. |
| 48 | G1 | miss | Only the Destroyer is left, and G1 is an even-parity cell where three Destroyer placements fit (with F1, H1 or G2), tied for the most on the board. |
| 49 | I1 | miss | Only the 2-cell Destroyer is left, and I1 is an even-parity cell where three Destroyer placements fit (with H1, J1 or I2), tied for the most on the board, in the open upper-right corner area. |
| 50 | B4 | miss | Only the Destroyer is left, and B4 is an even-parity cell where three Destroyer placements fit (with B3, B5 or C4), tied for the most on the board. |
| 51 | J8 | miss | Only the 2-cell Destroyer is left, and J8 is an even-parity cell where three Destroyer placements fit (with J7, I8 or J9), tied for the most on the board. |
| 52 | J2 | hit | Only the Destroyer is left, and J2 fits three of the roughly 20 remaining Destroyer placements (with J1, I2 or J3), tied for the most on the board. |
| 53 | J3 | sunk Destroyer | The Destroyer is the only ship left and must include the hit at J2, so it ends at J1, I2 or J3; these are equally likely, so I take J3. |

