export function calculateResults({ formData, personalities, questions }) {
  const scores = Object.fromEntries(personalities.map((p) => [p.id, 0]));

  let answeredCount = 0;

  for (let i = 0; i < questions.length; i++) {
    const value = formData.get(`q${i}`);

    if (!value) continue;

    if (value in scores) {
      scores[value] += 1;
      answeredCount += 1;
    }
  }

  const results = personalities.map((p) => {
    const score = scores[p.id] ?? 0;

    const percent =
      answeredCount > 0 ? Math.round((score / answeredCount) * 100) : 0;

    return {
      ...p,
      score,
      percent,
    };
  });

  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  return results;
}
