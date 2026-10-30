# claude-opus-5-5 vs gpt-6.1-sol

1 game, newest first. Board images: [overview.svg](overview.svg), raw data: [run.json](run.json).

## 2026-10-30T09:09:48.967Z · standard · gpt-6.1-sol won in 31 shots

### claude-opus-5-5 (A) · lost · 31 shots · 13 hits

**Strategy: Dambord-Jager met Dichtheidsfocus**

> DOEL: alle 5 vijandelijke schepen zo snel mogelijk zinken. Snelheid gaat boven veiligheid: elk schot moet de kans op een treffer maximaliseren. Mijn eigen vloot kan ik na de plaatsing niet meer beschermen, dus het spel wordt gewonnen met efficiënt schieten.
> 
> 1) PLAATSING VAN MIJN VLOOT
> - Verspreid de schepen over het hele bord. Geen clusters: als ze elkaar raken, zinkt de tegenstander bij het opvolgen van één treffer ook een tweede schip.
> - Laat schepen elkaar niet raken (minstens 1 lege cel ertussen waar mogelijk).
> - Mix horizontaal en verticaal (bijvoorbeeld 2 of 3 horizontaal, de rest verticaal).
> - Vermijd het exacte centrum (D4-G7). Dichtheidsjagers schieten daar eerst.
> - Zet niet alles tegen de randen of in de hoeken, want sommige AI's jagen daarop. Kies een paar schepen half aan de rand en een paar in de tussenzones (rij/kolom 2-3 en 8-9).
> - Voorbeeldopstelling: Carrier B2-B6 (verticaal), Battleship E9-H9 (horizontaal), Cruiser H2-J2 (horizontaal), Submarine J5-J7 (verticaal), Destroyer E4-E5 (verticaal). Variëren mag, zolang de regels hierboven gelden.
> 
> 2) ZOEKEN (geen open treffer)
> - Pariteit: schiet alleen op cellen waar (kolomnummer + rijnummer) even is, met A=1 ... J=10. Zo vind je elk schip van 2 of langer.
> - Is de Destroyer gezonken en is het kleinste resterende schip 3 lang, dan schakel je over op een raster met stap 3: (kolom + rij) mod 3 = vaste waarde. Kies de restklasse met de meeste nog onbeschoten, geldige cellen. Bij een kleinste schip van 4 gebruik je stap 4.
> - Binnen het raster kies je de cel met de hoogste dichtheid. Tel voor elke onbeschoten cel op hoeveel manieren elk nog levend schip daar kan liggen. Plaatsingen mogen geen missers of gezonken cellen bevatten. Neem de cel met de hoogste som. Bij gelijkspel kies je de cel dichter bij het centrum. Bij een snelle schatting: centrumcellen en cellen ver van missers en randen scoren hoog.
> - Openingsvolgorde als richtlijn (allemaal even pariteit): E5, F6, D7, G4, C3, H8, B6, I5, E9, F2, verder het dichtste raster.
> - Schiet nooit naast een gezonken schip als die cel door de lengtes daar onmogelijk is geworden. Schiet nooit in gaten die kleiner zijn dan het kleinste levende schip.
> 
> 3) OPVOLGEN NA EEN TREFFER (doelmodus)
> - Eén losse treffer: schiet op de vier buren (boven, onder, links, rechts). Kies eerst de richting met de meeste ruimte, dus de langste vrije lijn waarin het grootste levende schip past. Sla buren over die mis, buiten het bord of al gezonken zijn.
> - Twee of meer treffers op één lijn: dat is de richting. Schiet verder op het ene uiteinde tot een misser of de rand, en daarna op het andere uiteinde.
> - Na 'gezonken': vergelijk de lengte van het gezonken schip met het aantal treffers op die lijn. Zijn er meer treffers dan de lengte, of losse treffers die niet bij het gezonken schip horen, dan ligt er een ander schip. Blijf in doelmodus en volg die extra treffers op, ook loodrecht op de lijn.
> - Lijn aan beide kanten afgesloten maar niets gezonken: er liggen meerdere schepen naast elkaar. Schiet loodrecht vanuit elke treffer.
> - Pas terug naar zoekmodus als er geen niet-gezonken treffers meer open staan.
> - Hou altijd bij welke schepen nog leven en hun lengtes. Gebruik dat om onmogelijke richtingen uit te sluiten. Voorbeeld: alleen de Destroyer leeft nog, dan zijn alleen buren mogelijk die samen met de treffer een geldig stuk van 2 vormen.
> 
> 4) EXTRA REGELS
> - Elke beurt eerst: staan er open treffers? Zo ja, doelmodus. Zo nee, zoekmodus met dichtheid.
> - Schiet nooit twee keer op dezelfde cel. Controleer de geschiedenis.
> - Eindfase (1-2 schepen over): laat de pariteit los en reken de dichtheid exact uit over alle overgebleven geldige plaatsingen. Schiet op de cel met het hoogste aantal.
> - Snelheid boven alles: geen voorzichtige of 'misleidende' schoten, altijd de cel met de grootste trefkans.

