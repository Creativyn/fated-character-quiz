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

/* -----------------------------
   WAIT UTIL
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
   WIX RESIZE (FIXED)
------------------------------ */

let ro;
let mo;

function sendHeight() {
  const height = document.body.scrollHeight;

  window.parent.postMessage({ type: "FATED_QUIZ_RESIZE", height }, "*");
}

function initWixResize() {
  if (window.__WIX_INIT__) return;
  window.__WIX_INIT__ = true;

  ro = new ResizeObserver(() => {
    requestAnimationFrame(sendHeight);
  });

  ro.observe(document.body);

  mo = new MutationObserver(() => {
    requestAnimationFrame(sendHeight);
  });

  mo.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });

  window.addEventListener("load", sendHeight);

  requestAnimationFrame(() => {
    requestAnimationFrame(sendHeight);
  });
}

/* -----------------------------
   UI HELPERS
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

  sendHeight();
}

/* -----------------------------
   VALIDATION FIX (IMPORTANT)
------------------------------ */

function scrollToFirstUnanswered() {
  const questions = document.querySelectorAll(".question");

  for (const q of questions) {
    const answered = q.querySelector("input:checked");
    if (!answered) {
      q.scrollIntoView({ behavior: "smooth", block: "center" });
      q.style.outline = "2px solid #ff4d4d";
      return;
    }
  }
}

/* -----------------------------
   INIT
------------------------------ */

async function bootApp() {
  console.log("BOOT START");

  await waitForElement("#questions-container");

  buildQuiz(QUESTIONS);

  initWixResize();

  showQuiz();

  sendHeight();

  console.log("BOOT COMPLETE");
}

requestAnimationFrame(bootApp);

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
        "Please answer every question before viewing results.";

      scrollToFirstUnanswered();
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

document.getElementById("retake-btn")?.addEventListener("click", () => {
  quizForm.reset();
  window.location.hash = "";
  showQuiz();
});

/* -----------------------------
   PRINT
------------------------------ */

document.getElementById("print-btn")?.addEventListener("click", () => {
  window.print();
});

/* -----------------------------
   SHARE
------------------------------ */

document.getElementById("share-btn")?.addEventListener("click", async () => {
  const topId = window.__TOP_PERSONALITY__;
  if (!topId) return;

  const url = `https://creativyn.github.io/fated-character-quiz/#/result/${topId}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: "My Fated Character Result",
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    }
  } catch (err) {
    console.error(err);
  }
});

/* -----------------------------
   MESSAGE HANDLER
------------------------------ */

window.addEventListener("message", (event) => {
  const { type, payload } = event.data || {};

  if (type === "FATED_SHOW_QUIZ") showQuiz();

  if (type === "FATED_SHOW_RESULT") {
    const personality = PERSONALITIES.find((p) => p.id === payload?.id);
    if (!personality) return;

    showResults([{ ...personality, score: 1, percent: 100 }]);
  }
});
