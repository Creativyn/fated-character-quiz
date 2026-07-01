import { QUESTIONS } from "./data/questions.js";
import { PERSONALITIES } from "./config/personalities.js";
import { buildQuiz } from "./ui/buildQuiz.js";
import { renderResults } from "./ui/renderResults.js";
import { calculateResults } from "./logic/calculateResults.js";

console.log("SCRIPT LOADED");
console.log("buildQuiz:", buildQuiz);
console.log("QUESTIONS:", QUESTIONS);

/* -----------------------------
   SAFE DOM HELPERS
------------------------------ */

function getEl(id) {
  return document.getElementById(id);
}

function getQuizSection() {
  return getEl("quiz-section");
}

function getResultsSection() {
  return getEl("results-section");
}

function getQuizForm() {
  return getEl("quiz");
}

function getValidationMessage() {
  return getEl("validation-message");
}

/* -----------------------------
   WAIT FOR ELEMENT
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
   WIX RESIZE SYSTEM (FIXED)
------------------------------ */

let ro = null;
let mo = null;

export function initWixResize() {
  if (window.__WIX_INIT__) return;
  window.__WIX_INIT__ = true;

  const sendHeight = () => {
    const height = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
    );

    window.parent.postMessage(
      {
        type: "FATED_QUIZ_RESIZE",
        height,
      },
      "*",
    );
  };

  // ResizeObserver
  ro = new ResizeObserver(() => {
    requestAnimationFrame(sendHeight);
  });

  ro.observe(document.body);

  // MutationObserver (Wix safety net)
  mo = new MutationObserver(() => {
    requestAnimationFrame(sendHeight);
  });

  mo.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });

  // initial triggers
  window.addEventListener("load", sendHeight);

  requestAnimationFrame(() => {
    requestAnimationFrame(sendHeight);
  });

  window.__WIX_RO__ = ro;
  window.__WIX_MO__ = mo;
}

/* -----------------------------
   ROUTING
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
  const quizSection = getQuizSection();
  const resultsSection = getResultsSection();

  if (!quizSection || !resultsSection) {
    console.error("Missing quiz/results section");
    return;
  }

  quizSection.classList.remove("hidden");
  resultsSection.classList.add("hidden");

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

  const quizSection = getQuizSection();
  const resultsSection = getResultsSection();

  if (!quizSection || !resultsSection) return;

  renderResults(results);

  quizSection.classList.add("hidden");
  resultsSection.classList.remove("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });

  window.__TOP_PERSONALITY__ = top.id;

  postResult(top);

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

    buildQuiz(QUESTIONS);

    initWixResize();

    showQuiz();

    requestAnimationFrame(() => {
      window.parent.postMessage(
        {
          type: "FATED_QUIZ_RESIZE",
          height: document.body.scrollHeight,
        },
        "*",
      );
    });

    console.log("✅ Boot complete");
  } catch (err) {
    console.error("Boot failed:", err);
  }
}

/* -----------------------------
   QUIZ SUBMIT
------------------------------ */

const quizForm = getQuizForm();
const validationMessage = getValidationMessage();

if (quizForm) {
  quizForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(quizForm);
    const answeredCount = new Set([...formData.keys()]).size;

    if (answeredCount < QUESTIONS.length) {
      if (validationMessage) {
        validationMessage.textContent =
          "Please answer every question before viewing your results.";

        validationMessage.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    if (validationMessage) validationMessage.textContent = "";

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

const retakeBtn = getEl("retake-btn");

if (retakeBtn && quizForm) {
  retakeBtn.addEventListener("click", () => {
    quizForm.reset();

    window.history.replaceState({}, "", window.location.pathname);

    showQuiz();
  });
}

/* -----------------------------
   PRINT
------------------------------ */

const printBtn = getEl("print-btn");

if (printBtn) {
  printBtn.addEventListener("click", () => {
    window.print();
  });
}

/* -----------------------------
   SHARE
------------------------------ */

const shareBtn = getEl("share-btn");

if (shareBtn) {
  shareBtn.addEventListener("click", async () => {
    const topId = window.__TOP_PERSONALITY__;
    if (!topId) return;

    const shareUrl = `https://creativyn.github.io/fated-character-quiz/#/result/${topId}`;

    const shareText = document.getElementById("top-result")?.textContent || "";

    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Fated Character Result",
          text: shareText,
          url: shareUrl,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        alert("Share link copied!");
      } else {
        prompt("Copy this link:", shareUrl);
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  });
}

/* -----------------------------
   MESSAGES (WIX)
------------------------------ */

window.addEventListener("message", (event) => {
  const { type, payload } = event.data || {};

  switch (type) {
    case "FATED_SHOW_RESULT": {
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
    }

    case "FATED_SHOW_QUIZ":
      showQuiz();
      break;

    case "FATED_REFRESH_LAYOUT":
      break;
  }
});

/* -----------------------------
   BOOT
------------------------------ */

bootApp();
