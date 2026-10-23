import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export type HelloVideoProps = {
  title: string;
  subtitle: string;
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const HelloVideo = ({title, subtitle}: HelloVideoProps) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  // Every value below is a pure function of the frame number, so any frame can be rendered alone.
  const angle = interpolate(frame, [0, durationInFrames], [120, 240]);
  const pop = spring({frame, fps, config: {damping: 12, stiffness: 120}});
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], clamp);
  const subtitleOpacity = interpolate(frame, [30, 55], [0, 1], clamp);
  const subtitleShift = interpolate(frame, [30, 55], [24, 0], clamp);
  const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, #0f172a 0%, #1d4ed8 55%, #06b6d4 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Apple SD Gothic Neo", sans-serif',
        opacity: fadeOut,
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: 160,
          fontWeight: 800,
          letterSpacing: -4,
          color: 'white',
          opacity: titleOpacity,
          transform: `scale(${0.8 + 0.2 * pop})`,
        }}
      >
        {title}
      </h1>
      <p
        style={{
          margin: '32px 0 0',
          fontSize: 48,
          color: 'rgba(255, 255, 255, 0.85)',
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleShift}px)`,
        }}
      >
        {subtitle}
      </p>
    </AbsoluteFill>
  );
};
