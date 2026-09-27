# motion-graphics

Remotion (TypeScript) project with a reusable **Stat Reveal** template:
`src/StatReveal.tsx`. All text, colors, font and timing live in
`statRevealDefaults` at the top of that file.

| Composition                   | Size      | Output                                   |
| ----------------------------- | --------- | ---------------------------------------- |
| `StatReveal-Vertical`         | 1080×1920 | `out/stat-reveal-vertical.mp4`           |
| `StatReveal-Horizontal`       | 1920×1080 | `out/stat-reveal-horizontal.mp4`         |
| `StatReveal-Vertical-Alpha`   | 1080×1920 | `out/stat-reveal-vertical-alpha.mov`     |
| `StatReveal-Horizontal-Alpha` | 1920×1080 | `out/stat-reveal-horizontal-alpha.mov`   |

Alpha versions are ProRes 4444 with a real alpha channel (no background), for
overlaying in Premiere / Resolve / Final Cut.

## Commands

```bash
npm i
npm run dev                      # Remotion Studio: live preview + props panel
npm run render                   # all four outputs
npm run render:vertical          # just the 9:16 MP4
npm run render:alpha             # just the 9:16 ProRes 4444 .mov
```

### Re-render with new text (no code edits)

Anything passed in `--props` overrides the defaults; everything else is kept.

```bash
npx remotion render StatReveal-Vertical out/followers.mp4 \
  --props='{"statValue":250,"statDecimals":0,"statSuffix":"K","supportingLine":"new followers this quarter","accentWords":["this","quarter"]}'
```

Or put the props in a JSON file and pass `--props=./my-stat.json`.

### Logo

Drop the file in `public/` and set `"logoFile": "logo.png"`. With no
`logoFile`, the `brandName` wordmark is shown instead (`""` for neither).

### Fonts

`font` can be `Outfit` (default), `Sora`, `Manrope`, `Montserrat`, `Inter`,
`SpaceGrotesk` or `Poppins`. The font files are bundled in `public/fonts`
(SIL Open Font License), so renders don't need network access.
