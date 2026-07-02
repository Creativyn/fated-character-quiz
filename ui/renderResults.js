export function renderResults(results) {
  console.log("renderResults CALLED", results);

  const container = document.getElementById("results-container");
  const topResultText = document.getElementById("top-result");

  if (!container) {
    console.error("Missing #results-container");
    return;
  }

  if (!Array.isArray(results) || results.length === 0) {
    console.error("Invalid results data:", results);
    return;
  }

  // Clear old results
  container.innerHTML = "";

  const top = results[0];

  // Set top result text
  if (topResultText) {
    topResultText.textContent = `You are most like ${top.name}`;
  }

  // Render each personality result
  results.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "result-card";

    const img = document.createElement("img");
    img.src = item.image || "";
    img.alt = item.name;

    const content = document.createElement("div");

    const title = document.createElement("div");
    title.className = "result-title";
    title.textContent = `${item.name} — ${item.percent}%`;

    const bar = document.createElement("div");
    bar.className = "bar";

    const fill = document.createElement("div");
    fill.className = "bar-fill";

    // safe percent fallback
    const percent = typeof item.percent === "number" ? item.percent : 0;
    fill.style.width = percent + "%";

    bar.appendChild(fill);

    content.appendChild(title);
    content.appendChild(bar);

    card.appendChild(img);
    card.appendChild(content);

    container.appendChild(card);
  });

  console.log("renderResults COMPLETE");
}
