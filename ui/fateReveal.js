import { runScene } from "./sceneEngine.js";
import { fateScene } from "./fateScenes.js";

export async function fateReveal(args) {
  const skipToggle = document.getElementById("skip-cinematic");

  await runScene(fateScene, {
    ...args,
    skipToggle,
  });
}
