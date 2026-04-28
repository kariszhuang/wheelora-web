<script lang="ts">
  import { onMount } from "svelte";
  import { calculateResultFromAngle, generatePhysicsSpinTarget } from "../../lib/spinLogic";
  import { calculateLineRadii, createArcPath, fitTextIntoArcPath } from "../../lib/textPathFitting";
  import { Sparkles, Dices, RefreshCw } from "lucide-svelte";
  
  const themes = {
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
      badgeText: "#111111",
      tabActiveBg: "#111111",
      tabActiveText: "#FFFFFF",
      tabBg: "rgba(17,17,17,0.1)",
      tabText: "rgba(17,17,17,0.6)"
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
      badgeText: "#39FF14",
      tabActiveBg: "#FAFAFA",
      tabActiveText: "#111317",
      tabBg: "rgba(255,255,255,0.1)",
      tabText: "rgba(255,255,255,0.5)"
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
      badgeText: "#C5A059",
      tabActiveBg: "#231F19",
      tabActiveText: "#FFFDF8",
      tabBg: "rgba(35,31,25,0.06)",
      tabText: "rgba(35,31,25,0.5)"
    }
  };

  const wheels = [
    {
      name: "Playful",
      prompt: "Punchy, bright, and delightfully loud.",
      themeKey: "playful",
      options: [
        { label: "Cozy but not boring vibes", weight: 7 },
        { label: "Walkable wanderlust", weight: 6 },
        { label: "Wallet-friendly feast", weight: 8 },
        { label: "Breakfast for dinner", weight: 9 },
        { label: "Taco Tuesday, any day", weight: 10 },
        { label: "A giant bowl of noodles", weight: 9 },
      ],
    },
    {
      name: "Dark Neon",
      prompt: "Deep contrast with neon energy.",
      themeKey: "dark",
      options: [
        { label: "Inbox is loud", weight: 1 },
        { label: "Project feels too big", weight: 2 },
        { label: "House task keeps nagging", weight: 1 },
        { label: "Need one visible win", weight: 2 },
        { label: "Administrative backlog", weight: 1 },
        { label: "High-priority deadline", weight: 3 },
      ],
    },
    {
      name: "Elegant",
      prompt: "Warm luxury with refined calm.",
      themeKey: "elegant",
      options: [
        { label: "Everyone says whatever", weight: 10 },
        { label: "Hiking in 90-degree weather", weight: 3 },
        { label: "$15 max budget friend", weight: 5 },
        { label: "Eight-minute drive limit", weight: 8 },
        { label: "Three-hour dinner debate", weight: 9 },
        { label: "Aggressive group-chat silence", weight: 6 },
      ],
    },
  ];

  const WHEEL_CENTER = 220;
  const WHEEL_STROKE_WIDTH = 0; // borderless modern look
  const WHEEL_RADIUS = WHEEL_CENTER - 4;

  function normalizeAngle(angle: number): number {
    const normalized = angle % 360;
    return normalized < 0 ? normalized + 360 : normalized;
  }

  function polarToCartesian(center: number, radius: number, angle: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  }

  function describeSector(center: number, radius: number, startAngle: number, endAngle: number) {
    const start = polarToCartesian(center, radius, startAngle);
    const end = polarToCartesian(center, radius, endAngle);
    const largeArcFlag = endAngle - startAngle > 180 ? "1" : "0";

    return [
      `M ${center} ${center}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      "Z",
    ].join(" ");
  }

  function getProgress(elapsed: number, target: any) {
    if (target.offsetDurationMs > 0 && elapsed <= target.offsetDurationMs) {
      return target.offsetRatio * (elapsed / target.offsetDurationMs);
    }
    const physicsElapsed = Math.max(0, elapsed - target.offsetDurationMs);
    const physicsProgress = Math.min(physicsElapsed / target.physicsDurationMs, 1);
    return target.offsetRatio + (1 - target.offsetRatio) * target.physicsEasing(physicsProgress);
  }

  let activeWheelIndex = 0;
  let rotation = 0;
  let spinning = false;
  let result = "Spin the wheel";
  let animationFrame: number | null = null;
  let rotationVal = 0;
  let startAngleForCurrentSpin = 0;

  $: currentTheme = themes[wheels[activeWheelIndex].themeKey as keyof typeof themes];

  $: options = wheels[activeWheelIndex].options.map((option, index) => ({
    text: option.label,
    label: option.label,
    weight: option.weight,
    backgroundColor: currentTheme.palette[index % currentTheme.palette.length],
    textColor: currentTheme.textColors[index % currentTheme.textColors.length],
  }));

  $: sectors = (() => {
    const totalWeight = options.reduce((sum, option) => sum + (option.weight || 1), 0);
    let startAngle = 0;
    return options.map((option, sectorIndex) => {
      const sectorAngle = ((option.weight || 1) / totalWeight) * 360;
      const endAngle = startAngle + sectorAngle;
      const textFit = fitTextIntoArcPath(option.text, sectorAngle, WHEEL_RADIUS * 0.35, WHEEL_RADIUS * 0.85, 440);
      const textInnerLimit = WHEEL_RADIUS * 0.35;
      const textOuterLimit = WHEEL_RADIUS * 0.85;
      const lineRadii = calculateLineRadii(textFit.lines, textInnerLimit, textOuterLimit, textFit.fontSize);
      const sector = {
        clipPathId: `web-sector-clip-${activeWheelIndex}-${sectorIndex}`,
        option,
        path: describeSector(WHEEL_CENTER, WHEEL_RADIUS, startAngle, endAngle),
        startAngle,
        endAngle,
        textFit,
        lineRadii,
      };
      startAngle = endAngle;
      return sector;
    });
  })();

  async function selectWheel(index: number) {
    if (spinning) return;
    document.querySelector('.wheel-container')?.animate([
        { transform: 'scale(1)', filter: 'brightness(1)' },
        { transform: 'scale(0.97)', filter: 'brightness(0.9)' },
        { transform: 'scale(1)', filter: 'brightness(1)' }
    ], { duration: 300, easing: 'ease' });
    activeWheelIndex = index;
    result = "Spin the wheel";
    rotationVal = 0;
    rotation = 0;
  }

  let spinTarget: any = null;
  let spinStartTime = 0;

  function spin() {
    const now = performance.now();
    let currentStart = rotationVal;

    if (spinning && spinTarget) {
      const elapsed = now - spinStartTime;
      const progress = getProgress(elapsed, spinTarget);
      currentStart = startAngleForCurrentSpin + (spinTarget.finalTarget - startAngleForCurrentSpin) * progress;
    }

    startAngleForCurrentSpin = currentStart;
    spinTarget = generatePhysicsSpinTarget(currentStart, "Medium", "Medium");
    
    if (spinning) {
       spinTarget.finalTarget += 360 * 3; 
       spinTarget.totalDurationMs += 1000;
       spinTarget.physicsDurationMs += 1000;
       
       const btn = document.querySelector('.spin-btn');
       if(btn) {
           btn.animate([{transform: 'scale(0.9)'}, {transform: 'scale(1)'}], {duration: 200});
       }
    }

    spinStartTime = now;
    spinning = true;
    result = calculateResultFromAngle(normalizeAngle(currentStart), options);

    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
    }

    const tick = (time: number) => {
      const elapsed = time - spinStartTime;
      const progress = getProgress(elapsed, spinTarget);
      const currentRotation = startAngleForCurrentSpin + (spinTarget.finalTarget - startAngleForCurrentSpin) * progress;
      const currentAngle = normalizeAngle(currentRotation);

      rotationVal = currentAngle;
      rotation = currentRotation; 
      result = calculateResultFromAngle(currentAngle, options);

      if (elapsed < spinTarget.totalDurationMs) {
        animationFrame = requestAnimationFrame(tick);
        return;
      }

      const finalAngle = normalizeAngle(spinTarget.finalTarget);
      rotationVal = finalAngle;
      rotation = spinTarget.finalTarget; 
      result = calculateResultFromAngle(finalAngle, options);
      spinning = false;
      spinTarget = null;
      animationFrame = null;
    };

    animationFrame = requestAnimationFrame(tick);
  }

  onMount(() => {
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  });
</script>

<div class="interactive-wheel-layout" style="
  --theme-panel-bg: {currentTheme.panelBg};
  --theme-text: {currentTheme.textColor};
  --theme-border: {currentTheme.border};
  --theme-shadow: {currentTheme.boxShadow};
  --theme-btn-bg: {currentTheme.buttonBg};
  --theme-btn-text: {currentTheme.buttonText};
  --theme-wheel-hub-bg: {currentTheme.wheelCenterBg};
  --theme-wheel-hub-icon: {currentTheme.wheelCenterIcon};
  --theme-badge-bg: {currentTheme.badgeBg};
  --theme-badge-text: {currentTheme.badgeText};
  --theme-tab-active-bg: {currentTheme.tabActiveBg};
  --theme-tab-active-text: {currentTheme.tabActiveText};
  --theme-tab-bg: {currentTheme.tabBg};
  --theme-tab-text: {currentTheme.tabText};
">
  <div class="wheel-panel glass-panel">
    <div class="wheel-header">
      <div class="tabs">
        {#each wheels as wheel, index}
          <button
            class="tab-btn"
            class:active={activeWheelIndex === index}
            on:click={() => selectWheel(index)}
          >
            {wheel.name}
          </button>
        {/each}
      </div>
    </div>
    
    <div class="wheel-container">
      <svg
        class="main-svg"
        viewBox="0 0 440 440"
        style={`transform: rotate(${rotation}deg)`}
      >
        <defs>
          {#each sectors as sector}
            <clipPath id={sector.clipPathId}>
              <path d={sector.path} />
            </clipPath>
          {/each}
          {#each sectors as sector, sectorIndex}
            {#each sector.lineRadii as lineRadius, lineIndex}
              <path
                d={createArcPath(220, 220, lineRadius, sector.startAngle + 1 - 90, sector.endAngle - 1 - 90)}
                fill="none"
                id={`textpath-${activeWheelIndex}-${sectorIndex}-${lineIndex}`}
              />
            {/each}
          {/each}
        </defs>

        <circle cx="220" cy="220" r="218" fill="rgba(0,0,0,0.03)" />
        
        {#each sectors as sector, sectorIndex}
          <g>
            <path d={sector.path} fill={sector.option.backgroundColor} stroke="rgba(0,0,0,0.1)" stroke-width="1.5" style="transform: scale(0.995); transform-origin: 220px 220px;" />
            <g clip-path={`url(#${sector.clipPathId})`}>
              {#each sector.textFit.lines as line, lineIndex}
                <text
                  fill={sector.option.textColor}
                  font-size={sector.textFit.fontSize * 1.05}
                  font-family="Outfit, Inter, system-ui, sans-serif"
                  font-weight="800"
                  letter-spacing="-0.02em"
                  text-anchor="middle"
                >
                  <textPath
                    href={`#textpath-${activeWheelIndex}-${sectorIndex}-${lineIndex}`}
                    startOffset="50%"
                  >
                    {line}
                  </textPath>
                </text>
              {/each}
            </g>
          </g>
        {/each}
        
      </svg>

      <button class="spin-btn" aria-label={spinning ? "Keep spinning" : "Spin wheel"} type="button" on:click={spin}>
        <div class="inner-hub">
          {#if spinning}
           <RefreshCw size={24} color="var(--theme-wheel-hub-icon)" class="spin-icon" style="animation: spin 1.5s linear infinite"/>
          {:else}
           <Dices size={24} color="var(--theme-wheel-hub-icon)" />
          {/if}
        </div>
      </button>

      <div class="pin">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="var(--theme-btn-bg)" style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3))">
          <path d="M12 2L20 10C20 10 16 22 12 22C8 22 4 10 4 10L12 2Z" />
        </svg>
      </div>
    </div>

    <div class="wheel-footer">
      <div class="result-badge" class:pulsing={spinning}>
        <span class="result-text">{result}</span>
      </div>
      <p class="wheel-prompt">
        <Sparkles size={14} color="var(--theme-wheel-hub-icon)" class="prompt-icon" /> {wheels[activeWheelIndex].prompt}
      </p>
    </div>
  </div>
</div>

<style>
  .interactive-wheel-layout {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 0;
    transition: all 0.4s ease;
  }

  .glass-panel {
    background: var(--theme-panel-bg);
    border: var(--theme-border);
    border-radius: 20px;
    padding: clamp(1rem, 3vw, 2rem);
    box-shadow: var(--theme-shadow);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    max-width: 100%;
    width: min(100%, 40rem);
    box-sizing: border-box;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .wheel-header {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .tabs {
    display: flex;
    gap: 0.5rem;
    background: var(--theme-tab-bg);
    padding: 0.4rem;
    border-radius: 100px;
  }

  .tab-btn {
    background: transparent;
    color: var(--theme-tab-text);
    border: none;
    font-size: 0.9rem;
    font-weight: 700;
    padding: 0.6rem 1.2rem;
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .tab-btn:hover {
    opacity: 0.8;
  }

  .tab-btn.active {
    background: var(--theme-tab-active-bg);
    color: var(--theme-tab-active-text);
  }

  .wheel-container {
    position: relative;
    width: 100%;
    max-width: min(32rem, 100%);
    aspect-ratio: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    filter: drop-shadow(0 15px 30px rgba(0,0,0,0.15));
  }

  .main-svg {
    width: 100%;
    height: 100%;
    will-change: transform;
  }

  .spin-btn {
    position: absolute;
    width: 20%;
    height: 20%;
    border-radius: 50%;
    background: var(--theme-btn-bg);
    border: none;
    padding: 2px;
    cursor: pointer;
    z-index: 10;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .spin-btn:hover {
    transform: scale(1.05);
  }

  .spin-btn:active {
    transform: scale(0.95);
  }

  .inner-hub {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: var(--theme-wheel-hub-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.05);
    transition: background 0.4s ease;
  }

  .pin {
    position: absolute;
    top: -12px;
    z-index: 20;
    pointer-events: none;
    transform-origin: center bottom;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .wheel-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    text-align: center;
  }

  .result-badge {
    background: var(--theme-badge-bg);
    padding: 0.8rem 1.5rem;
    border-radius: 12px;
    min-height: 3.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s ease;
  }

  .result-badge.pulsing {
    animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    filter: brightness(1.1);
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.03); }
  }

  .result-text {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--theme-badge-text);
    margin: 0;
    line-height: 1.2;
    transition: color 0.4s ease;
  }

  .wheel-prompt {
    font-size: 0.95rem;
    color: var(--theme-text);
    margin: 0;
    max-width: 88%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    line-height: 1.5;
    font-weight: 500;
    opacity: 0.8;
  }

  :global(.prompt-icon) {
    flex-shrink: 0;
    transition: color 0.4s ease;
  }

  @media (max-width: 640px) {
    .interactive-wheel-layout {
      width: 100%;
    }

    .glass-panel {
      gap: 1.5rem;
      padding: 1.25rem;
      width: 100%;
    }

    .tabs {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      width: 100%;
    }

    .tab-btn {
      font-size: 0.82rem;
      min-width: 0;
      padding: 0.6rem 0.45rem;
    }

    .wheel-container {
      max-width: min(100%, 26rem);
    }

    .result-badge {
      min-height: 3rem;
      padding: 0.65rem 0.8rem;
      width: 100%;
    }

    .result-text {
      font-size: 1.1rem;
    }
  }
</style>