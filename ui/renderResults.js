export function renderResults(results) {
  const container = document.getElementById("results-container");
  const topResult = document.getElementById("top-result");

  container.innerHTML = "";

  const top = results[0];
  if (!top) return;

  topResult.textContent = `Your top personality is ${top.name} (${top.percent}%)`;

  const fragment = document.createDocumentFragment();

  results.forEach((p) => {
    const card = document.createElement("div");
    card.className = "result-card";

    const title = document.createElement("div");
    title.className = "result-title";

    const left = document.createElement("span");
    const right = document.createElement("span");

    left.textContent = p.name;
    right.textContent = `${p.percent}%`;

    title.append(left, right);

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-valuemin", "0");
    bar.setAttribute("aria-valuemax", "100");
    bar.setAttribute("aria-valuenow", p.percent);
    bar.setAttribute("aria-label", `${p.name} compatibility`);

    const fill = document.createElement("div");
    fill.className = "bar-fill";
    fill.style.width = `${p.percent}%`;
    fill.style.background = p.color;

    bar.appendChild(fill);

    const heading = document.createElement("h3");
    heading.className = "result-heading";
    heading.textContent = p.heading;

    const desc = document.createElement("p");
    desc.textContent = p.description;

    card.append(title, bar, heading, desc);
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}
