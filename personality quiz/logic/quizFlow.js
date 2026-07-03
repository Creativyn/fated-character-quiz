import { calculateResults } from "./calculateResults.js";
import { setResults } from "../state/quizState.js";

export function processQuiz({ formData, personalities, questions }) {
  const results = calculateResults({
    formData,
    personalities,
    questions,
  });

  setResults(results);

  return results;
}
