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

/* -----------------------------
   Helpers
------------------------------ */

function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const check = () => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);

      if (Date.now() - start > timeout) {
        return reject(`Timeout waiting for ${selector}`);
      }

      requestAnimationFrame(check);
    };

    check();
  });
}

/* -----------------------------
   UI
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

  const topResultEl = document.getElementById("top-result");
  if (topResultEl) {
    topResultEl.textContent = `You are most like ${top.name}`;
  }
}

/* -----------------------------
   Init
------------------------------ */

async function bootApp() {
  console.log("BOOT START");

  await waitForElement("#questions-container");

  console.log("QUESTIONS CONTAINER FOUND");

  buildQuiz(QUESTIONS);

  showQuiz();

  console.log("BOOT COMPLETE");
}

bootApp().catch((err) => console.error("BOOT ERROR:", err));

/* -----------------------------
   Submit
------------------------------ */

quizForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(quizForm);

  const answered = new Set([...formData.keys()]).size;

  console.log("ANSWERED:", answered, "/", QUESTIONS.length);

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
   Retake
------------------------------ */

document.getElementById("retake-btn")?.addEventListener("click", () => {
  quizForm.reset();
  showQuiz();
});
