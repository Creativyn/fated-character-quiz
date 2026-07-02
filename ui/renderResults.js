export function renderResults(results) {
  const container = document.getElementById("results-container");
  const topResultText = document.getElementById("top-result");

  container.innerHTML = "";

  const top = results[0];

  if (topResultText) {
    topResultText.textContent = `You are most like ${top.name}`;
  }

  results.forEach((item) => {
    const card = document.createElement("div");
    card.className = "result-card";

    const img = document.createElement("img");
    img.src = item.image || "";
    img.alt = item.name;

    const info = document.createElement("div");

    const title = document.createElement("div");
    title.className = "result-title";
    title.innerHTML = `
      <span>${item.name}</span>
      <span>${item.percent}%</span>
    `;

    const bar = document.createElement("div");
    bar.className = "bar";

    const fill = document.createElement("div");
    fill.className = "bar-fill";
    fill.style.width = item.percent + "%";

    bar.appendChild(fill);

    const desc = document.createElement("p");
    desc.textContent = item.description || "";

    info.appendChild(title);
    info.appendChild(bar);
    info.appendChild(desc);

    card.appendChild(img);
    card.appendChild(info);

    container.appendChild(card);
  });
}
