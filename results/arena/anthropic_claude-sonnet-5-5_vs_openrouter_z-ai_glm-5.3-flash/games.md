# claude-sonnet-5-5 vs glm-5.3-flash

1 game, newest first. Board images: [overview.svg](overview.svg), raw data: [run.json](run.json).

## 2026-11-02T05:49:53.064Z · standard · claude-sonnet-5-5 won in 48 shots

### claude-sonnet-5-5 (A) · won · 48 shots · 17 hits

**Strategy: Parity-jacht met kansdichtheid**

> DOEL: sneller alle 5 vijandelijke schepen zinken dan de tegenstander. Speel efficiënt en consistent; elke beurt is één schot, dus geen verspilde schoten.
> 
> (1) PLAATSING VLOOT
> - Plaats onregelmatig en onvoorspelbaar; vermijd vaste patronen. Een mix van randen en binnenste posities, want veel AI's schieten schaakbord/centrum.
> - Concreet voorbeeld (pas gerust aan met een eigen variatie): Carrier verticaal in kolom A of J (bijv. J2-J6); Battleship horizontaal op een binnenrij (bijv. C8-F8); Cruiser verticaal in het midden-links (bijv. D2-D4); Submarine horizontaal (bijv. F5-H5) of verticaal op een niet-voor-de-hand-liggende plek; Destroyer ergens aan een rand of in een hoek (bijv. A10-B10 of I10-J10).
> - Niet alle schepen langs de rand en niet allemaal in het centrum. Schepen mogen elkaar raken; gebruik dat om ruimte te maken voor onverwachte posities. Vermijd twee schepen die een duidelijk herkenbaar patroon vormen (parallel naast elkaar op rij).
> - Geen diagonale of overlappende schepen; controleer dat alles volledig op het bord ligt.
> 
> (2) ZOEKEN (geen open hit)
> - Gebruik parity: schiet alleen cellen waar (kolomindex + rij) even is (schaakbordpatroon). Zo vindt elk schip van lengte ≥2 gegarandeerd een raak. Begin in/nabij het centrum, want daar zijn de meeste scheepsposities mogelijk (hoogste kansdichtheid), en werk naar buiten in een verspreide, niet-lineaire volgorde.
> - Schat per cel de kansdichtheid: tel hoeveel plaatsingen van de nog levende schepen (met hun lengte) die cel zouden bedekken, zonder bekende missers of gezonken cellen te overlappen. Kies de parity-cel met de hoogste dichtheid.
> - Als de Destroyer (2) is gezonken, blijft parity 2 nog goed zolang de kleinste levende schip 3 is: dan mag je parity 3-patroon overwegen (cellen waar (kolom+rij) mod 3 = 0) alleen als het duidelijk sneller is; anders blijf bij schaakbord. Als alleen nog schepen van lengte ≥3 leven, kies de cel met hoogste dichtheid en sla cellen over waar geen schip van minimale lengte past.
> - Cellen waar geen levend schip meer past (omringd door missers/randen) nooit schieten.
> 
> (3) VOLGEN NA EEN RAAK (hunt → target)
> - Na een raak: schiet de vier buren (boven, onder, links, rechts) die nog onbeschoten en binnen het bord zijn; begin met de buur die de meeste mogelijke plaatsingen heeft (richting waar de meeste vrije ruimte is voor langste levende schip).
> - Zodra twee aaneengesloten raken een lijn vormen: schiet langs die lijn door in beide richtingen tot het schip gezonken is of een miss aan beide uiteinden. Probeer eerst de kant met de meeste vrije ruimte.
> - Als een uiteinde een miss is, ga naar het andere uiteinde. Als beide uiteinden miss zijn maar het schip nog niet gezonken is, dan zijn er twee schepen naast elkaar: werk de losse raken apart af.
> - Als de gezonken scheepslengte minder is dan het aantal raken in de lijn, blijven de overige raken bij een ander schip horen: ga door met die raken en behandel ze als open doelen (eerst afmaken voordat je weer zoekt).
> - Zodra een schip is gezonken: markeer alle cellen ervan als afgehandeld, controleer of er nog onverklaarde raken zijn, en pak die eerst. Pas daarna terug naar zoeken.
> - Bij meerdere open raken: kies altijd het doel waarmee je met de minste schoten een schip kunt zinken (bijv. een lijn van 2 raken met open uiteinden vóór een losse raak).
> 
> SNELHEID VS VEILIGHEID
> - Het is een race, maar efficiëntie wint: geen gokken op willekeurige cellen; altijd de hoogste kansdichtheid. Volg altijd direct op een raak (geen uitstel), want elk open raak is verloren tempo als je het laat liggen.
> - Verander niets aan de plaatsing op basis van angst; de beste verdediging is een onvoorspelbare opstelling plus een sneller eigen tempo.
> - Houd bij welke schepen nog leven en welke lengtes dat zijn; werk de kansdichtheid bij na elke zink.
> - Afwijken van parity mag alleen als een raak of een zinken de kansverdeling duidelijk verandert (bijv. een gat van precies 2 cellen waar alleen het Destroyer past terwijl die al gezonken is: dan overslaan).

