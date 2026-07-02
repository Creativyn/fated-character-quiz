import { QUESTIONS } from "./data/questions.js";
import { PERSONALITIES } from "./config/personalities.js";
import { buildQuiz } from "./ui/buildQuiz.js";
import { renderResults } from "./ui/renderResults.js";
import { calculateResults } from "./logic/calculateResults.js";

console.log("SCRIPT LOADED");

// expose for debugging (fixes your console confusion)
window.QUESTIONS = QUESTIONS;
window.buildQuiz = buildQuiz;

/* -----------------------------
   DOM helpers
------------------------------ */

function waitForElement(selector, timeout = 8000) {
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
   Wix resize (SAFE VERSION)
------------------------------ */

function initWixResize() {
  const send = () => {
    window.parent.postMessage(
      {
        type: "FATED_QUIZ_RESIZE",
        height: document.body.scrollHeight,
      },
      "*",
    );
  };

  const ro = new ResizeObserver(() => {
    requestAnimationFrame(send);
  });

  ro.observe(document.body);

  window.addEventListener("load", send);

  requestAnimationFrame(send);
}

/* -----------------------------
   UI
------------------------------ */

function showQuiz() {
  document.getElementById("quiz-section")?.classList.remove("hidden");
  document.getElementById("results-section")?.classList.add("hidden");

  requestAnimationFrame(() => {
    window.parent.postMessage(
      {
        type: "FATED_QUIZ_RESIZE",
        height: document.body.scrollHeight,
      },
      "*",
    );
  });
}

function showResults(results) {
  const top = results?.[0];
  if (!top) return;

  renderResults(results);

  document.getElementById("quiz-section")?.classList.add("hidden");
  document.getElementById("results-section")?.classList.remove("hidden");

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

  requestAnimationFrame(() => {
    window.parent.postMessage(
      {
        type: "FATED_QUIZ_RESIZE",
        height: document.body.scrollHeight,
      },
      "*",
    );
  });
}

/* -----------------------------
   INIT
------------------------------ */

async function bootApp() {
  console.log("🚀 Boot starting...");

  try {
    await waitForElement("#questions-container");

    const container = document.getElementById("questions-container");
    console.log("Container found:", container);

    buildQuiz(QUESTIONS);

    initWixResize();

    showQuiz();

    console.log("✅ Boot complete");
  } catch (err) {
    console.error("BOOT FAILED:", err);
  }
}

requestAnimationFrame(bootApp);

/* -----------------------------
   FORM
------------------------------ */

const quizForm = document.getElementById("quiz");
const validationMessage = document.getElementById("validation-message");

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

    const results = calculateResults({
      formData,
      personalities: PERSONALITIES,
      questions: QUESTIONS,
    });

    showResults(results);
  });
}

/* -----------------------------
   Buttons
------------------------------ */

document.getElementById("retake-btn")?.addEventListener("click", () => {
  quizForm?.reset();
  window.history.replaceState({}, "", window.location.pathname);
  showQuiz();
});

document.getElementById("print-btn")?.addEventListener("click", () => {
  window.print();
});

document.getElementById("share-btn")?.addEventListener("click", async () => {
  const topId = window.__TOP_PERSONALITY__;
  if (!topId) return;

  const url = `https://creativyn.github.io/fated-character-quiz/#/result/${topId}`;

  if (navigator.share) {
    await navigator.share({ url });
  } else {
    await navigator.clipboard.writeText(url);
    alert("Copied!");
  }
});