**Fleet placement:** own placement

> De schepen liggen verspreid over het bord zonder elkaar te raken, met een mix van twee horizontale en drie verticale schepen, buiten het centrum D4-G7, en deels aan de rand en deels in de tussenzones.

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | E5 | miss | Openingsschot in het centrum op even pariteit, waar de dichtheid het hoogst is. |
| 2 | F6 | miss | Volgende cel in de openingsvolgorde op even pariteit, een centrumcel met hoge dichtheid. |
| 3 | D7 | miss | Volgende cel in de openingsvolgorde op even pariteit, met hoge dichtheid nabij het centrum. |
| 4 | G4 | miss | Volgende cel in de openingsvolgorde op even pariteit, met hoge dichtheid nabij het centrum en ver van eerdere missers. |
| 5 | C3 | miss | Volgende cel in de openingsvolgorde op even pariteit, in een onbeschoten zone met hoge dichtheid. |
| 6 | H8 | miss | Volgende cel uit de openingsvolgorde op even pariteit, in een open gebied ver van eerdere missers met een hoge dichtheid. |
| 7 | B6 | miss | Volgende cel in de openingsvolgorde met even pariteit, in een groot onbeschoten gebied links met hoge dichtheid. |
| 8 | I5 | miss | Volgende cel in de openingsvolgorde met even pariteit, ver van eerdere missers in een open gebied rechts. |
| 9 | E9 | miss | Volgende cel uit de openingsvolgorde met even pariteit, in een groot onbeschoten gebied ver van eerdere missers. |
| 10 | F2 | miss | Volgende cel uit de openingsvolgorde, met even pariteit, in het nog lege bovenste gebied waar de dichtheid hoog is. |
| 11 | H6 | miss | Even-pariteitscel in een open gebied met een vrije verticale lijn H1-H7 en ruimte richting J, dus een hoge dichtheid. |
| 12 | F8 | miss | F8 ligt op de even pariteit in een groot, nog onbeschoten gebied, met ruimte in rij 8 (A–G) en kolom F (F7–F10). |
| 13 | G7 | miss | G7 ligt op het pariteitsraster in een open zone (rij E7-J7 en kolom G5-G10 zijn vrij), dus veel schepen kunnen hier liggen. |
| 14 | I3 | miss | I3 ligt op even pariteit in het onbeschoten gebied rechtsboven, met een vrije horizontale lijn D3-J3 van 7 cellen en een verticale lijn I1-I4 van 4 cellen, dus daar passen veel scheepsplaatsingen. |
| 15 | D4 | hit | D4 ligt op het pariteitsraster in een groot onbeschoten gebied (rij A4-F4 en kolom D1-D6) en heeft de hoogste geschatte plaatsingsdichtheid. |
| 16 | C4 | miss | C4 is samen met D3 de buur van de open treffer D4 met de hoogste plaatsingsdichtheid, want de horizontale lijn A4-F4 biedt veel ruimte. |
| 17 | D3 | miss | De verticale lijn D1-D6 biedt de meeste ruimte rond treffer D4, en D3 komt in de meeste mogelijke plaatsingen van de grote schepen voor. |
| 18 | E4 | miss | Doelmodus op de open treffer D4: D3 en C4 zijn al mis, dus blijven alleen D5 en E4 over, en beide richtingen bieden evenveel ruimte (3 cellen). |
| 19 | D5 | hit | D5 is de enige onbeschoten buur van treffer D4, want D3, C4 en E4 zijn al mis. |
| 20 | D6 | sunk Submarine | D4 en D5 liggen verticaal en D3 is mis, dus het schip loopt verder naar beneden via D6. |
| 21 | A5 | hit | A5 heeft met ongeveer 16 mogelijke scheepsposities de hoogste dichtheid op het even raster, dankzij de volledig open kolom A en het vrije stuk A5-C5. |
| 22 | A4 | hit | Ik volg de open treffer op A5 verticaal op, omdat horizontaal maar ruimte is voor 3 cellen en kolom A plaats biedt aan grotere schepen. |
| 23 | A6 | hit | A4 en A5 vormen een verticale lijn, dus ik verleng die naar beneden, waar de meeste vrije ruimte is. |
| 24 | A7 | miss | A4-A6 vormen een verticale lijn van drie treffers die nog niet gezonken is, dus ik verleng die lijn aan de onderkant, waar meer vrije ruimte is. |
| 25 | A3 | hit | Drie treffers verticaal op A4-A6 en A7 is mis, dus het schip moet naar boven doorlopen via A3. |
| 26 | A2 | sunk Carrier | Vier treffers A3-A6 zonder gezonken schip en A7 is mis, dus het vliegdekschip loopt waarschijnlijk door naar A2. |
| 27 | I9 | hit | I9 ligt op het pariteitsraster in het open gebied rechtsonder, waar rij 9 en kolom I lange vrije lijnen vormen, en heeft de hoogste geschatte dichtheid voor de drie resterende schepen. |
| 28 | H9 | hit | Opvolgen van de open treffer op I9: H9 ligt in evenveel mogelijke scheepsplaatsingen als I8 (5) en meer dan J9 of I10, dus het is een van de buren met de hoogste trefkans. |
| 29 | G9 | hit | Treffers H9 en I9 liggen horizontaal; links is er meer ruimte (F9-G9), dus G9 past in de meeste resterende plaatsingen. |
| 30 | F9 | sunk Battleship | Drie treffers op rij 9 (G9-I9) met een misser op E9: F9 verlengt de lijn naar links en kan het Battleship afmaken. |
| 31 | H2 | hit | H2 ligt in een groot open gebied rechtsboven met veel mogelijke plaatsingen voor de Cruiser en de Destroyer, zowel horizontaal als verticaal, en het valt op even pariteit. |

