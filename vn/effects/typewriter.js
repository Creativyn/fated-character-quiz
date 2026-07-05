const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function typewriter(
  element,
  text,
  { speed = 28, skip = false } = {},
) {
  if (!element) return;

  element.textContent = "";

  if (skip) {
    element.textContent = text;
    return;
  }

  for (const char of text) {
    element.textContent += char;
    await wait(speed);
  }
}
