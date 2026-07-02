export function renderResults(results) {
  const container = document.getElementById("results-container");
  const topResultText = document.getElementById("top-result");

  if (!container || !results?.length) return;

  container.innerHTML = "";

  const top = results[0];

  // top label
  if (topResultText) {
    topResultText.textContent = `You are most like ${top.name}`;
  }

  window.__TOP_PERSONALITY__ = top.id;

  results.forEach((r, index) => {
    const card = document.createElement("div");
    card.className = "result-card";

    if (index > 0) card.classList.add("compact");

    card.innerHTML = `
      <div class="result-title">
        <span>${r.name}</span>
        <span>${r.percent}%</span>
      </div>

      <div class="bar">
        <div class="bar-fill" style="width:${r.percent}%"></div>
      </div>

      <p>${r.description ?? ""}</p>
    `;

    container.appendChild(card);
  });
}
