import { VNState } from "../vn/VNState.js";
import { generateResultCard } from "../utils/shareCard.js";

/*
 * Replace these with your actual Wix pages.
 */
const HOME_URL = "https://avicornpress.com/quizzes";
const EXPLORE_URL = "https://avicornpress.com/characters";

export function initResultButtons({ onRetake } = {}) {
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

  /*
   * Return to your Wix homepage.
   */
  homeBtn?.addEventListener("click", () => {
    window.location.href = HOME_URL;
  });

  /*
   * Go to your Wix Characters page.
   */
  exploreBtn?.addEventListener("click", () => {
    window.location.href = EXPLORE_URL;
  });

  shareBtn?.addEventListener("click", async () => {
    try {
      const results = VNState.getResults();

      if (!results || results.length === 0) {
        console.warn("No results available to share.");
        return;
      }

      const personality = results[0];

      const portrait = await generateResultCard(personality);

      const url = window.location.href;

      if (navigator.share) {
        const data = {
          title: personality.name,
          text: personality.description ?? "",
          url,
        };

        if (portrait) {
          try {
            const blob = await (await fetch(portrait)).blob();

            data.files = [
              new File([blob], "result.png", {
                type: "image/png",
              }),
            ];
          } catch (_) {
            // Ignore portrait failures and share text instead.
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
