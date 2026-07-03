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

  if (!container) {
    return;
  }

  const question = VNState.getCurrentQuestion();

  if (!question) {
    return;
  }

  updateProgress();

  const currentIndex = VNState.getCurrentIndex();
  const selectedAnswer = VNState.getAnswer(currentIndex);

  container.innerHTML = `
    <article class="vn-question-card fade-in">

      <h2 class="question-title">
        ${question.text}
      </h2>

      <div class="vn-answer-list">
        ${question.answers
          .map((answer) =>
            createChoice(answer, answer.value === selectedAnswer),
          )
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
          ${selectedAnswer ? "" : "disabled"}
        >
          ${VNState.hasNext() ? "Next" : "Reveal My Fate"}
        </button>

      </div>

    </article>
  `;

  hookChoiceEvents();
  hookNavigation();
}

function hookChoiceEvents() {
  const radios = sceneContainer().querySelectorAll('input[name="vn-answer"]');

  const nextButton = document.getElementById("next-question");

  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      VNState.setAnswer(VNState.getCurrentIndex(), radio.value);

      if (nextButton) {
        nextButton.disabled = false;
      }
    });
  });
}

function finishQuiz() {
  const results = calculateResults({
    answers: VNState.getAnswers(),
    personalities: VNState.personalities,
    questions: VNState.questions,
  });

  VNState.setResults(results);
}

function hookNavigation() {
  const nextButton = document.getElementById("next-question");
  const previousButton = document.getElementById("previous-question");

  if (previousButton) {
    previousButton.onclick = () => {
      VNState.previousQuestion();
      renderQuestion();
    };
  }

  if (nextButton) {
    nextButton.onclick = () => {
      if (VNState.hasNext()) {
        VNState.nextQuestion();
        renderQuestion();
        return;
      }

      finishQuiz();

      if (resolveScene) {
        const resolve = resolveScene;
        resolveScene = null;
        resolve();
      }
    };
  }
}

function hookKeyboard() {
  document.onkeydown = (event) => {
    const key = event.key.toLowerCase();

    if (key === "arrowright" || key === "enter") {
      document.getElementById("next-question")?.click();
    }

    if (key === "arrowleft") {
      document.getElementById("previous-question")?.click();
    }
  };
}

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
