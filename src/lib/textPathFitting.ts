const ELLIPSIS = "...";

export type TextPathFitResult = {
  lines: string[];
  fontSize: number;
  radius: number;
  arcLength: number;
};

function calcArcLength(angleDeg: number, radius: number): number {
  return (angleDeg * Math.PI * radius) / 180;
}

function getCharWidth(text: string, fontSize: number): number {
  const cjkCount =
    (text.match(/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/g) || []).length;
  const ratio = cjkCount / Math.max(1, text.length);

  if (ratio > 0.5) return fontSize * 1.0;
  if (ratio > 0.2) return fontSize * 0.85;
  return fontSize * 0.7;
}

function getTextBounds(
  innerRadius: number,
  outerRadius: number,
  fontSize: number,
  baseFontSize: number,
): { inner: number; outer: number } {
  const range = outerRadius - innerRadius;
  const fontRatio = fontSize / baseFontSize;
  const outerMargin = 0.12 + fontRatio * 0.16;
  const innerMargin = 0.2;

  return {
    inner: innerRadius + range * innerMargin,
    outer: outerRadius - range * outerMargin,
  };
}

function truncateWithEllipsis(text: string, maxChars: number): string {
  if (maxChars < 1) return "";
  if (text.length <= maxChars) return text;
  if (maxChars <= ELLIPSIS.length) return ELLIPSIS.slice(0, maxChars);
  return `${text.slice(0, maxChars - ELLIPSIS.length)}${ELLIPSIS}`;
}

function normalizeWheelLines(lines: string[]): string[] {
  const sanitized = lines.map((line) => line.trim()).filter(Boolean);
  if (sanitized.length <= 1) return sanitized;

  for (let i = 1; i < sanitized.length; i += 1) {
    const current = sanitized[i];
    if (/^[.,!?;:]+$/.test(current)) {
      sanitized[i - 1] = `${sanitized[i - 1]}${current}`;
      sanitized.splice(i, 1);
      i -= 1;
    }
  }

  return sanitized;
}

function fitSingleText(
  text: string,
  fontSize: number,
  sectorAngle: number,
  bounds: { inner: number; outer: number },
): { lines: string[]; truncated: boolean } {
  const charWidth = getCharWidth(text, fontSize);
  const lineHeight = fontSize * 1.2;
  const textHeight = bounds.outer - bounds.inner;
  const maxLines = Math.max(1, Math.min(2, Math.floor(textHeight / lineHeight)));
  const outerChars = Math.floor(calcArcLength(sectorAngle, bounds.outer) / charWidth);

  if (outerChars < 1) {
    return { lines: [], truncated: true };
  }

  const lines: string[] = [];
  const words = text.split(/\s+/).filter((word) => word.length > 0);
  let wordIndex = 0;

  for (let lineIdx = 0; lineIdx < maxLines && wordIndex < words.length; lineIdx += 1) {
    const lineRadius = bounds.outer - lineIdx * lineHeight;
    if (lineRadius < bounds.inner) break;

    const arcLen = calcArcLength(sectorAngle, lineRadius);
    const maxChars = Math.floor(arcLen / charWidth);
    if (maxChars < 1) break;

    let line = "";

    while (wordIndex < words.length) {
      const word = words[wordIndex];
      const candidate = line ? `${line} ${word}` : word;

      if (candidate.length <= maxChars) {
        line = candidate;
        wordIndex += 1;
        continue;
      }

      if (!line) {
        if (word.length > maxChars) {
          line = word.slice(0, maxChars);
          words[wordIndex] = word.slice(maxChars);
        } else {
          line = word;
          wordIndex += 1;
        }
      }
      break;
    }

    if (line) {
      lines.push(line);
    }
  }

  const normalizedLines = normalizeWheelLines(lines);
  const allWordsUsed = wordIndex >= words.length;
  const displayedText = normalizedLines.join(" ");
  const truncated =
    !allWordsUsed ||
    displayedText.length < text.replace(/\s+/g, " ").trim().length * 0.95;

  if (truncated && normalizedLines.length > 0) {
    const lastLineIndex = normalizedLines.length - 1;
    const lineRadius = bounds.outer - lastLineIndex * lineHeight;
    const maxChars = Math.floor(calcArcLength(sectorAngle, lineRadius) / charWidth);

    if (maxChars < 1) {
      return { lines: [], truncated: true };
    }

    normalizedLines[lastLineIndex] = truncateWithEllipsis(
      normalizedLines[lastLineIndex],
      maxChars,
    );
  }

  if (normalizedLines.length === 0) {
    const fallback =
      text.length > outerChars ? truncateWithEllipsis(text, outerChars) : text;

    return fallback
      ? { lines: [fallback], truncated: text.length > outerChars }
      : { lines: [], truncated: true };
  }

  return { lines: normalizedLines, truncated };
}

