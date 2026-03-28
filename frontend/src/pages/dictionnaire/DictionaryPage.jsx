// import { useState, useEffect, useRef, useCallback, useMemo } from "react";
// import api from "../../utils/api.js";
// //import api from '../utils/api'; // ton instance axios avec baseURL + JWT
//
// // ─── 300 mots seed embarqués — affichés instantanément ───────────────────────
// const SEED_WORDS = [
//     ["the","le/la/les","det","A1"],["be","être","v","A1"],["to","à/de","prep","A1"],
//     ["of","de","prep","A1"],["and","et","conj","A1"],["a","un/une","det","A1"],
//     ["in","dans/en","prep","A1"],["that","que/ce","conj","A1"],["have","avoir","v","A1"],
//     ["it","il/elle","pron","A1"],["for","pour","prep","A1"],["not","ne...pas","adv","A1"],
//     ["on","sur","prep","A1"],["with","avec","prep","A1"],["he","il","pron","A1"],
//     ["as","comme","conj","A1"],["you","tu/vous","pron","A1"],["do","faire","v","A1"],
//     ["at","à","prep","A1"],["this","ce/ceci","det","A1"],["but","mais","conj","A1"],
//     ["his","son/sa","det","A1"],["by","par","prep","A1"],["from","de/depuis","prep","A1"],
//     ["they","ils/elles","pron","A1"],["we","nous","pron","A1"],["say","dire","v","A1"],
//     ["her","elle/son","pron","A1"],["she","elle","pron","A1"],["or","ou","conj","A1"],
//     ["an","un/une","det","A1"],["will","aller (futur)","v","A1"],["my","mon/ma","det","A1"],
//     ["one","un/une","num","A1"],["all","tout/tous","det","A1"],["would","voudrais","v","A1"],
//     ["there","là/il y a","adv","A1"],["their","leur(s)","det","A1"],["what","quoi/quel","pron","A1"],
//     ["so","donc/si","conj","A1"],["up","haut/vers le haut","adv","A1"],["out","dehors/hors","adv","A1"],
//     ["if","si","conj","A1"],["about","à propos de","prep","A1"],["who","qui","pron","A1"],
//     ["get","obtenir/avoir","v","A1"],["which","lequel/qui","pron","A1"],["go","aller","v","A1"],
//     ["me","moi/me","pron","A1"],["when","quand","conj","A1"],["make","faire/fabriquer","v","A1"],
//     ["can","pouvoir","v","A1"],["like","aimer/comme","v","A1"],["time","le temps/l'heure","n","A1"],
//     ["no","non/pas de","adv","A1"],["just","juste/seulement","adv","A1"],["him","lui","pron","A1"],
//     ["know","savoir/connaître","v","A1"],["take","prendre","v","A1"],["people","les gens","n","A1"],
//     ["into","dans/en","prep","A1"],["year","l'année","n","A1"],["your","ton/votre","det","A1"],
//     ["good","bon/bien","adj","A1"],["some","quelques/du","det","A1"],["could","pourrait","v","A1"],
//     ["them","eux/les","pron","A1"],["see","voir","v","A1"],["other","autre","adj","A1"],
//     ["than","que (comparatif)","conj","A1"],["then","alors/puis","adv","A1"],["now","maintenant","adv","A1"],
//     ["look","regarder","v","A1"],["only","seulement","adv","A1"],["come","venir","v","A1"],
//     ["its","son/sa/ses","det","A1"],["over","sur/plus de","prep","A1"],["think","penser","v","A1"],
//     ["also","aussi","adv","A1"],["back","le dos/retour","n","A1"],["after","après","prep","A1"],
//     ["use","utiliser","v","A1"],["two","deux","num","A1"],["how","comment","adv","A1"],
//     ["our","notre/nos","det","A1"],["work","le travail/travailler","n","A1"],["first","premier","adj","A1"],
//     ["well","bien","adv","A1"],["way","le chemin/la manière","n","A1"],["even","même","adv","A1"],
//     ["new","nouveau","adj","A1"],["want","vouloir","v","A1"],["because","parce que","conj","A1"],
//     ["any","tout/n'importe quel","det","A1"],["these","ces","det","A1"],["give","donner","v","A1"],
//     ["day","le jour","n","A1"],["most","le plus/la plupart","det","A1"],["us","nous","pron","A1"],
//     ["between","entre","prep","A1"],["need","avoir besoin de","v","A1"],["large","grand/large","adj","A1"],
//     ["often","souvent","adv","A1"],["hand","la main","n","A1"],["high","haut/élevé","adj","A1"],
//     ["place","l'endroit/mettre","n","A1"],["hold","tenir","v","A1"],["turn","tourner/le tour","v","A1"],
//     ["without","sans","prep","A1"],["again","encore/de nouveau","adv","A1"],["play","jouer","v","A1"],
//     ["small","petit","adj","A1"],["number","le numéro","n","A1"],["always","toujours","adv","A1"],
//     ["move","bouger/déménager","v","A1"],["right","droit/correct","adj","A1"],["life","la vie","n","A1"],
//     ["few","peu de","det","A1"],["open","ouvrir/ouvert","v","A1"],["seem","sembler","v","A1"],
//     ["together","ensemble","adv","A1"],["next","prochain/suivant","adj","A1"],["white","blanc","adj","A1"],
//     ["children","les enfants","n","A1"],["begin","commencer","v","A1"],["walk","marcher","v","A1"],
//     ["example","l'exemple","n","A1"],["both","les deux","det","A1"],["book","le livre","n","A1"],
//     ["until","jusqu'à","prep","A1"],["car","la voiture","n","A1"],["care","le soin/se soucier","n","A1"],
//     ["second","deuxième/la seconde","adj","A1"],["enough","assez","adv","A1"],["girl","la fille","n","A1"],
//     ["young","jeune","adj","A1"],["ready","prêt","adj","A1"],["above","au-dessus","prep","A1"],
//     ["ever","jamais/toujours","adv","A1"],["red","rouge","adj","A1"],["feel","sentir/ressentir","v","A1"],
//     ["talk","parler","v","A1"],["bird","l'oiseau","n","A1"],["soon","bientôt","adv","A1"],
//     ["body","le corps","n","A1"],["dog","le chien","n","A1"],["family","la famille","n","A1"],
//     ["door","la porte","n","A1"],["black","noir","adj","A1"],["short","court/petit","adj","A1"],
//     ["class","la classe","n","A1"],["wind","le vent","n","A1"],["question","la question","n","A1"],
//     ["happen","arriver/se passer","v","A1"],["area","la zone/la région","n","A1"],["half","la moitié","n","A1"],
//     ["rock","la roche","n","A1"],["order","l'ordre/commander","n","A1"],["fire","le feu","n","A1"],
//     ["problem","le problème","n","A1"],["piece","la pièce/le morceau","n","A1"],["pass","passer","v","A1"],
//     ["since","depuis/puisque","prep","A1"],["top","le sommet","n","A1"],["whole","entier","adj","A1"],
//     ["space","l'espace","n","A1"],["hear","entendre","v","A1"],["best","meilleur","adj","A1"],
//     ["hour","l'heure","n","A1"],["better","mieux/meilleur","adj","A1"],["true","vrai","adj","A1"],
//     ["during","pendant/durant","prep","A1"],["hundred","cent","num","A1"],["remember","se souvenir","v","A1"],
//     ["step","l'étape/marcher","n","A1"],["early","tôt","adj","A1"],["ground","le sol","n","A1"],
//     ["fast","rapide/vite","adj","A1"],["sing","chanter","v","A1"],["listen","écouter","v","A1"],
//     ["table","la table","n","A1"],["travel","voyager","v","A1"],["less","moins","adv","A1"],
//     ["morning","le matin","n","A1"],["simple","simple","adj","A1"],["several","plusieurs","det","A1"],
//     ["toward","vers","prep","A1"],["war","la guerre","n","A1"],["against","contre","prep","A1"],
//     ["slow","lent","adj","A1"],["center","le centre","n","A1"],["love","l'amour/aimer","n","A1"],
//     ["person","la personne","n","A1"],["money","l'argent","n","A1"],["serve","servir","v","A1"],
//     ["appear","apparaître","v","A1"],["road","la route","n","A1"],["rain","la pluie/pleuvoir","n","A1"],
//     ["rule","la règle","n","A1"],["pull","tirer","v","A1"],["cold","froid","adj","A1"],
//     ["voice","la voix","n","A1"],["power","le pouvoir","n","A1"],["town","la ville","n","A1"],
//     ["drive","conduire","v","A1"],["lead","mener","v","A1"],["dark","sombre","adj","A1"],
//     ["wait","attendre","v","A1"],["plan","le plan/planifier","n","A1"],["star","l'étoile","n","A1"],
//     ["box","la boîte","n","A1"],["field","le champ","n","A1"],["rest","le repos/se reposer","n","A1"],
//     ["correct","correct/corriger","adj","A1"],["able","capable","adj","A1"],["front","le devant","n","A1"],
//     ["teach","enseigner","v","A1"],["week","la semaine","n","A1"],["green","vert","adj","A1"],
//     ["quick","rapide","adj","A1"],["develop","développer","v","A2"],["ocean","l'océan","n","A1"],
//     ["warm","chaud/chaleureux","adj","A1"],["free","libre/gratuit","adj","A1"],["minute","la minute","n","A1"],
//     ["strong","fort","adj","A1"],["special","spécial","adj","A1"],["mind","l'esprit","n","A1"],
//     ["behind","derrière","prep","A1"],["clear","clair","adj","A1"],["produce","produire","v","A1"],
//     ["fact","le fait","n","A1"],["street","la rue","n","A1"],["course","le cours","n","A1"],
//     ["stay","rester","v","A1"],["full","plein","adj","A1"],["force","la force/forcer","n","A1"],
//     ["blue","bleu","adj","A1"],["decide","décider","v","A1"],["surface","la surface","n","A1"],
//     ["deep","profond","adj","A1"],["moon","la lune","n","A1"],["island","l'île","n","A1"],
//     ["system","le système","n","A1"],["test","le test/tester","n","A1"],["boat","le bateau","n","A1"],
//     ["common","commun","adj","A1"],["gold","l'or","n","A1"],["possible","possible","adj","A1"],
//     ["age","l'âge","n","A1"],["dry","sec/sécher","adj","A1"],["wonder","se demander","v","A1"],
//     ["laugh","rire","v","A1"],["thousand","mille","num","A1"],["game","le jeu","n","A1"],
//     ["shape","la forme","n","A1"],["hot","chaud","adj","A1"],["heat","la chaleur","n","A1"],
//     ["snow","la neige/neiger","n","A1"],["bring","apporter","v","A1"],["yes","oui","adv","A1"],
//     ["fill","remplir","v","A1"],["language","la langue","n","A1"],["among","parmi","prep","A1"],
//     ["ball","la balle","n","A1"],["yet","encore/pourtant","adv","A1"],["wave","la vague/saluer","n","A1"],
//     ["heart","le cœur","n","A1"],["present","présent/le cadeau","adj","A1"],["heavy","lourd","adj","A1"],
//     ["dance","danser/la danse","v","A1"],["arm","le bras","n","A1"],["wide","large","adj","A1"],
//     ["size","la taille","n","A1"],["speak","parler","v","A1"],["weight","le poids","n","A1"],
//     ["general","général","adj","A1"],["ice","la glace","n","A1"],["matter","la question/importer","n","A1"],
//     ["include","inclure","v","A1"],["divide","diviser","v","A1"],["pick","choisir","v","A1"],
//     ["count","compter","v","A1"],["reason","la raison","n","A1"],["length","la longueur","n","A1"],
//     ["art","l'art","n","A1"],["subject","le sujet","n","A1"],["energy","l'énergie","n","A1"],
//     ["bed","le lit","n","A1"],["brother","le frère","n","A1"],["egg","l'œuf","n","A1"],
//     ["ride","monter/le tour","v","A1"],["believe","croire","v","A1"],["forest","la forêt","n","A1"],
//     ["sit","s'asseoir","v","A1"],["race","la course/la race","n","A1"],["window","la fenêtre","n","A1"],
//     ["store","le magasin/stocker","n","A1"],["summer","l'été","n","A1"],["train","le train/entraîner","n","A1"],
//     ["sleep","dormir/le sommeil","v","A1"],["leg","la jambe","n","A1"],["wall","le mur","n","A1"],
//     ["catch","attraper","v","A1"],["sky","le ciel","n","A1"],["board","la planche/le conseil","n","A1"],
//     ["joy","la joie","n","A1"],["winter","l'hiver","n","A1"],["glass","le verre","n","A1"],
//     ["grass","l'herbe","n","A1"],["cow","la vache","n","A1"],["job","l'emploi","n","A1"],
//     ["sign","le signe/signer","n","A1"],["visit","visiter","v","A1"],["past","le passé","n","A1"],
//     ["soft","doux/mou","adj","A1"],["fun","amusant","adj","A1"],["bright","lumineux","adj","A1"],
//     ["gas","le gaz","n","A1"],["weather","le temps/la météo","n","A1"],["month","le mois","n","A1"],
//     ["bear","l'ours/supporter","n","A1"],["finish","finir","v","A1"],["happy","heureux","adj","A1"],
//     ["hope","l'espoir/espérer","n","A1"],["flower","la fleur","n","A1"],["gone","parti","v","A1"],
//     ["jump","sauter","v","A1"],["baby","le bébé","n","A1"],["village","le village","n","A1"],
//     ["meet","rencontrer","v","A1"],["buy","acheter","v","A1"],["metal","le métal","n","A1"],
//     ["push","pousser","v","A1"],["hair","les cheveux","n","A1"],["describe","décrire","v","A1"],
//     ["cook","cuisiner","v","A1"],["floor","le sol/plancher","n","A1"],["result","le résultat","n","A1"],
//     ["burn","brûler","v","A1"],["hill","la colline","n","A1"],["safe","sûr","adj","A1"],
//     ["cat","le chat","n","A1"],["consider","considérer","v","A1"],["type","le type/taper","n","A1"],
//     ["law","la loi","n","A1"],["coast","la côte","n","A1"],["copy","la copie/copier","n","A1"],
//     ["tall","grand (personne)","adj","A1"],["sand","le sable","n","A1"],["soil","le sol/la terre","n","A1"],
//     ["temperature","la température","n","A1"],["finger","le doigt","n","A1"],["value","la valeur","n","A1"],
//     ["fight","le combat/se battre","n","A1"],["beat","battre","v","A1"],["natural","naturel","adj","A1"],
//     ["view","la vue","n","A1"],["sense","le sens","n","A1"],["ear","l'oreille","n","A1"],
//     ["quite","assez/tout à fait","adv","A1"],["case","le cas","n","A1"],["middle","le milieu","n","A1"],
//     ["kill","tuer","v","A1"],["son","le fils","n","A1"],["lake","le lac","n","A1"],
//     ["moment","le moment","n","A1"],["loud","fort/bruyant","adj","A1"],["spring","le printemps","n","A1"],
//     ["child","l'enfant","n","A1"],["straight","droit","adj","A1"],["nation","la nation","n","A1"],
//     ["milk","le lait","n","A1"],["speed","la vitesse","n","A1"],["method","la méthode","n","A1"],
//     ["pay","payer","v","A1"],["section","la section","n","A1"],["dress","la robe/s'habiller","n","A1"],
//     ["cloud","le nuage","n","A1"],["quiet","calme/silencieux","adj","A1"],["stone","la pierre","n","A1"],
//     ["tiny","minuscule","adj","A1"],["climb","grimper","v","A1"],["cool","frais","adj","A1"],
//     ["poor","pauvre","adj","A1"],["key","la clé","n","A1"],["iron","le fer","n","A1"],
//     ["single","seul/célibataire","adj","A1"],["flat","plat","adj","A1"],["skin","la peau","n","A1"],
//     ["smile","le sourire/sourire","n","A1"],["hole","le trou","n","A1"],["trip","le voyage","n","A1"],
//     ["office","le bureau","n","A1"],["receive","recevoir","v","A1"],["mouth","la bouche","n","A1"],
//     ["exact","exact","adj","A1"],["die","mourir","v","A1"],["trouble","le problème","n","A1"],
//     ["shout","crier","v","A1"],["except","sauf","prep","A1"],["seed","la graine","n","A1"],
//     ["join","rejoindre","v","A1"],["suggest","suggérer","v","A1"],["clean","propre/nettoyer","adj","A1"],
//     ["break","casser/la pause","v","A1"],["rise","monter/se lever","v","A1"],["bad","mauvais","adj","A1"],
//     ["blow","souffler","v","A1"],["oil","l'huile","n","A1"],["blood","le sang","n","A1"],
//     ["touch","toucher","v","A1"],["mix","mélanger","v","A1"],["team","l'équipe","n","A1"],
//     ["cost","le coût/coûter","n","A1"],["brown","marron","adj","A1"],["wear","porter (vêtements)","v","A1"],
//     ["garden","le jardin","n","A1"],["equal","égal","adj","A1"],["choose","choisir","v","A1"],
//     ["fair","juste/la foire","adj","A1"],["bank","la banque/la rive","n","A1"],["save","sauver/économiser","v","A1"],
//     ["control","contrôler","v","A1"],["gentle","doux/gentil","adj","A1"],["woman","la femme","n","A1"],
//     ["difficult","difficile","adj","A1"],["doctor","le médecin","n","A1"],["please","s'il vous plaît","adv","A1"],
//     ["protect","protéger","v","A1"],["modern","moderne","adj","A1"],["element","l'élément","n","A1"],
//     ["student","l'étudiant","n","A1"],["corner","le coin","n","A1"],["party","la fête/le parti","n","A1"],
//     ["bone","l'os","n","A1"],["imagine","imaginer","v","A1"],["provide","fournir","v","A1"],
//     ["agree","être d'accord","v","A1"],["capital","la capitale","n","A1"],["chair","la chaise","n","A1"],
//     ["danger","le danger","n","A1"],["fruit","le fruit","n","A1"],["rich","riche","adj","A1"],
//     ["thick","épais","adj","A1"],["soldier","le soldat","n","A1"],["process","le processus","n","A1"],
//     ["guess","deviner","v","A1"],["necessary","nécessaire","adj","A1"],["sharp","aigu/tranchant","adj","A1"],
//     ["wing","l'aile","n","A1"],["create","créer","v","A1"],["wash","laver","v","A1"],
//     ["rather","plutôt","adv","A1"],["crowd","la foule","n","A1"],["compare","comparer","v","A1"],
//     ["poem","le poème","n","A1"],["depend","dépendre","v","A1"],["meat","la viande","n","A1"],
//     ["famous","célèbre","adj","A1"],["dollar","le dollar","n","A1"],["fear","la peur/craindre","n","A1"],
//     ["thin","mince","adj","A1"],["planet","la planète","n","A1"],["clock","l'horloge","n","A1"],
//     ["enter","entrer","v","A1"],["major","majeur","adj","A1"],["fresh","frais","adj","A1"],
//     ["search","chercher","v","A1"],["send","envoyer","v","A1"],["yellow","jaune","adj","A1"],
//     ["allow","permettre","v","A1"],["dead","mort","adj","A1"],["current","actuel/le courant","adj","A1"],
//     ["lift","lever/l'ascenseur","v","A1"],["arrive","arriver","v","A1"],["track","la piste/suivre","n","A1"],
//     ["parent","le parent","n","A1"],["sheet","la feuille/le drap","n","A1"],["connect","connecter","v","A1"],
//     ["post","le poste/publier","n","A1"],["spend","dépenser/passer","v","A1"],["fat","gras","adj","A1"],
//     ["share","partager","v","A1"],["station","la station/la gare","n","A1"],["bread","le pain","n","A1"],
//     ["charge","la charge/charger","n","A1"],["offer","offrir","v","A1"],["market","le marché","n","A1"],
//     ["degree","le degré","n","A1"],["dear","cher","adj","A1"],["enemy","l'ennemi","n","A1"],
//     ["reply","répondre","v","A1"],["drink","boire/la boisson","v","A1"],["support","soutenir","v","A1"],
//     ["speech","le discours","n","A1"],["nature","la nature","n","A1"],["steam","la vapeur","n","A1"],
//     ["motion","le mouvement","n","A1"],["path","le chemin/le sentier","n","A1"],["liquid","le liquide","n","A1"],
//     ["teeth","les dents","n","A1"],["neck","le cou","n","A1"],["oxygen","l'oxygène","n","A1"],
//     ["sugar","le sucre","n","A1"],["death","la mort","n","A1"],["pretty","joli/assez","adj","A1"],
//     ["skill","la compétence","n","A1"],["season","la saison","n","A1"],["solution","la solution","n","A1"],
//     ["silver","l'argent (métal)","n","A1"],["thank","remercier","v","A1"],["branch","la branche","n","A1"],
//     ["match","l'allumette/correspondre","n","A1"],["afraid","avoir peur","adj","A1"],["huge","énorme","adj","A1"],
//     ["sister","la sœur","n","A1"],["discuss","discuter","v","A1"],["similar","similaire","adj","A1"],
//     ["guide","le guide/guider","n","A1"],["experience","l'expérience","n","A1"],["score","le score","n","A1"],
//     ["apple","la pomme","n","A1"],["coat","le manteau","n","A1"],["mass","la masse","n","A1"],
//     ["card","la carte","n","A1"],["rope","la corde","n","A1"],["win","gagner","v","A1"],
//     ["dream","le rêve/rêver","n","A1"],["evening","le soir","n","A1"],["condition","la condition","n","A1"],
//     ["feed","nourrir","v","A1"],["tool","l'outil","n","A1"],["total","le total","n","A1"],
//     ["smell","l'odeur/sentir","n","A1"],["valley","la vallée","n","A1"],["double","double/doubler","adj","A1"],
//     ["seat","le siège","n","A1"],["basic","basique/fondamental","adj","A2"],["ocean","l'océan","n","A1"],
// ];
//
// const LEVELS_ORDER = ["A1","A2","B1","B2","C1","C2"];
// const PARTS_OF_SPEECH = ["n","v","adj","adv","prep","conj","pron","det","num","interj"];
// const POS_LABELS = {
//     n:"nom", v:"verbe", adj:"adjectif", adv:"adverbe",
//     prep:"préposition", conj:"conjonction", pron:"pronom",
//     det:"déterminant", num:"numéral", interj:"interjection",
// };
// const LEVEL_STYLE = {
//     A1:{ bg:"#dcfce7", text:"#166534", border:"#86efac" },
//     A2:{ bg:"#fef9c3", text:"#854d0e", border:"#fde047" },
//     B1:{ bg:"#ffedd5", text:"#9a3412", border:"#fdba74" },
//     B2:{ bg:"#fce7f3", text:"#9d174d", border:"#f9a8d4" },
//     C1:{ bg:"#ede9fe", text:"#4c1d95", border:"#c4b5fd" },
//     C2:{ bg:"#e0f2fe", text:"#0c4a6e", border:"#7dd3fc" },
// };
//
// // ─── Chart ────────────────────────────────────────────────────────────────────
// function useChartJS() {
//     const [ready, setReady] = useState(!!window.Chart);
//     useEffect(() => {
//         if (window.Chart) return;
//         const s = document.createElement("script");
//         s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
//         s.onload = () => setReady(true);
//         document.head.appendChild(s);
//     }, []);
//     return ready;
// }
//
// function StatsChart({ words }) {
//     const canvasRef  = useRef(null);
//     const chartRef   = useRef(null);
//     const chartReady = useChartJS();
//
//     useEffect(() => {
//         if (!chartReady || !canvasRef.current) return;
//         if (chartRef.current) chartRef.current.destroy();
//         const counts = Object.fromEntries(LEVELS_ORDER.map(l => [l, 0]));
//         words.forEach(w => { if (counts[w[3]] !== undefined) counts[w[3]]++; });
//         chartRef.current = new window.Chart(canvasRef.current, {
//             type: "bar",
//             data: {
//                 labels: LEVELS_ORDER,
//                 datasets: [{
//                     data: LEVELS_ORDER.map(l => counts[l]),
//                     backgroundColor: ["#22c55e","#84cc16","#f59e0b","#f97316","#ef4444","#8b5cf6"],
//                     borderRadius: 6, borderSkipped: false,
//                 }],
//             },
//             options: {
//                 responsive: true, maintainAspectRatio: false,
//                 plugins: { legend: { display: false } },
//                 scales: {
//                     x: { grid: { display: false }, ticks: { font: { size: 12, weight: "600" } } },
//                     y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.06)" }, ticks: { precision: 0 } },
//                 },
//             },
//         });
//         return () => chartRef.current?.destroy();
//     }, [chartReady, words]);
//
//     return <div style={{ position:"relative", height:160 }}><canvas ref={canvasRef} /></div>;
// }
//
// // ─── Word card ────────────────────────────────────────────────────────────────
// function WordCard({ word, onSpeak }) {
//     const [word_en, trans_fr, pos, level] = word;
//     const ls = LEVEL_STYLE[level] || LEVEL_STYLE.A1;
//     return (
//         <div
//             style={{
//                 background:"var(--color-background-primary)",
//                 border:"0.5px solid var(--color-border-tertiary)",
//                 borderRadius:10, padding:"10px 14px",
//                 display:"flex", alignItems:"center", gap:10,
//                 transition:"box-shadow 0.15s",
//             }}
//             onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)"}
//             onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
//         >
//             <div style={{ flex:1, minWidth:0 }}>
//                 <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
//                     <span style={{ fontWeight:600, fontSize:15, color:"var(--color-text-primary)" }}>{word_en}</span>
//                     <span style={{
//                         fontSize:10, fontWeight:600, padding:"1px 6px", borderRadius:4, flexShrink:0,
//                         background:ls.bg, color:ls.text, border:`1px solid ${ls.border}`,
//                     }}>{level}</span>
//                     <span style={{
//                         fontSize:10, padding:"1px 6px", borderRadius:4, flexShrink:0,
//                         background:"var(--color-background-secondary)", color:"var(--color-text-tertiary)",
//                     }}>{POS_LABELS[pos] || pos}</span>
//                 </div>
//                 <div style={{ fontSize:13, color:"var(--color-text-secondary)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
//                     {trans_fr}
//                 </div>
//             </div>
//             <button
//                 onClick={() => onSpeak(word_en)}
//                 title="Écouter"
//                 style={{
//                     background:"none", border:"none", cursor:"pointer", padding:4,
//                     color:"var(--color-text-tertiary)", fontSize:14, flexShrink:0, borderRadius:4,
//                 }}
//             >🔊</button>
//         </div>
//     );
// }
//
// // ─── Main ─────────────────────────────────────────────────────────────────────
// const PER_PAGE     = 60;
// const TOTAL_BATCHES = 9;
//
// export default function DictionaryPage() {
//     const [words,         setWords]         = useState(SEED_WORDS);
//     const [search,        setSearch]        = useState("");
//     const [filterLevel,   setFilterLevel]   = useState("");
//     const [filterPOS,     setFilterPOS]     = useState("");
//     const [page,          setPage]          = useState(1);
//     const [showStats,     setShowStats]     = useState(false);
//     const [loadedBatches, setLoadedBatches] = useState(0);
//     const [loading,       setLoading]       = useState(false);
//     const [error,         setError]         = useState(null);
//
//     const addWords = useCallback((newWords) => {
//         setWords(prev => {
//             const seen   = new Set(prev.map(w => w[0].toLowerCase()));
//             const unique = newWords.filter(w => Array.isArray(w) && w.length >= 4 && !seen.has(w[0].toLowerCase()));
//             return [...prev, ...unique];
//         });
//     }, []);
//
//     const speak = (word) => {
//         const utt  = new SpeechSynthesisUtterance(word);
//         utt.lang   = "en-US";
//         window.speechSynthesis.speak(utt);
//     };
//
//     const filtered = useMemo(() => {
//         const q = search.toLowerCase().trim();
//         return words
//             .filter(w => {
//                 if (filterLevel && w[3] !== filterLevel) return false;
//                 if (filterPOS   && w[2] !== filterPOS)   return false;
//                 if (q && !w[0].toLowerCase().includes(q) && !w[1].toLowerCase().includes(q)) return false;
//                 return true;
//             })
//             .sort((a, b) => a[0].localeCompare(b[0]));
//     }, [words, search, filterLevel, filterPOS]);
//
//     const totalPages = Math.ceil(filtered.length / PER_PAGE);
//     const pageWords  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
//
//     useEffect(() => { setPage(1); }, [search, filterLevel, filterPOS]);
//
//     const progress = Math.min(100, Math.round(
//         ((SEED_WORDS.length + loadedBatches * 500) / 5000) * 100
//     ));
//
//     return (
//         <div style={{ maxWidth:960, margin:"0 auto", paddingBottom:"3rem" }}>
//
//             {/* Header */}
//             <div style={{ margin:"1.5rem" }}>
//
//
//                 {/* Stats */}
//                 {showStats && (
//                     <div style={{
//                         background:"var(--color-background-primary)",
//                         border:"0.5px solid var(--color-border-tertiary)",
//                         borderRadius:12, padding:"1rem 1.25rem", marginBottom:"1rem",
//                     }}>
//                         <div style={{ fontSize:13, fontWeight:500, color:"var(--color-text-secondary)", marginBottom:8 }}>
//                             Distribution par niveau CECRL
//                         </div>
//                         <StatsChart words={words} />
//                         <div style={{ display:"flex", gap:8, marginTop:12, flexWrap:"wrap" }}>
//                             {LEVELS_ORDER.map(l => {
//                                 const count = words.filter(w => w[3] === l).length;
//                                 const ls    = LEVEL_STYLE[l];
//                                 return (
//                                     <div key={l} style={{
//                                         padding:"3px 10px", borderRadius:6, fontSize:12, fontWeight:600,
//                                         background:ls.bg, color:ls.text, border:`1px solid ${ls.border}`,
//                                         cursor:"pointer",
//                                     }} onClick={() => setFilterLevel(filterLevel === l ? "" : l)}>
//                                         {l} · {count}
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 )}
//
//                 {/* Filtres */}
//                 <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
//                     <input
//                         value={search}
//                         onChange={e => setSearch(e.target.value)}
//                         placeholder="Rechercher en anglais ou français…"
//                         style={{
//                             flex:"1 1 240px", padding:"8px 12px", fontSize:14,
//                             border:"0.5px solid var(--color-border-secondary)",
//                             borderRadius:8, background:"var(--color-background-primary)",
//                             color:"var(--color-text-primary)", outline:"none",
//                             boxSizing:"border-box",
//                         }}
//                     />
//                     <select
//                         value={filterLevel}
//                         onChange={e => setFilterLevel(e.target.value)}
//                         style={{
//                             padding:"8px 10px", fontSize:13, borderRadius:8,
//                             border:"0.5px solid var(--color-border-secondary)",
//                             background:"var(--color-background-primary)",
//                             color:"var(--color-text-primary)", cursor:"pointer",
//                         }}
//                     >
//                         <option value="">Tous niveaux</option>
//                         {LEVELS_ORDER.map(l => <option key={l} value={l}>{l}</option>)}
//                     </select>
//                     <select
//                         value={filterPOS}
//                         onChange={e => setFilterPOS(e.target.value)}
//                         style={{
//                             padding:"8px 10px", fontSize:13, borderRadius:8,
//                             border:"0.5px solid var(--color-border-secondary)",
//                             background:"var(--color-background-primary)",
//                             color:"var(--color-text-primary)", cursor:"pointer",
//                         }}
//                     >
//                         <option value="">Toutes classes</option>
//                         {PARTS_OF_SPEECH.map(p => <option key={p} value={p}>{POS_LABELS[p]}</option>)}
//                     </select>
//                     {(search || filterLevel || filterPOS) && (
//                         <button
//                             onClick={() => { setSearch(""); setFilterLevel(""); setFilterPOS(""); }}
//                             style={{
//                                 padding:"8px 12px", fontSize:13, borderRadius:8, cursor:"pointer",
//                                 border:"0.5px solid var(--color-border-secondary)",
//                                 background:"var(--color-background-primary)",
//                                 color:"var(--color-text-secondary)",
//                             }}
//                         >✕ Reset</button>
//                     )}
//                 </div>
//
//                 <div style={{ marginTop:6, fontSize:12, color:"var(--color-text-tertiary)" }}>
//                     {filtered.length.toLocaleString()} résultat{filtered.length > 1 ? "s" : ""} · page {page}/{totalPages || 1}
//                 </div>
//             </div>
//
//             {/* Grille */}
//             {pageWords.length === 0 ? (
//                 <div style={{ textAlign:"center", padding:"3rem", color:"var(--color-text-secondary)", fontSize:14 }}>
//                     Aucun résultat pour cette recherche.
//                 </div>
//             ) : (
//                 <div style={{
//                     display:"grid",
//                     gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))",
//                     gap:8,
//                 }}>
//                     {pageWords.map((w, i) => (
//                         <WordCard key={`${w[0]}-${i}`} word={w} onSpeak={speak} />
//                     ))}
//                 </div>
//             )}
//
//             {/* Pagination */}
//             {totalPages > 1 && (
//                 <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:6, marginTop:"1.5rem", flexWrap:"wrap" }}>
//                     <button
//                         onClick={() => setPage(1)} disabled={page === 1}
//                         style={paginationBtn(page === 1)}
//                     >«</button>
//                     <button
//                         onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
//                         style={paginationBtn(page === 1)}
//                     >‹ Préc.</button>
//
//                     {paginationRange(page, totalPages).map((p, i) =>
//                         p === "…" ? (
//                             <span key={`dot-${i}`} style={{ fontSize:13, color:"var(--color-text-tertiary)", padding:"0 4px" }}>…</span>
//                         ) : (
//                             <button
//                                 key={p}
//                                 onClick={() => setPage(p)}
//                                 style={paginationBtn(false, page === p)}
//                             >{p}</button>
//                         )
//                     )}
//
//                     <button
//                         onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
//                         style={paginationBtn(page === totalPages)}
//                     >Suiv. ›</button>
//                     <button
//                         onClick={() => setPage(totalPages)} disabled={page === totalPages}
//                         style={paginationBtn(page === totalPages)}
//                     >»</button>
//                 </div>
//             )}
//         </div>
//     );
// }
//
// // ─── Helpers ──────────────────────────────────────────────────────────────────
// function paginationBtn(disabled, active = false) {
//     return {
//         padding:"6px 12px", borderRadius:8, fontSize:13, cursor: disabled ? "default" : "pointer",
//         border:"0.5px solid var(--color-border-secondary)",
//         background: active ? "#22c55e" : "var(--color-background-primary)",
//         color: active ? "white" : disabled ? "var(--color-text-tertiary)" : "var(--color-text-primary)",
//         fontWeight: active ? 600 : 400, opacity: disabled ? 0.5 : 1,
//     };
// }
//
// function paginationRange(current, total) {
//     if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
//     if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
//     if (current >= total - 3) return [1, "…", total-4, total-3, total-2, total-1, total];
//     return [1, "…", current-1, current, current+1, "…", total];
// }

