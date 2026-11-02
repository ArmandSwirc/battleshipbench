# deepseek-flash vs glm-5.3-flash

1 game, newest first. Board images: [overview.svg](overview.svg), raw data: [run.json](run.json).

## 2026-11-02T05:19:04.057Z · standard · glm-5.3-flash won in 41 shots

### deepseek-flash (A) · lost · 41 shots · 11 hits

**Strategy: Pariteitjacht met Randval**

> 1) Opstelling (vast, coördinaten kolomletter+rij; nooit wijzigen):
> - Carrier (5): B1-F1 horizontaal.
> - Battleship (4): J2-J5 verticaal.
> - Cruiser (3): B9-D9 horizontaal.
> - Submarine (3): H7-H9 verticaal.
> - Destroyer (2): F5-G5 horizontaal.
> Deze opstelling spreidt over randen, hoeken en midden, bevat weinig cellen van de meest voor de hand liggende even pariteit (A1 is even) en voorkomt één lange gemeenschappelijke lijn.
> 
> 2) Zoeken zonder treffer:
> - Gebruik checkerboard-pariteit: schiet alleen op cellen met (kolom+rij) even, met A=1, B=2, ..., J=10. A1 is dus even.
> - Begin in het centrum en werk naar buiten: sorteer even cellen op afstand tot het midden (5.5,5.5), daarna op rij, daarna op kolom. Voorbeelden van eerste schoten: E5, D4, D6, F4, F6, C5, G5, E3, E7, enzovoort, steeds alleen even cellen.
> - Schiet in de zoekfase niet op buren van al beschoten cellen als dat geen pariteitscel is; zo verspil je geen schoten.
> - Als na 18 opeenvolgende missers op even nog geen treffer valt, schakel voor maximaal 12 schoten naar oneven centrumcellen in dezelfde centrum-naar-buiten-volgorde. Zodra een treffer valt, ga direct naar de trefferfase. Zijn die 12 schoten missers, ga terug naar de nog onbeschoten even cellen.
> - Houd alle missers, treffers en gezonken schepen exact bij en beschiet nooit een cel twee keer.
> 
> 3) Trefferfase tot zinken:
> - Zolang er een treffer openstaat die niet aan een gezonken schip is toegewezen, geen nieuwe pariteitsjacht: eerst afmaken.
> - Bij een nieuwe treffer: kijk of er een aangrenzende treffer in dezelfde rij of kolom is. Zo ja, verleng die lijn: schiet eerst op het open uiteinde in dezelfde richting; bij misser op het andere open uiteinde. Blijf verlengen tot het schip zinkt of beide uiteinden missen/rand zijn.
> - Bij een geïsoleerde treffer: kies onder de vier buren de cel met de hoogste kans dat daar een nog niet gezonken schip ligt. Bereken die kans door alle nog mogelijke plaatsingen van resterende schepen die de treffer bevatten te tellen; weeg naar scheepslengte en eerdere missers. Bij twijfel: probeer eerst de richting met de meeste vrije ruimte in de lijn, dan de andere as. Praktische noodvolgorde: rechts, links, omlaag, omhoog, maar alleen als de kansberekening geen duidelijke winnaar geeft.
> - Na een tweede treffer in dezelfde lijn: blijf in die lijn, ook als een uiteinde een misser is; probeer het andere uiteinde. Gebruik de resterende scheepslengtes: als het aantal aaneengesloten treffers gelijk is aan een nog levende scheepslengte maar er geen zinkmelding is, kan het niet dat schip alleen zijn; behandel de treffers als mogelijk twee elkaar rakende schepen en herbereken de clusters.
> - Bij meerdere losse trefferclusters: finish eerst het cluster met de kleinste resterende onzekerheid, meestal een rechte lijn met bijna bekende lengte of een cluster waar nog maar één scheepslengte bij past. Daarna het volgende cluster. Pas als geen cluster meer open is, terug naar zoeken.
> - Na een zinkmelding: markeer de bijbehorende treffers als opgelost, verwijder die scheepslengte uit de lijst en herbereken alle open treffers. Een aangrenzende treffer kan bij een ander schip horen; nooit automatisch meeslepen in een zojuist gezonken schip.
> 
> 4) Prioritering en snelheid versus veiligheid:
> - Snelheid: bij een treffer direct doorschieten op aangrenzende cellen; niet terug naar pariteit zolang een treffer open is. Dit is de grootste tijdwinst in een race.
> - Veiligheid: in de zoekfase alleen pariteitscellen, geen willekeurige buren, om schoten niet te verspillen. Bij meerdere even goede doelwitten kies de cel met hoogste verwachte scheepsdichtheid: centrum eerst, daarna randen en hoeken.
> - Als de vijand al veel van mijn schip heeft geraakt of gezonken, verhoog tempo: kies in de trefferfase de lijn die het snelst tot een zinking leidt, ook als dat iets meer risico op een misser geeft. Bij gelijke stand: eerst een zekere zinking, dan pas nieuwe jacht.
> - Als minder dan drie schepen over zijn en de vaste pariteitslijst weinig kansrijke cellen heeft, kies de cel met de hoogste kans volgens alle mogelijke plaatsingen van de resterende schepen; blijf bij gelijke kans op de gekozen pariteit.

