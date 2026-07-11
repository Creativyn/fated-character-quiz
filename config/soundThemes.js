/**
 * Central music configuration.
 *
 * Music phases:
 * - world.quiz: looping music while taking the quiz
 * - world.cinematic: ambience during the fate reveal cinematic
 * - characterTheme: dominant character's theme on the results page
 */

export const DEFAULT_SOUND_THEME = {
  characterTheme: null,
};

export const SOUND_THEMES = {
  world: {
    quiz: "./assets/music/joilus.mp3",
    cinematic: "./assets/music/mount-majesticus.mp3",
  },

  prometheia: {
    characterTheme: "./assets/music/characters/prometheia.mp3",
  },

  fait: {
    characterTheme: "./assets/music/characters/fait.mp3",
  },

  luv: {
    characterTheme: "./assets/music/characters/luv.mp3",
  },

  manus: {
    characterTheme: "./assets/music/characters/manus.mp3",
  },

  amandas: {
    characterTheme: "./assets/music/characters/amandas.mp3",
  },

  faeth: {
    characterTheme: "./assets/music/characters/faeth.mp3",
  },

  hoep: {
    characterTheme: "./assets/music/characters/hoep.mp3",
  },

  endeavor: {
    characterTheme: "./assets/music/characters/endeavor.mp3",
  },

  justene: {
    characterTheme: "./assets/music/characters/justene.mp3",
  },

  rip: {
    characterTheme: "./assets/music/characters/rip.mp3",
  },
};

/**
 * Returns the sound configuration for a personality or global music phase.
 *
 * Accepts:
 * - a string such as "world" or "prometheia"
 * - a personality object containing id, slug, or key
 */
export function getSoundTheme(personality) {
  if (!personality) {
    return DEFAULT_SOUND_THEME;
  }

  if (typeof personality === "string") {
    return SOUND_THEMES[personality] ?? DEFAULT_SOUND_THEME;
  }

  const id = personality.id ?? personality.slug ?? personality.key ?? null;

  if (!id) {
    return DEFAULT_SOUND_THEME;
  }

  return SOUND_THEMES[id] ?? DEFAULT_SOUND_THEME;
}
