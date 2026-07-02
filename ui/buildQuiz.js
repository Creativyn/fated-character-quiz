console.log("🔥 buildQuiz CALLED");

export function buildQuiz(QUESTIONS) {
  const container = document.querySelector("#questions-container");

  console.log("Container:", container);

  if (!container) {
    console.error("❌ questions-container not found");
    return;
  }

  container.innerHTML = "";

  QUESTIONS.forEach((q, index) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "question";

    fieldset.innerHTML = `
      <legend>${index + 1}. ${q.question}</legend>
      <div class="answers">
        ${q.answers
          .map(
            (a) => `
          <label class="answer">
            <input type="radio" name="q${q.id}" value="${a.value}" />
            ${a.text}
          </label>
        `,
          )
          .join("")}
      </div>
    `;

    container.appendChild(fieldset);
  });

  console.log("✅ Quiz rendered:", container.children.length);
}
