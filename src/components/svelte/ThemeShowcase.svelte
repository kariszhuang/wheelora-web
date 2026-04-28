<script lang="ts">
  import { activeTheme } from "../../store/theme";

  const THEME_ORDER = [
      "minimal",
      "dark",
      "playful",
      "elegant",
  ];

  const THEME_DETAILS = {
    minimal: {
        label: "Minimal",
        tagline: "Quiet, crisp, and modern",
        badge: "Clean",
        isPro: false,
        surface: "#FFFFFF",
        surfaceMuted: "#F3F4F6",
        borderColor: "#E5E7EB",
        textColor: "#111827",
        mutedTextColor: "#6B7280",
        accent: "#4F46E5",
        accentStrong: "#111827",
        accentSoft: "#EEF2FF",
        accentContrast: "#FFFFFF",
        glowColor: "rgba(79,70,229,0.12)",
        heroOrb: "rgba(79,70,229,0.12)",
    },
    dark: {
        label: "Dark",
        tagline: "Deep contrast with neon energy",
        badge: "Focus",
        isPro: false,
        surface: "#111317",
        surfaceMuted: "#23242B",
        borderColor: "#2C2E36",
        textColor: "#FAFAFA",
        mutedTextColor: "#A1A1AA",
        accent: "#39FF14",
        accentSoft: "rgba(57,255,20,0.12)",
        accentContrast: "#000000",
        glowColor: "rgba(57,255,20,0.22)",
        heroOrb: "rgba(57,255,20,0.16)",
    },
    playful: {
        label: "Playful",
        tagline: "Punchy, bright, and delightfully loud",
        badge: "Pro",
        isPro: true,
        surface: "#FFFDF4",
        surfaceMuted: "#FFE082",
        borderColor: "#111111",
        textColor: "#111111",
        mutedTextColor: "#504A3B",
        accent: "#FF5A36",
        accentSoft: "#FFF1A8",
        accentContrast: "#FFFFFF",
        glowColor: "rgba(255,90,54,0.18)",
        heroOrb: "rgba(255,90,54,0.22)",
    },
    elegant: {
        label: "Elegant",
        tagline: "Warm luxury with refined calm",
        badge: "Pro",
        isPro: true,
        surface: "#FFFDF8",
        surfaceMuted: "#F3ECE1",
        borderColor: "#D8C7A7",
        textColor: "#231F19",
        mutedTextColor: "#7C6D58",
        accent: "#C5A059",
        accentSoft: "rgba(197,160,89,0.14)",
        accentContrast: "#FFFFFF",
        glowColor: "rgba(197,160,89,0.16)",
        heroOrb: "rgba(197,160,89,0.16)",
    },
  } as any;

  $: selectedTheme = $activeTheme;
</script>

