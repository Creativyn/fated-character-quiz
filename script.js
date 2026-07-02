import { QUESTIONS } from "./data/questions.js";
import { PERSONALITIES } from "./config/personalities.js";
import { buildQuiz } from "./ui/buildQuiz.js";
import { renderResults } from "./ui/renderResults.js";
import { calculateResults } from "./logic/calculateResults.js";

/* =========================
   SAFE DOM HELPERS
========================= */

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

/* =========================
   GLOBAL STATE
========================= */

let quizForm;
let quizSection;
let resultsSection;
let validationMessage;

/* =========================
   UNANSWERED SCROLL FIX
========================= */

function scrollToFirstUnanswered(formData) {
  const questions = document.querySelectorAll(".question");

  for (let i = 0; i < QUESTIONS.length; i++) {
    const answered = formData.get(`q${i}`);

    if (!answered) {
      questions[i]?.classList.add("missing");

      questions[i]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return;
    }
  }
}

/* =========================
   RESULTS BUTTONS (FIXED)
========================= */

function initResultButtons() {
  const retakeBtn = document.getElementById("retake-btn");
  const printBtn = document.getElementById("print-btn");
  const shareBtn = document.getElementById("share-btn");

  retakeBtn?.addEventListener("click", () => {
    quizForm?.reset();

    resultsSection?.classList.add("hidden");
    quizSection?.classList.remove("hidden");

    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  printBtn?.addEventListener("click", () => {
    window.print();
  });

  shareBtn?.addEventListener("click", async () => {
    const topId = window.__TOP_PERSONALITY__;
    if (!topId) return;

    const url = `${window.location.origin}${window.location.pathname}#/result/${topId}`;

    const text =
      document.getElementById("top-result")?.textContent || "My result";

    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Fated Character Result",
          text,
          url,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert("Link copied!");
      } else {
        prompt("Copy link:", url);
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  });
}

/* =========================
   RESULTS
========================= */

function showResults(results) {
  const top = results?.[0];
  if (!top) return;

  renderResults(results);

  quizSection.classList.add("hidden");
  resultsSection.classList.remove("hidden");

  window.__TOP_PERSONALITY__ = top.id;

  initResultButtons();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =========================
   QUIZ
========================= */

function showQuiz() {
  quizSection.classList.remove("hidden");
  resultsSection.classList.add("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =========================
   INIT APP
========================= */

async function bootApp() {
  console.log("🚀 Boot starting...");

  await waitForElement("#questions-container");

  buildQuiz(QUESTIONS);

  quizForm = document.getElementById("quiz");
  quizSection = document.getElementById("quiz-section");
  resultsSection = document.getElementById("results-section");
  validationMessage = document.getElementById("validation-message");

  quizForm?.addEventListener("submit", (e) => {
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

    showResults(results);
  });

  console.log("✅ Boot complete");
}

/* =========================
   START
========================= */

bootApp();

/* =========================
   MESSAGE API (optional Wix/iframe)
========================= */

window.addEventListener("message", (event) => {
  const { type, payload } = event.data || {};

  switch (type) {
    case "FATED_SHOW_RESULT":
      if (!payload?.id) return;

      const personality = PERSONALITIES.find((p) => p.id === payload.id);

      if (!personality) return;

      showResults([
        {
          ...personality,
          score: 1,
          percent: 100,
        },
      ]);
      break;

    case "FATED_SHOW_QUIZ":
      showQuiz();
      break;
  }
});
