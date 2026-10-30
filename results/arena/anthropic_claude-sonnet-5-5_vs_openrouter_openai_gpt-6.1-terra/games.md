# claude-sonnet-5-5 vs gpt-6.1-terra

1 game, newest first. Board images: [overview.svg](overview.svg), raw data: [run.json](run.json).

## 2026-10-30T08:52:01.336Z · standard · claude-sonnet-5-5 won in 34 shots

### claude-sonnet-5-5 (A) · won · 34 shots · 17 hits

**Strategy: Dichtheidsjager met pariteit**

> DOEL: de vijandelijke vloot in zo min mogelijk beurten zinken. Mijn plaatsing kan het tempo van de tegenstander niet veranderen, dus ik win door efficiënt schieten. Veiligheid is alleen een kwestie van een lastig te raden opstelling. Tijdens het spel offer ik nooit schotefficiëntie op voor 'veiligheid'.
> 
> (1) PLAATSING (vast, niet-voorspelbaar, gespreid)
> Ik vermijd de patronen die jagers als eerste testen: een rij ships naast elkaar, alles in de hoeken, alles in het midden. Ik meng rand en binnenveld, horizontaal en verticaal, en houd schepen grotendeels uit elkaars buurt, zodat één treffer niet snel naar een tweede schip leidt.
> Vaste opstelling:
> - Carrier (5): J2, J3, J4, J5, J6 (verticaal op de rand).
> - Battleship (4): B8, C8, D8, E8 (horizontaal, onderin).
> - Cruiser (3): D3, D4, D5 (verticaal, links van het midden).
> - Submarine (3): G6, G7, G8 (verticaal, rechtsonder van het midden).
> - Destroyer (2): H10, I10 (onderrand).
> Ze overlappen niet en liggen verspreid over alle kwadranten.
> 
> (2) ZOEKEN (hunt-modus, niets geraakt of alles gezonken/verklaard)
> - Hou een mentaal bord bij: raak, mis, gezonken schip. Gebruik alleen de nog levende scheepslengtes.
> - Kies de cel met de grootste kans: het aantal manieren waarop nog levende schepen (horizontaal of verticaal) die cel kunnen bedekken zonder misses of gezonken cellen te raken. Centrale cellen scoren meestal hoger, dus begin rond E5, F6, E6, F5 en werk naar buiten.
> - Pariteit: zolang de Destroyer (2) leeft, schiet ik alleen op een schaakbordpatroon, cellen waar kolomnummer + rijnummer even is (A=1, B=2, ...). Elk schip van 2 of meer raakt dan minstens één van die cellen.
> - Is de Destroyer gezonken, dan is het kleinste schip 3. Ik schiet dan een verder uit elkaar liggend patroon: (kolom + rij) deelbaar door 3 of een gelijkwaardig diagonaal patroon met afstand 3, nog steeds gekozen op hoogste kans.
> - Is alleen nog een schip van 4 of 5 over, dan pas ik de afstand aan (4 of 5) en laat de kansberekening beslissen.
> - Bij gelijke kans: liever dichter bij het midden, en liever in een groot onbeschoten gebied.
> - Schiet niet op cellen waar geen enkel levend schip meer past, zoals losse gaten kleiner dan het kleinste levende schip.
> 
> (3) AFMAKEN (target-modus, bij een treffer)
> - Zodra een treffer geen verklaard schip is, ga ik in target-modus en laat ik hunt-modus even rusten.
> - Eén treffer: schiet op de vier buren. Begin met de buur met de meeste vrije ruimte in die richting, en sla buren over waar geen levend schip meer past.
> - Twee of meer treffers op een lijn: ken de richting vast en schiet verder langs die lijn aan één uiteinde. Is dat uiteinde mis of rand, ga dan naar het andere uiteinde. Pas zijwaarts proberen als beide uiteinden dicht zijn en het schip nog niet gezonken is.
> - Als het systeem zegt dat een schip gezonken is, markeer ik exact zoveel treffercellen in die lijn als de scheepslengte. Zijn er daarna nog treffers die niet verklaard zijn (bijvoorbeeld omdat schepen elkaar raken), dan ga ik direct door in target-modus op die cellen, want er zit dan een ander schip.
> - Past een lijn van treffers langer dan het langste levende schip, dan zijn het twee schepen naast elkaar. Probeer dan de zijkanten.
> - Pas na het volledig afmaken van alle onverklaarde treffers ga ik terug naar hunt-modus.
> 
> ALGEMENE REGELS
> - Elke beurt eerst controleren: welke schepen leven nog, welke treffers zijn nog niet verklaard, wat is de kleinste levende lengte.
> - Snelheid boven voorzichtigheid: elke beurt de schot met de hoogste verwachte opbrengst, geen willekeurige schoten, geen herhaling.
> - Afwijken van pariteit mag alleen als een treffer-cluster of een grote onbeschoten ruimte dat duidelijk beter maakt.
> - Als de tegenstander voorsprong heeft, blijf ik hetzelfde plan volgen; paniek en gokken verlagen de kans op winst.