// DictionaryPage.jsx
// Données : importe wordsData.js (à placer dans src/data/wordsData.js)
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { WORDS } from '../../data/wordsData';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const POS_LABELS = {
    n: 'nom', v: 'verbe', adj: 'adjectif', adv: 'adverbe',
    prep: 'prép.', conj: 'conj.', pron: 'pron.', det: 'dét.',
    num: 'num.', interj: 'interj.',
};

const LEVEL_STYLE = {
    A1: { bg: '#dcfce7', text: '#166534', border: '#86efac' },
    A2: { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
    B1: { bg: '#ffedd5', text: '#9a3412', border: '#fdba74' },
    B2: { bg: '#fce7f3', text: '#9d174d', border: '#f9a8d4' },
    C1: { bg: '#ede9fe', text: '#4c1d95', border: '#c4b5fd' },
    C2: { bg: '#e0f2fe', text: '#0c4a6e', border: '#7dd3fc' },
};

const PER_PAGE = 80;

function speak(word) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(word);
    utt.lang = 'en-US';
    window.speechSynthesis.speak(utt);
}

// ─── Word row ─────────────────────────────────────────────────────────────────

function WordRow({ word }) {
    const [en, fr, pos, level] = word;
    const ls = LEVEL_STYLE[level] || LEVEL_STYLE.A1;
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 64px 44px 32px',
                alignItems: 'center',
                gap: 12,
                padding: '7px 12px',
                borderBottom: '0.5px solid var(--color-border-tertiary)',
                transition: 'background 0.1s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-background-secondary)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
            <span style={{ fontWeight: 500, fontSize: 14, color: 'var(--color-text-primary)' }}>{en}</span>
            <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{fr}</span>
            <span style={{
                fontSize: 10, padding: '2px 6px', borderRadius: 4, textAlign: 'center',
                background: 'var(--color-background-secondary)', color: 'var(--color-text-tertiary)',
            }}>
        {POS_LABELS[pos] || pos}
      </span>
            <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, textAlign: 'center',
                background: ls.bg, color: ls.text, border: `1px solid ${ls.border}`,
            }}>
        {level}
      </span>
            <button
                onClick={() => speak(en)}
                title={`Écouter "${en}"`}
                style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                    borderRadius: 4, fontSize: 12, color: 'var(--color-text-tertiary)',
                    transition: 'color 0.1s', lineHeight: 1,
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-tertiary)'}
            >▶</button>
        </div>
    );
}

