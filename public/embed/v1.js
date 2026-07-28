(function () {
  // === CONFIG & SETUP ===
  const DEFAULT_CONFIG = { origin: "https://wheelora.ai", lazy: true };
  const THEMES = {
    minimal: {
      palette: ["#FF1493", "#00FF00", "#00FFFF", "#FFD700", "#FF4500", "#8A2BE2", "#FF1493", "#7FFF00"],
      textColors: ["#FFFFFF", "#000000", "#000000", "#000000", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#000000"],
      panelBg: "#FFFFFF",
      textColor: "#111111",
      buttonBg: "#111111",
      buttonText: "#FFFFFF",
      wheelCenterBg: "#FFFFFF",
      wheelCenterIcon: "#111111",
      border: "1px solid rgba(17,17,17,0.1)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
      badgeBg: "rgba(17,17,17,0.05)",
      badgeText: "#111111"
    },
    playful: {
      palette: ["#FF1493", "#00FF00", "#00FFFF", "#FFD700", "#FF4500", "#8A2BE2", "#FF1493", "#7FFF00"],
      textColors: ["#FFFFFF", "#000000", "#000000", "#000000", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#000000"],
      panelBg: "#FFFDF4",
      textColor: "#111111",
      buttonBg: "#FF5A36",
      buttonText: "#FFFFFF",
      wheelCenterBg: "#FFFFFF",
      wheelCenterIcon: "#FF5A36",
      border: "3px solid #111111",
      boxShadow: "8px 8px 0px rgba(17,17,17,1)",
      badgeBg: "#FFE082",
      badgeText: "#111111"
    },
    dark: {
      palette: ["#EF4444", "#F97316", "#EAB308", "#22C55E", "#06B6D4", "#3B82F6", "#8B5CF6", "#EC4899"],
      textColors: ["#FFFFFF", "#000000", "#000000", "#000000", "#000000", "#FFFFFF", "#FFFFFF", "#FFFFFF"],
      panelBg: "#111317",
      textColor: "#FAFAFA",
      buttonBg: "#39FF14",
      buttonText: "#000000",
      wheelCenterBg: "#111317",
      wheelCenterIcon: "#39FF14",
      border: "1px solid #2C2E36",
      boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
      badgeBg: "rgba(57,255,20,0.1)",
      badgeText: "#39FF14"
    },
    elegant: {
      palette: ["#78716c", "#b45309", "#854d0e", "#4d7c0f", "#0f766e", "#1d4ed8", "#6d28d9", "#be123c"],
      textColors: ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"],
      panelBg: "#FFFDF8",
      textColor: "#231F19",
      buttonBg: "#231F19",
      buttonText: "#FFFDF8",
      wheelCenterBg: "#FFFDF8",
      wheelCenterIcon: "#C5A059",
      border: "1px solid #D8C7A7",
      boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
      badgeBg: "#F3ECE1",
      badgeText: "#C5A059"
    }
  };

  const WHEEL_CENTER = 220;
  const WHEEL_RADIUS = 216;

  function parseMeta() {
    const node = document.querySelector("script[data-wheelora-meta]");
    if (!node) return { ...DEFAULT_CONFIG };
    try {
      const parsed = JSON.parse(node.textContent || "{}");
      return { ...DEFAULT_CONFIG, ...parsed };
    } catch (error) {
      return { ...DEFAULT_CONFIG };
    }
  }

  // === PHYSICS LOGIC ===
  const FRICTION_RANGES = { Medium: [1.0, 1.5] };
  const SPEED_RANGES = { Medium: [1500, 1700] };
  const DURATION_ESTIMATES = { "Medium-Medium": [4.64, 6.62] };
  const MAX_OFFSET_TIME = 0.3;
  const HARD_VELOCITY_LIMIT = 2;

  function getSecureRandom() {
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      return array[0] / 0xffffffff;
    }
    return Math.random();
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => {
      switch (char) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case '"':
          return "&quot;";
        case "'":
          return "&#39;";
        default:
          return char;
      }
    });
  }

  function samplePhysicsParameters() {
    const [vMin, vMax] = SPEED_RANGES.Medium;
    const [kMin, kMax] = FRICTION_RANGES.Medium;
    return {
      v: vMin + getSecureRandom() * (vMax - vMin),
      k: kMin + getSecureRandom() * (kMax - kMin),
      theta_target: getSecureRandom() * 360
    };
  }

  function computePhysicsRange(v, k, T) {
    return (v / k) * (1 - Math.exp(-k * T));
  }

  function timeToHardLimit(v, k, hardLimit) {
    if (v <= hardLimit) return 0;
    return -Math.log(hardLimit / v) / k;
  }

  function calculateSpinPhases(spinTime, params) {
    const T = spinTime / 1000;
    for (let attempt = 0; attempt < 10; attempt++) {
      const theta_phys_initial = computePhysicsRange(params.v, params.k, T);
      const theta_phys_mod = theta_phys_initial % 360;
      const offset = (params.theta_target - theta_phys_mod + 360) % 360;
      const t_offset = offset / params.v;
      if (t_offset > MAX_OFFSET_TIME) {
        params.theta_target = getSecureRandom() * 360;
        continue;
      }
      const T_phys = T - t_offset;
      if (T_phys <= 0) {
        params.theta_target = getSecureRandom() * 360;
        continue;
      }
      const theta_phys = computePhysicsRange(params.v, params.k, T_phys);
      return { offset, t_offset, theta_phys, T_phys };
    }
    return { offset: 0, t_offset: 0, theta_phys: computePhysicsRange(params.v, params.k, T), T_phys: T };
  }

  function createPhysicsEasing(k, T_phys_seconds) {
    return (t) => {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      const normK = k * T_phys_seconds;
      return (1 - Math.exp(-normK * t)) / (1 - Math.exp(-normK));
    };
  }

  function generatePhysicsSpinTarget(currentAngle) {
    const params = samplePhysicsParameters();
    const [minDuration, maxDuration] = DURATION_ESTIMATES["Medium-Medium"];
    const estimatedDuration = ((minDuration + maxDuration) / 2) * 1000;
    const phases = calculateSpinPhases(estimatedDuration, params);

    if (!phases) {
      return {
        finalTarget: currentAngle + 360 * 6 + getSecureRandom() * 360,
        totalDurationMs: estimatedDuration,
        offsetRatio: 0,
        offsetDurationMs: 0,
        physicsDurationMs: estimatedDuration,
        physicsEasing: (t) => 1 - Math.pow(1 - t, 2),
      };
    }

    const { offset, t_offset, T_phys } = phases;
    const timeToHardLimitSeconds = timeToHardLimit(params.v, params.k, HARD_VELOCITY_LIMIT);
    const actualPhysicsTime = Math.min(T_phys, timeToHardLimitSeconds);
    const actualTheta_phys = computePhysicsRange(params.v, params.k, actualPhysicsTime);
    const totalDistance = offset + actualTheta_phys;

    return {
      finalTarget: currentAngle + totalDistance,
      totalDurationMs: (t_offset + actualPhysicsTime) * 1000,
      offsetRatio: totalDistance === 0 ? 0 : offset / totalDistance,
      offsetDurationMs: t_offset * 1000,
      physicsDurationMs: actualPhysicsTime * 1000,
      physicsEasing: createPhysicsEasing(params.k, actualPhysicsTime),
    };
  }

  function getProgress(elapsed, target) {
    if (target.offsetDurationMs > 0 && elapsed <= target.offsetDurationMs) {
      return target.offsetRatio * (elapsed / target.offsetDurationMs);
    }
    const physicsElapsed = Math.max(0, elapsed - target.offsetDurationMs);
    const physicsProgress = Math.min(physicsElapsed / target.physicsDurationMs, 1);
    return target.offsetRatio + (1 - target.offsetRatio) * target.physicsEasing(physicsProgress);
  }

  function calculateResultFromAngle(angle, options) {
    if (!options || !options.length) return "";
    const totalWeight = options.reduce((sum, opt) => sum + (opt.weight || 1), 0);
    const pointerRelative = (0 - angle + 360) % 360;
    let acc = 0;
    for (const opt of options) {
      const angleSize = ((opt.weight || 1) / totalWeight) * 360;
      if (acc + angleSize > pointerRelative) return opt.label;
      acc += angleSize;
    }
    return options[0].label;
  }

  function normalizeAngle(angle) {
    const normalized = angle % 360;
    return normalized < 0 ? normalized + 360 : normalized;
  }

  // === TEXT PATH LOGIC ===
  const ELLIPSIS = "...";

  function calcArcLength(angleDeg, radius) {
    return (angleDeg * Math.PI * radius) / 180;
  }

  function getCharWidth(text, fontSize) {
    const cjkCount = (text.match(/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/g) || []).length;
    const ratio = cjkCount / Math.max(1, text.length);
    if (ratio > 0.5) return fontSize * 1.0;
    if (ratio > 0.2) return fontSize * 0.85;
    return fontSize * 0.7;
  }

  function getTextBounds(innerRadius, outerRadius, fontSize, baseFontSize) {
    const range = outerRadius - innerRadius;
    const fontRatio = fontSize / baseFontSize;
    const outerMargin = 0.12 + fontRatio * 0.16;
    const innerMargin = 0.2;
    return {
      inner: innerRadius + range * innerMargin,
      outer: outerRadius - range * outerMargin,
    };
  }

  function truncateWithEllipsis(text, maxChars) {
    if (maxChars < 1) return "";
    if (text.length <= maxChars) return text;
    if (maxChars <= ELLIPSIS.length) return ELLIPSIS.slice(0, maxChars);
    return `${text.slice(0, maxChars - ELLIPSIS.length)}${ELLIPSIS}`;
  }

  function normalizeWheelLines(lines) {
    const sanitized = lines.map((l) => l.trim()).filter(Boolean);
    if (sanitized.length <= 1) return sanitized;
    for (let i = 1; i < sanitized.length; i++) {
      const current = sanitized[i];
      if (/^[.,!?;:]+$/.test(current)) {
        sanitized[i - 1] = `${sanitized[i - 1]}${current}`;
        sanitized.splice(i, 1);
        i--;
      }
    }
    return sanitized;
  }

  function fitSingleText(text, fontSize, sectorAngle, bounds) {
    const charWidth = getCharWidth(text, fontSize);
    const lineHeight = fontSize * 1.2;
    const textHeight = bounds.outer - bounds.inner;
    const maxLines = Math.max(1, Math.min(2, Math.floor(textHeight / lineHeight)));
    const outerChars = Math.floor(calcArcLength(sectorAngle, bounds.outer) / charWidth);

    if (outerChars < 1) return { lines: [], truncated: true };

    const lines = [];
    const words = text.split(/\s+/).filter(Boolean);
    let wordIndex = 0;

    for (let lineIdx = 0; lineIdx < maxLines && wordIndex < words.length; lineIdx++) {
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
          wordIndex++;
          continue;
        }
        if (!line) {
          if (word.length > maxChars) {
            line = word.slice(0, maxChars);
            words[wordIndex] = word.slice(maxChars);
          } else {
            line = word;
            wordIndex++;
          }
        }
        break;
      }
      if (line) lines.push(line);
    }

    const normalizedLines = normalizeWheelLines(lines);
    const allWordsUsed = wordIndex >= words.length;
    const displayedText = normalizedLines.join(" ");
    const truncated = !allWordsUsed || displayedText.length < text.replace(/\s+/g, " ").trim().length * 0.95;

    if (truncated && normalizedLines.length > 0) {
      const lastLineIndex = normalizedLines.length - 1;
      const lineRadius = bounds.outer - lastLineIndex * lineHeight;
      const maxChars = Math.floor(calcArcLength(sectorAngle, lineRadius) / charWidth);
      if (maxChars >= 1) {
        normalizedLines[lastLineIndex] = truncateWithEllipsis(normalizedLines[lastLineIndex], maxChars);
      } else {
        return { lines: [], truncated: true };
      }
    }

    if (normalizedLines.length === 0) {
      const fallback = text.length > outerChars ? truncateWithEllipsis(text, outerChars) : text;
      return fallback ? { lines: [fallback], truncated: text.length > outerChars } : { lines: [], truncated: true };
    }
    return { lines: normalizedLines, truncated };
  }

  function fitTextIntoArcPath(text, sectorAngleDegrees, innerRadius, outerRadius, wheelSize) {
    const baseFontSize = Math.max(11, Math.min(20, Math.floor(wheelSize / 16)));
    const smallFontSize = Math.max(9, Math.min(14, Math.floor(wheelSize / 24)));
    const tinyFontSize = Math.max(8, Math.min(11, Math.floor(wheelSize / 32)));

    const baseBounds = getTextBounds(innerRadius, outerRadius, baseFontSize, baseFontSize);
    const baseResult = fitSingleText(text, baseFontSize, sectorAngleDegrees, baseBounds);

    if (baseResult.lines.length > 0 && (!baseResult.truncated || baseResult.lines.join("").replace(/\.\.\./g, "").length >= text.length * 0.85)) {
      return { lines: baseResult.lines, fontSize: baseFontSize, radius: baseBounds.outer };
    }

    const smallBounds = getTextBounds(innerRadius, outerRadius, smallFontSize, baseFontSize);
    const smallResult = fitSingleText(text, smallFontSize, sectorAngleDegrees, smallBounds);

    if (smallResult.lines.length > 0 && (!smallResult.truncated || smallResult.lines.join("").replace(/\.\.\./g, "").length >= text.length * 0.9)) {
      return { lines: smallResult.lines, fontSize: smallFontSize, radius: smallBounds.outer };
    }

    const tinyBounds = getTextBounds(innerRadius, outerRadius, tinyFontSize, baseFontSize);
    const tinyResult = fitSingleText(text, tinyFontSize, sectorAngleDegrees, tinyBounds);
    return { lines: tinyResult.lines, fontSize: tinyFontSize, radius: tinyBounds.outer };
  }

  function createArcPath(centerX, centerY, radius, startAngle, endAngle) {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + Math.sin(endRad) * radius;
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  }

  function calculateLineRadii(lines, innerLimit, outerLimit, fontSize) {
    if (lines.length === 0) return [];
    if (lines.length === 1) return [outerLimit - (outerLimit - innerLimit) * 0.3];
    const lineHeight = fontSize * 1.2;
    const totalHeight = (lines.length - 1) * lineHeight;
    const availableHeight = outerLimit - innerLimit;
    if (totalHeight <= availableHeight) {
      return lines.map((_, index) => outerLimit - index * lineHeight);
    }
    const spacing = availableHeight / Math.max(lines.length - 1, 1);
    return lines.map((_, index) => outerLimit - index * spacing);
  }

  function polarToCartesian(center, radius, angle) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: center + radius * Math.cos(rad), y: center + radius * Math.sin(rad) };
  }

  function describeSector(center, radius, startAngle, endAngle) {
    const start = polarToCartesian(center, radius, startAngle);
    const end = polarToCartesian(center, radius, endAngle);
    const largeArcFlag = endAngle - startAngle > 180 ? "1" : "0";
    return `M ${center} ${center} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
  }

  // === RENDER LOGIC ===
  function renderWheelSvg(options, rotation, clipPrefix, themeObj) {
    const totalWeight = options.reduce((sum, option) => sum + (option.weight || 1), 0);
    let startAngle = 0;

    let defs = '';
    let sectorsMarkup = '';

    options.forEach((option, sectorIndex) => {
      const sectorAngle = ((option.weight || 1) / totalWeight) * 360;
      const endAngle = startAngle + sectorAngle;
      
      const clipId = `${clipPrefix}-clip-${sectorIndex}`;
      
      let path;
      if (sectorAngle >= 359.9) {
        path = `M 220 4 A 216 216 0 1 1 219.9 4 Z`;
      } else {
        path = describeSector(WHEEL_CENTER, WHEEL_RADIUS, startAngle, endAngle);
      }

      const textFit = fitTextIntoArcPath(option.label, sectorAngle, WHEEL_RADIUS * 0.35, WHEEL_RADIUS * 0.85, 440);
      const lineRadii = calculateLineRadii(textFit.lines, WHEEL_RADIUS * 0.35, WHEEL_RADIUS * 0.85, textFit.fontSize);

      defs += `<clipPath id="${clipId}"><path d="${path}" /></clipPath>`;
      
      let textMarkup = '';
      lineRadii.forEach((radius, lineIndex) => {
        const textPathId = `${clipPrefix}-tp-${sectorIndex}-${lineIndex}`;
        const arcP = createArcPath(WHEEL_CENTER, WHEEL_CENTER, radius, startAngle + 1 - 90, endAngle - 1 - 90);
        defs += `<path d="${arcP}" fill="none" id="${textPathId}" />`;
        
        textMarkup += `
          <text
            fill="${themeObj.textColors[sectorIndex % themeObj.textColors.length]}"
            font-size="${textFit.fontSize * 1.05}"
            font-family="Outfit, Inter, system-ui, sans-serif"
            font-weight="800"
            letter-spacing="-0.02em"
            text-anchor="middle"
          >
            <textPath href="#${textPathId}" startOffset="50%">${escapeHtml(textFit.lines[lineIndex])}</textPath>
          </text>
        `;
      });

      sectorsMarkup += `
        <g>
          <path d="${path}" fill="${themeObj.palette[sectorIndex % themeObj.palette.length]}" stroke="rgba(0,0,0,0.1)" stroke-width="1.5" style="transform: scale(0.995); transform-origin: 220px 220px;" />
          <g clip-path="url(#${clipId})">
            ${textMarkup}
          </g>
        </g>
      `;

      startAngle = endAngle;
    });

    return `
      <svg viewBox="0 0 440 440" aria-hidden="true" style="transform: rotate(${rotation}deg)">
        <defs>${defs}</defs>
        <circle cx="220" cy="220" r="218" fill="rgba(0,0,0,0.03)" />
        ${sectorsMarkup}
      </svg>
    `;
  }

  function getSourceForHost(host, config) {
    const inlineTitle = host.getAttribute("title");
    const inlineOptionsStr = host.getAttribute("options");
    if (inlineTitle && inlineOptionsStr) {
       const optionsRaw = inlineOptionsStr.split(",").map(s => s.trim()).filter(Boolean);
       const weightsRaw = (host.getAttribute("weights") || "").split(",").map(s => parseFloat(s.trim()));
       const options = optionsRaw.map((label, index) => ({ label, weight: !isNaN(weightsRaw[index]) ? weightsRaw[index] : 1 }));
       return { isInline: true, share: { wheel: { wheelType: "s", name: inlineTitle, options }, url: config.origin } };
    }
    const src = host.getAttribute("src");
    if (src) {
      try {
        const url = new URL(src, config.origin);
        const match = url.pathname.match(/^\/w\/([^/]+)\/?$/);
        if (match) return { slug: decodeURIComponent(match[1]), url: url.toString() };
      } catch (error) {}
    }
    const slug = host.getAttribute("slug");
    if (!slug) return null;
    return { slug, url: `${config.origin.replace(/\/+$/, "")}/w/${encodeURIComponent(slug)}` };
  }

  async function fetchShare(slug, config) {
    const response = await fetch(`${config.origin.replace(/\/+$/, "")}/embed/data/${encodeURIComponent(slug)}.json`, { mode: "cors", credentials: "omit" });
    if (!response.ok) throw new Error(`Wheelora embed request failed`);
    const data = await response.json();
    return data.share ? data.share : data;
  }

  function renderWidget(host, share, config) {
    let shadowHost = host.querySelector("div[data-wheelora-shadow]");
    if (!shadowHost) {
      shadowHost = document.createElement("div");
      shadowHost.setAttribute("data-wheelora-shadow", "true");
      host.appendChild(shadowHost);
    }
    const shadow = shadowHost.shadowRoot || shadowHost.attachShadow({ mode: "open" });
    const wheel = share.wheel;
    let currentAngle = 0;
    let rotationVal = 0;
    let result = "Spin the wheel";
    let spinning = false;
    let spinTarget = null;
    let spinStartTime = 0;
    let startAngleForCurrentSpin = 0;
    let animationFrame = null;

    const themeKey = host.getAttribute("theme") || "minimal";
    const THEME = THEMES[themeKey] || THEMES.minimal;

    const clipPrefix = 'w' + Math.floor(getSecureRandom() * 10000);

    function updateDOM() {
      const svg = shadow.querySelector('.wheel-stage svg');
      const resultText = shadow.querySelector('.result-text');
      const badge = shadow.querySelector('.result-badge');
      const spinIcon = shadow.querySelector('.spin-icon');
      const normalIcon = shadow.querySelector('.normal-icon');
      
      if (svg) svg.style.transform = `rotate(${rotationVal}deg)`;
      if (resultText) resultText.textContent = result;
      if (badge) {
        if (spinning) badge.classList.add('pulsing');
        else badge.classList.remove('pulsing');
      }
      if (spinIcon && normalIcon) {
        if (spinning) {
          spinIcon.style.display = "block";
          normalIcon.style.display = "none";
        } else {
          spinIcon.style.display = "none";
          normalIcon.style.display = "block";
        }
      }
    }

    function renderInitial() {
      shadow.innerHTML = `
        <style>
          :host { display: block; width: 100%; }
          * { box-sizing: border-box; }
          .shell {
            position: relative;
            border-radius: 20px;
            border: ${THEME.border};
            background: ${THEME.panelBg};
            color: ${THEME.textColor};
            font-family: Outfit, Inter, system-ui, sans-serif;
            padding: 24px 16px;
            box-shadow: ${THEME.boxShadow};
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 24px;
            max-width: 480px;
            margin: 0 auto;
            transition: all 0.3s ease;
          }
          .header {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            width: 100%;
          }
          .logo-branding {
            display: block;
            margin-bottom: 8px;
            text-decoration: none;
            color: ${THEME.textColor};
          }
          .logo-branding img {
            width: 36px;
            height: 36px;
            display: block;
            margin: 0 auto;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .logo-branding span {
            font-size: 11px;
            font-weight: 600;
            opacity: 0.6;
            display: block;
            margin-top: 6px;
          }
          h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            line-height: 1.1;
            letter-spacing: -0.03em;
            max-width: 90%;
          }
          .stage {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 24px;
          }
          .wheel-stage {
            position: relative;
            width: 100%;
            max-width: 320px;
            aspect-ratio: 1;
            filter: drop-shadow(0 15px 30px rgba(0,0,0,0.15));
          }
          .wheel-stage svg.wheel {
            width: 100%;
            height: 100%;
            will-change: transform;
          }
          .pin {
            position: absolute;
            top: -12px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 14px solid transparent;
            border-right: 14px solid transparent;
            border-top: 20px solid ${THEME.buttonBg};
            z-index: 10;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
          }
          .spin-btn {
            position: absolute;
            inset: 50% auto auto 50%;
            transform: translate(-50%, -50%);
            width: 20%;
            height: 20%;
            border: none;
            border-radius: 50%;
            background: ${THEME.buttonBg};
            cursor: pointer;
            padding: 2px;
            z-index: 10;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .spin-btn:hover {
            transform: translate(-50%, -50%) scale(1.05);
          }
          .spin-btn:active {
            transform: translate(-50%, -50%) scale(0.95);
          }
          .inner-hub {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: ${THEME.wheelCenterBg};
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.05);
          }
          .inner-hub svg {
            width: 40%;
            height: 40%;
            stroke: ${THEME.wheelCenterIcon};
          }
          .spin-icon {
            display: none;
            animation: spin 1.5s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .result-badge {
            background: ${THEME.badgeBg};
            padding: 14px 24px;
            border-radius: 12px;
            min-height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            max-width: 320px;
            cursor: pointer;
            transition: filter 0.2s;
          }
          .result-badge:hover {
            filter: brightness(0.95);
          }
          .result-badge.pulsing {
            animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            filter: brightness(1.05);
            cursor: default;
          }
          .result-text {
            font-size: 20px;
            font-weight: 800;
            color: ${THEME.badgeText};
            margin: 0;
            line-height: 1.2;
          }
        </style>
        <article class="shell">
          <div class="header">
            <a href="${escapeHtml(config.origin)}" target="_blank" rel="noreferrer" class="logo-branding" aria-label="Wheelora">
              <img src="${escapeHtml(config.origin)}/assets/brand/wheelora-icon-120.png" alt="Wheelora Logo" />
              <span>Supported by wheelora.ai</span>
            </a>
            <h2>${escapeHtml(wheel.name)}</h2>
          </div>
          <div class="stage">
            <div class="wheel-stage">
              <div class="pin"></div>
              ${renderWheelSvg(wheel.options, currentAngle, clipPrefix, THEME)}
              <button class="spin-btn" type="button" aria-label="Spin wheel">
                <div class="inner-hub">
                  <svg class="normal-icon" viewBox="0 0 24 24" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5" fill="${THEME.wheelCenterIcon}"></circle>
                    <circle cx="15.5" cy="15.5" r="1.5" fill="${THEME.wheelCenterIcon}"></circle>
                    <circle cx="15.5" cy="8.5" r="1.5" fill="${THEME.wheelCenterIcon}"></circle>
                    <circle cx="8.5" cy="15.5" r="1.5" fill="${THEME.wheelCenterIcon}"></circle>
                  </svg>
                  <svg class="spin-icon" viewBox="0 0 24 24" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                    <path d="M21 3v5h-5"></path>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                    <path d="M8 16H3v5"></path>
                  </svg>
                </div>
              </button>
            </div>
            <div class="result-badge">
              <span class="result-text">${escapeHtml(result)}</span>
            </div>
          </div>
        </article>
      `;

      const executeSpin = () => {
        const now = performance.now();
        let currentStart = rotationVal;

        if (spinning && spinTarget) {
          const elapsed = now - spinStartTime;
          const progress = getProgress(elapsed, spinTarget);
          currentStart = startAngleForCurrentSpin + (spinTarget.finalTarget - startAngleForCurrentSpin) * progress;
        }

        startAngleForCurrentSpin = currentStart;
        spinTarget = generatePhysicsSpinTarget(currentStart);

        if (spinning) {
           spinTarget.finalTarget += 360 * 3; 
           spinTarget.totalDurationMs += 1000;
           spinTarget.physicsDurationMs += 1000;
           
           const btn = shadow.querySelector('.spin-btn');
           if(btn) {
               btn.animate([{transform: 'translate(-50%, -50%) scale(0.9)'}, {transform: 'translate(-50%, -50%) scale(1)'}], {duration: 200});
           }
        }

        spinStartTime = now;
        spinning = true;
        updateDOM();

        if (animationFrame !== null) cancelAnimationFrame(animationFrame);

        const tick = (time) => {
          if (!spinTarget) return;
          const elapsed = time - spinStartTime;
          const progress = getProgress(elapsed, spinTarget);
          const currentRotation = startAngleForCurrentSpin + (spinTarget.finalTarget - startAngleForCurrentSpin) * progress;
          const currentAngle = normalizeAngle(currentRotation);

          rotationVal = currentRotation;
          result = calculateResultFromAngle(currentAngle, wheel.options);
          
          if (elapsed < spinTarget.totalDurationMs) {
            updateDOM();
            animationFrame = requestAnimationFrame(tick);
            return;
          }

          const finalAngle = normalizeAngle(spinTarget.finalTarget);
          rotationVal = spinTarget.finalTarget;
          result = calculateResultFromAngle(finalAngle, wheel.options);
          spinning = false;
          spinTarget = null;
          animationFrame = null;
          updateDOM();
        };

        animationFrame = requestAnimationFrame(tick);
      };

      const spinButton = shadow.querySelector(".spin-btn");
      if (spinButton) spinButton.addEventListener("click", executeSpin);

      const resultBadge = shadow.querySelector(".result-badge");
      if (resultBadge) resultBadge.addEventListener("click", executeSpin);
    }

    renderInitial();
  }

  async function mount(host, config) {
    if (host.dataset.wheeloraReady === "true") return;
    const source = getSourceForHost(host, config);
    if (!source) return;

    host.dataset.wheeloraReady = "true";
    host.innerHTML = "";

    try {
      let share = source.isInline ? source.share : await fetchShare(source.slug, config);
      renderWidget(host, share, config);
    } catch (error) {
      console.error("[Wheelora] Failed to render embed", error);
    }
  }

  function boot() {
    if (!document.getElementById("wheelora-global-style")) {
      const style = document.createElement("style");
      style.id = "wheelora-global-style";
      style.innerHTML = "wheelora { display: block; width: 100%; min-height: 400px; }";
      document.head.appendChild(style);
    }

    const config = parseMeta();

    function initNode(node) {
      if (node.dataset.wheeloraReady === "true") return;
      mount(node, config);
    }

    document.querySelectorAll("wheelora").forEach(initNode);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.tagName && node.tagName.toLowerCase() === 'wheelora') {
            initNode(node);
          } else if (node.querySelectorAll) {
            node.querySelectorAll('wheelora').forEach(initNode);
          }
        });
      });
    });
    
    mutationObserver.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
  document.addEventListener("astro:page-load", boot);
})();
