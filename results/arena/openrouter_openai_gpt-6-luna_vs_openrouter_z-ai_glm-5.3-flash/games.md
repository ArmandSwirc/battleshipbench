# gpt-6-luna vs glm-5.3-flash

1 game, newest first. Board images: [overview.svg](overview.svg), raw data: [run.json](run.json).

## 2026-10-30T07:18:34.786Z · free play · gpt-6-luna won in 30 shots

### gpt-6-luna (A) · won · 30 shots · 17 hits

**Strategy: Rasterjager**

> Plaatsing: kies een verborgen, onregelmatige vlootopstelling: idealiter een willekeurige legale configuratie, zonder overlapping, met een mix van horizontale en verticale schepen en zonder voorspelbaar patroon. Spreid de schepen enigszins over het bord, maar maak geen symmetrische opstelling en zet ze niet allemaal langs randen of in hoeken. Schepen mogen elkaar raken; behandel dat niet als verboden. Geef bij twijfel de voorkeur aan onvoorspelbaarheid boven een vaste formatie.
> 
> Zoeken zolang er geen onopgeloste treffers zijn: houd elke afgevuurde cel bij en schiet nooit opnieuw op dezelfde cel. Bereken, voor elk niet-gezonken scheepstype, alle horizontale en verticale plaatsingen die binnen het bord passen en geen gemiste of anderszins uitgesloten cel raken. Kies de niet-beschoten cel die in de meeste van die mogelijke plaatsingen voorkomt; weeg scheepstypen gelijk en tel plaatsingen per type mee. Trek gezonken schepen uit de berekening. Leg nooit een aanname op dat schepen niet naast elkaar mogen liggen. Bij gelijke scores kies je een cel op het schaakbordraster A1, A3, …, B2, B4, … (dezelfde kleur als A1), zolang er nog een schip van lengte 2 of meer over is; anders kies je de cel met de hoogste score. Als nauwkeurig tellen niet haalbaar is, gebruik dan dit raster als zoekpatroon en kies daarbinnen systematisch cellen met de meeste nog mogelijke scheepsplaatsingen. Werk het model na elke uitslag bij.
> 
> Na een treffer: schakel over op doelzoeken en geef prioriteit aan het tot zinken brengen van elk geraakt maar niet-gezonken schip voordat je weer breed zoekt. Bij één losse treffer schiet je op nog niet beschoten orthogonale buren; kies eerst richtingen waarin de resterende scheepslengtes het best passen. Zodra twee treffers van hetzelfde schip op één lijn liggen, schiet je verder op de open uiteinden van die lijn, waarbij je onmogelijke of al beschoten cellen overslaat. Gebruik geen diagonale schoten om een schip te volgen. Een melding ‘gezonken’ bevestigt welke scheepslengte is weggehaald: registreer de bijbehorende treffers als dat schip en verwijder die lengte uit de zoekberekening. Schiet niet automatisch op de buren van een gezonken schip: andere schepen mogen eraan grenzen.
> 
> Omdat schepen elkaar mogen raken, kunnen treffers naast of in lijn met elkaar van verschillende schepen zijn. Neem dus niet aan dat elke aaneengesloten groep treffers één schip is. Houd alle nog niet toegewezen treffers bij; werk na een zinkmelding de resterende treffers verder af voordat je teruggaat naar zoeken. Als de indeling dubbelzinnig is, kies een schot dat zowel een mogelijke verlenging van een geraakt schip test als bruikbaar blijft voor andere mogelijke scheepsplaatsingen.
> 
> Tempo en discipline: dit is een race, dus maximaliseer de kans op een treffer per schot en verspil geen schoten aan herhaling of aan cellen die door de uitslagen onmogelijk zijn. In de zoekfase gebruik je de plaatsingsscore; in de doelmodus accepteer je de kleine omweg die nodig is om een geraakt schip af te maken. Houd een nauwkeurige lijst bij van missers, treffers, gezonken schepen en nog openstaande doelen.

**Fleet placement:** own placement

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | E5 | miss |  |
| 2 | F6 | miss |  |
| 3 | D4 | miss |  |
| 4 | G5 | hit |  |
| 5 | H5 | miss |  |
| 6 | G4 | miss |  |
| 7 | G6 | hit |  |
| 8 | G7 | hit |  |
| 9 | G8 | sunk Battleship |  |
| 10 | C3 | miss |  |
| 11 | F2 | hit |  |
| 12 | E2 | hit |  |
| 13 | D2 | hit |  |
| 14 | C2 | hit |  |
| 15 | G2 | miss |  |
| 16 | B2 | sunk Carrier |  |
| 17 | E9 | miss |  |
| 18 | C7 | hit |  |
| 19 | D7 | hit |  |
| 20 | E7 | sunk Cruiser |  |
| 21 | B6 | miss |  |
| 22 | I3 | hit |  |
| 23 | I4 | hit |  |
| 24 | I2 | sunk Submarine |  |
| 25 | B8 | miss |  |
| 26 | C9 | hit |  |
| 27 | D9 | miss |  |
| 28 | C8 | miss |  |
| 29 | C10 | miss |  |
| 30 | B9 | sunk Destroyer |  |

### glm-5.3-flash (B) · lost · 29 shots · 16 hits

**Strategy: Schaakbord-Jager**

