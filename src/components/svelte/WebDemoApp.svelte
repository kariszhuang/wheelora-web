<script lang="ts">
  import { onMount } from "svelte";
  import { activeTheme } from "../../store/theme";
  import { calculateResultFromAngle, generatePhysicsSpinTarget, getTapSpinSpeed } from "../../lib/spinLogic";
  import { layoutWheelSectors } from "../../lib/textPathFitting";
  import { Sparkles, ChevronRight, Home } from "lucide-svelte";
  import HandPointerIcon from "./HandPointerIcon.svelte";
  import type { DemoCopy } from "../../i18n/home";

  type DemoWheel = {
    id: string;
    name: string;
    emoji: string;
    toneLabel: string;
    toneEmoji: string;
    prompt: string;
    options: { label: string; weight: number }[];
  };

  export let copy: DemoCopy | undefined = undefined;
  
  const themes = {
    minimal: {
      palette: ["#C7D2FE", "#FED7AA", "#BBF7D0", "#FBCFE8", "#BAE6FD", "#FDE68A", "#DDD6FE", "#D9F99D"],
      textColors: ["#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000"],
      panelBg: "#FFFFFF",
      textColor: "#111827",
      buttonBg: "#111827",
      buttonText: "#FFFFFF",
      wheelCenterBg: "#FFFFFF",
      wheelCenterIcon: "#111111",
      border: "1px solid #E5E7EB",
      boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
      badgeBg: "#F3F4F6",
      badgeText: "#111827",
      tabActiveBg: "#111827",
      tabActiveText: "#FFFFFF",
      tabBg: "#F3F4F6",
      tabText: "#6B7280",
      pageBg: "#FFFFFF",
      listItemBg: "#F9FAFB",
      listItemBorder: "#F3F4F6",
      freshResultBg: "#E0E7FF",
      freshResultText: "#3730A3",
      freshResultBorder: "#A5B4FC"
    },
    playful: {
      palette: ["#FF6B6B", "#06D6A0", "#FFD166", "#4D96FF", "#FF8FAB", "#2EC4B6", "#FF9F1C", "#A855F7"],
      textColors: ["#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000"],
      panelBg: "#FFFFFF",
      textColor: "#111827",
      buttonBg: "#FF5A36",
      buttonText: "#FFFFFF",
      wheelCenterBg: "#FFFFFF",
      wheelCenterIcon: "#111111",
      border: "2px solid #1F2937",
      boxShadow: "8px 8px 0px rgba(31,41,55,1)",
      badgeBg: "#FFE082",
      badgeText: "#111111",
      tabActiveBg: "#111111",
      tabActiveText: "#FFFFFF",
      tabBg: "rgba(17,17,17,0.1)",
      tabText: "rgba(17,17,17,0.6)",
      pageBg: "#FFF7ED",
      listItemBg: "#FFFFFF",
      listItemBorder: "#1F2937",
      freshResultBg: "#FFE4DE",
      freshResultText: "#9A3412",
      freshResultBorder: "#FDB5A7"
    },
    dark: {
      palette: ["#FF4D6D", "#00D4FF", "#FF9F1C", "#A855F7", "#2EE86F", "#FF2BD6", "#F9F871", "#4D7CFE"],
      textColors: ["#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000"],
      panelBg: "#111317",
      textColor: "#FAFAFA",
      buttonBg: "#39FF14",
      buttonText: "#000000",
      wheelCenterBg: "#111317",
      wheelCenterIcon: "#111111",
      border: "1px solid #2C2E36",
      boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
      badgeBg: "rgba(57,255,20,0.1)",
      badgeText: "#39FF14",
      tabActiveBg: "#FAFAFA",
      tabActiveText: "#111317",
      tabBg: "rgba(255,255,255,0.1)",
      tabText: "rgba(255,255,255,0.5)",
      pageBg: "#09090b",
      listItemBg: "#18181b",
      listItemBorder: "#27272a",
      freshResultBg: "rgba(57,255,20,0.16)",
      freshResultText: "#B7FF8A",
      freshResultBorder: "rgba(57,255,20,0.46)"
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
      tabText: "rgba(35,31,25,0.5)",
      pageBg: "#FDFBF7",
      listItemBg: "#FFFFFF",
      listItemBorder: "#EAE6DF",
      freshResultBg: "#F6EDDC",
      freshResultText: "#76551E",
      freshResultBorder: "#D8C7A7"
    }
  };

  const defaultWheels: DemoWheel[] = [
    {
      id: "tiny-side-quest",
      name: "Tiny Side Quest",
      emoji: "🗺️",
      toneLabel: "Chaotic",
      toneEmoji: "🤪",
      prompt: "Chaotic tone from Weekend Adventure.",
      options: [
        { label: "Gas station snack prophecy", weight: 8 },
        { label: "Ferally confident thrift sprint", weight: 6 },
        { label: "Sunset fries like destiny", weight: 10 },
        { label: "Follow a weird poster outside", weight: 5 },
        { label: "Coffee shop side-character arc", weight: 7 },
        { label: "Stay in, become a blanket burrito", weight: 4 },
      ],
    },
    {
      id: "dinner-rescue",
      name: "Dinner Rescue",
      emoji: "🍜",
      toneLabel: "Friendly",
      toneEmoji: "😊",
      prompt: "Friendly tone: what should we eat tonight?",
      options: [
        { label: "Big noodle bowl comfort", weight: 9 },
        { label: "Tacos and a short walk", weight: 8 },
        { label: "Breakfast for dinner", weight: 7 },
        { label: "Try the saved spot", weight: 5 },
        { label: "Cheap tasty default", weight: 8 },
        { label: "Cook once, leftovers tomorrow", weight: 6 },
      ],
    },
    {
      id: "focus-sprint",
      name: "Focus Sprint",
      emoji: "⚡",
      toneLabel: "Serious",
      toneEmoji: "🧐",
      prompt: "Serious tone: too much to do, cannot start.",
      options: [
        { label: "25-minute priority sprint", weight: 10 },
        { label: "Send the blocking message", weight: 8 },
        { label: "Clear the urgent admin", weight: 6 },
        { label: "Open the project and outline", weight: 9 },
        { label: "Delete one fake task", weight: 4 },
        { label: "Reset desk, then start", weight: 5 },
      ],
    },
    {
      id: "worth-it",
      name: "Worth It?",
      emoji: "🛍️",
      toneLabel: "Sarcastic",
      toneEmoji: "🙃",
      prompt: "Sarcastic tone: buy it or be responsible?",
      options: [
        { label: "Wait 48 hours, financial genius", weight: 10 },
        { label: "Screenshot it and feel something", weight: 8 },
        { label: "Check resale like an adult", weight: 7 },
        { label: "Buy the boring useful one", weight: 5 },
        { label: "Set a budget, tragic concept", weight: 6 },
        { label: "Treat yourself, but less delusional", weight: 4 },
      ],
    },
  ];

  const wheels: DemoWheel[] = copy
    ? [{ id: "localized-dinner-rescue", ...copy.wheel }]
    : defaultWheels;
  const initialVariant = { wheelIndex: copy ? 0 : 1, theme: "minimal" } as const;
  const initialResult = copy?.result ?? "Spin for a decision";
  activeTheme.set(initialVariant.theme);

  let currentScreen: "list" | "detail" = "detail";
  let activeWheelIndex = initialVariant.wheelIndex;

  let quickSpinning: Record<string, boolean> = {};
  let listResults: Record<string, string> = {};
  let listTimestamps: Record<string, number> = {};
  let listAngles: Record<string, number> = {};
  let listRotations: Record<string, number> = {};
  let listAnimationFrames: Record<string, number> = {};

  let detailRotation = 0;
  let detailSpinning = false;
  let detailResult = initialResult;
  let detailAnimationFrame: number | null = null;
  let detailRotationVal = 0;
  let detailStartAngleForCurrentSpin = 0;
  let detailSpinTarget: any = null;
  let detailSpinStartTime = 0;

  function normalizeAngle(angle: number): number {
    const normalized = angle % 360;
    return normalized < 0 ? normalized + 360 : normalized;
  }

  function getProgress(elapsed: number, target: any) {
    if (target.offsetDurationMs > 0 && elapsed <= target.offsetDurationMs) {
      return target.offsetRatio * (elapsed / target.offsetDurationMs);
    }
    const physicsElapsed = Math.max(0, elapsed - target.offsetDurationMs);
    const physicsProgress = Math.min(physicsElapsed / target.physicsDurationMs, 1);
    return target.offsetRatio + (1 - target.offsetRatio) * target.physicsEasing(physicsProgress);
  }

  $: currentTheme = themes[$activeTheme as keyof typeof themes] || themes.playful;
  $: activeWheel = wheels[activeWheelIndex];

  $: options = wheels[activeWheelIndex].options.map((option, index) => ({
    text: option.label,
    label: option.label,
    weight: option.weight,
    backgroundColor: currentTheme.palette[index % currentTheme.palette.length],
    textColor: currentTheme.textColors[index % currentTheme.textColors.length],
  }));

  $: sectors = layoutWheelSectors(
    options,
    `web-sector-${activeWheelIndex}`,
  );

  function goHome() {
    if (detailSpinning) return;
    currentScreen = "list";
  }

  function cancelQuickSpin(wheelId: string) {
    if (listAnimationFrames[wheelId]) {
      cancelAnimationFrame(listAnimationFrames[wheelId]);
      delete listAnimationFrames[wheelId];
      listAnimationFrames = { ...listAnimationFrames };
    }
    quickSpinning[wheelId] = false;
    quickSpinning = { ...quickSpinning };
  }

  function goToDetail(index: number) {
    Object.keys(quickSpinning).forEach((wheelId) => cancelQuickSpin(wheelId));
    activeWheelIndex = index;
    detailResult = listResults[wheels[index].id] || initialResult;
    detailRotationVal = listAngles[wheels[index].id] ?? 0;
    detailRotation = listRotations[wheels[index].id] ?? detailRotationVal;
    currentScreen = "detail";
  }

  function spinOptionsForWheel(wheel: DemoWheel) {
    return wheel.options.map((opt, i) => ({
      text: opt.label,
      label: opt.label,
      weight: opt.weight,
      backgroundColor: currentTheme.palette[i % currentTheme.palette.length],
      textColor: currentTheme.textColors[i % currentTheme.textColors.length],
    }));
  }

  function handleQuickSpin(index: number, event: Event) {
    event.stopPropagation();
    const wheel = wheels[index];
    const wasSpinning = quickSpinning[wheel.id] === true;
    if (listAnimationFrames[wheel.id]) {
      cancelAnimationFrame(listAnimationFrames[wheel.id]);
    }

    quickSpinning[wheel.id] = true;
    quickSpinning = { ...quickSpinning };
    
    const wheelOptions = spinOptionsForWheel(wheel);
    const startAngle = listRotations[wheel.id] ?? listAngles[wheel.id] ?? 0;
    const target = generatePhysicsSpinTarget(
      startAngle,
      getTapSpinSpeed(wasSpinning, "Medium"),
      "Medium",
    );

    let startTime = performance.now();

    const tick = (time: number) => {
      const elapsed = time - startTime;
      const progress = getProgress(elapsed, target);
      const currentRotation = startAngle + (target.finalTarget - startAngle) * progress;
      const currentAngle = normalizeAngle(currentRotation);

      listRotations[wheel.id] = currentRotation;
      listRotations = { ...listRotations };
      const nextResult = calculateResultFromAngle(currentAngle, wheelOptions);
      if (listResults[wheel.id] !== nextResult) {
        listResults = { ...listResults, [wheel.id]: nextResult };
      }

      if (elapsed < target.totalDurationMs) {
         listAnimationFrames[wheel.id] = requestAnimationFrame(tick);
         return;
      }
      
      const finalAngle = normalizeAngle(target.finalTarget);
      const finalResult = calculateResultFromAngle(finalAngle, wheelOptions);
      
      listAngles[wheel.id] = finalAngle;
      listAngles = { ...listAngles };
      listRotations[wheel.id] = target.finalTarget;
      listRotations = { ...listRotations };
      if (listResults[wheel.id] !== finalResult) {
        listResults = { ...listResults, [wheel.id]: finalResult };
      }
      listTimestamps[wheel.id] = Date.now();
      listTimestamps = { ...listTimestamps };
      
      quickSpinning[wheel.id] = false;
      quickSpinning = { ...quickSpinning };
    };
    
    listAnimationFrames[wheel.id] = requestAnimationFrame(tick);
  }

  function detailSpin() {
    const now = performance.now();
    const wasSpinning = detailSpinning && detailSpinTarget !== null;
    let currentStart = detailRotationVal;

    if (wasSpinning && detailSpinTarget) {
      const elapsed = now - detailSpinStartTime;
      const progress = getProgress(elapsed, detailSpinTarget);
      currentStart = detailStartAngleForCurrentSpin + (detailSpinTarget.finalTarget - detailStartAngleForCurrentSpin) * progress;
    }

    detailRotationVal = normalizeAngle(currentStart);
    detailRotation = currentStart;
    detailStartAngleForCurrentSpin = currentStart;
    detailSpinTarget = generatePhysicsSpinTarget(
      currentStart,
      getTapSpinSpeed(wasSpinning, "Medium"),
      "Medium",
    );

    detailSpinStartTime = now;
    detailSpinning = true;
    detailResult = calculateResultFromAngle(normalizeAngle(currentStart), options);

    if (detailAnimationFrame !== null) {
      cancelAnimationFrame(detailAnimationFrame);
    }

    const tick = (time: number) => {
      const elapsed = time - detailSpinStartTime;
      const progress = getProgress(elapsed, detailSpinTarget);
      const currentRotation = detailStartAngleForCurrentSpin + (detailSpinTarget.finalTarget - detailStartAngleForCurrentSpin) * progress;
      const currentAngle = normalizeAngle(currentRotation);

      detailRotationVal = currentAngle;
      detailRotation = currentRotation; 
      detailResult = calculateResultFromAngle(currentAngle, options);

      if (elapsed < detailSpinTarget.totalDurationMs) {
        detailAnimationFrame = requestAnimationFrame(tick);
        return;
      }

      const finalAngle = normalizeAngle(detailSpinTarget.finalTarget);
      detailRotationVal = finalAngle;
      detailRotation = detailSpinTarget.finalTarget; 
      detailResult = calculateResultFromAngle(finalAngle, options);
      
      listResults[wheels[activeWheelIndex].id] = detailResult;
      listResults = { ...listResults };
      listTimestamps[wheels[activeWheelIndex].id] = Date.now();
      listTimestamps = { ...listTimestamps };
      listAngles[wheels[activeWheelIndex].id] = finalAngle;
      listAngles = { ...listAngles };
      
      detailSpinning = false;
      detailSpinTarget = null;
      detailAnimationFrame = null;
    };

    detailAnimationFrame = requestAnimationFrame(tick);
  }

  function spinFromInitialResult() {
    detailSpin();
  }

  onMount(() => {
    return () => {
      if (detailAnimationFrame) cancelAnimationFrame(detailAnimationFrame);
      Object.values(listAnimationFrames).forEach((frame) => cancelAnimationFrame(frame));
    };
  });