**Fleet placement:** own placement

> Deze opstelling volgt mijn plan: de Carrier staat verticaal langs de rand (J2-J6), de Battleship horizontaal op een binnenrij (C8-F8), de Cruiser verticaal links van het midden (D2-D4), de Submarine horizontaal in het midden (F5-H5) en de Destroyer in de hoek (A10-B10), zonder herkenbaar patroon, zonder overlap en volledig op het bord.

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | E5 | miss | Begin in het centrum op een pariteitscel (E=5, rij 5 geeft even som) met de hoogste kansdichtheid. |
| 2 | F6 | hit | Pariteitscel (F=6, rij 6, even som) diagonaal naast de misser E5, dicht bij het centrum met hoge kansdichtheid. |
| 3 | F7 | miss | Raak op F6: ik schiet nu een buur af; F7 (onder) heeft veel vrije ruimte in de kolom en E6 links grenst aan de misser E5. |
| 4 | G6 | miss | Buur van de raak F6 met veel vrije ruimte rechts voor een horizontale lijn; F7 is al een misser. |
| 5 | E6 | hit | Buur van de open raak F6; F7 en G6 zijn missers, dus het schip loopt waarschijnlijk naar links met veel vrije ruimte. |
| 6 | D6 | hit | E6 en F6 vormen een horizontale lijn en G6 is een misser, dus het schip loopt verder naar links via D6. |
| 7 | C6 | sunk Battleship | De lijn D6-E6-F6 heeft rechts een misser (G6), dus ik ga links door met C6 om het schip af te maken. |
| 8 | D4 | miss | Pariteitscel (D=4, rij 4) in het open centrum met hoge kansdichtheid, ver van de gezonken Battleship en de missers, om de overige schepen te zoeken. |
| 9 | H4 | miss | Pariteitscel (H=8, rij 4, even som) in open gebied rechtsboven met veel vrije ruimte in zowel rij als kolom, ver van de missers en het gezonken Battleship. |
| 10 | G5 | miss | G5 ligt op een pariteitscel (even som) en heeft veel vrije ruimte in rij 5 en kolom G, dus de kansdichtheid is hoog voor de resterende schepen. |
| 11 | H8 | miss | H8 ligt op een pariteitscel en heeft veel vrije ruimte in rij 8 en kolom H, dus de kansdichtheid voor de resterende schepen is hoog. |
| 12 | E3 | miss | E3 is een pariteitscel met een open rij 3 en vier vrije cellen in kolom E, dus de kansdichtheid voor de overgebleven schepen is hoog. |
| 13 | G3 | miss | G3 ligt op een pariteitscel met veel vrije ruimte in rij 3 en kolom G, dus de kansdichtheid voor de resterende schepen is hoog. |
| 14 | F2 | miss | F2 ligt op een pariteitscel met een volledig open rij 2 en een open kolom F (F1-F5), dus de kansdichtheid voor de resterende schepen is hoog. |
| 15 | E9 | hit | E9 is een pariteitscel met een volledig open rij 9 en vier vrije cellen in kolom E, dus de kansdichtheid voor de resterende schepen is hoog. |
| 16 | F9 | sunk Destroyer | Open raak op E9: ik schiet de buur rechts af, want rij 9 is volledig open en daar past een schip het best. |
| 17 | I5 | miss | I5 is een pariteitscel met een volledig open kolom I en ruimte voor een Carrier of een 3-cel schip, dus hoge kansdichtheid voor de resterende schepen. |
| 18 | C3 | miss | C3 ligt op een pariteitscel met ruimte voor een Carrier in kolom C (C1-C5) en rij 3 (A3-D3), dus hoge kansdichtheid voor de resterende schepen. |
| 19 | B8 | miss | B8 is een pariteitscel met de hoogste kansdichtheid: kolom B is volledig open en rij 8 biedt ruimte voor Carrier en 3-cel schepen. |
| 20 | B4 | miss | B4 heeft de hoogste kansdichtheid op een pariteitscel: kolom B is bijna vrij voor Carrier en 3-cel schepen en rij 4 biedt ook ruimte. |
| 21 | D8 | miss | D8 is een pariteitscel met veel vrije ruimte in rij 8 (C8-G8) en kolom D (D7-D10), dus hoge kansdichtheid voor Carrier, Cruiser en Submarine. |
| 22 | I7 | miss | I7 ligt op een pariteitscel met ruimte voor een Carrier in kolom I (I6-I10) en voor een 3-cel schip in rij 7 (G7-J7), dus een hoge kansdichtheid. |
| 23 | J6 | miss | In de randkolom J is veel vrije ruimte voor Carrier en 3-cel schepen, en J6 ligt op een pariteitscel met de hoogste kansdichtheid. |
| 24 | D2 | miss | D2 ligt op een pariteitscel in de open bovenhoek, waar de Carrier (A2-E2) en 3-cel schepen nog passen, dus hoge kansdichtheid. |
| 25 | A5 | hit | A5 ligt op een pariteitscel in de volledig open kolom A, waar de Carrier en beide 3-cel schepen het vaakst passen, dus de kansdichtheid is hoog. |
| 26 | A6 | hit | Open raak op A5: ik schiet de buur eronder af, want kolom A heeft daar de meeste vrije ruimte voor een verticaal schip. |
| 27 | A4 | hit | A5 en A6 vormen een verticale lijn, dus ik schiet door naar boven op A4 om het schip af te maken. |
| 28 | A7 | hit | A4-A6 zijn geraakt maar niets is gezonken, dus het is waarschijnlijk de Carrier; ik schiet door langs de lijn naar beneden. |
| 29 | A3 | sunk Carrier | Vier raken in kolom A (A4-A7) zonder zinken, dus het schip loopt door; ik verleng de lijn naar boven met A3. |
| 30 | C9 | miss | Pariteitscel met de hoogste kansdichtheid voor de overgebleven Cruiser en Submarine, want zowel rij 9 als kolom C bieden daar nog meerdere plaatsingen van 3 cellen. |
| 31 | I2 | miss | Rechtsboven passen de Cruiser en Submarine op de meeste manieren, en I2 heeft de hoogste kansdichtheid onder de overgebleven vrije cellen. |
| 32 | H1 | miss | Rij 1 is bijna volledig open en H1 zit ook in een verticale plaatsing (H1-H3), dus hier passen de Cruiser en Submarine op de meeste manieren. |
| 33 | G10 | miss | Op G10 passen de meeste plaatsingen van de resterende Cruiser en Submarine (drie horizontaal in rij 10 en één verticaal G8-G10). |
| 34 | I9 | miss | Pariteitscel met hoogste kansdichtheid: hier passen de Cruiser en Submarine op drie manieren (twee horizontaal in rij 9 en één verticaal I8-I10). |
| 35 | J3 | miss | Alleen Cruiser en Submarine (3) zijn nog over; J3 heeft de meeste mogelijke plaatsingen (verticaal in kolom J en horizontaal H3-J3). |
| 36 | E1 | miss | Alleen Cruiser en Submarine (3) zijn nog over; rij 1 is bijna open, dus E1 ligt in drie mogelijke plaatsingen van 3 cellen en heeft de hoogste kansdichtheid. |
| 37 | D10 | miss | Alleen Cruiser en Submarine (3) zijn nog over; D10 ligt in drie mogelijke plaatsingen van 3 cellen in de open rij 10, de hoogste kansdichtheid. |
| 38 | B1 | miss | Alleen Cruiser en Submarine (3 cellen) zijn nog over; B1 ligt in drie mogelijke plaatsingen (A1-C1, B1-D1 en B1-B3), meer dan welke andere vrije cel ook. |
| 39 | D7 | miss | Alleen Cruiser en Submarine (3 cellen) leven nog; D7 ligt in twee mogelijke horizontale plaatsingen (B7-D7 en C7-E7), het maximum op het bord. |
| 40 | G8 | miss | G8 is nog onbeschoten en ligt in twee mogelijke plaatsingen van 3 cellen (E8-G8 en G7-G9), het maximum op het bord. |
| 41 | F4 | hit | Alleen Cruiser en Submarine (3 cellen) zijn nog over; F4 ligt in twee mogelijke plaatsingen (E4-G4 en F3-F5), het maximum op het bord. |
| 42 | E4 | miss | F4 is een open raak; alleen E4-G4 horizontaal of F3-F5 verticaal past nog, dus ik probeer E4 om de richting te bepalen. |
| 43 | F5 | hit | Horizontaal past er geen schip meer bij F4, dus de enige plaatsing is verticaal F3-F5; F5 is daarvan een van de twee ontbrekende cellen. |
| 44 | F3 | sunk Cruiser | F4 en F5 vormen een verticale lijn; F6 is al van de gezonken Battleship en F2 is een misser, dus F3 is de enige cel die het schip van 3 kan afmaken. |
| 45 | B5 | miss | Alleen de Submarine (3) leeft nog; B5 ligt in twee mogelijke plaatsingen (B5-D5 en B5-B7), het maximum op het bord. |
| 46 | J9 | hit | Alleen de Submarine (3) leeft nog; J9 ligt in twee van de weinige resterende plaatsingen (J7-J9 en J8-J10), het maximum op het bord. |
| 47 | J8 | hit | J9 is geraakt en I9 is een misser, dus de Submarine ligt verticaal; J8 zit in beide mogelijke plaatsingen (J7-J9 en J8-J10). |
| 48 | J10 | sunk Submarine | J7 is een misser, dus de Submarine ligt op J8-J10 en J10 zinkt hem. |

