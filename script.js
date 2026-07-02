import { QUESTIONS } from "./data/questions.js";
import { PERSONALITIES } from "./config/personalities.js";
import { buildQuiz } from "./ui/buildQuiz.js";
import { renderResults } from "./ui/renderResults.js";
import { calculateResults } from "./logic/calculateResults.js";

/* =========================
   SCREEN HELPERS
========================= */

function showScreen(name) {
  const quiz = document.getElementById("quiz-section");
  const results = document.getElementById("results-section");

  quiz.classList.remove("active");
  results.classList.remove("active");

  if (name === "quiz") quiz.classList.add("active");
  if (name === "results") results.classList.add("active");
}

/* =========================
   DOM WAIT
========================= */

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

/* =========================
   STATE
========================= */

let quizForm;
let validationMessage;

/* =========================
   SCROLL TO UNANSWERED
========================= */

function scrollToFirstUnanswered() {
  const questions = document.querySelectorAll(".question");

  for (let i = 0; i < QUESTIONS.length; i++) {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);

    if (!selected) {
      const el = questions[i];

      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        el.classList.add("missing");
        setTimeout(() => el.classList.remove("missing"), 1200);
      }

      return true;
    }
  }

  return false;
}

/* =========================
   RESULT BUTTONS
========================= */

function initResultButtons() {
  const retakeBtn = document.getElementById("retake-btn");
  const printBtn = document.getElementById("print-btn");
  const shareBtn = document.getElementById("share-btn");

  retakeBtn?.addEventListener("click", () => {
    quizForm?.reset();
    showScreen("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  printBtn?.addEventListener("click", () => {
    window.print();
  });

  shareBtn?.addEventListener("click", async () => {
    const topId = window.__TOP_PERSONALITY__;
    if (!topId) return;

    const url = `${window.location.origin}${window.location.pathname}#/result/${topId}`;

    const text =
      document.getElementById("top-result")?.textContent || "My result";

    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Fated Character Result",
          text,
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
}

/* =========================
   SHOW RESULTS
========================= */

function showResults(results) {
  const top = results?.[0];
  if (!top) return;

  renderResults(results);

  window.__TOP_PERSONALITY__ = top.id;

  showScreen("results");
  initResultButtons();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =========================
   SHOW QUIZ
========================= */

function showQuiz() {
  showScreen("quiz");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =========================
   BOOT
========================= */

async function bootApp() {
  await waitForElement("#questions-container");

  buildQuiz(QUESTIONS);

  quizForm = document.getElementById("quiz");
  validationMessage = document.getElementById("validation-message");

  quizForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const missing = scrollToFirstUnanswered();

    if (missing) {
      validationMessage.textContent =
        "Please answer every question before viewing results.";
      return;
    }

    validationMessage.textContent = "";

    const formData = new FormData(quizForm);

    const results = calculateResults({
      formData,
      personalities: PERSONALITIES,
      questions: QUESTIONS,
    });

    showResults(results);
  });

  console.log("Boot complete");
}

bootApp();

/* =========================
   MESSAGE API
========================= */

window.addEventListener("message", (event) => {
  const { type, payload } = event.data || {};

  switch (type) {
    case "FATED_SHOW_RESULT": {
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

    case "FATED_SHOW_QUIZ": {
      showQuiz();
      break;
    }
  }
});
