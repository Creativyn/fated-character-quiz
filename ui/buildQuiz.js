console.log("🔥 buildQuiz CALLED");

export function buildQuiz(QUESTIONS) {
  const container = document.getElementById("questions-container");

  if (!container) {
    console.error("❌ questions-container NOT FOUND");
    return;
  }

  container.innerHTML = "";

  QUESTIONS.forEach((q, i) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "question";

    const legend = document.createElement("legend");
    legend.textContent = q.question;

    const answers = document.createElement("div");
    answers.className = "answers";

    q.answers.forEach((a) => {
      const label = document.createElement("label");
      label.className = "answer";

      label.innerHTML = `
        <input type="radio" name="q${i}" value="${a.value}" />
        <span>${a.text}</span>
      `;

      answers.appendChild(label);
    });

    fieldset.appendChild(legend);
    fieldset.appendChild(answers);
    container.appendChild(fieldset);
  });

  console.log("Quiz rendered:", QUESTIONS.length);
}
