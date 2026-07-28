<script lang="ts">
  import { onMount } from "svelte";
  import { calculateResultFromAngle, generatePhysicsSpinTarget, getTapSpinSpeed } from "../../lib/spinLogic";
  import { layoutWheelSectors } from "../../lib/textPathFitting";
  import HandPointerIcon from "./HandPointerIcon.svelte";

  // ── Types ────────────────────────────────────────────────────────────
  type Opt = { label: string; weight: number };
  type Child = { name: string; emoji: string; options: Opt[] };
  type Payload = {
    viewerToken?: string;
    likeCount?: number; viewCount?: number; spinCount?: number;
    share: {
      slug: string; url: string; appUrl: string;
      primaryAiGenerationId: string | null;
      wheel: {
        wheelType: "s" | "m"; name: string; emoji: string;
        tone: string | null; aiGenerated: boolean; optionCount: number;
        options: Opt[]; children: Child[];
        presentation: { version: 1; angle: number | null; resultLabel: string | null; shareMode: "wheel" | "result" };
      };
    };
  };
  type ReportReason =
    | "sexual_content"
    | "hate_harassment"
    | "violence_danger"
    | "self_harm"
    | "illegal_regulated"
    | "spam_scam"
    | "privacy_personal_info"
    | "intellectual_property"
    | "other";
  type ReportStatus = "idle" | "submitting" | "success" | "error";

  const reportReasons: { value: ReportReason; label: string }[] = [
    { value: "sexual_content", label: "Sexual content" },
    { value: "hate_harassment", label: "Hate or harassment" },
    { value: "violence_danger", label: "Violence or dangerous content" },
    { value: "self_harm", label: "Self-harm" },
    { value: "illegal_regulated", label: "Illegal or regulated activity" },
    { value: "spam_scam", label: "Spam or scam" },
    { value: "privacy_personal_info", label: "Privacy or personal information" },
    { value: "intellectual_property", label: "Intellectual property" },
    { value: "other", label: "Something else" },
  ];

  // ── Themes — identical tokens to WebDemoApp ──────────────────────────
  const themes = {
    minimal: {
      label: "Minimal",
      palette: ["#C7D2FE","#FED7AA","#BBF7D0","#FBCFE8","#BAE6FD","#FDE68A","#DDD6FE","#D9F99D"],
      textColors: ["#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000"],
      panelBg: "#FFFFFF", textColor: "#111827",
      buttonBg: "#111827", buttonText: "#FFFFFF",
      wheelCenterBg: "#FFFFFF", wheelCenterIcon: "#111111",
      border: "1px solid #E5E7EB", boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
      badgeBg: "#F3F4F6", badgeText: "#111827",
      tabActiveBg: "#111827", tabActiveText: "#FFFFFF",
      tabBg: "#F3F4F6", tabText: "#6B7280",
      freshResultBg: "#E0E7FF", freshResultText: "#3730A3", freshResultBorder: "#A5B4FC",
      hubBorderColor: "#E5E7EB",
    },
    dark: {
      label: "Dark",
      palette: ["#FF4D6D","#00D4FF","#FF9F1C","#A855F7","#2EE86F","#FF2BD6","#F9F871","#4D7CFE"],
      textColors: ["#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000"],
      panelBg: "#111317", textColor: "#FAFAFA",
      buttonBg: "#39FF14", buttonText: "#000000",
      wheelCenterBg: "#FFFFFF", wheelCenterIcon: "#111111",
      border: "1px solid #2C2E36", boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
      badgeBg: "rgba(57,255,20,0.1)", badgeText: "#39FF14",
      tabActiveBg: "#FAFAFA", tabActiveText: "#111317",
      tabBg: "rgba(255,255,255,0.1)", tabText: "rgba(255,255,255,0.5)",
      freshResultBg: "rgba(57,255,20,0.16)", freshResultText: "#B7FF8A", freshResultBorder: "rgba(57,255,20,0.46)",
      hubBorderColor: "#E5E7EB",
    },
    playful: {
      label: "Playful",
      palette: ["#FF6B6B","#06D6A0","#FFD166","#4D96FF","#FF8FAB","#2EC4B6","#FF9F1C","#A855F7"],
      textColors: ["#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000"],
      panelBg: "#FFFFFF", textColor: "#111827",
      buttonBg: "#FF5A36", buttonText: "#FFFFFF",
      wheelCenterBg: "#FFFFFF", wheelCenterIcon: "#111111",
      border: "2px solid #1F2937", boxShadow: "8px 8px 0px rgba(31,41,55,1)",
      badgeBg: "#FFE082", badgeText: "#111111",
      tabActiveBg: "#111111", tabActiveText: "#FFFFFF",
      tabBg: "rgba(17,17,17,0.1)", tabText: "rgba(17,17,17,0.6)",
      freshResultBg: "#FFE4DE", freshResultText: "#9A3412", freshResultBorder: "#FDB5A7",
      hubBorderColor: "#1F2937",
    },
  } as const;
  type ThemeKey = keyof typeof themes;
  const themeKeys: ThemeKey[] = ["minimal", "dark", "playful"];

  // ── Tone metadata (mirrors mobile aiToneModes.ts) ───────────────────
  const TONE_META: Record<string, { emoji: string; color: string }> = {
    serious:       { emoji: "🧐", color: "#6B7280" },
    friendly:      { emoji: "😊", color: "#10B981" },
    funny:         { emoji: "😂", color: "#F59E0B" },
    inspirational: { emoji: "💫", color: "#F43F5E" },
    unhinged:      { emoji: "🤪", color: "#EF4444" },
    sarcastic:     { emoji: "🙃", color: "#FBBF24" },
  };

  function toneMeta(tone: string | null) {
    if (!tone) return null;
    return TONE_META[tone.toLowerCase()] ?? { emoji: "✦", color: "#6B7280" };
  }

  function toneLabel(tone: string) {
    return tone.charAt(0).toUpperCase() + tone.slice(1) + " Tone";
  }

  function getApiBase(): string {
    const configured = (window as Window & { __WHEELORA_API_BASE__?: unknown })
      .__WHEELORA_API_BASE__;
    if (typeof configured === "string" && configured.trim()) {
      try {
        const url = new URL(configured, window.location.origin);
        if (
          url.origin === window.location.origin &&
          !url.search &&
          !url.hash
        ) {
          return url.pathname.replace(/\/+$/, "") || "/api";
        }
      } catch {
        // Fall through to the same-origin proxy.
      }
    }
    return "/api";
  }

  function isRecord(value: unknown): value is Record<string, unknown> {
    return !!value && typeof value === "object" && !Array.isArray(value);
  }

  function isOption(value: unknown): value is Opt {
    if (!isRecord(value)) return false;
    return (
      typeof value.label === "string" &&
      value.label.trim().length > 0 &&
      typeof value.weight === "number" &&
      Number.isFinite(value.weight) &&
      value.weight > 0
    );
  }

  function isPayload(value: unknown): value is Payload {
    if (!isRecord(value) || !isRecord(value.share) || !isRecord(value.share.wheel)) {
      return false;
    }
    const share = value.share;
    const wheel = share.wheel;
    const presentation = wheel.presentation;
    const validOptionalCount = (count: unknown) =>
      count === undefined ||
      (typeof count === "number" && Number.isFinite(count) && count >= 0);
    if (
      (value.viewerToken !== undefined &&
        typeof value.viewerToken !== "string") ||
      !validOptionalCount(value.likeCount) ||
      !validOptionalCount(value.viewCount) ||
      !validOptionalCount(value.spinCount) ||
      typeof share.slug !== "string" ||
      !share.slug ||
      typeof share.url !== "string" ||
      typeof share.appUrl !== "string" ||
      (share.primaryAiGenerationId !== null &&
        typeof share.primaryAiGenerationId !== "string") ||
      typeof wheel.name !== "string" ||
      typeof wheel.emoji !== "string" ||
      (wheel.tone !== null && typeof wheel.tone !== "string") ||
      typeof wheel.aiGenerated !== "boolean" ||
      (wheel.wheelType !== "s" && wheel.wheelType !== "m") ||
      !isRecord(presentation) ||
      presentation.version !== 1 ||
      (presentation.angle !== null &&
        (typeof presentation.angle !== "number" ||
          !Number.isFinite(presentation.angle))) ||
      (presentation.resultLabel !== null &&
        typeof presentation.resultLabel !== "string") ||
      (presentation.shareMode !== "wheel" &&
        presentation.shareMode !== "result")
    ) {
      return false;
    }

    if (wheel.wheelType === "s") {
      return Array.isArray(wheel.options) && wheel.options.length > 0 &&
        wheel.options.every(isOption);
    }

    return (
      Array.isArray(wheel.children) &&
      wheel.children.length > 0 &&
      wheel.children.every((child) =>
        isRecord(child) &&
        typeof child.name === "string" &&
        typeof child.emoji === "string" &&
        Array.isArray(child.options) &&
        child.options.length > 0 &&
        child.options.every(isOption)
      )
    );
  }

  function getViewerSessionId() {
    if (viewerSessionId) return viewerSessionId;
    const storageKey = "wheelora:share-viewer-session";
    let value = "";
    try {
      value = sessionStorage.getItem(storageKey) || "";
      if (!value) {
        value = (crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`)
          .replace(/[^A-Za-z0-9:_-]/g, "");
        sessionStorage.setItem(storageKey, value);
      }
    } catch {
      value = `${Date.now()}-${Math.random().toString(36).slice(2)}`.replace(/[^A-Za-z0-9:_-]/g, "");
    }
    viewerSessionId = value;
    return value;
  }

  function createSpinEventKey(kind: "single" | "multi" | "child", childIndex?: number) {
    const sessionId = getViewerSessionId();
    const actionId = (crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`)
      .replace(/[^A-Za-z0-9:_-]/g, "");
    const childPart = typeof childIndex === "number" ? `:${childIndex}` : "";
    return `spin:${slug}:${sessionId}:${kind}${childPart}:${actionId}`;
  }

  function postEngagement(kind: "view" | "spin", eventKey: string) {
    if (!slug || !viewerToken) return;
    fetch(`${getApiBase()}/v1/public/spin-wheel/shares/${slug}/${kind}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ viewerToken, eventKey }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Engagement request failed");
        return response.json();
      })
      .then((data) => {
        if (kind === "view" && typeof data.viewCount === "number") {
          viewCount = data.viewCount;
        }
        if (kind === "spin" && typeof data.spinCount === "number") {
          spinCount = data.spinCount;
        }
      })
      .catch(() => {});
  }

  let activeTheme: ThemeKey = "minimal";
  let payload: Payload | null = null;
  let slug = "";
  let loadState: "loading" | "ready" | "error" = "loading";

  // ── Single Wheel State ──
  let rotation = 0;
  let rotationVal = 0;
  let spinning = false;
  let animFrame: number | null = null;
  let spinTarget: ReturnType<typeof generatePhysicsSpinTarget> | null = null;
  let spinStartTime = 0;
  let startAngleForSpin = 0;
  let result = "Spin for a decision";

  // ── Multi Wheel State ──
  let mwRotations: number[] = [];
  let mwRotationVals: number[] = [];
  let mwSpinning: boolean[] = [];
  let mwResults: string[] = [];
  let mwSpinTargets: (ReturnType<typeof generatePhysicsSpinTarget> | null)[] = [];
  let mwStartAngles: number[] = [];
  let mwAnimFrames: (number | null)[] = [];
  let mwSpinStartTimes: number[] = [];
  let mwSectorsCache: any[][] = [];
  let isSpinningAll = false;

  // ── Engagement State ──
  let liked = false;
  let likeCount = 0;
  let viewCount = 0;
  let spinCount = 0;
  let viewerToken = "";
  let viewerSessionId = "";
  let pendingMultiSpinEventKey = "";
  let pendingMultiSpinRemaining = 0;
  let likePending = false;

  // ── Report State ──
  let reportDialog: HTMLDialogElement;
  let reportReason: ReportReason = "spam_scam";
  let reportDetails = "";
  let reportStatus: ReportStatus = "idle";
  let reportError = "";
  let reported = false;

  $: theme = themes[activeTheme];

  function normalizeAngle(a: number) { const n = a % 360; return n < 0 ? n + 360 : n; }

  function getProgress(elapsed: number, t: ReturnType<typeof generatePhysicsSpinTarget>) {
    if (t.offsetDurationMs > 0 && elapsed <= t.offsetDurationMs)
      return t.offsetRatio * (elapsed / t.offsetDurationMs);
    const pe = Math.max(0, elapsed - t.offsetDurationMs);
    const pp = Math.min(pe / t.physicsDurationMs, 1);
    return t.offsetRatio + (1 - t.offsetRatio) * t.physicsEasing(pp);
  }

  function shouldReduceMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // Single Wheel Segments
  $: singleOptions = payload?.share.wheel.wheelType === "s"
    ? payload.share.wheel.options.map((o, i) => ({
        text: o.label, label: o.label, weight: o.weight,
        backgroundColor: theme.palette[i % theme.palette.length],
        textColor: theme.textColors[i % theme.textColors.length],
      }))
    : [];

  $: sectors = layoutWheelSectors(singleOptions, `sw-${activeTheme}`);

  // Multi Wheel Setup & Segments
  $: {
    if (payload?.share.wheel.wheelType === "m") {
      const children = payload.share.wheel.children;
      mwSectorsCache = children.map((child, ci) => {
        const options = child.options.map((option, optionIndex) => ({
          ...option,
          text: option.label,
          backgroundColor: theme.palette[optionIndex % theme.palette.length],
          textColor: theme.textColors[optionIndex % theme.textColors.length],
        }));
        return layoutWheelSectors(options, `sw-m-${activeTheme}-${ci}`);
      });
      
      if (mwRotations.length === 0) {
        mwRotations = children.map(() => 0);
        mwRotationVals = children.map(() => 0);
        mwSpinning = children.map(() => false);
        mwResults = children.map(() => "");
        mwSpinTargets = children.map(() => null);
        mwStartAngles = children.map(() => 0);
        mwAnimFrames = children.map(() => null);
        mwSpinStartTimes = children.map(() => 0);
      }
    }
  }

  // ── Single Wheel Spin Logic ──
  function spin() {
    if (!singleOptions.length) return;
    const now = performance.now();
    const wasSpinning = spinning && spinTarget !== null;
    let cur = rotationVal;
    if (wasSpinning && spinTarget) {
      const elapsed = now - spinStartTime;
      const progress = getProgress(elapsed, spinTarget);
      cur = startAngleForSpin + (spinTarget.finalTarget - startAngleForSpin) * progress;
    }
    rotationVal = normalizeAngle(cur);
    rotation = cur;
    startAngleForSpin = cur;
    spinTarget = generatePhysicsSpinTarget(
      cur,
      getTapSpinSpeed(wasSpinning, "Medium"),
      "Medium",
    );
    spinStartTime = now;
    spinning = true;
    result = calculateResultFromAngle(normalizeAngle(cur), singleOptions);
    if (animFrame !== null) cancelAnimationFrame(animFrame);

    if (shouldReduceMotion()) {
      const finalAngle = normalizeAngle(spinTarget.finalTarget);
      rotationVal = finalAngle;
      rotation = spinTarget.finalTarget;
      result = calculateResultFromAngle(finalAngle, singleOptions);
      spinning = false;
      spinTarget = null;
      animFrame = null;
      postEngagement("spin", createSpinEventKey("single"));
      return;
    }

    const tick = (time: number) => {
      if (!spinTarget) return;
      const e = time - spinStartTime;
      const p = getProgress(e, spinTarget);
      const cur2 = startAngleForSpin + (spinTarget.finalTarget - startAngleForSpin) * p;
      const a = normalizeAngle(cur2);
      rotationVal = a; rotation = cur2;
      result = calculateResultFromAngle(a, singleOptions);
      if (e < spinTarget.totalDurationMs) { animFrame = requestAnimationFrame(tick); return; }
      const fa = normalizeAngle(spinTarget.finalTarget);
      rotationVal = fa; rotation = spinTarget.finalTarget;
      result = calculateResultFromAngle(fa, singleOptions);
      spinning = false; spinTarget = null; animFrame = null;
      
      postEngagement("spin", createSpinEventKey("single"));
    };
    animFrame = requestAnimationFrame(tick);
  }

  // ── Multi Wheel Spin Logic ──
  function checkSpinningAll() {
    if (mwSpinning.every(s => !s)) isSpinningAll = false;
  }

  function spinChild(ci: number) {
    if (!payload) return;
    const childOpts = payload.share.wheel.children[ci].options;
    const now = performance.now();
    const wasSpinning = mwSpinning[ci] && mwSpinTargets[ci] !== null;
    let cur = mwRotationVals[ci];
    
    if (wasSpinning && mwSpinTargets[ci]) {
      const e = now - mwSpinStartTimes[ci];
      const p = getProgress(e, mwSpinTargets[ci]!);
      cur = mwStartAngles[ci] + (mwSpinTargets[ci]!.finalTarget - mwStartAngles[ci]) * p;
    }
    
    mwRotationVals[ci] = normalizeAngle(cur);
    mwRotations[ci] = cur;
    mwRotations = mwRotations;
    mwStartAngles[ci] = cur;
    const target = generatePhysicsSpinTarget(
      cur,
      getTapSpinSpeed(wasSpinning, "Medium"),
      "Medium",
    );
    
    mwSpinTargets[ci] = target;
    mwSpinStartTimes[ci] = now;
    mwSpinning[ci] = true;
    const initialResult = calculateResultFromAngle(normalizeAngle(cur), childOpts);
    if (mwResults[ci] !== initialResult) {
      mwResults[ci] = initialResult;
      mwResults = mwResults;
    }

    if (mwAnimFrames[ci] !== null) cancelAnimationFrame(mwAnimFrames[ci]!);

    if (shouldReduceMotion()) {
      const finalAngle = normalizeAngle(target.finalTarget);
      mwRotationVals[ci] = finalAngle;
      mwRotations[ci] = target.finalTarget;
      mwResults[ci] = calculateResultFromAngle(finalAngle, childOpts);
      mwSpinning[ci] = false;
      mwSpinTargets[ci] = null;
      mwAnimFrames[ci] = null;
      mwRotations = mwRotations;
      mwResults = mwResults;
      mwSpinning = mwSpinning;
      checkSpinningAll();

      if (pendingMultiSpinEventKey) {
        pendingMultiSpinRemaining = Math.max(0, pendingMultiSpinRemaining - 1);
        if (pendingMultiSpinRemaining === 0) {
          postEngagement("spin", pendingMultiSpinEventKey);
          pendingMultiSpinEventKey = "";
        }
      } else {
        postEngagement("spin", createSpinEventKey("child", ci));
      }
      return;
    }

    const tick = (time: number) => {
      const t = mwSpinTargets[ci];
      if (!t) return;
      const e = time - mwSpinStartTimes[ci];
      const p = getProgress(e, t);
      const cur2 = mwStartAngles[ci] + (t.finalTarget - mwStartAngles[ci]) * p;
      const a = normalizeAngle(cur2);
      mwRotationVals[ci] = a;
      mwRotations[ci] = cur2;
      const nextResult = calculateResultFromAngle(a, childOpts);
      const resultChanged = mwResults[ci] !== nextResult;
      if (resultChanged) mwResults[ci] = nextResult;
      
      // trigger reactivity
      mwRotations = mwRotations;
      if (resultChanged) mwResults = mwResults;
      
      if (e < t.totalDurationMs) {
        mwAnimFrames[ci] = requestAnimationFrame(tick);
        return;
      }
      
      const fa = normalizeAngle(t.finalTarget);
      mwRotationVals[ci] = fa;
      mwRotations[ci] = t.finalTarget;
      const finalResult = calculateResultFromAngle(fa, childOpts);
      const finalResultChanged = mwResults[ci] !== finalResult;
      if (finalResultChanged) mwResults[ci] = finalResult;
      mwSpinning[ci] = false;
      mwSpinTargets[ci] = null;
      mwAnimFrames[ci] = null;
      
      mwRotations = mwRotations;
      if (finalResultChanged) mwResults = mwResults;
      mwSpinning = mwSpinning;
      
      checkSpinningAll();
      
      if (pendingMultiSpinEventKey) {
        pendingMultiSpinRemaining = Math.max(0, pendingMultiSpinRemaining - 1);
        if (pendingMultiSpinRemaining === 0) {
          postEngagement("spin", pendingMultiSpinEventKey);
          pendingMultiSpinEventKey = "";
        }
      } else {
        postEngagement("spin", createSpinEventKey("child", ci));
      }
    };
    mwAnimFrames[ci] = requestAnimationFrame(tick);
  }

  function spinAll() {
    if (!payload) return;
    isSpinningAll = true;
    pendingMultiSpinEventKey = createSpinEventKey("multi");
    pendingMultiSpinRemaining = payload.share.wheel.children.length;
    payload.share.wheel.children.forEach((_, ci) => spinChild(ci));
  }

  // ── Engagement ──
  async function likeWheel() {
    if (liked || likePending || !slug || !viewerToken) return;

    likePending = true;
    liked = true;
    likeCount += 1;
    try {
      const response = await fetch(
        `${getApiBase()}/v1/public/spin-wheel/shares/${slug}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            viewerToken,
            liked: true,
            eventKey: `like:${slug}:${getViewerSessionId()}`,
          }),
        },
      );
      if (!response.ok) throw new Error("Like request failed");
      const data = await response.json();
      if (typeof data.likeCount === "number") likeCount = data.likeCount;
    } catch {
      liked = false;
      likeCount = Math.max(0, likeCount - 1);
    } finally {
      likePending = false;
    }
  }

  function openReportDialog() {
    reportReason = "spam_scam";
    reportDetails = "";
    reportStatus = "idle";
    reportError = "";
    reportDialog?.showModal();
  }

  function closeReportDialog() {
    if (reportStatus === "submitting") return;
    reportDialog?.close();
  }

  async function submitReport() {
    if (
      reportStatus === "submitting" ||
      reported ||
      !slug ||
      !viewerToken
    ) {
      return;
    }

    reportStatus = "submitting";
    reportError = "";
    try {
      const response = await fetch(
        `${getApiBase()}/v1/public/spin-wheel/shares/${slug}/report`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            viewerToken,
            reason: reportReason,
            ...(reportDetails.trim()
              ? { details: reportDetails.trim() }
              : {}),
            clientContext: {
              surface: "web_shared_wheel",
              pageUrl: window.location.href,
            },
          }),
        },
      );
      if (!response.ok) {
        let message =
          response.status === 429
            ? "Too many reports were submitted. Please try again in a few minutes."
            : "We could not submit your report. Please try again.";
        try {
          const data = await response.json();
          if (typeof data?.error === "string" && data.error.trim()) {
            message = data.error;
          }
        } catch {
          // Keep the human-readable fallback above.
        }
        throw new Error(message);
      }
      reported = true;
      reportStatus = "success";
    } catch (error) {
      reportError =
        error instanceof Error && error.message
          ? error.message
          : "We could not submit your report. Please try again.";
      reportStatus = "error";
    }
  }

  onMount(() => {
    const script = document.getElementById("shared-wheel-json");
    const raw = script?.textContent?.trim();
    try {
      if (!raw) throw new Error("Shared wheel data is missing");
      const parsed: unknown = JSON.parse(raw);
      if (!isPayload(parsed)) throw new Error("Shared wheel data is invalid");

      payload = parsed;
      slug = parsed.share.slug;
      viewerToken = parsed.viewerToken ?? "";
      likeCount = parsed.likeCount ?? 0;
      viewCount = parsed.viewCount ?? 0;
      spinCount = parsed.spinCount ?? 0;

      const pres = parsed.share.wheel.presentation;
      if (typeof pres.angle === "number") {
        rotation = normalizeAngle(pres.angle);
        rotationVal = rotation;
      }

      if (slug && viewerToken) {
        postEngagement("view", `view:${slug}:${getViewerSessionId()}`);
      }
      if (
        pres.resultLabel &&
        pres.shareMode === "result" &&
        parsed.share.wheel.wheelType === "s"
      ) {
        result = pres.resultLabel;
      }
      loadState = "ready";
    } catch {
      payload = null;
      loadState = "error";
    }
    
    return () => {
      if (animFrame !== null) cancelAnimationFrame(animFrame);
      mwAnimFrames.forEach(f => { if (f !== null) cancelAnimationFrame(f); });
    };
  });