<div class="theme-grid">
  {#each THEME_ORDER as themeKey}
    {@const tokens = THEME_DETAILS[themeKey]}
    {@const isSelected = selectedTheme === themeKey}
    
    <button 
      class="theme-card {isSelected ? 'selected' : ''} {themeKey === 'playful' ? 'theme-playful' : ''} {themeKey === 'elegant' ? 'theme-elegant' : ''}"
      style="
        --card-bg: {tokens.surface};
        --card-border: {isSelected ? tokens.accent : tokens.borderColor};
        --card-shadow: {tokens.glowColor};
        --text-color: {tokens.textColor};
        --muted-text: {tokens.mutedTextColor};
      "
      on:click={() => $activeTheme = themeKey}
    >
      <div class="theme-card-top">
        <div class="theme-card-info">
          <div class="theme-card-title-row">
            <span class="theme-title">{tokens.label}</span>
            {#if tokens.isPro}
              <span class="theme-badge" style="background-color: {tokens.accentSoft}; border-color: {tokens.borderColor}; color: {tokens.textColor};">
                {tokens.badge}
              </span>
            {/if}
          </div>
          <span class="theme-tagline">{tokens.tagline}</span>
        </div>

        <div class="selection-mark" style="border-color: {isSelected ? tokens.accent : tokens.borderColor}; background-color: {isSelected ? tokens.accent : 'transparent'};">
          {#if isSelected}
             <svg viewBox="0 0 24 24" width="16" height="16" stroke="{tokens.accentContrast}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          {/if}
        </div>
      </div>

      <div class="preview-stage-wrapper">
        {#if themeKey === 'minimal'}
            <div class="preview-stage" style="background-color: #F9FAFB;">
                <div class="preview-minimal-ring" style="border-color: {tokens.accentSoft};"></div>
                <div class="preview-minimal-layout">
                    <div class="preview-minimal-word" style="color: {tokens.textColor};">calm</div>
                    <div class="preview-minimal-track" style="background-color: {tokens.surfaceMuted};">
                        <div class="preview-minimal-fill" style="background-color: {tokens.accentStrong};"></div>
                    </div>
                    <div class="preview-minimal-dots">
                        <div class="preview-minimal-dot" style="background-color: {tokens.accentStrong};"></div>
                        <div class="preview-minimal-dot" style="background-color: #D1D5DB;"></div>
                        <div class="preview-minimal-dot" style="background-color: #E5E7EB;"></div>
                    </div>
                </div>
            </div>
        {:else if themeKey === 'dark'}
            <div class="preview-stage" style="background-color: #0A0A0C;">
                <div class="preview-dark-glow" style="background-color: {tokens.glowColor};"></div>
                <div class="preview-dark-panel" style="border-color: {tokens.borderColor};">
                    <div class="preview-dark-header">
                        <div class="preview-dark-badge" style="background-color: rgba(57,255,20,0.16);"></div>
                        <div class="preview-dark-badge" style="background-color: rgba(139,92,246,0.24); width: 38px;"></div>
                    </div>
                    <div class="preview-dark-wheel" style="border-color: {tokens.accent};">
                        <div class="preview-dark-wheel-core" style="background-color: {tokens.accent};"></div>
                    </div>
                </div>
            </div>
        {:else if themeKey === 'playful'}
            <div class="preview-stage" style="background-color: #FFF5C2;">
                <div class="preview-sticker" style="background-color: #39FF14; transform: rotate(-10deg);">
                    <div class="preview-sticker-text">wow</div>
                </div>
                <div class="preview-playful-card" style="border-color: {tokens.borderColor};">
                    <div class="preview-playful-pill" style="background-color: {tokens.accent};"></div>
                    <div class="preview-playful-row">
                        <div class="preview-playful-wheel" style="border-color: {tokens.borderColor};"></div>
                        <div class="preview-playful-words">
                            <div class="preview-playful-line" style="background-color: #111111; width: 84%;"></div>
                            <div class="preview-playful-line" style="background-color: #111111; width: 58%;"></div>
                        </div>
                    </div>
                </div>
            </div>
        {:else if themeKey === 'elegant'}
            <div class="preview-stage" style="background-color: #F7F0E4;">
                <div class="preview-elegant-glow" style="border-color: {tokens.borderColor};"></div>
                <div class="preview-elegant-card" style="border-color: {tokens.borderColor};">
                    <div class="preview-elegant-title" style="color: {tokens.textColor};">atelier</div>
                    <div class="preview-elegant-wheel" style="border-color: {tokens.accent};">
                        <div class="preview-elegant-wheel-core" style="background-color: {tokens.accent};"></div>
                    </div>
                    <div class="preview-elegant-rule" style="background-color: {tokens.borderColor};"></div>
                </div>
            </div>
        {/if}
      </div>

      <div class="theme-card-footer">
        <span class="theme-card-footnote">{isSelected ? "Selected" : "Available"}</span>
        {#if isSelected}
           <svg viewBox="0 0 24 24" width="16" height="16" stroke="{tokens.accent}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="16 10 11 15 8 12"></polyline></svg>
        {:else}
           <div style="width: 14px; height: 14px; border-radius: 7px; border: 2px solid {tokens.accent}; opacity: 0.5;"></div>
        {/if}
      </div>
    </button>
  {/each}
</div>

<style>
  .theme-grid {
    display: grid;
    gap: 1.25rem;
    width: 100%;
    align-items: stretch;
    grid-auto-rows: 1fr;
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    .theme-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .theme-card {
    background-color: var(--card-bg);
    border: 1.5px solid var(--card-border);
    border-radius: 24px;
    padding: 14px;
    min-height: 196px;
    height: 100%;
    width: 100%;
    text-align: left;
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    display: flex;
    flex-direction: column;
    outline: none;
  }

  .theme-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.06);
  }

  .theme-card.selected {
    box-shadow: 0 12px 24px var(--card-shadow);
    transform: translateY(-2px);
  }

  .theme-playful {
    transform: rotate(-0.6deg);
  }
  
  .theme-playful:hover, .theme-playful.selected {
    transform: rotate(-0.6deg) translateY(-2px);
  }

  .theme-elegant {
    border-radius: 20px;
  }

  .theme-card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .theme-card-info {
    flex: 1;
    min-width: 0;
  }

  .theme-card-title-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }

  .theme-title {
    font-size: 1.125rem;
    font-weight: 800;
    color: var(--text-color);
    letter-spacing: -0.02em;
    font-family: inherit;
  }

  .theme-badge {
    border-radius: 999px;
    padding: 3px 8px;
    border: 1px solid;
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .theme-tagline {
    font-size: 0.85rem;
    line-height: 1.4;
    color: var(--muted-text);
    display: block;
    font-weight: 500;
    min-height: 2.4em;
  }

  .selection-mark {
    width: 28px;
    height: 28px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid;
    flex-shrink: 0;
    transition: all 0.2s;
  }

  .preview-stage-wrapper {
    margin-bottom: 16px;
    flex: 1 1 auto;
    display: flex;
  }

  .preview-stage {
    align-self: stretch;
    height: 92px;
    width: 100%;
    border-radius: 18px;
    overflow: hidden;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Preview Minimal */
  .preview-minimal-ring {
    position: absolute;
    width: 124px;
    height: 124px;
    border-radius: 62px;
    border: 16px solid;
    top: -52px;
    right: -22px;
  }
  .preview-minimal-layout {
    width: 82%;
    z-index: 1;
  }
  .preview-minimal-word {
    font-size: 24px;
    font-weight: 900;
    letter-spacing: -1.4px;
    margin-bottom: 10px;
    line-height: 1;
  }
  .preview-minimal-track {
    height: 8px;
    border-radius: 999px;
    overflow: hidden;
    margin-bottom: 10px;
  }
  .preview-minimal-fill {
    height: 100%;
    border-radius: 999px;
  }
  .preview-minimal-dots {
    display: flex;
    gap: 6px;
  }
  .preview-minimal-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
  }

  /* Preview Dark */
  .preview-dark-glow {
    position: absolute;
    width: 124px;
    height: 124px;
    border-radius: 62px;
    top: -26px;
    right: -10px;
    filter: blur(12px);
  }
  .preview-dark-panel {
    width: 84%;
    border-radius: 18px;
    background-color: #101114;
    border: 1px solid;
    padding: 12px;
    z-index: 1;
  }
  .preview-dark-header {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }
  .preview-dark-badge {
    height: 8px;
    border-radius: 999px;
    width: 20px;
  }
  .preview-dark-wheel {
    width: 42px;
    height: 42px;
    border-radius: 21px;
    border: 3px solid;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .preview-dark-wheel-core {
    width: 12px;
    height: 12px;
    border-radius: 999px;
  }

  /* Preview Playful */
  .preview-sticker {
    position: absolute;
    left: 12px;
    top: 12px;
    padding: 6px 10px;
    border-radius: 999px;
    border: 2px solid #111111;
    z-index: 2;
  }
  .preview-sticker-text {
    font-size: 11px;
    font-weight: 900;
    color: #111111;
    text-transform: uppercase;
    line-height: 1;
  }
  .preview-playful-card {
    width: 82%;
    background-color: #FFFFFF;
    border-radius: 14px;
    border: 3px solid;
    padding: 12px;
    box-shadow: 4px 4px 0 #111111;
  }
  .preview-playful-pill {
    width: 58px;
    height: 10px;
    border-radius: 999px;
    margin-bottom: 10px;
  }
  .preview-playful-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .preview-playful-wheel {
    width: 34px;
    height: 34px;
    border-radius: 17px;
    border: 4px solid;
    background-color: #FFE082;
  }
  .preview-playful-words {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  .preview-playful-line {
    height: 7px;
    border-radius: 999px;
  }

  /* Preview Elegant */
  .preview-elegant-glow {
    position: absolute;
    width: 126px;
    height: 126px;
    border-radius: 63px;
    border: 1px solid;
    top: -36px;
    right: -20px;
    opacity: 0.2;
  }
  .preview-elegant-card {
    width: 84%;
    border-radius: 18px;
    border: 1px solid;
    background-color: rgba(255,255,255,0.85);
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    backdrop-filter: blur(4px);
    z-index: 1;
  }
  .preview-elegant-title {
    font-size: 13px;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 10px;
    line-height: 1;
  }
  .preview-elegant-wheel {
    width: 38px;
    height: 38px;
    border-radius: 19px;
    border: 2px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
  }
  .preview-elegant-wheel-core {
    width: 8px;
    height: 8px;
    border-radius: 999px;
  }
  .preview-elegant-rule {
    width: 56px;
    height: 1px;
  }

  .theme-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: auto;
  }
  
  .theme-card-footnote {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--muted-text);
  }
</style>
