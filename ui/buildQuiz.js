export function buildQuiz(QUESTIONS) {
  const container = document.getElementById("questions-container");

  if (!container) return;

  container.innerHTML = "";

  QUESTIONS.forEach((q, i) => {
    // ✅ SUPER SAFE QUESTION PICKUP (this is the real fix)
    const questionText =
      q.question ?? q.text ?? q.prompt ?? q.title ?? `Question ${i + 1}`;

    const answers = q.answers ?? q.options ?? [];

    const fieldset = document.createElement("fieldset");
    fieldset.className = "question";

    const legend = document.createElement("legend");
    legend.textContent = `${i + 1}. ${questionText}`;

    const answersWrap = document.createElement("div");
    answersWrap.className = "answers";

    answers.forEach((a) => {
      const value = typeof a === "string" ? a : (a.value ?? a.text ?? a.label);
      const label = typeof a === "string" ? a : (a.text ?? a.label ?? value);

      const answerLabel = document.createElement("label");
      answerLabel.className = "answer";

      answerLabel.innerHTML = `
        <input type="radio" name="q${i}" value="${value}">
        <span>${label}</span>
      `;

      answersWrap.appendChild(answerLabel);
    });

    fieldset.appendChild(legend);
    fieldset.appendChild(answersWrap);
    container.appendChild(fieldset);
  });

  console.log("✅ buildQuiz rendered:", QUESTIONS.length);
}