</script>

{#if payload}
  {@const wheel = payload.share.wheel}
  {@const isAI = !!(wheel.aiGenerated || payload.share.primaryAiGenerationId)}
  <div class="sv-wrap" style="
    --panel-bg:{theme.panelBg};--panel-border:{theme.border};--panel-shadow:{theme.boxShadow};
    --text:{theme.textColor};--btn-bg:{theme.buttonBg};--btn-text:{theme.buttonText};
    --hub-bg:{theme.wheelCenterBg};--hub-icon:{theme.wheelCenterIcon};--hub-border:{theme.hubBorderColor};
    --badge-bg:{theme.badgeBg};--badge-text:{theme.badgeText};
    --tab-active-bg:{theme.tabActiveBg};--tab-active-text:{theme.tabActiveText};
    --tab-bg:{theme.tabBg};--tab-text:{theme.tabText};
    --fresh-bg:{theme.freshResultBg};--fresh-text:{theme.freshResultText};--fresh-border:{theme.freshResultBorder};
  ">
    <div class="glass-panel" data-theme={activeTheme}>

      <!-- Header row: tabs -->
      <div class="detail-header-row">
        <div class="tabs" role="group" aria-label="Wheel color theme">
          {#each themeKeys as key}
            <button class="tab-btn" class:active={activeTheme === key}
              type="button"
              disabled={spinning || isSpinningAll}
              aria-pressed={activeTheme === key}
              on:click={() => (activeTheme = key)}>
              {themes[key].label}
            </button>
          {/each}
        </div>
      </div>

      <!-- Wheel identity: title + AI badge + tone chip -->
      <div class="wheel-identity">
        <div class="wheel-title-row">
          <span class="wheel-title-emoji">{wheel.emoji}</span>
          <h1 class="wheel-name">{wheel.name}</h1>
          {#if isAI}<span class="ai-chip">✦ AI</span>{/if}
        </div>
        {#if wheel.tone}
          {@const tm = toneMeta(wheel.tone)}
          <div class="tone-chip" style="background: {tm ? tm.color + '22' : 'var(--badge-bg)'}; color: {tm ? tm.color : 'var(--badge-text)'}">
            {#if tm}<span class="tone-emoji">{tm.emoji}</span>{/if}
            <strong>{toneLabel(wheel.tone)}</strong>
          </div>
        {/if}
      </div>

      <!-- Content -->
      {#if wheel.wheelType === "s"}
        <!-- Single Wheel -->
        <div class="wheel-container">
          <svg class="main-svg" viewBox="0 0 440 440" style="transform: rotate({rotation}deg)">
            <defs>
              {#each sectors as sec}
                <clipPath id={sec.clipPathId}><path d={sec.path}/></clipPath>
              {/each}
              {#each sectors as sec}
                {#each sec.textPaths as textPath}
                  <path d={textPath.path} fill="none" id={textPath.id}/>
                {/each}
              {/each}
            </defs>
            <circle cx="220" cy="220" r="218" fill="rgba(0,0,0,0.03)"/>
            {#each sectors as sec}
              <g>
                <path d={sec.path} fill={sec.option.backgroundColor} stroke="rgba(0,0,0,0.1)" stroke-width="1.5" style="transform:scale(0.995);transform-origin:220px 220px;"/>
                <g clip-path="url(#{sec.clipPathId})">
                  {#each sec.textPaths as textPath}
                    <text fill={sec.option.textColor} font-size={sec.fontSize} font-weight="700" text-anchor="middle">
                      <textPath href={`#${textPath.id}`} startOffset="50%">{textPath.text}</textPath>
                    </text>
                  {/each}
                </g>
              </g>
            {/each}
          </svg>

          <button
            class="spin-btn"
            type="button"
            aria-label={spinning ? "Keep spinning" : "Spin the wheel"}
            aria-describedby="shared-wheel-result"
            on:click={spin}
          >
            <div class="inner-hub">
              <HandPointerIcon size={36} style="height:calc(50% + 1px);width:calc(50% + 1px)" />
            </div>
          </button>

          <div class="pin">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="var(--btn-bg)" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))">
              <path d="M12 2L20 10C20 10 16 22 12 22C8 22 4 10 4 10L12 2Z"/>
            </svg>
          </div>
        </div>

        <div class="wheel-footer">
          <button
            class="result-badge"
            class:pulsing={spinning}
            class:has-result={result !== "Spin for a decision"}
            type="button"
            id="shared-wheel-result"
            aria-label={spinning ? "Keep spinning" : "Spin again"}
            aria-live="polite"
            aria-atomic="true"
            aria-busy={spinning}
            on:click={spin}
          >
            <span class="result-text">{result}</span>
          </button>
        </div>

        <details class="option-details">
          <summary>View all {singleOptions.length} options</summary>
          <ol>
            {#each singleOptions as option}
              <li>{option.label}</li>
            {/each}
          </ol>
        </details>

      {:else}
        <!-- Multi-wheel -->
        <div class="multi-wrap">
          <button
            class="multi-spin-btn"
            class:pulsing={isSpinningAll}
            type="button"
            aria-label={isSpinningAll ? "Keep all wheels spinning" : "Spin all wheels"}
            aria-describedby="shared-multi-wheel-status"
            on:click={spinAll}
          >
            Spin All Wheels
          </button>
          <span id="shared-multi-wheel-status" class="sr-only" aria-live="polite">
            {isSpinningAll ? "All wheels are spinning" : "All wheels are ready"}
          </span>
          
          <div class="multi-grid">
            {#each wheel.children as child, ci}
              <article class="multi-card">
                <header class="multi-card-head">
                  <span class="mc-emoji">{child.emoji}</span>
                  <strong class="mc-name">{child.name}</strong>
                </header>

                <div class="mini-wheel-container">
                  <svg class="main-svg" viewBox="0 0 440 440" style="transform: rotate({mwRotations[ci]}deg)">
                    <defs>
                      {#each mwSectorsCache[ci] || [] as sec}
                        <clipPath id={sec.clipPathId}><path d={sec.path}/></clipPath>
                      {/each}
                      {#each mwSectorsCache[ci] || [] as sec}
                        {#each sec.textPaths as textPath}
                          <path d={textPath.path} fill="none" id={textPath.id}/>
                        {/each}
                      {/each}
                    </defs>
                    <circle cx="220" cy="220" r="218" fill="rgba(0,0,0,0.03)"/>
                    {#each mwSectorsCache[ci] || [] as sec}
                      <g>
                        <path d={sec.path} fill={sec.option.backgroundColor} stroke="rgba(0,0,0,0.1)" stroke-width="1.5" style="transform:scale(0.995);transform-origin:220px 220px;"/>
                        <g clip-path="url(#{sec.clipPathId})">
                          {#each sec.textPaths as textPath}
                            <text fill={sec.option.textColor} font-size={sec.fontSize} font-weight="700" text-anchor="middle">
                              <textPath href={`#${textPath.id}`} startOffset="50%">{textPath.text}</textPath>
                            </text>
                          {/each}
                        </g>
                      </g>
                    {/each}
                  </svg>

                  <button
                    class="spin-btn mini"
                    type="button"
                    disabled={isSpinningAll}
                    aria-label={mwSpinning[ci] ? `Keep spinning ${child.name}` : `Spin ${child.name}`}
                    aria-describedby={`shared-child-result-${ci}`}
                    on:click={() => spinChild(ci)}
                  >
                    <div class="inner-hub mini">
                      <HandPointerIcon size={36} style="height:calc(50% + 1px);width:calc(50% + 1px)" />
                    </div>
                  </button>

                  <div class="pin mini">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="var(--btn-bg)" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))">
                      <path d="M12 2L20 10C20 10 16 22 12 22C8 22 4 10 4 10L12 2Z"/>
                    </svg>
                  </div>
                </div>

                <div
                  class="multi-result"
                  class:pulsing={mwSpinning[ci]}
                  class:has-result={mwResults[ci] && mwResults[ci] !== "Ready to spin"}
                  id={`shared-child-result-${ci}`}
                  aria-live="polite"
                  aria-atomic="true"
                  aria-busy={mwSpinning[ci]}
                >
                  <span class="mr-text">{mwResults[ci] || "Ready to spin"}</span>
                </div>
              </article>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Engagement row -->
      <div class="engagement-row">
        <button
          class="like-btn"
          class:liked
          type="button"
          disabled={liked || likePending || !viewerToken}
          on:click={likeWheel}
          aria-label={liked ? "You liked this wheel" : "Like this wheel"}
          aria-pressed={liked}
        >
          <span class="like-icon">{liked ? "❤️" : "🤍"}</span>
          <span class="like-num">{likeCount}</span>
        </button>
        <div class="engagement-stat" aria-label="View count">{viewCount} views</div>
        <div class="engagement-stat" aria-label="Spin count">{spinCount} spins</div>
        <button
          class="report-btn"
          type="button"
          disabled={reported || !viewerToken}
          on:click={openReportDialog}
        >
          {reported ? "Reported" : "Report"}
        </button>
      </div>

    </div>

    <dialog
      class="report-dialog"
      bind:this={reportDialog}
      aria-labelledby="report-dialog-title"
      aria-describedby="report-dialog-description"
      on:cancel={(event) => {
        if (reportStatus === "submitting") event.preventDefault();
      }}
    >
      {#if reportStatus === "success"}
        <div class="report-dialog-content report-success" role="status">
          <span class="report-success-icon" aria-hidden="true">✓</span>
          <h2 id="report-dialog-title">Report received</h2>
          <p id="report-dialog-description">
            Thank you. The Wheelora team will review this shared wheel.
          </p>
          <button class="dialog-primary" type="button" on:click={closeReportDialog}>
            Done
          </button>
        </div>
      {:else}
        <form
          class="report-dialog-content"
          on:submit|preventDefault={submitReport}
        >
          <div>
            <span class="dialog-kicker">Help keep Wheelora safe</span>
            <h2 id="report-dialog-title">Report this wheel</h2>
            <p id="report-dialog-description">
              Choose the issue that best describes this shared content.
            </p>
          </div>

          <label>
            <span>Reason</span>
            <select bind:value={reportReason} disabled={reportStatus === "submitting"}>
              {#each reportReasons as reason}
                <option value={reason.value}>{reason.label}</option>
              {/each}
            </select>
          </label>

          <label>
            <span>Details <small>Optional</small></span>
            <textarea
              bind:value={reportDetails}
              maxlength="1000"
              rows="4"
              placeholder="Add context that will help our review."
              disabled={reportStatus === "submitting"}
            ></textarea>
          </label>

          {#if reportStatus === "error"}
            <p class="report-error" role="alert">{reportError}</p>
          {/if}

          <div class="dialog-actions">
            <button
              class="dialog-secondary"
              type="button"
              disabled={reportStatus === "submitting"}
              on:click={closeReportDialog}
            >
              Cancel
            </button>
            <button
              class="dialog-primary"
              type="submit"
              disabled={reportStatus === "submitting"}
            >
              {reportStatus === "submitting" ? "Sending…" : "Submit report"}
            </button>
          </div>
        </form>
      {/if}
    </dialog>
  </div>
{:else if loadState === "error"}
  <div class="viewer-state" role="alert">
    <span aria-hidden="true">🎯</span>
    <h2>This shared wheel could not be displayed.</h2>
    <p>The link may be incomplete or the wheel may no longer be available.</p>
    <a href="/">Try Wheelora’s demo</a>
  </div>
{:else}
  <div class="viewer-state viewer-loading" role="status">
    <span class="loading-dot" aria-hidden="true"></span>
    Loading shared wheel…
  </div>
{/if}

<style>
  .sv-wrap { width: 100%; display: flex; justify-content: center; }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .glass-panel {
    background: var(--panel-bg);
    border: var(--panel-border);
    border-radius: 24px;
    padding: clamp(0.85rem,2vw,1.25rem);
    box-shadow: var(--panel-shadow);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    overflow: hidden;
    width: min(100%, 44rem);
    box-sizing: border-box;
    transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  }

  /* Header */
  .detail-header-row { width: 100%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

  .tabs {
    display: flex;
    flex: 1;
    background: var(--tab-bg);
    padding: 0.35rem;
    border-radius: 100px;
  }

  .tab-btn {
    flex: 1;
    background: transparent;
    color: var(--tab-text);
    border: none;
    font: inherit;
    font-size: 0.85rem;
    font-weight: 700;
    padding: 0.45rem 0.2rem;
    min-height: 44px;
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
  }
  .tab-btn.active { background: var(--tab-active-bg); color: var(--tab-active-text); }
  .tab-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .tab-btn:focus-visible,
  .spin-btn:focus-visible,
  .multi-spin-btn:focus-visible,
  .result-badge:focus-visible,
  .like-btn:focus-visible,
  .report-btn:focus-visible,
  .dialog-primary:focus-visible,
  .dialog-secondary:focus-visible,
  .report-dialog select:focus-visible,
  .report-dialog textarea:focus-visible {
    outline: 3px solid #32a79e;
    outline-offset: 3px;
  }

  /* Identity */
  .wheel-identity { display: flex; flex-direction: column; align-items: center; gap: 0.35rem; text-align: center; width: 100%; flex-shrink: 0; }

  .wheel-title-row { display: flex; align-items: center; justify-content: center; gap: 0.45rem; flex-wrap: wrap; }

  .wheel-title-emoji { font-size: 1.45rem; line-height: 1; }

  .wheel-name {
    margin: 0;
    font-size: clamp(1.2rem,3vw,1.6rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text);
    line-height: 1.05;
  }

  .ai-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    background: var(--badge-bg);
    color: var(--badge-text);
    border-radius: 999px;
    padding: 0.22rem 0.55rem;
    text-transform: uppercase;
  }

  .tone-chip {
    align-items: center;
    border-radius: 999px;
    display: flex;
    gap: 0.42rem;
    padding: 0.35rem 0.72rem;
    font-size: 0.84rem;
    white-space: nowrap;
  }
  .tone-chip strong { font-weight: 750; }
  .tone-emoji { font-size: 0.95rem; line-height: 1; }

  /* Single Wheel */
  .wheel-container {
    position: relative;
    width: 100%;
    max-width: min(32rem, 100%);
    aspect-ratio: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    filter: drop-shadow(0 15px 30px rgba(0,0,0,0.15));
    flex-shrink: 0;
  }

  .main-svg { width: 100%; height: 100%; will-change: transform; }

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
    transition: transform 0.15s cubic-bezier(0.175,0.885,0.32,1.275);
  }
  .spin-btn:not(:disabled):hover { transform: scale(1.05); }
  .spin-btn:not(:disabled):active { transform: scale(0.95); }
  .spin-btn:disabled { cursor: default; }

  .inner-hub {
    width: 100%; height: 100%;
    border-radius: 50%;
    background: var(--hub-bg);
    border: 1px solid var(--hub-border);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 3.84px rgba(0,0,0,0.25);
    transition: background 0.2s;
  }

  .pin { position: absolute; top: -10px; z-index: 20; pointer-events: none; transform-origin: center bottom; }

  /* Single Wheel Footer / result badge */
  .wheel-footer { display: flex; flex-direction: column; align-items: center; gap: 0.45rem; width: 100%; flex-shrink: 0; }

  .result-badge {
    background: var(--badge-bg);
    border: var(--panel-border);
    padding: 0.55rem 0.9rem;
    border-radius: 12px;
    height: 5.2rem;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.4s ease;
    width: 100%;
    box-sizing: border-box;
    cursor: pointer;
    font: inherit;
  }
  .result-badge.has-result { background: var(--fresh-bg); border-color: var(--fresh-border); }
  .result-badge.has-result .result-text { color: var(--fresh-text); }
  .result-badge.pulsing { animation: pulse 1.5s cubic-bezier(0.4,0,0.6,1) infinite; }
  @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }

  .result-text { 
    font-size: 1.02rem; font-weight: 800; color: var(--badge-text); 
    line-height: 1.3; text-align: center;
    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
    word-break: break-word;
  }

  .option-details {
    width: 100%;
    color: var(--text);
    border-top: 1px solid var(--hub-border);
    border-bottom: 1px solid var(--hub-border);
  }
  .option-details summary {
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 800;
    padding: 0.85rem 0.25rem;
  }
  .option-details ol {
    margin: 0;
    padding: 0 0.25rem 1rem 1.75rem;
  }
  .option-details li {
    font-size: 0.88rem;
    line-height: 1.45;
    padding: 0.35rem 0;
  }

  /* Multi-wheel */
  .multi-wrap { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 1.25rem; padding-bottom: 0.5rem; flex-shrink: 0; }
  
  .multi-spin-btn {
    background: var(--btn-bg); color: var(--btn-text);
    border: none; border-radius: 999px;
    font: inherit; font-weight: 800; font-size: 0.95rem;
    padding: 0.8rem 1.75rem; cursor: pointer;
    min-height: 44px;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  .multi-spin-btn:hover:not(:disabled) { transform: scale(1.04); box-shadow: 0 6px 16px rgba(0,0,0,0.15); }
  .multi-spin-btn.pulsing { animation: pulse 1.5s infinite; opacity: 0.9; }
  
  .multi-grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(10.5rem, 1fr)); width: 100%; justify-content: center; }
  .multi-card {
    border: var(--panel-border); border-radius: 16px; padding: 0.85rem;
    background: var(--panel-bg); display: flex; flex-direction: column; align-items: center; gap: 0.85rem;
  }
  .multi-card-head { display: flex; gap: 0.4rem; align-items: center; width: 100%; justify-content: center; }
  .mc-emoji { font-size: 1.1rem; }
  .mc-name { font-size: 0.9rem; font-weight: 700; color: var(--text); text-align: center; line-height: 1.1; }
  
  .mini-wheel-container {
    position: relative;
    width: 100%;
    max-width: 8.5rem;
    aspect-ratio: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    filter: drop-shadow(0 6px 12px rgba(0,0,0,0.08));
  }
  .inner-hub.mini { border-width: 1px; }
  .pin.mini { top: -7px; }
  
  .multi-result {
    font-size: 0.85rem; font-weight: 800; color: var(--badge-text);
    text-align: center; line-height: 1.25; padding: 0.45rem 0.6rem;
    background: var(--badge-bg); border: var(--panel-border); border-radius: 8px; width: 100%;
    height: 3.5rem; display: flex; align-items: center; justify-content: center;
    transition: all 0.3s ease;
  }
  .multi-result.pulsing { animation: pulse 1.5s infinite; }
  .multi-result.has-result { background: var(--fresh-bg); border-color: var(--fresh-border); color: var(--fresh-text); }
  .mr-text {
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    word-break: break-word;
  }

  /* Engagement */
  .engagement-row {
    display: flex; align-items: center; gap: 0.65rem;
    width: 100%; justify-content: center; flex-wrap: wrap;
    padding-top: 0.25rem; flex-shrink: 0; margin-top: auto;
  }

  .like-btn {
    display: inline-flex; align-items: center; gap: 0.45rem;
    background: var(--badge-bg); border: 0;
    border-radius: 999px; padding: 0.45rem 0.9rem;
    min-height: 44px;
    font: inherit; font-size: 0.9rem; font-weight: 700;
    color: var(--badge-text); cursor: pointer;
    transition: transform 0.15s, filter 0.15s;
  }
  .like-btn:hover { transform: scale(1.06); filter: brightness(1.05); }
  .like-btn.liked { filter: brightness(1.1); }
  .like-btn:disabled { cursor: default; opacity: 0.82; }
  .like-btn:disabled:hover { transform: none; }
  .like-icon { font-size: 1rem; }
  .like-num { font-variant-numeric: tabular-nums; }
  .engagement-stat {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 6.5rem;
    background: rgba(255,255,255,0.4);
    border-radius: 999px;
    padding: 0.45rem 0.85rem;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--badge-text);
    font-variant-numeric: tabular-nums;
  }

  .report-btn {
    background: transparent;
    border: 1px solid var(--hub-border);
    border-radius: 999px;
    color: var(--text);
    cursor: pointer;
    font: inherit;
    font-size: 0.82rem;
    font-weight: 750;
    min-height: 44px;
    padding: 0.45rem 0.85rem;
  }
  .report-btn:hover:not(:disabled) { background: var(--badge-bg); }
  .report-btn:disabled { cursor: default; opacity: 0.58; }

  .report-dialog {
    background: #fffdf8;
    border: 1px solid #d7d0c4;
    border-radius: 22px;
    box-shadow: 0 28px 90px rgba(22,32,42,0.26);
    color: #16202a;
    max-height: min(90vh, 46rem);
    max-width: min(34rem, calc(100vw - 2rem));
    overflow: auto;
    padding: 0;
    width: 100%;
  }
  .report-dialog::backdrop {
    background: rgba(17,24,39,0.58);
    backdrop-filter: blur(4px);
  }
  .report-dialog-content {
    display: grid;
    gap: 1.15rem;
    padding: clamp(1.3rem,4vw,2rem);
  }
  .report-dialog h2 {
    color: #16202a;
    font-size: clamp(1.45rem,4vw,1.8rem);
    letter-spacing: -0.025em;
    line-height: 1.1;
    margin: 0.3rem 0 0.4rem;
  }
  .report-dialog p {
    color: #59636b;
    line-height: 1.5;
    margin: 0;
  }
  .dialog-kicker {
    color: #237c75;
    font-size: 0.7rem;
    font-weight: 850;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }
  .report-dialog label {
    color: #27313a;
    display: grid;
    font-size: 0.88rem;
    font-weight: 750;
    gap: 0.45rem;
  }
  .report-dialog label small {
    color: #727a80;
    font-size: 0.75rem;
    font-weight: 600;
    margin-left: 0.25rem;
  }
  .report-dialog select,
  .report-dialog textarea {
    background: white;
    border: 1px solid #c9c2b7;
    border-radius: 12px;
    color: #16202a;
    font: inherit;
    font-size: 0.95rem;
    line-height: 1.45;
    padding: 0.72rem 0.8rem;
    resize: vertical;
    width: 100%;
  }
  .report-error {
    background: #fff0ef;
    border: 1px solid #f3bbb6;
    border-radius: 12px;
    color: #8d2921 !important;
    font-size: 0.86rem;
    padding: 0.7rem 0.8rem;
  }
  .dialog-actions {
    display: flex;
    gap: 0.65rem;
    justify-content: flex-end;
  }
  .dialog-primary,
  .dialog-secondary {
    border-radius: 999px;
    cursor: pointer;
    font: inherit;
    font-size: 0.9rem;
    font-weight: 800;
    min-height: 44px;
    padding: 0.68rem 1.05rem;
  }
  .dialog-primary {
    background: #16202a;
    border: 1px solid #16202a;
    color: white;
  }
  .dialog-secondary {
    background: transparent;
    border: 1px solid #c9c2b7;
    color: #27313a;
  }
  .dialog-primary:disabled,
  .dialog-secondary:disabled { cursor: wait; opacity: 0.62; }
  .report-success {
    justify-items: center;
    padding-block: 2rem;
    text-align: center;
  }
  .report-success-icon {
    align-items: center;
    background: #dff5f1;
    border-radius: 50%;
    color: #237c75;
    display: inline-flex;
    font-size: 1.4rem;
    font-weight: 900;
    height: 3rem;
    justify-content: center;
    width: 3rem;
  }

  .viewer-state {
    align-items: center;
    background: #fffdf8;
    border: 1px solid #d7d0c4;
    border-radius: 22px;
    box-shadow: 0 18px 48px rgba(22,32,42,0.08);
    color: #59636b;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    padding: clamp(1.5rem,5vw,2.5rem);
    text-align: center;
    width: min(100%, 44rem);
  }
  .viewer-state > span:first-child { font-size: 2rem; }
  .viewer-state h2 {
    color: #16202a;
    font-size: clamp(1.3rem,4vw,1.7rem);
    letter-spacing: -0.02em;
    margin: 0;
  }
  .viewer-state p { line-height: 1.5; margin: 0; }
  .viewer-state a {
    background: #16202a;
    border-radius: 999px;
    color: white;
    font-weight: 800;
    margin-top: 0.35rem;
    padding: 0.7rem 1rem;
    text-decoration: none;
  }
  .viewer-loading { flex-direction: row; justify-content: center; min-height: 8rem; }
  .loading-dot {
    animation: loading-pulse 1s ease-in-out infinite;
    background: #32a79e;
    border-radius: 50%;
    height: 0.7rem;
    width: 0.7rem;
  }
  @keyframes loading-pulse {
    0%, 100% { opacity: 0.35; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1); }
  }

  /* Responsive */
  @media (max-width: 640px) {
    .glass-panel { border-radius: 20px; gap: 0.7rem; padding: 0.95rem; }
    .wheel-container { max-width: min(100%, 25rem); }
    .tabs { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); }
    .tab-btn { font-size: 0.82rem; padding: 0.55rem 0.35rem; }
    .engagement-row {
      display: grid;
      gap: 0.4rem;
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    .engagement-stat {
      font-size: 0.78rem;
      min-width: 0;
      padding-inline: 0.25rem;
    }
    .like-btn,
    .report-btn {
      justify-content: center;
      padding-inline: 0.35rem;
      width: 100%;
    }
    .dialog-actions { flex-direction: column-reverse; }
    .dialog-primary, .dialog-secondary { width: 100%; }
  }

  @media (prefers-reduced-motion: reduce) {
    .loading-dot,
    .result-badge.pulsing,
    .multi-result.pulsing,
    .multi-spin-btn.pulsing {
      animation: none;
    }
  }
</style>
