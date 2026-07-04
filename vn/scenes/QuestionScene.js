import { VNState } from "../VNState.js";
import { calculateResults } from "../../logic/calculateResults.js";

const sceneContainer = () => document.getElementById("scene-container");
const progressBar = () => document.getElementById("quiz-progress");
const progressText = () => document.getElementById("progress-text");

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

  const text = progressText();
  if (text) {
    text.textContent = `Question ${current} of ${total}`;
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
  const container = sceneContainer();
  if (!container) return;

  const question = VNState.getCurrentQuestion();
  if (!question) return;

  updateProgress();

  const currentIndex = VNState.getCurrentIndex();
  const selected = VNState.getAnswer(currentIndex);

  container.innerHTML = `
    <article class="vn-question-card fade-in">

      <h2 class="question-title">${question.text}</h2>

      <div class="vn-answer-list">
        ${question.answers
          .map((a) => createChoice(a, a.value === selected))
          .join("")}
      </div>

      <div class="vn-navigation">

        <button id="previous-question" type="button"
          ${VNState.hasPrevious() ? "" : "disabled"}>
          Previous
        </button>

        <button id="next-question" type="button"
          ${selected ? "" : "disabled"}>
          ${VNState.hasNext() ? "Next" : "Reveal My Fate"}
        </button>

      </div>

    </article>
  `;

  hookEvents();
}

function hookEvents() {
  const container = sceneContainer();
  const next = document.getElementById("next-question");
  const prev = document.getElementById("previous-question");

  // prevent duplicate listeners
  next.onclick = null;
  prev.onclick = null;
  document.onkeydown = null;

  container.querySelectorAll('input[name="vn-answer"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      VNState.setAnswer(VNState.getCurrentIndex(), radio.value);
      if (next) next.disabled = false;
    });
  });

  if (prev) {
    prev.onclick = () => {
      VNState.previousQuestion();
      renderQuestion();
    };
  }

  if (next) {
    next.onclick = () => {
      const last = !VNState.hasNext();

      VNState.setAnswer(
        VNState.getCurrentIndex(),
        VNState.getAnswer(VNState.getCurrentIndex()),
      );

      if (!last) {
        VNState.nextQuestion();
        renderQuestion();
        return;
      }

      // FINAL STEP
      const results = calculateResults({
        answers: VNState.getAnswers(),
        personalities: VNState.personalities,
        questions: VNState.questions,
      });

      VNState.setResults(results);

      resolveScene?.();
      resolveScene = null;
    };
  }

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

let resolveScene = null;

export const QuestionScene = {
  async run() {
    VNState.currentQuestion = 0;

    const container = sceneContainer();
    if (!container) throw new Error("Missing scene-container");

    renderQuestion();

    return new Promise((resolve) => {
      resolveScene = resolve;
    });
  },
};
