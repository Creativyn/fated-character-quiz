console.log("🔥 buildQuiz loaded");

export function buildQuiz(QUESTIONS) {
  console.log("A. buildQuiz entered");

  const container = document.getElementById("questions-container");

  console.log("container:", container);
  console.log("QUESTIONS:", QUESTIONS?.length);

  if (!container) {
    console.error("❌ questions-container not found");
    return;
  }

  container.innerHTML = "";

  QUESTIONS.forEach((q, i) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "question";

    const legend = document.createElement("legend");
    legend.textContent = q.question;

    fieldset.appendChild(legend);

    q.answers.forEach((a) => {
      const label = document.createElement("label");
      label.className = "answer";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${i}`;
      input.value = a.personality;

      label.appendChild(input);
      label.appendChild(document.createTextNode(a.text));

      fieldset.appendChild(label);
    });

    container.appendChild(fieldset);
  });

  console.log("✅ Quiz rendered:", container.children.length);
}
