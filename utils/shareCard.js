export async function generateResultCard(personality) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 1080;
  canvas.height = 1080;

  // background
  ctx.fillStyle = "#111827";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 64px sans-serif";
  ctx.fillText("My Fated Result", 80, 200);

  // personality
  ctx.font = "bold 80px sans-serif";
  ctx.fillText(personality.name, 80, 400);

  // export
  return canvas.toDataURL("image/png");
}
