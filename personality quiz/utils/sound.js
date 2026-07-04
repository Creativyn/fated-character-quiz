let enabled = true;

export function setSoundEnabled(value) {
  enabled = value;
}

export function playSound(src, volume = 0.4) {
  if (!enabled) return;

  const audio = new Audio(src);
  audio.volume = volume;

  audio.play().catch(() => {
    // ignore autoplay restrictions
  });
}