export function fitTextIntoArcPath(
  text: string,
  sectorAngleDegrees: number,
  innerRadius: number,
  outerRadius: number,
  wheelSize: number,
): TextPathFitResult {
  const createFitResult = (
    lines: string[],
    fontSize: number,
    bounds: { inner: number; outer: number },
  ): TextPathFitResult => ({
    lines,
    fontSize,
    radius: bounds.outer,
    arcLength: calcArcLength(sectorAngleDegrees, bounds.outer),
  });

  const baseFontSize = Math.max(11, Math.min(20, Math.floor(wheelSize / 16)));
  const smallFontSize = Math.max(9, Math.min(14, Math.floor(wheelSize / 24)));
  const tinyFontSize = Math.max(8, Math.min(11, Math.floor(wheelSize / 32)));

  const baseBounds = getTextBounds(
    innerRadius,
    outerRadius,
    baseFontSize,
    baseFontSize,
  );
  const baseResult = fitSingleText(text, baseFontSize, sectorAngleDegrees, baseBounds);

  const smallBounds = getTextBounds(
    innerRadius,
    outerRadius,
    smallFontSize,
    baseFontSize,
  );
  const smallResult = fitSingleText(text, smallFontSize, sectorAngleDegrees, smallBounds);

  const baseDisplayed = baseResult.lines.join("").replace(/\.\.\./g, "").length;
  if (
    baseResult.lines.length > 0 &&
    (!baseResult.truncated || baseDisplayed >= text.length * 0.85)
  ) {
    return createFitResult(baseResult.lines, baseFontSize, baseBounds);
  }

  const smallDisplayed = smallResult.lines.join("").replace(/\.\.\./g, "").length;
  if (
    smallResult.lines.length > 0 &&
    (!smallResult.truncated || smallDisplayed >= text.length * 0.9)
  ) {
    return createFitResult(smallResult.lines, smallFontSize, smallBounds);
  }

  const tinyBounds = getTextBounds(
    innerRadius,
    outerRadius,
    tinyFontSize,
    baseFontSize,
  );
  const tinyResult = fitSingleText(text, tinyFontSize, sectorAngleDegrees, tinyBounds);

  return createFitResult(tinyResult.lines, tinyFontSize, tinyBounds);
}

export function createArcPath(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const x1 = centerX + radius * Math.cos(startRad);
  const y1 = centerY + radius * Math.sin(startRad);
  const x2 = centerX + radius * Math.cos(endRad);
  const y2 = centerY + radius * Math.sin(endRad);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
}

export function calculateLineRadii(
  lines: string[],
  innerLimit: number,
  outerLimit: number,
  fontSize: number,
): number[] {
  if (lines.length === 0) return [];
  if (lines.length === 1) {
    return [outerLimit - (outerLimit - innerLimit) * 0.3];
  }

  const lineHeight = fontSize * 1.2;
  const totalHeight = (lines.length - 1) * lineHeight;
  const availableHeight = outerLimit - innerLimit;

  if (totalHeight <= availableHeight) {
    return lines.map((_, index) => outerLimit - index * lineHeight);
  }

  const spacing = availableHeight / Math.max(lines.length - 1, 1);
  return lines.map((_, index) => outerLimit - index * spacing);
}