**Fleet placement:** own placement

> Deze vaste opstelling spreidt de schepen over randen, hoeken en het midden, met weinig cellen op de meest voor de hand liggende even pariteit en zonder overlappen.

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | E5 | miss | Eerste schot in het centrum volgens de even-pariteitsstrategie. |
| 2 | F6 | miss | Dichtstbijzijnde onbeschoten even-pariteitscel nabij het midden, in lijn met de centrum-naar-buiten-strategie. |
| 3 | F4 | miss | Dichtstbijzijnde onbeschoten even-pariteitscel nabij het midden, volgens de centrum-naar-buiten-strategie. |
| 4 | G5 | miss | Dichtstbijzijnde onbeschoten even-pariteitscel op afstand 2,5 van het midden, volgens de centrum-naar-buiten-strategie. |
| 5 | D6 | miss | Volgende onbeschoten even-pariteitscel op afstand 2,5 van het centrum, volgens de centrum-naar-buiten-strategie. |
| 6 | E7 | hit | Dichtstbijzijnde onbeschoten even-pariteitscel bij het centrum volgens de zoekstrategie. |
| 7 | F7 | miss | Geïsoleerde treffer E7: rechts verkennen volgens de noodvolgorde en daar is de kans op een aangrenzend scheepsdeel het grootst. |
| 8 | D7 | miss | Geïsoleerde treffer op E7: na misser rechts probeer ik nu links om het schip in de rij te verlengen. |
| 9 | E8 | hit | Na missers links en rechts op E7 onderzoek ik nu verticaal omlaag; daar is de meeste ruimte voor een lang schip. |
| 10 | E9 | miss | Twee verticale treffers op E7-E8: ik verleng de lijn omlaag naar E9 om het schip te laten zinken. |
| 11 | E6 | sunk Cruiser | Twee verticale treffers op E7-E8; E9 mist, dus ik verleng de lijn omhoog naar E6 om het schip te laten zinken. |
| 12 | D4 | miss | Terug naar de even-pariteitsjacht: D4 is de dichtstbijzijnde onbeschoten centrale even cel. |
| 13 | C5 | miss | Volgende onbeschoten even-pariteitscel dicht bij het centrum, links van het midden, om de zoekfase na de gezonken cruiser voort te zetten. |
| 14 | E3 | miss | E3 is de dichtstbijzijnde onbeschoten even-pariteitscel bij het centrum (rij 3, na E5/D4/D6/F4/F6/C5/G5), precies volgens de centrum-naar-buiten-zoekvolgorde. |
| 15 | G7 | miss | G7 is de dichtstbijzijnde onbeschoten even-pariteitscel bij het centrum om de zoekfase voort te zetten. |
| 16 | H6 | miss | H6 is de dichtstbijzijnde onbeschoten even-pariteitscel volgens de centrum-naar-buiten-volgorde. |
| 17 | F8 | miss | F8 is de dichtstbijzijnde onbeschoten even-pariteitscel bij het centrum volgens de centrum-naar-buiten-zoekvolgorde. |
| 18 | G3 | miss | Na alle centrale even cellen zijn de afstands-8,5-cellen aan de beurt; G3 is de eerstvolgende onbeschoten even-pariteitscel (rij 3) volgens de centrum-naar-buiten-volgorde. |
| 19 | H4 | miss | Dichtstbijzijnde onbeschoten even-pariteitscel op afstand 8,5 van het centrum; bij gelijke afstand op rij als eerste gekozen (rij 4 vóór C7 en D8). |
| 20 | C7 | miss | Na het zinken van de cruiser is C7 de dichtstbijzijnde onbeschoten even-pariteitscel bij het centrum (afstand 2,9; rij 7 gaat vóór D8 op rij 8), dus zet ik de centrum-naar-buiten zoekfase voort. |
| 21 | D8 | miss | D8 is de dichtstbijzijnde onbeschoten even-pariteitscel bij het centrum nu de centrale cellen zijn afgewerkt. |
| 22 | F2 | miss | F2 is de eerstvolgende onbeschoten even-pariteitscel op de kleinst mogelijke restafstand tot het centrum (rij 2 gaat bij gelijke afstand voor), dus zet ik de zoekfase voort. |
| 23 | C3 | miss | C3 is de volgende onbeschoten even-pariteitscel volgens de centrum-naar-buiten-volgorde (afstand 12,5; rij 3 vóór de andere resterende cellen). |
| 24 | I5 | miss | I5 is de dichtstbijzijnde onbeschoten even-pariteitscel na C3; bij gelijke afstand gaat rij 5 vóór B6 en H8. |
| 25 | B6 | miss | B6 is de dichtstbijzijnde onbeschoten even-pariteitscel bij het centrum volgens de centrum-naar-buiten-zoekvolgorde. |
| 26 | J6 | miss | Midden van de lange open kolom J, hoogste verwachte scheepsdichtheid. |
| 27 | A5 | hit | Hoogste kansdekking volgens de plaatsingstelling: A5 dekt vijf mogelijke carrier-plaatsingen verticaal en ligt op even pariteit. |
| 28 | A6 | miss | Geïsoleerde treffer A5: verticaal omlaag biedt de meeste vrije ruimte en evenveel plaatsingskans als omhoog. |
| 29 | A4 | hit | A5 is geïsoleerd aan de rand; A4 is de enige zinvolle verlenging omhoog en dekt de meeste resterende scheepslengtes. |
| 30 | A3 | hit | A4 en A5 zijn twee open treffers in kolom A; A6 is al een misser, dus A3 is het enige zinvolle open uiteinde om dit cluster af te maken. |
| 31 | A2 | hit | De drie treffers A3-A5 zijn nog niet gezonken en A6 is al een misser; A2 is het enige open uiteinde om het schip in kolom A af te maken. |
| 32 | A1 | sunk Carrier | Enige open uiteinde van het vier-trefferscluster in kolom A; als hier een vijfde schipdeel ligt, zinkt de Carrier. |
| 33 | I9 | miss | Hoogste gecombineerde kans: I9 ligt in vier Battleship-plaatsingen en in veel resterende plaatsingen van 3 en 2, en is nog onbeschoten. |
| 34 | G10 | miss | Hoogste gecombineerde plaatsingskans: G10 dekt vier Battleship-plaatsingen, vier Cruiser-plaatsingen en drie Destroyer-plaatsingen in de open onderrand. |
| 35 | E1 | hit | Hoogste gecombineerde plaatsingskans voor de resterende schepen: E1 ligt in vier Battleship-plaatsingen en in meerdere Submarine- en Destroyer-plaatsingen in de open bovenrand. |
| 36 | F1 | hit | Na de treffer op E1 is F1 de beste verlenging: het ligt in de langste open rijstrook en kan bij alle resterende scheepslengtes horen. |
| 37 | G1 | miss | G1 verlengt de horizontale trefferreeks E1-F1 naar rechts, waar de open rijstrook langer is; F1 kan door de misser op F2 niet omlaag. |
| 38 | D1 | sunk Submarine | F1 kan alleen bij E1 horen; omdat E1-F1 nog niet gezonken is, moet het schip naar links doorlopen via D1. |
| 39 | B2 | miss | B2 ligt in drie mogelijke Battleship-plaatsingen en heeft ook drie sterke Destroyer-aangrenzingen, wat de hoogste gecombineerde trefferkans geeft. |
| 40 | D10 | miss | D10 dekt drie mogelijke Battleship-plaatsingen en drie Destroyer-plaatsingen, wat de hoogste gecombineerde trefferkans geeft. |
| 41 | J2 | miss | J2 ligt in drie mogelijke Battleship-plaatsingen en biedt daarmee de hoogste kans om het resterende slagschip te raken. |

