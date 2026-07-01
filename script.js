console.log("SCRIPT LOADED");

import { QUESTIONS } from "./data/questions.js";
import { PERSONALITIES } from "./config/personalities.js";

import { buildQuiz } from "./ui/buildQuiz.js";
import { renderResults } from "./ui/renderResults.js";
import { calculateResults } from "./logic/calculateResults.js";

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
   Routing
------------------------------ */

function getRoute() {
  const match = window.location.hash.match(/^#\/result\/(.+)$/);
  return match ? match[1] : null;
}

/* -----------------------------
   UI Helpers
------------------------------ */

function showQuiz() {
  quizSection.classList.remove("hidden");
  resultsSection.classList.add("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function showResults(results) {
  renderResults(results);

  quizSection.classList.add("hidden");
  resultsSection.classList.remove("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

/* -----------------------------
   Shared URL Support
------------------------------ */

const forcedResultId = getRoute();

if (forcedResultId) {
  const personality = PERSONALITIES.find(
    (p) => p.id === forcedResultId,
  );

  if (personality) {
    showResults([
      {
        ...personality,
        score: 1,
        percent: 100,
      },
    ]);
  } else {
    buildQuiz(QUESTIONS);
  }
} else {
  buildQuiz(QUESTIONS);
}

/* -----------------------------
   Quiz Submission
------------------------------ */

quizForm.addEventListener("submit", (e) => {
  e.preventDefault();

  console.log("FORM SUBMITTED");

  const formData = new FormData(quizForm);

  const answeredCount = new Set([...formData.keys()]).size;

  if (answeredCount < QUESTIONS.length) {
    validationMessage.textContent =
      "Please answer every question before viewing your results.";

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

retakeBtn.addEventListener("click", () => {
  quizForm.reset();

  validationMessage.textContent = "";

  window.history.replaceState({}, "", window.location.pathname);

  showQuiz();
});

/* -----------------------------
   Print
------------------------------ */

printBtn.addEventListener("click", () => {
  window.print();
});

/* -----------------------------
   Share
------------------------------ */

shareBtn.addEventListener("click", async () => {
  const topId = window.__TOP_PERSONALITY__;

  if (!topId) return;

  const shareUrl =
    `${window.location.origin}` +
    `${window.location.pathname}` +
    `#/result/${topId}`;

  const shareText =
    document.getElementById("top-result").textContent;

  try {
    if (navigator.share) {
      await navigator.share({
        title: "My Fated Character Result",
        text: shareText,
        url: shareUrl,
      });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      alert("Share link copied to your clipboard!");
    } else {
      prompt("Copy this link:", shareUrl);
    }
  } catch (err) {
    console.error("Share cancelled or failed:", err);
  }
});
