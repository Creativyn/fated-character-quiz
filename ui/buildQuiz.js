export function buildQuiz(QUESTIONS) {
  console.log("🔥 buildQuiz CALLED");
  console.log("QUESTIONS RECEIVED:", QUESTIONS);

  const container = document.querySelector("#questions-container");

  if (!container) {
    console.error("❌ #questions-container NOT FOUND in DOM");
    return;
  }

  if (!Array.isArray(QUESTIONS)) {
    console.error("❌ QUESTIONS is not an array:", QUESTIONS);
    return;
  }

  container.innerHTML = "";

  QUESTIONS.forEach((q, index) => {
    if (!q || !q.answers) {
      console.warn("Skipping invalid question:", q);
      return;
    }

    const fieldset = document.createElement("fieldset");
    fieldset.className = "question";

    const legend = document.createElement("legend");
    legend.textContent = q.question || `Question ${index + 1}`;

    const answersDiv = document.createElement("div");
    answersDiv.className = "answers";

    q.answers.forEach((a) => {
      const label = document.createElement("label");
      label.className = "answer";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = q.id;
      input.value = a.value;

      label.appendChild(input);
      label.appendChild(document.createTextNode(a.text));

      answersDiv.appendChild(label);
    });

    fieldset.appendChild(legend);
    fieldset.appendChild(answersDiv);

    container.appendChild(fieldset);
  });

  console.log("✅ Quiz rendered. Questions:", container.children.length);
}
