import { VNState } from "../VNState.js";
import { calculateResults } from "../../logic/calculateResults.js";

const sceneContainer = () => document.getElementById("scene-container");
const progressBar = () => document.getElementById("quiz-progress");
const progressText = () => document.getElementById("progress-text");

function updateProgress() {
  const current = VNState.getCurrentIndex() + 1;
  const total = VNState.getQuestionCount();

  const percent = Math.round((current / total) * 100);

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

function createChoice(answer, index, selected) {
  return `
    <label class="vn-choice">

      <input
        type="radio"
        name="vn-answer"
        value="${answer.value}"
        ${selected ? "checked" : ""}
      >

      <span>
        ${answer.text}
      </span>

    </label>
  `;
}

function renderQuestion() {
  const question = VNState.getCurrentQuestion();

  if (!question) return;

  updateProgress();

  const currentIndex = VNState.getCurrentIndex();

  const previousAnswer = VNState.getAnswer(currentIndex);

  sceneContainer().innerHTML = `
    <article
      class="vn-question-card fade-in"
    >

      <h2 class="question-title">
        ${question.text}
      </h2>

      <div class="vn-answer-list">

        ${question.answers
          .map((answer) =>
            createChoice(answer, currentIndex, answer.value === previousAnswer),
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
          disabled
        >
          ${VNState.hasNext() ? "Next" : "Reveal My Fate"}
        </button>

      </div>

    </article>
  `;

  const selectedRadio = sceneContainer().querySelector(
    'input[type="radio"]:checked',
  );

  const nextButton = document.getElementById("next-question");

  if (selectedRadio && nextButton) {
    nextButton.disabled = false;
  }

  hookChoiceEvents();
  hookNavigation();
}

function hookChoiceEvents() {
  const radios = sceneContainer().querySelectorAll('input[name="vn-answer"]');

  const nextButton = document.getElementById("next-question");

  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      VNState.setAnswer(VNState.getCurrentIndex(), radio.value);

      nextButton.disabled = false;
    });
  });
}

function finishQuiz() {
  const results = calculateResults({
    answers: VNState.getAnswers(),
    personalities: VNState.personalities,
  });

  VNState.setResults(results);
}
function hookNavigation() {
  const nextButton = document.getElementById("next-question");
  const prevButton = document.getElementById("previous-question");

  if (nextButton) {
    nextButton.onclick = () => {
      const isLast = !VNState.hasNext();

      if (!isLast) {
        VNState.nextQuestion();
        renderQuestion();
        return;
      }

      // LAST QUESTION → compute results + move to fate scene
      finishQuiz();

      // import FateScene dynamically to avoid circular deps
      import("./FateScene.js").then(({ FateScene }) => {
        const results = VNState.getResults();

        FateScene.run({ results });
      });
    };
  }

  if (prevButton) {
    prevButton.onclick = () => {
      VNState.previousQuestion();
      renderQuestion();
    };
  }
}

function hookKeyboard() {
  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();

    if (key === "arrowright" || key === "enter") {
      document.getElementById("next-question")?.click();
    }

    if (key === "arrowleft") {
      document.getElementById("previous-question")?.click();
    }
  });
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
  },
};
