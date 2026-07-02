import { generateResultCard } from "../utils/shareCard.js";

/* =========================
   SAFE RETRIEVAL
========================= */

function getTopPersonality() {
  // primary source (new system)
  if (window.__TOP_PERSONALITY__) {
    return window.__TOP_PERSONALITY__;
  }

  // fallback from DOM (extra safety layer)
  const topText = document.getElementById("top-result")?.textContent;
  if (!topText) return null;

  return {
    name: topText,
  };
}

/* =========================
   INIT BUTTONS
========================= */

export function initResultButtons({ onRetake } = {}) {
  const retakeBtn = document.getElementById("retake-btn");
  const printBtn = document.getElementById("print-btn");
  const shareBtn = document.getElementById("share-btn");
  const homeBtn = document.getElementById("home-btn");
  const exploreBtn = document.getElementById("explore-btn");

  /* =========================
     RETAKE
  ========================= */

  retakeBtn?.addEventListener("click", () => {
    onRetake?.();
  });

  /* =========================
     PRINT
  ========================= */

  printBtn?.addEventListener("click", () => {
    window.print();
  });

  /* =========================
     HOME NAV
  ========================= */

  homeBtn?.addEventListener("click", () => {
    // safe for GitHub Pages + local
    window.location.href = "./";
  });

  /* =========================
     EXPLORE NAV
  ========================= */

  exploreBtn?.addEventListener("click", () => {
    window.location.href = "./characters";
  });

  /* =========================
     SHARE (ROBUST + FALLBACKS)
  ========================= */

  shareBtn?.addEventListener("click", async () => {
    try {
      const personality = getTopPersonality();

      if (!personality) {
        console.warn("Share aborted: no personality found");
        return;
      }

      const image = await generateResultCard(personality);

      const url = `${window.location.origin}${window.location.pathname}#/result`;

      // =========================
      // CASE 1: FULL SHARE SUPPORT
      // =========================

      if (navigator.share) {
        // image-supported share
        if (image) {
          const blob = await (await fetch(image)).blob();
          const file = new File([blob], "result.png", {
            type: "image/png",
          });

          await navigator.share({
            title: personality.name || "My Fated Result",
            text: personality.heading || "",
            url,
            files: [file],
          });

          return;
        }

        // fallback share (no image)
        await navigator.share({
          title: personality.name || "My Fated Result",
          text: personality.heading || "",
          url,
        });

        return;
      }

      // =========================
      // CASE 2: CLIPBOARD FALLBACK
      // =========================

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
        return;
      }

      // =========================
      // CASE 3: LAST RESORT
      // =========================

      prompt("Copy this link:", url);
    } catch (err) {
      console.error("Share failed:", err);
    }
  });
}
