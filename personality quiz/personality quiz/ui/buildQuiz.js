export function buildQuiz(QUESTIONS) {
  const container = document.getElementById("questions-container");

  if (!container) {
    console.error("buildQuiz: missing #questions-container");
    return;
  }

  if (!Array.isArray(QUESTIONS) || QUESTIONS.length === 0) {
    console.error("buildQuiz: invalid QUESTIONS");
    return;
  }

  container.innerHTML = "";

  try {
    QUESTIONS.forEach((q, i) => {
      const questionEl = document.createElement("div");
      questionEl.className = "question";

      const answers = q.answers
        .map(
          (a) => `
            <label class="answer">
              <input type="radio" name="q${i}" value="${a.value}" />
              <span>${a.text}</span>
            </label>
          `,
        )
        .join("");

      questionEl.innerHTML = `
        <h3>${q.text}</h3>
        <div class="answers">${answers}</div>
      `;

      container.appendChild(questionEl);
    });

    console.log(`buildQuiz: rendered ${QUESTIONS.length} questions`);
  } catch (err) {
    console.error("buildQuiz crashed:", err);
  }
}
