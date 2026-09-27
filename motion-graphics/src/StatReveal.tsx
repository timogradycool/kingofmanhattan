/* =============================================================================
 * STAT REVEAL — reusable template
 *
 * Edit the defaults below (or override any of them at render time with
 * `--props='{"statValue": 12.5, "statSuffix": "K"}'`). Every key here is also
 * editable live in Remotion Studio's right-hand props panel.
 * ========================================================================== */

export const statRevealDefaults = {
  // --- TEXT -----------------------------------------------------------------
  statValue: 3.2, // the number the counter lands on
  statDecimals: 1, // digits after the decimal point (3.2 → 1, 1500 → 0)
  statPrefix: "", // e.g. "$" or "+"
  statSuffix: "M", // e.g. "M", "K", "%", "x"
  useThousandsSeparator: true, // 12500 → "12,500"
  supportingLine: "views in 30 days", // slides in word by word
  accentWords: ["30", "days"], // words in supportingLine drawn in accentColor
  brandName: "@yourbrand", // wordmark shown when logoFile is empty ("" = nothing)
  logoFile: "", // file in public/ (e.g. "logo.png") or an https:// URL

  // --- BRAND ----------------------------------------------------------------
  primaryColor: "#7C5CFF", // glow, gradient drift, divider
  accentColor: "#2EE6D6", // suffix, accent words, divider end
  backgroundColor: "#07070D",
  textColor: "#FFFFFF",
  font: "Outfit" as FontName, // clean geometric sans; see FONTS below
  glowStrength: 1, // 0 = no glow, 1 = subtle, 2 = strong

  // --- TIMING (seconds) -----------------------------------------------------
  fps: 30,
  durationInSeconds: 6,
  backgroundFadeEnd: 1, // 0 → this: background fades in
  countStart: 1, // number starts counting
  countDuration: 2, // how long the count takes to land
  lineStart: 3, // supporting line begins
  wordStagger: 0.12, // delay between each word
  logoStart: 5, // logo / wordmark scales in, then everything holds

  // --- OUTPUT ---------------------------------------------------------------
  transparentBackground: false, // true = no background (for ProRes 4444 alpha)
};

/* ========================================================================== */

import { loadFont } from "@remotion/fonts";
import { zColor } from "@remotion/zod-types";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

// Fonts are bundled in public/fonts (SIL Open Font License) so renders work
// offline. Only the selected font is loaded. `heavy` is the number's weight.
const FONTS = {
  Outfit: { heavy: 800, files: [["Outfit.woff2", "100 900"]] },
  Sora: { heavy: 800, files: [["Sora.woff2", "100 800"]] },
  Manrope: { heavy: 800, files: [["Manrope.woff2", "200 800"]] },
  Montserrat: { heavy: 800, files: [["Montserrat.woff2", "100 900"]] },
  Inter: { heavy: 800, files: [["Inter.woff2", "100 900"]] },
  SpaceGrotesk: { heavy: 700, files: [["SpaceGrotesk.woff2", "300 700"]] },
  Poppins: { heavy: 800, files: [["Poppins-500.woff2", "500"], ["Poppins-800.woff2", "800"]] },
} as const;

const loadedFonts = new Set<string>();
const useFont = (name: FontName) => {
  const family = `StatReveal ${name}`;
  if (!loadedFonts.has(name)) {
    loadedFonts.add(name);
    for (const [file, weight] of FONTS[name].files) {
      loadFont({ family, url: staticFile(`fonts/${file}`), weight });
    }
  }
  return family;
};

type FontName = keyof typeof FONTS;
const FONT_NAMES = Object.keys(FONTS) as [FontName, ...FontName[]];

export const statRevealSchema = z.object({
  statValue: z.number(),
  statDecimals: z.number().int().min(0).max(4),
  statPrefix: z.string(),
  statSuffix: z.string(),
  useThousandsSeparator: z.boolean(),
  supportingLine: z.string(),
  accentWords: z.array(z.string()),
  brandName: z.string(),
  logoFile: z.string(),
  primaryColor: zColor(),
  accentColor: zColor(),
  backgroundColor: zColor(),
  textColor: zColor(),
  font: z.enum(FONT_NAMES),
  glowStrength: z.number().min(0).max(3),
  fps: z.number().int().min(1).max(120),
  durationInSeconds: z.number().positive(),
  backgroundFadeEnd: z.number().min(0),
  countStart: z.number().min(0),
  countDuration: z.number().positive(),
  lineStart: z.number().min(0),
  wordStagger: z.number().min(0),
  logoStart: z.number().min(0),
  transparentBackground: z.boolean(),
});