### gpt-6.1-sol (B) · won · 31 shots · 17 hits

**Strategy: Randvos**

> DOEL EN UITGANGSPUNTEN
> Win met zo weinig mogelijk eigen schoten: gericht zoeken, treffers snel uitwerken en na ieder resultaat alle mogelijkheden opnieuw beoordelen. Schepen mogen elkaar raken. Daarom zijn aangrenzende treffers niet automatisch hetzelfde schip en zijn vakken naast een gezonken schip niet automatisch water. Mijn strategie blijft vast; mijn schotkeuze past zich aan het bewijs aan.
> 
> 1. MIJN VLOOT PLAATSEN
> Gebruik als basis: vliegdekschip A2–A6; slagschip F9–I9; kruiser H2–J2; onderzeeër D4–D6; torpedobootjager G5–H5. Kies vóór het plaatsen onvoorspelbaar één van de acht symmetrieën van het bord: nul, één, twee of drie kwartslagen, eventueel gecombineerd met een spiegeling. Pas dezelfde transformatie op alle schepen toe. Als geen betrouwbare toevalskeuze mogelijk is, gebruik de basisopstelling. Controleer aantallen, rechte lijnen, bordgrenzen en afwezigheid van overlap en leg de definitieve coördinaten vast.
> Deze opstelling houdt veel scheepsvakken buiten het drukst onderzochte centrum, mengt richtingen en spreidt de schepen over verschillende gebieden. Een gevonden schip verraadt daardoor niet meteen een hele vlootcluster. Tijdens het spel verander ik niets aan mijn plaatsing.
> 
> 2. ADMINISTRATIE EN MOGELIJKE OPSTELLINGEN
> Houd van het vijandelijke bord exact bij: onbeschoten vakken, missers, treffers, gemelde gezonken schepen en nog resterende scheepslengten. Noteer ook de volgorde van de resultaten wanneer die nodig is om een zinkmelding te verklaren. Schiet nooit tweemaal op hetzelfde vak.
> De ideale basis voor mijn keuze is de verzameling volledige vijandelijke vlootopstellingen die alle waarnemingen verklaren. Een opstelling bevat vijf rechte, niet-overlappende schepen met lengten 5, 4, 3, 3 en 2; aanraken is toegestaan. Geen schip mag een misser bevatten. Alle treffers moeten verklaard zijn. Een nog niet gezonken schip moet minstens één onbeschoten vak over hebben. Zinkmeldingen moeten bij het juiste schip en het juiste tijdstip passen. Begin zonder sterke voorkeur voor bijvoorbeeld randen, hoeken of symmetrie.
> Bereken waar uitvoerbaar uit zulke gezamenlijke opstellingen de kans dat ieder onbeschoten vak bezet is. Gebruik geen schijnprecisie: als volledige telling of bemonstering niet beschikbaar is, werk met een benaderende mogelijkhedenkaart. Loop dan voor iedere resterende scheepslengte alle horizontale en verticale lijnstukken na die bij de bekende feiten passen. Tel per onbeschoten vak hoeveel zulke lijnstukken het bevatten, met beide resterende schepen van lengte drie afzonderlijk meegeteld. Controleer voor de beste kandidaten bovendien of de overige treffers en schepen nog zonder overlap kunnen worden ondergebracht. Dit is een benadering, geen exacte kansverdeling.
> Wanneer een zinkmelding alleen het scheepstype noemt en door rakende schepen meerdere locaties mogelijk blijven, bewaar die alternatieven. Verklaar niet gemakshalve een hele aaneengesloten groep treffers tot dat gezonken schip. Alleen zeker vastgestelde gezonken vakken worden definitief voor andere schepen geblokkeerd; hun buren blijven mogelijke scheepsvakken.
> 
> 3. ZOEKEN ZONDER OPEN TREFFERS
> Maak na iedere misser of zinkmelding de mogelijkhedenkaart opnieuw met uitsluitend de nog relevante schepen. Zoek geen willekeurige losse vakken af: kies een onbeschoten vak dat veel geldige overgebleven scheepsplaatsingen doorsnijdt. Een vak dat in geen enkele geldige plaatsing voorkomt, wordt nooit beschoten.
> Gebruik spreiding als hulpmiddel. Nummer kolommen A–J als 1–10 en laat m de kleinste resterende scheepslengte zijn. Iedere horizontale of verticale reeks van minstens m vakken bevat een vak uit elke klasse van (kolomnummer + rijnummer) modulo m. Zolang de torpedobootjager over is, is een schaakbordkleur dus een nuttig voorkeursgebied. Wanneer de kleinste lengte drie wordt, gebruik ik bij voorkeur één van de drie overeenkomstige klassen; hetzelfde beginsel geldt voor vier of vijf. Kies bij een nieuwe kleinste lengte een klasse met goede dekking van de overgebleven mogelijkheden en weinig nutteloze vakken.
> Deze klassen zijn een zoekhulpmiddel, geen blind voorschrift. Vergelijk de sterkste kandidaten en wijk af als het bewijs buiten de voorkeursklasse duidelijk betere voortgang belooft. Tijdens het afwerken van treffers geldt helemaal geen pariteitsbeperking. Bij ongeveer gelijke kansen verkies ik een schot dat nog slecht onderzochte mogelijkheden afdekt boven een schot vlak naast een eerdere misser. Zonder enig bewijs begin ik bij een van de kansrijke centrale vakken E5, F5, E6 of F6, met een onvoorspelbare keuze bij gelijkstand. Daarna volg ik het bewijs, niet een vaste schotenlijst.
> 
> 4. NA EEN TREFFER
> Schakel direct over op gericht afwerken, tenzij een andere bestaande treffergroep aantoonbaar sneller of zekerder kan worden afgerond. Een schip afmaken voorkomt dat ik later opnieuw naar zijn resterende vakken moet zoeken.
> Bij één losse treffer: vergelijk de onbeschoten boven-, onder-, linker- en rechterbuur. Kies de buur die in de meeste geldige verklaringen samen met de treffer bij hetzelfde nog levende schip hoort. Richtingen die door bordrand, missers, scheepslengten of andere harde feiten onmogelijk zijn, vallen af. Onderzoek geen diagonalen alleen omdat ze dichtbij liggen.
> Bij meerdere treffers op één lijn: geef voorrang aan onbeschoten gaten tussen treffers en aan de twee uiteinden, gewogen naar de nog mogelijke scheepsplaatsingen. Is de richting overtuigend vastgesteld, verleng die lijn in plaats van rondom alle treffers te blijven schieten. Kies het kansrijkste uiteinde eerst. Na een misser herbereken ik de mogelijkheden; de andere kant is vaak, maar niet automatisch, de juiste vervolgstap.
> Bij een nieuwe treffer zonder zinkmelding: blijf alleen doorzoeken langs dezelfde lijn zolang dat door geldige scheepsplaatsingen wordt ondersteund. Twee aangrenzende treffers kunnen van verschillende rakende schepen zijn. Als een veronderstelde richting vastloopt, of een trefferrij langer wordt dan een mogelijk resterend schip, heropen ik de alternatieven in plaats van een onmogelijke lijn verder te volgen.
> Bij meerdere losse treffergroepen kies ik het schot met de beste combinatie van trefkans, kans op onmiddellijk zinken en nut voor het verklaren van de bestaande treffers. Ik behandel groepen niet zonder bewijs als afzonderlijke schepen. Een gegarandeerde ontbrekende scheepscel wordt direct beschoten.
> Na een zinkmelding verwijder ik precies dat scheepstype uit de resterende vloot, behoud eventuele onopgeloste treffers en werk de hele mogelijkhedenkaart bij. Ik beschiet niet automatisch de omgeving van het gezonken schip, maar sluit die omgeving evenmin uit.
> 
> 5. EINDSPEL EN TEMPO
> Naarmate minder schepen overblijven, worden hun precieze lengten doorslaggevend. Als alleen nog een schip van lengte vier over is, onderzoek ik uitsluitend vakken die onderdeel kunnen zijn van een passende reeks van vier. Als alle nog mogelijke plaatsingen een bepaald onbeschoten vak bevatten, is dat een gegarandeerde treffer. Als nog maar één plaatsing over is, beschiet ik uitsluitend de ontbrekende vakken daarvan.
> Mijn uitgangspunt is snel, betrouwbaar verwachte voortgang boeken, niet informatie verzamelen om de informatie. Bij vergelijkbare trefkans krijgt onmiddellijk zinken voorrang; daarna verkies ik het schot dat de resterende mogelijkheden het sterkst onderscheidt. Een korte vooruitblik op de gevolgen van treffer én misser mag een vrijwel gelijke keuze beslissen, maar ik offer geen duidelijke treffer op voor een vaag verkenningsvoordeel.
> Schoten van de tegenstander vertellen niets rechtstreeks over zijn eigen vloot. Ik gebruik ze alleen om de tijdsdruk te beoordelen. Bij dreigend verlies kies ik, als er echt verschillende kansrijke routes zijn, de route met de grootste kans om binnen de nog beschikbare beurten alles af te maken, ook als die minder gunstig uitpakt wanneer de gok mislukt. Ik blijf daarbij op bewijs spelen: paniek en willekeur verbeteren de winstkans niet.
> 
> CONTROLE VOOR ELK SCHOT
> Is het vak nog onbeschoten? Past het bij minstens één geldige verklaring? Zijn alle zinkmeldingen en resterende lengten verwerkt? Heb ik geen verboden aanname over rakende schepen gemaakt? Is er een zekerder of sneller af te maken doel? Kies daarna precies één vak en verwerk het werkelijke resultaat voordat ik verder plan.

