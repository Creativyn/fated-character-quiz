export function renderResults(results) {
  const container = document.getElementById("results-container");

  if (!container) {
    console.warn("renderResults: missing results-container");
    return;
  }

  if (!Array.isArray(results) || results.length === 0) {
    console.warn("renderResults: no results supplied");
    return;
  }

  container.innerHTML = "";

  results.forEach((personality) => {
    const card = document.createElement("article");
    card.className = "result-card";

    const accent = personality.color || "#60a5fa";
    card.style.setProperty("--accent", accent);

    const title = document.createElement("h3");
    title.className = "result-title";
    title.textContent = personality.name;

    const description = document.createElement("p");
    description.className = "result-description";
    description.textContent = personality.description || "";

    const bar = document.createElement("div");
    bar.className = "bar";

    const fill = document.createElement("div");
    fill.className = "bar-fill";

    fill.dataset.target = String(personality.percent ?? 0);

    fill.style.width = "0%";
    fill.style.background = accent;

    bar.appendChild(fill);

    const percent = document.createElement("div");
    percent.className = "result-percent";
    percent.textContent = `${personality.percent ?? 0}%`;

    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(bar);
    card.appendChild(percent);

    container.appendChild(card);
  });
}
