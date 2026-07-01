import { QUESTIONS } from "./data/questions.js";
import { PERSONALITIES } from "./config/personalities.js";
import { buildQuiz } from "./ui/buildQuiz.js";
import { renderResults } from "./ui/renderResults.js";
import { calculateResults } from "./logic/calculateResults.js";

console.log("SCRIPT LOADED");
console.log("buildQuiz:", buildQuiz);
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

/* -----------------------------
   WAIT UTILITY
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

let ro;
let mo;

function requestResize() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
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
    });
  });
}

export function initWixResize() {
  if (window.__WIX_INIT__) return;
  window.__WIX_INIT__ = true;

  const sendHeight = requestResize;

  // ResizeObserver
  ro = new ResizeObserver(() => {
    sendHeight();
  });
  ro.observe(document.body);

  // MutationObserver (Wix injection safety)
  mo = new MutationObserver(() => {
    sendHeight();
  });

  mo.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });

  // Fonts/images/load fallback
  window.addEventListener("load", sendHeight);

  document.querySelectorAll("img").forEach((img) => {
    if (!img.complete) {
      img.addEventListener("load", sendHeight, { once: true });
    }
  });

  // first paint sync
  requestAnimationFrame(sendHeight);
}

/* -----------------------------
   RESULT MESSAGE
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

  requestResize();
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

  requestResize();
}

/* -----------------------------
   INIT
------------------------------ */

async function bootApp() {
  console.log("🚀 Boot starting...");

  await waitForElement("#questions-container");

  initWixResize();

  buildQuiz(QUESTIONS);

  requestAnimationFrame(() => {
    showQuiz();
  });

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
}

bootApp();

/* -----------------------------
   BUTTONS
------------------------------ */

if (retakeBtn) {
  retakeBtn.addEventListener("click", () => {
    quizForm.reset();
    window.history.replaceState({}, "", window.location.pathname);
    showQuiz();
  });
}

if (printBtn) {
  printBtn.addEventListener("click", () => window.print());
}

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
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        alert("Share link copied!");
      } else {
        prompt("Copy this link:", shareUrl);
      }
    } catch (err) {
      console.error(err);
    }
  });
}

/* -----------------------------
   MESSAGES
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
      requestResize();
      break;
  }
});
