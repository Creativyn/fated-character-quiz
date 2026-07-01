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
   Routing
------------------------------ */

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

/* -----------------------------
   Wix iframe resize (SINGLE SOURCE OF TRUTH)
------------------------------ */

let lastHeight = 0;
let resizeTimer;

function reportHeight() {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    const height = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
    );

    if (Math.abs(height - lastHeight) < 2) return;

    lastHeight = height;

    window.parent.postMessage(
      {
        type: "FATED_QUIZ_RESIZE",
        height,
      },
      "*",
    );
  }, 50);
}

function refreshLayout() {
  requestAnimationFrame(() => {
    requestAnimationFrame(reportHeight);
  });
}

document.fonts?.ready?.then(refreshLayout);

/* -----------------------------
   UI
------------------------------ */

function showQuiz() {
  console.log("1. showQuiz()");

  console.log("2. quizSection:", quizSection);
  console.log("3. resultsSection:", resultsSection);

  const container = document.getElementById("questions-container");
  console.log("4. container:", container);

  console.log("5. QUESTIONS length:", QUESTIONS.length);

  buildQuiz(QUESTIONS);

  console.log("6. container after build:", container);
  console.log("7. child count:", container?.children.length);

  quizSection.classList.remove("hidden");
  resultsSection.classList.add("hidden");

  refreshLayout();
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

  refreshLayout();
}

/* -----------------------------
   Init
------------------------------ */
const forcedResultId = getRoute();

if (forcedResultId) {
  const personality = PERSONALITIES.find((p) => p.id === forcedResultId);

  if (personality) {
    showResults([
      {
        ...personality,
        score: 1,
        percent: 100,
      },
    ]);
  }
} else {
  showQuiz(); // builds + reveals quiz correctly
}

/* -----------------------------
   External layout triggers
------------------------------ */

window.addEventListener("load", () => {
  refreshLayout();

  document.querySelectorAll("img").forEach((img) => {
    if (img.complete) return;

    img.addEventListener("load", refreshLayout, { once: true });
  });
});

/* -----------------------------
   Quiz Submission
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

      refreshLayout();
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
   Retake
------------------------------ */

if (retakeBtn) {
  retakeBtn.addEventListener("click", () => {
    quizForm.reset();

    window.history.replaceState({}, "", window.location.pathname);

    showQuiz();
  });
}

/* -----------------------------
   Print
------------------------------ */

if (printBtn) {
  printBtn.addEventListener("click", () => {
    window.print();
  });
}

/* -----------------------------
   Share
------------------------------ */

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
        alert("Share link copied to your clipboard!");
      } else {
        prompt("Copy this link:", shareUrl);
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  });
}

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
      refreshLayout();
      break;
  }
});
