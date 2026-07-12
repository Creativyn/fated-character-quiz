/**
 * Helper to map personality ID to ensure consistency
 */

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
        value: "luv",
      },
      { text: "Sing inspirational songs", value: "faeth" },
      { text: "Read voraciously", value: "fait" },
      {
        text: "Hang out with my friends doing fun things",
        value: "justene",
      },
      { text: "Spend time with my special person", value: "manus" },
      { text: "Workout", value: "hoep" },
      { text: "Volunteer work", value: "endeavor" },
      {
        text: "Tally up doos",
        value: "rip",
      },
      {
        text: "Relax with family and friends",
        value: "prometheia",
      },
      {
        text: "Dance under the moonlight",
        value: "amandas",
      },
    ],
  },

  {
    id: "q2",
    text: "Out of the choices below which job would you prefer?",
    answers: [
      { text: "Healer or apothecary", value: "endeavor" },
      { text: "CEO", value: "fait" },
      { text: "Guidance counselor", value: "luv" },
      { text: "Broker", value: "rip" },
      { text: "Influencer", value: "justene" },
      { text: "Farmer", value: "manus" },
      { text: "Home business owner", value: "amandas" },
      { text: "Fitness instructor", value: "hoep" },
      { text: "Spiritual healer", value: "faeth" },
      { text: "Advocate", value: "prometheia" },
    ],
  },

  {
    id: "q3",
    text: "How would you approach a problem facing your community?",
    answers: [
      { text: "Arrange a meeting of citizens", value: "endeavor" },
      { text: "Work out a crafty go around", value: "prometheia" },
      { text: "Sleep on it", value: "manus" },
      { text: "Stay out of it", value: "amandas" },
      { text: "Rail against it", value: "justene" },
      { text: "Use it in my favor and profit from it", value: "rip" },
      {
        text: "Sing and pray",
        value: "faeth",
      },
      { text: "Take it by the throat and beat it", value: "hoep" },
      { text: "Trust in Eternity and leave it to love", value: "luv" },
      { text: "Keep it under control with a firm grip", value: "fait" },
    ],
  },

  {
    id: "q4",
    text: "Which of these words best defines you?",
    answers: [
      { text: "Loving", value: "luv" },
      { text: "Mystical", value: "faeth" },
      { text: "Loyal", value: "manus" },
      { text: "Strong", value: "hoep" },
      { text: "Supportive", value: "endeavor" },
      { text: "Passionate", value: "justene" },
      { text: "Foxy", value: "prometheia" },
      { text: "Enigmatic", value: "fait" },
      { text: "Conniving", value: "rip" },
      { text: "Otherworldly", value: "amandas" },
    ],
  },

  {
    id: "q5",
    text: "Which coffee best describes you overall?",
    answers: [
      { text: "Dark and bold macchiato", value: "fait" },
      { text: "Caramel latte", value: "faeth" },
      { text: "Sweet with tons of whip", value: "luv" },
      { text: "Spicy with a sprinkling of cinnamon", value: "prometheia" },
      { text: "Espresso", value: "hoep" },
      { text: "Yesterday's bitter brew", value: "rip" },
      { text: "Floral and aromatic", value: "amandas" },
      { text: "Earthy", value: "manus" },
      { text: "Gingerbread", value: "justene" },
      { text: "Mellow", value: "endeavor" },
    ],
  },

  {
    id: "q6",
    text: "What colors would you prefer to wear of the following choices?",
    answers: [
      { text: "Dreamy colors or any shade of green", value: "prometheia" },
      { text: "Silvers and whites", value: "faeth" },
      { text: "Dark umber and mustard", value: "rip" },
      { text: "Misty but sparkling and lavender", value: "amandas" },
      { text: "Neon pink", value: "justene" },
      { text: "Earthen tones", value: "manus" },
      { text: "Reds and soft pinks", value: "luv" },
      { text: "Storm grays", value: "fait" },
      { text: "Yellow", value: "endeavor" },
      { text: "Royal purple and dark, rich colors", value: "hoep" },
    ],
  },

  {
    id: "q7",
    text: "In a novel, which type of character do you relate to the most?",
    answers: [
      { text: "Someone eye-catching and popular", value: "justene" },
      { text: "The upright role model", value: "endeavor" },
      { text: "A free-spirited, champion defender", value: "prometheia" },
      { text: "The Everyman", value: "manus" },
      { text: "The maternal type", value: "luv" },
      { text: "The devoted, self-sacrificing lover", value: "amandas" },
      { text: "The misunderstood hero", value: "fait" },
      { text: "A fearless warrior", value: "hoep" },
      { text: "One who inspires others", value: "faeth" },
      { text: "The conspiratorial villain", value: "rip" },
    ],
  },

  {
    id: "q8",
    text: "Who would you be at a party?",
    answers: [
      { text: "The Center of Attention", value: "justene" },
      { text: "Hostess/Host", value: "fait" },
      { text: "The Wallflower", value: "amandas" },
      { text: "The Nuisance", value: "rip" },
      { text: "The Follower", value: "manus" },
      { text: "The Singer", value: "faeth" },
      { text: "The Listener", value: "luv" },
      { text: "The Organizer and Game Planner", value: "endeavor" },
      { text: "The Belle/Beau of the Ball", value: "prometheia" },
      { text: "The Designated Driver", value: "hoep" },
    ],
  },

  {
    id: "q9",
    text: "Your reading choices lean towards...",
    answers: [
      { text: "The eclectic and varied", value: "fait" },
      { text: "Cozy romance novels", value: "luv" },
      { text: "Romantasy", value: "prometheia" },
      { text: "Fitness books", value: "hoep" },
      { text: "Homesteading manuals", value: "manus" },
      { text: "Home and garden", value: "amandas" },
      { text: "Get rich quick schemes", value: "rip" },
      { text: "Inspirational", value: "faeth" },
      { text: "Guidance counseling", value: "endeavor" },
      { text: "Whatever is trending", value: "justene" },
    ],
  },

  {
    id: "q10",
    text: "What is the most important to you?",
    answers: [
      { text: "True love", value: "manus" },
      { text: "Free choice", value: "prometheia" },
      { text: "Protecting those I love", value: "fait" },
      { text: "Universal love", value: "luv" },
      { text: "Devotion to my partner", value: "amandas" },
      { text: "Remaining strong for those who depend on me", value: "hoep" },
      { text: "Power and gain", value: "rip" },
      { text: "Community", value: "endeavor" },
      { text: "Standing by the suffering", value: "faeth" },
      { text: "Discovering my true self", value: "justene" },
    ],
  },

  {
    id: "q11",
    text: "How do you react to someone you are attracted to?",
    answers: [
      {
        text: "I don't waste any time in approaching them directly",
        value: "manus",
      },
      {
        text: "Flirtatious repartee then challenge and retreat",
        value: "prometheia",
      },
      {
        text: "Standoffish at first, then employ charming banter",
        value: "fait",
      },
      {
        text: "Overwhelmed at first, then I regroup and encourage",
        value: "justene",
      },
      {
        text: "Lightly flirty, but I let the other lead",
        value: "faeth",
      },
      { text: "Warm and welcoming", value: "luv" },
      { text: "Talk and get to know them", value: "hoep" },
      { text: "I become inane", value: "endeavor" },
      { text: "Drool and leer", value: "rip" },
      { text: "Reticent and shyly encouraging", value: "amandas" },
    ],
  },

  {
    id: "q12",
    text: "Which of these would be your most ideal home environment?",
    answers: [
      { text: "Wherever my lover wants to live", value: "amandas" },
      { text: "Farmhouse with lots of acreage", value: "manus" },
      { text: "Mountains and creek-cut canyons", value: "fait" },
      { text: "A cozy cottage at the edge of the woods", value: "luv" },
      {
        text: "House in town near everything that's happening",
        value: "justene",
      },
      { text: "Overgrown shack in the brambles", value: "rip" },
      {
        text: "Simple home and garden near the community center",
        value: "endeavor",
      },
      {
        text: "A fortress with lush gardens and expansive verandas",
        value: "hoep",
      },
      {
        text: "Anywhere high or low as long as my family is there",
        value: "faeth",
      },
      {
        text: "A family home surrounded by woodlands, creeks, and meadows",
        value: "prometheia",
      },
    ],
  },

  {
    id: "q13",
    text: "People might label you as",
    answers: [
      { text: "The clever one", value: "prometheia" },
      { text: "The mysterious one", value: "fait" },
      { text: "The sweet one", value: "luv" },
      { text: "The innocent one", value: "faeth" },
      { text: "The strong one", value: "hoep" },
      { text: "The loyal one", value: "manus" },
      { text: "The devoted one", value: "amandas" },
      { text: "The generous one", value: "endeavor" },
      { text: "The audacious one", value: "justene" },
      { text: "The manipulative one", value: "rip" },
    ],
  },

  {
    id: "q14",
    text: "What do people most often come to you for?",
    answers: [
      {
        text: "A shoulder to cry on and genuine emotional support",
        value: "luv",
      },
      { text: "Creative solutions", value: "prometheia" },
      { text: "Problem resolution and burden removal", value: "fait" },
      { text: "Fun adventures", value: "justene" },
      { text: "Healing and strength", value: "hoep" },
      { text: "Quick avenues to their dreams", value: "rip" },
      { text: "Spiritual support", value: "faeth" },
      { text: "Loyal friendship", value: "manus" },
      { text: "People don't come to me", value: "amandas" },
      { text: "Community projects", value: "endeavor" },
    ],
  },

  {
    id: "q15",
    text: "Pick the vacation that sounds the best to you.",
    answers: [
      {
        text: "Taking my beloved away to an enchanted retreat",
        value: "fait",
      },
      {
        text: "Anything my love chooses will make me happy",
        value: "amandas",
      },
      {
        text: "Going somewhere fun with lots of activities",
        value: "justene",
      },
      {
        text: "Who has time for vacations? Too many deals going forward.",
        value: "rip",
      },
      {
        text: "Going horseback riding, picnicking, and spending time in my lover's arms",
        value: "prometheia",
      },
      {
        text: "I would rather just stay at home and kick back",
        value: "manus",
      },
      { text: "Trekking through the mountains or cycling", value: "hoep" },
      { text: "Anywhere cozy with friends and family", value: "luv" },
      {
        text: "Attending workshops and community events",
        value: "endeavor",
      },
      {
        text: "Strolling in moonlit gardens anywhere while hand-in-hand with my lover",
        value: "faeth",
      },
    ],
  },

  {
    id: "q16",
    text: "Choose the words that best describe your most prominent character qualities.",
    answers: [
      {
        text: "Loyal, caring, and supportive",
        value: "manus",
      },
      {
        text: "Creative, spirited, and kindly",
        value: "prometheia",
      },
      {
        text: "Enigmatic, responsible, and charming",
        value: "fait",
      },
      {
        text: "Loving, sweet, and highly empathetic",
        value: "luv",
      },
      {
        text: "Sensitive, sympathetic, and mystical",
        value: "faeth",
      },
      {
        text: "Strong, robust, and resilient",
        value: "hoep",
      },
      { text: "Devious, unscrupulous, and petty", value: "rip" },
      { text: "Fun-loving, mouthy, and high-spirited", value: "justene" },
      {
        text: "Enterprising, compassionate, and generous",
        value: "endeavor",
      },
      {
        text: "Devoted, ethereal, and giving",
        value: "amandas",
      },
    ],
  },
];