**Fleet placement:** own placement

> Ik volg mijn vaste, gespreide opstelling: Carrier verticaal op de rand (J2), Battleship horizontaal onderin (B8), Cruiser verticaal links van het midden (D3), Submarine verticaal rechtsonder van het midden (G6) en Destroyer op de onderrand (H10), zonder overlap en zonder duidelijk patroon.

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | E5 | miss | Eerste schot in het midden op een pariteitscel (E=5 + rij 5 = 10, even) met de hoogste kans. |
| 2 | F6 | miss | Centrale cel op het schaakbordpatroon (kolom+rij even) met hoge kans, naast de eerdere misser op E5. |
| 3 | F4 | hit | Pariteitscel (kolom+rij even) dicht bij het midden met veel vrije ruimte rondom. |
| 4 | G4 | sunk Destroyer | Treffer op F4: horizontaal heeft de meeste vrije ruimte, dus ik schiet op de buur G4. |
| 5 | E7 | miss | Destroyer is gezonken, dus ik schiet nu op een patroon met afstand 3 (kolom+rij deelbaar door 3); E7 ligt centraal met veel vrije ruimte rond de misses E5 en F6. |
| 6 | H7 | miss | Het kleinste levende schip is 3, dus ik schiet op het patroon met kolom+rij deelbaar door 3. H7 ligt centraal in een groot onbeschoten gebied waar alle levende schepen passen. |
| 7 | D6 | miss | Destroyer is gezonken, dus ik schiet nu een patroon met afstand 3 op een open cel met veel ruimte voor de grote schepen, in het onbeschoten linkerdeel. |
| 8 | E3 | miss | E3 ligt in een groot open gebied waar nog alle levende schepen (3, 3, 4 en 5) horizontaal en verticaal passen, en het ligt weg van de misses. |
| 9 | C4 | miss | Open gebied links met veel ruimte voor lange schepen horizontaal en verticaal, dus hier is de kans op een treffer het grootst. |
| 10 | H5 | miss | H5 ligt in een groot open gebied rechts: de rij biedt 5 vrije cellen en de kolom 6, dus daar passen alle resterende schepen het vaakst. |
| 11 | G8 | miss | Open ruimte in rij 8 en kolom G en (kolom+rij)=15 is deelbaar door 3, dus past bij het patroon voor schepen van minimaal 3. |
| 12 | D9 | miss | D9 ligt in een groot onbeschoten gebied, waar rij 9 en kolom D (D7-D10) nog ruimte laten voor alle resterende schepen. |
| 13 | D2 | hit | D2 ligt in een groot onbeschoten gebied bovenin en past op het patroon met afstand 3 (kolom+rij deelbaar door 3), zodat Carrier, Battleship en beide 3-schepen er horizontaal of verticaal overheen kunnen liggen. |
| 14 | E2 | hit | D2 is nog een onverklaarde treffer en rij 2 heeft de meeste vrije ruimte, dus ik probeer eerst de buur E2. |
| 15 | F2 | miss | D2 en E2 liggen horizontaal naast elkaar, dus ik verleng de lijn naar rechts met F2 (gelijke kans als C2, maar meer ruimte rechts). |
| 16 | C2 | hit | D2 en E2 liggen horizontaal naast elkaar en F2 is mis, dus ik maak het schip af via de open kant bij C2. |
| 17 | B2 | sunk Battleship | Drie treffers op een rij (C2-E2) met F2 als misser, dus het schip loopt waarschijnlijk door naar links; B2 is de logische voortzetting. |
| 18 | I3 | miss | Kolom I is volledig vrij en rij 3 heeft vijf vrije cellen (F3-J3), dus hier passen de meeste plaatsingen van de Carrier, Cruiser en Submarine. |
| 19 | I6 | miss | Ruime open ruimte rechts: in kolom I en rij 6 passen veel plaatsingen van Carrier, Cruiser en Submarine, en de cel ligt op het 3-afstandspatroon. |
| 20 | C8 | hit | Het open gebied linksonder laat op C8 veel plaatsingen toe voor Carrier, Cruiser en Submarine, horizontaal in rij 8 en verticaal in kolom C. |
| 21 | D8 | miss | Ik maak de onverklaarde treffer op C8 af; D8 ligt in rij 8 met genoeg ruimte voor een Carrier, Cruiser of Submarine. |
| 22 | C7 | hit | C8 is de enige onverklaarde treffer. Verticaal in kolom C past een schip van 3 of 5 het best, dus ik schiet op de buur C7 richting het open midden. |
| 23 | C9 | miss | C7 en C8 liggen verticaal op één lijn, dus ik schiet door langs die lijn aan de onderkant (C9) om het schip af te maken. |
| 24 | C6 | sunk Submarine | C7 en C8 liggen onder elkaar en C9 is mis, dus C6 is de enige manier om de verticale lijn van drie te voltooien. |
| 25 | A5 | miss | De Carrier past alleen nog in rij 1, rij 10, rij 9 (E-J), kolom A, kolom B (3-10) of kolom J; A5 dekt de meeste plaatsingen van Carrier en Cruiser. |
| 26 | F10 | miss | Alleen Carrier (5) en Cruiser (3) leven nog; onderrij 10 is volledig onbeschoten en F10 wordt door de meeste mogelijke plaatsingen gedekt. |
| 27 | J5 | hit | Kolom J is een lange vrije lijn waar Carrier en Cruiser veel posities hebben, en J5 dekt de meeste combinaties. |
| 28 | J6 | hit | Treffer op J5 kan niet horizontaal doorlopen omdat H5 mis is en I5 te weinig ruimte laat, dus het schip ligt verticaal en ik schiet door naar J6 waar de meeste ruimte is. |
| 29 | J4 | hit | J5 en J6 vormen een verticale lijn in kolom J, dus ik ga door aan de bovenkant; J4 en J7 hebben gelijke kans en ik kies J4. |
| 30 | J7 | hit | De drie treffers J4-J6 vormen een lijn die nog niet gezonken is, dus het is waarschijnlijk de Carrier; ik schiet het uiteinde J7 af om de lijn te verlengen. |
| 31 | J8 | sunk Carrier | De vier treffers J4-J7 vormen een verticale lijn, dus ik schiet door aan het onderste uiteinde bij J8 om de Carrier af te maken. |
| 32 | H9 | hit | Alleen de Cruiser (3) leeft nog; H9 ligt in een open gebied rechtsonder en wordt door de meeste mogelijke plaatsingen gedekt (3 horizontaal, 1 verticaal). |
| 33 | G9 | hit | Treffer op H9 is nog niet gezonken; G9 ligt in twee van de vier mogelijke Cruiser-posities (F9-H9 en G9-I9), dus de grootste kans. |
| 34 | I9 | sunk Cruiser | G9 en H9 liggen horizontaal, dus de Cruiser (3) ligt op F9-H9 of G9-I9; ik probeer I9 eerst. |

