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

const retakeBtn = document.getElementById("retake-btn");
const printBtn = document.getElementById("print-btn");
const shareBtn = document.getElementById("share-btn");

let ro;

/* -----------------------------
   SAFE RESIZE SYSTEM (GitHub + Wix safe)
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

function initResize() {
  if (ro) return;

  ro = new ResizeObserver(() => {
    requestAnimationFrame(sendHeight);
  });

  ro.observe(document.body);

  window.addEventListener("load", sendHeight);

  requestAnimationFrame(() => {
    requestAnimationFrame(sendHeight);
  });
}

/* -----------------------------
   WAIT FOR DOM
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

  sendHeight();
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

  sendHeight();
}

/* -----------------------------
   BOOT
------------------------------ */

async function bootApp() {
  console.log("🚀 Boot starting...");

  await waitForElement("#questions-container");

  buildQuiz(QUESTIONS);

  initResize();

  showQuiz();

  console.log("✅ Boot complete");
}

bootApp();

/* -----------------------------
   FORM SUBMIT
------------------------------ */

if (quizForm) {
  quizForm.addEventListener("submit", (e) => {
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
}

/* -----------------------------
   RETAKE
------------------------------ */

retakeBtn?.addEventListener("click", () => {
  quizForm.reset();
  window.history.replaceState({}, "", window.location.pathname);
  showQuiz();
});

/* -----------------------------
   PRINT
------------------------------ */

printBtn?.addEventListener("click", () => window.print());

/* -----------------------------
   SHARE
------------------------------ */

shareBtn?.addEventListener("click", async () => {
  const topId = window.__TOP_PERSONALITY__;
  if (!topId) return;

  const shareUrl = `https://creativyn.github.io/fated-character-quiz/#/result/${topId}`;

  const text = document.getElementById("top-result")?.textContent || "";

  try {
    if (navigator.share) {
      await navigator.share({
        title: "My Fated Character Result",
        text,
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert("Copied!");
    }
  } catch (e) {
    console.error(e);
  }
});

/* -----------------------------
   EXTERNAL EVENTS
------------------------------ */

window.addEventListener("message", (event) => {
  const { type, payload } = event.data || {};

  if (type === "FATED_SHOW_RESULT" && payload?.id) {
    const personality = PERSONALITIES.find((p) => p.id === payload.id);
    if (!personality) return;

    showResults([{ ...personality, score: 1, percent: 100 }]);
  }

  if (type === "FATED_SHOW_QUIZ") {
    showQuiz();
  }
});
