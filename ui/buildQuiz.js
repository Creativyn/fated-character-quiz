export function buildQuiz(QUESTIONS) {
  console.log("BUILD QUIZ");

  const container = document.getElementById("questions-container");

  if (!container) {
    console.error("Missing #questions-container");
    return;
  }

  container.innerHTML = "";

  QUESTIONS.forEach((q) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "question";

    const legend = document.createElement("legend");
    legend.textContent = q.question;

    const answers = document.createElement("div");
    answers.className = "answers";

    q.answers.forEach((a) => {
      const label = document.createElement("label");
      label.className = "answer";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = q.id;
      input.value = a.value;

      label.appendChild(input);
      label.appendChild(document.createTextNode(a.text));

      answers.appendChild(label);
    });

    fieldset.appendChild(legend);
    fieldset.appendChild(answers);

    container.appendChild(fieldset);
  });

  console.log("Rendered:", container.children.length);
}
