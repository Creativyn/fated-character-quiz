export function renderResults(results) {
  const container = document.getElementById("results-container");
  const topResultText = document.getElementById("top-result");

  if (!container) {
    throw new Error("Missing #results-container");
  }

  if (!Array.isArray(results) || results.length === 0) {
    throw new Error("renderResults received no results");
  }

  container.innerHTML = "";

  const top = results[0];

  if (topResultText) {
    topResultText.textContent = `You are most like ${top.name}`;
  }

  results.forEach((personality, index) => {
    const percent = Number(personality.percent ?? 0);

    const card = document.createElement("article");
    card.className = "result-card";

    // Hidden until the cinematic reveals it.
    card.style.opacity = "0";
    card.style.transform = "translateY(12px)";

    // Character accent colour
    card.style.setProperty("--accent", personality.color || "var(--accent)");

    card.innerHTML = `
      <div class="result-title">

        <span class="result-name">
          ${personality.name}
        </span>

        <span class="result-percent">
          ${percent}%
        </span>

      </div>

      <div class="bar">

        <div
          class="bar-fill"
          data-target="${percent}"
          style="
            width:0%;
            background:${personality.color || "var(--accent)"};
          "
        ></div>

      </div>

      ${
        index === 0 && personality.description
          ? `
            <p class="result-description">
              ${personality.description}
            </p>
          `
          : ""
      }
    `;

    container.appendChild(card);
  });
}
