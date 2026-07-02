import { QUESTIONS } from "./data/questions.js";
import { PERSONALITIES } from "./config/personalities.js";
import { buildQuiz } from "./ui/buildQuiz.js";
import { renderResults } from "./ui/renderResults.js";
import { calculateResults } from "./logic/calculateResults.js";

console.log("SCRIPT LOADED");

const quizForm = document.getElementById("quiz");
const validationMessage = document.getElementById("validation-message");

const quizSection = document.getElementById("quiz-section");
const resultsSection = document.getElementById("results-section");

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

  document.getElementById("top-result").textContent =
    `You are most like ${top.name}`;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function init() {
  const container = document.getElementById("questions-container");

  if (!container) {
    console.error("Missing questions container");
    return;
  }

  buildQuiz(QUESTIONS);
  showQuiz();
}

/* ---------------- SUBMIT ---------------- */

quizForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(quizForm);

  // FIX: reliable answered count
  const answered = quizForm.querySelectorAll(
    "input[type='radio']:checked",
  ).length;

  if (answered < QUESTIONS.length) {
    validationMessage.textContent = "Please answer all questions.";
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

/* ---------------- RETAKE ---------------- */

document.getElementById("retake-btn")?.addEventListener("click", () => {
  quizForm.reset();
  showQuiz();
});

init();
