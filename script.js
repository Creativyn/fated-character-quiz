import { QUESTIONS } from "./data/questions.js";
import { PERSONALITIES } from "./config/personalities.js";

import { buildQuiz } from "./ui/buildQuiz.js";
import { renderResults } from "./ui/renderResults.js";
import { calculateResults } from "./logic/calculateResults.js";

buildQuiz(QUESTIONS);

const quizForm = document.getElementById("quiz");
const validationMessage = document.getElementById("validation-message");

quizForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(quizForm);

  // ✅ VALIDATION GOES HERE (BEFORE CALCULATION)
  const answeredCount = new Set([...formData.keys()]).size;

  if (answeredCount < QUESTIONS.length) {
    validationMessage.textContent =
      "Please answer all questions before submitting.";
    return;
  }

  validationMessage.textContent = "";

  // ✅ ONLY RUN IF VALID
  const results = calculateResults({
    formData,
    personalities: PERSONALITIES,
    questions: QUESTIONS,
  });

  renderResults(results);
});
