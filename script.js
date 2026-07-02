import { QUESTIONS } from "./data/questions.js";
import { PERSONALITIES } from "./config/personalities.js";
import { buildQuiz } from "./ui/buildQuiz.js";
import { renderResults } from "./ui/renderResults.js";
import { calculateResults } from "./logic/calculateResults.js";

/* -----------------------------
   Helpers
------------------------------ */

function scrollToFirstUnanswered(formData) {
  const questions = document.querySelectorAll(".question");

  for (let i = 0; i < QUESTIONS.length; i++) {
    const answered = formData.get(`q${i}`);

    if (!answered) {
      questions[i]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      questions[i]?.classList.add("missing");
      return;
    }
  }
}

/* -----------------------------
   DOM
------------------------------ */

const quizForm = document.getElementById("quiz");
const validationMessage = document.getElementById("validation-message");
const quizSection = document.getElementById("quiz-section");
const resultsSection = document.getElementById("results-section");

/* -----------------------------
   Init
------------------------------ */

buildQuiz(QUESTIONS);

/* -----------------------------
   Submit
------------------------------ */

quizForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(quizForm);
  const answeredCount = new Set([...formData.keys()]).size;

  if (answeredCount < QUESTIONS.length) {
    validationMessage.textContent =
      "Please answer every question before viewing results.";

    scrollToFirstUnanswered(formData);
    return;
  }

  validationMessage.textContent = "";

  const results = calculateResults({
    formData,
    personalities: PERSONALITIES,
    questions: QUESTIONS,
  });

  renderResults(results);

  quizSection.classList.add("hidden");
  resultsSection.classList.remove("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });
});
