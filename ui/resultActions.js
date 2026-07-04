import { VNState } from "../vn/VNState.js";
import { generateResultCard } from "../utils/shareCard.js";

export function initResultButtons({ onRetake, onHome, onExplore } = {}) {
  const retakeBtn = document.getElementById("retake-btn");
  const printBtn = document.getElementById("print-btn");
  const shareBtn = document.getElementById("share-btn");
  const homeBtn = document.getElementById("home-btn");
  const exploreBtn = document.getElementById("explore-btn");

  /* =========================
     BASIC BUTTONS
  ========================= */

  retakeBtn.onclick = () => onRetake?.();

  printBtn.onclick = () => window.print();

  homeBtn.onclick = () => {
    if (onHome) onHome();
    else window.location.href = "./";
  };

  exploreBtn.onclick = () => {
    if (onExplore) onExplore();
    else window.location.href = "./characters";
  };

  /* =========================
     SAFE SHARE (FIXED)
  ========================= */

  shareBtn.onclick = async () => {
    try {
      // PRIMARY SOURCE: VNState
      let personality = VNState.getTopResult?.();

      // FALLBACK: DOM extraction (IMPORTANT SAFETY NET)
      if (!personality) {
        const firstCard = document.querySelector(".result-card");

        if (firstCard) {
          personality = {
            name:
              firstCard.querySelector(".result-title span")?.textContent ??
              "Result",
            description: "",
          };
        }
      }

      if (!personality) {
        console.warn("No result available to share.");
        return;
      }

      const image = await generateResultCard(personality);

      const url = window.location.href;

      /* =========================
         WEB SHARE API
      ========================= */

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

      /* =========================
         CLIPBOARD FALLBACK
      ========================= */

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
