
import type { Achievement, UserProgress, HospitalBagItem, DailyMessageWeek } from './types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Completed onboarding and set the due date.',
    points: 10,
    icon: '🚀',
    criteria: (progress) => progress.readWeeks.length >= 0, // Unlocked by default on start
  },
  {
    id: 'week_1_reader',
    title: 'Curious Beginner',
    description: 'Read your first weekly guide.',
    points: 20,
    icon: '🧐',
    criteria: (progress) => progress.readWeeks.length >= 1,
  },
  {
    id: 'five_weeks',
    title: 'Weekly Reader',
    description: 'Read 5 weekly guides.',
    points: 50,
    icon: '📚',
    criteria: (progress) => progress.readWeeks.length >= 5,
  },
  {
    id: 'first_trimester',
    title: 'First Trimester Graduate',
    description: 'Read all guides up to week 13.',
    points: 100,
    icon: '🎓',
    criteria: (progress) => {
      const requiredWeeks = Array.from({ length: 13 }, (_, i) => i + 1);
      return requiredWeeks.every(week => progress.readWeeks.includes(week));
    }
  },
  {
    id: 'halfway_there',
    title: 'Halfway Hero',
    description: 'You\'ve reached the 20-week mark!',
    points: 150,
    icon: '🦸‍♂️',
    criteria: (progress) => progress.readWeeks.includes(20),
  },
  {
    id: 'first_heartbeat',
    title: 'Sound of Life',
    description: 'You heard the baby\'s heartbeat for the first time!',
    points: 75,
    icon: '💓',
    criteria: (progress) => progress.celebratedMilestones.includes('first-heartbeat-detected'),
  },
  {
    id: 'anatomy_scan_aced',
    title: 'Anatomy Scan Aced',
    description: 'You saw the baby in detail at the anatomy scan.',
    points: 100,
    icon: '🖼️',
    criteria: (progress) => progress.celebratedMilestones.includes('anatomy-scan'),
  },
  {
    id: 'viability_victor',
    title: 'Viability Victor',
    description: 'You\'ve reached the major milestone of viability week!',
    points: 120,
    icon: '🛡️',
    criteria: (progress) => progress.celebratedMilestones.includes('viability-week'),
  },
];

export const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 4000, 8000]; // Points needed to reach level (index + 1)

export const HOSPITAL_BAG_CHECKLIST: HospitalBagItem[] = [
    { id: 'docs1', name: 'ID and Insurance Card', category: 'Documents' },
    { id: 'docs2', name: 'Birth Plan (if any)', category: 'Documents' },
    { id: 'partner1', name: 'Comfortable Robe', category: 'For Partner' },
    { id: 'partner2', name: 'Socks and Slippers', category: 'For Partner' },
    { id: 'partner3', name: 'Nursing Bra / Tanks', category: 'For Partner' },
    { id: 'partner4', name: 'Toiletries & Lip Balm', category: 'For Partner' },
    { id: 'partner5', name: 'Going Home Outfit', category: 'For Partner' },
    { id: 'you1', name: 'Change of Clothes', category: 'For You' },
    { id: 'you2', name: 'Phone and Long Charger', category: 'For You' },
    { id: 'you3', name: 'Snacks and Water Bottle', category: 'For You' },
    { id: 'you4', name: 'Toothbrush / Toiletries', category: 'For You' },
    { id: 'baby1', name: 'Installed Car Seat', category: 'For Baby' },
    { id: 'baby2', name: 'Going Home Outfit', category: 'For Baby' },
    { id: 'baby3', name: 'Baby Blanket', category: 'For Baby' },
];

