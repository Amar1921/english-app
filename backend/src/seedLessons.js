import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const lessons = [

  // ════════════════════════════════════════════════════════════
  // BLOC 1 — LES BASES DU NOM ET DU GROUPE NOMINAL
  // ════════════════════════════════════════════════════════════

  {
    slug: 'nouns-countable-uncountable',
    title: 'Les noms : dénombrables et indénombrables',
    description: 'Comprendre la distinction fondamentale qui régit les articles, les quantificateurs et la conjugaison.',
    level: 'A1', subject: 'GRAMMAR', order: 1,
    content: [
      { type: 'rule', text: '🇫🇷 POURQUOI C\'EST FONDAMENTAL\nEn français, presque tous les noms peuvent être précédés de "un/une" ou d\'un nombre. En anglais, cette logique ne s\'applique pas. Les noms sont divisés en deux catégories irréductibles qui déterminent tout le reste : quel article utiliser, quel quantificateur, si le verbe est au singulier ou pluriel.' },
      { type: 'rule', text: '📌 NOMS DÉNOMBRABLES (Countable nouns)\nCe sont des entités qu\'on peut compter individuellement : a book / two books, a car / three cars, an idea / many ideas.\n→ Ils ont un singulier ET un pluriel.\n→ On peut dire "a/an" devant eux au singulier.\n→ On peut les compter : one cat, two cats, three cats.' },
      { type: 'rule', text: '📌 NOMS INDÉNOMBRABLES (Uncountable nouns)\nCe sont des substances, concepts ou masses qu\'on ne peut pas diviser en unités comptables : water, information, advice, furniture, knowledge, music, happiness.\n→ Ils n\'ont PAS de pluriel (*informations, *furnitures → FAUX).\n→ On ne peut pas dire "a/an" devant eux (*an advice → FAUX).\n→ Le verbe est TOUJOURS au singulier : "The information IS correct."' },
      { type: 'example', text: 'DÉNOMBRABLES ✓\n"Can I ask you a question?" (une question)\n"She gave me two pieces of advice." (pas *two advices)\n"I need a chair." (une chaise = objet comptable)\n\nINDÉNOMBRABLES ✓\n"Do you have any money?" (pas *a money)\n"The news is shocking." (pas *The news are)\n"I need some furniture." (pas *a furniture)' },
      { type: 'tip', text: '💡 ASTUCES POUR LES INDÉNOMBRABLES\nPour quantifier un indénombrable, on utilise une "unité de mesure" :\n• a piece of advice / information / furniture / news\n• a cup of coffee / tea\n• a glass of water / wine\n• a loaf of bread\n• a slice of cake\n\nCes constructions permettent de rendre comptable ce qui ne l\'est pas : "two pieces of furniture" (et non *two furnitures).' },
      { type: 'warning', text: '⚠️ PIÈGES FRÉQUENTS POUR LES FRANCOPHONES\n\n"advice" est TOUJOURS indénombrable → "some advice" (pas *an advice, pas *advices)\n"information" → "some information" (pas *an information, pas *informations)\n"progress" → "good progress" (pas *a progress, pas *progresses)\n"news" → "the news IS" (pas *the news are)\n"luggage / baggage" → "my luggage" (pas *a luggage)\n"hair" → "her hair IS beautiful" (pas *her hairs are)\n\nNote : certains noms peuvent être les deux selon le sens :\n"Glass" (verre, matière = indénombrable) vs "a glass" (un verre = dénombrable)\n"Experience" (expérience en général = indénombrable) vs "an experience" (une expérience vécue = dénombrable)' },
    ],
  },

  {
    slug: 'articles-complete',
    title: 'Les articles : a, an, the, zéro article',
    description: 'Maîtriser les quatre cas d\'utilisation des articles — le point le plus difficile de la grammaire anglaise pour les francophones.',
    level: 'A2', subject: 'GRAMMAR', order: 2,
    content: [
      { type: 'rule', text: '🇫🇷 POURQUOI C\'EST SI DIFFICILE POUR UN FRANCOPHONE\nEn français, on met presque toujours un article. En anglais, il existe un quatrième cas : l\'absence totale d\'article (le "zéro article"). Cette omission est systématique et répond à des règles précises. La maîtriser est essentielle pour ne pas sonner "étranger".' },
      { type: 'rule', text: '📌 A / AN — L\'article indéfini\nUtilisé avec un nom dénombrable singulier mentionné pour la première fois ou appartenant à une catégorie.\n\n• "a" devant un son consonantique : a book, a university (le "u" se prononce "you"), a European country\n• "an" devant un son vocalique : an apple, an hour (le "h" est muet), an honest man, an MBA\n\n→ C\'est le SON qui compte, pas la lettre écrite !\n"a union" (son "you") mais "an uncle" (son "an")' },
      { type: 'rule', text: '📌 THE — L\'article défini\nUtilisé quand locuteur et auditeur savent tous deux de quoi on parle.\n\nCinq cas principaux :\n1. Déjà mentionné : "I saw a dog. The dog was barking."\n2. Unique en son genre : the sun, the moon, the Internet, the government\n3. Superlatif : the best, the most beautiful\n4. Ordinal en position unique : the first person, the last train\n5. Groupes nationaux : the French, the British, the elderly, the poor' },
      { type: 'rule', text: '📌 ZÉRO ARTICLE (∅) — Le cas le plus trompeur\nPas d\'article dans ces situations :\n\n1. Noms indénombrables en général : ∅ Water is essential. ∅ Music makes me happy.\n2. Noms pluriels en général : ∅ Dogs are loyal. ∅ Books are expensive.\n3. Noms propres : ∅ France, ∅ London, ∅ Shakespeare (MAIS : the United States, the Amazon)\n4. Langues : ∅ I speak French. (jamais "the French")\n5. Repas : ∅ I had ∅ breakfast. ∅ Dinner is at 8.\n6. Matières / disciplines : ∅ She studies ∅ mathematics.\n7. Transports : ∅ by ∅ car, ∅ by ∅ train, ∅ on ∅ foot\n8. Institutions (dans leur usage fonctionnel) : ∅ in ∅ hospital (patient), ∅ at ∅ school (élève)' },
      { type: 'example', text: 'COMPARAISONS ARTICLE vs ZÉRO ARTICLE\n\n"The life I lead is stressful." (cette vie spécifique) ✓\n"∅ Life is short." (la vie en général) ✓\n\n"Can you play the piano?" (l\'instrument spécifique devant toi) ✓\n"She plays ∅ piano." (la pratique en général) ✓\n\n"He\'s in ∅ hospital." (il est hospitalisé) ✓\n"I visited the hospital." (j\'ai visité le bâtiment) ✓\n\n"The French love ∅ wine." (les Français en tant que groupe, vin en général) ✓' },
      { type: 'warning', text: '⚠️ EXCEPTIONS ET PIÈGES\n\n• "the" + adjectif nationalisateur sans nom = groupe entier : the rich (les riches), the blind (les aveugles)\n• Noms géographiques complexes : the United Kingdom, the Sahara Desert, the River Thames MAIS ∅ Lake Geneva, ∅ Mount Everest\n• "school/university/church/prison/hospital/bed" → ∅ quand utilisé pour sa fonction principale, "the" quand on parle du bâtiment physique\n• "the" devant un nom singulier peut représenter toute une espèce : "The whale is an intelligent animal."' },
    ],
  },

  {
    slug: 'plural-irregular',
    title: 'Les pluriels irréguliers et cas particuliers',
    description: 'Pluriels irréguliers, noms toujours pluriels, noms toujours singuliers.',
    level: 'A2', subject: 'GRAMMAR', order: 3,
    content: [
      { type: 'rule', text: '📌 PLURIELS IRRÉGULIERS À CONNAÎTRE\nCes pluriels ne suivent pas la règle du simple +s et doivent être mémorisés :\n\nMutation vocalique (mutation interne) :\nman → men | woman → women | tooth → teeth | foot → feet | goose → geese | mouse → mice | louse → lice\n\nSuffixe -en :\nchild → children | ox → oxen\n\nPluriels latins et grecs (très fréquents en anglais académique) :\ncriterion → criteria | phenomenon → phenomena | datum → data | medium → media | curriculum → curricula | syllabus → syllabi\nanalysis → analyses | basis → bases | thesis → theses | crisis → crises\nfocus → foci | cactus → cacti (ou cactuses)\nformula → formulae (ou formulas)' },
      { type: 'rule', text: '📌 NOMS IDENTIQUES AU SINGULIER ET AU PLURIEL\nCes noms ne changent pas de forme :\nsheep, fish (aussi fishes pour les espèces), deer, moose, aircraft, series, species\n\n"One sheep, two sheep." (pas *sheeps)\n"The series IS good." (singulier) | "Both series ARE good." (pluriel, même forme)' },
      { type: 'rule', text: '📌 NOMS TOUJOURS PLURIELS (pluralia tantum)\nIls n\'ont pas de forme singulière et prennent TOUJOURS un verbe pluriel :\nscissors, trousers, jeans, glasses (lunettes), tweezers, pliers, tongs, shorts\n\n"My trousers ARE too long." (pas *My trousers is)\nPour les compter : "a pair of scissors", "two pairs of jeans"' },
      { type: 'warning', text: '⚠️ "DATA" est officiellement pluriel (datum = singulier) mais s\'emploie de plus en plus au singulier en anglais moderne, surtout dans le domaine informatique. En anglais académique rigoureux : "The data SHOW..." mais "The data SHOWS..." est accepté dans la presse.' },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // BLOC 2 — LES TEMPS ET L'ASPECT
  // ════════════════════════════════════════════════════════════

  {
    slug: 'present-simple-vs-continuous',
    title: 'Présent simple vs présent continu',
    description: 'Comprendre la distinction aspect simple / aspect continu — une logique absente du français.',
    level: 'A1', subject: 'CONJUGATION', order: 4,
    content: [
      { type: 'rule', text: '🇫🇷 UNE DISTINCTION QUE LE FRANÇAIS N\'A PAS\nEn français, "je mange" peut signifier à la fois "I eat" (en général) et "I am eating" (en ce moment). En anglais, ces deux significations sont strictement séparées par des formes différentes. Cette distinction ASPECT SIMPLE / ASPECT CONTINU est l\'une des plus importantes de la grammaire anglaise.' },
      { type: 'rule', text: '📌 PRÉSENT SIMPLE (Simple Present)\nForme : sujet + base verbale (+ -s/-es à la 3ème personne du singulier)\n\nUtilisations :\n1. Habitudes et routines : "I drink coffee every morning."\n2. Vérités générales, faits scientifiques : "Water freezes at 0°C."\n3. Sentiments et états permanents : "She loves classical music."\n4. Programmes et horaires officiels : "The train leaves at 9:15."\n5. Commentaires sportifs, recettes, démonstrations : "He passes to Jones, who shoots..."' },
      { type: 'rule', text: '📌 PRÉSENT CONTINU (Present Continuous)\nForme : sujet + am/is/are + verbe-ING\n\nUtilisations :\n1. Action en cours au moment où on parle : "I am writing an email right now."\n2. Situation temporaire (pas un état permanent) : "She is living in Paris for a few months."\n3. Tendances et changements en cours : "English is becoming a global language."\n4. Arrangement futur déjà planifié : "We are meeting the client tomorrow at 3."\n5. Comportement irritant (avec "always") : "He is always interrupting me!" (nuance de reproche)' },
      { type: 'example', text: 'CONTRASTE DIRECT\n"I work in an office." (ma profession habituelle)\n"I am working from home today." (situation temporaire, ce jour)\n\n"She speaks French." (elle sait parler français)\n"She is speaking French." (elle parle français en ce moment)\n\n"The river flows south." (fait géographique permanent)\n"The river is flooding." (événement en cours maintenant)' },
      { type: 'warning', text: '⚠️ LES "STATE VERBS" — verbes qui NE S\'UTILISENT PAS au continu\nCertains verbes décrivent des ÉTATS (pas des actions) et résistent au continu même quand on parle du présent immédiat :\n\nÉmotion : love, hate, like, prefer, want, wish\nPerception : see, hear, smell, taste, feel (sens passif)\nConnaissance/opinion : know, believe, think (opinion), understand, remember, forget, mean\nPossession : have (possession), own, belong, contain\n\n"I know the answer." ✓ JAMAIS "I am knowing the answer." ✗\n"She wants a coffee." ✓ JAMAIS "She is wanting a coffee." ✗\n\nATTENTION : certains de ces verbes ont deux sens — l\'un statique (pas de continu), l\'autre dynamique (continu possible) :\n"I think it\'s wrong." (opinion → pas de continu)\n"I am thinking about my answer." (processus de réflexion → continu OK)\n"He has a car." (possession → pas de continu)\n"He is having lunch." (activité → continu OK)' },
    ],
  },

  {
    slug: 'past-tenses-all',
    title: 'Les temps du passé : panorama complet',
    description: 'Past simple, past continuous, past perfect et past perfect continuous — logique et contrastes.',
    level: 'B1', subject: 'CONJUGATION', order: 5,
    content: [
      { type: 'rule', text: '🇫🇷 INTRODUCTION : 4 FAÇONS DE PARLER DU PASSÉ\nLà où le français distingue imparfait, passé composé et plus-que-parfait, l\'anglais possède un système à 4 temps qui fonctionne sur deux axes : SIMPLE vs CONTINU, et PASSÉ vs ANTÉRIEUR AU PASSÉ.' },
      { type: 'rule', text: '📌 PAST SIMPLE — Le passé de base\nForme : verbe-ED (réguliers) ou forme irrégulière (go→went, see→saw, take→took...)\n\nUsage : action terminée à un moment précis du passé. La durée n\'importe pas, mais le fait que l\'action soit RÉVOLUE est essentiel.\n\n"She graduated in 2018." (diplômée, c\'est fini)\n"He worked there for 10 years." (il n\'y travaille plus)\n"Did you see the film?" (question sur le passé révolu)\n\nMarqueurs temporels typiques : yesterday, last week/month/year, in 2010, ago, when I was young, at 3pm' },
      { type: 'rule', text: '📌 PAST CONTINUOUS — L\'arrière-plan du passé\nForme : was/were + verbe-ING\n\nUsages :\n1. Action en cours à un moment précis du passé : "At 8pm, I was eating dinner."\n2. Action de fond interrompue par une autre action : "I was reading when the phone rang." (lecture = fond, sonnerie = interruption)\n3. Deux actions parallèles en cours simultanément : "While she was cooking, he was setting the table."\n4. Situation temporaire dans le passé : "In 2015, I was living in London."\n\n⚠️ La même règle des "state verbs" s\'applique : pas de continu avec know, believe, want, etc.' },
      { type: 'rule', text: '📌 PAST PERFECT — L\'antérieur du passé\nForme : had + past participle\n\nUsage : action accomplie AVANT une autre action passée. C\'est l\'équivalent du plus-que-parfait français.\n\n"When I arrived, the film had already started." (le film a commencé AVANT mon arrivée)\n"She had never seen snow before she moved to Canada."\n"He didn\'t recognize her because she had changed so much."\n\n⚠️ Le past perfect est RELATIF : il ne s\'utilise que pour établir une relation temporelle avec un autre événement passé. Si la chronologie est claire grâce au contexte, on peut souvent utiliser le past simple.' },
      { type: 'rule', text: '📌 PAST PERFECT CONTINUOUS — La durée avant le passé\nForme : had been + verbe-ING\n\nUsage : action qui durait depuis un certain temps jusqu\'à un moment précis dans le passé. Met l\'accent sur la DURÉE et le PROCESSUS (pas seulement le résultat).\n\n"She had been waiting for two hours when he finally arrived." (durée de l\'attente)\n"His eyes were red because he had been crying." (processus qui explique un état)\n"They had been dating for three years before they got engaged."' },
      { type: 'example', text: 'MISE EN SITUATION COMPLÈTE\nHistoire : Paul arrive en retard au bureau.\n\n"When Paul arrived at the office at 10am (past simple — arrivée à un moment précis),\nhis colleagues were already working (past continuous — activité en cours à ce moment),\nthe meeting had already started (past perfect — commencé avant son arrivée),\nand the boss had been waiting for him for 30 minutes (past perfect continuous — durée de l\'attente avant son arrivée)."' },
      { type: 'warning', text: '⚠️ PIÈGE : Past Simple vs Present Perfect\nBeaucoup de francophones utilisent le present perfect là où il faut le past simple.\n\nRègle d\'or : si le moment est PRÉCISÉ et RÉVOLU → PAST SIMPLE\nSi le moment est indéfini ou lié au présent → PRESENT PERFECT\n\n"I saw him YESTERDAY." ✓ (pas *I have seen him yesterday)\n"I have seen him RECENTLY." ✓ (pas *I saw him recently — avec recently au sens imprécis)\n"Did you eat?" (simple question sur le passé) ✓\n"Have you ever eaten sushi?" (expérience de vie, sans date précise) ✓' },
    ],
  },

  {
    slug: 'present-perfect-complete',
    title: 'Le Present Perfect : toute la logique',
    description: 'Le temps le plus mal utilisé par les francophones — comprendre sa logique profonde.',
    level: 'A2', subject: 'CONJUGATION', order: 6,
    content: [
      { type: 'rule', text: '🇫🇷 LE PRESENT PERFECT N\'EST PAS LE PASSÉ COMPOSÉ\nC\'est l\'erreur la plus fréquente. Le passé composé français décrit simplement un fait passé. Le present perfect anglais établit un LIEN entre le passé et le présent. C\'est un temps PRÉSENT qui regarde vers le passé.' },
      { type: 'rule', text: '📌 FORME\nAffirmatif : have/has + past participle\nNégatif : have/has not (haven\'t/hasn\'t) + past participle\nInterrogatif : Have/Has + sujet + past participle?\n\n"I have finished." | "She hasn\'t arrived." | "Have you eaten?"' },
      { type: 'rule', text: '📌 LES 4 USAGES FONDAMENTAUX\n\n1. EXPÉRIENCE DE VIE (avec "ever" / "never")\n→ Le moment précis n\'importe pas, seul le fait compte.\n"Have you ever been to Japan?"\n"I\'ve never eaten octopus."\n"She has seen this film three times."\n\n2. RÉSULTAT PRÉSENT D\'UNE ACTION PASSÉE\n→ L\'action est dans le passé, mais ses conséquences sont présentes maintenant.\n"I\'ve lost my keys." (= je ne les ai pas, maintenant)\n"He\'s broken his leg." (= sa jambe est cassée, maintenant)\n"They\'ve cancelled the flight." (= le vol est annulé, pour toi maintenant)\n\n3. PÉRIODE NON ENCORE TERMINÉE\n→ La période qui inclut ce moment est encore ouverte.\n"Have you seen John TODAY?" (today n\'est pas fini)\n"She\'s written three reports THIS WEEK."\n"I haven\'t eaten anything TODAY."\n\n4. DURÉE AVEC "FOR" ET "SINCE"\n→ Action commencée dans le passé et TOUJOURS EN COURS.\n"I have lived here FOR ten years." (j\'y vis encore)\n"She has worked here SINCE 2015." (elle y travaille encore)\n\nAVEC "FOR" = durée | AVEC "SINCE" = point de départ' },
      { type: 'example', text: 'LES MOTS-CLÉS DU PRESENT PERFECT\nEver, never, already (déjà), yet (encore / déjà en Q/N), just (vient de), recently, lately, so far (jusqu\'ici), up to now, before, for, since, still (avec not)\n\n"Have you finished YET?" (pas encore / déjà ?)\n"I\'ve ALREADY sent the email." (j\'ai déjà...)\n"She\'s JUST left." (elle vient de partir)\n"I haven\'t seen him LATELY." (ces derniers temps)' },
      { type: 'warning', text: '⚠️ NEVER avec des marqueurs temporels révolus\n"I saw him yesterday." ✓ (not "I have seen him yesterday")\n"She arrived last week." ✓ (not "She has arrived last week")\n"When DID you arrive?" ✓ (not "When have you arrived?")\n\nDÈS QU\'ON DONNE UN MOMENT PRÉCIS ET RÉVOLU → PAST SIMPLE, jamais present perfect.' },
      { type: 'tip', text: '💡 PRESENT PERFECT CONTINUOUS\nForme : have/has been + verbe-ING\nMet l\'accent sur la DURÉE et le fait que l\'activité est récente ou toujours en cours.\n\n"I\'ve been waiting for an hour." (durée, peut-être encore en attente)\n"She\'s been crying." (indice visible d\'une activité récente)\n"They\'ve been building this bridge for two years." (toujours en cours)\n\nContraste : "I\'ve read 50 pages." (résultat — combien) vs "I\'ve been reading." (activité — processus)' },
    ],
  },

  {
    slug: 'future-all-forms',
    title: 'Le futur : toutes les formes',
    description: 'Will, going to, présent continu, présent simple, futur continu, futur parfait — quand utiliser quoi.',
    level: 'B1', subject: 'CONJUGATION', order: 7,
    content: [
      { type: 'rule', text: '🇫🇷 LE FUTUR N\'EXISTE PAS EN ANGLAIS… EN TANT QUE TEMPS GRAMMATICAL\nL\'anglais n\'a pas de morphème de futur proprement dit (pas de désinence verbale). Il utilise des AUXILIAIRES et des PÉRIPHRASES pour exprimer le futur. Chacune véhicule une nuance spécifique que le français "futur" ne distingue pas.' },
      { type: 'rule', text: '📌 WILL + INFINITIF — La décision spontanée et la prédiction pure\n\nUsage 1 — Décision prise AU MOMENT de parler :\n"The phone is ringing." "I\'ll get it!" (décision instantanée)\n\nUsage 2 — Prédiction basée sur une OPINION ou connaissance générale :\n"I think it will rain tomorrow."\n"She\'ll probably pass her exam."\n\nUsage 3 — Promesses, offres, refus :\n"I\'ll call you tonight, I promise."\n"I\'ll help you with that."\n\nUsage 4 — Vérités futures inévitables :\n"The sun will rise at 6:43 tomorrow."' },
      { type: 'rule', text: '📌 GOING TO + INFINITIF — L\'intention et la prédiction évidente\n\nUsage 1 — Intention déjà décidée AVANT le moment de parler :\n"I\'m going to study medicine." (décision déjà prise)\n"We\'re going to redecorate the kitchen." (plan déjà en tête)\n\nUsage 2 — Prédiction basée sur une ÉVIDENCE PRÉSENTE :\n"Look at those clouds — it\'s going to rain!" (on voit les nuages)\n"He\'s going to fall — he\'s leaning too far!" (on voit la situation)\n\n🔑 RÈGLE CLÉ : Will = dans ma tête | Going to = déjà décidé avant ou évidence visible' },
      { type: 'rule', text: '📌 PRESENT CONTINUOUS — Arrangement futur confirmé\nAction future avec un arrangement social ou organisationnel déjà établi :\n"I\'m meeting John at 3pm tomorrow." (rendez-vous pris)\n"They\'re getting married next June." (prévu et organisé)\n"Are you doing anything tonight?" (est-ce que tu as quelque chose de prévu?)\n\n⚠️ Différence avec going to : going to = intention, present continuous = arrangement concret avec d\'autres personnes impliquées' },
      { type: 'rule', text: '📌 PRESENT SIMPLE — Futur du programme officiel\nHoraires, timetables, événements officiels et immuables :\n"The train leaves at 9:15." (horaire officiel)\n"The film starts at 8pm." (programme)\n"Parliament opens next Monday." (calendrier officiel)\n\n⚠️ Uniquement pour des événements programmés de façon institutionnelle, PAS pour des plans personnels.' },
      { type: 'rule', text: '📌 FUTURE CONTINUOUS (will be + ING) — Action en cours dans le futur\nAction qui sera EN COURS à un moment précis du futur :\n"At 10pm tonight, I\'ll be sleeping." (je serai en train de dormir)\n"This time next week, you\'ll be sitting on a beach!"\n\nÉgalement pour une action future dans le cours naturel des choses (sans décision particulière) :\n"Will you be passing the post office?" (dans le cours de ta route)' },
      { type: 'rule', text: '📌 FUTURE PERFECT (will have + PP) — Achèvement avant un moment futur\nAction qui sera TERMINÉE avant un moment précis dans le futur :\n"By the time you arrive, I will have cooked dinner."\n"She will have graduated by next summer."\n"In two years, they will have been married for 25 years."' },
      { type: 'example', text: 'COMPARAISON DES NUANCES\nSituation : il est 9h, tu vois une bouteille vide sur la table.\n\n"Someone has drunk all the wine." (present perfect — résultat visible maintenant)\n"I\'m going to buy more wine." (going to — décision prise face à l\'évidence)\n"I\'ll drive you to the supermarket if you want." (will — offre spontanée)\n"The supermarket opens at 10." (present simple — programme officiel)' },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // BLOC 3 — LES STRUCTURES VERBALES
  // ════════════════════════════════════════════════════════════

  {
    slug: 'modal-verbs-complete',
    title: 'Les modaux : système complet',
    description: 'Can, could, may, might, must, should, ought to, shall, will, would — toutes les nuances.',
    level: 'B1', subject: 'GRAMMAR', order: 8,
    content: [
      { type: 'rule', text: '🇫🇷 LA LOGIQUE DES MODAUX\nLes modaux anglais fonctionnent DIFFÉREMMENT des verbes français. Ils sont invariables (pas de -s à la 3ème personne), pas de to-infinitif après eux (mais le verbe suivant est à l\'infinitif sans "to"), et chacun couvre plusieurs fonctions qui se chevauchent. Un même modal peut exprimer la permission, la possibilité ou la déduction selon le contexte.' },
      { type: 'rule', text: '📌 CAN / COULD\n\nCAN :\n• Capacité présente : "I can swim." / "Can you speak Mandarin?"\n• Permission informelle : "You can leave early today."\n• Possibilité (sens général) : "Smoking can cause cancer."\n• Demande informelle : "Can you help me?"\n\nCOULD :\n• Capacité passée : "When I was 5, I could already read."\n• Possibilité présente moins certaine que "can" : "It could be true."\n• Permission formelle ou polie : "Could I use your phone?"\n• Demande polie : "Could you repeat that, please?"\n• Conditionnel : "If I had time, I could help."' },
      { type: 'rule', text: '📌 MAY / MIGHT\n\nMAY :\n• Possibilité présente ou future (50% environ) : "It may rain tomorrow."\n• Permission formelle : "May I come in?" (plus formel que "can")\n• Concession formelle : "It may be difficult, but it\'s possible."\n\nMIGHT :\n• Possibilité encore plus incertaine que "may" (30% environ) : "It might work."\n• Suggestion hésitante : "You might want to reconsider."\n• Reproche (avec perfect) : "You might have told me!" (tu aurais pu me le dire)\n\nNuance : "It may rain" (c\'est possible) vs "It might rain" (c\'est possible, mais moins sûr)' },
      { type: 'rule', text: '📌 MUST / HAVE TO / MUSTN\'T / DON\'T HAVE TO\n\nMUST :\n• Obligation forte INTERNE (vient de soi) : "I must call my mother." (je me l\'impose)\n• Déduction logique forte : "You\'ve been working all day — you must be tired."\n\nHAVE TO :\n• Obligation EXTERNE (règle, loi, nécessité imposée) : "I have to wear a uniform at work."\n\n⚠️ CONFUSION FRÉQUENTE :\nMUSTN\'T = INTERDIT : "You mustn\'t park here." (c\'est défendu)\nDON\'T HAVE TO = PAS OBLIGATOIRE : "You don\'t have to come." (c\'est facultatif)\nCes deux formes sont OPPOSÉES, pas synonymes !' },
      { type: 'rule', text: '📌 SHOULD / OUGHT TO / HAD BETTER\n\nSHOULD :\n• Conseil, recommandation : "You should see a doctor."\n• Obligation morale modérée : "I should exercise more."\n• Attente logique : "The package should arrive tomorrow."\n\nOUGHT TO :\n• Même sens que should, légèrement plus formel et moral : "You ought to apologise."\n\nHAD BETTER :\n• Conseil fort, avec implication de conséquences négatives si on ne suit pas : "You\'d better hurry or you\'ll miss the train." (= je te conseille vraiment de...)\n• Plus fort que should, moins qu\'une obligation stricte.' },
      { type: 'rule', text: '📌 MODAUX + HAVE + PAST PARTICIPLE (passé modal)\nCette structure exprime une déduction, un reproche ou un regret sur le passé.\n\n"must have + PP" → déduction sur le passé : "He must have forgotten." (il a dû oublier)\n"can\'t have + PP" → impossibilité dans le passé : "She can\'t have said that." (elle n\'a pas pu dire ça)\n"should have + PP" → reproche ou regret : "You should have told me." (tu aurais dû me le dire)\n"could have + PP" → possibilité non réalisée : "He could have been killed!" (il aurait pu être tué)\n"might have + PP" → possibilité passée incertaine : "They might have missed the bus."' },
      { type: 'warning', text: '⚠️ MODAUX = INVARIABLES\nJamais de -s à la 3ème personne : "She CAN swim." ✓ JAMAIS "She cans swim." ✗\nJamais de "to" après un modal : "I must GO." ✓ JAMAIS "I must to go." ✗\nPas de forme -ing : JAMAIS "I am mighting go." ✗\nPas de participe passé propre. Pour les formes manquantes, on utilise des équivalents :\n"will" → "be going to" (futur)\n"must" (passé) → "had to"\n"can" (futur) → "will be able to"' },
    ],
  },

  {
    slug: 'passive-voice-complete',
    title: 'La voix passive : toutes les formes et usages',
    description: 'Former le passif à tous les temps, comprendre ses usages stylistiques et sémantiques.',
    level: 'B1', subject: 'GRAMMAR', order: 9,
    content: [
      { type: 'rule', text: '🇫🇷 POURQUOI LE PASSIF EST IMPORTANT\nEn anglais formel, académique et journalistique, le passif est beaucoup plus fréquent qu\'en français. Il permet de mettre le focus sur l\'action ou le résultat plutôt que sur l\'agent. Le maîtriser est indispensable pour écrire ou lire des textes C1/C2.' },
      { type: 'rule', text: '📌 FORMATION\nPassif = TO BE (conjugué au temps voulu) + PAST PARTICIPLE\n\nTous les temps au passif :\nPresent simple : is/are + PP — "The report IS written every week."\nPast simple : was/were + PP — "The letter WAS sent yesterday."\nPresent perfect : has/have been + PP — "The decision HAS BEEN made."\nPast perfect : had been + PP — "The bridge HAD BEEN built in 1890."\nFuture simple : will be + PP — "The results WILL BE announced tomorrow."\nPresent continuous : is/are being + PP — "The road IS BEING repaired."\nPast continuous : was/were being + PP — "The suspect WAS BEING followed."\nModal : can/must/should/etc. be + PP — "This MUST BE done immediately."' },
      { type: 'rule', text: '📌 QUAND UTILISER LE PASSIF\n\n1. L\'agent est INCONNU : "My car has been stolen." (on ne sait pas qui)\n2. L\'agent est ÉVIDENT ou sans importance : "He was arrested." (par la police, bien sûr)\n3. L\'agent est INDÉFINI (on, les gens, quelqu\'un) : "It is said that..." / "It is believed that..."\n4. On veut METTRE LE RÉSULTAT en avant : "Three people were killed in the accident." (on s\'intéresse aux victimes, pas à la cause)\n5. Style FORMEL / ACADÉMIQUE : "It has been demonstrated that..." / "The hypothesis was tested."' },
      { type: 'example', text: 'PASSIF AVEC BY — quand mentionner l\'agent\nL\'agent n\'est mentionné que s\'il apporte une INFORMATION NOUVELLE :\n"Hamlet was written BY SHAKESPEARE." (Shakespeare = information importante)\n"The window was broken." (pas de "by someone" → inutile)\n"She was praised by her manager." (manager = information pertinente)\n\nPASSIF CAUSATIF (have something done)\nStructure : have + object + past participle\nSignification : faire faire quelque chose par quelqu\'un d\'autre (service)\n"I had my hair cut yesterday." (= chez le coiffeur)\n"She\'s having her car repaired." (= au garage)\n"We need to have the boiler checked."' },
      { type: 'warning', text: '⚠️ VERBES QUI NE SE METTENT PAS AU PASSIF\nLes verbes intransitifs (sans COD) ne peuvent pas avoir de passif :\narrived, disappeared, occurred, happened, existed, consisted\n"The accident happened." ✓ JAMAIS "The accident was happened." ✗\n\nCERTAINS VERBES STATIVES non plus :\n"She has a car." ✓ → JAMAIS "A car is had by her." ✗' },
    ],
  },

  {
    slug: 'conditionals-complete',
    title: 'Les conditionnels : système complet',
    description: 'Zero, first, second, third et mixed conditionals — logique et nuances.',
    level: 'B1', subject: 'GRAMMAR', order: 10,
    content: [
      { type: 'rule', text: '🇫🇷 LA LOGIQUE DES CONDITIONNELS\nL\'anglais organise les conditionnels en QUATRE TYPES selon deux paramètres : (1) la PROBABILITÉ de la condition (réelle ou hypothétique) et (2) le TEMPS (présent/futur ou passé). Cette organisation est plus rigide qu\'en français et doit être respectée pour être compris correctement.' },
      { type: 'rule', text: '📌 ZERO CONDITIONAL — La vérité générale\nStructure : If + present simple, present simple\nSignification : vérité scientifique, fait général, loi de cause à effet. "If" = "whenever" (chaque fois que).\n\n"If you heat water to 100°C, it boils."\n"If it rains, the streets get wet."\n"If you mix red and blue, you get purple."\n\n→ "When" peut remplacer "if" sans changement de sens.' },
      { type: 'rule', text: '📌 FIRST CONDITIONAL — Le futur probable\nStructure : If + present simple, will + infinitif\nSignification : situation réelle ou très possible dans le futur.\n\n"If it rains tomorrow, I will cancel the picnic." (c\'est possible)\n"If you work hard, you\'ll succeed."\n"What will you do if you miss the train?"\n\n⚠️ Ne JAMAIS utiliser "will" dans la proposition en "if" :\n"If it WILL rain..." ✗ → "If it rains..." ✓' },
      { type: 'rule', text: '📌 SECOND CONDITIONAL — L\'hypothèse présente ou future\nStructure : If + past simple, would + infinitif\nSignification : situation imaginaire, contraire à la réalité présente, ou très improbable dans le futur.\n\n"If I had a million euros, I would buy a yacht." (je n\'en ai pas)\n"If I were you, I would apologise." (je ne suis pas toi)\n"If she studied more, she would pass." (mais elle n\'étudie pas)\n\n⚠️ "WERE" pour tous les sujets dans le style formel : "If I WERE rich..." (et non "If I was" en anglais soutenu)\nMais "was" est accepté en anglais informel.' },
      { type: 'rule', text: '📌 THIRD CONDITIONAL — Le regret ou le contrefactuel passé\nStructure : If + past perfect, would have + past participle\nSignification : situation PASSÉE qui ne s\'est pas réalisée. C\'est le conditionnel passé français.\n\n"If I had studied harder, I would have passed the exam." (mais je n\'ai pas étudié assez)\n"If she had told me the truth, I wouldn\'t have been angry."\n"If the doctor had arrived earlier, he might have survived."\n\n⚠️ CONTRACTION FRÉQUENTE : "If I\'d known, I would\'ve told you."' },
      { type: 'rule', text: '📌 MIXED CONDITIONALS — Mélanges temporels\nQuand la condition et le résultat se situent à des temps DIFFÉRENTS :\n\nType 3 → Type 2 (passé → présent)\n"If + past perfect, would + infinitif"\n"If I had taken that job, I would be in Paris now." (décision passée, conséquence présente)\n\nType 2 → Type 3 (présent → passé)\n"If + past simple, would have + past participle"\n"If she were more ambitious, she would have applied for the promotion." (état présent, conséquence passée)' },
      { type: 'tip', text: '💡 INVERSIONS CONDITIONNELLES FORMELLES (C1/C2)\nDans l\'écriture formelle, on peut inverser le sujet et l\'auxiliaire pour supprimer "if" :\n\n"If I had known" → "Had I known, I would have acted differently."\n"If it should rain" → "Should it rain, the event will be postponed."\n"If I were to leave" → "Were I to leave, who would take my place?"\n\nCes structures marquent un niveau C1/C2 et sont très appréciées dans l\'écriture académique.' },
    ],
  },

  {
    slug: 'reported-speech-complete',
    title: 'Le discours rapporté : système complet',
    description: 'Toutes les transformations du discours direct en indirect, y compris les questions et ordres.',
    level: 'B1', subject: 'GRAMMAR', order: 11,
    content: [
      { type: 'rule', text: '🇫🇷 LE PRINCIPE DE BASE : LA CONCORDANCE DES TEMPS (Backshift)\nQuand on rapporte ce que quelqu\'un a dit, les temps RECULENT D\'UN CRAN dans le passé. C\'est la règle du "backshift". Elle s\'applique systématiquement lorsque le verbe de rapport (said, told, asked...) est au passé.' },
      { type: 'rule', text: '📌 TABLEAU DES TRANSFORMATIONS\n\nPresent simple → Past simple\n"I work here." → She said she worked there.\n\nPresent continuous → Past continuous\n"I am working." → He said he was working.\n\nPast simple → Past perfect\n"I saw him." → She said she had seen him.\n\nPresent perfect → Past perfect\n"I have finished." → He said he had finished.\n\nWill → Would\n"I will call." → She said she would call.\n\nCan → Could\n"I can help." → He said he could help.\n\nMay → Might\n"It may rain." → She said it might rain.\n\nMust → Must ou Had to\n"You must go." → He said I had to go. (obligation) / She said it must be true. (déduction)' },
      { type: 'rule', text: '📌 TRANSFORMATIONS DES EXPRESSIONS DE TEMPS ET DE LIEU\n\nnow → then\ntoday → that day\ntonight → that night\nthis week → that week\nyesterday → the day before / the previous day\nlast week → the week before / the previous week\ntomorrow → the next day / the following day\nnext year → the following year\nhere → there\nthis → that\nthese → those' },
      { type: 'rule', text: '📌 QUESTIONS RAPPORTÉES\n\nQuestions fermées (oui/non) → if / whether\n"Are you ready?" → He asked if/whether I was ready.\n"Did she call?" → He asked if/whether she had called.\n\nQuestions ouvertes (wh-) → même mot interrogatif\n"Where do you live?" → She asked where I lived.\n"What time does the train leave?" → He asked what time the train left.\n\n⚠️ ORDRE DES MOTS : dans la question rapportée, on revient à l\'ordre AFFIRMATIF (sujet + verbe), PAS à l\'ordre interrogatif inversé.\n"Where WAS she going?" (question directe) → He asked where she WAS GOING. ✓\nPAS "He asked where was she going." ✗' },
      { type: 'rule', text: '📌 ORDRES ET DEMANDES RAPPORTÉS\n\nOrdres → told / ordered / commanded + object + to-infinitif\n"Stop talking!" → The teacher told us to stop talking.\n"Don\'t open the window." → She told me not to open the window.\n\nDemandes polies → asked + object + to-infinitif\n"Could you help me?" → She asked me to help her.\n\nSuggestions → suggested + -ing ou + that + past simple\n"Why don\'t we go out?" → He suggested going out. / He suggested that we went out.' },
      { type: 'tip', text: '💡 QUAND NE PAS FAIRE LE BACKSHIFT\nLe backshift est facultatif (mais fortement recommandé) dans deux situations :\n\n1. Si l\'affirmation reste vraie au moment où on parle :\n"She said the Earth is round." (vérité immuable — présent possible)\n\n2. Si on rapporte des paroles très récentes ou si le contexte temporel est clair :\n"She just said she IS coming." (vient de dire, c\'est encore vrai)' },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // BLOC 4 — PROPOSITIONS RELATIVES, SUBORDONNÉES ET STRUCTURES AVANCÉES
  // ════════════════════════════════════════════════════════════

  {
    slug: 'relative-clauses',
    title: 'Les propositions relatives',
    description: 'Définissantes et non-définissantes — who, which, that, whose, where, when.',
    level: 'B2', subject: 'GRAMMAR', order: 12,
    content: [
      { type: 'rule', text: '🇫🇷 DEUX TYPES, DEUX RÔLES\nL\'anglais distingue strictement deux types de relatives selon qu\'elles DÉFINISSENT ou COMMENTENT. Cette distinction a des conséquences sur la ponctuation, le choix du pronom relatif, et le sens global de la phrase.' },
      { type: 'rule', text: '📌 DEFINING RELATIVE CLAUSE (proposition relative restrictive)\nElle RESTREINT et IDENTIFIE le nom qu\'elle modifie. Sans elle, la phrase perd son sens ou devient fausse. PAS de virgules.\n\nPronoms : who (sujet, personnes), whom (objet, personnes, formel), which (choses), that (personnes et choses, moins formel), whose (possession)\n\n"The man WHO lives next door is a doctor." (qui parmi tous les hommes? → celui qui vit à côté)\n"The book THAT/WHICH you recommended was excellent."\n"The student WHOSE essay won the prize received a scholarship."' },
      { type: 'rule', text: '📌 NON-DEFINING RELATIVE CLAUSE (proposition relative appositive)\nElle AJOUTE une information non essentielle sur un nom déjà identifié. Supprimez-la, la phrase principale reste vraie. VIRGULES obligatoires. THAT est impossible ici.\n\n"My brother, WHO lives in London, is a lawyer." (j\'ai un seul frère — information additionnelle)\n"The Eiffel Tower, WHICH was built in 1889, attracts millions of visitors."\n"Professor Smith, WHOSE research changed the field, retired last year."' },
      { type: 'rule', text: '📌 LES PRONOMS RELATIFS EN DÉTAIL\n\nWHO → sujet, personnes : "The woman who called you is here."\nWHOM → objet, personnes, formel : "The candidate whom we interviewed was excellent."\n(En pratique, "who" remplace "whom" dans l\'usage courant)\n\nWHICH → choses (defining ET non-defining) : "The idea which she proposed is brilliant."\nTHAT → personnes et choses, UNIQUEMENT en defining : "The film that I watched was boring."\n\nWHOSE → possession (personnes ET choses) : "A country whose economy is growing rapidly."\nWHERE → lieu : "The city where I was born has changed completely."\nWHEN → temps : "The year when everything changed was 2008."' },
      { type: 'rule', text: '📌 OMISSION DU PRONOM RELATIF\nDans une defining relative clause, on peut OMETTRE le pronom relatif quand il est OBJET (pas sujet) :\n\n"The book (that) you recommended." → pronom objet → omission possible ✓\n"The man WHO lives here." → pronom SUJET → omission IMPOSSIBLE ✗\n\nTest : si on peut inverser sujet et verbe après le pronom → c\'est un objet → omission possible.\n"The film (that) I saw" → I saw the film → objet → omettable ✓\n"The man who called me" → who = sujet de "called" → non omettable ✗' },
      { type: 'warning', text: '⚠️ THAT vs WHICH\n\nDans les DEFINING clauses : "that" ET "which" sont tous deux possibles en anglais britannique standard, mais "that" est préféré en anglais américain.\n\nDans les NON-DEFINING clauses : UNIQUEMENT "which", JAMAIS "that" :\n"My car, WHICH is 10 years old, still runs well." ✓\n"My car, THAT is 10 years old..." ✗' },
    ],
  },

  {
    slug: 'gerund-vs-infinitive',
    title: 'Gérondif vs Infinitif',
    description: 'Quand utiliser -ing et quand utiliser to + infinitif — avec les verbes clés.',
    level: 'B2', subject: 'GRAMMAR', order: 13,
    content: [
      { type: 'rule', text: '🇫🇷 UN DÉFI MAJEUR POUR LES APPRENANTS\nLe gérondif (verb-ING) et l\'infinitif (to + verb) s\'emploient dans des contextes très différents en anglais. Certains verbes n\'acceptent que l\'un, d\'autres que l\'autre, et certains acceptent les deux avec des changements de sens. Aucune règle universelle ne permet de tout déduire — il faut mémoriser les catégories.' },
      { type: 'rule', text: '📌 VERBES SUIVIS DU GÉRONDIF UNIQUEMENT\nCes verbes exigent toujours un gérondif après eux :\n\nadmit, avoid, consider, delay, deny, discuss, enjoy, fancy, finish, imagine, involve, keep, mind, miss, postpone, practise, quit, recommend, risk, suggest\n\n"I enjoy SWIMMING." ✓ (pas *I enjoy to swim)\n"She denied TAKING the money."\n"Have you considered MOVING abroad?"\n"I suggest LEAVING early."\n"Would you mind CLOSING the window?"' },
      { type: 'rule', text: '📌 VERBES SUIVIS DE L\'INFINITIF (to + verb) UNIQUEMENT\nagree, appear, arrange, attempt, decide, expect, fail, hope, learn, manage, offer, plan, prepare, pretend, promise, refuse, seem, tend, want, wish, would like\n\n"She decided TO LEAVE."\n"He managed TO PASS the exam."\n"They refused TO SIGN the contract."\n"I would like TO SPEAK to the manager."' },
      { type: 'rule', text: '📌 VERBES ACCEPTANT LES DEUX SANS CHANGEMENT DE SENS\nbegin, start, continue, intend, prefer, propose, attempt, bother, hate, like, love\n\n"She started CRYING." = "She started TO CRY."\n"I like SWIMMING." = "I like TO SWIM." (préférence générale)\n\n⚠️ Légère nuance avec like/love/hate/prefer :\n"I like swimming." (habitude, en général)\n"I would like to swim." (désir spécifique maintenant)\nAVEC WOULD → TOUJOURS infinitif : "I\'d like to go." (pas *I\'d like going)' },
      { type: 'rule', text: '📌 VERBES ACCEPTANT LES DEUX AVEC CHANGEMENT DE SENS\n\nREMEMBER :\n"I remember LOCKING the door." (gérondif = souvenir d\'une action passée)\n"Remember TO LOCK the door." (infinitif = ne pas oublier de faire l\'action)\n\nFORGET :\n"I\'ll never forget MEETING her for the first time." (gérondif = souvenir)\n"Don\'t forget TO CALL him." (infinitif = obligation future)\n\nSTOP :\n"He stopped SMOKING." (gérondif = il a arrêté l\'habitude)\n"He stopped TO SMOKE." (infinitif = il s\'est arrêté pour fumer)\n\nTRY :\n"Try TAKING an aspirin." (gérondif = essaie cette solution)\n"Try TO SOLVE the problem." (infinitif = fais l\'effort de)\n\nGO ON :\n"She went on TALKING for an hour." (continua à)\n"He went on TO BECOME a famous actor." (passa ensuite à)' },
      { type: 'tip', text: '💡 AUTRES CONSTRUCTIONS AVEC GÉRONDIF\n\nAprès une PRÉPOSITION : toujours gérondif\n"She\'s good AT playing chess."\n"I\'m interested IN learning Japanese."\n"He left without SAYING goodbye."\n"Before LEAVING, check your passport."\n\nAprès "IT\'S NO USE" et "IT\'S NO GOOD" :\n"It\'s no use COMPLAINING." (ça ne sert à rien de)\n"There\'s no point IN WAITING." (inutile d\'attendre)\n\nAprès WORTH :\n"Is it worth VISITING?" (ça vaut la peine de?)' },
    ],
  },

  {
    slug: 'inversion-advanced',
    title: 'L\'inversion : structures formelles avancées',
    description: 'Toutes les constructions avec inversion sujet-auxiliaire pour un style C1/C2.',
    level: 'C1', subject: 'GRAMMAR', order: 14,
    content: [
      { type: 'rule', text: '🇫🇷 QU\'EST-CE QUE L\'INVERSION ET POURQUOI L\'APPRENDRE ?\nL\'inversion consiste à placer l\'auxiliaire AVANT le sujet (comme dans une question, mais dans une proposition déclarative). Elle est déclenchée par certains adverbes ou expressions placés en TÊTE de phrase. C\'est une marque de style formel, littéraire ou rhétorique très appréciée en anglais écrit de niveau C1/C2.' },
      { type: 'rule', text: '📌 INVERSION APRÈS ADVERBES NÉGATIFS OU RESTRICTIFS\nCes adverbes, placés en tête, déclenchent obligatoirement l\'inversion :\n\nNEVER : "Never have I seen such dedication to one\'s work."\nRARELY : "Rarely does she make the same mistake twice."\nSELDOM : "Seldom had such courage been displayed on the field."\nNOWHERE : "Nowhere is the problem more acute than in urban areas."\nNOT ONLY : "Not only did she pass the exam, but she got the highest score."\nNOT UNTIL : "Not until he retired did he realise how much he had achieved."\nONLY AFTER : "Only after the results were published did investors panic."\nONLY WHEN : "Only when you have tried it will you understand."\nHARDLY / BARELY / SCARCELY...WHEN/BEFORE : "Hardly had he sat down when the phone rang."\nNO SOONER...THAN : "No sooner had she arrived than problems began."' },
      { type: 'rule', text: '📌 INVERSION CONDITIONNELLE FORMELLE\nDans les conditionnels formels, on peut supprimer "if" et inverser :\n\n3ème conditionnel : "If I had known" → "HAD I known, I would have acted differently."\n2ème conditionnel : "If I were to leave" → "WERE I to leave, who would replace me?"\n1er conditionnel (formel) : "If you should need help" → "SHOULD you need any assistance, please contact reception."\n\nCes formes sont très fréquentes dans les textes juridiques, officiels et académiques.' },
      { type: 'rule', text: '📌 INVERSION APRÈS "SO" ET "SUCH"\n"So + adjectif" en tête de phrase :\n"So difficult was the exam that most students failed." (tellement l\'examen était difficile...)\n"So convincing was her argument that everyone agreed."\n\n"Such + nom" en tête de phrase :\n"Such was his dedication that he worked through the night." (si grande était sa dédicace...)' },
      { type: 'rule', text: '📌 INVERSION APRÈS "NEITHER" ET "NOR"\nPour prolonger une phrase négative :\n"I don\'t speak Russian, and NEITHER DOES she."\n"She hadn\'t eaten, nor had she slept."\n\nAprès "SO" pour prolonger l\'affirmatif :\n"I enjoyed the film, and SO DID my sister."' },
      { type: 'example', text: 'STYLE ORDINAIRE → STYLE FORMEL AVEC INVERSION\n\nOrdinaire : "I have never seen such arrogance in my career."\nFormel : "Never in my career have I seen such arrogance."\n\nOrdinaire : "The problem is not only serious here but also worldwide."\nFormel : "Not only is the problem serious here, but it also extends worldwide."\n\nOrdinaire : "He had barely fallen asleep when the alarm went off."\nFormel : "Barely had he fallen asleep when the alarm went off."' },
    ],
  },

  {
    slug: 'subjunctive-complete',
    title: 'Le subjonctif anglais',
    description: 'Le mandatif, le subjonctif passé et leurs usages — niveau C1/C2.',
    level: 'C1', subject: 'GRAMMAR', order: 15,
    content: [
      { type: 'rule', text: '🇫🇷 LE SUBJONCTIF ANGLAIS EST DIFFÉRENT DU FRANÇAIS\nEn français, le subjonctif est très vivant et fréquent. En anglais, il est beaucoup plus discret — presque invisible — mais il existe bel et bien. Il y a deux formes : le MANDATIF (present subjunctive) et le WERE-SUBJUNCTIVE (past subjunctive).' },
      { type: 'rule', text: '📌 LE MANDATIF (Present Subjunctive)\nForme : BASE verbale pour TOUS les sujets (pas de -s à la 3ème personne, pas d\'auxiliaire)\n\nUtilisation après les verbes d\'ordre, suggestion, recommandation, demande + THAT :\nsuggest, recommend, insist, demand, require, request, propose, urge, advise, move (au sens parlamentaire)\n\n"I suggest that he TAKE the exam." (pas *takes)\n"The committee insisted that she BE present." (pas *is)\n"The doctor recommended that he REST for a week." (pas *rests)\n"I demand that this STOP immediately." (pas *stops)\n\nNÉGATIF : "I recommend that you NOT sign the contract." (pas *don\'t sign)' },
      { type: 'rule', text: '📌 LE WERE-SUBJUNCTIVE (Past Subjunctive)\nForme : WERE pour tous les sujets (à la place de was)\n\nUtilisation dans les situations hypothétiques ou contraires à la réalité :\n\nAprès WISH :\n"I wish I WERE taller." (je ne le suis pas)\n"She wishes she WERE somewhere else."\n\nAprès IF (2ème conditionnel) :\n"If I WERE you, I would apologise."\n"If he WERE here, he would know what to do."\n\nAprès AS IF / AS THOUGH :\n"She talks as if she WERE an expert."\n"He acts as though he WERE the boss."\n\nAprès IT\'S TIME :\n"It\'s time you WERE in bed." (il est temps que tu sois au lit)\n"It\'s high time the government TOOK action."' },
      { type: 'rule', text: '📌 ALTERNATIVES BRITANNIQUES AU MANDATIF\nEn anglais britannique, on utilise souvent "should + infinitif" à la place du mandatif :\n\n"I suggest that he SHOULD TAKE the exam." (britannique)\n"I suggest that he TAKE the exam." (américain / plus formel)\n\nLes deux sont corrects. Le mandatif pur est plus courant en anglais américain et dans l\'écriture formelle britannique. "Should" est plus courant dans le registre britannique courant.' },
      { type: 'warning', text: '⚠️ "WAS" VS "WERE" EN PRATIQUE\nEn anglais parlé courant et informel, "was" est fréquent même là où le subjonctif exigerait "were" :\n\nInformel : "If I was you..." / "I wish I was taller."\nFormel / littéraire : "If I were you..." / "I wish I were taller."\n\nDans un contexte C1/C2 (exam, écriture académique, discours formel) → toujours WERE.\nDans la conversation quotidienne → "was" est acceptable et très courant.' },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // BLOC 5 — ORTHOGRAPHE ET VOCABULAIRE AVANCÉ
  // ════════════════════════════════════════════════════════════

  {
    slug: 'spelling-system',
    title: 'Le système orthographique anglais',
    description: 'Logique de la double consonne, règles majeures, suffixes — tout ce qu\'il faut savoir.',
    level: 'B1', subject: 'SPELLING', order: 16,
    content: [
      { type: 'rule', text: '🇫🇷 INTRODUCTION : L\'ORTHOGRAPHE ANGLAISE A UNE LOGIQUE\nContrairement à la réputation d\'anarchie qu\'elle a, l\'orthographe anglaise obéit à des règles — elles ont juste beaucoup d\'exceptions. Comprendre les PRINCIPES sous-jacents permet de mémoriser plus vite et de moins faire d\'erreurs.' },
      { type: 'rule', text: '📌 RÈGLE 1 : DOUBLEMENT DE LA CONSONNE FINALE\nOn double la consonne finale d\'un verbe avant un suffixe (-ing, -ed, -er, -est) quand les trois conditions suivantes sont réunies :\n1. Le mot se termine par consonne-voyelle-consonne (CVC)\n2. La syllabe finale est ACCENTUÉE\n3. Le suffixe commence par une voyelle\n\nEXEMPLES :\n"run" (CVC, une syllabe = accent final) → running, runner ✓\n"stop" (CVC, accent final) → stopping, stopped ✓\n"begin" (gin = accent final, CVC) → beginning ✓\n"open" (accent sur FIRST syllabe, pas la finale) → opening ✗ (pas de doublement)\n"visit" (accent sur VIS, pas IT) → visiting ✗\n\nEXCEPTION BRITANNIQUE : "l" final est doublé même sans accent final :\n"travel" → travelling (UK) vs traveling (US)\n"cancel" → cancelled (UK) vs canceled (US)' },
      { type: 'rule', text: '📌 RÈGLE 2 : LE E FINAL MUET\nQuand un mot se termine par un -e muet :\n→ On le SUPPRIME avant un suffixe commençant par une voyelle :\n"make" → making (pas *makeing) | "love" → loving | "arrive" → arriving\n\n→ On le GARDE avant un suffixe commençant par une consonne :\n"love" → lovely | "safe" → safely | "entire" → entirely\n\nEXCEPTIONS NOTABLES :\n"argue" → argument (pas *arguement)\n"true" → truly (pas *truely)\n"judge" → judgement (UK) / judgment (US)' },
      { type: 'rule', text: '📌 RÈGLE 3 : I AVANT E\n"I before E, except after C, when the sound is /iː/"\n\nI avant E : believe, field, piece, thief, achieve, relief, grief\nE avant I (après C) : receive, ceiling, deceive, conceive, perceive\n\nExceptions mémorables (le "ei" ne se prononce pas /iː/) :\nweird, seize, either, neither, leisure, their, heir, height, weight, eight, vein, reign\n\nASTUCE : apprendre la règle pour le son /iː/ uniquement et mémoriser les exceptions.' },
      { type: 'rule', text: '📌 LES 30 MOTS LES PLUS SOUVENT MAL ÉPELÉS\n\naccommodate (2c, 2m) | occurrence (2c, 2r) | embarrass (2r, 2s)\nnecessary (1c, 2s — "1 Collar, 2 Socks") | separate (pas *seperate)\ndefinitely (pas *definately) | argument (pas *arguement)\nacknowledge | conscientious | entrepreneur\nperseverance | questionnaire | surveillance\nlieutenant | parliament (pas *parliment)\nsupersede (le seul mot en -sede) | proceed, exceed, succeed (en -ceed)\nprecede, recede, concede (tous les autres en -cede)\ncommittee (2m, 2t, 2e) | millennium (2l, 2n)\nliaise / liaison | rhythm (pas de e) | privilege (pas *priviledge)\nexhilarate (pas *exilerate) | harass (1r, 2s) | desiccate (1s, 2c)\ninadvertent | supersede | conscientious | desiccate' },
      { type: 'tip', text: '💡 ANGLAIS AMÉRICAIN VS BRITANNIQUE : DIFFÉRENCES D\'ORTHOGRAPHE\n\n-our (UK) vs -or (US) : colour/color, honour/honor, favour/favor\n-ise (UK) vs -ize (US) : realise/realize, organise/organize\n(NB : -ize est aussi accepté en UK selon Oxford)\n-re (UK) vs -er (US) : centre/center, theatre/theater\n-ce (UK) vs -se (US) : defence/defense, licence/license (nom)\n-ll (UK) vs -l (US) : travelling/traveling, skilful/skillful\n-ae- (UK) vs -e- (US) : encyclopaedia/encyclopedia, mediaeval/medieval\n\nAux examens (IELTS, Cambridge) : choisir UNE variante et s\'y tenir.' },
    ],
  },

  {
    slug: 'collocations-advanced',
    title: 'Les collocations : clé de la fluidité naturelle',
    description: 'Comprendre la logique des collocations et maîtriser les plus essentielles pour paraître natif.',
    level: 'B2', subject: 'VOCABULARY', order: 17,
    content: [
      { type: 'rule', text: '🇫🇷 QU\'EST-CE QU\'UNE COLLOCATION ?\nUne collocation est une association "habituelle" entre deux mots ou plus. Ce n\'est pas une règle grammaticale mais une convention d\'usage. Dire "strong tea" et "heavy rain" (et non *heavy tea ni *strong rain) n\'a aucune logique — c\'est juste comme ça que les anglophones parlent. La maîtrise des collocations EST ce qui distingue un bon utilisateur d\'un utilisateur excellent.' },
      { type: 'rule', text: '📌 MAKE vs DO — La confusion la plus fréquente\n\nMAKE (créer, produire, générer) :\nmake a decision, make a mistake, make an effort, make progress, make money, make a speech, make friends, make a complaint, make an appointment, make a reservation, make a suggestion, make a difference, make an exception, make love, make a point\n\nDO (effectuer une activité, une tâche) :\ndo homework, do business, do damage, do harm, do good, do your best, do a favour, do research, do an exercise, do the cleaning, do the shopping, do someone a service\n\n⚠️ SANS RÈGLE LOGIQUE : il faut mémoriser chaque combinaison.' },
      { type: 'rule', text: '📌 ADJECTIFS + NOMS : LES PIÈGES\nCes combinaisons surprennent souvent les francophones :\n\nheavy rain/traffic/smoker/drinker/fine (amende lourde)\nstrong wind/coffee/accent/argument/evidence/smell\nhigh price/speed/temperature/risk/standard/quality\nbig difference/mistake/news/deal/surprise\nbroad daylight/smile/shoulders/hint/range\ndeep sleep/concern/trouble/understanding\nsharp pain/contrast/increase/decline/mind\nbitter cold/disappointment/argument/experience\npoor quality/health/performance/judgment\nrich history/culture/flavour/variety' },
      { type: 'rule', text: '📌 VERB + PREPOSITION COLLOCATIONS\nCes verbes exigent une préposition spécifique :\n\naccuse someone OF | agree WITH someone / ON something | apologise FOR | apply FOR | approve OF | arrive AT (petit endroit) / IN (grande ville) | believe IN | benefit FROM | blame someone FOR | care FOR/ABOUT | comment ON | complain ABOUT | concentrate ON | consist OF | deal WITH | depend ON | disagree WITH | divide INTO | dream ABOUT/OF | escape FROM | excel AT | focus ON | insist ON | interfere WITH | invest IN | laugh AT | look AFTER | object TO | participate IN | prepare FOR | refer TO | rely ON | result IN | specialise IN | succeed IN | suffer FROM | thank someone FOR | worry ABOUT' },
      { type: 'tip', text: '💡 COMMENT APPRENDRE LES COLLOCATIONS\n1. Toujours noter les mots en contexte, jamais isolément.\n2. Utiliser un dictionnaire de collocations (Oxford Collocations Dictionary).\n3. Repérer les collocations dans les textes authentiques (journaux, livres).\n4. Créer des phrases personnelles avec chaque nouvelle collocation.\n5. Grouper par "mot pivot" (ex : tous les verbes qui vont avec "mistake" : make, admit, correct, repeat, avoid).' },
    ],
  },

  {
    slug: 'register-formal-informal',
    title: 'Registres : formel, neutre, informel',
    description: 'Adapter son langage au contexte — différences lexicales et grammaticales entre les registres.',
    level: 'C1', subject: 'VOCABULARY', order: 18,
    content: [
      { type: 'rule', text: '🇫🇷 LE REGISTRE : UNE COMPÉTENCE C1/C2 FONDAMENTALE\nEn anglais comme en français, la même idée peut s\'exprimer très différemment selon le contexte : une lettre officielle, un email professionnel, un SMS à un ami n\'utilisent pas les mêmes mots ni les mêmes structures. À partir du niveau C1, être capable de naviguer entre ces registres est une compétence évaluée dans tous les examens.' },
      { type: 'rule', text: '📌 VOCABULAIRE FORMEL vs INFORMEL\nLes mots d\'origine latine/française sont généralement plus formels.\nLes mots d\'origine anglo-saxonne (vieux germanique) sont généralement plus informels.\n\nInformel → Formel :\nbegin/start → commence | use → utilise | help → assist | get → obtain/acquire\nbuy → purchase | ask → enquire/request | need → require | tell → inform\ngood → favourable/positive | bad → adverse/unfavourable | big → substantial/considerable\nend → conclude/terminate | happen → occur | show → demonstrate | find out → ascertain\nsend → dispatch | look at → examine | deal with → address | think about → consider' },
      { type: 'rule', text: '📌 STRUCTURES GRAMMATICALES PAR REGISTRE\n\nINFORMEL :\n• Contractions : I\'m, don\'t, can\'t, it\'s\n• Phrasal verbs : put off, bring up, look into\n• Questions directes : "What time does it start?"\n• Phrases incomplètes : "Sounds good." / "No problem."\n• "You" générique : "You never know."\n\nFORMEL :\n• Pas de contractions : I am, do not, cannot, it is\n• Verbes latins plutôt que phrasal verbs : postpone (put off), raise (bring up), investigate (look into)\n• Passif impersonnel : "It has been decided that..." / "It is believed that..."\n• Inversions : "Not only has the situation deteriorated..."\n• Subjonctif mandatif : "It is recommended that students BE present."' },
      { type: 'example', text: 'MÊME MESSAGE, TROIS REGISTRES\n\nINFORMEL (SMS à un ami) :\n"Hey, can\'t make it tomorrow — something came up. Let\'s reschedule? Sorry!"\n\nNEUTRE (email professionnel) :\n"I\'m afraid I won\'t be able to attend tomorrow\'s meeting. Would it be possible to rearrange it? I apologise for any inconvenience."\n\nFORMEL (lettre officielle) :\n"I regret to inform you that I am unable to attend the scheduled meeting on the aforementioned date. I would be grateful if it were possible to arrange an alternative date at your earliest convenience. I apologise unreservedly for any inconvenience this may cause."' },
      { type: 'tip', text: '💡 MARQUEURS DE COHÉSION PAR REGISTRE\n\nInformel : also, but, so, because, and, anyway, like (discourse marker)\n\nFormel-neutre : furthermore, moreover, however, therefore, consequently, in addition, nevertheless, despite this, on the other hand, in contrast, as a result, hence\n\nTrès formel : notwithstanding, hitherto, albeit, inasmuch as, therein lies, pursuant to, hereafter, aforementioned' },
    ],
  },
];

async function seedLessons() {
  console.log('📚 Seeding lessons...');
  await prisma.lesson.deleteMany();
  let count = 0;
  for (const lesson of lessons) {
    await prisma.lesson.create({ data: { ...lesson, content: lesson.content } });
    count++;
  }
  const bySubject = {};
  for (const l of lessons) bySubject[l.subject] = (bySubject[l.subject] || 0) + 1;
  console.log(`\n✅ Seeded ${count} lessons:`);
  for (const [s, n] of Object.entries(bySubject).sort()) console.log(`   ${s}: ${n} lessons`);
}

seedLessons().catch(console.error).finally(() => prisma.$disconnect());
