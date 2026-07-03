import { VNState } from "../vn/state/VNState.js";
import { generateResultCard } from "../utils/shareCard.js";

export function initResultButtons({ onRetake, onHome, onExplore } = {}) {
  const retakeBtn = document.getElementById("retake-btn");
  const printBtn = document.getElementById("print-btn");
  const shareBtn = document.getElementById("share-btn");
  const homeBtn = document.getElementById("home-btn");
  const exploreBtn = document.getElementById("explore-btn");

  retakeBtn.onclick = () => onRetake?.();

  printBtn.onclick = () => window.print();

  homeBtn.onclick = () => {
    if (onHome) {
      onHome();
    } else {
      window.location.href = "./";
    }
  };

  exploreBtn.onclick = () => {
    if (onExplore) {
      onExplore();
    } else {
      window.location.href = "./characters";
    }
  };

  shareBtn.onclick = async () => {
    try {
      const personality = VNState.getTopResult();

      if (!personality) {
        console.warn("No result available to share.");
        return;
      }

      const image = await generateResultCard(personality);

      const url = window.location.href;

      if (navigator.share) {
        if (image) {
          const blob = await (await fetch(image)).blob();

          const file = new File([blob], "result.png", { type: "image/png" });

          await navigator.share({
            title: personality.name,
            text: personality.description ?? "",
            url,
            files: [file],
          });

          return;
        }

        await navigator.share({
          title: personality.name,
          text: personality.description ?? "",
          url,
        });

        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert("Result link copied to clipboard.");
        return;
      }

      prompt("Copy this link:", url);
    } catch (err) {
      console.error("Share failed:", err);
    }
  };
}
