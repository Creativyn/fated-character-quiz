export function renderResults(results) {
  const container = document.getElementById("results-container");
  const topResult = document.getElementById("top-result");

  if (!results || results.length === 0) return;

  container.innerHTML = "";

  const top = results[0];
  window.__TOP_PERSONALITY__ = top.id;

  topResult.textContent = `You are ${top.heading}`;

  results.forEach((personality) => {
    const card = document.createElement("div");
    card.className = "result-card";

    const img = document.createElement("img");
    img.src = personality.image;
    img.alt = personality.name;

    // ✅ FIX: listener is inside loop, where img exists
    img.addEventListener("load", () => {
      window.parent.postMessage(
        {
          type: "FATED_QUIZ_RESIZE",
          height: document.body.scrollHeight,
        },
        "*",
      );
    });

    const content = document.createElement("div");

    const title = document.createElement("div");
    title.className = "result-title";

    const left = document.createElement("span");
    const right = document.createElement("span");

    left.textContent = personality.name;
    right.textContent = `${personality.percent}%`;

    title.append(left, right);

    const bar = document.createElement("div");
    bar.className = "bar";

    const fill = document.createElement("div");
    fill.className = "bar-fill";
    fill.style.width = `${personality.percent}%`;
    fill.style.background = personality.color;

    bar.appendChild(fill);

    const desc = document.createElement("p");
    desc.textContent = personality.description;

    content.append(title, bar, desc);
    card.append(img, content);

    container.appendChild(card);
  });
}
