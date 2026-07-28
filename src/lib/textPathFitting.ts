const ELLIPSIS = "...";
const WHEEL_CENTER = 220;
const WHEEL_RADIUS = WHEEL_CENTER - 4;
const WHEEL_SIZE = WHEEL_CENTER * 2;

type TextPathFitResult = {
  lines: string[];
  fontSize: number;
  radius: number;
  arcLength: number;
};

type WheelSectorOption = {
  text: string;
  weight: number;
};

type WheelSector<T extends WheelSectorOption> = {
  clipPathId: string;
  fontSize: number;
  option: T;
  path: string;
  textPaths: Array<{ id: string; path: string; text: string }>;
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

function fitSingleText(
  text: string,
  fontSize: number,
  sectorAngle: number,
  bounds: { inner: number; outer: number },
): { lines: string[]; truncated: boolean } {
  const charWidth = getCharWidth(text, fontSize);
  const lineHeight = fontSize * 1.2;
  const textHeight = bounds.outer - bounds.inner;
  const maxLines = Math.max(1, Math.floor(textHeight / lineHeight));
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

  const allWordsUsed = wordIndex >= words.length;
  const displayedText = lines.join(" ");
  const truncated =
    !allWordsUsed ||
    displayedText.length < text.replace(/\s+/g, " ").trim().length * 0.95;

  if (truncated && lines.length > 0) {
    const lastLineIndex = lines.length - 1;
    const lineRadius = bounds.outer - lastLineIndex * lineHeight;
    const maxChars = Math.floor(calcArcLength(sectorAngle, lineRadius) / charWidth);

    if (maxChars < 1) {
      return { lines: [], truncated: true };
    }

    lines[lastLineIndex] = truncateWithEllipsis(
      lines[lastLineIndex],
      maxChars,
    );
  }

  if (lines.length === 0) {
    if (outerChars < 1) {
      return { lines: [], truncated: true };
    }

    const fallback =
      text.length > outerChars ? truncateWithEllipsis(text, outerChars) : text;

    return fallback
      ? { lines: [fallback], truncated: text.length > outerChars }
      : { lines: [], truncated: true };
  }

  return { lines, truncated };
}

function fitTextIntoArcPath(
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

  const shouldPreferSmallFont =
    wheelSize <= 160 &&
    text.length <= 12 &&
    !smallResult.truncated &&
    smallResult.lines.length < baseResult.lines.length;

  if (shouldPreferSmallFont) {
    return createFitResult(smallResult.lines, smallFontSize, smallBounds);
  }

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

function createArcPath(
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

function calculateLineRadii(
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

const getTextAnglePadding = (sectorAngle: number): number =>
  Math.min(Math.max(1.25, sectorAngle * 0.035), Math.max(1.25, sectorAngle / 6));

function polarToCartesian(radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: WHEEL_CENTER + radius * Math.cos(radians),
    y: WHEEL_CENTER + radius * Math.sin(radians),
  };
}

function createSectorPath(startAngle: number, endAngle: number) {
  const start = polarToCartesian(WHEEL_RADIUS, startAngle);
  const end = polarToCartesian(WHEEL_RADIUS, endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${WHEEL_CENTER} ${WHEEL_CENTER}`,
    `L ${start.x} ${start.y}`,
    `A ${WHEEL_RADIUS} ${WHEEL_RADIUS} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

export function layoutWheelSectors<T extends WheelSectorOption>(
  options: T[],
  idPrefix: string,
): WheelSector<T>[] {
  const totalWeight = options.reduce(
    (sum, option) => sum + (option.weight || 1),
    0,
  );
  let startAngle = 0;

  return options.map((option, sectorIndex) => {
    const sectorAngle = ((option.weight || 1) / totalWeight) * 360;
    const endAngle = startAngle + sectorAngle;
    const fit = fitTextIntoArcPath(
      option.text,
      sectorAngle,
      WHEEL_RADIUS * 0.25,
      WHEEL_RADIUS * 0.85,
      WHEEL_SIZE,
    );
    const textInnerLimit =
      WHEEL_RADIUS * 0.25 +
      (WHEEL_RADIUS * 0.85 - WHEEL_RADIUS * 0.25) * 0.15;
    const lineRadii = calculateLineRadii(
      fit.lines,
      textInnerLimit,
      WHEEL_RADIUS * 0.85,
      fit.fontSize,
    );
    const textAnglePadding = getTextAnglePadding(sectorAngle);
    const sector = {
      clipPathId: `${idPrefix}-clip-${sectorIndex}`,
      fontSize: fit.fontSize,
      option,
      path: createSectorPath(startAngle, endAngle),
      textPaths: fit.lines.map((text, lineIndex) => ({
        id: `${idPrefix}-text-${sectorIndex}-${lineIndex}`,
        path: createArcPath(
          WHEEL_CENTER,
          WHEEL_CENTER,
          lineRadii[lineIndex],
          startAngle + textAnglePadding - 90,
          endAngle - textAnglePadding - 90,
        ),
        text,
      })),
    };
    startAngle = endAngle;
    return sector;
  });
}
