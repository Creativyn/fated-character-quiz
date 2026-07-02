export function buildQuiz(QUESTIONS) {
  const container = document.getElementById("questions-container");

  if (!container) return;

  container.innerHTML = "";

  QUESTIONS.forEach((q, i) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "question";

    fieldset.innerHTML = `
      <legend>${i + 1}. ${q.question}</legend>
      <div class="answers">
        ${q.answers
          .map(
            (a) => `
          <label class="answer">
            <input type="radio" name="q${i}" value="${a.value}" />
            <span>${a.text}</span>
          </label>
        `,
          )
          .join("")}
      </div>
    `;

    container.appendChild(fieldset);
  });
}
