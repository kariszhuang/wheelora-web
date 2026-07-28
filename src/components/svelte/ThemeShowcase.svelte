<script lang="ts">
  import type { ThemeShowcaseCopy } from "../../i18n/themeShowcase.generated";

  export let copy: ThemeShowcaseCopy | undefined = undefined;

  const themes = [
    { key: "minimal", label: "Minimal", tagline: "Light interface with clear contrast", surface: "#FFFFFF", muted: "#F3F4F6", border: "#E5E7EB", text: "#111827", subtext: "#6B7280", accent: "#4F46E5", strong: "#111827", glow: "rgba(79,70,229,0.12)" },
    { key: "dark", label: "Dark", tagline: "Deep contrast with neon energy", surface: "#111317", muted: "#23242B", border: "#2C2E36", text: "#FAFAFA", subtext: "#A1A1AA", accent: "#39FF14", strong: "#8B5CF6", glow: "rgba(57,255,20,0.22)" },
    { key: "playful", label: "Playful", tagline: "Bright, high-energy, and easy to scan", surface: "#FFFFFF", muted: "#FFE6CC", border: "#1F2937", text: "#111827", subtext: "#4B5563", accent: "#FF5A36", strong: "#0F172A", glow: "rgba(255,90,54,0.18)" },
    { key: "elegant", label: "Elegant", tagline: "Warm luxury with refined calm", surface: "#FFFDF8", muted: "#F3ECE1", border: "#D7C4A0", text: "#1F2528", subtext: "#6F6254", accent: "#8A6F35", strong: "#2F5D62", glow: "rgba(138,111,53,0.16)" },
    { key: "aurora", label: "Aurora", tagline: "Luminous color on a midnight canvas", surface: "#10172F", muted: "#202B52", border: "#344574", text: "#F7F7FF", subtext: "#AAB6D6", accent: "#7BE7FF", strong: "#C697FF", glow: "rgba(123,231,255,0.28)" },
    { key: "editorial", label: "Editorial", tagline: "Bold type, warm paper, decisive contrast", surface: "#FCF8F0", muted: "#E8DFD0", border: "#1D2733", text: "#16202A", subtext: "#675F55", accent: "#C94332", strong: "#244E8A", glow: "rgba(22,32,42,0.12)" },
    { key: "botanical", label: "Botanical", tagline: "Calm greens, sunlit surfaces, organic warmth", surface: "#FAFCF5", muted: "#E2EAD7", border: "#AFC29C", text: "#1E3428", subtext: "#5E715F", accent: "#2F7655", strong: "#984A31", glow: "rgba(47,118,85,0.17)" },
    { key: "solstice", label: "Solstice", tagline: "Golden light with crisp cobalt confidence", surface: "#FFFCF0", muted: "#F8E7A6", border: "#D8A91F", text: "#172852", subtext: "#625D4A", accent: "#F2B705", strong: "#2457C5", glow: "rgba(242,183,5,0.22)" },
    { key: "tidal", label: "Tidal", tagline: "Sea-glass calm with a warm coral pulse", surface: "#F7FCFA", muted: "#D2E9E3", border: "#9BC4BA", text: "#123C3A", subtext: "#52706B", accent: "#0E746E", strong: "#C95742", glow: "rgba(14,116,110,0.17)" },
    { key: "blueprint", label: "Blueprint", tagline: "Measured structure with technical clarity", surface: "#F7FAFE", muted: "#DCE8F7", border: "#2B5C9A", text: "#143152", subtext: "#536A82", accent: "#2463A8", strong: "#C8472E", glow: "rgba(36,99,168,0.16)" },
  ] as const;

  let selectedTheme = "minimal";
</script>

<div class="theme-grid" aria-label={copy?.label ?? "Wheelora themes"}>
  {#each themes as theme}
    {@const label = copy?.names[theme.key] ?? theme.label}
    {@const tagline = copy?.taglines[theme.key] ?? theme.tagline}
    <button
      type="button"
      class:selected={selectedTheme === theme.key}
      aria-pressed={selectedTheme === theme.key}
      aria-label={`${label}: ${tagline}`}
      on:click={() => selectedTheme = theme.key}
      style={`--surface:${theme.surface};--muted:${theme.muted};--border:${theme.border};--text:${theme.text};--subtext:${theme.subtext};--accent:${theme.accent};--strong:${theme.strong};--glow:${theme.glow}`}
    >
      <span class="copy"><strong>{label}</strong><small>{tagline}</small></span>
      <span class="preview" aria-hidden="true">
        <span class="wheel"><i></i></span>
        <span class="lines"><i></i><i></i><i></i></span>
      </span>
      <span class="status">{selectedTheme === theme.key ? copy?.selected ?? "Selected" : copy?.preview ?? "Choose theme"}<i aria-hidden="true"></i></span>
    </button>
  {/each}
</div>

<style>
  .theme-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:1rem; width:100%; }
  button { appearance:none; min-width:0; padding:1rem; border:1.5px solid var(--border); border-radius:1.25rem; color:var(--text); background:var(--surface); text-align:left; cursor:pointer; box-shadow:0 4px 12px rgb(15 23 42 / .05); transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease; }
  button:hover { transform:translateY(-2px); }
  button:focus-visible { outline:3px solid var(--accent); outline-offset:3px; }
  button.selected { border-color:var(--accent); box-shadow:0 10px 24px var(--glow); }
  .copy { display:block; min-height:3.6rem; }
  strong,small { display:block; }
  strong { font-size:1.05rem; letter-spacing:-.02em; }
  small { margin-top:.3rem; color:var(--subtext); font-size:.78rem; line-height:1.35; }
  .preview { display:flex; align-items:center; gap:1rem; height:6rem; margin:.8rem 0; padding:1rem; overflow:hidden; border-radius:1rem; background:var(--muted); }
  .wheel { display:grid; place-items:center; width:3.5rem; aspect-ratio:1; flex:none; border:9px solid var(--accent); border-right-color:var(--strong); border-radius:50%; transform:rotate(-35deg); }
  .wheel i { width:.7rem; aspect-ratio:1; border-radius:50%; background:var(--surface); box-shadow:0 0 0 2px var(--border); }
  .lines { flex:1; }
  .lines i { display:block; height:.45rem; margin:.48rem 0; border-radius:1rem; background:var(--text); opacity:.88; }
  .lines i:nth-child(2) { width:72%; background:var(--accent); }
  .lines i:nth-child(3) { width:48%; background:var(--strong); }
  .status { display:flex; align-items:center; justify-content:space-between; color:var(--subtext); font-size:.75rem; font-weight:700; }
  .status i { width:.7rem; aspect-ratio:1; border:2px solid var(--accent); border-radius:50%; background:transparent; }
  .selected .status i { background:var(--accent); box-shadow:inset 0 0 0 2px var(--surface); }
  @media (min-width:720px) { .theme-grid { grid-template-columns:repeat(3,minmax(0,1fr)); } }
  @media (min-width:1100px) { .theme-grid { grid-template-columns:repeat(5,minmax(0,1fr)); } }
  @media (prefers-reduced-motion:reduce) { button { transition:none; } button:hover { transform:none; } }
</style>
