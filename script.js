import { QUESTIONS } from "./data/questions.js";
import { PERSONALITIES } from "./config/personalities.js";
import { buildQuiz } from "./ui/buildQuiz.js";
import { renderResults } from "./ui/renderResults.js";
import { calculateResults } from "./logic/calculateResults.js";

console.log("SCRIPT LOADED");

/* =============================
   DOM HELPERS
============================= */

function $(id) {
  return document.getElementById(id);
}

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

/* =============================
   ELEMENTS (SAFE LOADED LATER)
============================= */

let quizForm,
  quizSection,
  resultsSection,
  validationMessage,
  retakeBtn,
  printBtn,
  shareBtn;

/* =============================
   WIX RESIZE (SINGLE SOURCE)
============================= */

function initWixResize() {
  if (window.__WIX_RESIZE__) return;

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

  const ro = new ResizeObserver(() => {
    requestAnimationFrame(sendHeight);
  });

  ro.observe(document.body);

  window.addEventListener("load", sendHeight);

  requestAnimationFrame(() => {
    requestAnimationFrame(sendHeight);
  });

  window.__WIX_RESIZE__ = ro;
}

/* =============================
   ROUTING
============================= */

function getRoute() {
  const match = window.location.hash.match(/^#\/result\/(.+)$/);
  return match ? match[1] : null;
}

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

/* =============================
   UI
============================= */

function showQuiz() {
  if (!quizSection || !resultsSection) return;

  quizSection.classList.remove("hidden");
  resultsSection.classList.add("hidden");

  requestAnimationFrame(sendResize);
}

function showResults(results) {
  const top = results?.[0];
  if (!top) return;

  renderResults(results);

  if (quizSection && resultsSection) {
    quizSection.classList.add("hidden");
    resultsSection.classList.remove("hidden");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });

  window.__TOP_PERSONALITY__ = top.id;

  postResult(top);

  requestAnimationFrame(sendResize);
}

function sendResize() {
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
}

/* =============================
   INIT APP
============================= */

async function bootApp() {
  console.log("🚀 Boot starting...");

  try {
    await waitForElement("#questions-container");

    quizForm = $("quiz");
    quizSection = $("quiz-section");
    resultsSection = $("results-section");
    validationMessage = $("validation-message");
    retakeBtn = $("retake-btn");
    printBtn = $("print-btn");
    shareBtn = $("share-btn");

    initWixResize();

    buildQuiz(QUESTIONS);

    const forced = getRoute();

    if (forced) {
      const personality = PERSONALITIES.find((p) => p.id === forced);

      if (personality) {
        renderResults([
          {
            ...personality,
            score: 1,
            percent: 100,
          },
        ]);

        showResults([
          {
            ...personality,
            score: 1,
            percent: 100,
          },
        ]);

        return;
      }
    }

    showQuiz();

    sendResize();

    console.log("✅ Boot complete");
  } catch (err) {
    console.error("❌ Boot failed:", err);
  }
}

/* =============================
   EVENTS
============================= */

function setupEvents() {
  if (quizForm) {
    quizForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(quizForm);
      const answeredCount = new Set([...formData.keys()]).size;

      if (answeredCount < QUESTIONS.length) {
        validationMessage.textContent =
          "Please answer every question before viewing your results.";

        validationMessage?.scrollIntoView({
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

  retakeBtn?.addEventListener("click", () => {
    quizForm?.reset();
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
}

/* =============================
   START
============================= */

document.addEventListener("DOMContentLoaded", async () => {
  await bootApp();
  setupEvents();
});
