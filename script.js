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
   RESIZE (Wix-safe single source)
------------------------------ */

function sendHeight() {
  const height = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
  );

  window.parent.postMessage({ type: "FATED_QUIZ_RESIZE", height }, "*");
}

function initResize() {
  const ro = new ResizeObserver(() => {
    requestAnimationFrame(sendHeight);
  });

  ro.observe(document.body);

  window.addEventListener("load", sendHeight);
}

/* -----------------------------
   UI STATE
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

  initResize();

  showQuiz();

  requestAnimationFrame(sendHeight);

  console.log("✅ Boot complete");
}

/* -----------------------------
   QUIZ SUBMIT
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
  const shareText = document.getElementById("top-result")?.textContent || "";

  try {
    if (navigator.share) {
      await navigator.share({
        title: "My Fated Character Result",
        text: shareText,
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied!");
    }
  } catch (err) {
    console.error(err);
  }
});

/* -----------------------------
   START
------------------------------ */

requestAnimationFrame(bootApp);
