import { QUESTIONS } from "./questions.js";
import { PERSONALITIES } from "./personalities.js";
import { buildQuiz } from "./buildQuiz.js";
import { renderResults } from "./renderResults.js";
import { calculateResults } from "./calculateResults.js";

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
   WAIT FOR DOM READY
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
   WIX RESIZE (safe minimal version)
------------------------------ */

function sendHeight() {
  const height = document.body.scrollHeight;

  window.parent.postMessage(
    {
      type: "FATED_QUIZ_RESIZE",
      height,
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
   RESULTS
------------------------------ */

function postResult(top) {
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
}

/* -----------------------------
   UI
------------------------------ */

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

  postResult(top);

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

bootApp();

/* -----------------------------
   BUTTONS
------------------------------ */

retakeBtn?.addEventListener("click", () => {
  quizForm.reset();
  window.history.replaceState({}, "", window.location.pathname);
  showQuiz();
});

printBtn?.addEventListener("click", () => window.print());

shareBtn?.addEventListener("click", async () => {
  const topId = window.__TOP_PERSONALITY__;
  if (!topId) return;

  const shareUrl = `https://creativyn.github.io/fated-character-quiz/#/result/${topId}`;

  if (navigator.share) {
    await navigator.share({
      title: "My Fated Character Result",
      url: shareUrl,
    });
  } else {
    navigator.clipboard?.writeText(shareUrl);
    alert("Copied!");
  }
});

/* -----------------------------
   WIX EVENTS
------------------------------ */

window.addEventListener("message", (event) => {
  const { type, payload } = event.data || {};

  if (type === "FATED_SHOW_RESULT") {
    const personality = PERSONALITIES.find((p) => p.id === payload?.id);
    if (!personality) return;

    showResults([
      {
        ...personality,
        score: 1,
        percent: 100,
      },
    ]);
  }

  if (type === "FATED_SHOW_QUIZ") {
    showQuiz();
  }
});
