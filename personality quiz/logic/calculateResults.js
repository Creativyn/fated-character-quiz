export function calculateResults({ answers, personalities }) {
  // Initialize score table
  const scores = Object.fromEntries(
    personalities.map((personality) => [personality.id, 0]),
  );

  let answeredCount = 0;

  // Count each selected personality
  answers.forEach((value) => {
    if (!value) return;

    if (value in scores) {
      scores[value]++;
      answeredCount++;
    }
  });

  // Build results
  const results = personalities.map((personality) => {
    const score = scores[personality.id] ?? 0;

    return {
      ...personality,
      score,
      percent:
        answeredCount === 0 ? 0 : Math.round((score / answeredCount) * 100),
    };
  });

  // Highest score first
  results.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    return a.name.localeCompare(b.name);
  });

  return results;
}
