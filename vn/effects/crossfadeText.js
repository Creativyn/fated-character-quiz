const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function crossfadeText(
  element,
  value,
  { skip = false, fadeMs = 300 } = {},
) {
  if (!element) return;

  if (skip) {
    element.textContent = value;
    element.classList.add("show");
    return;
  }

  element.classList.remove("show");

  await wait(fadeMs);

  element.textContent = value;
  element.classList.add("show");

  await wait(fadeMs);
}
