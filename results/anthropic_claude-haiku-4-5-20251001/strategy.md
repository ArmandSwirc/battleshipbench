# anthropic/claude-haiku-4-5-20251001

**Strategy: Checkerboard + Hunt & Destroy**

> PHASE 1 - INITIAL SEARCH (Checkerboard Pattern):
> 
> 1. Use a checkerboard pattern to maximize coverage with minimum shots. Fire at all cells where (column_index + row_index) is even. Columns A-J are indexed 0-9, rows 1-10 are indexed 1-10.
> 2. This creates a diagonal grid: A1, A3, A5, A7, A9, B2, B4, B6, B8, B10, C1, C3, ... etc.
> 3. The checkerboard guarantees that any ship of length 2 or more cannot avoid being hit, since consecutive cells alternate parity.
> 4. Continue this pattern until you get your first hit, then move to Phase 2.
> 5. Priority within checkerboard: scan left-to-right, top-to-bottom for consistency.
> 
> PHASE 2 - INITIAL HIT RESPONSE:
> 
> 1. When you hit a ship, immediately fire the 4 adjacent cells (up, down, left, right) to determine orientation and extent.
> 2. If multiple adjacent cells hit: the ship continues in that direction.
> 3. If only one adjacent cell hits: fire the opposite direction from that cell.
> 4. Once you identify the ship's orientation (horizontal or vertical), extend in both directions until you have hit all cells of the ship.
> 
> PHASE 2B - SINKING THE SHIP:
> 
> 1. After identifying orientation, fire methodically along the line in both directions from your initial hit.
> 2. Keep track of consecutive hits. If you have N hits in a line and haven't sunk the ship, extend by 1 cell in each direction.
> 3. Once sunk (confirmation received), return to Phase 1 checkerboard pattern for remaining ships.
> 
> PHASE 3 - MULTIPLE HITS / AMBIGUITY:
> 
> 1. If you have two separate hits (not adjacent), treat each independently until one is part of a known ship being hunted.
> 2. If a hit is orthogonal-adjacent to an existing line of hits, it's part of the same ship—extend that line.
> 3. If you have a gap (fired at a cell between two hits and missed), the ship doesn't occupy that gap; expand the search around the endpoints.
> 
> PHASE 4 - END GAME:
> 
> 1. Once 4 ships are sunk, switch to exhaustive search (fire remaining cells systematically) to finish the last ship.
> 2. Use remaining ship size from the list to guide search: Carrier (5), Battleship (4), Cruiser (3), Submarine (3), Destroyer (2).
> 
> KEY PRINCIPLES:
> 
> - Parity: The checkerboard pattern ensures no 2+ cell ship can be missed in the search phase.
> - Efficiency: Avoid redundant shots; mark all confirmed misses and hits.
> - Greedy expansion: Once a ship line is confirmed, extend aggressively to sink it immediately rather than resuming checkerboard.
> - Ship size tracking: After each sinking, cross off that ship and adjust expectations for remaining targets.
> - Deviate if beneficial: If checkerboard pattern would take many more shots, and you know ship sizes remaining, consider a tighter search near existing hits or in unexplored clusters.