**Fleet placement:** own placement

> Ik gebruik de basisopstelling met verspreide schepen, gemengde richtingen en weinig bezetting in het centrum.

| # | Cell | Result | Reasoning |
|---|---|---|---|
| 1 | F6 | miss | Dit centrale vak ligt in veel mogelijke scheepsplaatsingen. |
| 2 | E5 | miss | E5 ligt in de meeste mogelijke scheepsplaatsingen en deelt geen rij of kolom met de misser F6. |
| 3 | G4 | miss | G4 ligt in veel mogelijke scheepsplaatsingen en verkent een nog ononderzocht gebied. |
| 4 | D7 | miss | D7 ligt in veel mogelijke scheepsplaatsingen en bestrijkt een nog ononderzocht gebied. |
| 5 | D3 | miss | D3 ligt in veel mogelijke scheepsplaatsingen en onderzoekt een nog weinig verkend gebied. |
| 6 | H7 | hit | H7 ligt in veel geldige scheepsplaatsingen en verkent een grotendeels onbeschoten gebied. |
| 7 | H6 | sunk Destroyer | H6 ligt naast de treffer en past in de meeste mogelijke scheepsplaatsingen door H7. |
| 8 | C4 | hit | C4 doorsnijdt veel mogelijke scheepsplaatsen in het nog weinig onderzochte linkerdeel. |
| 9 | C5 | hit | C5 ligt in de meeste mogelijke scheepsplaatsingen die de treffer op C4 verlengen. |
| 10 | C6 | hit | C6 verlengt de twee treffers en past bij veel mogelijke verticale scheepsplaatsingen. |
| 11 | C7 | miss | C7 verlengt de trefferrij en kan het slagschip direct laten zinken. |
| 12 | C3 | hit | C3 is de kansrijkste verlenging van de trefferrij C4–C6, omdat C7 een misser was. |
| 13 | C2 | sunk Carrier | C2 verlengt de vier treffers en kan het vliegdekschip direct laten zinken. |
| 14 | G8 | miss | G8 doorsnijdt de meeste mogelijke plaatsingen van de drie resterende schepen. |
| 15 | H3 | miss | H3 doorsnijdt veel geldige plaatsingen van de drie resterende schepen. |
| 16 | E9 | hit | E9 ligt in veel mogelijke plaatsingen van de resterende schepen en onderzoekt het vrijwel onbekende onderste borddeel. |
| 17 | F9 | hit | F9 grenst aan E9 en ligt in veel mogelijke plaatsingen van het getroffen schip. |
| 18 | G9 | hit | G9 verlengt de trefferrij E9–F9 en kan direct een schip van lengte drie laten zinken. |
| 19 | H9 | sunk Battleship | H9 verlengt de trefferrij en past in de meeste geldige plaatsingen van het schip op G9. |
| 20 | I5 | miss | I5 dekt veel geldige plaatsingen van de twee resterende schepen van lengte drie. |
| 21 | F2 | hit | F2 doorsnijdt veel geldige plaatsingen van de twee resterende schepen van drie vakken. |
| 22 | E2 | miss | E2 heeft de beste trefkans om het schip bij F2 gericht af te maken. |
| 23 | F3 | miss | F3 ligt in twee van de drie mogelijke scheepsplaatsingen door de treffer op F2. |
| 24 | G2 | hit | Door de missers op E2 en F3 moet het schip bij F2 horizontaal door G2 en H2 lopen. |
| 25 | H2 | sunk Cruiser | F2 kan alleen bij het schip F2–G2–H2 horen, dus H2 is een gegarandeerde treffer die het schip laat zinken. |
| 26 | B8 | miss | B8 ligt in de meeste nog mogelijke plaatsingen van de overgebleven onderzeeër. |
| 27 | I8 | miss | I8 ligt in vier mogelijke plaatsingen van de resterende onderzeeër. |
| 28 | J4 | hit | J4 ligt in vier geldige plaatsingen van de resterende onderzeeër, het hoogste aantal. |
| 29 | J5 | hit | J5 ligt in twee van de vier mogelijke plaatsingen van de laatste onderzeeër. |
| 30 | J3 | miss | J3 voltooit een van de twee mogelijke posities van de laatste onderzeeër. |
| 31 | J6 | sunk Submarine | J3 is water, dus J6 is het laatste vak van de onderzeeër. |

