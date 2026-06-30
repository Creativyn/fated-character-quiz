import { QUESTIONS } from "./questions.js";
import { PERSONALITIES, QUIZ_CONFIG } from "./config.js";

/* =========================
   DOM Elements
========================= */

const quizForm = document.getElementById("quiz");
const questionsContainer = document.getElementById("questions-container");

const resultsSection = document.getElementById("results-section");
const resultsContainer = document.getElementById("results-container");
const topResult = document.getElementById("top-result");

const retakeBtn = document.getElementById("retake-btn");
const shareBtn = document.getElementById("share-btn");
const printBtn = document.getElementById("print-btn");

/* =========================
   Build Questions UI
========================= */

function buildQuiz() {
  questionsContainer.innerHTML = "";

  QUESTIONS.forEach((q, index) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "question";
    fieldset.setAttribute("aria-labelledby", q.id);

    const legend = document.createElement("legend");
    legend.textContent = `${index + 1}. ${q.text}`;
    fieldset.appendChild(legend);

    const answersWrap = document.createElement("div");
    answersWrap.className = "answers";

    q.answers.forEach((a, i) => {
      const label = document.createElement("label");
      label.className = "answer";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = q.id;
      input.value = a.value;
      input.required = true;

      const span = document.createElement("span");
      span.textContent = a.text;

      label.appendChild(input);
      label.appendChild(span);
      answersWrap.appendChild(label);
    });

    fieldset.appendChild(answersWrap);
    questionsContainer.appendChild(fieldset);
  });
}

/* =========================
   Scoring
========================= */

function calculateResults(formData) {
  const scores = {};

  PERSONALITIES.forEach((p) => {
    scores[p.id] = 0;
  });

  for (const [_, value] of formData.entries()) {
    if (scores[value] !== undefined) {
      scores[value] += 1;
    }
  }

  const results = PERSONALITIES.map((p) => {
    const score = scores[p.id] || 0;
    return {
      ...p,
      score,
      percent: Math.round((score / QUESTIONS.length) * 100),
    };
  });

  results.sort((a, b) => b.score - a.score);

  return results;
}

/* =========================
   Render Results
========================= */

function renderResults(results) {
  resultsContainer.innerHTML = "";

  const top = results[0];
  topResult.textContent = `Your top personality is ${top.icon} ${top.name} (${top.percent}%)`;

  results.forEach((p) => {
    const card = document.createElement("div");
    card.className = "result-card";

    const img = document.createElement("img");
    img.src = p.image;
    img.alt = p.name;

    const content = document.createElement("div");

    const title = document.createElement("div");
    title.className = "result-title";
    title.innerHTML = `<span>${p.icon} ${p.name}</span><span>${p.percent}%</span>`;

    const bar = document.createElement("div");
    bar.className = "bar";

    const fill = document.createElement("div");
    fill.className = "bar-fill";
    fill.style.width = `${p.percent}%`;
    fill.style.background = p.color;

    bar.appendChild(fill);

    //const desc = document.createElement("p");
    //desc.textContent = p.description;

    //content.appendChild(title);
    //content.appendChild(bar);
    //content.appendChild(desc);

    const heading = document.createElement("h3");
    heading.className = "result-heading";
    heading.textContent = p.heading;

    const desc = document.createElement("p");
    desc.textContent = p.description;

    content.appendChild(title);
    content.appendChild(bar);
    content.appendChild(heading);
    content.appendChild(desc);

    card.appendChild(img);
    card.appendChild(content);

    resultsContainer.appendChild(card);
  });
}

/* =========================
   Validation
========================= */

function validateQuiz() {
  const unanswered = QUESTIONS.filter((q) => {
    return !quizForm.querySelector(`input[name="${q.id}"]:checked`);
  });

  if (unanswered.length > 0) {
    const first = quizForm.querySelector(`input[name="${unanswered[0].id}"]`);

    first?.focus();
    alert("Please answer all questions before submitting.");
    return false;
  }

  return true;
}

/* =========================
   Submit Handler
========================= */

quizForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (QUIZ_CONFIG.features.validation && !validateQuiz()) return;

  const formData = new FormData(quizForm);
  const results = calculateResults(formData);

  renderResults(results);

  document.getElementById("quiz-section").classList.add("hidden");
  resultsSection.classList.remove("hidden");

  if (QUIZ_CONFIG.features.smoothScroll) {
    resultsSection.scrollIntoView({ behavior: "smooth" });
  }
});

/* =========================
   Retake Quiz
========================= */

retakeBtn.addEventListener("click", () => {
  quizForm.reset();
  resultsSection.classList.add("hidden");
  document.getElementById("quiz-section").classList.remove("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* =========================
   Share Results
========================= */

shareBtn.addEventListener("click", async () => {
  const text = topResult.textContent;

  const shareData = {
    title: "My Personality Quiz Result",
    text,
    url: window.location.href,
  };

  try {
    if (navigator.share && QUIZ_CONFIG.features.shareResults) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      alert("Results copied to clipboard!");
    }
  } catch (err) {
    console.error(err);
  }
});

/* =========================
   Print
========================= */

printBtn.addEventListener("click", () => {
  window.print();
});

/* =========================
   Init
========================= */

buildQuiz();
