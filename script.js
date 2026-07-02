import { QUESTIONS } from "./data/questions.js";
import { PERSONALITIES } from "./config/personalities.js";
import { buildQuiz } from "./ui/buildQuiz.js";
import { renderResults } from "./ui/renderResults.js";
import { calculateResults } from "./logic/calculateResults.js";

console.log("SCRIPT LOADED");
console.log("QUESTIONS:", QUESTIONS);

/* -----------------------------
   DOM
------------------------------ */

const quizForm = document.getElementById("quiz");
const quizSection = document.getElementById("quiz-section");
const resultsSection = document.getElementById("results-section");
const validationMessage = document.getElementById("validation-message");

const retakeBtn = document.getElementById("retake-btn");

/* -----------------------------
   UI STATE
------------------------------ */

function showQuiz() {
  quizSection.classList.remove("hidden");
  resultsSection.classList.add("hidden");
}

function showResults(results) {
  const top = results?.[0];
  if (!top) return;

  renderResults(results);

  quizSection.classList.add("hidden");
  resultsSection.classList.remove("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });

  const topResult = document.getElementById("top-result");
  if (topResult) {
    topResult.textContent = `You are most like ${top.name}`;
  }
}

/* -----------------------------
   INIT
------------------------------ */

function init() {
  console.log("INIT");

  buildQuiz(QUESTIONS);

  showQuiz();
}

init();

/* -----------------------------
   SUBMIT
------------------------------ */

quizForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(quizForm);

  const answered = new Set([...formData.keys()]).size;

  if (answered < QUESTIONS.length) {
    validationMessage.textContent =
      "Please answer every question before viewing results.";

    validationMessage.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    return;
  }

  validationMessage.textContent = "";

  const results = calculateResults({
    formData,
    personalities: PERSONALITIES,
    questions: QUESTIONS,
  });

  showResults(results);
});

/* -----------------------------
   RETAKE
------------------------------ */

retakeBtn?.addEventListener("click", () => {
  quizForm.reset();
  showQuiz();
});
