export async function generateResultCard(personality) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 1080;
  canvas.height = 1080;

  /* Background */

  ctx.fillStyle = personality.color || "#111827";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  /* Accent stripe */

  ctx.fillStyle = personality.accent || "#ffffff";
  ctx.fillRect(0, 0, 30, canvas.height);

  /* Portrait */

  if (personality.portrait) {
    try {
      const img = await loadImage(personality.portrait);

      const size = 340;

      ctx.save();

      ctx.beginPath();
      ctx.roundRect(80, 120, size, size, 28);
      ctx.clip();

      ctx.drawImage(img, 80, 120, size, size);

      ctx.restore();
    } catch (_) {
      // portrait unavailable
    }
  }

  /* Heading */

  ctx.fillStyle = "#ffffff";
  ctx.font = "42px serif";

  ctx.fillText("You are most like...", 470, 180);

  /* Character Name */

  ctx.font = "bold 74px serif";

  ctx.fillText(personality.name, 470, 280);

  /* Subtitle */

  if (personality.heading) {
    ctx.font = "40px serif";

    ctx.fillStyle = personality.accent || "#ffffff";

    ctx.fillText(personality.heading, 470, 340);
  }

  /* Quote */

  if (personality.quote) {
    ctx.fillStyle = "#ffffff";

    ctx.font = "italic 34px serif";

    wrapText(ctx, `"${personality.quote}"`, 470, 420, 500, 46);
  }

  /* Description */

  ctx.fillStyle = "#ffffff";

  ctx.font = "30px serif";

  wrapText(ctx, personality.description, 80, 560, 920, 40);

  return canvas.toDataURL("image/png");
}

/* ========================= */

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = reject;

    img.src = src;
  });
}

/* ========================= */

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");

  let line = "";

  for (const word of words) {
    const test = line + word + " ";

    if (ctx.measureText(test).width > maxWidth && line.length) {
      ctx.fillText(line, x, y);

      line = word + " ";

      y += lineHeight;
    } else {
      line = test;
    }
  }

  if (line) {
    ctx.fillText(line, x, y);
  }
}
