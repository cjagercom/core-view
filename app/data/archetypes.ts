import type { Archetype } from '~/types/profile';

export const archetypes: Archetype[] = [
  {
    id: 'quiet-strategist',
    name: 'The Quiet Strategist',
    coreSentence: 'You reach your sharpest insights from a place of stillness.',
    description:
      "You need very little noise to think clearly. Where others draw energy from conversation and action, you find your power in solitude and deep thought. You see patterns others miss because you take the time to truly understand what's going on.",
    dimensionTexts: {
      energy: 'Your energy source is quiet and alone time. After a busy day, you need silence to recharge.',
      processing:
        "You'd rather go deep than broad. You have the patience to work through complex problems layer by layer.",
      uncertainty: 'You like a well-thought-out plan. Before you act, you want to understand the landscape.',
      social:
        'You prefer working autonomously. Collaboration works, but only with a few people who think at your level.',
      response: 'You take your time with decisions. Your first instinct is to think, not to act.',
    },
    strengths: ['Deep analysis', 'Independent thinking', 'Strategic vision', 'Persistence with complex problems'],
    watchOuts: [
      'Can stay in thinking mode too long',
      'Risk of isolation in teams',
      'Difficulty with rapid course changes',
    ],
    centroid: { energy: 20, processing: 15, uncertainty: 20, social: 20, response: 15 },
  },
  {
    id: 'quiet-architect',
    name: 'The Quiet Architect',
    coreSentence: "You build systems that others only appreciate once they're inside them.",
    description:
      "You combine deep thinking with a subtle ability to create structure for others. You're not the loudest in the room, but your work speaks for itself. You think in systems and connections.",
    dimensionTexts: {
      energy: 'You work best in a quiet environment. Focus is your superpower.',
      processing:
        'You think in systems and structures. You see not just the problem, but how all the parts fit together.',
      uncertainty: "You prefer having a plan, but you're pragmatic enough to adjust when needed.",
      social:
        "You're not a loner per se — you value good collaboration. But you need clear boundaries on when to work together and when alone.",
      response: "You think things through before you start. Once you're in motion, you're hard to stop.",
    },
    strengths: [
      'Systems thinking',
      'Thorough preparation',
      'Reliable execution',
      'Sees both the big picture and details',
    ],
    watchOuts: ['Can become perfectionistic', 'Difficulty delegating', 'May spend too much time on architecture'],
    centroid: { energy: 20, processing: 15, uncertainty: 25, social: 40, response: 20 },
  },
  {
    id: 'deep-diver',
    name: 'The Deep Diver',
    coreSentence: 'You disappear into a subject until you understand it from the inside out.',
    description:
      "Curiosity is your engine. Where others explore the surface, you dive to the bottom. You're fascinated by how things work and feel most alive when unraveling a complex problem.",
    dimensionTexts: {
      energy:
        "You're strongly inward-focused. Your richest life happens in your head — in ideas, theories, and connections.",
      processing:
        "Deeper than deep. You don't stop at the first answer. This makes you exceptionally good at specialist work.",
      uncertainty:
        "You're more curious than most people. The unknown attracts you, as long as you can dive deep into it.",
      social:
        "People aren't your primary focus. You can work excellently with other experts, but small talk drains you.",
      response: "You think longer than most people, and that's a choice, not a limitation.",
    },
    strengths: ['Exceptional depth', 'Tireless curiosity', 'Expertise building', 'Original thinking'],
    watchOuts: ['Can get lost in details', 'Risk of tunnel vision', 'May forget to share findings'],
    centroid: { energy: 15, processing: 10, uncertainty: 40, social: 15, response: 25 },
  },
  {
    id: 'steady-engine',
    name: 'The Steady Engine',
    coreSentence: 'You keep things running without anyone noticing how.',
    description:
      "You're the quiet force behind a well-functioning team. You think thoroughly, act carefully, and make sure the structure holds. You don't seek the spotlight, but without you things fall apart.",
    dimensionTexts: {
      energy: 'You have a quiet, steady energy. No peaks and valleys — just a constant flow that lasts.',
      processing: 'You prefer going deep, but have enough overview to keep the big picture in check.',
      uncertainty: "Structure is your anchor. You plan ahead and don't like surprises.",
      social: "You're balanced in how you relate to people. You're the stabilizing factor in any team.",
      response: "You think first, then act. But you do act — you're a doer with a plan.",
    },
    strengths: ['Reliability', 'Thoroughness', 'Balance between thinking and doing', 'Stabilizing presence in teams'],
    watchOuts: ['Can be too cautious', 'Difficulty with sudden change', 'May neglect own needs'],
    centroid: { energy: 25, processing: 20, uncertainty: 15, social: 50, response: 25 },
  },
  {
    id: 'navigator',
    name: 'The Navigator',
    coreSentence: 'You point the way without it ever feeling like being directed.',
    description:
      'You have a natural sense for where a group needs to go. You combine analytical thinking with a social antenna. Your leadership style is subtle: you steer by asking the right questions.',
    dimensionTexts: {
      energy: "You're mostly inward-oriented, but you also draw energy from meaningful conversations.",
      processing: "You like looking beneath the surface, but you don't lose the overview.",
      uncertainty: 'You want a plan, but you know plans need to breathe. You navigate with a compass, not a map.',
      social:
        'Connection is a core value. You invest in relationships and understand that results come through people.',
      response: 'Deliberate but not slow. You listen before you give direction.',
    },
    strengths: ['Natural leadership', 'Listening and probing', 'Connecting people and ideas', 'Strategic empathy'],
    watchOuts: [
      'May take on too much responsibility',
      'Difficulty with unpopular decisions',
      'Can delay sharing own opinion',
    ],
    centroid: { energy: 35, processing: 30, uncertainty: 20, social: 65, response: 30 },
  },
  {
    id: 'explorer',
    name: 'The Explorer',
    coreSentence: 'You feel most at home in uncharted territory.',
    description:
      'Routine is your enemy, the unknown is your playground. You have an inexhaustible drive to discover, try, and learn new things. You think broadly, switch quickly, and get bored fast once the challenge is gone.',
    dimensionTexts: {
      energy: "You're mostly inward-oriented, but discovering something new can energize you enormously.",
      processing: 'You switch easily between topics. You reach depth when something truly fascinates you.',
      uncertainty: 'You embrace uncertainty. Where others feel stress at the unknown, you feel excitement.',
      social:
        'You prefer operating independently. Exploring is best done alone or with a small group of like-minded people.',
      response: "You're relatively quick in your responses. You'd rather learn by doing than by planning.",
    },
    strengths: ['Innovative thinking', 'Adaptability', 'Fast learning', 'Comfort with ambiguity'],
    watchOuts: ['Difficulty finishing what you start', 'May move on too quickly', 'Routine tasks get neglected'],
    centroid: { energy: 30, processing: 40, uncertainty: 80, social: 30, response: 55 },
  },
  {
    id: 'trailblazer',
    name: 'The Trailblazer',
    coreSentence: 'You break paths that others follow later.',
    description:
      "You're a doer with a vision. You don't wait for someone to show you the way — you make your own. Risk doesn't scare you; standing still does.",
    dimensionTexts: {
      energy: "You have a mix of internal and external. You can work alone, but you're also energized by interaction.",
      processing: 'You think broadly and make quick connections across domains. You know enough to get started.',
      uncertainty: "You embrace risk and uncertainty almost completely. You trust that you'll adjust along the way.",
      social: 'You work both alone and in teams. You inspire others through your energy and conviction.',
      response: "You're fast. You act, reflect, and adapt — in that order.",
    },
    strengths: ['Decisiveness', 'Vision', 'Entrepreneurship', 'Getting others to follow a direction'],
    watchOuts: ['Can act too quickly', 'Risk of burnout', 'Impatient with slow processes'],
    centroid: { energy: 60, processing: 55, uncertainty: 85, social: 45, response: 75 },
  },
  {
    id: 'catalyst',
    name: 'The Catalyst',
    coreSentence: 'You bring people and ideas together into something greater.',
    description:
      "You're a connector with drive. You see possibilities where others see problems. You think broadly, act fast, and your greatest satisfaction comes from bringing the right people together around the right idea.",
    dimensionTexts: {
      energy: 'You clearly draw energy from interaction. Conversations, brainstorms, and collaboration charge you up.',
      processing:
        "You're a generalist in the best sense — you see connections between domains and bring them together.",
      uncertainty: "You're comfortable with the unknown. You don't need to know everything before you start.",
      social: "Connection is your core. You're at your best when bringing people together and creating synergy.",
      response: "You're fast and energetic. You think while talking and while doing.",
    },
    strengths: ['Connecting leadership', 'Creative combining', 'Energizing others', 'Activating networks'],
    watchOuts: ['Too many balls in the air', 'Risk of superficiality', 'May neglect own rest'],
    centroid: { energy: 70, processing: 60, uncertainty: 70, social: 75, response: 70 },
  },
  {
    id: 'director',
    name: 'The Director',
    coreSentence: 'You orchestrate complex processes with a human eye.',
    description:
      'You combine organizational talent with genuine attention to people. You bring structure without losing the human touch. You feel responsible for both the outcome and the wellbeing of the team.',
    dimensionTexts: {
      energy: 'You switch effortlessly between solo work and group interaction. You need some of both.',
      processing: 'You have a good balance between detail and overview. You can zoom in and zoom out.',
      uncertainty: 'You like structure and clarity. You make plans and monitor progress.',
      social: 'People are your priority. You lead by facilitating, not by commanding.',
      response: "You're deliberate but not indecisive. The time you take is proportional to the importance.",
    },
    strengths: ['Process management', 'Team facilitation', 'Reliable execution', 'Balance between task and people'],
    watchOuts: ['Difficulty letting go of control', 'Taking on too much', 'May avoid conflict too long'],
    centroid: { energy: 55, processing: 45, uncertainty: 25, social: 70, response: 40 },
  },
  {
    id: 'bridge-builder',
    name: 'The Bridge Builder',
    coreSentence: "You create understanding between people who don't speak each other's language.",
    description:
      'You have an exceptional ability to empathize with different perspectives and connect them. You find satisfaction in creating mutual understanding.',
    dimensionTexts: {
      energy: "You're balanced — you function well both alone and in a group.",
      processing: 'You think broadly enough to see different perspectives, and deeply enough to truly understand them.',
      uncertainty: 'You seek stability but are flexible enough for different work styles.',
      social: "This is your core strength. You seek connection for the greater whole. You're the glue in any team.",
      response: 'You listen before you respond. This makes you a good mediator.',
    },
    strengths: ['Empathy', 'Conflict mediation', 'Integrating perspectives', 'Building trust'],
    watchOuts: [
      'May lose your own stance in the middle',
      'Difficulty taking sides',
      "Emotionally burdened by others' conflicts",
    ],
    centroid: { energy: 50, processing: 50, uncertainty: 45, social: 85, response: 45 },
  },
  {
    id: 'quick-thinker',
    name: 'The Quick Thinker',
    coreSentence: 'You see the solution while others are still formulating the problem.',
    description:
      "Your brain works fast and broad. You make lightning-fast connections and often have an answer before the question is finished. You're impatient with slowness and feel most alive in situations that demand speed and sharpness.",
    dimensionTexts: {
      energy: "You're in the middle — you work fine alone, but also draw energy from quick exchanges.",
      processing:
        'You think broadly and fast. You see patterns and draw conclusions where others are still gathering data.',
      uncertainty: "You're fairly comfortable with uncertainty. You prefer action over perfect information.",
      social:
        "You operate relatively autonomously. You value smart people around you, but don't need constant alignment.",
      response: 'Speed is your trademark. You decide fast, act fast, and correct fast.',
    },
    strengths: ['Rapid analysis', 'Pattern recognition', 'Effectiveness under pressure', 'Decisiveness'],
    watchOuts: ['May conclude too quickly', 'Risk of missing nuance', 'Can come across as impatient'],
    centroid: { energy: 45, processing: 70, uncertainty: 55, social: 35, response: 80 },
  },
  {
    id: 'polymath',
    name: 'The Polymath',
    coreSentence: 'You switch effortlessly between worlds and get the best from each.',
    description:
      "You're the ultimate generalist. You have broad interests, learn fast, and can contribute in almost any context. Your strength isn't in specialism but in making unexpected connections.",
    dimensionTexts: {
      energy: 'You lean slightly outward — variety and interaction give you energy.',
      processing: 'Broad is your mode. You pick things up quickly and see connections that specialists miss.',
      uncertainty: "You're relatively open to the unknown. New situations are opportunities.",
      social: 'You function in different social contexts and adapt easily.',
      response: "You're quick but not impulsive. Experience across many domains helps you respond well.",
    },
    strengths: ['Versatility', 'Fast learning curve', 'Making connections', 'Adaptability'],
    watchOuts: [
      'Jack of all trades, master of none',
      'Difficulty with sustained focus',
      'Restless in stable environments',
    ],
    centroid: { energy: 60, processing: 80, uncertainty: 60, social: 55, response: 65 },
  },
  {
    id: 'accelerator',
    name: 'The Accelerator',
    coreSentence: 'You bring speed and energy wherever things stagnate.',
    description:
      "You're pure action. You instinctively sense where things are stuck and you have the energy to break them loose. You think while doing, decide fast, and pull others along at your pace.",
    dimensionTexts: {
      energy: "You're clearly outward-oriented. Action and movement give you energy.",
      processing:
        "You think broadly and pragmatically. You don't need to understand it perfectly — getting it working is enough.",
      uncertainty: 'You embrace uncertainty and chaos. You thrive in it.',
      social: "You're socially engaged but on your own terms. You inspire through action.",
      response: 'Reactive in the purest sense. You act first and reflect later.',
    },
    strengths: ['Perseverance', 'Energy injection', 'Crisis management', 'Creating momentum'],
    watchOuts: ['Can move too fast for the rest', 'Risk of overload', 'Reflection often comes too late'],
    centroid: { energy: 75, processing: 65, uncertainty: 75, social: 60, response: 85 },
  },
  {
    id: 'social-strategist',
    name: 'The Social Strategist',
    coreSentence: 'You think three moves ahead — including in relationships.',
    description:
      'You combine analytical ability with a sharp sense for social dynamics. You understand not just the game, but also the players. You plan carefully and know exactly when to play which card.',
    dimensionTexts: {
      energy: "You lean slightly inward, but social situations don't cost you effort — you read them.",
      processing: 'You think deep and strategic, about both content and people.',
      uncertainty: 'You want overview and like having a plan. You leave little to chance.',
      social: "You're strongly connecting, but always with purpose. Your relationships are genuine and strategic.",
      response: 'You think carefully before you act. Every move is calculated.',
    },
    strengths: ['Political intelligence', 'Strategic networking', 'Influence', 'Thinking ahead'],
    watchOuts: ['Can come across as calculating', 'Difficulty with spontaneity', 'May lose authenticity'],
    centroid: { energy: 40, processing: 30, uncertainty: 35, social: 75, response: 30 },
  },
  {
    id: 'quiet-force',
    name: 'The Quiet Force',
    coreSentence: 'Your influence is soft but unmistakable.',
    description:
      'You operate under the radar, but your impact is significant. You observe sharply, think deeply, and carefully choose when to speak up. When you do, people listen.',
    dimensionTexts: {
      energy: "You're strongly internal. You think a lot, say little, but what you say counts.",
      processing: 'You think mostly deep, with occasional surprisingly broad observations.',
      uncertainty: "You're slightly structured — you prefer clarity but aren't rigid.",
      social: "You're more social than you appear. You build deep relationships with few people.",
      response: "You're reflective and patient. Your timing is your strength.",
    },
    strengths: ['Observational skill', 'Depth in relationships', 'Timing', 'Unassuming but effective'],
    watchOuts: ['May wait too long to contribute', 'Sometimes gets overlooked', 'Difficulty with visibility'],
    centroid: { energy: 15, processing: 25, uncertainty: 30, social: 55, response: 20 },
  },
  {
    id: 'servant-leader',
    name: 'The Servant Leader',
    coreSentence: 'You make others better without standing in the spotlight yourself.',
    description:
      "You're the ultimate team player. You see what others need and make sure they get it. You measure your own success by the success of those around you. You bring structure and warmth in equal parts.",
    dimensionTexts: {
      energy: "You're balanced with a slight preference for quiet. You function fine in groups but need recovery time.",
      processing: "You think mostly deep, with focus on others' needs.",
      uncertainty: 'You seek structure — not for yourself, but to create a reliable environment for others.',
      social: "Service is your core. You're at your best when helping someone grow.",
      response: "You're deliberate and careful. You don't react impulsively, but with intention.",
    },
    strengths: ['Developing others', 'Team cohesion', 'Reliability', 'Empathic listening'],
    watchOuts: ['May neglect yourself', 'Difficulty voicing own needs', 'Risk of invisibility'],
    centroid: { energy: 40, processing: 35, uncertainty: 20, social: 80, response: 35 },
  },
  {
    id: 'practical-thinker',
    name: 'The Practical Thinker',
    coreSentence: 'You translate complex ideas into workable solutions.',
    description:
      "You have the analytical power of a thinker and the pragmatism of a doer. You dive deep enough to understand the problem, but not so deep that you lose sight of the solution. You're the hinge between theory and practice.",
    dimensionTexts: {
      energy: 'You lean slightly inward. You need thinking time, but not endlessly.',
      processing: "You combine depth with practical applicability. Knowledge without application doesn't interest you.",
      uncertainty: "You have a slight preference for structure, but you're pragmatic when the situation calls for it.",
      social: 'You operate mostly autonomously, but collaborate well when the project requires it.',
      response: "You're balanced — you think and act. The ratio depends on the situation.",
    },
    strengths: ['Translating theory to practice', 'Pragmatic problem-solving', 'Efficiency', 'Level-headedness'],
    watchOuts: [
      'Can be impatient with purely theoretical work',
      'Risk of oversimplifying too quickly',
      'May miss nuance',
    ],
    centroid: { energy: 35, processing: 25, uncertainty: 30, social: 30, response: 45 },
  },
  {
    id: 'observer',
    name: 'The Observer',
    coreSentence: "You see what others overlook, precisely because you don't join the noise.",
    description:
      'You stand a step behind the action and observe. Not from disinterest, but from a deep desire to understand. You see patterns, dynamics, and undertones that others miss. You share your insights selectively, but when you do, they hit the mark.',
    dimensionTexts: {
      energy: "You're strongly internal. The outside world is something to observe, not to get lost in.",
      processing: 'You take in broadly — you absorb a lot — but analyze deeply. A unique combination.',
      uncertainty: "You're comfortable with ambiguity. You don't need to know everything — you want to understand.",
      social: "You're a spectator with empathy. You understand people well, but don't actively seek contact.",
      response: "You're distinctly reflective. You rarely react impulsively.",
    },
    strengths: ['Observational power', 'Pattern recognition in group dynamics', 'Objectivity', 'Wisdom'],
    watchOuts: ['Can become too passive', 'Risk of detachment', 'Difficulty moving from observation to action'],
    centroid: { energy: 15, processing: 35, uncertainty: 45, social: 25, response: 15 },
  },
  {
    id: 'builder',
    name: 'The Builder',
    coreSentence: "You make things that didn't exist yesterday.",
    description:
      "You're a maker. You have a strong drive to create something concrete — a product, a system, a result. You combine analytical thinking with decisiveness and feel most satisfied when you've created something tangible.",
    dimensionTexts: {
      energy: "You're in the middle, with a slight preference for action over contemplation.",
      processing: 'You think mostly deep, but always aimed at application and results.',
      uncertainty: 'You like working with a plan and a clear goal. A defined endpoint gives you energy.',
      social: "You prefer working independently or in a small team. It's about the work, not the social context.",
      response: "You're relatively quick to act. Planning is fine, but building is better.",
    },
    strengths: ['Results orientation', 'Making things concrete', 'Independent delivery', 'Perseverance'],
    watchOuts: [
      'May underestimate the human side',
      "Difficulty letting go of 'your' project",
      'Can keep building when direction needs adjustment',
    ],
    centroid: { energy: 45, processing: 30, uncertainty: 25, social: 35, response: 60 },
  },
  {
    id: 'free-spirit',
    name: 'The Free Spirit',
    coreSentence: "You refuse to fit in a box — and that's your strength.",
    description:
      "You're allergic to convention and routine. You think differently than most people and that's not learned — it's who you are. You seek freedom above all else and find your own way, even when that way doesn't exist yet.",
    dimensionTexts: {
      energy: "You're mostly inward-oriented, but you actively seek new experiences.",
      processing: "You think broadly and associatively. You make connections that don't seem logical to others.",
      uncertainty: 'You fully embrace the unknown. Structure feels like a constraint.',
      social: "You're strongly autonomous. You value freedom over connection.",
      response: "You're relatively quick and spontaneous. You trust your intuition.",
    },
    strengths: ['Original thinking', 'Independence', 'Creative problem-solving', 'Adaptability'],
    watchOuts: [
      'Difficulty collaborating in structured environments',
      'Trouble with deadlines and commitments',
      'Can come across as rebellious',
    ],
    centroid: { energy: 35, processing: 55, uncertainty: 85, social: 25, response: 60 },
  },
  {
    id: 'energizer',
    name: 'The Energizer',
    coreSentence: 'Your energy is contagious — when you move, everything moves with you.',
    description:
      "You're a powerhouse. You have a natural ability to get others moving, not by pushing but by running so hard that others follow. Your energy is your greatest asset.",
    dimensionTexts: {
      energy: "You're strongly outward-oriented. Action, interaction, and results are your fuel.",
      processing: 'You think broadly and action-oriented. You find the core quickly and get to work.',
      uncertainty: "You're comfortable with uncertainty, as long as there's movement.",
      social: "You're social and engaged. You love working with others and pulling people along.",
      response:
        "You're quick and decisive. Your motto: better 80% right and in motion than 100% perfect and standing still.",
    },
    strengths: ['Activating others', 'Creating momentum', 'Positive energy', 'Results orientation'],
    watchOuts: ['Can be overwhelming for others', 'Risk of superficiality through speed', 'May not see burnout coming'],
    centroid: { energy: 80, processing: 60, uncertainty: 60, social: 65, response: 80 },
  },
  {
    id: 'thinker-doer',
    name: 'The Thinker-Doer',
    coreSentence: 'You combine analysis with action in a rhythm that fits you.',
    description:
      "You're remarkably balanced. You can think deeply and act quickly, collaborate and operate independently. You adapt effortlessly to what the situation demands without losing your core.",
    dimensionTexts: {
      energy: "You're balanced. Sometimes you need quiet, sometimes action — and you sense well what you need.",
      processing: 'You switch between deep and broad depending on context. Flexibility is your strength.',
      uncertainty: "You're equally comfortable with a plan as without one. You choose what works.",
      social: 'You can work both alone and in teams. You adapt without losing yourself.',
      response: "You're neither distinctly reflective nor reactive. Your timing is situational.",
    },
    strengths: ['Versatility', 'Situational leadership', 'Self-awareness', 'Flexibility'],
    watchOuts: [
      'May struggle with a clear identity',
      'Risk of over-adapting',
      'Can become indecisive without external pressure',
    ],
    centroid: { energy: 45, processing: 40, uncertainty: 50, social: 40, response: 50 },
  },
  {
    id: 'guardian',
    name: 'The Guardian',
    coreSentence: "You protect what's valuable — people, culture, quality.",
    description:
      "You're a keeper of values. You ensure the team functions, the culture stays healthy, and no one falls behind. You're not the fastest or the loudest, but you're the most consistent force in any environment.",
    dimensionTexts: {
      energy: "You're mostly inward-oriented, but your attention goes to the people around you.",
      processing: 'You think deep and careful, especially about human dynamics.',
      uncertainty: 'You like stability and predictability. Change is fine, but not too fast.',
      social: 'Connection is your first nature. You make sure everyone is seen.',
      response: "You're reflective and careful in your reactions. You don't say anything you don't mean.",
    },
    strengths: ['Protecting culture', 'Team wellbeing', 'Consistency', 'Moral compass'],
    watchOuts: ['May resist change', 'Difficulty with confrontation', 'Can be overprotective'],
    centroid: { energy: 30, processing: 30, uncertainty: 15, social: 80, response: 25 },
  },
  {
    id: 'entrepreneur',
    name: 'The Entrepreneur',
    coreSentence: 'You see opportunities everywhere and have the courage to seize them.',
    description:
      "You're driven by possibilities. You constantly scan your environment for opportunities, move fast, and aren't afraid to fail. You think broadly, act quickly, and learn by doing.",
    dimensionTexts: {
      energy: "You're clearly outward-oriented. The world is full of possibilities and you want to explore them all.",
      processing: 'You think broadly and pragmatically. You see the bigger picture and fill in details as you go.',
      uncertainty: "Risk isn't a problem — it's your natural habitat. You thrive in uncertainty.",
      social: "You're socially capable but not dependent. You build relationships that serve your goals.",
      response: "You're fast and decisive. Hesitation is wasted time.",
    },
    strengths: ['Spotting opportunities', 'Fast execution', 'Risk tolerance', 'Resourcefulness'],
    watchOuts: ['May start too many things at once', 'Difficulty completing', 'Can treat people as means to an end'],
    centroid: { energy: 70, processing: 65, uncertainty: 80, social: 50, response: 80 },
  },
  {
    id: 'perfectionist',
    name: 'The Perfectionist',
    coreSentence: "You don't accept half-baked solutions — and it shows in your work.",
    description:
      "Quality is your non-negotiable standard. You take the time to do things right, down to the details. You're critical, thorough, and reliable. What you deliver is solid.",
    dimensionTexts: {
      energy: "You're inward-oriented. You need focus and quiet to meet your standards.",
      processing: "You go distinctly deep. You don't stop until every detail is right.",
      uncertainty: 'You like control and predictability. Chaos is your enemy.',
      social:
        'You prefer working autonomously. Collaboration works, but the other person needs to share your standards.',
      response: "You're slow and deliberate. You don't rush — better right than fast.",
    },
    strengths: ['Eye for detail', 'Reliable quality', 'Thoroughness', 'High standards'],
    watchOuts: ['Can become paralyzing', "Difficulty with 'good enough'", 'Risk of micromanagement'],
    centroid: { energy: 25, processing: 15, uncertainty: 10, social: 30, response: 15 },
  },
  {
    id: 'connector',
    name: 'The Connector',
    coreSentence: 'You bring people together — and it always feels natural.',
    description:
      "Relationships are your superpower. You know everyone, connect everyone, and you do it effortlessly. You're warm, open, and genuinely interested in people.",
    dimensionTexts: {
      energy: "You're clearly outward-oriented. People give you energy.",
      processing: 'You think in a balanced way — broad and deep, always with a social lens.',
      uncertainty: "You're flexible and adapt. Whatever the situation demands, you find the right people.",
      social: "This is your core. Connection isn't what you do — it's who you are.",
      response: "You're relatively quick and spontaneous in your interactions. You sense what's needed.",
    },
    strengths: ['Networking', 'Relationship management', 'Bringing people together', 'Social intelligence'],
    watchOuts: [
      'May depend too much on social validation',
      'Risk of shallow relationships through volume',
      'Can forget own needs',
    ],
    centroid: { energy: 65, processing: 50, uncertainty: 50, social: 90, response: 55 },
  },
  {
    id: 'philosopher',
    name: 'The Philosopher',
    coreSentence: 'You ask the questions others forget to ask.',
    description:
      "You think about the why behind the what. You're not satisfied with surface-level answers and you have the courage to ask fundamental questions, even when it's uncomfortable. You seek meaning, not speed.",
    dimensionTexts: {
      energy: "You're strongly inward-oriented. Your richest conversations are with yourself.",
      processing: 'You think deep and fundamental. You seek the core of the core.',
      uncertainty: "You're comfortable with not-knowing. In fact, you see it as a starting point.",
      social: "You're selectively social. You seek depth in conversations, not volume.",
      response: "You're distinctly reflective. You take all the time you need.",
    },
    strengths: ['Fundamental thinking', 'Wisdom', 'Independent judgment', 'Creating meaning'],
    watchOuts: ['Can become too abstract', 'Difficulty taking action', 'May come across as inaccessible'],
    centroid: { energy: 15, processing: 15, uncertainty: 55, social: 30, response: 10 },
  },
  {
    id: 'pragmatist',
    name: 'The Pragmatist',
    coreSentence: 'You do what works — no fuss.',
    description:
      "Efficiency is your mantra. You have little patience for unnecessary complexity and always look for the shortest path to a good result. You're level-headed, results-oriented, and reliable.",
    dimensionTexts: {
      energy: "You're balanced. You adjust your energy level to what the situation demands.",
      processing: 'You think broadly enough to see options, but not broader than necessary.',
      uncertainty: "You prefer proven approaches, but aren't rigid if something else works better.",
      social: "You collaborate when you must, work alone when you can. It's about the result.",
      response: "You're relatively quick. You analyze just enough and then get to work.",
    },
    strengths: ['Efficiency', 'Level-headedness', 'Results orientation', 'No-nonsense approach'],
    watchOuts: [
      'May underestimate the human factor',
      'Risk of short-term thinking',
      'Can miss innovation by preferring the familiar',
    ],
    centroid: { energy: 50, processing: 55, uncertainty: 35, social: 45, response: 65 },
  },
  {
    id: 'creative-engine',
    name: 'The Creative Engine',
    coreSentence: 'You make things nobody expects — and they actually work.',
    description:
      "You combine creativity with execution. You don't just come up with original ideas, you make them real. You push the boundaries of what's possible.",
    dimensionTexts: {
      energy: "You're balanced, with peaks of energy when working on something creative.",
      processing: 'You switch between deep and broad. Creative thinking requires both.',
      uncertainty: 'You actively seek the unknown. Convention is a starting point to depart from.',
      social: 'You prefer working independently or in a small creative team.',
      response: "You're quick and experimental. You make prototypes, not plans.",
    },
    strengths: ['Realizing original ideas', 'Experimenting', 'Prototype thinking', 'Pushing boundaries'],
    watchOuts: [
      'May find conventional work boring',
      'Difficulty with maintenance and iteration',
      'Can skip others in the creative process',
    ],
    centroid: { energy: 50, processing: 45, uncertainty: 75, social: 40, response: 70 },
  },
  {
    id: 'anchor',
    name: 'The Anchor',
    coreSentence: 'In your presence, things become clear.',
    description:
      'You bring calm to chaos. Not by doing something, but by being there. You have a stabilizing effect on your surroundings and people seek you out when they need grounding.',
    dimensionTexts: {
      energy: "You're clearly inward-oriented. Your calm isn't passive — it's an active quality.",
      processing: 'You think deep and careful, without rush.',
      uncertainty: 'You seek stability and predictability. You offer others an anchor.',
      social: "You're available to others without losing yourself. People trust you.",
      response: "You're distinctly reflective. You survey the situation before responding.",
    },
    strengths: ['Calming presence', 'Reliability', 'Thoughtful responses', 'Emotional stability'],
    watchOuts: [
      'Can become too passive in crisis situations',
      'Risk of being underestimated',
      'May struggle with urgency',
    ],
    centroid: { energy: 20, processing: 30, uncertainty: 20, social: 60, response: 20 },
  },
  {
    id: 'competitor',
    name: 'The Competitor',
    coreSentence: 'You want to win — and you define what winning means.',
    description:
      "Performing is in your DNA. You constantly measure yourself against high standards and feel most alive when something is at stake. You're driven, focused, and willing to invest in results.",
    dimensionTexts: {
      energy: 'You lean slightly outward. Competition and challenge activate you.',
      processing: "You think in a balanced way, with focus on what's needed to perform.",
      uncertainty: "You're relatively comfortable with risk — it's part of the game.",
      social: "You're mostly autonomous. You value good competitors more than mediocre teammates.",
      response: "You're fast and decisive. Hesitating costs points.",
    },
    strengths: ['Drive', 'High standards', 'Performing under pressure', 'Self-discipline'],
    watchOuts: [
      'Can become too competitive in collaborations',
      'Risk of win-lose thinking',
      'May neglect rest and recovery',
    ],
    centroid: { energy: 65, processing: 50, uncertainty: 55, social: 35, response: 75 },
  },
  {
    id: 'intuitive-leader',
    name: 'The Intuitive Leader',
    coreSentence: 'You sense what a team needs, often before they know it themselves.',
    description:
      "You lead from feeling, not from a playbook. You have a sharp intuition for what's happening in a group and you use it to give direction. You're warm, courageous, and willing to speak uncomfortable truths.",
    dimensionTexts: {
      energy: 'You lean slightly outward, but your best insights come from moments of reflection.',
      processing: 'You combine analytical and intuitive thinking. You often feel what data later confirms.',
      uncertainty: "You're comfortable not knowing everything. You trust your gut as a compass.",
      social: "You're strongly connecting and naturally take the lead in groups.",
      response: 'You switch between reflective and quick, depending on what the moment demands.',
    },
    strengths: ['Intuitive leadership', 'Reading group dynamics', 'Courage to name things', 'Authentic leadership'],
    watchOuts: [
      'May rely too much on feeling',
      'Risk of subjective decisions',
      "Can be overwhelmed by others' emotions",
    ],
    centroid: { energy: 55, processing: 40, uncertainty: 60, social: 70, response: 55 },
  },
  {
    id: 'analytical-leader',
    name: 'The Analytical Leader',
    coreSentence: 'You lead with facts, logic, and a clear plan.',
    description:
      "You're the type of leader people trust when the situation is complex. You bring structure, evidence, and clarity. Your decisions are well-considered and you expect the same from others.",
    dimensionTexts: {
      energy: "You're balanced. You can present to groups and do focused solo work.",
      processing: 'You think deep and structured. You base decisions on data and analysis.',
      uncertainty: 'You like control and a clear plan. You minimize risk through information.',
      social: "You're connecting but professional. You lead with respect, not warmth.",
      response: "You're deliberate and methodical. You don't make hasty decisions.",
    },
    strengths: ['Data-driven decision making', 'Bringing structure', 'Credibility', 'Reducing complexity'],
    watchOuts: [
      'Can come across as rigid',
      'Difficulty with emotional arguments',
      'May analyze too long before deciding',
    ],
    centroid: { energy: 50, processing: 25, uncertainty: 25, social: 65, response: 35 },
  },
  {
    id: 'enthusiast',
    name: 'The Enthusiast',
    coreSentence: 'Your enthusiasm is your greatest gift — it changes the energy in every room.',
    description:
      "You're an energy bomb in the most positive sense. You get excited about ideas, people, and possibilities, and that excitement is infectious. You think fast, broad, and optimistically.",
    dimensionTexts: {
      energy: "You're distinctly outward-oriented. Interaction, action, and new stimuli give you wings.",
      processing: 'You think broadly and associatively. You make quick connections and see possibilities everywhere.',
      uncertainty: 'You embrace the unknown with open arms. Every change is an opportunity.',
      social: "You're strongly socially oriented. You draw energy from people and give it back.",
      response: "You're fast and spontaneous. You jump in and see where the ship lands.",
    },
    strengths: ['Generating enthusiasm', 'Spreading positive energy', 'Quick connections', 'Optimism'],
    watchOuts: [
      'Can come across as superficial',
      'Difficulty persisting when things get hard',
      'Can be overwhelming for introverted types',
    ],
    centroid: { energy: 85, processing: 70, uncertainty: 70, social: 80, response: 80 },
  },
  {
    id: 'sentinel',
    name: 'The Sentinel',
    coreSentence: 'You protect the standards and processes others take for granted.',
    description:
      "You're the one who makes sure the basics are in order. While others innovate and experiment, you guard quality, rules, and continuity. It's not glamorous but it's essential.",
    dimensionTexts: {
      energy: "You're inward-oriented and thrive on calm and routine.",
      processing: 'You think deep and detailed. You catch errors others miss.',
      uncertainty: 'You strongly prefer structure and predictability. Change is a risk to be managed.',
      social: "You're socially balanced — you collaborate but don't seek the spotlight.",
      response: "You're reflective and careful. You don't rush.",
    },
    strengths: ['Quality assurance', 'Eye for detail', 'Consistency', 'Risk awareness'],
    watchOuts: ['May block change', 'Risk of bureaucratic thinking', 'Can be perceived as a brake'],
    centroid: { energy: 25, processing: 20, uncertainty: 10, social: 45, response: 20 },
  },
  {
    id: 'solo-artist',
    name: 'The Solo Artist',
    coreSentence: 'You do your best work in complete freedom and silence.',
    description:
      "You're at your very best when nobody disturbs you. You need space — mental and physical — to create, think, and build. Your work is deep, original, and personal.",
    dimensionTexts: {
      energy: "You're distinctly inward-oriented. Being alone isn't punishment but a prerequisite.",
      processing: 'You think deep and personal. You follow your own path, not the beaten one.',
      uncertainty: "You're surprisingly open to the unknown, as long as you can navigate it yourself.",
      social: "You're strongly autonomous. Collaboration works, but preferably at a distance.",
      response: "You're mostly reflective, but can act quickly when inspiration strikes.",
    },
    strengths: ['Deep creative work', 'Originality', 'Independence', 'Focus'],
    watchOuts: ['Risk of isolation', 'Difficulty with teamwork and compromise', 'May struggle to share work'],
    centroid: { energy: 10, processing: 20, uncertainty: 65, social: 10, response: 35 },
  },
  {
    id: 'team-captain',
    name: 'The Team Captain',
    coreSentence: 'You bring out the best in every player and put the team on the path to victory.',
    description:
      "You're a born leader who leads from involvement. You know your team members, understand what they need, and make sure everyone is in the right position.",
    dimensionTexts: {
      energy: "You're outward-oriented. Interaction with your team gives you energy.",
      processing: 'You think in a balanced way — deep enough for strategy, broad enough for overview.',
      uncertainty: "You slightly prefer structure, but you're flexible when the team needs it.",
      social: 'People are your top priority. You lead by serving.',
      response: "You're quick with daily decisions, deliberate with big choices.",
    },
    strengths: ['Team building', 'Putting people in the right place', 'Motivating', 'Building loyalty'],
    watchOuts: [
      'Can be too loyal to underperformers',
      'Difficulty with unpopular decisions',
      'May neglect own development',
    ],
    centroid: { energy: 65, processing: 45, uncertainty: 40, social: 80, response: 60 },
  },
  {
    id: 'systems-thinker',
    name: 'The Systems Thinker',
    coreSentence: 'You see the connections that hold the system together — and the weak links.',
    description:
      "You think in systems, loops, and dependencies. Where others see isolated problems, you see a coherent whole. You're fascinated by complexity and have the patience to unravel it.",
    dimensionTexts: {
      energy: "You're mostly inward-oriented. Systems thinking requires concentration and quiet.",
      processing: 'You go deep, but with a unique ability to simultaneously see the whole.',
      uncertainty: "You're comfortable with complexity and ambiguity. Not everything needs to be simple.",
      social: 'You prefer working alone or in small groups with other analytical thinkers.',
      response: "You're reflective and patient. You don't rush complex analysis.",
    },
    strengths: [
      'Understanding complex problems',
      'Foreseeing unintended consequences',
      'Holistic analysis',
      'Recognizing patterns in chaos',
    ],
    watchOuts: [
      'Can overthink simple problems',
      'Difficulty with pragmatic concessions',
      'Can be hard to explain to others',
    ],
    centroid: { energy: 30, processing: 15, uncertainty: 40, social: 35, response: 25 },
  },
  {
    id: 'social-dynamo',
    name: 'The Social Dynamo',
    coreSentence: "You're the hub that connects everyone to everyone.",
    description:
      "You're social, energetic, and always in motion. You know everyone, remember details, and bring people together effortlessly. Your network isn't shallow — you genuinely invest in people.",
    dimensionTexts: {
      energy: "You're strongly outward-oriented. People and interaction are your fuel.",
      processing: 'You think broadly, with a social lens. You see who can do what and who fits with whom.',
      uncertainty: "You're comfortable with change and uncertainty, as long as you're in motion.",
      social: 'This is your core. You live for connection and relationships.',
      response: "You're relatively quick and spontaneous. You seize opportunities as they arise.",
    },
    strengths: ['Networking with depth', 'Social energy', 'Connecting people', 'Community building'],
    watchOuts: [
      'Can get drained by too many social obligations',
      "Risk of losing yourself in others' needs",
      'May struggle with solitude',
    ],
    centroid: { energy: 80, processing: 55, uncertainty: 55, social: 85, response: 65 },
  },
  {
    id: 'ideator',
    name: 'The Ideator',
    coreSentence: 'Your head is full of ideas — more than you could ever execute.',
    description:
      "You're an idea generator. Your brain constantly makes connections, sees possibilities, and produces concepts. Not everything is practical, but there's always something brilliant in the mix.",
    dimensionTexts: {
      energy: "You're inward-oriented. Your best ideas come in silence.",
      processing: 'You think mostly deep, but with creative leaps that feel broad.',
      uncertainty: "You're very open to the unknown. Uncertainty is a source of inspiration.",
      social: "You're mostly autonomous. You share ideas selectively.",
      response: "You're reflective — you conceive more than you execute.",
    },
    strengths: ['Idea generation', 'Creative thinking', 'Conceptual ability', 'Visionary'],
    watchOuts: [
      'Difficulty with execution',
      'Too many ideas, too little focus',
      "Can get frustrated when ideas aren't picked up",
    ],
    centroid: { energy: 25, processing: 30, uncertainty: 70, social: 25, response: 30 },
  },
  {
    id: 'anchor-point',
    name: 'The Anchor Point',
    coreSentence: 'In uncertain times, people seek you out — and rightly so.',
    description:
      "You're the calm center in the storm. You offer stability, reliability, and a fixed point others can orient themselves by. You combine emotional stability with care.",
    dimensionTexts: {
      energy: "You lean slightly inward, but you're always available for others when they need you.",
      processing: 'You think in a balanced way — not the deepest thinker, but the most consistent.',
      uncertainty: 'You strongly prefer stability. You create predictability for yourself and others.',
      social: "You're strongly connecting. People trust you because of your consistency.",
      response: "You're reflective and calm. Your deliberate responses give others confidence.",
    },
    strengths: ['Emotional stability', 'Reliability', 'Inspiring trust', 'Crisis calm'],
    watchOuts: ['May hold on too tightly to the familiar', 'Difficulty with major changes', 'Can hide own turmoil'],
    centroid: { energy: 35, processing: 35, uncertainty: 15, social: 70, response: 25 },
  },
  {
    id: 'challenger',
    name: 'The Challenger',
    coreSentence: 'You question the status quo — not to provoke, but to improve.',
    description:
      "You're a constructive contrarian. You don't just accept how things are and you have the courage to say so. You seek improvement, not conflict, but you don't shy away from confrontation when needed.",
    dimensionTexts: {
      energy: 'You lean slightly outward. Discussion and debate activate you.',
      processing: 'You think mostly deep, with focus on what can be better.',
      uncertainty: "You're comfortable with change and uncertainty. The current situation is never sacred.",
      social: "You operate relatively autonomously. You don't need consensus — truth over harmony.",
      response: "You're relatively quick in your reactions. You speak what you see.",
    },
    strengths: ['Critical thinking', 'Constructive confrontation', 'Driving improvement', 'Courage'],
    watchOuts: ['Can be perceived as negative', 'Risk of unnecessary conflicts', 'May complicate collaboration'],
    centroid: { energy: 55, processing: 35, uncertainty: 65, social: 40, response: 70 },
  },
  {
    id: 'balancer',
    name: 'The Balancer',
    coreSentence: 'You balance opposing forces with an ease that surprises others.',
    description:
      "You're remarkably balanced across all dimensions. You adapt effortlessly, switch between roles, and sense what each situation demands. You're the chameleon who never loses their core.",
    dimensionTexts: {
      energy: "You're balanced. You need both quiet and action, and you sense well which one.",
      processing: 'You switch effortlessly between deep and broad thinking.',
      uncertainty: "You're equally comfortable with structure as with improvisation.",
      social: "You lean slightly social, but you're fine alone. You choose consciously.",
      response: 'Your timing is situational — sometimes quick, sometimes deliberate.',
    },
    strengths: ['Adaptability', 'Situational awareness', 'Versatility', 'De-escalating conflicts'],
    watchOuts: ['May struggle with a clear profile', 'Risk of over-adapting', 'Can become indecisive'],
    centroid: { energy: 45, processing: 45, uncertainty: 45, social: 55, response: 45 },
  },
  {
    id: 'persistent-one',
    name: 'The Persistent One',
    coreSentence: 'When others stop, you keep going — not from stubbornness but from conviction.',
    description:
      "You're tough. Not in a spectacular way, but in the way that matters most: you don't give up. You combine perseverance with a level-headed understanding of what's needed.",
    dimensionTexts: {
      energy: 'You lean slightly inward, with a steady, tireless energy.',
      processing: 'You think deep enough to understand your goal, and pragmatic enough to work toward it.',
      uncertainty: 'You seek structure and clear goals. That gives you the direction to persist.',
      social: "You're balanced — you collaborate when it helps, work alone when you must.",
      response: 'You lean slightly reactive. You think, but you also act — consistently and persistently.',
    },
    strengths: ['Perseverance', 'Reliability', 'Discipline', 'Goal orientation'],
    watchOuts: ['Can keep going on a dead-end path', 'Difficulty letting go', 'May confuse rigidity with strength'],
    centroid: { energy: 40, processing: 30, uncertainty: 20, social: 40, response: 55 },
  },
  {
    id: 'discoverer',
    name: 'The Discoverer',
    coreSentence: 'You live to learn — and every day is a new opportunity.',
    description:
      "Curiosity in the broadest sense. You want to know everything, try everything, and go everywhere. You're not a specialist but a voracious consumer of knowledge and experiences.",
    dimensionTexts: {
      energy: 'You lean slightly outward. New experiences pull you into the world.',
      processing: 'You think broadly and exploratively. You pick things up quickly without fully exhausting them.',
      uncertainty: 'You enthusiastically embrace the unknown. Routine is your nemesis.',
      social: "You're balanced — you explore both alone and with others.",
      response: "You're relatively quick. Curiosity doesn't wait for a plan.",
    },
    strengths: ['Love of learning', 'Broad knowledge', 'Enthusiasm for the new', 'Flexibility'],
    watchOuts: ['Difficulty with depth', 'Can jump from topic to topic', 'Risk of not finishing'],
    centroid: { energy: 55, processing: 60, uncertainty: 80, social: 50, response: 65 },
  },
  {
    id: 'contemplator',
    name: 'The Contemplator',
    coreSentence:
      'You fully understand situations before saying anything about them — and that makes your contribution valuable.',
    description:
      "You observe, process, and understand — in that order. You're not slow but thorough. You take in the world with a combination of empathy and analysis that is rare.",
    dimensionTexts: {
      energy: "You're clearly inward-oriented. You process the world from the inside out.",
      processing: 'You think deep, with attention to both facts and feelings.',
      uncertainty: "You're neutral toward uncertainty. You observe without judgment.",
      social: "You're warmer than you appear. You understand people well, you just don't always seek them out.",
      response: "You're distinctly reflective. Your contributions are rare but always on point.",
    },
    strengths: ['Deep observation', 'Empathic analysis', 'Wise contributions', 'Patience'],
    watchOuts: [
      'May observe too long without contributing',
      'Sometimes gets underestimated',
      'Can come across as passive',
    ],
    centroid: { energy: 20, processing: 25, uncertainty: 50, social: 45, response: 15 },
  },
  {
    id: 'strategy-executor',
    name: 'The Strategy Executor',
    coreSentence: 'You design the plan and execute it — often in one fluid motion.',
    description:
      "You're rare in that you can both think strategically and execute operationally. You make plans that work because you test them yourself. You're pragmatic, results-oriented, and reliable.",
    dimensionTexts: {
      energy: "You're balanced. Thinking and execution alternate naturally.",
      processing: 'You think deep enough for strategy, but always with an eye on feasibility.',
      uncertainty: "You slightly prefer structure, but you're flexible in execution.",
      social: "You work both alone and in teams. You adjust your role to what's needed.",
      response: "You're balanced — you think and do in equal measure.",
    },
    strengths: ['Bringing strategy to execution', 'Pragmatism', 'Self-reliance', 'Reliable delivery'],
    watchOuts: ['May struggle with purely strategic work', 'Risk of doing too much yourself', 'Difficulty delegating'],
    centroid: { energy: 50, processing: 30, uncertainty: 35, social: 45, response: 50 },
  },
  {
    id: 'visionary',
    name: 'The Visionary',
    coreSentence: "You see a future that others can't yet imagine — and you point the way.",
    description:
      "You think in possibilities, not limitations. You have a strong sense of where things are headed and the ability to convey that vision to others. You're not necessarily the executor, but without your direction, nobody moves.",
    dimensionTexts: {
      energy: 'You lean slightly inward. Your vision emerges in quiet, but you share it eagerly.',
      processing: 'You think deep and future-oriented. You see connections and possibilities on a long time horizon.',
      uncertainty:
        "You're very comfortable with the unknown. The future is uncertain and that's exactly what fascinates you.",
      social: "You're socially engaged. You want to share your vision and bring others along.",
      response: "You're mostly reflective. You take time to form your vision before sharing it.",
    },
    strengths: ['Future vision', 'Inspiring others', 'Seeing the big picture', 'Possibility thinking'],
    watchOuts: [
      'Can get too far ahead of the troops',
      'Difficulty with execution details',
      "Can get frustrated when others don't see the vision",
    ],
    centroid: { energy: 45, processing: 35, uncertainty: 75, social: 55, response: 40 },
  },
];