### glm-5.3-flash (B) · won · 41 shots · 17 hits · 1 auto-moves

**Strategy: Schaakbord-Jager**

> PLAATSING: Ik plaats mijn vloot op de randen en hoeken, met een onregelmatig patroon zodat geen twee schepen een herkenbaar patroon vormen. Concrete plaatsing: Carrier verticaal A1-A5, Battleship horizontaal J10-J7 (J10,J9,J8,J7), Cruiser verticaal E6-E8, Submarine horizontaal D1-F1, Destroyer verticaal H9-H10. Schepen mogen elkaar raken; ik benut dat om kleine ruimtes te vullen. Vermijd nooit systematisch één gebied, want een tegenstander die mijn 'voorkeuren' leert, richt zich daarop. Zoekpatroon (geen hits): ik gebruik een pariteitsstrategie met checkerboard op basis van de kleinste nog levende vijandelijke schepen. Standaard schiet ik alleen cellen waar (rij+kolom) even is (bijv. B2, C5, D4...), want elk schip van lengte >=2 raakt zo'n cel. Zodra alleen nog de Destroyer (lengte 2) leeft, schakel ik over op volledig checkerboard met alle cellen (geen pariteit meer nodig). Ik begin in het middengebied (kolommen C-H, rijen 3-8) omdat daar de meeste schepen per schot te raken zijn, en werk naar de randen. Ik houd mijn schoten bij in een mentaal grid: nooit twee keer hetzelfde vak schieten. HIT-opvolging: bij een raak schiet ik niet willekeurig verder, maar bepaal de oriëntatie: schiet eerst de twee buren (boven en rechts van de hit, dan onder/links) om de as te vinden. Zodra de as bekend is, loop ik langs die lijn door tot het schip zinkt (ik hoor welk schip zinkt en met welke lengte). Belangrijk: als een schip zinkt maar ik heb nog een 'losse' hit in de buurt die niet bij dat schip hoort, markeer die als nieuw doel. Als een schip zinkt en de lengte klopt met het aantal hits op die lijn, stop ik de opvolging en ga terug naar het zoekpatroon. Gebruik van resterende scheepslengtes: als bijv. alleen nog de Carrier (5) en Destroyer (2) leven, dan kan een hit niet van de Destroyer zijn als de lijn al 3+ hits lang is; ik prioriteer het langste nog levende schip bij twijfel over welke hit-lijn ik eerst afmaak. PARITEIT/AFSTAND: bij het zoeken sla ik cellen over die onmogelijk een nog levend schip kunnen bevatten (te weinig aangrenzende vrije cellen voor de minimale lengte). Bijvoorbeeld: als het kleinste nog levende schip 3 is, sla ik cellen over waar minder dan 2 vrije cellen in lijn liggen. SNELHEID VS VEILIGHEID: dit is een race, dus ik kies altijd het schot met de hoogste verwachte informatie+kans: bij twijfel schiet ik op de cel die het meeste aantal mogelijke plaatsingen van nog levende schepen raakt (midden van open gebieden). Ik gok nooit 'slim' buiten het patroon; consistentie wint op termijn. Als de tegenstander een patroon lijkt te volgen (bijv. alleen even pariteit), let ik daar niet op voor mijn eigen plaatsing (die staat vast), maar ik gebruik het wel om zijn resterende schepen sneller te vinden: als hij op oneven cellen schiet en raak krijgt, weet ik dat zijn schip daar loodrecht of langs de lijn kan liggen zoals normaal. DEVIATIE: alleen deviëren van het zoekpatroon als een hit dat vereist, of als er bewijs is (gezinkte schepen + gemiste gebieden) dat een specifiek gebied een schip móét bevatten; dan schiet ik daar eerst. Ik verlies nooit tijd aan 'gevoel'. Samengevat: vaste onregelmatige rand-plaatsing, even-pariteitszoektocht van midden naar rand, bij hit direct oriëntatie bepalen en langs de lijn afmaken, terug naar patroon na zink, en altijd het schot met de hoogste verwachte waarde kiezen.

