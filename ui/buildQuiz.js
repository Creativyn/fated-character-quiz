console.log("🔥 buildQuiz loaded");

export function buildQuiz(QUESTIONS) {
  const container = document.querySelector("#questions-container");

  if (!container) {
    console.error("❌ questions-container not found");
    return;
  }

  container.innerHTML = "";

  QUESTIONS.forEach((q, index) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "question";

    const legend = document.createElement("legend");
    legend.textContent = `${index + 1}. ${q.text}`;
    fieldset.appendChild(legend);

    const answersWrap = document.createElement("div");
    answersWrap.className = "answers";

    q.answers.forEach((a) => {
      const label = document.createElement("label");
      label.className = "answer";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = q.id;
      input.value = a.value;

      label.appendChild(input);
      label.appendChild(document.createTextNode(a.text));

      answersWrap.appendChild(label);
    });

    fieldset.appendChild(answersWrap);
    container.appendChild(fieldset);
  });

  console.log("✅ Quiz rendered:", QUESTIONS.length);
}
