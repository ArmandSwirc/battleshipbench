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

