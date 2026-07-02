console.log("🔥 buildQuiz loaded");

export function buildQuiz(QUESTIONS) {
  const container = document.querySelector("#questions-container");

  if (!container) {
    console.error("No #questions-container found");
    return;
  }

  container.innerHTML = "";

  QUESTIONS.forEach((q, index) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "question";

    const legend = document.createElement("legend");
    legend.textContent = `${index + 1}. ${q.question}`;

    const answersDiv = document.createElement("div");
    answersDiv.className = "answers";

    q.answers.forEach((answer) => {
      const label = document.createElement("label");
      label.className = "answer";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${index}`;
      input.value = answer.value;

      const span = document.createElement("span");
      span.textContent = answer.text;

      label.appendChild(input);
      label.appendChild(span);

      answersDiv.appendChild(label);
    });

    fieldset.appendChild(legend);
    fieldset.appendChild(answersDiv);

    container.appendChild(fieldset);
  });

  console.log("Quiz rendered:", QUESTIONS.length);
}