### gpt-6.1-terra (B) · lost · 33 shots · 15 hits

**Strategy: Rand en Raak**

> Doel: als eerste de hele vloot laten zinken. Wees aanvallend: een misser kost één beurt, maar er is geen reden om een kansrijk schot uit te stellen om ‘veilig’ te spelen. Benut informatie voor snellere volgende schoten; neem geen risico om de eigen vloot te beschermen nadat die is geplaatst.
> 
> 1. Plaatsing
> Maak de plaatsing onvoorspelbaar en kies haar vóór het eerste schot. Gebruik twee mogelijkheden met ongeveer gelijke kans:
> - Trek een volledige willekeurige geldige vloot: kies voor ieder schip willekeurig een horizontale of verticale lijn van de juiste lengte en verwerp de hele trekking bij overlap.
> - Kies willekeurig de carrier of het slagschip en leg dat schip willekeurig langs een bordrand. Trek de overige schepen willekeurig zonder overlap. Maak zo enkele geldige vloten en kies daaruit bij voorkeur een vloot waarvan verschillende schepen weinig orthogonaal aan elkaar grenzen; breek gelijke keuzes willekeurig.
> 
> Alle schepen moeten volledig op het bord liggen en mogen elkaar niet overlappen. Aanraking is wel toegestaan; maak er geen harde regel van dat schepen gescheiden moeten zijn. Gebruik geen steeds terugkerend vast patroon.
> 
> 2. Administratie en redenering
> Noteer na iedere beurt alle eigen schoten in volgorde, met misser, raak of het aangekondigde gezonken schip. Schiet nooit opnieuw op een cel. Houd de lengtes en namen bij van de schepen die nog niet als gezonken zijn gemeld.
> 
> Verwar een melding van zinken niet met kennis van de exacte ligging van dat schip: bij rakende schepen kunnen meerdere toewijzingen van eerdere treffers mogelijk zijn. Blijf alle aannemelijke toewijzingen overwegen. Een mogelijke vijandelijke vloot moet overeenkomen met alle missers, treffers, niet-overlappende schepen en de volgorde en identiteit van de zinkmeldingen. Een schip kan bijvoorbeeld niet al vóór zijn aangekondigde zinkbeurt volledig geraakt zijn. Een eenmaal gezonken schip is geen volgend doel, maar zijn onbekende ligging kan voor de interpretatie van andere treffers nog relevant zijn.
> 
> Bereken waar praktisch mogelijk per onbeschoten cel hoe vaak zij in zulke mogelijke vloten door een nog drijvend schip wordt bezet. Een gelijkmatige verdeling over geldige vloten is een bruikbaar uitgangspunt, geen zekerheid over de tegenstander. Als volledige berekening niet haalbaar is, benader dit door geldige plaatsingen van de resterende schepen te tellen, met extra aandacht voor plaatsingen die open treffers verklaren. Doe geen alsof geschatte kansen exact zijn.
> 
> 3. Zoeken zonder open treffer
> Een treffer is open zolang niet met voldoende zekerheid vaststaat dat zij bij een reeds gezonken schip hoort. Zijn alle treffers afgehandeld, zoek dan met een rooster. Nummer kolommen A–J als 1–10. Neem m gelijk aan de lengte van het kortste nog drijvende schip en kies één restklasse k voor (kolomnummer + rijnummer) modulo m. Iedere horizontale of verticale lijn van minstens m cellen raakt die klasse. Kies uit de nog onbeschoten cellen van die klasse steeds een cel met hoge geschatte bezettingskans; gebruik plaatsingstellingen, bekende missers en gezonken schepen. Breek gelijke keuzes bij voorkeur zo dat het resterende zoekgebied goed wordt gedekt.
> 
> Kies de restklasse bij voorkeur zo dat zij veel kansrijke, nog onbeschoten cellen bevat. Houd haar aan tijdens deze zoekfase; heroverweeg haar wanneer de kortste resterende scheepslengte verandert of de informatie een andere klasse duidelijk gunstiger maakt. Aanvankelijk is m=2, dus dit is een schaakbordpatroon. Nadat de destroyer is gezonken kan m=3 worden gebruikt, zolang alle resterende schepen minstens drie cellen lang zijn. Het rooster is een zoekhulpmiddel, geen verbod op schoten daarbuiten tijdens achtervolging.
> 
> 4. Na een treffer
> Geef voorrang aan het afmaken van waarschijnlijk al geraakte schepen. Overweeg alle onbeschoten cellen die in een consistente hypothese een drijvend schip met een eerdere treffer kunnen uitbreiden, ook buiten het zoekrooster. Bij één geïsoleerde treffer zijn dat normaal de geldige orthogonale buren. Bij twee treffers op één lijn zijn de verlengingen aan beide uiteinden vaak kansrijk; een tussenliggende onbeschoten cel kan eveneens kansrijk zijn. Schrap richtingen en lengtes die door een rand, misser of andere vaststaande informatie onmogelijk zijn.
> 
> Blijf voorzichtig: aangrenzende treffers kunnen bij twee verschillende, elkaar rakende schepen horen. Leid daarom niet uitsluitend uit nabijheid af dat treffers bij hetzelfde schip horen. Zijn er meerdere open treffers of mogelijke doelen, vergelijk dan hun kansrijke vervolgcellen en behandel zo nodig meerdere verklaringen tegelijk. Ga na een zinkmelding door met eventuele andere open treffers; keer pas terug naar het zoekrooster wanneer alle treffers zijn afgehandeld.
> 
> Als bruikbare kansen beschikbaar zijn, vergelijk kandidaatcellen met de score P(raak) + 0,6 × P(raak op een al eerder geraakt, nog drijvend schip) + 0,4 × P(zinken). Deze bonussen bevorderen afmaken zonder een veel kansrijker alternatief blind te negeren. Kies een cel met de hoogste score; gebruik bij een gelijke score de verwachte informatie of dekking als beslisser. Zonder betrouwbare kansschattingen: kies de cel die door de meeste consistente, trefwerken-verklarende plaatsingen wordt ondersteund, met voorkeur voor een plausibele afronding. Controleer bij een schijnbare tegenspraak eerst de administratie en mogelijke toewijzingen, in plaats van een spelregel over boord te zetten.