### glm-5.3-flash (B) · lost · 47 shots · 15 hits

**Strategy: Schaakmat**

> PLAATSING (mijn vloot): Ik plaats mijn schepen in een vast patroon dat ik zelf kan onthouden: Carrier verticaal op A3-A7, Battleship horizontaal op C9-C6 (C6-C9), Cruiser verticaal op F3-F5, Submarine horizontaal op J8-J10 (J8, J9, J10), Destroyer horizontaal op E9-F9. Schepen mogen elkaar raken; dit patroon vermijdt dat mijn schepen zich in een voorspelbaar blok concentreren en spreidt ze over hoeken en midden. Ik noteer mijn eigen plaatsing altijd eerst in mijn antwoord zodat ik consistent blijf. ZOEKFASE (geen hits): Ik gebruik een schaakbordpatroon met parity: ik schiet alleen op cellen waar (kolomindex + rijindex) even is, want elk schip (minimaal lengte 2) dekt altijd minstens één even cel. Volgorde: eerst de meest kansrijke even cellen volgens waarschijnlijkheidsdichtheid: ik richt me op het midden (kolommen C-H, rijen 3-8) omdat daar de meeste schepen van lengte 3-5 passen, en werk daarna naar de randen. Concrete zoekvolgorde: E5, D6, F4, G7, C5, H6, E8, F2, D8, G4, C7, H4, E2, F8, B6, I5, etc. (altijd even-pariteit, midden eerst, randen later). Ik houd bij welke cellen al beschoten zijn en welke schepen van de tegenstander nog over zijn. OPSPOREN NA HIT: Na een hit schakel ik over naar gericht zoeken. 1) Probeer directe buren: boven, onder, links, rechts van de hit. 2) Na een tweede hit op dezelfde as bepaal ik de richting en blijf in die richting schieten tot het schip zinkt. 3) Als een schip zinkt maar ik heb nog een onverklaarde hit in de buurt (of een schip van lengte 5 kon niet passen op de gemarkeerde lijn), test ik de andere richting verder: b.v. na een verticaal gedeelte check ik of de hit-reeks horizontaal verlengd kan worden als het gezonken schip korter lijkt dan het aantal hits. 4) Ik houd altijd een lijst bij van hits die nog niet aan een gezonken schip zijn toegewezen. Gebruik van scheplengtes: als alleen nog grote schepen over zijn, zoek ik alleen op posities waar die lengte nog past (geen enkele-cel gaten meer schieten die alleen een Destroyer zouden kunnen bevatten als die al gezonken is). SNPHEID VS VEILIGHEID: Snelheid wint het duel: ik volg mijn parity-zoeklijst zonder aarzelen en stopt nooit met schieten. Als het onduidelijk is (mogelijk twee overlappende schepen bij hits), kies ik de gok die de meeste resterende scheplengtes kan verklaren. Ik bereken nooit oneindig lang: ik maak per beurt direct een beslissing op basis van de regels hierboven en mijn meest recente miss/hit-informatie. Deviatie: alleen als 80%+ van de even midden-cellen beschoten is, breid ik uit naar oneven cellen, beginnend bij cellen die aan meerdere onverklaarde hits grenzen.