## Board 11 · 84 shots

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | B1 | hit | Starting Phase 1 checkerboard pattern (even parity) to systematically search for ships |
| 2 | B2 | miss | Probe downward from hit at B1 to determine if ship is vertical or horizontal |
| 3 | C1 | hit | Probe right from B1 hit to determine if ship is horizontal or extends rightward |
| 4 | D1 | hit | Extend horizontal ship line rightward from C1 to determine ship length and extent |
| 5 | E1 | sunk Battleship | Extend horizontal ship line rightward to determine if it continues past D1 or ends there |
| 6 | A2 | miss | Resume Phase 1 checkerboard pattern search for remaining 4 ships; A2 is next even-parity cell not yet fired |
| 7 | C2 | miss | Resume Phase 1 checkerboard pattern (even parity) to systematically search for remaining 4 ships |
| 8 | A4 | miss | Resume Phase 1 checkerboard pattern (even parity cells) to systematically search for remaining ships |
| 9 | B3 | hit | Continue Phase 1 checkerboard pattern (even parity) to systematically search for remaining 4 ships |
| 10 | B4 | miss | Probe downward from B3 hit to determine if the ship is vertical; B2 was a miss so the ship cannot extend upward |
| 11 | C3 | sunk Destroyer | B3 is a hit with vertical directions blocked (B2 and B4 are misses), so the ship is horizontal; probe rightward from B3 to determine extent. |
| 12 | A5 | miss | Resume systematic search for remaining ships (Carrier 5, Cruiser 3, Submarine 3) in unexplored lower board area |
| 13 | A6 | miss | Continue Phase 1 checkerboard pattern (even parity) to systematically search for remaining ships in unexplored lower board area |
| 14 | F1 | miss | Systematic row-by-row scan of unexplored upper board to locate remaining Carrier, Cruiser, or Submarine. |
| 15 | B7 | miss | Continue Phase 1 checkerboard pattern (even parity) to systematically search for remaining 3 ships in unexplored lower board |
| 16 | D5 | miss | Continue Phase 1 checkerboard pattern search in unexplored upper-middle region where Carrier (5) or other remaining ships likely hide |
| 17 | B6 | miss | Continue Phase 1 checkerboard pattern (even parity) to systematically search for remaining ships in unexplored middle board area |
| 18 | A1 | miss | Continue Phase 1 checkerboard pattern (even parity) to systematically search for remaining Carrier(5), Cruiser(3), Submarine(3) ships |
| 19 | G1 | miss | Systematic exploration of unexplored upper-right region (columns F-J) to locate remaining Carrier(5), Cruiser(3), or Submarine(3) |
| 20 | I8 | miss | Continue systematic search of completely unexplored lower board (rows 8-10) to locate remaining Carrier(5), Cruiser(3), and Submarine(3) ships |
| 21 | H1 | miss | Continue systematic exploration of unexplored upper-right region to locate remaining Carrier(5), Cruiser(3), or Submarine(3) ships |
| 22 | E2 | miss | Continue checkerboard pattern search in unexplored upper-middle right region where remaining Carrier(5), Cruiser(3), or Submarine(3) could be hidden |
| 23 | D2 | miss | Continue checkerboard systematic search in row 2, column D, an unfired cell in moderately explored area with good potential for finding remaining ships |
| 24 | I1 | miss | Systematic exploration of unexplored upper-right region (row 1, column I) to locate remaining Carrier(5), Cruiser(3), or Submarine(3) ships before exhaustively searching lower rows |
| 25 | J1 | miss | Final unexplored cell in row 1 following checkerboard pattern; establishes whether remaining fleet extends into upper-right corner |
| 26 | F2 | miss | Systematic row-by-row search of largely unexplored rows 2-10 to locate remaining Carrier(5), Cruiser(3), and Submarine(3) |
| 27 | G2 | miss | Continue systematic exploration of row 2 right side (columns F-J) which remains largely untouched; likely location for remaining Carrier(5), Cruiser(3), or Submarine(3) |
| 28 | H2 | miss | Continue systematic row-by-row search of row 2's right side (H2-J2) which is completely unexplored, likely to locate remaining ships |
| 29 | I2 | miss | Complete row 2 exploration (I2 and J2 unexplored) before moving to completely uncharted rows 9-10 where remaining ships must hide |
| 30 | J2 | miss | Complete row 2 exploration (only remaining unknown in row 2), then systematically sweep rows 3-10 to locate remaining Carrier(5), Cruiser(3), and Submarine(3) |
| 31 | A3 | miss | Continue systematic row-by-row search of unexplored rows 3-10 to locate remaining Carrier(5), Cruiser(3), and Submarine(3); A3 is the first unknown cell in row 3. |
| 32 | D3 | miss | Continue systematic row-by-row exploration of row 3 (D3-J3 unknown) to locate remaining Carrier(5), Cruiser(3), and Submarine(3) ships |
| 33 | E3 | miss | Continue systematic row-by-row exploration of row 3 to locate remaining Carrier(5), Cruiser(3), or Submarine(3) ships |
| 34 | F3 | miss | Continue systematic row 3 exploration (F3-J3 still unknown) to locate remaining Carrier(5), Cruiser(3), and Submarine(3) ships. |
| 35 | C4 | hit | Continue systematic row-by-row sweep of unknown cells to locate remaining Carrier(5), Cruiser(3), and Submarine(3) in unexplored lower board |
| 36 | C5 | miss | Probe directly below the hit at C4 to determine if the unresolved ship is vertical or horizontal; B4 is a miss so horizontal leftward is blocked. |
| 37 | D4 | hit | Probe rightward from C4 hit to determine if ship is Cruiser(3), Submarine(3), or Carrier(5) extending right |
| 38 | E4 | hit | Probe rightward from C4-D4 hits to determine horizontal ship extent in row 4 |
| 39 | F4 | hit | Probe rightward from E4 to determine if the C4-D4-E4 hit sequence extends to the Carrier(5) or ends as a Cruiser(3)/Submarine(3) |
| 40 | G4 | sunk Carrier | Extend the 4-hit horizontal line C4-D4-E4-F4 rightward to find the 5th cell of the Carrier and complete it. |
| 41 | G3 | miss | Continue systematic search adjacent to sunk Carrier; likely location for remaining Cruiser or Submarine in unexplored upper-right region |
| 42 | H9 | miss | Continue systematic row-by-row search of largely unexplored lower board (rows 8-10) to locate remaining Cruiser(3) and Submarine(3) |
| 43 | H3 | miss | Systematic search of unexplored upper-right region (row 3, column H) likely to contain remaining Cruiser(3) or Submarine(3) |
| 44 | H4 | miss | Probe unexplored upper-right region (row 4, columns H-J) adjacent to sunk Carrier; likely location for remaining Cruiser(3) or Submarine(3) |
| 45 | F5 | miss | Continue systematic checkerboard search in row 5 for remaining Cruiser(3) and Submarine(3); even parity cell in unexplored region |
| 46 | I3 | miss | Systematic search of unexplored upper-right region (row 3, column I) to locate remaining Cruiser(3) or Submarine(3) |
| 47 | J3 | miss | Systematic exploration of unexplored upper-right region (row 3, column J) to locate remaining Cruiser(3) or Submarine(3) ships |
| 48 | E5 | miss | Continue systematic search of unexplored row 5 cells between known misses to locate remaining Cruiser(3) or Submarine(3) |
| 49 | J5 | miss | Unknown cell following checkerboard pattern in row 5; likely area for remaining Cruiser(3) or Submarine(3) |
| 50 | B5 | miss | Continue systematic exploration of row 5 to locate remaining Cruiser(3) and Submarine(3); B5 is an unexplored cell between row boundaries that could contain a remaining ship. |
| 51 | C6 | miss | Continue systematic checkerboard search in row 6 to locate remaining Cruiser(3) or Submarine(3) ships in largely unexplored lower board |
| 52 | D6 | miss | Continue systematic exploration of row 6 in largely unexplored lower board region to locate remaining Cruiser(3) or Submarine(3) |
| 53 | E6 | miss | Continue systematic row 6 exploration in unexplored region; long stretch E6-J6 unknown where a 3-cell ship could hide |
| 54 | F6 | miss | Continue systematic row 6 exploration in unexplored F6-J6 region where remaining 3-cell ships (Cruiser or Submarine) must hide |
| 55 | A7 | miss | Row 7 is almost entirely unexplored; systematically search this area for remaining Cruiser(3) or Submarine(3) |
| 56 | C7 | miss | Continue systematic row 7 exploration in largely unexplored lower board where remaining Cruiser(3) or Submarine(3) must hide |
| 57 | A8 | miss | Begin systematic exploration of mostly unexplored row 8 where remaining Cruiser(3) or Submarine(3) must hide |
| 58 | B8 | miss | Continue systematic row 8 exploration; mostly unexplored region where remaining Cruiser(3) and Submarine(3) must hide |
| 59 | G5 | miss | Systematic search of unexplored right side of row 5 where remaining 3-cell Cruiser or Submarine must hide |
| 60 | G6 | miss | Systematic search in unexplored row 6 right section where remaining 3-cell ships likely hide |
| 61 | C8 | miss | Continue systematic row-by-row search of row 8 to locate remaining Cruiser(3) or Submarine(3) ships |
| 62 | D9 | miss | Systematic exploration of largely unexplored rows 9-10 where remaining Cruiser(3) and Submarine(3) must hide |
| 63 | D7 | miss | Systematic search of unexplored row 7 where a 3-cell ship (Cruiser or Submarine) is likely to hide; part of continuous unexplored stretch D7-J7 |
| 64 | A9 | miss | Continue systematic search of mostly unexplored rows 9-10 where the remaining two 3-cell ships must be hidden |
| 65 | B9 | miss | Continue systematic row-by-row exploration of mostly unexplored rows 9-10 where both remaining Cruiser(3) and Submarine(3) must be hiding |
| 66 | E7 | miss | Continue systematic row-by-row search of unexplored row 7 where a 3-cell Cruiser or Submarine must hide |
| 67 | A10 | miss | Row 10 is completely unexplored; start systematic search for remaining Cruiser(3) and Submarine(3) in the last unprobed area |
| 68 | H5 | miss | Probe unexplored right side of row 5 where a 3-cell ship can easily hide; adjacent to other unknowns in a high-potential region |
| 69 | B10 | miss | First unknown cell in completely unexplored row 10; systematic row-by-row search for remaining Cruiser or Submarine |
| 70 | I4 | miss | Unexplored right-side region (I-J columns, rows 4-10) is most likely to contain remaining Cruiser or Submarine; I4 is a strategic probe adjacent to sunk Carrier. |
| 71 | F7 | miss | Continue systematic search of unexplored row 7 stretch (F7-J7), most likely location for remaining 3-cell ships (Cruiser or Submarine) in largely untouched region |
| 72 | G7 | miss | Probe unexplored row 7 (G7-J7 consecutive stretch) where a 3-cell Cruiser or Submarine most likely hides in the largely untouched lower-right region |
| 73 | H6 | miss | Probe unexplored right-side row 6 (H6-J6 consecutive stretch) where a 3-cell ship most likely hides in the largest concentrated unknown region |
| 74 | D8 | miss | Continue systematic row 8 exploration where remaining Cruiser or Submarine most likely hides in largely untouched lower board region |
| 75 | J8 | hit | Probe column J in the lower unexplored region where a 3-cell vertical ship (Cruiser or Submarine) could be hiding in the concentrated unknown stretch J6-J10 |
| 76 | J9 | hit | Probe downward from J8 hit to determine ship orientation and extent |
| 77 | J7 | miss | Probe upward from J8-J9 hits to determine if the 3-cell vertical ship in column J extends to J7-J8-J9 or J8-J9-J10 |
| 78 | J10 | sunk Cruiser | J7 is a miss above the J8-J9 hits; the 3-cell vertical ship must extend downward to J10 to complete it. |
| 79 | I5 | miss | Probe column I for the Submarine (3-cell ship); I5-I6-I7 are three consecutive vertical unknowns that could hide the ship |
| 80 | E8 | miss | Probe concentrated unknown region E8-F8-G8 in row 8 where the Submarine (3-cell ship) most likely hides |
| 81 | F8 | hit | Probe the three consecutive unknown cells F8-G8-H8 in row 8 where the Submarine (3-cell ship) most likely hides horizontally |
| 82 | G8 | miss | Probe right from F8 hit to determine if Submarine extends horizontally along row 8 (F8-G8-H8) or must be vertical (F8-F9-F10) |
| 83 | F9 | hit | F8 is a hit, horizontal directions (E8, G8) are misses, so submarine must be vertical; probe F9 below F8 to find the 3-cell submarine |
| 84 | F10 | sunk Submarine | Submarine must be vertical F8-F9-F10 since F7 is a miss and horizontal directions are misses; fire F10 to sink it |

