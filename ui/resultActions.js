import { VNState } from "../vn/VNState.js";
import { generateResultCard } from "../utils/shareCard.js";

export function initResultButtons({ onRetake, onHome, onExplore } = {}) {
  const retakeBtn = document.getElementById("retake-btn");
  const printBtn = document.getElementById("print-btn");
  const shareBtn = document.getElementById("share-btn");
  const homeBtn = document.getElementById("home-btn");
  const exploreBtn = document.getElementById("explore-btn");

  retakeBtn?.addEventListener("click", () => {
    onRetake?.();
  });

  printBtn?.addEventListener("click", () => {
    window.print();
  });

  homeBtn?.addEventListener("click", () => {
    if (onHome) {
      onHome();
    } else {
      window.location.href = "./";
    }
  });

  exploreBtn?.addEventListener("click", () => {
    if (onExplore) {
      onExplore();
    } else {
      window.location.href = "./characters";
    }
  });

  shareBtn?.addEventListener("click", async () => {
    try {
      const results = VNState.getResults();

      if (!results || results.length === 0) {
        console.warn("No results available to share.");
        return;
      }

      const personality = results[0];

      const image = await generateResultCard(personality);

      const url = window.location.href;

      if (navigator.share) {
        const data = {
          title: personality.name,
          text: personality.description ?? "",
          url,
        };

        if (image) {
          try {
            const blob = await (await fetch(image)).blob();

            data.files = [
              new File([blob], "result.png", { type: "image/png" }),
            ];
          } catch (_) {
            // Ignore image failures and share text instead.
          }
        }

        await navigator.share(data);
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
  });
}
