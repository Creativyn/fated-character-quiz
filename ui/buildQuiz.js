export function buildQuiz(QUESTIONS) {
  console.log("A. buildQuiz entered");

  const container = document.getElementById("questions-container");

  console.log("B. container =", container);

  if (!container) {
    console.error("Container not found");
    return;
  }

  container.innerHTML = "";

  const fragment = document.createDocumentFragment();

  console.log("C. QUESTIONS =", QUESTIONS.length);

  QUESTIONS.forEach((q, index) => {
    console.log("Adding question", index + 1);

    const fieldset = document.createElement("fieldset");
    fieldset.className = "question";

    const legend = document.createElement("legend");
    legend.textContent = `${index + 1}. ${q.text}`;

    fieldset.appendChild(legend);

    fragment.appendChild(fieldset);
  });

  console.log("D. Appending fragment");

  container.appendChild(fragment);

  console.log("E. Done. Child count:", container.children.length);
}

  const fragment = document.createDocumentFragment();

  QUESTIONS.forEach((q, index) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "question";

    const legend = document.createElement("legend");
    legend.textContent = `${index + 1}. ${q.text}`;
    legend.id = q.id;
    fieldset.setAttribute("aria-labelledby", q.id);

    const answersWrap = document.createElement("div");
    answersWrap.className = "answers";

    q.answers.forEach((a) => {
      const label = document.createElement("label");
      label.className = "answer";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = q.id;
      input.value = a.value;
      input.required = true;

      const span = document.createElement("span");
      span.textContent = a.text;

      label.append(input, span);
      answersWrap.appendChild(label);
    });

    fieldset.append(legend, answersWrap);
    fragment.appendChild(fieldset);
  });

  container.appendChild(fragment);
}