## Board 23 · 86 shots

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | A2 | miss | Starting checkerboard pattern search (column_index + row_index even) to detect any ship with guaranteed hit coverage |
| 2 | B1 | miss | Continue checkerboard pattern search (even parity) to detect ships systematically |
| 3 | D1 | miss | Continue checkerboard pattern search (even parity) for guaranteed ship detection; next unfired cell is D1 |
| 4 | F1 | miss | Continue systematic checkerboard pattern search (even parity) to detect ships with guaranteed coverage; F1 has parity (5+1=6, even) |
| 5 | C2 | hit | Continue Phase 1 checkerboard pattern search at next even-parity cell to detect ships systematically |
| 6 | C1 | miss | Phase 2: Check adjacent cell above the C2 hit to determine ship orientation (vertical vs horizontal) |
| 7 | C3 | miss | Phase 2: Check cell directly below the C2 hit to determine if ship extends vertically downward (adjacent cell testing after C1 miss above) |
| 8 | B2 | miss | Phase 2: Check horizontal adjacency to C2 hit; A2 was miss so if B2 is also miss, ship extends only rightward from C2 |
| 9 | D2 | hit | Only untested adjacent to hit C2; must be part of horizontal ship since C1, C3, B2 are all misses |
| 10 | E2 | sunk Submarine | Extend horizontally right from D2 hit to determine full extent of the ship in row 2 |
| 11 | A4 | miss | Continue Phase 1 checkerboard pattern search (column A=0, row 4; parity 0+4=4 even) to systematically locate remaining ships |
| 12 | H1 | miss | Continue Phase 1 checkerboard pattern (even parity: 7+1=8) to systematically locate remaining ships |
| 13 | C4 | miss | Continue Phase 1 checkerboard pattern search (even parity: column C=2, row 4; 2+4=6 even) to systematically locate remaining four ships |
| 14 | B3 | miss | Continue Phase 1 checkerboard pattern search (even parity: 1+3=4) to systematically locate remaining 4 ships |
| 15 | J1 | miss | Continue Phase 1 checkerboard pattern search (even parity: J=9, row 1; 9+1=10 even) to systematically locate remaining ships |
| 16 | G2 | miss | Continue checkerboard pattern (even parity: G=6, row 2, sum=8 even) to systematically detect remaining ships |
| 17 | B5 | miss | Continue systematic checkerboard pattern search (even parity) to locate remaining ships; B5 is next unfired even-parity cell in left-to-right, top-to-bottom order. |
| 18 | A6 | miss | Continue Phase 1 checkerboard pattern search (even parity: A=0, row 6; 0+6=6 even) to systematically locate remaining 4 ships |
| 19 | D3 | miss | Continue Phase 1 checkerboard pattern search (even parity: D=3, row 3; 3+3=6 even) to systematically locate remaining 4 ships. |
| 20 | I2 | miss | Continue Phase 1 checkerboard pattern search (even parity: I=8, row 2; 8+2=10 even) to systematically detect remaining ships. |
| 21 | A1 | miss | Shift to odd-parity cells in Phase 1 checkerboard to systematically locate remaining ships; A1 is the first unfired odd-parity cell in order. |
| 22 | E1 | miss | Continue Phase 1 checkerboard pattern with odd-parity cells (column E=4, row 1; 4+1=5 odd) to systematically detect remaining 4 ships |
| 23 | G1 | miss | Continue Phase 1 odd-parity checkerboard pattern (column G=6, row 1; 6+1=7 odd) to systematically detect remaining ships |
| 24 | F2 | miss | Continue systematic odd-parity checkerboard pattern to detect remaining 4 ships; F2 (column F=5, row 2; parity 7 odd) is the next unfired cell in the logical search sequence. |
| 25 | I1 | miss | Continue odd-parity checkerboard pattern to systematically detect remaining 4 ships in unexplored areas |
| 26 | H2 | miss | Continue systematic checkerboard (odd parity) to complete row 2 search and detect any remaining ships in explored region before moving to deeper rows |
| 27 | F3 | miss | Continue systematic checkerboard pattern (even parity: F=5, row 3; 5+3=8 even) to detect remaining 4 ships in unexplored rows |
| 28 | J3 | miss | Continue systematic search in row 3, focusing on right-side unknown cells where large ships likely hide |
| 29 | E4 | miss | Continue systematic even-parity checkerboard pattern to detect remaining ships in unexplored rows; E4 (column E=4, row 4; parity 8 even) is the next logical cell in left-to-right, top-to-bottom order. |
| 30 | A5 | miss | Continue systematic checkerboard search (odd parity) moving into row 5 where remaining 4 large ships must be located; A5 is the next logical cell in ordered search |
| 31 | A3 | miss | Continue systematic checkerboard pattern (odd parity) in row 3 to locate remaining 4 ships before moving to lower rows where large ships likely hide |
| 32 | B4 | miss | Continue systematic search in row 4 where most cells remain unexplored; B4 is the first unknown cell after the A4 miss in an ordered search pattern. |
| 33 | B7 | miss | Continue systematic checkerboard pattern search in unexplored row 7 to locate remaining 4 ships; B7 has even parity (1+7=8) |
| 34 | D4 | miss | Continue systematic search in row 4; D4 is unknown and part of the logical progression through unexplored cells where remaining large ships must be hiding |
| 35 | E3 | miss | Continue systematic row 3 exploration to detect remaining ships; E3 is an unknown cell that completes coverage of row 3 |
| 36 | J2 | miss | Continue systematic search through unexplored cells; J2 is the only remaining unknown in row 2 and likely to contain a ship endpoint or isolated cell |
| 37 | E8 | miss | Extend search into rows 8-10 where most ships likely remain hidden; E8 continues systematic coverage of the unexplored deep board region |
| 38 | G3 | hit | Extend search into right side of row 3 where most unknown cells remain; large ships likely hiding in unexplored region |
| 39 | G4 | hit | Phase 2: Test cell directly below G3 hit to determine ship orientation (vertical vs horizontal) |
| 40 | G5 | hit | Extend vertical line from G3-G4 downward to find ship extent and determine if it's a Destroyer(2) or larger ship |
| 41 | G6 | hit | Test if the G3-G4-G5 vertical ship extends downward to determine if it's a 3-cell Cruiser or a larger 4+ cell ship |
| 42 | G7 | sunk Carrier | Test if the vertical hit line G3-G4-G5-G6 extends downward to determine if it's the Battleship(4) or Carrier(5) |
| 43 | H3 | miss | Check if any remaining ship extends horizontally adjacent to the sunk Carrier in row 3 |
| 44 | F4 | miss | Systematic exploration of unknown cells adjacent to sunk Carrier region; F4 remains unknown and could be part of Battleship or Cruiser |
| 45 | H4 | miss | Systematic exploration of unknown cells adjacent to sunk Carrier region in row 4; checking if Battleship(4) or Cruiser(3) extends horizontally near previous hit area |
| 46 | I4 | miss | Continue systematic exploration of right-side unknowns in rows 3-7; I4 has even parity and is in concentrated region where remaining ships must hide |
| 47 | H5 | miss | Systematic exploration of unknown cells in row 5, continuing Phase 1 checkerboard-like search in unexplored region adjacent to previous hit area where remaining Battleship, Cruiser, and Destroyer must be hiding. |
| 48 | C5 | miss | Systematic exploration of row 5 unknown cells adjacent to previously sunk Submarine region where remaining Battleship or Cruiser likely extends |
| 49 | I3 | miss | Systematic exploration of remaining unknowns in row 3; I3 is the only unknown cell in row 3 and could contain part of Battleship, Cruiser, or Destroyer |
| 50 | J5 | miss | Continue systematic exploration of row 5 unknowns on the right side where Battleship, Cruiser, or Destroyer likely remain hidden. |
| 51 | D5 | miss | Systematic search in the middle of the largest unexplored cluster (D5-F5 in row 5, D6-F6 in row 6) where Battleship, Cruiser, or Destroyer likely hide. |
| 52 | E6 | miss | Continue systematic search in row 6 where 3 large remaining ships must hide; E6 (even parity) is next logical cell in unexplored cluster |
| 53 | E5 | miss | Continue systematic exploration of the concentrated unknown cluster in rows 5-7 (D-F columns) where remaining Battleship, Cruiser, or Destroyer most likely hide |
| 54 | A8 | miss | Shift focus to the massive unexplored bottom region (rows 8-10) where 3 large ships likely hide; systematic left-to-right, top-to-bottom search from row 8. |
| 55 | B9 | miss | Shift to systematically search rows 9-10 where 3 remaining large ships (Battleship, Cruiser, Destroyer totaling 9 cells) likely hide; B9 continues ordered left-to-right, top-to-bottom sweep. |
| 56 | C8 | miss | Continue systematic left-to-right, top-to-bottom exploration of rows 8-10 where 9 remaining cells must hide Battleship(4), Cruiser(3), Destroyer(2) |
| 57 | D8 | miss | Continue systematic left-to-right sweep through unexplored rows 8-10 where 9 remaining ship cells likely hide |
| 58 | A10 | miss | Continue systematic left-to-right, top-to-bottom search through completely unexplored row 10 where 9 remaining ship cells must hide |
| 59 | B10 | miss | Continue systematic left-to-right, top-to-bottom search through completely unexplored row 10 where remaining 9 ship cells must hide |
| 60 | F8 | miss | Systematically search row 8 where 9 remaining ship cells must hide; F8 continues left-to-right exploration of mostly unexplored bottom region. |
| 61 | G8 | miss | Continue systematic left-to-right sweep through row 8 where 9 remaining ship cells must hide; G8 is the next unknown after F8. |
| 62 | H8 | miss | Continue systematic left-to-right search through row 8 where 9 remaining ship cells must hide; H8 is the next unknown cell after the G8 miss. |
| 63 | C9 | miss | Continue systematic left-to-right sweep through completely unexplored row 9 where 9 remaining ship cells must hide |
| 64 | D9 | miss | Continue systematic left-to-right, top-to-bottom search through row 9 where 9 remaining ship cells must be distributed; D9 is the next unknown cell. |
| 65 | I8 | miss | Continue systematic left-to-right search through unexplored row 8 right side where 9 remaining ship cells must hide |
| 66 | F5 | miss | Continue systematic left-to-right exploration in row 5 where 9 remaining ship cells must be hidden; F5 is an unknown cell adjacent to the sunk Carrier region |
| 67 | I6 | hit | Continue systematic left-to-right search through unexplored row 6 where 9 remaining ship cells must hide |
| 68 | I5 | miss | Phase 2 response to unresolved I6 hit: test vertical neighbor above to determine ship orientation |
| 69 | I7 | sunk Destroyer | Phase 2: Test cell directly below I6 hit to determine ship orientation (vertical vs horizontal) and identify which remaining ship this is. |
| 70 | E9 | hit | Continue systematic bottom-row search (row 9 is largely unexplored) where 7 remaining cells of Battleship(4) and Cruiser(3) must hide; E9 is in the most concentrated unknown cluster |
| 71 | E10 | miss | Test if E9 hit extends downward to resolve ship orientation for remaining Battleship or Cruiser |
| 72 | F9 | hit | Test horizontal extension from E9 hit to determine if remaining ship (Battleship or Cruiser) extends rightward |
| 73 | G9 | hit | E9-F9 are consecutive hits in row 9; extending right to G9 will determine if this is the Battleship (4) or Cruiser (3) and reveal its full extent |
| 74 | H9 | sunk Battleship | Test rightward extension of E9-F9-G9 hit sequence to determine if it's the 4-cell Battleship or 3-cell Cruiser and resolve the last remaining ship |
| 75 | B6 | miss | Systematically search the concentrated unknown cluster in row 6 (B6-D6, F6) where the remaining 3-cell Cruiser is likely hidden among the 16 remaining unknowns |
| 76 | C6 | miss | Search concentrated unknown cluster in rows 6-7 where the remaining Cruiser is most likely hiding |
| 77 | E7 | miss | E7 is the only untested cell in the concentrated unknown cluster (row 7, columns D-F) where the remaining 3-cell Cruiser is most likely hiding given the pattern of misses around it. |
| 78 | D6 | miss | Continue systematic search for the remaining 3-cell Cruiser in the concentrated unknown cluster around rows 6-7 |
| 79 | F6 | miss | F6 is an unknown cell in the concentrated region where the Cruiser likely hides, adjacent to previously explored areas and sunk ships |
| 80 | H6 | miss | Test this unknown cell in row 6, a promising area for the remaining 3-cell Cruiser given the concentrated unknowns and previous ship placements |
| 81 | J6 | miss | Test for a potential vertical 3-cell Cruiser in column J (J6-J7-J8 are all unknown and adjacent) |
| 82 | J7 | miss | Test the vertical column J sequence (J7-J10) where a 3-cell Cruiser is most likely to be concentrated among the 7 remaining unknowns |
| 83 | A7 | miss | Test the row 7 cluster (A7, C7, D7, F7) where the 3-cell Cruiser is most likely hiding among the 7 remaining unknowns |
| 84 | J8 | hit | Test the consecutive vertical sequence J8-J9-J10 as the most likely location for the remaining 3-cell Cruiser |
| 85 | J9 | hit | Adjacent to the J8 hit to determine if the Cruiser extends vertically downward in column J |
| 86 | J10 | sunk Cruiser | Complete the vertical Cruiser in column J by testing the adjacent cell below J9; J7 miss above confirms the ship extends downward from J8-J9 |

