export function calculateResults({ formData, personalities, questions }) {
  const scores = Object.fromEntries(personalities.map((p) => [p.id, 0]));

  const entries = formData?.entries?.() ?? [];
  let answeredCount = 0;

  for (const [, value] of entries) {
    if (value in scores) {
      scores[value]++;
      answeredCount++;
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

  results.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

  return results;
}