> (1) PLAATSING: Ik plaats mijn 5 schepen bij voorkeur in het binnenste bord (rijen 2-9, kolommen B-I), nooit in de hoekcellen (A1, A10, J1, J10) en zo minimaal op de buitenste rand, omdat de randen de slechtste plaatsingskans hebben voor tegenstanders maar wél vaak eerst gescand worden via midden/pariteitspatronen -- dus ik vermijd juist de 'voor de hand liggende' middenrijen 4-7 niet volledig, maar spreid. Concrete regels: (a) geen twee schepen raken elkaar (altijd minstens 1 lege cel ertussen, ook diagonaal), zodat een enkele hit niet op twee schepen tegelijk wijst; (b) ik meng horizontaal en verticaal (bijv. 2 horizontaal, 3 verticaal), nooit alles in dezelfde richting; (c) ik verdeel over de vier kwadranten van het bord, geen kwadrant met meer dan 2 schepen; (d) Carrier (5) plaats ik langs een rand-parallelle lijn op rij 2/9 of kolom B/I waar hij het langst 'onaantastbaar' lijkt, Destroyer (2) plaats ik juist dichtbij een hoekregio maar niet ín de hoek; (e) ik kies een vaste vaste voorkeursindeling vooraf in mijn hoofd en houd me daaraan, met kleine willekeurige verschuivingen zodat het niet voorspelbaar is. (2) ZOEKFASE (geen hits yet): Ik schiet volgens pariteitspatroon: ik nummer cellen als (kolomindex + rijindex) en schiet eerst alleen op even pariteit, in volgorde van hoogste waarschijnlijkheid: midden van het bord eerst (cellen D3-G8-gebied), daarna naar buiten toe. Zodra alle schepen van lengte 2 gezonken zijn, schakel ik over op pariteitsafstand 3 (alleen cellen waar kolom+rij deelbaar door 3), want kleinste overgebleven schip is dan minimaal 3 lang -- dit scheelt enorm veel schoten. Ik houd altijd een schietlijst bij van nog niet beschoten pariteitscellen, gerangschikt op aantal mogelijke scheplaatsingen dat die cel dekt (kansdichtheid): cellen met meer ruimte eromheen (niet tegen rand, niet naast bekende miss-zones) krijgen prioriteit. Elke miss verlaagt de kans van aangrenzende lijnplaatsingen; dat verwerk ik impliciet door bij het kiezen telkens de cel te pakken die de meeste nog-mogelijke plaatsingen van overgebleven schepen raakt. (3) OPVOLGEN NA HIT: Bij een hit schakel ik onmiddellijk naar target-modus en laat de zoekpariteit los. Stap 1: schiet op de buren boven/onder/links/rechts van de hit (volgorde: bij voorkeur richting met de meeste vrije ruimte en where minder al-beschoten cellen blokkeren). Stap 2: bij een tweede hit in lijn weet ik de oriëntatie; ik verleng de lijn aan beide kanten totdat het schip zinkt, beginnend aan de kant met de meeste onbeschoten ruimte. Stap 3: als een hit geen vervolg oplevert aan een kant en het schip nog niet gezonken is, test ik de andere zijde. Stap 4: bij sinking gebruik ik de gemelde scheplengte: markeer alle cellen van dat schip als bezet en verwerk dat in mijn kansmodel (mogelijke plaatsingen van resterende schepen afnemend). Belangrijk: ik houd de resterende vlootbij in gedachten bij elk schot: zodra bijv. nog alleen Carrier(5)+Cruiser(3)+Destroyer(2) over zijn, weeg ik lange lijnruimtes zwaarder. (4) SNELHEID vs VEILIGHEID: Dit is een race: ik kies altijd het schot met de hoogste verwachte informatie+kans op hit, geen conservatieve spelletjes. Als ik schepen voor sta (tegenstander heeft minder schepen gezonken dan ik), blijf ik agressief op kansmaximale cellen schieten. Als ik achter sta, verhoog ik de prioriteit van het afmaken van halfgeraakte schepen boven nieuw zoeken: een schip van 1 hit af is vaak sneller af te maken dan een nieuw schip te vinden. (5) DISCIPLINE: nooit schieten buiten de regels hierboven tenzij target-modus actief is; elke beurt eerst: zijn er hits zonder sinking? Dan target-modus afmaken. Anders: hoogste kansdichtheid-pariteitscel schieten. Ik boekhoud mijn schoten strikt om nooit een cel dubbel te beschieten en om mijn pariteitspatroon netjes vol te houden.

**Fleet placement:** own placement

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | E5 | miss |  |
| 2 | F4 | miss |  |
| 3 | E7 | miss |  |
| 4 | D6 | miss |  |
| 5 | G5 | hit |  |
| 6 | G6 | miss |  |
| 7 | H5 | miss |  |
| 8 | G4 | sunk Destroyer |  |
| 9 | G8 | miss |  |
| 10 | F9 | hit |  |
| 11 | F8 | hit |  |
| 12 | F7 | miss |  |
| 13 | F10 | miss |  |
| 14 | E8 | hit |  |
| 15 | D8 | sunk Submarine |  |
| 16 | E9 | hit |  |
| 17 | D9 | miss |  |
| 18 | G9 | hit |  |
| 19 | H9 | sunk Battleship |  |
| 20 | C3 | miss |  |
| 21 | B4 | hit |  |
| 22 | B5 | hit |  |
| 23 | B6 | hit |  |
| 24 | B7 | miss |  |
| 25 | B3 | hit |  |
| 26 | B2 | sunk Carrier |  |
| 27 | I3 | hit |  |
| 28 | H3 | miss |  |
| 29 | I4 | hit |  |

