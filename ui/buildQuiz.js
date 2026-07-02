export function buildQuiz(QUESTIONS) {
  console.log("BUILD QUIZ");

  const container = document.getElementById("questions-container");
  if (!container) return;

  container.innerHTML = "";

  QUESTIONS.forEach((q, index) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "question";

    const legend = document.createElement("legend");
    legend.textContent = q.question;

    const answersDiv = document.createElement("div");
    answersDiv.className = "answers";

    q.answers.forEach((answer) => {
      const label = document.createElement("label");
      label.className = "answer";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${index}`;
      input.value = answer.value;

      label.appendChild(input);
      label.appendChild(document.createTextNode(answer.text));

      answersDiv.appendChild(label);
    });

    fieldset.appendChild(legend);
    fieldset.appendChild(answersDiv);
    container.appendChild(fieldset);
  });
}
