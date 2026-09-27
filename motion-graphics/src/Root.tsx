import { Composition, Folder } from "remotion";
import {
  calculateStatRevealAlphaMetadata,
  calculateStatRevealMetadata,
  StatReveal,
  statRevealDefaults,
  statRevealSchema,
} from "./StatReveal";

// durationInFrames / fps below are placeholders: calculateMetadata derives the
// real values from the `fps` and `durationInSeconds` props.
const shared = {
  component: StatReveal,
  schema: statRevealSchema,
  durationInFrames: 180,
  fps: 30,
} as const;

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="StatReveal">
      <Composition
        {...shared}
        id="StatReveal-Vertical"
        width={1080}
        height={1920}
        defaultProps={statRevealDefaults}
        calculateMetadata={calculateStatRevealMetadata}
      />
      <Composition
        {...shared}
        id="StatReveal-Horizontal"
        width={1920}
        height={1080}
        defaultProps={statRevealDefaults}
        calculateMetadata={calculateStatRevealMetadata}
      />
      <Composition
        {...shared}
        id="StatReveal-Vertical-Alpha"
        width={1080}
        height={1920}
        defaultProps={{ ...statRevealDefaults, transparentBackground: true }}
        calculateMetadata={calculateStatRevealAlphaMetadata}
      />
      <Composition
        {...shared}
        id="StatReveal-Horizontal-Alpha"
        width={1920}
        height={1080}
        defaultProps={{ ...statRevealDefaults, transparentBackground: true }}
        calculateMetadata={calculateStatRevealAlphaMetadata}
      />
    </Folder>
  );
};
