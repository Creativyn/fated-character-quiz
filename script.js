import { QUESTIONS } from "./data/questions.js";
import { PERSONALITIES } from "./config/personalities.js";
import { buildQuiz } from "./ui/buildQuiz.js";
import { renderResults } from "./ui/renderResults.js";
import { calculateResults } from "./logic/calculateResults.js";

console.log("SCRIPT LOADED");
console.log("QUESTIONS:", QUESTIONS.length);

const quizForm = document.getElementById("quiz");
const quizSection = document.getElementById("quiz-section");
const resultsSection = document.getElementById("results-section");
const validationMessage = document.getElementById("validation-message");

const retakeBtn = document.getElementById("retake-btn");
const printBtn = document.getElementById("print-btn");
const shareBtn = document.getElementById("share-btn");

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
}

async function bootApp() {
  console.log("Boot starting...");

  const container = document.querySelector("#questions-container");
  if (!container) {
    console.error("Missing #questions-container");
    return;
  }

  buildQuiz(QUESTIONS);

  showQuiz();

  console.log("Boot complete");
}

quizForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(quizForm);

  const answered = new Set([...formData.keys()]).size;

  if (answered < QUESTIONS.length) {
    validationMessage.textContent =
      "Please answer every question before viewing results.";
    validationMessage.scrollIntoView({ behavior: "smooth" });
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
  window.location.hash = "";
  showQuiz();
});

printBtn?.addEventListener("click", () => window.print());

shareBtn?.addEventListener("click", async () => {
  const topId = window.__TOP_PERSONALITY__;
  if (!topId) return;

  const url = `https://creativyn.github.io/fated-character-quiz/#/result/${topId}`;

  try {
    if (navigator.share) {
      await navigator.share({ url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Copied!");
    }
  } catch (e) {
    console.error(e);
  }
});

bootApp();
