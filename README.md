<div align="center">

# jyje/pilot-remotion-simple

<img width="120" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/react.png" alt="React" title="React"/>

🚀 Pilot project for rendering video from React code with Remotion, without a video generation API

[![GitHub Repo stars](https://img.shields.io/github/stars/jyje/pilot-remotion-simple?style=social)](https://github.com/jyje/pilot-remotion-simple)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-26-5FA04E?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-11.18.0-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)
[![Remotion](https://img.shields.io/badge/Remotion-4.0.538-0B84F3)](https://www.remotion.dev)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

[English](README.md) / [한국어](README-ko.md)

---

**Found this useful? Please give it a ⭐. It helps others find it.**

</div>

## A goal of this pilot

Make a short video with nothing but code and a coding agent. No Sora, Veo or Runway,
and no other video generation API.

1. **Describe a video as a React component.** Every pixel is a pure function of the frame number.
2. **Render it headlessly.** Remotion draws each frame in a browser and encodes the frames with ffmpeg.
3. **Keep the loop short.** Edit the code, render one still or the whole clip, look, repeat.

The sample is a 5 second title animation: a rotating gradient, a spring pop for the title,
a delayed subtitle and a fade out.

What it is not:

- Photorealistic generative video. A scene such as "a person walking in the rain" needs a
  generation model, either through an API or run locally on a GPU.
- A benchmark or production pipeline.

## Getting started

Requirements: Node.js 26 and pnpm 11.18.0 (through `corepack enable`). An `.nvmrc` pins the Node major.

```sh
git clone https://github.com/jyje/pilot-remotion-simple.git
cd pilot-remotion-simple
nvm use            # Node 26
corepack pnpm install
```

```sh
corepack pnpm run dev        # Remotion Studio, a live preview with a timeline
corepack pnpm run render     # out/hello.mp4 (1920x1080, 30 fps, 5 s)
corepack pnpm run still      # out/hello.png, frame 60
corepack pnpm run typecheck  # tsc --noEmit
```

If no browser is available, Remotion downloads Chrome Headless Shell on the first render.
To use an installed Chrome instead, pass its path:

```sh
corepack pnpm exec remotion render HelloVideo out/hello.mp4 \
  --browser-executable="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

pnpm 11 asks you to approve dependency build scripts. This repo allows only `esbuild`
in `pnpm-workspace.yaml`, because the Remotion bundler uses its native binary.

## Project structure

```text
pilot-remotion-simple/
├── package.json            # scripts, Node and pnpm pins
├── pnpm-workspace.yaml     # allowed build scripts (esbuild)
├── remotion.config.ts      # render defaults
├── tsconfig.json
├── .nvmrc                  # Node 26
└── src/
    ├── index.ts            # registerRoot
    ├── Root.tsx            # Composition: id, size, fps, duration, default props
    └── HelloVideo.tsx      # the scene
```

## Key concepts

- **Composition.** `Root.tsx` registers `HelloVideo` as 1920x1080 at 30 fps for 150 frames.
  Props such as `title` and `subtitle` are typed and can be overridden at render time.
- **Frame purity.** `HelloVideo.tsx` reads `useCurrentFrame()` and derives everything with
  `interpolate` and `spring`. There is no timer or state, so any frame can be rendered alone
  and renders are repeatable.
- **Headless render.** `remotion render` bundles the project, opens it in a browser, captures
  each frame and encodes H.264 with ffmpeg.

Override the text without editing code:

```sh
corepack pnpm exec remotion render HelloVideo out/custom.mp4 \
  --props='{"title":"Hi there","subtitle":"Same scene, new words"}'
```

## Verification

Rendered with Node 26.10.0 and pnpm 11.18.0 on macOS (Apple silicon) using an installed
Chrome. The output was `h264`, 1920x1080, 30 fps, 150 frames, 5.0 s, about 2.2 MB, and
frames at 0.2 s, 2.5 s and 4.9 s showed the fade in, the finished title and the fade out.
`tsc --noEmit` passes. Other operating systems, Remotion Lambda and audio are untested.

## References

- [Remotion documentation](https://www.remotion.dev/docs)
- [The fundamentals](https://www.remotion.dev/docs/the-fundamentals)
- [`interpolate()`](https://www.remotion.dev/docs/interpolate) and [`spring()`](https://www.remotion.dev/docs/spring)
- [Remotion license](https://www.remotion.dev/docs/license): free for individuals and small teams,
  with a company license required above its stated size. Check it before commercial use.
