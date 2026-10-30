export const GROUPS=[
 {name:'Počátky a klasické frakce',period:'1978–1997',ids:['classic','lion','falcon','forest','black','wolf','dragon','royal','dark','fright']},
 {name:'Rytířská království',period:'2000–2006',ids:['leo','bull','morcia','shadow','rogue']},
 {name:'Fantasy, Kingdoms a Castle',period:'2007–2013',ids:['crown','dwarf','troll','skeleton','kingdom-lion','kingdom-dragon','blue-lion','red-dragon']},
 {name:'Nové erby',period:'od 2025',ids:['horse','griffin','kraken','serpent']},
 {name:'Postavy a příbuzné světy',period:'přesahy',ids:['independent','civil','ninja','viking','elf']}
];
export const HISTORY_URL='https://www.lego.com/cs-cz/history/articles/f-lego-castle';
export const FACTIONS_URL='https://www.lego.com/en-gb/categories/adults-welcome/article/lego-castle-factions';
export const CHAPTERS=[
 {year:'1978',title:'Nejdřív byl žlutý hrad.',text:'LEGO Castle začíná setem 375. Koně jsou ještě sestavení z kostek a rytíři mají různé erby. Atlas je řadí do skupiny Classic Castle.',ids:['classic'],source:HISTORY_URL},
 {year:'1984',title:'Rytíři dostávají vlastní strany.',text:'Šedé hradby, jednodílní koně a výrazné erby. Nastupují Lví rytíři a Černí sokoli; v roce 1987 se k nim přidávají Lesní zbojníci.',ids:['lion','falcon','forest'],source:HISTORY_URL},
 {year:'1992–1997',title:'Psanci, draci a temná magie.',text:'Vlčí smečka, Dračí mistři a Netopýří rytíři rozšiřují klasický svět. Podobný motiv na štítu ale ještě neznamená stejnou frakci: Černí rytíři a Dračí mistři mají vlastní katalogové skupiny.',ids:['wolf','dragon','fright'],source:FACTIONS_URL},
 {year:'2000–2006',title:'Příběhy království a hrdinů.',text:'Knights’ Kingdom zahrnuje několik odlišných řad. Království krále Lea a Býčí rytíře sledujeme odděleně od pozdějších hrdinů Morcie a Stínových rytířů.',ids:['leo','bull','morcia','shadow'],source:null},
 {year:'2007–2013',title:'Fantasy i návrat ke klasice.',text:'Korunní rytíři, trpaslíci, trollové a kostlivci patří do Fantasy Era. Pozdější lvi a draci z Kingdoms a Castle 2013 mají samostatné záznamy, aby se nemíchaly odlišné generace.',ids:['crown','dwarf','troll','kingdom-lion','blue-lion'],source:null},
 {year:'2021–2026',title:'Staré erby v nových stavbách.',text:'Moderní návraty najdeš napříč Ideas, Icons, Creator a BrickLink Designer Programem. Jeden set může obsahovat několik frakcí — proto propojujeme konkrétní figurky a jejich inventáře.',ids:['falcon','lion','horse','griffin'],source:'https://www.lego.com/en-us/categories/adults-welcome/article/building-a-lego-castle'}
];
export const STORIES=[
 {ids:['lion','falcon'],label:'Doložené v průvodci LEGO',type:'documented',title:'Lvi a sokoli: klasické soupeření',text:'Oficiální průvodce LEGO popisuje Lví rytíře a Černé sokoly jako soupeře. Konkrétní sety ale sledujeme samostatně: společný inventář sám neurčuje, zda jde o bitvu nebo přátelskou návštěvu.',source:FACTIONS_URL},
 {ids:['falcon','black'],label:'Fanouškovská teorie',type:'fan',title:'Stal se Černý sokol Černým rytířem?',text:'Příběh o vůdci sokolů, který odešel a založil Černé rytíře, uvádí i web LEGO jako fanouškovskou legendu. Nepovažujeme jej za potvrzený rodokmen; obě frakce zůstávají v katalogu oddělené.',source:FACTIONS_URL},
 {ids:['horse','griffin','kraken','serpent'],label:'Redakční poznámka',type:'editorial',title:'Nové erby, otevřené příběhy',text:'U nových erbů vycházíme z názvů a inventářů figurek. Společný výskyt v setu není důkazem spojenectví. Mapu společných setů proto oddělujeme od příběhových tvrzení.',source:null}
];
