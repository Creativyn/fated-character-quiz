export function renderResults(results) {
  const container = document.getElementById("results-container");
  const topResult = document.getElementById("top-result");

  container.innerHTML = "";

  const top = results[0];
  if (!top) return;

  // Top headline only
  topResult.textContent = `You are ${top.heading}`;

  // Single card instead of loop
  const card = document.createElement("div");
  card.className = "result-card";

  const img = document.createElement("img");
  img.src = top.image;
  img.alt = top.name;

  const content = document.createElement("div");

  const title = document.createElement("div");
  title.className = "result-title";

  const left = document.createElement("span");
  const right = document.createElement("span");

  left.textContent = `${top.name}`;
  right.textContent = `${top.percent}%`;

  title.append(left, right);

  const bar = document.createElement("div");
  bar.className = "bar";

  const fill = document.createElement("div");
  fill.className = "bar-fill";
  fill.style.width = `${top.percent}%`;
  fill.style.background = top.color;

  bar.appendChild(fill);

  const desc = document.createElement("p");
  desc.textContent = top.description;

  content.append(title, bar, desc);
  card.append(img, content);

  container.appendChild(card);
}
