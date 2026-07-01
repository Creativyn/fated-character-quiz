console.log("SCRIPT LOADED");

import { QUESTIONS } from "./data/questions.js";
import { PERSONALITIES } from "./config/personalities.js";

import { buildQuiz } from "./ui/buildQuiz.js";
import { renderResults } from "./ui/renderResults.js";
import { calculateResults } from "./logic/calculateResults.js";

function getRoute() {
  const forcedResultId = getRoute();
  const hash = window.location.hash;
  const match = hash.match(/^#\/result\/(.+)$/);
  return match ? match[1] : null;
}

const forcedResultId = getRoute();
if (forcedResultId) {
  const personality = PERSONALITIES.find((p) => p.id === forcedResultId);

  if (personality) {
    renderResults([
      {
        ...personality,
        score: 1,
        percent: 100,
      },
    ]);

    document.getElementById("quiz-section").classList.add("hidden");
    document.getElementById("results-section").classList.remove("hidden");
  }
} else {
  buildQuiz(QUESTIONS);
}

const quizForm = document.getElementById("quiz");
const validationMessage = document.getElementById("validation-message");

quizForm.addEventListener("submit", (e) => {
  e.preventDefault();

  console.log("FORM SUBMITTED");
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

  const quizForm = document.getElementById("quiz");
  const resultsSection = document.getElementById("results-section");
  const quizSection = document.getElementById("quiz-section");
});

document.getElementById("retake-btn").addEventListener("click", () => {
  quizForm.reset();

  resultsSection.classList.add("hidden");
  quizSection.classList.remove("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("print-btn").addEventListener("click", () => {
  window.print();
  document.getElementById("share-btn").addEventListener("click", async () => {
    const top = document.getElementById("top-result").textContent;

    const topId = window.__TOP_PERSONALITY__;
    const shareUrl = `${window.location.origin}/#/result/${topId}`;

    if (navigator.share) {
      await navigator.share({
        title: "My Fated Character Result",
        text: top,
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert("Share link copied!");
    }
  });

  console.log(results);
  renderResults(results, (window.__TOP_PERSONALITY__ = top.id));

  resultsSection.classList.remove("hidden");
  quizSection.classList.add("hidden");
});