## Board 37 · 49 shots

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | A2 | hit | Begin checkerboard pattern (even parity cells) to search for ships efficiently |
| 2 | A1 | miss | Check if ship extends upward from A2 to determine orientation |
| 3 | A3 | hit | Check if the ship at A2 extends downward to determine orientation (vertical vs horizontal) |
| 4 | A4 | hit | Extend downward from confirmed vertical hits at A2-A3 to determine ship length and sink it |
| 5 | A5 | hit | Continue firing downward from the confirmed vertical hit sequence at A2-A3-A4 to determine the full extent of this ship |
| 6 | A6 | sunk Battleship | Extend downward from A5 to determine if the vertical ship in column A is the Carrier(5) or Battleship(4) |
| 7 | B1 | miss | Continue checkerboard pattern (even parity) to search for remaining ships after sinking Battleship |
| 8 | B2 | hit | Continue checkerboard pattern (even parity) to systematically search for remaining 4 ships |
| 9 | C2 | hit | Determine orientation of the ship hit at B2 by testing the horizontal direction (right), since B1 was a miss (left) and A2 is the sunk Battleship |
| 10 | D2 | hit | Continue the horizontal hit sequence at B2-C2 by firing right to identify the ship's full extent and size |
| 11 | E2 | sunk Carrier | Extend the horizontal hit line B2-C2-D2 rightward to determine the full extent and identity of this ship |
| 12 | C1 | miss | Continue checkerboard pattern (even parity) to systematically search for the three remaining ships (Cruiser, Submarine, Destroyer) |
| 13 | D3 | miss | Continue systematic search for remaining 3 ships (Cruiser, Submarine, Destroyer) using efficient coverage pattern |
| 14 | B3 | miss | Continue checkerboard pattern (even parity) to search for remaining 3 ships (Cruiser, Submarine, Destroyer) in unexplored region |
| 15 | C4 | miss | Continue checkerboard pattern (even parity) to search for remaining 3 ships in unexplored region |
| 16 | F1 | miss | Continue checkerboard pattern (even parity) to search for remaining 3 ships in the right portion of the board |
| 17 | G2 | miss | Continue checkerboard (even parity) pattern to search for remaining 3 ships (Cruiser, Submarine, Destroyer) |
| 18 | E1 | miss | Continue checkerboard pattern (even parity) in unexplored upper region to search for remaining 3 ships |
| 19 | D1 | miss | Continue checkerboard pattern (even parity) in upper unexplored region to locate remaining Cruiser, Submarine, or Destroyer |
| 20 | G3 | miss | Continue systematic search for remaining ships (Cruiser, Submarine, Destroyer) in the large unexplored region using checkerboard pattern. |
| 21 | F3 | miss | Continue checkerboard (even parity) pattern in unexplored region to systematically search for remaining Cruiser, Submarine, or Destroyer |
| 22 | H3 | miss | Continue checkerboard pattern (even parity) in unexplored right-center region to systematically search for remaining Cruiser, Submarine, or Destroyer |
| 23 | E4 | hit | Continue checkerboard (even parity) pattern into unexplored rows 4-10 to locate remaining Cruiser, Submarine, or Destroyer ships. |
| 24 | E5 | hit | Test orthogonal adjacent to unresolved hit E4 to determine ship orientation (vertical vs horizontal) and extent |
| 25 | E3 | sunk Cruiser | Test upward from E4-E5 hits to determine the vertical ship's full extent and identify whether it is Destroyer(2), Submarine(3), or Cruiser(3) |
| 26 | H1 | miss | Continue checkerboard (even parity) pattern in upper unexplored region to search for remaining Submarine(3) and Destroyer(2) |
| 27 | G4 | miss | Continue checkerboard (even parity) pattern in unexplored rows 4-10 to systematically locate remaining Submarine(3) and Destroyer(2) ships |
| 28 | A7 | miss | Continue systematic search in unexplored lower region to locate remaining Submarine(3) or Destroyer(2) ships |
| 29 | B8 | miss | Continue systematic search in unexplored lower rows (8-10) for remaining Submarine(3) and Destroyer(2) |
| 30 | B5 | miss | Continue checkerboard (even parity: 1+5=6) pattern in row 5, an underexplored region to locate remaining Submarine(3) or Destroyer(2) |
| 31 | C6 | miss | Continue checkerboard (even parity) pattern in underexplored row 6 to locate remaining Submarine(3) or Destroyer(2) |
| 32 | D5 | miss | Continue checkerboard (even parity) pattern in underexplored row 5 to locate remaining Submarine(3) or Destroyer(2) |
| 33 | C8 | miss | Continue checkerboard (even parity: 2+8=10) pattern in unexplored row 8 to systematically locate remaining Submarine(3) or Destroyer(2) |
| 34 | F9 | hit | Continue checkerboard (even parity: 5+9=14) pattern in unexplored row 9 to systematically locate remaining Submarine(3) and Destroyer(2) |
| 35 | F8 | miss | Test orthogonal adjacent to F9 hit to determine ship orientation (vertical vs horizontal) for remaining Submarine or Destroyer |
| 36 | E9 | miss | Test left of F9 hit to determine ship orientation (horizontal vs vertical) for remaining Submarine or Destroyer |
| 37 | G9 | hit | Determine ship orientation by testing right of unresolved hit at F9; upward and leftward are confirmed misses |
| 38 | H9 | sunk Submarine | Test if the F9-G9 hit ship extends right to determine if it's the 2-cell Destroyer or 3-cell Submarine |
| 39 | I2 | miss | Continue systematic search for the 2-cell Destroyer in an underexplored upper-right region using checkerboard pattern (even parity). |
| 40 | I1 | miss | Upper right region is largely unexplored; checking I1-J1 as potential 2-cell Destroyer location horizontally |
| 41 | C3 | miss | Continue systematic search for 2-cell Destroyer in row 3, an underexplored region between confirmed hits and misses |
| 42 | E8 | miss | Continue even-parity checkerboard search in unexplored row 8 for the remaining 2-cell Destroyer |
| 43 | A10 | miss | Row 10 is completely unexplored; systematically check checkerboard even-parity cells to locate the final 2-cell Destroyer |
| 44 | J1 | miss | Even-parity checkerboard cell in the upper-right unexplored region to efficiently locate the remaining 2-cell Destroyer |
| 45 | F5 | miss | Fire at even-parity cell F5 in underexplored middle-right region to systematically locate the remaining 2-cell Destroyer using checkerboard pattern. |
| 46 | J3 | hit | Even-parity checkerboard cell in upper-right underexplored region to locate the remaining 2-cell Destroyer |
| 47 | I3 | miss | J3 is a hit; test if Destroyer extends left (I3-J3 horizontal) to sink the final ship |
| 48 | J4 | miss | J3 is a hit; I3 and J2 are misses; Destroyer must extend vertically downward to J4 to sink it |
| 49 | J2 | sunk Destroyer | J3 is a hit; I3 and J4 are misses; J2 is the only untested adjacent cell, must contain the Destroyer |

