export function renderResults(results) {
  const container = document.getElementById("results-container");
  const topResultText = document.getElementById("top-result");

  if (!container || !Array.isArray(results) || results.length === 0) {
    console.warn("renderResults: invalid results or missing container");
    return;
  }

  // clear previous render safely (important for cinematic reruns)
  container.innerHTML = "";

  const top = results[0];

  if (topResultText) {
    topResultText.textContent = `You are most like ${top.name}`;
  }

  results.forEach((p, i) => {
    const percent = typeof p.percent === "number" ? p.percent : 0;

    const card = document.createElement("div");
    card.className = "result-card";

    // personality-driven styling (safe fallback included)
    card.style.setProperty("--accent", p.color || "#60a5fa");

    const bar = document.createElement("div");
    bar.className = "bar";

    const fill = document.createElement("div");
    fill.className = "bar-fill";

    // IMPORTANT: cinematic engine expects 0 baseline
    fill.style.width = "0%";

    // store final target for animation engine
    fill.dataset.target = String(percent);

    bar.appendChild(fill);

    const title = document.createElement("div");
    title.className = "result-title";

    const name = document.createElement("span");
    name.textContent = p.name || "Unknown";

    const score = document.createElement("span");
    score.textContent = `${percent}%`;

    title.appendChild(name);
    title.appendChild(score);

    card.appendChild(title);
    card.appendChild(bar);

    // only top result gets description (keeps cinematic focus clean)
    if (i === 0 && p.description) {
      const desc = document.createElement("p");
      desc.className = "result-description";
      desc.textContent = p.description;
      card.appendChild(desc);
    }

    container.appendChild(card);
  });
}