export const DAILY_MESSAGES: DailyMessageWeek[] = [
  {
    "week": 3,
    "daily_messages": [
      "Hey Dad! Big news from in here. I'm laying down the foundation for my entire nervous system this week. It's like you're marking out where all the wiring will go in a new house!",
      "Right now, I'm just a tiny blueprint, but the most important part is starting: my future brain and spine. This is the very beginning of... well, me!",
      "Did you know my command center is under construction? I'm working hard on something called the neural plate. It's the start of everything smart about me. High-five, Dad!"
    ]
  },
  {
    "week": 4,
    "daily_messages": [
      "Phew, what a week, Dad! I just finished 'zipping up' my neural tube. Think of it like sealing a super-important protective case around all my future wiring.",
      "And that's not all! While I was working on my brain, some special cells started gathering to build my heart. It's like getting the power and plumbing installed first on a construction site!",
      "Two big projects are done! My nervous system's foundation is secure, and my heart engine is being assembled. I'm a busy little builder in here!"
    ]
  },
  {
    "week": 5,
    "daily_messages": [
      "Guess what, Dad? I have a heartbeat! It's super fast, around 110 beats per minute, like a tiny drum. It's the first sign that my little engine is running!",
      "My brain is getting organized. It's dividing into specialized zones: one for thinking, one for security, and one for running all the basic utilities. The management team is moving in!",
      "That flutter you might see on an ultrasound? That's my heart, Dad! It's twisting and folding into its final shape, all while pumping away. It's like renovating a water pump while it's still running!"
    ]
  },
  {
    "week": 6,
    "daily_messages": [
      "My brain is building itself from the inside out, Dad! New workers (neurons) are climbing to their spots to build the higher floors. It's getting pretty complex up here!",
      "My heart is getting an upgrade! It's going from a simple tube to having separate rooms. They're even installing temporary 'doors' to keep things flowing while construction is underway.",
      "Can you see me, Dad? Not yet! But I'm starting to form little dents where my eyes and ears will go. It's like cellular origami, folding everything perfectly into place."
    ]
  },
  {
    "week": 7,
    "daily_messages": [
      "Dad, my brain just 'turned on'! The first tiny electrical signals are firing. It's like a computer booting up for the very first time, testing all the new connections.",
      "Check this out: my heart is now a proper four-chamber pump! All the rooms are built, and the one-way valves are working. It's ready to beat billions of times for you.",
      "I'm sprouting, Dad! I have little bumps that will become my arms and legs. A special team of cells at the tips are the project managers, making sure everything grows just right."
    ]
  },
  {
    "week": 8,
    "daily_messages": [
      "I'm getting wired up, Dad! The main cable trunk—my spinal cord—is connecting my brain to the rest of my body. The first simple reflexes are starting to work!",
      "My hands look like little mittens right now. The fingers are all there, but they're webbed. Soon, it'll be like a sculptor carving away the extra bits to reveal my tiny fingers.",
      "My digestive system is taking shape. The intestines are growing so fast they're temporarily bulging into the umbilical cord. It's like needing extra storage space during a big renovation!"
    ]
  },
  {
    "week": 9,
    "daily_messages": [
      "Look, Dad—no more mittens! The webbing between my fingers and toes is dissolving, revealing ten of each. I can't wait to grab your finger with these.",
      "My whole digestive system is finding its permanent home. The intestines are rotating and tucking themselves back inside perfectly. It's like packing a long rope into a small box with expert skill.",
      "I'm starting to build my skeleton! The soft cartilage framework is beginning to harden into real bone from the center of each bone outward. I'm getting stronger every day."
    ]
  },
  {
    "week": 10,
    "daily_messages": [
      "Time to get moving! My muscles are separating into all the individual little pieces I'll need to kick, stretch, and wiggle. I'm already practicing in here.",
      "I'm growing hair, Dad! Well, sort of. Tiny hair follicles, like little factories, are being installed under my skin. They already know my hair color and texture!",
      "My skeleton is getting tougher. The process of turning cartilage into bone is speeding up all over my body. I'm building the framework for a lifetime of adventures with you."
    ]
  },
  {
    "week": 11,
    "daily_messages": [
      "I've got a secret, Dad... my genetic code is telling me whether I'm a boy or a girl, and the internal parts are getting built right now. It's like opening the correct set of blueprints!",
      "Say cheese! I'm growing tooth buds deep in my gums. All 20 of my baby teeth are already being formed. I'm getting ready for my first smile.",
      "I can taste! My tongue is developing taste buds, and I can sample the flavors from the amniotic fluid. My first food lessons are starting now, thanks to Mom's meals."
    ]
  },
  {
    "week": 12,
    "daily_messages": [
      "My digestive system is online, Dad! I've started my 'practice runs' by swallowing amniotic fluid. It's helping all my organs get ready for milk later on.",
      "I'm starting to look more like a tiny human now. My face has a more defined profile, and my major systems are all in place. The 'critical construction' phase is wrapping up!",
      "All my organs are formed and in the right place. From now on, my main job is just to grow bigger and stronger for you. The finishing touches are being added!"
    ]
  },
  {
    "week": 13,
    "daily_messages": [
      "I've got fingerprints, Dad! They're tiny, unique patterns on my fingers and toes that are all my own. I can't wait to grab your finger with them.",
      "Big news! We're officially in the second trimester. Mom might be starting to feel a lot better, with more energy. The 'honeymoon' phase of pregnancy is starting!",
      "My vocal cords are developing this week. I'm not making any noise yet, but I'm getting everything ready to call you 'Dad' one day."
    ]
  },
  {
    "week": 14,
    "daily_messages": [
      "I'm starting to grow some fine, soft hair all over my body called lanugo. It's like a cozy little coat that will keep me warm in here until I have more fat.",
      "I can make facial expressions now, Dad! I'm practicing squinting, frowning, and maybe even smiling. I'm getting my personality ready!",
      "My neck is getting longer and my head is more upright. I'm looking less like a little bean and more like a tiny human every single day."
    ]
  },
  {
    "week": 15,
    "daily_messages": [
      "My skeleton is hardening from soft cartilage into bone. I'm building a strong frame so I can give you big hugs when I arrive.",
      "I can sense light now! Even though my eyelids are still fused shut, if you shine a bright light on Mom's belly, I might move away from it.",
      "I'm wiggling and moving all my limbs, even though Mom probably can't feel me yet. It's like my own private gymnastics class in here."
    ]
  },
  {
    "week": 16,
    "daily_messages": [
      "My ears are in their final position, and the tiny bones inside are forming. I might be able to start hearing sounds soon, and your voice will be my favorite!",
      "I'm having a big growth spurt! In the next few weeks, I'm going to double my weight. I'm working hard on getting bigger and stronger for you.",
      "My nervous system is making important connections. My brain is now controlling all my limb movements. Every kick and stretch is practice!"
    ]
  },
  {
    "week": 17,
    "daily_messages": [
      "My heart is now regulated by my brain and is pumping about 150 times a minute. That's twice as fast as yours, Dad!",
      "I'm starting to put on some fat, which is important for keeping me warm and giving me energy. I'm no longer see-through!",
      "Mom might be feeling the first little flutters of my movement soon. It's called 'quickening.' Be ready, I'll be making my presence known!"
    ]
  },
  {
    "week": 18,
    "daily_messages": [
      "I'm hearing things now, Dad! Your voice, Mom's heartbeat, and gurgles from her stomach are the soundtrack to my day. Talk to me whenever you can!",
      "The nerves around my body are getting coated in something called myelin. It's like insulating electrical wires so messages can travel faster from my brain to my body.",
      "If I'm a girl, my ovaries have already formed with a lifetime supply of eggs. If I'm a boy, my genitals might be visible on an ultrasound soon!"
    ]
  },
  {
    "week": 19,
    "daily_messages": [
      "I'm covered in a waxy, white substance called vernix caseosa. It's like a waterproof moisturizer that protects my skin from the amniotic fluid.",
      "My brain is designating special areas for smell, taste, hearing, vision, and touch. I'm getting all my senses ready to experience the world with you.",
      "Those little flutters are getting stronger. Soon they'll feel more like real kicks. I'm just saying hello and letting you know I'm here!"
    ]
  },
  {
    "week": 20,
    "daily_messages": [
      "We're halfway there, Dad! 20 weeks down, 20 to go. Thanks for being on this journey with me.",
      "I'm practicing swallowing, which is good for my digestive system development. I'm getting ready for my first meal after I'm born.",
      "You might be able to find out if I'm a boy or a girl at the anatomy scan this week! Are you ready for the big surprise?"
    ]
  },
  {
    "week": 21,
    "daily_messages": [
      "My movements are becoming less random and more controlled. I can kick and stretch with purpose now. Maybe you can feel me from the outside!",
      "My taste buds are working! I can taste the different flavors from the food Mom eats that make their way into the amniotic fluid. Send snacks!",
      "My bone marrow has started making blood cells, a job the liver and spleen were doing before. I'm becoming more self-sufficient."
    ]
  },
  {
    "week": 22,
    "daily_messages": [
      "I look like a miniature newborn now, Dad. My lips, eyebrows, and eyelids are all distinct. I just need to get a little bigger and chubbier.",
      "My sense of touch is developing. I can feel myself touching my face, or grabbing the umbilical cord. I'm exploring my little world in here.",
      "I can hear your conversations now! Reading or singing to me is a great way for us to start bonding. I'm already your biggest fan."
    ]
  },
  {
    "week": 23,
    "daily_messages": [
      "The blood vessels in my lungs are developing to prepare for breathing. I'm practicing with the amniotic fluid, getting ready for that first breath of fresh air.",
      "My hearing is getting even better. Loud noises from the outside world might even make me jump! Sorry if I startle Mom.",
      "If you press gently on Mom's belly, I might just press back. Let's play! It's our first game."
    ]
  },
  {
    "week": 24,
    "daily_messages": [
      "I've reached a big milestone called 'viability,' which means I might be able to survive with a lot of medical help if I were born now. But I plan on staying in here to grow much more!",
      "My face is fully formed now. I have eyelashes, eyebrows, and hair on my head. I wonder if I look more like you or Mom.",
      "My inner ear is fully developed, which means I can tell if I'm upside down or right-side up. I'm doing flips in here while I still have the room!"
    ]
  },
  {
    "week": 25,
    "daily_messages": [
      "I'm starting to add more body fat, which is making me look less wrinkled and more like the baby you're imagining.",
      "My hands are fully developed and I'm getting better at gripping. I'm practicing for the day I can hold your hand.",
      "I'm responding to your voice and Mom's with an increased heart rate. You guys are already my favorite people."
    ]
  },
  {
    "week": 26,
    "daily_messages": [
      "My eyes are starting to open for the first time! There's not much to see in here, but I'm getting them ready to see your face.",
      "My brainwaves are starting to look like those of a newborn. I'm even starting to have different sleep cycles, including REM sleep where I might be dreaming.",
      "My lungs are producing surfactant, a substance that will help my air sacs inflate when I'm born. It's a super important step for breathing on my own."
    ]
  },
  {
    "week": 27,
    "daily_messages": [
      "Welcome to the third trimester, Dad! We're on the home stretch now. I'm getting big and getting everything ready to meet you soon.",
      "I might be getting hiccups! Mom might feel them as tiny, rhythmic jumps in her belly. It's just me, practicing my breathing.",
      "I recognize your voice now, Dad. When you talk, my heart rate might even get a little calmer. Your voice is my safe space."
    ]
  },
  {
    "week": 28,
    "daily_messages": [
      "I can open my eyes and blink now. I can see light and shadows through Mom's belly. The world is getting a little brighter!",
      "It's getting a little snug in here! I don't have as much room for gymnastics, so my movements might feel more like strong jabs and rolls instead of flips.",
      "My brain is developing billions of neurons and is getting wrinkly. Those wrinkles help me store more information. I'm getting smarter every day!"
    ]
  },
  {
    "week": 29,
    "daily_messages": [
      "My bones are getting much harder, so make sure Mom is getting enough calcium. I'm borrowing it to build my strong skeleton!",
      "I'm getting pretty good at regulating my own body temperature now, which is great practice for living on the outside.",
      "My head is growing to make room for my developing brain. I'm working hard on becoming a little genius for you."
    ]
  },
  {
    "week": 30,
    "daily_messages": [
      "I can see what's around me in here now, though it's pretty dim. My vision is developing, getting ready to focus on your face.",
      "I'm putting on about half a pound a week from now on. My main job is just to get bigger and stronger for my big debut.",
      "The fine hair (lanugo) that covered my body is starting to disappear, as I now have enough fat to keep myself warm."
    ]
  },
  {
    "week": 31,
    "daily_messages": [
      "All five of my senses are working! I can see, hear, taste, touch, and smell. I'm all ready to experience the world with you.",
      "I'm having regular sleep-wake cycles now. Don't be surprised if my most active time is when you and Mom are trying to sleep!",
      "My brain can process information now. The connections are getting faster and more complex. I'm getting ready to learn all about you."
    ]
  },
  {
    "week": 32,
    "daily_messages": [
      "I'm practicing for life on the outside: breathing, swallowing, kicking, and sucking. It's like a full-time training camp in here.",
      "My toenails and fingernails have finished growing. They might even need a trim shortly after I'm born!",
      "I've probably settled into a head-down position now, getting ready for birth. It's the best way for me to make my grand entrance."
    ]
  },
  {
    "week": 33,
    "daily_messages": [
      "My bones are getting harder every day, but my skull bones are still soft and separated. This helps me fit through the birth canal more easily.",
      "I'm passing antibodies from Mom, which is helping build my immune system for the first few months after I'm born. She's giving me my first shield!",
      "My pupils can constrict and dilate now, reacting to light. I'm getting my eyes ready to see you clearly."
    ]
  },
  {
    "week": 34,
    "daily_messages": [
      "I'm considered 'late preterm' now. My lungs are much more developed, and I'd have a great chance of doing well if I were born this week.",
      "That waxy vernix coating on my skin is getting thicker now, providing extra protection as I get ready for birth.",
      "Listen closely, Dad. I can definitely tell the difference between your voice and a stranger's. Keep talking to me!"
    ]
  },
  {
    "week": 35,
    "daily_messages": [
      "It's getting very crowded! My movements are big and powerful now since I don't have much room to wind up for a kick.",
      "My kidneys are fully developed, and my liver can process some waste. All my internal systems are getting their final checks.",
      "I'm gaining fat all over, especially around my shoulders. It's giving me those adorable baby chubs you're going to love."
    ]
  },
  {
    "week": 36,
    "daily_messages": [
      "I'm 'engaging' or 'dropping' down into Mom's pelvis, which is the first step in getting ready for labor. It's a sign that we're getting close!",
      "My lungs are almost fully mature. I'm producing enough surfactant to be able to breathe on my own without much trouble.",
      "I'm shedding most of the fuzzy lanugo hair and the waxy vernix. I'm getting cleaned up and ready to meet you!"
    ]
  },
  {
    "week": 37,
    "daily_messages": [
      "Big news, Dad: I'm considered 'early term'! This means my development is complete, and it's safe for me to be born anytime now.",
      "I'm practicing my grip by grabbing my feet and the umbilical cord. I'm getting my hands strong for holding onto your finger.",
      "I'm just putting on the finishing touches. A little more fat here, a little more practice breathing there. The countdown has begun!"
    ]
  },
  {
    "week": 38,
    "daily_messages": [
      "My brain and nervous system are fine-tuning all their connections. I'm ready to control my breathing, heart rate, and digestion all on my own.",
      "I have a full head of hair now, maybe an inch long. Do you think it will be your color or Mom's?",
      "I'm swallowing amniotic fluid which ends up in my intestines as meconium—my first bowel movement after I'm born."
    ]
  },
  {
    "week": 39,
    "daily_messages": [
      "I'm officially 'full term'! I'm fully cooked and ready to go, just waiting for the signal that it's time to meet you both.",
      "My chest is prominent, and if I'm a boy, my testes have descended. I'm physically ready for the outside world.",
      "My immune system is still getting a big boost from Mom, receiving antibodies that will protect me for the first six months of my life."
    ]
  },
  {
    "week": 40,
    "daily_messages": [
      "It's my due date, Dad! I could arrive today, or I might make you wait a little longer. I'll come when I'm perfectly ready.",
      "I'm packed and ready for my journey. All my systems are a go. The next time you hear from me, it might be in person!",
      "Just relaxing and waiting for the right moment. Thank you for being my dad and for waiting for me. I can't wait to finally be in your arms."
    ]
  }
];
