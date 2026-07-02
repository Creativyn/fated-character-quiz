console.log("renderResults loaded");

export function renderResults(results) {
  const container = document.getElementById("results-container");
  const topText = document.getElementById("top-result");

  if (!container) return;

  container.innerHTML = "";

  const top = results[0];

  if (topText && top) {
    topText.textContent = `You are most like ${top.name}`;
  }

  results.forEach((r) => {
    const card = document.createElement("div");
    card.className = "result-card";

    card.innerHTML = `
      <div>
        <div class="result-title">
          <span>${r.name}</span>
          <span>${Math.round(r.percent)}%</span>
        </div>

        <div class="bar">
          <div class="bar-fill" style="width:${r.percent}%"></div>
        </div>

        <p>${r.description || ""}</p>
      </div>
    `;

    container.appendChild(card);
  });

  window.__TOP_PERSONALITY__ = results?.[0]?.id;
}
