export function buildQuiz(QUESTIONS) {
  const container = document.getElementById("questions-container");
  if (!container) return;

  container.innerHTML = "";

  QUESTIONS.forEach((q, i) => {
    const questionText = q.question ?? q.text ?? `Question ${i + 1}`;
    const answers = q.answers ?? [];

    const fieldset = document.createElement("fieldset");
    fieldset.className = "question";

    const legend = document.createElement("legend");
    legend.textContent = `${i + 1}. ${questionText}`;

    const wrap = document.createElement("div");
    wrap.className = "answers";

    answers.forEach((a) => {
      const value = a.value ?? a.text;

      const label = document.createElement("label");
      label.className = "answer";

      label.innerHTML = `
        <input type="radio" name="q${i}" value="${value}">
        <span class="answer-text">${a.text}</span>
      `;

      wrap.appendChild(label);
    });

    fieldset.appendChild(legend);
    fieldset.appendChild(wrap);
    container.appendChild(fieldset);
  });
}
