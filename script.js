import { QUESTIONS } from "./data/questions.js";
import { PERSONALITIES } from "./config/personalities.js";
import { buildQuiz } from "./ui/buildQuiz.js";
import { renderResults } from "./ui/renderResults.js";
import { calculateResults } from "./logic/calculateResults.js";

/* -----------------------------
   DEBUG (IMPORTANT)
------------------------------ */
window.QUESTIONS = QUESTIONS;
window.PERSONALITIES = PERSONALITIES;

console.log("SCRIPT LOADED");
console.log("QUESTIONS:", QUESTIONS.length);

/* -----------------------------
   DOM HELPERS
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
   WIX RESIZE
------------------------------ */

function sendHeight() {
  window.parent.postMessage(
    {
      type: "FATED_QUIZ_RESIZE",
      height: document.body.scrollHeight,
    },
    "*",
  );
}

function initWixResize() {
  const ro = new ResizeObserver(() => {
    requestAnimationFrame(sendHeight);
  });

  ro.observe(document.body);

  window.addEventListener("load", sendHeight);

  requestAnimationFrame(() => {
    requestAnimationFrame(sendHeight);
  });
}

/* -----------------------------
   UI
------------------------------ */

const quizForm = document.getElementById("quiz");
const quizSection = document.getElementById("quiz-section");
const resultsSection = document.getElementById("results-section");
const validationMessage = document.getElementById("validation-message");

function showQuiz() {
  quizSection.classList.remove("hidden");
  resultsSection.classList.add("hidden");

  requestAnimationFrame(sendHeight);
}

function showResults(results) {
  const top = results?.[0];
  if (!top) return;

  renderResults(results);

  quizSection.classList.add("hidden");
  resultsSection.classList.remove("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });

  window.__TOP_PERSONALITY__ = top.id;

  window.parent.postMessage(
    {
      type: "FATED_QUIZ_RESULT",
      payload: {
        id: top.id,
        name: top.name,
        percent: top.percent,
      },
    },
    "*",
  );

  requestAnimationFrame(sendHeight);
}

/* -----------------------------
   BOOT
------------------------------ */

async function bootApp() {
  console.log("🚀 Boot starting...");

  await waitForElement("#questions-container");

  buildQuiz(QUESTIONS);

  initWixResize();

  showQuiz();

  requestAnimationFrame(sendHeight);

  console.log("✅ Boot complete");
}

bootApp();

/* -----------------------------
   SUBMIT
------------------------------ */

quizForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(quizForm);
  const answered = new Set([...formData.keys()]).size;

  if (answered < QUESTIONS.length) {
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

/* -----------------------------
   RETAKE
------------------------------ */

document.getElementById("retake-btn")?.addEventListener("click", () => {
  quizForm.reset();
  window.history.replaceState({}, "", window.location.pathname);
  showQuiz();
});

/* -----------------------------
   SHARE / PRINT
------------------------------ */

document.getElementById("print-btn")?.addEventListener("click", () => {
  window.print();
});

document.getElementById("share-btn")?.addEventListener("click", async () => {
  const topId = window.__TOP_PERSONALITY__;
  if (!topId) return;

  const url = `https://creativyn.github.io/fated-character-quiz/#/result/${topId}`;

  if (navigator.share) {
    await navigator.share({ url, title: "My Result" });
  } else {
    await navigator.clipboard.writeText(url);
    alert("Copied!");
  }
});
