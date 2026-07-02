export function buildQuiz(QUESTIONS) {
  const container = document.getElementById("questions-container");

  if (!container) return;

  container.innerHTML = "";

  QUESTIONS.forEach((q, i) => {
    // SAFE fallback for ALL possible schemas
    const questionText = q.question || q.text || q.title || `Question ${i + 1}`;

    const answers = q.answers || q.options || [];

    const fieldset = document.createElement("fieldset");
    fieldset.className = "question";

    const legend = document.createElement("legend");
    legend.textContent = `${i + 1}. ${questionText}`;

    const answersWrap = document.createElement("div");
    answersWrap.className = "answers";

    answers.forEach((a) => {
      const value = typeof a === "string" ? a : a.value || a.text;
      const label = typeof a === "string" ? a : a.text || a.label;

      const el = document.createElement("label");
      el.className = "answer";

      el.innerHTML = `
        <input type="radio" name="q${i}" value="${value}" />
        <span>${label}</span>
      `;

      answersWrap.appendChild(el);
    });

    fieldset.appendChild(legend);
    fieldset.appendChild(answersWrap);

    container.appendChild(fieldset);
  });

  console.log("Quiz rendered:", QUESTIONS.length);
}
