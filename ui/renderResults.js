export function renderResults(results) {
  const container = document.getElementById("results-container");
  const topText = document.getElementById("top-result");

  if (!container) return;

  container.innerHTML = "";

  results.forEach((r, i) => {
    const card = document.createElement("div");
    card.className = "result-card";

    card.innerHTML = `
      <div>
        <h3>${r.name}</h3>
        <p>${r.description ?? ""}</p>
        <div class="bar">
          <div class="bar-fill" style="width:${r.percent}%"></div>
        </div>
      </div>
    `;

    container.appendChild(card);

    if (i === 0 && topText) {
      topText.textContent = `You are most like ${r.name}`;
    }
  });
}