</script>

<div class="interactive-wheel-layout" style="
  --theme-page-bg: {currentTheme.pageBg};
  --theme-panel-bg: {currentTheme.panelBg};
  --theme-text: {currentTheme.textColor};
  --theme-border: {currentTheme.border};
  --theme-shadow: {currentTheme.boxShadow};
  --theme-btn-bg: {currentTheme.buttonBg};
  --theme-btn-text: {currentTheme.buttonText};
  --theme-wheel-hub-bg: {$activeTheme === 'dark' ? '#FFFFFF' : currentTheme.wheelCenterBg};
  --theme-wheel-hub-border: {$activeTheme === 'playful' ? '#1F2937' : $activeTheme === 'elegant' ? '#D8C7A7' : '#E5E7EB'};
  --theme-wheel-hub-icon: {currentTheme.wheelCenterIcon};
  --theme-badge-bg: {currentTheme.badgeBg};
  --theme-badge-text: {currentTheme.badgeText};
  --theme-tab-active-bg: {currentTheme.tabActiveBg};
  --theme-tab-active-text: {currentTheme.tabActiveText};
  --theme-tab-bg: {currentTheme.tabBg};
  --theme-tab-text: {currentTheme.tabText};
  --theme-list-item-bg: {currentTheme.listItemBg};
  --theme-list-item-border: {currentTheme.listItemBorder};
  --theme-fresh-result-bg: {currentTheme.freshResultBg};
  --theme-fresh-result-text: {currentTheme.freshResultText};
  --theme-fresh-result-border: {currentTheme.freshResultBorder};
