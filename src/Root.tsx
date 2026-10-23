import {Composition} from 'remotion';
import {HelloVideo, type HelloVideoProps} from './HelloVideo';

export const FPS = 30;
export const DURATION_IN_FRAMES = 150; // 5 seconds

const defaultProps: HelloVideoProps = {
  title: 'Hello, Remotion',
  subtitle: 'Rendered from React code, without a video generation API',
};

export const Root = () => (
  <Composition
    id="HelloVideo"
    component={HelloVideo}
    durationInFrames={DURATION_IN_FRAMES}
    fps={FPS}
    width={1920}
    height={1080}
    defaultProps={defaultProps}
  />
);