export type StatRevealProps = z.infer<typeof statRevealSchema>;

// Duration and fps come from props so timing stays editable in one place.
export const calculateStatRevealMetadata: CalculateMetadataFunction<StatRevealProps> = ({ props }) => ({
  fps: props.fps,
  durationInFrames: Math.max(1, Math.round(props.durationInSeconds * props.fps)),
});

// Studio's export defaults for the alpha compositions (ProRes 4444 with alpha).
export const calculateStatRevealAlphaMetadata: CalculateMetadataFunction<StatRevealProps> = (options) => ({
  ...calculateStatRevealMetadata(options),
  defaultCodec: "prores",
  defaultProResProfile: "4444",
  defaultVideoImageFormat: "png",
  defaultPixelFormat: "yuva444p10le",
});

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const mix = (color: string, pct: number) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;
const normalizeWord = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

export const StatReveal: React.FC<StatRevealProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const fontFamily = useFont(props.font);
  const heavy = FONTS[props.font].heavy;

  const u = Math.min(width, height) / 1080; // layout unit, 1 at 1080p
  const isVertical = height > width;
  const safeX = 90 * u;
  const glow = props.glowStrength;

  // Frame markers
  const countStartF = props.countStart * fps;
  const countEndF = (props.countStart + props.countDuration) * fps;
  const lineStartF = props.lineStart * fps;
  const logoStartF = props.logoStart * fps;

  // ---- 1. Background: fade in + slow gradient drift -------------------------
  const bgOpacity = interpolate(frame, [0, Math.max(1, props.backgroundFadeEnd * fps)], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.33, 0, 0.2, 1),
  });
  const drift = interpolate(frame, [0, durationInFrames], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const blobSize = Math.max(width, height) * 1.25;

  // ---- 2. Number: spring count-up + bouncy entrance + landing flare --------
  const countProgress = spring({
    frame: frame - countStartF,
    fps,
    durationInFrames: Math.max(1, countEndF - countStartF),
    config: { damping: 200 },
  });
  const shownValue = frame >= countEndF ? props.statValue : props.statValue * countProgress;
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: props.statDecimals,
    maximumFractionDigits: props.statDecimals,
    useGrouping: props.useThousandsSeparator,
  });
  const numberText = formatter.format(shownValue);
  const finalNumberText = formatter.format(props.statValue);

  const numberPop = spring({ frame: frame - countStartF, fps, config: { damping: 11, stiffness: 120, mass: 0.8 } });
  const landing = interpolate(frame, [countEndF - 8, countEndF, countEndF + 22], [0, 1, 0], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });

  // Fit the final number (prefix + digits + smaller suffix) inside the safe area.
  const affixScale = 0.55;
  const estimatedEms =
    finalNumberText.length * 0.6 + (props.statPrefix.length + props.statSuffix.length) * 0.62 * affixScale;
  const numberSize = Math.min((isVertical ? 380 : 300) * u, (width - safeX * 2) / Math.max(estimatedEms, 1));

  // ---- 3. Divider + supporting line, word by word --------------------------
  const dividerIn = spring({ frame: frame - lineStartF, fps, config: { damping: 200 }, durationInFrames: 0.8 * fps });
  const words = props.supportingLine.split(/\s+/).filter(Boolean);
  const accentSet = new Set(props.accentWords.map(normalizeWord));
  const lineSize = (isVertical ? 78 : 60) * u;

  // ---- 4. Logo / wordmark ---------------------------------------------------
  const logoPop = spring({ frame: frame - logoStartF, fps, config: { damping: 12, stiffness: 110 } });
  const logoSrc = props.logoFile
    ? /^https?:\/\//.test(props.logoFile)
      ? props.logoFile
      : staticFile(props.logoFile)
    : null;

  // Slow push-in on the whole group so the hold never feels frozen.
  const pushIn = interpolate(frame, [countStartF, durationInFrames], [1, 1.035], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <AbsoluteFill style={{ fontFamily, color: props.textColor }}>
      {!props.transparentBackground && (
        <AbsoluteFill style={{ backgroundColor: props.backgroundColor, opacity: bgOpacity, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              width: blobSize,
              height: blobSize,
              left: interpolate(drift, [0, 1], [0.2 * width, 0.55 * width]) - blobSize / 2,
              top: interpolate(drift, [0, 1], [0.22 * height, 0.38 * height]) - blobSize / 2,
              background: `radial-gradient(circle, ${mix(props.primaryColor, 42)} 0%, transparent 58%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: blobSize * 0.9,
              height: blobSize * 0.9,
              left: interpolate(drift, [0, 1], [0.85 * width, 0.45 * width]) - (blobSize * 0.9) / 2,
              top: interpolate(drift, [0, 1], [0.85 * height, 0.68 * height]) - (blobSize * 0.9) / 2,
              background: `radial-gradient(circle, ${mix(props.accentColor, 26)} 0%, transparent 55%)`,
            }}
          />
          <AbsoluteFill
            style={{
              background: `radial-gradient(ellipse at center, transparent 45%, ${mix(props.backgroundColor, 85)} 100%)`,
            }}
          />
        </AbsoluteFill>
      )}

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: `0 ${safeX}px`,
          scale: pushIn,
          translate: `0 ${(isVertical ? -70 : -30) * u}px`,
        }}
      >
        {/* Number */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontSize: numberSize,
            fontWeight: heavy,
            lineHeight: 1,
            letterSpacing: "-0.035em",
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
            opacity: interpolate(numberPop, [0, 0.35], [0, 1], clamp),
            scale: interpolate(numberPop, [0, 1], [0.55, 1]) * (1 + 0.045 * landing),
            translate: `0 ${interpolate(numberPop, [0, 1], [90 * u, 0])}px`,
            filter:
              glow > 0
                ? `drop-shadow(0 0 ${(28 + 30 * landing) * u * glow}px ${mix(props.primaryColor, 55 + 35 * landing)})`
                : undefined,
          }}
        >
          {props.statPrefix && (
            <span style={{ fontSize: `${affixScale}em`, color: props.accentColor, marginRight: "0.06em" }}>
              {props.statPrefix}
            </span>
          )}
          <span>{numberText}</span>
          {props.statSuffix && (
            <span style={{ fontSize: `${affixScale * 1.25}em`, color: props.accentColor, marginLeft: "0.04em" }}>
              {props.statSuffix}
            </span>
          )}
        </div>

        {/* Divider */}
        <div
          style={{
            marginTop: 44 * u,
            height: 6 * u,
            width: 170 * u,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${props.primaryColor}, ${props.accentColor})`,
            scale: `${dividerIn} 1`,
            opacity: interpolate(dividerIn, [0, 0.2], [0, 1], clamp),
            boxShadow: glow > 0 ? `0 0 ${24 * u * glow}px ${mix(props.primaryColor, 70)}` : undefined,
          }}
        />

        {/* Supporting line */}
        <div
          style={{
            marginTop: 44 * u,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            columnGap: "0.28em",
            rowGap: "0.1em",
            fontSize: lineSize,
            fontWeight: 500,
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            textAlign: "center",
            maxWidth: width - safeX * 2,
          }}
        >
          {words.map((word, i) => {
            const s = spring({
              frame: frame - lineStartF - i * props.wordStagger * fps,
              fps,
              config: { damping: 14, stiffness: 140 },
            });
            const isAccent = accentSet.has(normalizeWord(word));
            return (
              <span
                key={`${word}-${i}`}
                style={{
                  display: "inline-block",
                  color: isAccent ? props.accentColor : mix(props.textColor, 82),
                  opacity: interpolate(s, [0, 0.6], [0, 1], clamp),
                  translate: `${interpolate(s, [0, 1], [-28 * u, 0])}px ${interpolate(s, [0, 1], [34 * u, 0])}px`,
                  filter: `blur(${interpolate(s, [0, 1], [10 * u, 0], clamp)}px)`,
                  textShadow:
                    isAccent && glow > 0 ? `0 0 ${22 * u * glow}px ${mix(props.accentColor, 55)}` : undefined,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* Logo / wordmark */}
      {(logoSrc || props.brandName) && (
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: isVertical ? 0.17 * height : 0.1 * height,
          }}
        >
          <div
            style={{
              opacity: interpolate(logoPop, [0, 0.4], [0, 1], clamp),
              scale: interpolate(logoPop, [0, 1], [0.4, 1]),
              filter: glow > 0 ? `drop-shadow(0 0 ${18 * u * glow}px ${mix(props.primaryColor, 45)})` : undefined,
            }}
          >
            {logoSrc ? (
              <Img src={logoSrc} style={{ height: 120 * u, width: "auto", display: "block" }} />
            ) : (
              <div
                style={{
                  fontSize: (isVertical ? 46 : 38) * u,
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  padding: `${14 * u}px ${34 * u}px`,
                  borderRadius: 999,
                  border: `${2 * u}px solid ${mix(props.primaryColor, 70)}`,
                  background: mix(props.primaryColor, 14),
                  color: props.textColor,
                }}
              >
                {props.brandName}
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