**Fleet placement:** own placement

> Ik plaats mijn vloot volgens mijn vaste patroon: gespreid over hoeken en midden, met de Submarine verticaal op J8-J10 zodat alles binnen het bord blijft.

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | E5 | miss | Eerste schot volgens mijn parity-zoeklijst: even-pariteit, midden van het bord. |
| 2 | D6 | miss | Volgende even-pariteitscel uit mijn zoeklijst, midden van het bord. |
| 3 | F4 | miss | Volgende even-pariteitscel uit mijn zoeklijst (F4), midden van het bord, nog niet beschoten. |
| 4 | G7 | miss | Volgende even-pariteitscel uit mijn zoeklijst; nog geen hits dus blijf ik het schaakbordpatroon in het midden volgen. |
| 5 | C5 | miss | Geen hits voor mij, dus blijf ik de even-pariteitszoeklijst in het midden volgen: C5 is de volgende kansrijke cel. |
| 6 | H6 | miss | Geen hits voor mij, dus blijf ik de even-pariteitszoeklijst in het midden volgen: H6 is de volgende kansrijke onbeschoten cel. |
| 7 | E8 | hit | Geen hits voor mij, dus volg ik mijn even-pariteitszoeklijst in het midden: E8 is de volgende kansrijke onbeschoten cel. |
| 8 | E7 | miss | Hit op E8: ik test directe buren, E7 verlengt verticaal richting het midden waar grote schepen vaker liggen. |
| 9 | E9 | miss | Hit op E8, E7 was een mis; ik verleng verticaal naar beneden richting E9 om de richting van het schip te bepalen. |
| 10 | F8 | hit | Hit op E8 met misses op E7 en E9; ik test de horizontale buren, F8 ligt aan de even-pariteitslijn richting het midden. |
| 11 | G8 | miss | E8 en F8 zijn hits op een horizontaal schip; ik verleng richting het midden met G8 om de richting te bevestigen. |
| 12 | D8 | hit | Hit op E8 en F8 duidt op een horizontaal schip; G8 was een mis, dus ik verleng links naar D8 om de richting te bevestigen en het schip te vinden. |
| 13 | C8 | sunk Battleship | D8-E8-F8 zijn hits op een horizontaal schip; G8 was een mis, dus ik verleng links naar C8 om de rest van het schip te vinden. |
| 14 | C3 | miss | Even-pariteitscel in het midden; C3-G3 is een open lijn van 5 waar de Carrier nog kan liggen. |
| 15 | F2 | miss | Volgende even-pariteitscel uit mijn zoeklijst; Battleship is gezonken, dus terug naar de parity-zoektocht voor de overige schepen. |
| 16 | H4 | miss | Even-pariteitscel in het midden; kolom H en rij 4 zijn nog open en bieden plek voor de Carrier(5), dus volg ik mijn zoeklijst na de gezonken Battleship. |
| 17 | G5 | hit | Even-pariteitscel (G5) in het midden, nog open, met veel ruimte voor de overige schepen (Carrier 5, Cruiser 3, Submarine 3, Destroyer 2). |
| 18 | G4 | miss | G5 is een onverklaarde hit; horizontaal kan de Carrier niet meer passen (E5 is mis), dus test ik de verticale optie naar boven, waar de meeste scheplengten (incl. Carrier G1-G5/G2-G6) nog uitkomen. |
| 19 | F5 | hit | G5 is een onverklaarde hit met G4 en G7 als mis; verticaal is onmogelijk, dus test ik horizontaal naar links — F5-J5 is nog de enige Carrier-optie op rij 5. |
| 20 | H5 | sunk Submarine | F5 en G5 zijn hits op een horizontaal schip (E5 mis, verticaal onmogelijk); het schip is niet gezonken bij 2 hits, dus verleng ik rechts met H5 (Carrier F5-J5 of Cruiser/Submarine F5-H5). |
| 21 | I5 | miss | Even-pariteitscel met maximale dichtheid: kolom I is volledig open, dus I5 dekt vijf mogelijke Carrier-plaatsen (I1-I5 t/m I5-I9) plus meerdere Cruiser-opties. |
| 22 | B6 | miss | Even-pariteitscel die in vijf mogelijke Carrier-plaatsen (kolom B verticaal) en meerdere Cruiser-opties ligt; kolom B is nog volledig open en centraal kansrijk. |
| 23 | J6 | hit | Even-pariteitscel met de hoogste Carrier-dekking: kolom J is volledig open (5 van de 33 mogelijke Carrier-plaatsen) plus meerdere Cruiser-/Destroyer-opties. |
| 24 | J7 | miss | J6 is een onverklaarde hit; J7 verlengt verticaal en dekt de meeste Carrier-opties in kolom J (J3-J7 t/m J6-J10) plus Cruiser- en Destroyer-mogelijkheden. |
| 25 | J5 | hit | J6 is een onverklaarde hit, J7 was een mis en horizontaal is beperkt, dus ik verleng verticaal omhoog naar J5 om richting te bepalen. |
| 26 | J4 | hit | J5 en J6 zijn hits met J7 als mis; het schip loopt waarschijnlijk verticaal omhoog, dus J4 verlengt de reeks richting Carrier (J2-J6) of Cruiser (J4-J6). |
| 27 | J3 | hit | J4-J6 zijn hits met J7 als mis; J3 verlengt verticaal omhoog om te bepalen of het de Carrier (J2-J6) of de Cruiser (J4-J6) is. |
| 28 | J2 | sunk Carrier | J3-J6 zijn vier hits; de enige consistente verklaring is de Carrier op J2-J6 (J7 is een mis, overlap met Cruiser/Destroyer is onmogelijk), dus J2 zinkt de Carrier. |
| 29 | A4 | miss | A4 dekt 6 mogelijke Cruiser-plaatsen (kolom A en rij 4 zijn open), de hoogste dekking voor het grootste resterende schip; lichte afwijking van parity omdat kansmaximalisatie hier telt. |
| 30 | D4 | hit | D4 is een even-pariteitscel in het midden met 4 mogelijke Cruiser-plaatsen en 4 Destroyer-plaatsen (8 totaal), de hoogste dekking onder de beschikbare even-pariteitscellen. |
| 31 | E4 | miss | Hit op D4: ik test de oostelijke buur E4 om de richting van de Cruiser of Destroyer te bepalen (C4-D4-E4 of D4-E4). |
| 32 | D3 | hit | Hit op D4: E4 was een mis, dus verticaal testen; D3 dekt zowel Cruiser D2-D4 als D3-D5 plus Destroyer D3-D4. |
| 33 | D5 | miss | D3-D4 zijn hits; D5 verlengt verticaal en zinkt bij een treffer de Cruiser (D3-D5), de meest waarschijnlijke verklaring. |
| 34 | D2 | sunk Cruiser | D3-D4 zijn hits; D5 was een mis, dus de Cruiser kan alleen D2-D4 of D1-D3 zijn — D2 verklaart bij een treffer direct de Cruiser (D2-D4). |
| 35 | H2 | miss | Destroyer(2) is het enige resterende schip; H2 is een even-pariteitscel die aan vier mogelijke 2-cellplaatsingen grenst (G2-H2, H2-I2, H1-H2, H2-H3), de hoogste dekking op het bord. |
| 36 | B2 | miss | Destroyer-jacht: B2 is een nog onbeschoten even-pariteitscel met vier mogelijke 2-celplaatsingen eromheen (B1, B3, A2, C2), de hoogste dekking op het bord. |
| 37 | I8 | miss | I8 heeft vier mogelijke Destroyer-plaatsingen eromheen (H8, I7, I9, J8 zijn allemaal open), de hoogste dekking op het bord. |
| 38 | H9 | miss | H9 heeft vier mogelijke Destroyer-plaatsingen (H8-H9, H9-H10, G9-H9, H9-I9), de hoogste kans op het bord om de laatste boot te vinden. |
| 39 | B9 | miss | B9 dekt vier mogelijke Destroyer-plaatsingen (A9-B9, B9-C9, B9-B10, B8-B9), de hoogste kans op het bord voor het laatste schip. |
| 40 | C7 | miss | C7 heeft drie mogelijke Destroyer-plaatsingen (B7-C7, C7-D7, C6-C7), de hoogste dekking op het bord, centraal en even-pariteit. |
| 41 | G3 | miss | G3 heeft drie mogelijke Destroyer-plaatsingen (F3-G3, G3-H3, G2-G3), de hoogste dekking op het bord onder de even-pariteitscellen. |
| 42 | F6 | miss | F6 is centraal, even-pariteit en dekt drie mogelijke Destroyer-plaatsingen (E6-F6, F6-G6, F6-F7), de hoogste dekking op het bord. |
| 43 | B4 | miss | B4 heeft drie mogelijke Destroyer-plaatsingen (B3-B4, B4-C4, B4-B5), de hoogste dekking op het bord, centraal en consistent met mijn midden-eerst strategie. |
| 44 | I3 | miss | I3 valt in drie mogelijke Destroyer-plaatsingen (H3-I3, I2-I3, I3-I4), de hoogste dekking op het bord, centraal-rechts waar de vijandelijke vloot zich tot nu toe concentreerde. |
| 45 | F10 | miss | De Destroyer(2) is het laatste schip; rij 9/10 is de grootste ononderzochte regio en F10 dekt drie mogelijke plaatsingen (E10-F10, F10-G10, F9-F10), de hoogste kans op het bord. |
| 46 | D10 | miss | D10 dekt drie mogelijke Destroyer-plaatsingen (C10-D10, D10-E10, D9-D10) in de grootst ononderzochte regio nabij waar de vijandelijke Destroyer al eerder lag, de hoogste kans op het bord. |
| 47 | E1 | miss | E1 dekt drie mogelijke Destroyer-plaatsingen (D1-E1, E1-F1, E1-E2) in de nog volledig open rij 1, de hoogste dekking samen met de andere topkandidaten. |

