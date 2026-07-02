import { QUESTIONS } from "./data/questions.js";
import { PERSONALITIES } from "./config/personalities.js";
import { buildQuiz } from "./ui/buildQuiz.js";
import { renderResults } from "./ui/renderResults.js";
import { calculateResults } from "./logic/calculateResults.js";

console.log("SCRIPT LOADED");

const quizForm = document.getElementById("quiz");
const quizSection = document.getElementById("quiz-section");
const resultsSection = document.getElementById("results-section");
const validationMessage = document.getElementById("validation-message");

const retakeBtn = document.getElementById("retake-btn");
const printBtn = document.getElementById("print-btn");
const shareBtn = document.getElementById("share-btn");

/* -----------------------------
   STABLE RESIZE (Wix + GH Pages safe)
------------------------------ */
function sendHeight() {
  requestAnimationFrame(() => {
    const height = document.body.scrollHeight;
    window.parent.postMessage({ type: "FATED_QUIZ_RESIZE", height }, "*");
  });
}

function initResize() {
  const ro = new ResizeObserver(sendHeight);
  ro.observe(document.body);

  const mo = new MutationObserver(sendHeight);
  mo.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });

  window.addEventListener("load", sendHeight);
}

/* -----------------------------
   BOOT
------------------------------ */
async function bootApp() {
  console.log("BOOT START");

  // allow DOM + iframe settle
  await new Promise((r) => setTimeout(r, 50));

  const container = document.getElementById("questions-container");

  if (!container) {
    console.error("questions-container missing");
    return;
  }

  buildQuiz(QUESTIONS);

  initResize();

  requestAnimationFrame(() => {
    showQuiz();
    sendHeight();
  });

  console.log("BOOT COMPLETE");
}

/* -----------------------------
   UI
------------------------------ */
function showQuiz() {
  quizSection.classList.remove("hidden");
  resultsSection.classList.add("hidden");
}

function showResults(results) {
  const top = results?.[0];
  if (!top) return;

  renderResults(results);

  quizSection.classList.add("hidden");
  resultsSection.classList.remove("hidden");

  window.__TOP_PERSONALITY__ = top.id;

  window.scrollTo({ top: 0, behavior: "smooth" });

  postResult(top);
  sendHeight();
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
   SUBMIT FIX (THIS WAS BREAKING YOU)
------------------------------ */
if (quizForm) {
  quizForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const answeredCount = QUESTIONS.filter((_, i) =>
      quizForm.querySelector(`input[name="q${i}"]:checked`),
    ).length;

    if (answeredCount < QUESTIONS.length) {
      validationMessage.textContent =
        "Please answer every question before viewing your results.";

      const firstMissing = QUESTIONS.findIndex(
        (_, i) => !quizForm.querySelector(`input[name="q${i}"]:checked`),
      );

      document
        .querySelectorAll(".question")
        [firstMissing]?.scrollIntoView({ behavior: "smooth", block: "center" });

      return;
    }

    validationMessage.textContent = "";

    const results = calculateResults({
      formData: new FormData(quizForm),
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
  sendHeight();
});

printBtn?.addEventListener("click", () => window.print());

shareBtn?.addEventListener("click", async () => {
  const topId = window.__TOP_PERSONALITY__;
  if (!topId) return;

  const url = `https://creativyn.github.io/fated-character-quiz/#/result/${topId}`;

  if (navigator.share) {
    await navigator.share({
      title: "My Fated Character Result",
      url,
    });
  } else {
    navigator.clipboard?.writeText(url);
    alert("Copied!");
  }
});

/* -----------------------------
   INIT
------------------------------ */
bootApp();
