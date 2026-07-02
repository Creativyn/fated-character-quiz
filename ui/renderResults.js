export function renderResults(results) {
  console.log("renderResults (OLD UI RESTORE)");

  const container = document.getElementById("results-container");
  const topResultText = document.getElementById("top-result");

  if (!container) return;

  container.innerHTML = "";

  if (!results?.length) return;

  const top = results[0];

  if (topResultText) {
    topResultText.textContent = `You are most like ${top.name}`;
  }

  results.forEach((item, index) => {
    const card = document.createElement("div");

    card.className =
      index === 0 ? "result-card dominant" : "result-card compact";

    /* IMAGE */
    const img = document.createElement("img");
    img.src = item.image || "";
    img.alt = item.name;

    /* TEXT WRAPPER */
    const content = document.createElement("div");
    content.className = "result-content";

    /* TITLE */
    const title = document.createElement("div");
    title.className = "result-title";

    title.innerHTML = `
      <span>${item.name}</span>
      <span>${item.percent}%</span>
    `;

    /* DESCRIPTION */
    const desc = document.createElement("p");
    desc.className = "result-desc";
    desc.textContent = item.description || "";

    /* BAR */
    const bar = document.createElement("div");
    bar.className = "bar";

    const fill = document.createElement("div");
    fill.className = "bar-fill";

    const percent = Math.max(0, Math.min(100, item.percent || 0));

    requestAnimationFrame(() => {
      fill.style.width = percent + "%";
    });

    bar.appendChild(fill);

    content.appendChild(title);
    content.appendChild(desc);
    content.appendChild(bar);

    card.appendChild(img);
    card.appendChild(content);

    container.appendChild(card);
  });

  console.log("OLD UI RESTORE COMPLETE");
}
