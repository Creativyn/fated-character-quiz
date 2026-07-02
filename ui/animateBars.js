export function animateBars(container, delay = 120) {
  const bars = container.querySelectorAll(".bar-fill");

  bars.forEach((bar, index) => {
    const target = bar.dataset.target;

    if (!target) return;

    setTimeout(() => {
      bar.style.width = `${target}%`;
    }, index * delay);
  });
}
