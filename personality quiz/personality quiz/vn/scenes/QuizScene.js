import { VNState } from "../state/VNState.js";
import { calculateResults } from "../../logic/calculateResults.js";

export const QuizScene = {
  async run() {
    const container = document.getElementById("questions-container");

    if (!container) {
      throw new Error("Missing questions-container");
    }

    container.innerHTML = "";

    VNState.questions.forEach((q, index) => {
      const question = document.createElement("div");
      question.className = "question";

      question.innerHTML = `
        <h3>${q.text}</h3>
        <div class="answers">
          ${q.answers
            .map(
              (answer) => `
            <label class="answer">
              <input
                type="radio"
                name="q${index}"
                value="${answer.value}"
                required
              >
              <span>${answer.text}</span>
            </label>
          `,
            )
            .join("")}
        </div>
      `;

      container.appendChild(question);
    });

    return new Promise((resolve) => {
      const form = document.getElementById("quiz");

      const submitHandler = (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        const results = calculateResults({
          formData,
          personalities: VNState.personalities,
          questions: VNState.questions,
        });

        VNState.setResults(results);

        form.removeEventListener("submit", submitHandler);

        resolve();
      };

      form.addEventListener("submit", submitHandler);
    });
  },
};