">
  {#if currentScreen === "list"}
    <div class="glass-panel list-panel" data-theme={$activeTheme}>
      <div class="list-header">
        <h2>{copy?.myWheels ?? "My Wheels"}</h2>
      </div>
      <div class="wheel-list">
        {#each wheels as wheel, index}
          <div class="wheel-list-item" class:active-list-item={activeWheelIndex === index} role="button" tabindex="0" on:click={() => goToDetail(index)} on:keydown={(e) => e.key === 'Enter' && goToDetail(index)}>
            <div class="quick-spin-wrapper">
              <button 
                class="emoji-btn {quickSpinning[wheel.id] ? 'spinning' : ''}" 
                on:click={(e) => handleQuickSpin(index, e)}
                style={$activeTheme === 'playful' ? `transform: rotate(${listRotations[wheel.id] || 0}deg);` : ''}
                aria-label={quickSpinning[wheel.id] ? `${copy?.keepSpinning ?? "Keep spinning"} ${wheel.name}` : `${copy?.quickSpin ?? "Quick spin"} ${wheel.name}`}
              >
                <span class="emoji-text">{wheel.emoji}</span>
              </button>
            </div>
            
            <div class="item-content">
              <div class="item-title-row">
                <h3 class="item-title">{wheel.name}</h3>
                <span class="tone-mini">{wheel.toneEmoji} {wheel.toneLabel}</span>
              </div>
              {#if listResults[wheel.id]}
                <div class="item-result" class:fresh={Date.now() - (listTimestamps[wheel.id] || 0) < 60000} class:spinning-result={quickSpinning[wheel.id]}>
                  {listResults[wheel.id]}
                </div>
              {:else}
                <div class="item-prompt">{wheel.prompt}</div>
              {/if}
            </div>
            
            <div class="item-chevron">
              <ChevronRight size={20} color={currentTheme.textColor === '#FAFAFA' ? '#52525b' : '#c7c7cc'} />
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <div class="glass-panel detail-panel" data-theme={$activeTheme}>
      <div class="detail-header-row">
        <div class="header-action-left">
          <button class="back-btn" on:click={goHome} disabled={detailSpinning} aria-label={copy?.backToList ?? "Go back to list"}>
            <Home size={20} color={currentTheme.textColor} />
          </button>
        </div>
        
        <div class="tabs">
          {#each ['minimal', 'dark', 'playful'] as themeKey}
            <button
              class="tab-btn"
              class:active={$activeTheme === themeKey}
              aria-pressed={$activeTheme === themeKey}
              on:click={() => $activeTheme = themeKey}
              disabled={detailSpinning}
            >
              {copy?.themeLabels[themeKey as keyof DemoCopy["themeLabels"]] ?? themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
            </button>
          {/each}
        </div>
        
        <div class="header-action-right"></div>
      </div>

      <div class="wheel-identity">
        <div class="wheel-title-row">
          <span class="wheel-title-emoji">{activeWheel.emoji}</span>
          <h2>{activeWheel.name}</h2>
        </div>
        <div class="tone-chip">
          <span>{activeWheel.toneEmoji}</span>
          <strong>{activeWheel.toneLabel} {copy?.tone ?? "AI tone"}</strong>
        </div>
      </div>
      
      <div class="wheel-container">
        <svg
          class="main-svg"
          role="img"
          aria-label={`${activeWheel.name} decision wheel`}
          viewBox="0 0 440 440"
          style={`transform: rotate(${detailRotation}deg)`}
        >
          <defs>
            {#each sectors as sector}
              <clipPath id={sector.clipPathId}>
                <path d={sector.path} />
              </clipPath>
            {/each}
            {#each sectors as sector}
              {#each sector.textPaths as textPath}
                <path
                  d={textPath.path}
                  fill="none"
                  id={textPath.id}
                />
              {/each}
            {/each}
          </defs>

          <circle cx="220" cy="220" r="218" fill="rgba(0,0,0,0.03)" />
          
          {#each sectors as sector}
            <g>
              <path d={sector.path} fill={sector.option.backgroundColor} stroke="rgba(0,0,0,0.1)" stroke-width="1.5" style="transform: scale(0.995); transform-origin: 220px 220px;" />
              <g clip-path={`url(#${sector.clipPathId})`}>
                {#each sector.textPaths as textPath}
                  <text
                    fill={sector.option.textColor}
                    font-size={sector.fontSize}
                    font-weight="700"
                    text-anchor="middle"
                  >
                    <textPath
                      href={`#${textPath.id}`}
                      startOffset="50%"
                    >
                      {textPath.text}
                    </textPath>
                  </text>
                {/each}
              </g>
            </g>
          {/each}
        </svg>

        <button class="spin-btn" aria-label={detailSpinning ? copy?.keepSpinning ?? "Keep spinning" : copy?.spinWheel ?? "Spin wheel"} type="button" on:click={detailSpin}>
          <div class="inner-hub">
            <HandPointerIcon size={36} style="height:calc(50% + 1px);width:calc(50% + 1px)" />
          </div>
        </button>

        <div class="pin">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="var(--theme-btn-bg)" style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3))">
            <path d="M12 2L20 10C20 10 16 22 12 22C8 22 4 10 4 10L12 2Z" />
          </svg>
        </div>
      </div>

      <div class="wheel-footer">
        <button
          class="result-badge clickable"
          class:has-result={detailResult !== initialResult}
          class:pulsing={detailSpinning}
          type="button"
          aria-label={detailSpinning ? copy?.keepSpinning ?? "Keep spinning" : copy?.spinAgain ?? "Spin again"}
          on:click={spinFromInitialResult}
        >
          <span class="result-text">{detailResult}</span>
          <span class="sr-only" aria-live="polite" aria-atomic="true">
            {detailSpinning ? copy?.wheelSpinning ?? "Wheel spinning" : `${copy?.result ?? "Result"}: ${detailResult}`}
          </span>
        </button>
        <p class="wheel-prompt">
          <Sparkles size={14} color="var(--theme-wheel-hub-icon)" class="prompt-icon" /> {activeWheel.prompt}
        </p>
      </div>
    </div>
  {/if}
</div>

<style>
  .interactive-wheel-layout {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 0;
  }

  .glass-panel {
    background: var(--theme-panel-bg);
    border: var(--theme-border);
    border-radius: 24px;
    padding: clamp(0.85rem, 2vw, 1.25rem);
    box-shadow: var(--theme-shadow);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.85rem;
    max-width: 100%;
    width: min(100%, 34rem);
    min-height: 40rem;
    box-sizing: border-box;
    overflow: hidden;
    transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  }

  .list-panel {
    justify-content: flex-start;
    gap: 0.85rem;
  }

  .detail-panel {
    justify-content: flex-start;
    gap: 0.75rem;
  }

  /* List Screen */
  .list-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  
  .list-header h2 {
    font-size: 1.35rem;
    font-weight: 800;
    margin: 0;
    color: var(--theme-text);
    letter-spacing: -0.02em;
    transition: color 0.2s ease;
  }

  .wheel-list {
    display: flex;
    flex-direction: column;
    gap: 1.15rem;
    width: 100%;
  }

  .wheel-list-item {
    display: flex;
    align-items: center;
    background: var(--theme-list-item-bg);
    border-radius: 16px;
    padding: 0.65rem 0.8rem;
    border: 1px solid var(--theme-list-item-border);
    width: 100%;
    text-align: left;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s ease;
    box-sizing: border-box;
  }

  .wheel-list-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.06);
    background: rgba(0,0,0,0.02);
  }

  .wheel-list-item.active-list-item {
    border-color: var(--theme-btn-bg);
  }

  .list-panel[data-theme="playful"] .wheel-list-item {
    border-width: 3px;
    box-shadow: 3px 3px 0 #111111;
  }

  .list-panel[data-theme="dark"] .wheel-list-item:hover {
    background: #202025;
  }

  .list-panel[data-theme="elegant"] .wheel-list-item {
    box-shadow: 0 8px 20px rgba(0,0,0,0.03);
  }
  
  .wheel-list-item:active {
    transform: translateY(0);
  }

  .quick-spin-wrapper {
    margin-right: 0.65rem;
  }

  .emoji-btn {
    width: 3.2rem;
    height: 3.2rem;
    border-radius: 50%;
    background: var(--theme-page-bg);
    border: 1.5px solid var(--theme-list-item-border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
  }
  
  .list-panel[data-theme="playful"] .emoji-btn {
    border-radius: 12px;
    border: 3px solid #111111;
    box-shadow: 0 4px 0 #111111;
  }

  .list-panel[data-theme="playful"] .emoji-btn.spinning {
    background: var(--theme-fresh-result-bg);
    border-color: var(--theme-btn-bg);
  }

  .list-panel[data-theme="dark"] .emoji-btn {
    border-radius: 16px;
  }

  .list-panel[data-theme="elegant"] .emoji-btn {
    border-radius: 12px;
  }

  .emoji-text {
    font-size: 1.7rem;
  }

  .item-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
  }

  .item-title-row {
    align-items: center;
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.2rem;
    min-width: 0;
  }

  .item-title {
    flex: 1;
    font-size: 0.98rem;
    font-weight: 700;
    margin: 0;
    color: var(--theme-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tone-mini {
    background: var(--theme-badge-bg);
    border-radius: 999px;
    color: var(--theme-badge-text);
    flex-shrink: 0;
    font-size: 0.72rem;
    font-weight: 800;
    padding: 0.22rem 0.48rem;
  }
  
  .item-prompt {
    font-size: 0.9rem;
    color: var(--theme-text);
    opacity: 0.7;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-result {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--theme-fresh-result-text);
    background: var(--theme-fresh-result-bg);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    padding: 2px 8px;
    border-radius: 6px;
    align-self: flex-start;
    transition: background 0.2s ease, color 0.2s ease;
  }
  
  .item-result.fresh {
    background: var(--theme-btn-bg);
    color: var(--theme-btn-text);
  }

  .item-result.spinning-result {
    opacity: 0.72;
  }

  .item-chevron {
    padding-left: 8px;
  }

  /* Detail Screen */
  .detail-header-row {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .header-action-left, .header-action-right {
    width: 32px;
    display: flex;
    align-items: center;
  }

  .back-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    height: 44px;
    padding: 6px;
    width: 44px;
    border-radius: 50%;
    transition: background 0.2s;
  }

  .back-btn:hover {
    background: rgba(0,0,0,0.05);
  }
  
  .back-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .tabs {
    display: flex;
    flex: 1;
    background: var(--theme-tab-bg);
    padding: 0.35rem;
    border-radius: 100px;
  }

  .wheel-identity {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    text-align: center;
    width: 100%;
  }

  .wheel-title-row {
    align-items: center;
    display: flex;
    justify-content: center;
    gap: 0.45rem;
    min-width: 0;
    width: 100%;
  }

  .wheel-title-emoji {
    font-size: 1.45rem;
    line-height: 1;
  }

  .wheel-title-row h2 {
    color: var(--theme-text);
    font-size: clamp(1.25rem, 3vw, 1.65rem);
    letter-spacing: 0;
    line-height: 1.05;
    overflow-wrap: anywhere;
  }

  .tone-chip {
    align-items: center;
    background: var(--theme-badge-bg);
    border-radius: 999px;
    color: var(--theme-badge-text);
    display: flex;
    gap: 0.5rem;
    max-width: 100%;
    padding: 0.42rem 0.8rem;
  }

  .tone-chip strong {
    font-size: 1rem;
    white-space: nowrap;
  }

  .tab-btn {
    flex: 1;
    background: transparent;
    color: var(--theme-tab-text);
    border: none;
    font-size: 0.85rem;
    font-weight: 700;
    padding: 0.45rem 0.2rem;
    border-radius: 100px;
    cursor: pointer;
    text-align: center;
    white-space: nowrap;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .tab-btn:hover {
    opacity: 0.8;
  }

  .tab-btn.active {
    background: var(--theme-tab-active-bg);
    color: var(--theme-tab-active-text);
  }
  
  .tab-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .back-btn:focus-visible,
  .tab-btn:focus-visible,
  .spin-btn:focus-visible,
  .result-badge:focus-visible,
  .emoji-btn:focus-visible,
  .wheel-list-item:focus-visible {
    outline: 3px solid var(--theme-btn-bg);
    outline-offset: 3px;
  }

  .wheel-container {
    position: relative;
    width: 100%;
    max-width: min(24rem, 100%);
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
    width: clamp(60px, calc(26% + 16px), 88px);
    height: clamp(60px, calc(26% + 16px), 88px);
    border-radius: 50%;
    background: transparent;
    border: none;
    box-sizing: border-box;
    padding: 8px;
    cursor: pointer;
    z-index: 10;
    transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .spin-btn:not(:disabled):hover {
    transform: scale(1.05);
  }

  .spin-btn:not(:disabled):active {
    transform: scale(0.95);
  }

  .spin-btn:disabled {
    cursor: default;
  }

  .inner-hub {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: var(--theme-wheel-hub-bg);
    border: 1px solid var(--theme-wheel-hub-border);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 3.84px rgba(0,0,0,0.25);
    transition: background 0.2s ease;
  }

  .pin {
    position: absolute;
    top: -10px;
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
    gap: 0.45rem;
    text-align: center;
    width: 100%;
  }

  .result-badge {
    background: var(--theme-badge-bg);
    border: var(--theme-border);
    padding: 0.55rem 0.9rem;
    border-radius: 12px;
    min-height: 2.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s ease;
    width: 100%;
    box-sizing: border-box;
    cursor: default;
    font: inherit;
  }

  .result-badge.clickable {
    cursor: pointer;
  }

  .result-badge.clickable:hover {
    filter: brightness(1.03);
  }

  .result-badge:disabled {
    opacity: 1;
  }

  .result-badge.pulsing {
    animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    filter: brightness(1.1);
  }

  .result-badge.has-result {
    background: var(--theme-fresh-result-bg);
    border-color: var(--theme-fresh-result-border);
  }

  .result-badge.has-result .result-text {
    color: var(--theme-fresh-result-text);
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.03); }
  }

  .result-text {
    font-size: 1.02rem;
    font-weight: 800;
    color: var(--theme-badge-text);
    margin: 0;
    line-height: 1.2;
    transition: color 0.2s ease;
  }
  
  .wheel-prompt {
    font-size: 0.86rem;
    color: var(--theme-text);
    margin: 0;
    max-width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    line-height: 1.5;
    font-weight: 500;
    opacity: 0.8;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: 640px) {
    .glass-panel {
      gap: 0.8rem;
      padding: 1rem;
      width: 100%;
      border-radius: 20px;
      min-height: 40rem;
    }

    .tabs {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      width: auto;
    }

    .tab-btn {
      font-size: 0.82rem;
      min-width: 0;
      padding: 0.6rem 0.45rem;
    }

    :global(html[lang="ru"]) .tab-btn {
      font-size: 0.72rem;
      padding-inline: 0.1rem;
    }

    .wheel-container {
      max-width: min(100%, 20rem);
    }

    .tone-chip {
      border-radius: 999px;
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

  @media (prefers-reduced-motion: reduce) {
    .glass-panel,
    .tab-btn,
    .wheel-list-item,
    .result-text {
      transition: none;
    }

    .result-badge.pulsing {
      animation: none;
    }
  }
</style>
