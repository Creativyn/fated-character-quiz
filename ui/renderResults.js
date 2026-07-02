export function renderResults(results) {
  const container = document.getElementById("results-container");
  const topResult = document.getElementById("top-result");

  container.innerHTML = "";

  results.forEach((r, i) => {
    const card = document.createElement("div");
    card.className = "result-card";

    card.innerHTML = `
      <div>
        <div class="result-title">
          <span>${r.name}</span>
          <span>${r.percent}%</span>
        </div>

        <div class="bar">
          <div class="bar-fill" style="width:${r.percent}%"></div>
        </div>

        <p>${r.description || ""}</p>
      </div>
    `;

    container.appendChild(card);

    if (i === 0 && topResult) {
      topResult.textContent = `You are most like ${r.name}`;
      window.__TOP_PERSONALITY__ = r.id;
    }
  });
}
