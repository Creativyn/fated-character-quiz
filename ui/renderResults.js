export function renderResults(results) {
  const container = document.getElementById("results-container");
  const topResult = document.getElementById("top-result");

  if (!results || results.length === 0) return;

  container.innerHTML = "";

  const top = results[0];
  window.__TOP_PERSONALITY__ = top.id;

  topResult.textContent = `You are ${top.heading}`;

  results.forEach((personality, index) => {
    const card = document.createElement("div");

    // 🥇 TOP RESULT (FULL CARD)
    if (index === 0) {
      card.className = "result-card";

      const img = document.createElement("img");
      img.src = personality.image;
      img.alt = personality.name;

      img.addEventListener("load", requestResize);

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
      requestAnimationFrame(requestResize);
    }

    // 📊 OTHER RESULTS (COMPACT)
    else {
      card.className = "result-card compact";

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

      card.append(title, bar);
    }

    container.appendChild(card);
  });
}
