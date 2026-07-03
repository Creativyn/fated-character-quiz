import { VNState } from "../VNState.js";
import { calculateResults } from "../../logic/calculateResults.js";

const sceneContainer = () => document.getElementById("scene-container");

const progressBar = () => document.getElementById("quiz-progress");

const progressText = () => document.getElementById("progress-text");

let resolveScene = null;

function updateProgress() {
  const current = VNState.getCurrentIndex() + 1;
  const total = VNState.getQuestionCount();

  const bar = progressBar();

  if (bar) {
    bar.max = total;
    bar.value = current;
    bar.setAttribute("aria-valuenow", current);
    bar.setAttribute("aria-valuemax", total);
  }

  const label = progressText();

  if (label) {
    label.textContent = `Question ${current} of ${total}`;
  }
}

function createChoice(answer, selected) {
  return `
    <label class="vn-choice">

      <input
        type="radio"
        name="vn-answer"
        value="${answer.value}"
        ${selected ? "checked" : ""}
      >

      <span>${answer.text}</span>

    </label>
  `;
}

function renderQuestion() {
  const question = VNState.getCurrentQuestion();

  if (!question) {
    return;
  }

  updateProgress();

  const currentIndex = VNState.getCurrentIndex();

  const selected = VNState.getAnswer(currentIndex);

  sceneContainer().innerHTML = `
    <article class="vn-question-card fade-in">

      <h2 class="question-title">
        ${question.text}
      </h2>

      <div class="vn-answer-list">

        ${question.answers
          .map((answer) => createChoice(answer, answer.value === selected))
          .join("")}

      </div>

      <div class="vn-navigation">

        <button
          id="previous-question"
          type="button"
          ${VNState.hasPrevious() ? "" : "disabled"}
        >
          Previous
        </button>

        <button
          id="next-question"
          type="button"
          disabled
        >
          ${VNState.hasNext() ? "Next" : "Reveal My Fate"}
        </button>

      </div>

    </article>
  `;

  const checked = sceneContainer().querySelector("input:checked");

  const next = document.getElementById("next-question");

  if (checked && next) {
    next.disabled = false;
  }

  hookChoiceEvents();
  hookNavigation();
}

function hookChoiceEvents() {
  const radios = sceneContainer().querySelectorAll('input[name="vn-answer"]');

  const next = document.getElementById("next-question");

  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      VNState.setAnswer(VNState.getCurrentIndex(), radio.value);

      if (next) {
        next.disabled = false;
      }
    });
  });
}

function hookNavigation() {
  const next = document.getElementById("next-question");

  const prev = document.getElementById("previous-question");

  if (next) {
    next.onclick = () => {
      const isLast = !VNState.hasNext();

      // NOT LAST QUESTION → move forward
      if (!isLast) {
        VNState.nextQuestion();
        renderQuestion();
        return;
      }

      // LAST QUESTION → finish quiz properly
      finishQuiz();

      // resolve engine ONLY here
      if (resolveScene) {
        resolveScene();
      }
    };
  }

  if (prev) {
    prev.onclick = () => {
      VNState.previousQuestion();
      renderQuestion();
    };
  }
}

function hookKeyboard() {
  document.onkeydown = (e) => {
    const key = e.key.toLowerCase();

    if (key === "arrowright" || key === "enter") {
      document.getElementById("next-question")?.click();
    }

    if (key === "arrowleft") {
      document.getElementById("previous-question")?.click();
    }
  };
}

function finishQuiz() {
  const results = calculateResults({
    answers: VNState.getAnswers(),
    personalities: VNState.personalities,
    questions: VNState.questions,
  });

  VNState.setResults(results);
}

/* =========================
   MAIN ENTRY POINT
========================= */

export const QuestionScene = {
  async run() {
    VNState.currentQuestion = 0;

    const container = sceneContainer();

    if (!container) {
      throw new Error("Missing scene-container");
    }

    hookKeyboard();
    renderQuestion();

    return new Promise((resolve) => {
      resolveScene = resolve;
    });
  },
};
