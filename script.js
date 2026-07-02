import { QUESTIONS } from "./data/questions.js";
import { PERSONALITIES } from "./config/personalities.js";
import { buildQuiz } from "./ui/buildQuiz.js";
import { renderResults } from "./ui/renderResults.js";
import { calculateResults } from "./logic/calculateResults.js";

console.log("SCRIPT LOADED");

/* -----------------------------
   DOM
------------------------------ */

const quizForm = document.getElementById("quiz");
const quizSection = document.getElementById("quiz-section");
const resultsSection = document.getElementById("results-section");
const validationMessage = document.getElementById("validation-message");

const retakeBtn = document.getElementById("retake-btn");
const printBtn = document.getElementById("print-btn");
const shareBtn = document.getElementById("share-btn");

/* -----------------------------
   QUIZ FLOW
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

  window.__TOP_PERSONALITY__ = top.id;
}

/* -----------------------------
   INIT
------------------------------ */

function bootApp() {
  console.log("BOOTING...");

  buildQuiz(QUESTIONS);
  showQuiz();

  console.log("READY");
}

bootApp();

/* -----------------------------
   SUBMIT
------------------------------ */

if (quizForm) {
  quizForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(quizForm);
    const answeredCount = new Set([...formData.keys()]).size;

    if (answeredCount < QUESTIONS.length) {
      validationMessage.textContent =
        "Please answer every question before viewing your results.";
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
}

/* -----------------------------
   RETAKE
------------------------------ */

if (retakeBtn) {
  retakeBtn.addEventListener("click", () => {
    quizForm.reset();
    window.history.replaceState({}, "", window.location.pathname);
    showQuiz();
  });
}

/* -----------------------------
   PRINT
------------------------------ */

if (printBtn) {
  printBtn.addEventListener("click", () => window.print());
}

/* -----------------------------
   SHARE
------------------------------ */

if (shareBtn) {
  shareBtn.addEventListener("click", async () => {
    const topId = window.__TOP_PERSONALITY__;
    if (!topId) return;

    const shareUrl = `https://creativyn.github.io/fated-character-quiz/#/result/${topId}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Fated Character Result",
          url: shareUrl,
        });
      } else {
        navigator.clipboard.writeText(shareUrl);
        alert("Copied!");
      }
    } catch (e) {
      console.error(e);
    }
  });
}

/* -----------------------------
   ROUTE SUPPORT
------------------------------ */

window.addEventListener("message", (event) => {
  const { type, payload } = event.data || {};

  if (type === "FATED_SHOW_RESULT") {
    const personality = PERSONALITIES.find((p) => p.id === payload?.id);
    if (!personality) return;

    showResults([{ ...personality, percent: 100 }]);
  }

  if (type === "FATED_SHOW_QUIZ") {
    showQuiz();
  }
});
