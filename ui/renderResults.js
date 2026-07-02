export function renderResults(results) {
  const container = document.getElementById("results-container");
  const topResultText = document.getElementById("top-result");

  if (!container || !results?.length) return;

  container.innerHTML = "";

  const top = results[0];

  // Top label text
  if (topResultText) {
    topResultText.textContent = `You are most like ${top.name}`;
  }

  results.forEach((personality, index) => {
    const card = document.createElement("div");
    card.className = "result-card";

    const percent = personality.percent ?? 0;

    card.innerHTML = `
      <div class="result-title">
        <span>${personality.name}</span>
        <span>${percent}%</span>
      </div>

      <div class="bar">
        <div class="bar-fill" style="width: ${percent}%"></div>
      </div>

      ${
        index === 0
          ? `<p class="result-description">${personality.description ?? ""}</p>`
          : ""
      }
    `;

    container.appendChild(card);
  });
}
