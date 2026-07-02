import { quizState } from "../state/quizState.js";
import { generateResultCard } from "../utils/shareCard.js";

export function initResultButtons({ onRetake }) {
  const retakeBtn = document.getElementById("retake-btn");
  const printBtn = document.getElementById("print-btn");
  const shareBtn = document.getElementById("share-btn");

  retakeBtn?.addEventListener("click", () => {
    onRetake?.();
  });

  printBtn?.addEventListener("click", () => {
    window.print();
  });

  shareBtn?.addEventListener("click", async () => {
    const personality = quizState.topPersonality;
    if (!personality) return;

    const image = await generateResultCard(personality);

    if (navigator.share && image) {
      const blob = await (await fetch(image)).blob();
      const file = new File([blob], "result.png", { type: "image/png" });

      navigator.share({
        title: "My Fated Result",
        files: [file],
      });
    }
  });
}
