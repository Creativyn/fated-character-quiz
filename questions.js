import { PERSONALITIES } from "./config.js";

/**
 * Helper to map personality ID to ensure consistency
 */
const P = (id) => id;

/**
 * 15 questions, each with 10 answers.
 * Each answer maps to a personality id.
 *
 * Structure:
 * {
 *   id: "q1",
 *   text: "Question text",
 *   answers: [
 *     { text: "Answer text", value: "leader" }
 *   ]
 * }
 */

export const QUESTIONS = [
  {
    id: "q1",
    text: "What would you rather do in your spare time?",
    answers: [
      {
        text: "Bake all kinds of delicious sweets",
        value: P("luv"),
      },
      { text: "Sing inspirational songs", value: P("faeth") },
      { text: "Read voraciously", value: P("fait") },
      {
        text: "Hang out with my friends doing fun things",
        value: P("justene"),
      },
      { text: "Spend time with my special person", value: P("manus") },
      { text: "Workout", value: P("hoep") },
      { text: "Volunteer work", value: P("endeavor") },
      {
        text: "Tally up doos",
        value: P("rip"),
      },
      {
        text: "Relax with family and friends",
        value: P("prometheia"),
      },
      {
        text: "Dance under the moonlight",
        value: P("amandas"),
      },
    ],
  },

  {
    id: "q2",
    text: "Out of the choices below which job would you prefer?",
    answers: [
      { text: "Healer or apothecary", value: P("endeavor") },
      { text: "CEO", value: P("fait") },
      { text: "Guidance counselor", value: P("luv") },
      { text: "Broker", value: P("rip") },
      { text: "Influencer", value: P("justene") },
      { text: "Farmer", value: P("manus") },
      { text: "Home business owner", value: P("amandas") },
      { text: "Fitness instructor", value: P("hoep") },
      { text: "Spiritual healer", value: P("faeth") },
      { text: "Advocate", value: P("prometheia") },
    ],
  },

  {
    id: "q3",
    text: "How would you approach a problem facing your community?",
    answers: [
      { text: "Arrange a meeting of citizens", value: P("endeavor") },
      { text: "Work out a crafty go around", value: P("prometheia") },
      { text: "Sleep on it", value: P("manus") },
      { text: "Stay out of it", value: P("amandas") },
      { text: "Rail against it", value: P("justene") },
      { text: "Use it in my favor and profit from it", value: P("rip") },
      {
        text: "Sing and pray",
        value: P("faeth"),
      },
      { text: "Take it by the throat and beat it", value: P("hoep") },
      { text: "Trust in Eternity and leave it to love", value: P("luv") },
      { text: "Keep it under control with a firm grip", value: P("fait") },
    ],
  },

  {
    id: "q4",
    text: "Which of these words best defines you?",
    answers: [
      { text: "Loving", value: P("luv") },
      { text: "Mystical", value: P("faeth") },
      { text: "Loyal", value: P("manus") },
      { text: "Strong", value: P("hoep") },
      { text: "Supportive", value: P("endeavor") },
      { text: "Passionate", value: P("justene") },
      { text: "Foxy", value: P("prometheia") },
      { text: "Enigmatic", value: P("fait") },
      { text: "Conniving", value: P("rip") },
      { text: "Otherworldly", value: P("amandas") },
    ],
  },

  {
    id: "q5",
    text: "Which coffee best describes you overall?",
    answers: [
      { text: "Dark and bold macchiato", value: P("fait") },
      { text: "Caramel latte", value: P("faeth") },
      { text: "Sweet with tons of whip", value: P("luv") },
      { text: "Spicy with a sprinkling of cinnamon", value: P("prometheia") },
      { text: "Espresso", value: P("hoep") },
      { text: "Yesterday's bitter brew", value: P("rip") },
      { text: "Floral and aromatic", value: P("amandas") },
      { text: "Earthy", value: P("manus") },
      { text: "Gingerbread", value: P("justene") },
      { text: "Mellow", value: P("endeavor") },
    ],
  },

  {
    id: "q6",
    text: "What colors would you prefer to wear of the following choices?",
    answers: [
      { text: "Dreamy colors or any shade of green", value: P("prometheia") },
      { text: "Silvers and whites", value: P("faeth") },
      { text: "Dark umber", value: P("rip") },
      { text: "Misty but sparkling", value: P("amandas") },
      { text: "Neon pink", value: P("justene") },
      { text: "Earthen tones", value: P("manus") },
      { text: "Reds and soft pinks", value: P("luv") },
      { text: "Grays and blacks", value: P("fait") },
      { text: "Blues", value: P("endeavor") },
      { text: "Purples", value: P("hoep") },
    ],
  },

  {
    id: "q7",
    text: "In a novel, which type of character do you relate to the most?",
    answers: [
      { text: "Someone eye-catching and popular", value: P("justene") },
      { text: "The upright role model", value: P("endeavor") },
      { text: "A free-spirited, champion defender", value: P("prometheia") },
      { text: "The Everyman", value: P("manus") },
      { text: "The maternal type", value: P("luv") },
      { text: "The devoted, self-sacrificing lover", value: P("amandas") },
      { text: "The misunderstood hero", value: P("fait") },
      { text: "A fearless warrior", value: P("hoep") },
      { text: "One who inspires others", value: P("faeth") },
      { text: "The conspiratorial villain", value: P("rip") },
    ],
  },

  {
    id: "q8",
    text: "Who would you be at a party?",
    answers: [
      { text: "The Center of Attention", value: P("justene") },
      { text: "Hostess/Host", value: P("fait") },
      { text: "The Wallflower", value: P("amandas") },
      { text: "The Nuisance", value: P("rip") },
      { text: "The Follower", value: P("manus") },
      { text: "The Singer", value: P("faeth") },
      { text: "The Listener", value: P("luv") },
      { text: "The Organizer and Game Planner", value: P("endeavor") },
      { text: "The Belle/Beau of the Ball", value: P("prometheia") },
      { text: "The Designated Driver", value: P("hoep") },
    ],
  },

  {
    id: "q9",
    text: "Your reading choices lean towards...",
    answers: [
      { text: "The eclectic and varied", value: P("fait") },
      { text: "Cozy romance novels", value: P("luv") },
      { text: "Romantasy", value: P("prometheia") },
      { text: "Fitness books", value: P("hoep") },
      { text: "Homesteading manuals", value: P("manus") },
      { text: "Home and garden", value: P("amandas") },
      { text: "Get rich quick schemes", value: P("rip") },
      { text: "Inspirational", value: P("faeth") },
      { text: "Guidance counseling", value: P("endeavor") },
      { text: "Whatever is trending", value: P("justene") },
    ],
  },

  {
    id: "q10",
    text: "What is the most important to you?",
    answers: [
      { text: "True love", value: P("manus") },
      { text: "Free choice", value: P("prometheia") },
      { text: "Protecting those I love", value: P("fait") },
      { text: "Universal love", value: P("luv") },
      { text: "Devotion to my partner", value: P("amandas") },
      { text: "Remaining strong for those who depend on me", value: P("hoep") },
      { text: "Power and gain", value: P("rip") },
      { text: "Community", value: P("endeavor") },
      { text: "Standing by the suffering", value: P("faeth") },
      { text: "Discovering my true self", value: P("justene") },
    ],
  },

  {
    id: "q11",
    text: "How do you react to someone you are attracted to?",
    answers: [
      {
        text: "I don't waste any time in approaching them directly",
        value: P("manus"),
      },
      {
        text: "Flirtatious repartee then challenge and retreat",
        value: P("prometheia"),
      },
      {
        text: "Standoffish at first, then employ charming banter",
        value: P("fait"),
      },
      {
        text: "Overwhelmed at first, then I regroup and encourage",
        value: P("justene"),
      },
      {
        text: "Lightly flirty, but I let the other lead",
        value: P("faeth"),
      },
      { text: "Warm and welcoming", value: P("luv") },
      { text: "Talk and get to know them", value: P("hoep") },
      { text: "I become inane", value: P("endeavor") },
      { text: "Drool and lear", value: P("rip") },
      { text: "Reticent and shyly encouraging", value: P("amandas") },
    ],
  },

  {
    id: "q12",
    text: "Which of these would be your most ideal home environment?",
    answers: [
      { text: "Wherever my lover wants to live", value: P("amandas") },
      { text: "Farmhouse with lots of acreage", value: P("manus") },
      { text: "Mountains and creek-cut canyons", value: P("fait") },
      { text: "A cozy cottage at the edge of the woods", value: P("luv") },
      {
        text: "House in town near everything that's happening",
        value: P("justene"),
      },
      { text: "Overgrown shack in the brambles", value: P("rip") },
      {
        text: "Simple home and garden near the community center",
        value: P("endeavor"),
      },
      {
        text: "A fortress with lush gardens and expansive verandas",
        value: P("hoep"),
      },
      {
        text: "Anywhere high or low as long as my family is there",
        value: P("faeth"),
      },
      {
        text: "A family home surrounded by woodlands, creeks, and meadows",
        value: P("prometheia"),
      },
    ],
  },

  {
    id: "q13",
    text: "People might label you as",
    answers: [
      { text: "The clever one", value: P("prometheia") },
      { text: "The mysterious one", value: P("fait") },
      { text: "The sweet one", value: P("luv") },
      { text: "The innocent one", value: P("faeth") },
      { text: "The strong one", value: P("hoep") },
      { text: "The loyal one", value: P("manus") },
      { text: "The devoted one", value: P("amandas") },
      { text: "The generous one", value: P("endeavor") },
      { text: "The audacious one", value: P("justene") },
      { text: "The manipulative one", value: P("rip") },
    ],
  },

  {
    id: "q14",
    text: "What do people most often come to you for?",
    answers: [
      {
        text: "A shoulder to cry on and genuine emotional support",
        value: P("luv"),
      },
      { text: "Creative solutions", value: P("prometheia") },
      { text: "Problem resolution and burden removal", value: P("fait") },
      { text: "Fun adventures", value: P("prometheia") },
      { text: "Healing and strength", value: P("hoep") },
      { text: "Quick avenues to their dreams", value: P("rip") },
      { text: "Spiritual support", value: P("faeth") },
      { text: "Loyal friendship", value: P("manus") },
      { text: "People don't come to me", value: P("amandas") },
      { text: "Community projects", value: P("endeavor") },
    ],
  },

  {
    id: "q15",
    text: "Pick the vacation that sounds the best to you.",
    answers: [
      {
        text: "Taking my beloved away to an enchanted retreat",
        value: P("fait"),
      },
      {
        text: "Anything my love chooses will make me happy",
        value: P("amandas"),
      },
      {
        text: "Going somewhere fun with lots of activities",
        value: P("justene"),
      },
      {
        text: "Who as time for vacations? Too many deals going forward.",
        value: P("rip"),
      },
      {
        text: "Going horseback riding, picnicking, and spending time in my lover's arms",
        value: P("prometheia"),
      },
      {
        text: "I would rather just stay at home and kick back",
        value: P("manus"),
      },
      { text: "Trekking through the mountains or cycling", value: P("hoep") },
      { text: "Anywhere cozy with friends and family", value: P("luv") },
      {
        text: "Attending workshops and community events",
        value: P("endeavor"),
      },
      {
        text: "Strolling in moonlit gardens anywhere while hand-in-hand with my lover",
        value: P("faeth"),
      },
    ],
  },

  {
    id: "q16",
    text: "Choose the words that best describe your most prominent character qualities.",
    answers: [
      {
        text: "Loyal, caring, and supportive",
        value: P("manus"),
      },
      {
        text: "Creative, spirited, and kindly",
        value: P("prometheia"),
      },
      {
        text: "Enigmatic, responsible, and charming",
        value: P("fait"),
      },
      {
        text: "Loving, sweet, and highly empathetic",
        value: P("luv"),
      },
      {
        text: "Sensitive, sympathetic, and mystical",
        value: P("faeth"),
      },
      {
        text: "Strong, robust, and resilient",
        value: P("hoep"),
      },
      { text: "Devious, unscrupulous, and petty", value: P("rip") },
      { text: "Fun-loving, mouthy, and high-spirited", value: P("justene") },
      {
        text: "Enterprising, compassionate, and generous",
        value: P("endeavor"),
      },
      {
        text: "Devoted, ethereal, and giving",
        value: P("amandas"),
      },
    ],
  },
];