**Fleet placement:** own placement

> De carrier ligt langs een rand en de overige schepen zijn verspreid met weinig onderling contact.

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | F6 | miss | Een centraal veld heeft veel mogelijke scheepsplaatsingen. |
| 2 | E5 | miss | Dit centrale roostervak past bij veel mogelijke scheepsplaatsingen. |
| 3 | D4 | hit | Deze roostercel ondersteunt veel mogelijke scheepsplaatsingen. |
| 4 | C4 | miss | Deze cel kan de treffer op D4 vervolgen en ligt gunstig voor verdere verkenning. |
| 5 | D5 | hit | D5 verlengt de treffer op D4 en past bij veel mogelijke scheepsliggingen. |
| 6 | D3 | sunk Cruiser | Dit schot verlengt de reeks treffers en test ook of D4 bij een apart schip hoort. |
| 7 | G8 | hit | Deze cel ligt op het zoekrooster en past bij veel mogelijke scheepsplaatsingen. |
| 8 | F8 | miss | Deze cel verlengt de open treffer G8 in een kansrijke richting. |
| 9 | G7 | hit | Deze cel verlengt de open treffer G8 in de meest kansrijke richting. |
| 10 | G6 | sunk Submarine | Dit veld verlengt waarschijnlijk het schip dat bij G7 en G8 is geraakt. |
| 11 | H4 | miss | Deze cel heeft veel mogelijke plaatsingen van de resterende schepen en past in het zoekrooster. |
| 12 | D9 | miss | Deze zoekroostercel ligt in een ruim, nog onverkend gebied. |
| 13 | B6 | miss | Deze zoekcel past in veel mogelijke plaatsingen van de resterende schepen. |
| 14 | I5 | miss | Deze cel dekt veel mogelijke plaatsingen van de resterende schepen. |
| 15 | F2 | miss | Hier zijn veel mogelijke plaatsingen van de resterende schepen. |
| 16 | C7 | miss | Deze centrale cel past in veel mogelijke plaatsingen van de resterende schepen. |
| 17 | G1 | miss | Deze cel past in veel mogelijke plaatsingen van de resterende schepen. |
| 18 | A5 | miss | Deze roostercel heeft een hoge geschatte bezettingskans. |
| 19 | E10 | miss | Hier passen relatief veel mogelijke plaatsingen van de resterende schepen. |
| 20 | J6 | hit | Deze cel past in veel mogelijke plaatsingen van de grote overgebleven schepen. |
| 21 | J7 | miss | J7 kan de treffer op J6 verlengen en mogelijk direct de destroyer laten zinken. |
| 22 | J5 | hit | Deze cel kan de treffer op J6 voor alle resterende scheepslengtes verlengen. |
| 23 | J4 | hit | De getroffen schepen bij J5 en J6 kunnen naar boven doorlopen. |
| 24 | J3 | hit | J3 verlengt de reeks treffers en past bij een nog drijvend schip. |
| 25 | J2 | sunk Carrier | Dit veld verlengt de reeks treffers en kan het vliegdekschip laten zinken. |
| 26 | I9 | miss | Dit zoekroostervak past bij veel mogelijke plaatsingen van beide resterende schepen. |
| 27 | B2 | miss | Hier passen relatief veel mogelijke plaatsingen van de resterende schepen. |
| 28 | B8 | hit | Deze cel past in meerdere mogelijke plaatsingen van beide overgebleven schepen. |
| 29 | C8 | hit | Deze cel verlengt de treffer B8 en past bij meerdere mogelijke scheepsliggingen. |
| 30 | D8 | hit | D8 verlengt de treffers B8 en C8 en past bij vrijwel alle aannemelijke scheepsposities. |
| 31 | A8 | miss | Dit kan het slagschip direct tot zinken brengen. |
| 32 | E8 | sunk Battleship | Dit verlengt de drie treffers en doet het slagschip zinken. |
| 33 | G3 | miss | Deze cel past in vier mogelijke posities van de resterende destroyer. |

