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
        <h3 class="result-title">
          <span>${r.name}</span>
          <span>${Math.round(r.percent)}%</span>
        </h3>

        <div class="bar">
          <div class="bar-fill" style="width:${r.percent}%"></div>
        </div>

        <p>${r.description || ""}</p>
      </div>
    `;

    container.appendChild(card);
  });

  // store dominant personality
  if (results?.[0]) {
    window.__TOP_PERSONALITY__ = results[0].id;
  }
}
