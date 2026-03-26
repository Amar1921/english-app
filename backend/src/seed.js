import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

const questions = [
  // ── A1 GRAMMAR ──────────────────────────────────────────────
  { type:'QCM', level:'A1', category:'GRAMMAR', question:'She ___ a teacher.', choices:JSON.stringify(['am','is','are','be']), correctAnswer:'is', explanation:'"She" → third person singular → "is".', points:10 },
  { type:'QCM', level:'A1', category:'GRAMMAR', question:'They ___ happy today.', choices:JSON.stringify(['is','am','are','be']), correctAnswer:'are', explanation:'"They" → plural → "are".', points:10 },
  { type:'QCM', level:'A1', category:'GRAMMAR', question:'I ___ from France.', choices:JSON.stringify(['am','is','are','be']), correctAnswer:'am', explanation:'"I" always takes "am".', points:10 },
  { type:'QCM', level:'A1', category:'GRAMMAR', question:'There ___ a cat on the table.', choices:JSON.stringify(['am','is','are','were']), correctAnswer:'is', explanation:'"There is" for singular nouns.', points:10 },
  { type:'QCM', level:'A1', category:'GRAMMAR', question:'There ___ two dogs in the garden.', choices:JSON.stringify(['is','am','are','was']), correctAnswer:'are', explanation:'"There are" for plural nouns.', points:10 },
  { type:'QCM', level:'A1', category:'GRAMMAR', question:'This is ___ apple.', choices:JSON.stringify(['a','an','the','—']), correctAnswer:'an', explanation:'Use "an" before vowel sounds.', points:10 },
  { type:'QCM', level:'A1', category:'GRAMMAR', question:'___ you like pizza?', choices:JSON.stringify(['Do','Does','Is','Are']), correctAnswer:'Do', explanation:'"Do" for I/you/we/they in questions.', points:10 },
  { type:'QCM', level:'A1', category:'GRAMMAR', question:'She ___ not like coffee.', choices:JSON.stringify(['do','does','is','are']), correctAnswer:'does', explanation:'Negative with he/she/it uses "does not".', points:10 },
  { type:'QCM', level:'A1', category:'GRAMMAR', question:'What ___ your name?', choices:JSON.stringify(['am','is','are','do']), correctAnswer:'is', explanation:'"What is your name?" — "name" is singular.', points:10 },
  { type:'QCM', level:'A1', category:'GRAMMAR', question:'He ___ a car.', choices:JSON.stringify(['have','has','had','having']), correctAnswer:'has', explanation:'"He/she/it" takes "has".', points:10 },
  { type:'OPEN', level:'A1', category:'GRAMMAR', question:'Write the plural of "child".', correctAnswer:'children', explanation:'"Child" has an irregular plural: "children".', points:10 },
  { type:'OPEN', level:'A1', category:'GRAMMAR', question:'Write the plural of "cat".', correctAnswer:'cats', explanation:'Regular nouns add -s to form the plural.', points:10 },

  // ── A1 VOCABULARY ───────────────────────────────────────────
  { type:'QCM', level:'A1', category:'VOCABULARY', question:'What is the opposite of "big"?', choices:JSON.stringify(['tall','small','fast','heavy']), correctAnswer:'small', explanation:'"Small" is the antonym of "big".', points:10 },
  { type:'QCM', level:'A1', category:'VOCABULARY', question:'What colour is the sky on a sunny day?', choices:JSON.stringify(['green','red','blue','yellow']), correctAnswer:'blue', explanation:'The sky is blue on a clear day.', points:10 },
  { type:'QCM', level:'A1', category:'VOCABULARY', question:'Which number comes after "nine"?', choices:JSON.stringify(['eight','eleven','ten','twelve']), correctAnswer:'ten', explanation:'9, 10, 11...', points:10 },
  { type:'QCM', level:'A1', category:'VOCABULARY', question:'What do you use to write?', choices:JSON.stringify(['spoon','pen','shoe','key']), correctAnswer:'pen', explanation:'A pen is a writing instrument.', points:10 },
  { type:'QCM', level:'A1', category:'VOCABULARY', question:'Which animal says "meow"?', choices:JSON.stringify(['dog','bird','cat','fish']), correctAnswer:'cat', explanation:'Cats make a "meow" sound.', points:10 },
  { type:'QCM', level:'A1', category:'VOCABULARY', question:'What meal do you eat in the morning?', choices:JSON.stringify(['dinner','lunch','supper','breakfast']), correctAnswer:'breakfast', explanation:'Breakfast is the first meal of the day.', points:10 },
  { type:'QCM', level:'A1', category:'VOCABULARY', question:'Where do you sleep?', choices:JSON.stringify(['kitchen','bathroom','bedroom','office']), correctAnswer:'bedroom', explanation:'A bedroom is where people sleep.', points:10 },
  { type:'QCM', level:'A1', category:'VOCABULARY', question:'What is the opposite of "hot"?', choices:JSON.stringify(['warm','cool','cold','icy']), correctAnswer:'cold', explanation:'"Cold" is the direct opposite of "hot".', points:10 },

  // ── A2 GRAMMAR ──────────────────────────────────────────────
  { type:'QCM', level:'A2', category:'GRAMMAR', question:'I ___ to London last year.', choices:JSON.stringify(['go','goes','went','gone']), correctAnswer:'went', explanation:'"Went" is the simple past of "go".', points:15 },
  { type:'QCM', level:'A2', category:'GRAMMAR', question:'She has ___ to the store.', choices:JSON.stringify(['go','goes','went','gone']), correctAnswer:'gone', explanation:'Present perfect with "has" needs the past participle.', points:15 },
  { type:'QCM', level:'A2', category:'GRAMMAR', question:'We ___ TV every evening.', choices:JSON.stringify(['watch','watches','watched','watching']), correctAnswer:'watch', explanation:'"We" takes the base form in simple present.', points:15 },
  { type:'QCM', level:'A2', category:'GRAMMAR', question:'He ___ reading a book right now.', choices:JSON.stringify(['is','are','am','be']), correctAnswer:'is', explanation:'Present continuous: he + is + verb-ing.', points:15 },
  { type:'QCM', level:'A2', category:'GRAMMAR', question:'I ___ my keys. I cannot find them.', choices:JSON.stringify(['lose','lost','have lost','loses']), correctAnswer:'have lost', explanation:'Present perfect for recent events with present relevance.', points:15 },
  { type:'QCM', level:'A2', category:'GRAMMAR', question:'They ___ not come to the party last night.', choices:JSON.stringify(['do','did','does','have']), correctAnswer:'did', explanation:'Negative simple past: "did not" + base verb.', points:15 },
  { type:'QCM', level:'A2', category:'GRAMMAR', question:'This is ___ most beautiful city I have ever seen.', choices:JSON.stringify(['a','an','the','—']), correctAnswer:'the', explanation:'Use "the" before superlatives.', points:15 },
  { type:'QCM', level:'A2', category:'GRAMMAR', question:'She is ___ than her sister.', choices:JSON.stringify(['tall','taller','tallest','most tall']), correctAnswer:'taller', explanation:'Comparative of short adjectives: add -er.', points:15 },
  { type:'QCM', level:'A2', category:'GRAMMAR', question:'I will call you ___ I arrive.', choices:JSON.stringify(['while','when','during','for']), correctAnswer:'when', explanation:'"When" introduces a future time clause.', points:15 },
  { type:'QCM', level:'A2', category:'GRAMMAR', question:'How long ___ you been here?', choices:JSON.stringify(['do','did','have','are']), correctAnswer:'have', explanation:'"How long have you been" — present perfect with duration.', points:15 },
  { type:'OPEN', level:'A2', category:'GRAMMAR', question:'Put in the correct form: She (not / like) coffee. Simple present.', correctAnswer:"she doesn't like coffee", explanation:"Negative simple present with she: doesn't + base verb.", points:15 },

  // ── A2 VOCABULARY ───────────────────────────────────────────
  { type:'QCM', level:'A2', category:'VOCABULARY', question:'I need to ___ my teeth every morning.', choices:JSON.stringify(['brush','wash','clean','scratch']), correctAnswer:'brush', explanation:'We "brush" teeth — fixed collocation.', points:15 },
  { type:'QCM', level:'A2', category:'VOCABULARY', question:'"Exhausted" means ___', choices:JSON.stringify(['slightly tired','very hungry','extremely tired','a little ill']), correctAnswer:'extremely tired', explanation:'"Exhausted" means completely worn out.', points:15 },
  { type:'QCM', level:'A2', category:'VOCABULARY', question:'What is a "receipt"?', choices:JSON.stringify(['a shopping list','proof of payment','a bank card','a discount']), correctAnswer:'proof of payment', explanation:'A receipt is the document you get after buying something.', points:15 },
  { type:'QCM', level:'A2', category:'VOCABULARY', question:'Which word means "to move very fast on foot"?', choices:JSON.stringify(['walk','stroll','sprint','wander']), correctAnswer:'sprint', explanation:'To sprint means to run at full speed.', points:15 },
  { type:'QCM', level:'A2', category:'VOCABULARY', question:'"Friendly" describes someone who is ___', choices:JSON.stringify(['angry','kind and pleasant','shy','boring']), correctAnswer:'kind and pleasant', explanation:'"Friendly" = warm and easy to talk to.', points:15 },

  // ── A2 SPELLING ─────────────────────────────────────────────
  { type:'QCM', level:'A2', category:'VOCABULARY', question:'Which spelling is correct?', choices:JSON.stringify(['recieve','receive','receeve','receve']), correctAnswer:'receive', explanation:'"i before e except after c" → re-C-eive.', points:15 },

  // ── B1 GRAMMAR ──────────────────────────────────────────────
  { type:'QCM', level:'B1', category:'GRAMMAR', question:'If I had more time, I ___ learn French.', choices:JSON.stringify(['will','would','should','could']), correctAnswer:'would', explanation:'Second conditional: if + past simple → would + infinitive.', points:20 },
  { type:'QCM', level:'B1', category:'GRAMMAR', question:'She asked me where I ___.', choices:JSON.stringify(['live','lives','lived','am living']), correctAnswer:'lived', explanation:'In reported speech, present tense backshifts to past.', points:20 },
  { type:'QCM', level:'B1', category:'GRAMMAR', question:'The report ___ by the manager yesterday.', choices:JSON.stringify(['wrote','is written','was written','has written']), correctAnswer:'was written', explanation:'Passive past simple: was/were + past participle.', points:20 },
  { type:'QCM', level:'B1', category:'GRAMMAR', question:'She suggested ___ to the cinema.', choices:JSON.stringify(['go','to go','going','gone']), correctAnswer:'going', explanation:'"Suggest" is followed by a gerund (-ing form).', points:20 },
  { type:'QCM', level:'B1', category:'GRAMMAR', question:'Despite ___ hard, he failed the exam.', choices:JSON.stringify(['study','studied','studying','to study']), correctAnswer:'studying', explanation:'"Despite" is followed by a noun or gerund.', points:20 },
  { type:'QCM', level:'B1', category:'GRAMMAR', question:'He ___ be tired — he worked all night.', choices:JSON.stringify(['can','must','should','would']), correctAnswer:'must', explanation:'"Must" expresses logical deduction/certainty.', points:20 },
  { type:'QCM', level:'B1', category:'GRAMMAR', question:'You ___ smoke in the hospital. It is forbidden.', choices:JSON.stringify(["mustn't","don't have to","couldn't","wouldn't"]), correctAnswer:"mustn't", explanation:'"Mustn\'t" expresses prohibition.', points:20 },
  { type:'QCM', level:'B1', category:'GRAMMAR', question:'The man ___ lives next door is a doctor.', choices:JSON.stringify(['which','whose','who','whom']), correctAnswer:'who', explanation:'"Who" is the relative pronoun for people as subject.', points:20 },
  { type:'QCM', level:'B1', category:'GRAMMAR', question:'By the time she arrived, the film ___.', choices:JSON.stringify(['already started','has already started','had already started','already starts']), correctAnswer:'had already started', explanation:'Past perfect for an event before another past event.', points:20 },
  { type:'QCM', level:'B1', category:'GRAMMAR', question:"It's time you ___ a decision.", choices:JSON.stringify(['make','made','making','have made']), correctAnswer:'made', explanation:'"It\'s time + past simple" expresses urgency.', points:20 },
  { type:'QCM', level:'B1', category:'GRAMMAR', question:'When I was young, I ___ play outside every day.', choices:JSON.stringify(['used to','would to','was used to','am used to']), correctAnswer:'used to', explanation:'"Used to" describes past habits that no longer exist.', points:20 },
  { type:'QCM', level:'B1', category:'GRAMMAR', question:'She ___ the letter before her boss arrived.', choices:JSON.stringify(['sends','sent','has sent','had sent']), correctAnswer:'had sent', explanation:'Past perfect: action completed before another past event.', points:20 },
  { type:'QCM', level:'B1', category:'GRAMMAR', question:'They ___ dinner when the phone rang.', choices:JSON.stringify(['had','were having','have had','have']), correctAnswer:'were having', explanation:'Past continuous for an ongoing action interrupted by another.', points:20 },
  { type:'QCM', level:'B1', category:'GRAMMAR', question:'I ___ here for three years by next June.', choices:JSON.stringify(['will live','will be living','will have lived','am living']), correctAnswer:'will have lived', explanation:'Future perfect for an action completed before a future point.', points:20 },
  { type:'OPEN', level:'B1', category:'GRAMMAR', question:'Rewrite in passive voice: "They build houses."', correctAnswer:'houses are built', explanation:'Passive: object + to be + past participle.', points:20 },

  // ── B1 VOCABULARY ───────────────────────────────────────────
  { type:'QCM', level:'B1', category:'VOCABULARY', question:'What does "ambiguous" mean?', choices:JSON.stringify(['very clear','having two meanings','completely wrong','very long']), correctAnswer:'having two meanings', explanation:'"Ambiguous" = open to more than one interpretation.', points:20 },
  { type:'QCM', level:'B1', category:'VOCABULARY', question:'"To procrastinate" means ___', choices:JSON.stringify(['to work hard','to delay doing things','to plan ahead','to rush']), correctAnswer:'to delay doing things', explanation:'Procrastinating = putting off tasks unnecessarily.', points:20 },
  { type:'QCM', level:'B1', category:'VOCABULARY', question:'A "colleague" is ___', choices:JSON.stringify(['a close friend','a family member','someone you work with','a neighbour']), correctAnswer:'someone you work with', explanation:'A colleague is a co-worker.', points:20 },
  { type:'QCM', level:'B1', category:'VOCABULARY', question:'"Persuade" is closest in meaning to ___', choices:JSON.stringify(['force','convince','order','prevent']), correctAnswer:'convince', explanation:'To persuade = to convince through reasoning.', points:20 },
  { type:'QCM', level:'B1', category:'VOCABULARY', question:'What does "inevitable" mean?', choices:JSON.stringify(['surprising','avoidable','certain to happen','very unlikely']), correctAnswer:'certain to happen', explanation:'"Inevitable" = impossible to avoid.', points:20 },
  { type:'QCM', level:'B1', category:'VOCABULARY', question:'The policy had ___ consequences nobody expected.', choices:JSON.stringify(['intentional','deliberate','unintended','planned']), correctAnswer:'unintended', explanation:'"Unintended consequences" is a standard collocation.', points:20 },

  // ── B1 SPELLING ─────────────────────────────────────────────
  { type:'QCM', level:'B1', category:'VOCABULARY', question:'Which spelling is correct?', choices:JSON.stringify(['accomodate','accommodate','acommodate','acomodate']), correctAnswer:'accommodate', explanation:'"Accommodate" has double c and double m.', points:20 },
  { type:'QCM', level:'B1', category:'VOCABULARY', question:'Which spelling is correct?', choices:JSON.stringify(['occured','occurred','ocurred','ocured']), correctAnswer:'occurred', explanation:'"Occurred" doubles the final consonant (stress on last syllable).', points:20 },

  // ── B2 GRAMMAR ──────────────────────────────────────────────
  { type:'QCM', level:'B2', category:'GRAMMAR', question:'He ___ for the company for 10 years when he retired.', choices:JSON.stringify(['worked','has worked','had been working','was working']), correctAnswer:'had been working', explanation:'Past perfect continuous for duration before another past event.', points:25 },
  { type:'QCM', level:'B2', category:'GRAMMAR', question:'I wish I ___ the answer.', choices:JSON.stringify(['know','knew','had known','would know']), correctAnswer:'knew', explanation:'"Wish + past simple" for present unreal wish.', points:25 },
  { type:'QCM', level:'B2', category:'GRAMMAR', question:'Not only ___ he arrive late, but he also forgot the documents.', choices:JSON.stringify(['did','had','was','does']), correctAnswer:'did', explanation:'"Not only" fronted triggers subject-auxiliary inversion.', points:25 },
  { type:'QCM', level:'B2', category:'GRAMMAR', question:'I ___ sooner had we known about the change.', choices:JSON.stringify(['would leave','would have left','will leave','had left']), correctAnswer:'would have left', explanation:'Third conditional: "would have + past participle".', points:25 },
  { type:'QCM', level:'B2', category:'GRAMMAR', question:'The suspect is alleged ___ the building at midnight.', choices:JSON.stringify(['entering','to have entered','to enter','having entered']), correctAnswer:'to have entered', explanation:'"Alleged to have + past participle" for past alleged action.', points:25 },
  { type:'QCM', level:'B2', category:'GRAMMAR', question:'She speaks English as if she ___ a native speaker.', choices:JSON.stringify(['is','was','were','would be']), correctAnswer:'were', explanation:'"As if" with unreal meaning takes the subjunctive "were".', points:25 },
  { type:'QCM', level:'B2', category:'GRAMMAR', question:'Seldom ___ such courage in a young person.', choices:JSON.stringify(['I have seen','have I seen','I saw','did I see']), correctAnswer:'have I seen', explanation:'Inverted structure with negative adverb "seldom".', points:25 },
  { type:'QCM', level:'B2', category:'GRAMMAR', question:'He denied ___ the report.', choices:JSON.stringify(['to have written','writing','to write','that he writes']), correctAnswer:'writing', explanation:'"Deny" is followed by a gerund.', points:25 },
  { type:'QCM', level:'B2', category:'GRAMMAR', question:'The film, ___ was directed by Kubrick, is a classic.', choices:JSON.stringify(['that','which','who','whose']), correctAnswer:'which', explanation:'Non-defining relative clause for things uses "which", not "that".', points:25 },
  { type:'QCM', level:'B2', category:'GRAMMAR', question:'By this time next year, she ___ her degree.', choices:JSON.stringify(['will finish','is finishing','will have finished','finishes']), correctAnswer:'will have finished', explanation:'Future perfect for completion before a future point.', points:25 },
  { type:'QCM', level:'B2', category:'GRAMMAR', question:'It was such ___ speech that the audience was moved to tears.', choices:JSON.stringify(['a moving','moving','the moving','moved']), correctAnswer:'a moving', explanation:'"Such + a/an + adjective + noun" for emphasis.', points:25 },
  { type:'QCM', level:'B2', category:'GRAMMAR', question:'The results ___ be published tomorrow.', choices:JSON.stringify(['are due to','are about','are likely','are supposed']), correctAnswer:'are due to', explanation:'"Due to + infinitive" = scheduled to happen.', points:25 },
  { type:'OPEN', level:'B2', category:'GRAMMAR', question:'Complete: I wish I ___ (know) the answer. (present wish)', correctAnswer:'knew', explanation:'"Wish + past simple" for present unreal situations.', points:25 },

  // ── B2 VOCABULARY ───────────────────────────────────────────
  { type:'QCM', level:'B2', category:'VOCABULARY', question:'The new policy will ___ significant changes.', choices:JSON.stringify(['make','bring about','do','come with']), correctAnswer:'bring about', explanation:'"Bring about" = to cause something to happen.', points:25 },
  { type:'QCM', level:'B2', category:'VOCABULARY', question:'"Meticulous" means ___', choices:JSON.stringify(['careless','very detailed and careful','extremely fast','bold']), correctAnswer:'very detailed and careful', explanation:'A meticulous person pays great attention to detail.', points:25 },
  { type:'QCM', level:'B2', category:'VOCABULARY', question:'To "mitigate" a problem means to ___', choices:JSON.stringify(['ignore it','make it worse','reduce its severity','deny it']), correctAnswer:'reduce its severity', explanation:'"Mitigate" = to make something less serious.', points:25 },
  { type:'QCM', level:'B2', category:'VOCABULARY', question:'His ___ remarks offended everyone in the room.', choices:JSON.stringify(['tactful','diplomatic','candid','disparaging']), correctAnswer:'disparaging', explanation:'"Disparaging" = critical in a disrespectful way.', points:25 },
  { type:'QCM', level:'B2', category:'VOCABULARY', question:'"Eloquent" describes someone who ___', choices:JSON.stringify(['speaks very quietly','speaks very quickly','expresses ideas fluently','speaks many languages']), correctAnswer:'expresses ideas fluently', explanation:'Eloquent = communicates persuasively and clearly.', points:25 },
  { type:'QCM', level:'B2', category:'VOCABULARY', question:'A "contentious" issue is one that ___', choices:JSON.stringify(['everyone agrees on','causes disagreement','is very boring','has been resolved']), correctAnswer:'causes disagreement', explanation:'"Contentious" = likely to cause controversy.', points:25 },
  { type:'QCM', level:'B2', category:'VOCABULARY', question:'"Pragmatic" is closest in meaning to ___', choices:JSON.stringify(['idealistic','theoretical','practical','emotional']), correctAnswer:'practical', explanation:'A pragmatic approach deals with things realistically.', points:25 },

  // ── B2 SPELLING ─────────────────────────────────────────────
  { type:'QCM', level:'B2', category:'VOCABULARY', question:'Which spelling is correct?', choices:JSON.stringify(['consciencious','conscientious','consientious','conscienctious']), correctAnswer:'conscientious', explanation:'"Conscientious" — note the -sci- and -tious ending.', points:25 },
  { type:'QCM', level:'B2', category:'VOCABULARY', question:'Which spelling is correct?', choices:JSON.stringify(['entrepreneur','entrepeneur','entrepreuner','entrepenuer']), correctAnswer:'entrepreneur', explanation:'"Entrepreneur" is of French origin: entre-pre-neur.', points:25 },

  // ── C1 GRAMMAR ──────────────────────────────────────────────
  { type:'QCM', level:'C1', category:'GRAMMAR', question:'___ he known about the risks, he would never have agreed.', choices:JSON.stringify(['If','Had','Should','Were']), correctAnswer:'Had', explanation:'Inverted third conditional: "Had + subject + past participle".', points:30 },
  { type:'QCM', level:'C1', category:'GRAMMAR', question:'She is reported ___ the country secretly.', choices:JSON.stringify(['leaving','to leave','to have left','having left']), correctAnswer:'to have left', explanation:'"Reported to have + past participle" for past reported action.', points:30 },
  { type:'QCM', level:'C1', category:'GRAMMAR', question:'Little ___ that his life was about to change forever.', choices:JSON.stringify(['he knew','did he know','he did know','had he known']), correctAnswer:'did he know', explanation:'"Little" fronted requires subject-auxiliary inversion.', points:30 },
  { type:'QCM', level:'C1', category:'GRAMMAR', question:'___ be any questions, please raise your hand.', choices:JSON.stringify(['Should there','Were there','Had there','If there']), correctAnswer:'Should there', explanation:'Formal conditional inversion with "Should".', points:30 },
  { type:'QCM', level:'C1', category:'GRAMMAR', question:'Only after the meeting ___ the full scale of the problem.', choices:JSON.stringify(['we realised','did we realise','we had realised','have we realised']), correctAnswer:'did we realise', explanation:'"Only after" fronted = inverted structure with auxiliary.', points:30 },
  { type:'QCM', level:'C1', category:'GRAMMAR', question:'She would sooner ___ than accept help.', choices:JSON.stringify(['fail','failing','to fail','have failed']), correctAnswer:'fail', explanation:'"Would sooner" + bare infinitive.', points:30 },
  { type:'QCM', level:'C1', category:'GRAMMAR', question:'The CEO, ___ resignation was unexpected, left last month.', choices:JSON.stringify(['who','whose','which','whom']), correctAnswer:'whose', explanation:'"Whose" is the possessive relative pronoun.', points:30 },
  { type:'QCM', level:'C1', category:'GRAMMAR', question:'No sooner ___ sat down than the alarm went off.', choices:JSON.stringify(['I had','had I','I have','have I']), correctAnswer:'had I', explanation:'"No sooner had + subject" — inversion in past perfect.', points:30 },
  { type:'QCM', level:'C1', category:'GRAMMAR', question:'The findings ___ challenged by subsequent research.', choices:JSON.stringify(['are since','have since been','have since','were since been']), correctAnswer:'have since been', explanation:'Passive present perfect with "since" as adverb.', points:30 },
  { type:'QCM', level:'C1', category:'GRAMMAR', question:'I ___ him to be more careful, but he ignored my advice.', choices:JSON.stringify(['said','told','asked','warned']), correctAnswer:'warned', explanation:'"Warn + object + to-infinitive" = to advise of danger.', points:30 },
  { type:'QCM', level:'C1', category:'GRAMMAR', question:'He is said ___ living abroad for five years.', choices:JSON.stringify(['to be','to have been','having been','being']), correctAnswer:'to have been', explanation:'"Said to have been" = passive reporting of a past state.', points:30 },
  { type:'QCM', level:'C1', category:'GRAMMAR', question:'The proposal, ___ the committee rejected, was later revised.', choices:JSON.stringify(['which','that','what','who']), correctAnswer:'which', explanation:'Non-defining relative clause, object position → "which".', points:30 },
  { type:'OPEN', level:'C1', category:'GRAMMAR', question:'What is the difference between "affect" and "effect"?', correctAnswer:'affect is a verb, effect is a noun', explanation:'"Affect" (verb): to influence. "Effect" (noun): the result.', points:30 },

  // ── C1 VOCABULARY ───────────────────────────────────────────
  { type:'QCM', level:'C1', category:'VOCABULARY', question:'"Sycophantic" behaviour involves ___', choices:JSON.stringify(['open criticism','excessive flattery to gain favour','honest feedback','aggressive confrontation']), correctAnswer:'excessive flattery to gain favour', explanation:'A sycophant flatters powerful people to gain advantage.', points:30 },
  { type:'QCM', level:'C1', category:'VOCABULARY', question:'To "exacerbate" a situation means to ___', choices:JSON.stringify(['improve it','resolve it','make it worse','ignore it']), correctAnswer:'make it worse', explanation:'"Exacerbate" = to intensify or worsen.', points:30 },
  { type:'QCM', level:'C1', category:'VOCABULARY', question:'A "laconic" person uses ___', choices:JSON.stringify(['very few words','very technical language','many metaphors','complex grammar']), correctAnswer:'very few words', explanation:'"Laconic" = using very brief, terse language.', points:30 },
  { type:'QCM', level:'C1', category:'VOCABULARY', question:'"Equivocate" means to ___', choices:JSON.stringify(['speak with clarity','avoid giving a clear answer','state facts bluntly','translate accurately']), correctAnswer:'avoid giving a clear answer', explanation:'To equivocate = to speak ambiguously.', points:30 },
  { type:'QCM', level:'C1', category:'VOCABULARY', question:'"Bemused" means ___', choices:JSON.stringify(['highly amused','slightly annoyed','puzzled and confused','deeply moved']), correctAnswer:'puzzled and confused', explanation:'"Bemused" = puzzled/confused, NOT amused. Common mistake!', points:30 },
  { type:'QCM', level:'C1', category:'VOCABULARY', question:'"Perfidious" means ___', choices:JSON.stringify(['trustworthy','deceitful and untrustworthy','extremely brave','highly intelligent']), correctAnswer:'deceitful and untrustworthy', explanation:'"Perfidious" = guilty of betrayal or treachery.', points:30 },
  { type:'QCM', level:'C1', category:'VOCABULARY', question:'The article was a scathing ___ of government policy.', choices:JSON.stringify(['compliment','indictment','endorsement','synopsis']), correctAnswer:'indictment', explanation:'"Indictment" = a strong formal criticism or condemnation.', points:30 },
  { type:'QCM', level:'C1', category:'VOCABULARY', question:'"Ephemeral" describes something that ___', choices:JSON.stringify(['lasts forever','is extremely important','lasts only a short time','is very expensive']), correctAnswer:'lasts only a short time', explanation:'"Ephemeral" = transient; lasting for a very short time.', points:30 },

  // ── C1 SPELLING ─────────────────────────────────────────────
  { type:'QCM', level:'C1', category:'VOCABULARY', question:'Which spelling is correct?', choices:JSON.stringify(['liason','liaison','laiason','liazon']), correctAnswer:'liaison', explanation:'"Liaison" — note the unusual -ai- sequence.', points:30 },
  { type:'QCM', level:'C1', category:'VOCABULARY', question:'Which spelling is correct?', choices:JSON.stringify(['supercede','supersede','superceed','superseed']), correctAnswer:'supersede', explanation:'"Supersede" — only English word ending in -sede (not -cede).', points:30 },

  // ── C2 GRAMMAR ──────────────────────────────────────────────
  { type:'QCM', level:'C2', category:'GRAMMAR', question:'Come what ___, I will stand by my decision.', choices:JSON.stringify(['may','might','will','could']), correctAnswer:'may', explanation:'"Come what may" = whatever happens (fixed phrase).', points:40 },
  { type:'QCM', level:'C2', category:'GRAMMAR', question:'It is high time the government ___ action on climate change.', choices:JSON.stringify(['takes','took','has taken','will take']), correctAnswer:'took', explanation:'"It is high time + past simple" — subjunctive-like urgency.', points:40 },
  { type:'QCM', level:'C2', category:'GRAMMAR', question:'She managed to win the case, ___ all odds.', choices:JSON.stringify(['against','despite of','in spite','regardless']), correctAnswer:'against', explanation:'"Against all odds" is the fixed prepositional phrase.', points:40 },
  { type:'QCM', level:'C2', category:'GRAMMAR', question:'The extent ___ which she influenced modern art cannot be overstated.', choices:JSON.stringify(['to','in','by','at']), correctAnswer:'to', explanation:'"The extent to which" is a fixed phrase.', points:40 },
  { type:'QCM', level:'C2', category:'GRAMMAR', question:'Much ___ the government claimed, the deficit did not fall.', choices:JSON.stringify(['as','though','even if','however']), correctAnswer:'as', explanation:'"Much as" = a concessive clause meaning "even though".', points:40 },
  { type:'QCM', level:'C2', category:'GRAMMAR', question:'He spoke ___ conviction that even his opponents were swayed.', choices:JSON.stringify(['with such','with so','in such a','with such a']), correctAnswer:'with such', explanation:'"With such + uncountable noun" — "conviction" takes no article here.', points:40 },
  { type:'QCM', level:'C2', category:'GRAMMAR', question:'The regulations, ___ long overdue, were finally introduced.', choices:JSON.stringify(['considered','being considered','having been considered','having considered']), correctAnswer:'being considered', explanation:'Reduced non-defining relative clause with passive participle.', points:40 },
  { type:'QCM', level:'C2', category:'GRAMMAR', question:'"The report drew attention to the anomalies ___ had gone unnoticed."', choices:JSON.stringify(['which','that','who','what']), correctAnswer:'that', explanation:'After a general antecedent without comma, "that" is preferred in restrictive clauses.', points:40 },
  { type:'QCM', level:'C2', category:'GRAMMAR', question:'___ had the sun set than the storm began.', choices:JSON.stringify(['Hardly','No sooner','Scarcely','Barely']), correctAnswer:'Scarcely', explanation:'"Scarcely...than" is the correct pairing. "No sooner...than" also works.', points:40 },
  { type:'QCM', level:'C2', category:'GRAMMAR', question:'The initiative is ___ meeting with scepticism from industry leaders.', choices:JSON.stringify(['said to be','reported as','understood to be','known as']), correctAnswer:'said to be', explanation:'"Said to be + gerund" = passive reporting of an ongoing situation.', points:40 },
  { type:'OPEN', level:'C2', category:'VOCABULARY', question:'Use "notwithstanding" in a grammatically correct sentence fragment.', correctAnswer:'notwithstanding the difficulties', explanation:'"Notwithstanding" = despite; used as preposition or conjunction.', points:40 },

  // ── C2 VOCABULARY ───────────────────────────────────────────
  { type:'QCM', level:'C2', category:'VOCABULARY', question:'"Tendentious" writing is ___', choices:JSON.stringify(['completely neutral','promoting a particular point of view','very technical','written in archaic style']), correctAnswer:'promoting a particular point of view', explanation:'"Tendentious" = expressing a biased opinion.', points:40 },
  { type:'QCM', level:'C2', category:'VOCABULARY', question:'To "obviate" the need for something means to ___', choices:JSON.stringify(['increase the need','make it unnecessary','postpone it','urgently require it']), correctAnswer:'make it unnecessary', explanation:'"Obviate" = to remove a difficulty or need.', points:40 },
  { type:'QCM', level:'C2', category:'VOCABULARY', question:'"Solipsistic" thinking involves ___', choices:JSON.stringify(['deep empathy','the view that only one\'s own mind is real','rigorous logic','collective decisions']), correctAnswer:"the view that only one's own mind is real", explanation:'Solipsism = the idea that only one\'s own mind exists.', points:40 },
  { type:'QCM', level:'C2', category:'VOCABULARY', question:'"Pellucid" prose is ___', choices:JSON.stringify(['very obscure','admirably clear','repetitive','full of jargon']), correctAnswer:'admirably clear', explanation:'"Pellucid" = translucently clear; easy to understand.', points:40 },
  { type:'QCM', level:'C2', category:'VOCABULARY', question:'A "recondite" subject is ___', choices:JSON.stringify(['widely known','little known or obscure','recently discovered','highly controversial']), correctAnswer:'little known or obscure', explanation:'"Recondite" = obscure and specialised.', points:40 },
  { type:'QCM', level:'C2', category:'VOCABULARY', question:'"Prolix" speech is criticised for being ___', choices:JSON.stringify(['too brief','unnecessarily long and wordy','too technical','overly emotional']), correctAnswer:'unnecessarily long and wordy', explanation:'"Prolix" = tediously lengthy.', points:40 },
  { type:'QCM', level:'C2', category:'VOCABULARY', question:'"Anodyne" opinions are those that ___', choices:JSON.stringify(['are highly controversial','are intended to avoid offence','are expressed with passion','reflect radical ideas']), correctAnswer:'are intended to avoid offence', explanation:'"Anodyne" = intentionally inoffensive and unremarkable.', points:40 },
  { type:'QCM', level:'C2', category:'VOCABULARY', question:'To "gainsay" something means to ___', choices:JSON.stringify(['confirm it','strongly support it','deny or contradict it','misunderstand it']), correctAnswer:'deny or contradict it', explanation:'"Gainsay" = to deny or contradict (formal/archaic).', points:40 },

  // ── C2 SPELLING ─────────────────────────────────────────────
  { type:'QCM', level:'C2', category:'VOCABULARY', question:'Which spelling is correct?', choices:JSON.stringify(['desiccate','dessicate','desicate','dessaccate']), correctAnswer:'desiccate', explanation:'"Desiccate" — single s, double c: des-ic-cate.', points:40 },
  { type:'QCM', level:'C2', category:'VOCABULARY', question:'Which spelling is correct?', choices:JSON.stringify(['inadvertant','inadvertent','innadvertent','inadvirtent']), correctAnswer:'inadvertent', explanation:'"Inadvertent" — -ent ending, from Latin "advertere".', points:40 },
];

async function main() {
  console.log('🌱 Seeding database...');
  await prisma.question.deleteMany();

  let count = 0;
  for (const q of questions) {
    await prisma.question.create({ data: q });
    count++;
  }

  const byLevel = {};
  for (const q of questions) byLevel[q.level] = (byLevel[q.level] || 0) + 1;

  console.log(`\n✅ Seeded ${count} questions:`);
  for (const [level, n] of Object.entries(byLevel).sort())
    console.log(`   ${level}: ${n} questions`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