// ─── Pill filter ──────────────────────────────────────────────────────────────

function Pill({ label, active, onClick, accentColor }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '4px 11px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
                border: active
                    ? `1.5px solid ${accentColor || 'var(--color-border-info)'}`
                    : '0.5px solid var(--color-border-tertiary)',
                background: active
                    ? (accentColor ? accentColor + '1a' : 'var(--color-background-info)')
                    : 'var(--color-background-primary)',
                color: active ? (accentColor || 'var(--color-text-info)') : 'var(--color-text-secondary)',
                fontWeight: active ? 700 : 400,
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
            }}
        >
            {label}
        </button>
    );
}

// ─── Pagination button ────────────────────────────────────────────────────────

function PageBtn({ label, onClick, disabled, active }) {
    return (
        <button
            onClick={onClick} disabled={disabled}
            style={{
                padding: '5px 11px', borderRadius: 6, fontSize: 13,
                cursor: disabled ? 'default' : 'pointer',
                border: '0.5px solid var(--color-border-secondary)',
                background: active ? '#22c55e' : 'var(--color-background-primary)',
                color: active ? 'white' : disabled ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
                fontWeight: active ? 600 : 400, opacity: disabled ? 0.4 : 1,
            }}
        >
            {label}
        </button>
    );
}

function paginationRange(cur, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (cur <= 4)          return [1, 2, 3, 4, 5, '…', total];
    if (cur >= total - 3)  return [1, '…', total-4, total-3, total-2, total-1, total];
    return [1, '…', cur-1, cur, cur+1, '…', total];
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function DictionaryPage() {
    const [search,         setSearch]         = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [filterLevel,    setFilterLevel]    = useState('');
    const [filterPOS,      setFilterPOS]      = useState('');
    const [page,           setPage]           = useState(1);
    const timerRef = useRef(null);

    // Debounce: 160 ms
    const handleSearch = useCallback((val) => {
        setSearch(val);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setDebouncedQuery(val), 160);
    }, []);

    const filtered = useMemo(() => {
        const q = debouncedQuery.toLowerCase().trim();
        return WORDS.filter(w => {
            if (filterLevel && w[3] !== filterLevel) return false;
            if (filterPOS   && w[2] !== filterPOS)   return false;
            if (q && !w[0].toLowerCase().includes(q) && !w[1].toLowerCase().includes(q)) return false;
            return true;
        });
    }, [debouncedQuery, filterLevel, filterPOS]);

    useEffect(() => { setPage(1); }, [debouncedQuery, filterLevel, filterPOS]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const pageWords  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

    const availablePOS = useMemo(() => {
        const s = new Set(WORDS.map(w => w[2]));
        return Object.keys(POS_LABELS).filter(p => s.has(p));
    }, []);

    const hasFilter = search || filterLevel || filterPOS;

    return (
        <div style={{ maxWidth: 860, margin: '0 auto', paddingBottom: '3rem' }}>

            {/* Header */}
            <div style={{ marginBottom: '1.25rem' }}>
                <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    Dictionnaire anglais → français
                </h1>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                    {WORDS.length.toLocaleString()} mots · niveaux A1 à C2 · triés alphabétiquement
                </p>
            </div>

            {/* Recherche */}
            <div style={{ position: 'relative', marginBottom: '0.875rem' }}>
        <span style={{
            position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
            fontSize: 14, color: 'var(--color-text-tertiary)', pointerEvents: 'none',
        }}>🔍</span>
                <input
                    type="text"
                    value={search}
                    onChange={e => handleSearch(e.target.value)}
                    placeholder="Rechercher en anglais ou en français…"
                    style={{
                        width: '100%', padding: '9px 34px 9px 34px', fontSize: 14,
                        boxSizing: 'border-box',
                        border: '0.5px solid var(--color-border-secondary)',
                        borderRadius: 8,
                        background: 'var(--color-background-primary)',
                        color: 'var(--color-text-primary)',
                        outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-border-primary)'}
                    onBlur={e  => e.target.style.borderColor = 'var(--color-border-secondary)'}
                />
                {search && (
                    <button
                        onClick={() => handleSearch('')}
                        style={{
                            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: 15, color: 'var(--color-text-tertiary)', padding: 2,
                        }}
                    >✕</button>
                )}
            </div>

            {/* Filtre niveau */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '0.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-tertiary)', letterSpacing: '0.08em' }}>
          NIVEAU
        </span>
                <Pill label="Tous" active={!filterLevel} onClick={() => setFilterLevel('')} />
                {LEVELS.map(l => (
                    <Pill
                        key={l} label={l}
                        active={filterLevel === l}
                        onClick={() => setFilterLevel(filterLevel === l ? '' : l)}
                        accentColor={LEVEL_STYLE[l].text}
                    />
                ))}
            </div>

            {/* Filtre classe */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'center' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-tertiary)', letterSpacing: '0.08em' }}>
          CLASSE
        </span>
                <Pill label="Toutes" active={!filterPOS} onClick={() => setFilterPOS('')} />
                {availablePOS.map(p => (
                    <Pill
                        key={p} label={POS_LABELS[p]}
                        active={filterPOS === p}
                        onClick={() => setFilterPOS(filterPOS === p ? '' : p)}
                    />
                ))}
            </div>

            {/* Meta + reset */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
          {filtered.length.toLocaleString()} résultat{filtered.length > 1 ? 's' : ''}
            {totalPages > 1 && ` · page ${page} / ${totalPages}`}
        </span>
                {hasFilter && (
                    <button
                        onClick={() => { handleSearch(''); setFilterLevel(''); setFilterPOS(''); }}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer', fontSize: 12,
                            color: 'var(--color-text-tertiary)', padding: '2px 6px',
                            textDecoration: 'underline',
                        }}
                    >
                        Effacer les filtres
                    </button>
                )}
            </div>

            {/* Tableau */}
            {filtered.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '3rem', fontSize: 14,
                    color: 'var(--color-text-secondary)',
                    border: '0.5px solid var(--color-border-tertiary)',
                    borderRadius: 8,
                }}>
                    Aucun résultat.
                </div>
            ) : (
                <div style={{
                    border: '0.5px solid var(--color-border-tertiary)',
                    borderRadius: 8, overflow: 'hidden',
                }}>
                    {/* Entête */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 64px 44px 32px',
                        gap: 12, padding: '8px 12px',
                        background: 'var(--color-background-secondary)',
                        borderBottom: '1px solid var(--color-border-secondary)',
                    }}>
                        {['Anglais', 'Français', 'Classe', 'Niveau', ''].map((h, i) => (
                            <span key={i} style={{
                                fontSize: 10, fontWeight: 700, color: 'var(--color-text-tertiary)',
                                textTransform: 'uppercase', letterSpacing: '0.07em',
                            }}>{h}</span>
                        ))}
                    </div>

                    {pageWords.map((w, i) => <WordRow key={`${w[0]}-${i}`} word={w} />)}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: '1.25rem', flexWrap: 'wrap' }}>
                    <PageBtn label="«" onClick={() => setPage(1)}           disabled={page === 1} />
                    <PageBtn label="‹" onClick={() => setPage(p => p - 1)} disabled={page === 1} />
                    {paginationRange(page, totalPages).map((p, i) =>
                        p === '…'
                            ? <span key={`d${i}`} style={{ fontSize:13, color:'var(--color-text-tertiary)', alignSelf:'center', padding:'0 2px' }}>…</span>
                            : <PageBtn key={p} label={String(p)} onClick={() => setPage(p)} active={page === p} />
                    )}
                    <PageBtn label="›" onClick={() => setPage(p => p + 1)} disabled={page === totalPages} />
                    <PageBtn label="»" onClick={() => setPage(totalPages)} disabled={page === totalPages} />
                </div>
            )}
        </div>
    );
}