export function renderResults(results) {
  const container = document.getElementById("results-container");
  const topResultText = document.getElementById("top-result");

  if (!container || !results?.length) return;

  container.innerHTML = "";

  const top = results[0];

  if (topResultText) {
    topResultText.textContent = `You are most like ${top.name}`;
  }

  results.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "result-card";

    // ✅ set personality color as CSS variable
    card.style.setProperty("--accent", p.color || "#60a5fa");

    card.innerHTML = `
      <div class="result-title">
        <span>${p.name}</span>
        <span>${p.percent}%</span>
      </div>

      <div class="bar">
        <div class="bar-fill" style="width:${p.percent}%"></div>
      </div>

      ${
        i === 0
          ? `<p class="result-description">${p.description || ""}</p>`
          : ""
      }
    `;

    container.appendChild(card);
  });
}
