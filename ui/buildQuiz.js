console.log("🔥 buildQuiz loaded");

export function buildQuiz(QUESTIONS) {
  console.log("A. buildQuiz entered");

  const container = document.querySelector("#questions-container");

  if (!container) {
    console.error("❌ #questions-container NOT FOUND");
    return;
  }

  container.innerHTML = "";

  console.log("APPENDING INTO:", container);

  QUESTIONS.forEach((q, index) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "question";

    const legend = document.createElement("legend");
    legend.textContent = q.text || q.question || `Question ${index + 1}`;

    fieldset.appendChild(legend);

    const answers = q.answers || q.options || [];

    const wrapper = document.createElement("div");
    wrapper.className = "answers";

    answers.forEach((a) => {
      const label = document.createElement("label");
      label.className = "answer";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = q.id || `q${index}`;
      input.value = a.value ?? a;

      label.appendChild(input);
      label.appendChild(document.createTextNode(a.text ?? a));

      wrapper.appendChild(label);
    });

    fieldset.appendChild(wrapper);
    container.appendChild(fieldset);
  });

  console.log("✅ QUESTIONS RENDERED:", container.children.length);
}
