export function buildQuiz(QUESTIONS) {
  console.log("buildQuiz CALLED");

  const container = document.getElementById("questions-container");

  if (!container) {
    console.error("No questions container found");
    return;
  }

  container.innerHTML = "";

  QUESTIONS.forEach((q, index) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "question";

    const legend = document.createElement("legend");
    legend.textContent = `${index + 1}. ${q.question}`;

    fieldset.appendChild(legend);

    const answersWrap = document.createElement("div");
    answersWrap.className = "answers";

    q.answers.forEach((a) => {
      const label = document.createElement("label");
      label.className = "answer";

      label.innerHTML = `
        <input type="radio" name="q${index}" value="${a.value}" />
        <span>${a.text}</span>
      `;

      answersWrap.appendChild(label);
    });

    fieldset.appendChild(answersWrap);
    container.appendChild(fieldset);
  });
}
