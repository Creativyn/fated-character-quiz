import { QUESTIONS } from "./data/questions.js";
import { PERSONALITIES } from "./config/personalities.js";
import { buildQuiz } from "./ui/buildQuiz.js";
import { renderResults } from "./ui/renderResults.js";
import { calculateResults } from "./logic/calculateResults.js";

console.log("SCRIPT LOADED");

if (!Array.isArray(QUESTIONS)) {
  throw new Error("QUESTIONS failed to load (check export/import path)");
}

const quizForm = document.getElementById("quiz");
const validationMessage = document.getElementById("validation-message");

const quizSection = document.getElementById("quiz-section");
const resultsSection = document.getElementById("results-section");

const retakeBtn = document.getElementById("retake-btn");

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

quizForm.addEventListener("submit", (e) => {
  e.preventDefault();

  console.log("SUBMIT FIRED");

  const formData = new FormData(quizForm);
  const answered = new Set([...formData.keys()]).size;

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

retakeBtn?.addEventListener("click", () => {
  quizForm.reset();
  showQuiz();
});

init();
