<script lang="ts">
  import { onMount } from "svelte";
  import { calculateResultFromAngle, generatePhysicsSpinTarget } from "../../lib/spinLogic";
  import type { SpinOption } from "../../lib/spinLogic";
  import { calculateLineRadii, createArcPath, fitTextIntoArcPath } from "../../lib/textPathFitting";
  import "./AiWheelDemo.css";

  const wheels = [
    {
      name: "Dinner",
      prompt: "AI cleaned this from vague takeout ideas into balanced, spin-ready choices.",
      options: [
        { label: "Soup dumplings mission", weight: 1 },
        { label: "Comfort pasta night", weight: 1 },
        { label: "Street tacos and a walk", weight: 1 },
        { label: "Stay in and upgrade ramen", weight: 1 },
        { label: "Cafe stop plus dessert", weight: 1 },
        { label: "Grocery picnic run", weight: 1 },
      ],
    },
    {
      name: "Focus",
      prompt: "Weighted options make the wheel useful without making every outcome equally likely.",
      options: [
        { label: "25-minute deep work sprint", weight: 2 },
        { label: "Reply to the avoided message", weight: 1 },
        { label: "Delete one fake priority", weight: 1 },
        { label: "Five-minute ugly draft", weight: 2 },
        { label: "Plan tomorrow to buy peace", weight: 1 },
      ],
    },
    {
      name: "Group",
      prompt: "Spin together when the group chat has too many opinions and no decision.",
      options: [
        { label: "Coffee crawl", weight: 1 },
        { label: "Pretty walk and dessert", weight: 1 },
        { label: "Local event gamble", weight: 1 },
        { label: "Tiny side quest", weight: 1 },
        { label: "Stay in cozy, but do it right", weight: 1 },
      ],
    },
  ];

  const colors = ["#FF6B4A", "#F7C948", "#6EE7B7", "#72D7FF", "#9B7CFF", "#FFF4DD"];
  const textColors = ["#fff", "#151824", "#151824", "#151824", "#fff", "#151824"];
  const WHEEL_CENTER = 220;
  const WHEEL_STROKE_WIDTH = 3;
  const WHEEL_RADIUS = WHEEL_CENTER - WHEEL_STROKE_WIDTH / 2 - 2;

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

  // Reactivity
  $: options = wheels[activeWheelIndex].options.map((option, index) => ({
    text: option.label,
    label: option.label,
    weight: option.weight,
    backgroundColor: colors[index % colors.length],
    textColor: textColors[index % textColors.length],
  }));

  $: sectors = (() => {
    const totalWeight = options.reduce((sum, option) => sum + (option.weight || 1), 0);
    let startAngle = 0;
    return options.map((option, sectorIndex) => {
      const sectorAngle = ((option.weight || 1) / totalWeight) * 360;
      const endAngle = startAngle + sectorAngle;
      const textFit = fitTextIntoArcPath(option.text, sectorAngle, WHEEL_RADIUS * 0.25, WHEEL_RADIUS * 0.85, 440);
      const textInnerLimit = WHEEL_RADIUS * 0.25 + (WHEEL_RADIUS * 0.85 - WHEEL_RADIUS * 0.25) * 0.15;
      const textOuterLimit = WHEEL_RADIUS * 0.85;
      const lineRadii = calculateLineRadii(textFit.lines, textInnerLimit, textOuterLimit, textFit.fontSize);
      const sector = {
        clipPathId: `web-sector-clip-${activeWheelIndex}-${sectorIndex}`,
        option,
        path: describeSector(WHEEL_CENTER, WHEEL_RADIUS, startAngle, endAngle),
        dividerEnd: polarToCartesian(WHEEL_CENTER, WHEEL_RADIUS, startAngle),
        startAngle,
        endAngle,
        textFit,
        lineRadii,
      };
      startAngle = endAngle;
      return sector;
    });
  })();

  function selectWheel(index: number) {
    if (spinning) return;
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

    // "if i press middle again while already spinning, it go on spinning instead of do nothing"
    if (spinning && spinTarget) {
      // Calculate current value based on existing spin
      const elapsed = now - spinStartTime;
      const progress = getProgress(elapsed, spinTarget);
      currentStart = startAngleForCurrentSpin + (spinTarget.finalTarget - startAngleForCurrentSpin) * progress;
    }

    startAngleForCurrentSpin = currentStart;
    spinTarget = generatePhysicsSpinTarget(currentStart, "Medium", "Medium");
    
    // Add multiple spins dynamically for more dramatic effect.
    if (spinning) {
       spinTarget.finalTarget += 360 * 3; 
       spinTarget.totalDurationMs += 1000;
       spinTarget.physicsDurationMs += 1000;
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
      rotation = currentRotation; // use currentRotation for visual so it doesn't snap back
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

<div class="ai-wheel-demo">
  <div class="wheel-tabs" role="tablist" aria-label="AI wheel examples">
    {#each wheels as wheel, index}
      <button
        aria-selected={activeWheelIndex === index}
        class:active={activeWheelIndex === index}
        disabled={spinning}
        on:click={() => selectWheel(index)}
        role="tab"
        type="button"
      >
        {wheel.name}
      </button>
    {/each}
  </div>

  <div class="wheel-area">
    <svg
      aria-label="{wheels[activeWheelIndex].name} wheel"
      class="wheel-svg"
      role="img"
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
              d={createArcPath(220, 220, lineRadius, sector.startAngle + 1.25 - 90, sector.endAngle - 1.25 - 90)}
              fill="none"
              id={`textpath-${activeWheelIndex}-${sectorIndex}-${lineIndex}`}
            />
          {/each}
        {/each}
      </defs>

      {#each sectors as sector, sectorIndex}
        <g>
          <path d={sector.path} fill={sector.option.backgroundColor} />
          <line
            stroke="#151824"
            stroke-linecap="round"
            stroke-width={WHEEL_STROKE_WIDTH}
            x1="220"
            y1="220"
            x2={sector.dividerEnd.x}
            y2={sector.dividerEnd.y}
          />
          <g clip-path={`url(#${sector.clipPathId})`}>
            {#each sector.textFit.lines as line, lineIndex}
              <text
                fill={sector.option.textColor}
                font-size={sector.textFit.fontSize}
                font-weight="800"
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
      <circle cx="220" cy="220" r={WHEEL_RADIUS} fill="none" stroke="#151824" stroke-width={WHEEL_STROKE_WIDTH} />
    </svg>
    <button
      aria-label={spinning ? "Wheel is spinning" : "Spin wheel"}
      class="wheel-center-button"
      on:click={spin}
      type="button"
    >
      <svg aria-hidden="true" viewBox="0 0 120 120">
        <path
          d="M24 70 L48 34 L68 58 L94 24"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="14"
        />
        <circle cx="24" cy="70" r="8" fill="#FF6B4A" />
        <circle cx="48" cy="34" r="8" fill="#6EE7B7" />
        <circle cx="68" cy="58" r="8" fill="#72D7FF" />
        <circle cx="94" cy="24" r="8" fill="#F7C948" />
      </svg>
    </button>
  </div>

  <div class="wheel-panel">
    <p>{wheels[activeWheelIndex].prompt}</p>
    <strong aria-live="polite">{result}</strong>
    <button class="spin-command" on:click={spin} type="button">
      {spinning ? "Spinning..." : "Spin"}
    </button>
  </div>
</div>