**Fleet placement:** own placement

> Onregelmatige rand- en middenplaatsing volgens mijn plan, met de Battleship verticaal langs de rechterrand J7-J10 zodat alles binnen het bord blijft.

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | D4 | miss | Eerste schot volgens even-pariteitspatroon in het middengebied, waar de meeste mogelijke schipplaatsingen samenkomen. |
| 2 | F6 | miss | Volgend even-pariteitsschot in het middengebied (F6 is rij+kolom even), hoogste verwachte kans op een nog levend schip. |
| 3 | E3 | miss | Volgend even-pariteitsschot in het middengebied (E3: kolom+rij even), nog niet beschoten en centraal voor maximale kans op nog levende schepen. |
| 4 | E5 | miss | Centraal even-pariteitsschot (kolom+rij even), maximale kans om nog levende schepen te raken volgens zoekpatroon. |
| 5 | G5 | hit | Volgend even-pariteitsschot (kolom+rij even) centraal in het middengebied, maximale kans op nog levende schepen. |
| 6 | G4 | miss | Raak op G5: volgens mijn hit-opvolging schiet ik eerst de bovenbuur om de oriëntatie van het schip te bepalen. |
| 7 | G6 | miss | Hit op G5; G4 was mis, dus test ik de onderbuur G6 om de oriëntatie van het schip te bepalen. |
| 8 | F5 | sunk Destroyer | G5 raak; G4 en G6 beide mis, dus het schip ligt horizontaal — ik test de linkerbuur F5 om de as te bevestigen. |
| 9 | C5 | miss | Terug naar het even-pariteitszoekpatroon na het zinken van de Destroyer; C5 is centraal, onbeschoten en kolom+rij even. |
| 10 | E7 | miss | Even-pariteitsschot centraal met meeste vrije buren (E8, D7, F7), dus hoogste verwachte kans op nog levende schepen van minimaal lengte 3. |
| 11 | D8 | miss | Even-pariteitszoekscherp (4+8 even) met veel vrije cellen in lijn (D6-D10 verticaal, C8-E8 horizontaal), dus hoogste verwachte kans op schepen van lengte ≥3. |
| 12 | D6 | miss | Even-pariteitsschot (4+6 even) centraal met sterke lijnen: horizontaal B6-D6 en verticaal D5-D7/D9-D10 bieden ruimte voor schepen van lengte ≥3. |
| 13 | G7 | miss | Even-pariteitsschot (kolom+rij even) centraal met lange open lijnen (G7-G10 verticaal, G7-I7 horizontaal), maximale kans op schepen van lengte ≥3. |
| 14 | H6 | miss | Even-pariteitsschot met de meeste mogelijke plaatsingen: hele kolom H open plus horizontale lijn H6-J6, ideaal voor schepen van lengte ≥3. |
| 15 | B2 | miss | Hoogste verwachte waarde: B2 ligt op kruising van twee volledig open lijnen van 10 (rij 2 en kolom B), dus de meeste mogelijke plaatsingen voor schepen van lengte ≥3; alle centrum-even-cellen zijn al beschoten of zwakker. |
| 16 | E9 | miss | Even-pariteitsschot op de kruising van de volledig open rij 9 (10 cellen) met kolom E, hoogste verwachte kans op schepen van lengte ≥3. |
| 17 | A1 | miss | Even-pariteitscel (1+1 even) op de kruising van twee volledig open lijnen van 10 (rij 1 en kolom A), dus de hoogste verwachte kans op schepen van lengte ≥3. |
| 18 | I7 | miss | Even-pariteitscel op een volledig open kolom I (10 cellen) met horizontale segment H7-J7, dus de hoogste verwachte kans op de nog levende schepen van lengte ≥3. |
| 19 | H8 | hit | Even-pariteitscel met de hoogste verwachte waarde: kruispunt van een nagenoeg open rij 8 en kolom H, met de meeste mogelijke plaatsingen voor schepen van lengte ≥3. |
| 20 | I8 | miss | Raak op H8: H7 en H6 zijn al mis, dus verticaal omhoog is onmogelijk; ik test de rechterbuur I8 om de oriëntatie te bepalen, met open lijnen richting J8 en kolom I. |
| 21 | H9 | hit | Raak op H8 met I8 en H7 als mis; ik test de onderbuur H9 om de verticale as te bevestigen (H8-H10 past precies het kleinste schip van 3). |
| 22 | H10 | miss | Raak op H8-H9; H10 vervolgt de verticale as om het schip van minimaal 3 te zinken. |
| 23 | H7 | sunk Submarine | H8 en H9 zijn raak, H10 is mis; het verticale schip van minimaal lengte 3 moet dus door H7 lopen om het zinkend te maken. |
| 24 | J2 | hit | Even-pariteitsschot op de kruising van twee volledig open lijnen van 10 (rij 2 en kolom J), dus de hoogste kans op de nog levende Carrier(5), Battleship(4) en Cruiser(3). |
| 25 | J3 | hit | Elk verticaal schip (lengte ≥3) dat J2 bevat moet J3 omvatten, en elk horizontaal schip moet I2 omvatten; dus J3 is gegarandeerd raak of onthult de horizontale oriëntatie. |
| 26 | J4 | hit | J2 en J3 zijn raak op één verticale lijn; ik vervolg de as richting beneden (J4), waar het resterende schip zich kan uitstrekken richting J6. |
| 27 | J5 | sunk Battleship | Ik vervolg de verticale raak-lijn J2-J4 richting beneden; J5 bepaalt of het schip langer is dan 3 (Battleship/Carrier) of dat het Cruiser is die al op J2-J4 zinkt. |
| 28 | I1 | miss | Even-pariteitscel op de kruising van de volledig open rij 1 (B1-J1) en de open kolom I (I1-I6), met de meeste mogelijke plaatsingen voor Carrier(5) en Cruiser(3). |
| 29 | B6 | miss | B6 ligt op de kruising van de open kolom B en deels open rij 6 en raakt de meeste mogelijke Carrier-plaatsingen (4 van 16) plus meerdere Cruiser-plaatsingen; een mis sluit meteen de hele kolom B als Carrier-locatie uit. |
| 30 | A7 | miss | A7 ligt op de open kolom A (A2-A10) met de meeste mogelijke Carrier(5)-plaatsingen (4 verticaal) plus 4 Cruiser-plaatsingen, hoogste verwachte waarde binnen het even-pariteitspatroon. |
| 31 | D1 | hit | D1 raakt 3 van de 10 mogelijke Carrier-plaatsingen (rij 1) plus 4 Cruiser-plaatsingen (rij 1 en kolom D), de hoogste verwachte kans op de nog levende schepen; een mis sluit meteen de hele rij 1 als Carrier-locatie uit. |
| 32 | E1 | hit | D1 is raak; E1 zit in de meeste horizontale plaatsingen van Carrier en Cruiser op rij 1 (verticaal is alleen een Cruiser D1-D3 mogelijk vanwege missen op D4/D6), dus dit geeft de hoogste informatie+kans. |
| 33 | F1 | hit | F1 verlengt de raak-lijn D1-E1 en zit in bijna alle mogelijke horizontale plaatsingen van Carrier en Cruiser op rij 1, dus maximale kans en informatie. |
| 34 | C1 | hit | D1-F1 zijn drie opeenvolgende raak zonder zinkmelding, dus dit moet de Carrier(5) zijn; C1 raakt 2 van de 3 mogelijke horizontale plaatsingen (B1-F1 of C1-G1) en past mijn even-pariteitspatroon. |
| 35 | G1 | miss | G1 raakt de Carrier in twee van de drie mogelijke scenario's (C1-G1 of D1-H1 met Cruiser op C1-C3); alleen bij B1-F1 is het een mis, waarna B1 het bewijs levert. |
| 36 | B1 | sunk Carrier | G1 is mis, dus de Carrier moet horizontaal B1-F1 liggen; B1 is een gegarandeerde raak en zinkt de Carrier. |
| 37 | I3 | miss | Even-pariteitscel die in drie mogelijke Cruiser-plaatsingen ligt (G3-I3, I2-I4, I3-I5), samen met B8, C8 en F2 de hoogste verwachte kans op het laatste schip. |
| 38 | F2 | miss | F2 (even parity) raakt 4 van de nog mogelijke Cruiser-plaatsingen (D2-F2, E2-G2, F2-H2, F2-F4), samen met A4 het maximum, en geeft bij een mis meteen veel informatie. |
| 39 | C9 | hit | C9 ligt in 4 mogelijke Cruiser-plaatsingen (A9-C9, B9-D9, C7-C9, C8-C10), samen met B9 het maximum, dus hoogste kans op het laatste schip. |
| 40 | B9 | hit | C9 is een raak op de enige overgebleven Cruiser; B9 zit in twee van de vier mogelijke plaatsingen (A9-C9 en B9-D9), dus hoogste kans plus snel oriëntatie-bepaling. |
| 41 | D9 | sunk Cruiser (auto-move) | Geen geldig antwoord na 3 pogingen: willekeurige zet door het spel. |

