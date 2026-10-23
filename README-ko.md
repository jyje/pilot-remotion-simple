<div align="center">

# jyje/pilot-remotion-simple

<img width="120" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/react.png" alt="React" title="React"/>

🚀 영상 생성 API 없이 React 코드만으로 영상을 렌더링하는 Remotion 파일럿 프로젝트

[![GitHub Repo stars](https://img.shields.io/github/stars/jyje/pilot-remotion-simple?style=social)](https://github.com/jyje/pilot-remotion-simple)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-26-5FA04E?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-11.18.0-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)
[![Remotion](https://img.shields.io/badge/Remotion-4.0.538-0B84F3)](https://www.remotion.dev)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

[English](README.md) / [한국어](README-ko.md)

---

**도움이 되었다면 ⭐ 를 눌러주세요. 다른 분들이 찾는 데 도움이 됩니다.**

</div>

## 이 파일럿의 목표

코드와 코딩 에이전트만으로 짧은 영상을 만듭니다. Sora, Veo, Runway 같은 영상 생성 API는
쓰지 않습니다.

1. **영상을 React 컴포넌트로 표현합니다.** 모든 픽셀은 프레임 번호의 순수 함수예요.
2. **헤드리스로 렌더링합니다.** Remotion이 브라우저에서 프레임을 그리고 ffmpeg로 인코딩해요.
3. **반복 주기를 짧게 유지합니다.** 코드를 고치고, 정지 이미지 한 장이나 전체를 렌더링해 확인해요.

샘플은 5초짜리 타이틀 애니메이션이에요. 회전하는 그라데이션, 스프링으로 커지는 제목,
조금 늦게 나타나는 부제, 마지막 페이드아웃으로 구성돼요.

이 프로젝트가 아닌 것:

- 실사 수준의 생성형 영상. "비 오는 거리를 걷는 사람" 같은 장면은 API 또는 로컬 GPU에서
  돌리는 영상 생성 모델이 필요해요.
- 벤치마크나 운영용 파이프라인.

## 시작하기

요구 사항: Node.js 26, pnpm 11.18.0(`corepack enable`로 사용). `.nvmrc`가 Node 주 버전을 고정해요.

```sh
git clone https://github.com/jyje/pilot-remotion-simple.git
cd pilot-remotion-simple
nvm use            # Node 26
corepack pnpm install
```

```sh
corepack pnpm run dev        # Remotion Studio, 타임라인이 있는 실시간 미리보기
corepack pnpm run render     # out/hello.mp4 (1920x1080, 30 fps, 5초)
corepack pnpm run still      # out/hello.png, 60번째 프레임
corepack pnpm run typecheck  # tsc --noEmit
```

사용할 브라우저가 없으면 첫 렌더링 때 Remotion이 Chrome Headless Shell을 내려받아요.
설치된 Chrome을 쓰려면 경로를 지정해요.

```sh
corepack pnpm exec remotion render HelloVideo out/hello.mp4 \
  --browser-executable="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

pnpm 11은 의존성의 빌드 스크립트 실행을 승인하라고 요구해요. 이 저장소는 Remotion 번들러가
네이티브 바이너리를 쓰는 `esbuild`만 `pnpm-workspace.yaml`에서 허용해요.

## 프로젝트 구조

```text
pilot-remotion-simple/
├── package.json            # 스크립트, Node와 pnpm 버전 고정
├── pnpm-workspace.yaml     # 허용한 빌드 스크립트 (esbuild)
├── remotion.config.ts      # 렌더링 기본값
├── tsconfig.json
├── .nvmrc                  # Node 26
└── src/
    ├── index.ts            # registerRoot
    ├── Root.tsx            # Composition: id, 크기, fps, 길이, 기본 props
    └── HelloVideo.tsx      # 장면
```

## 핵심 개념

- **Composition.** `Root.tsx`가 `HelloVideo`를 1920x1080, 30 fps, 150프레임으로 등록해요.
  `title`, `subtitle` 같은 props는 타입이 있고 렌더링할 때 바꿀 수 있어요.
- **프레임 순수성.** `HelloVideo.tsx`는 `useCurrentFrame()`을 읽고 `interpolate`와 `spring`으로
  모든 값을 계산해요. 타이머나 상태가 없어서 어느 프레임이든 혼자 렌더링할 수 있고 결과가
  항상 같아요.
- **헤드리스 렌더링.** `remotion render`는 프로젝트를 번들하고 브라우저에서 열어 프레임을
  캡처한 뒤 ffmpeg로 H.264를 인코딩해요.

코드를 고치지 않고 문구만 바꾸려면:

```sh
corepack pnpm exec remotion render HelloVideo out/custom.mp4 \
  --props='{"title":"안녕하세요","subtitle":"같은 장면, 다른 문구"}'
```

## 검증

macOS(Apple silicon)에서 Node 26.10.0, pnpm 11.18.0, 설치된 Chrome으로 렌더링했어요.
결과는 `h264`, 1920x1080, 30 fps, 150프레임, 5.0초, 약 2.2 MB였고, 0.2초, 2.5초, 4.9초
프레임에서 페이드인, 완성된 제목, 페이드아웃을 확인했어요. `tsc --noEmit`도 통과해요.
다른 운영체제, Remotion Lambda, 오디오는 검증하지 않았어요.

## 참고 자료

- [Remotion 문서](https://www.remotion.dev/docs)
- [기본 개념](https://www.remotion.dev/docs/the-fundamentals)
- [`interpolate()`](https://www.remotion.dev/docs/interpolate), [`spring()`](https://www.remotion.dev/docs/spring)
- [Remotion 라이선스](https://www.remotion.dev/docs/license): 개인과 소규모 팀은 무료이고,
  정해진 규모를 넘는 회사는 라이선스가 필요해요. 상업적으로 쓰기 전에 확인해주세요.
