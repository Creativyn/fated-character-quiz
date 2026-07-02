import { QUESTIONS } from "../data/questions.js";

export function scrollToFirstUnanswered() {
  const questions = document.querySelectorAll(".question");

  for (let i = 0; i < QUESTIONS.length; i++) {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);

    if (!selected) {
      const el = questions[i];

      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        el.classList.add("missing");

        setTimeout(() => el.classList.remove("missing"), 1200);
      }

      return true;
    }
  }

  return false;
}
