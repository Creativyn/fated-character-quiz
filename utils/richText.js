const EMPHASIS_PATTERN = /\[\[(.+?)\]\]/g;

/**
 * Converts [[emphasized words]] into safe <em> elements.
 * All other content remains plain text.
 */
export function setRichText(element, value, options = {}) {
  if (!element) return;

  const { openingQuote = "", closingQuote = "" } = options;

  element.replaceChildren();

  if (openingQuote) {
    element.append(document.createTextNode(openingQuote));
  }

  const text = String(value ?? "");
  let previousIndex = 0;
  let match;

  while ((match = EMPHASIS_PATTERN.exec(text)) !== null) {
    const ordinaryText = text.slice(previousIndex, match.index);

    if (ordinaryText) {
      element.append(document.createTextNode(ordinaryText));
    }

    const emphasis = document.createElement("em");
    emphasis.textContent = match[1];
    element.append(emphasis);

    previousIndex = match.index + match[0].length;
  }

  const remainingText = text.slice(previousIndex);

  if (remainingText) {
    element.append(document.createTextNode(remainingText));
  }

  if (closingQuote) {
    element.append(document.createTextNode(closingQuote));
  }
}

/**
 * Types rich text while preserving [[emphasis]].
 */
export async function typewriterRichText(element, value, options = {}) {
  if (!element) return;

  const {
    speed = 35,
    skip = false,
    openingQuote = "",
    closingQuote = "",
  } = options;

  if (skip) {
    setRichText(element, value, {
      openingQuote,
      closingQuote,
    });
    return;
  }

  element.replaceChildren();

  if (openingQuote) {
    element.append(document.createTextNode(openingQuote));
  }

  const text = String(value ?? "");
  const tokens = [];

  let previousIndex = 0;
  let match;

  while ((match = EMPHASIS_PATTERN.exec(text)) !== null) {
    const ordinaryText = text.slice(previousIndex, match.index);

    if (ordinaryText) {
      tokens.push({
        text: ordinaryText,
        emphasized: false,
      });
    }

    tokens.push({
      text: match[1],
      emphasized: true,
    });

    previousIndex = match.index + match[0].length;
  }

  const remainingText = text.slice(previousIndex);

  if (remainingText) {
    tokens.push({
      text: remainingText,
      emphasized: false,
    });
  }

  for (const token of tokens) {
    const parent = token.emphasized
      ? document.createElement("em")
      : document.createTextNode("");

    element.append(parent);

    for (const character of token.text) {
      if (token.emphasized) {
        parent.textContent += character;
      } else {
        parent.nodeValue += character;
      }

      await new Promise((resolve) => {
        window.setTimeout(resolve, speed);
      });
    }
  }

  if (closingQuote) {
    element.append(document.createTextNode(closingQuote));
  }
}
