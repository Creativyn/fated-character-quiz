export function showScreen(name) {
  const quiz = document.getElementById("quiz-section");
  const results = document.getElementById("results-section");

  quiz.classList.remove("active");
  results.classList.remove("active");

  if (name === "quiz") quiz.classList.add("active");
  if (name === "results") results.classList.add("active");
}
