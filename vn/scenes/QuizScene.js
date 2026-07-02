import { VNState } from "../state/VNState.js";
import { calculateResults } from "../../logic/calculateResults.js";

export const QuizScene = {
  async run() {
    const container = document.getElementById("questions-container");

    if (!container) throw new Error("Missing quiz container");

    container.innerHTML = "";

    const QUESTIONS = VNState.questions;

    QUESTIONS.forEach((q, i) => {
      const el = document.createElement("div");
      el.className = "question";

      el.innerHTML = `
        <h3>${q.text}</h3>
        <div class="answers">
          ${q.answers
            .map(
              (a) => `
            <label class="answer">
              <input type="radio" name="q${i}" value="${a.value}">
              <span>${a.text}</span>
            </label>
          `,
            )
            .join("")}
        </div>
      `;

      container.appendChild(el);
    });

    return new Promise((resolve) => {
      const form = document.getElementById("quiz");

      form.onsubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        const results = calculateResults({
          formData,
          personalities: VNState.personalities,
          questions: VNState.questions,
        });

        VNState.setResults(results);
        resolve();
      };
    });
  },
};
