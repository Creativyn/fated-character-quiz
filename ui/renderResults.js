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

    const color = p.color || "#60a5fa"; // fallback safe

    card.innerHTML = `
      <div class="result-title">
        <span>${p.name}</span>
        <span>${p.percent}%</span>
      </div>

      <div class="bar">
        <div class="bar-fill" style="width:${p.percent}%; background:${color};"></div>
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
