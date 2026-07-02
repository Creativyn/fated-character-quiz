console.log("🔥 buildQuiz loaded");

export function buildQuiz(QUESTIONS) {
  const container = document.querySelector("#questions-container");

  if (!container) {
    console.error("Missing container");
    return;
  }

  container.innerHTML = "";

  QUESTIONS.forEach((q, i) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "question";

    const legend = document.createElement("legend");
    legend.textContent = `${i + 1}. ${q.question}`;

    const answersWrap = document.createElement("div");
    answersWrap.className = "answers";

    q.answers.forEach((a) => {
      const label = document.createElement("label");
      label.className = "answer";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${i}`;
      input.value = a.value;

      const span = document.createElement("span");
      span.textContent = a.text;

      label.appendChild(input);
      label.appendChild(span);

      answersWrap.appendChild(label);
    });

    fieldset.appendChild(legend);
    fieldset.appendChild(answersWrap);

    container.appendChild(fieldset);
  });

  console.log("Quiz rendered:", QUESTIONS.length);
}
