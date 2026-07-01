/* -----------------------------
   Retake
------------------------------ */

console.log("Registering Retake listener");

retakeBtn.addEventListener("click", () => {
  console.log("Retake clicked");

  quizForm.reset();

  validationMessage.textContent = "";

  window.history.replaceState({}, "", window.location.pathname);

  showQuiz();
});

/* -----------------------------
   Print
------------------------------ */

console.log("Registering Print listener");

printBtn.addEventListener("click", () => {
  console.log("Print clicked");
  window.print();
});

/* -----------------------------
   Share
------------------------------ */

console.log("Registering Share listener");

shareBtn.addEventListener("click", async () => {
  console.log("Share clicked");

  const topId = window.__TOP_PERSONALITY__;

  if (!topId) return;

  // ...existing share code...
});
