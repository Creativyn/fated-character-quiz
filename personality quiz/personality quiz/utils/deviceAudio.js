export async function shouldMuteAudio() {
  try {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return true;
    }

    if (navigator.getBattery) {
      const battery = await navigator.getBattery();

      // conservative thresholds
      if (battery.level < 0.15 && !battery.charging) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}
