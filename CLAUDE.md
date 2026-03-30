# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start webpack dev server (http://localhost:3000)
npm run build    # Production build to /dist
npm run watch    # TypeScript watch mode (type-checking only)
```

There are no tests in this project.

## Architecture

TickStack is a React + TypeScript workout timer app. The two core source files are:

**[src/timers.ts](src/timers.ts)** — Timer DSL engine. Defines the composable building blocks:
- `Timer` — low-level `setInterval` wrapper with pause/resume
- `Counter` — countdown or stopwatch with text templates (e.g. `"Rest for {{remains}} seconds"`) and speech synthesis cues
- `Phrase` — speaks a string via Web Speech API
- `Sound` — plays an audio file via HTML5 Audio
- `Timeline` — sequential container that runs elements one by one, manages Screen Wake Lock

State emitted by these elements is typed as `TimerState` (union of `CountdownState`, `StopwatchState`, `SpeechState`, `SoundState`).

**[src/timelines.ts](src/timelines.ts)** — Workout definitions. Composes `Counter`, `Phrase`, `Sound`, and `Timeline` instances into named workout routines (daily workouts Mon–Sat, stretching sessions, meditation). Exports a `timelines` array consumed by the app entry point.

**[src/components/App/index.tsx](src/components/App/index.tsx)** — Renders timeline selector buttons, runs the selected timeline, handles keyboard controls (Space = skip, Enter = pause/resume), and renders the `Timer` display component.

**[src/components/Timer/index.tsx](src/components/Timer/index.tsx)** — SVG circular progress ring that visualizes `TimerState`.

## DSL Design (in progress)

The current branch is building a DSL for timer definition and composition. The intended syntax is sketched in [timers.dsl](timers.dsl):

```
count up :to 60s
count down :from 60s
count up :to 60s, count down :from 60s   # sequential
```

Currently the DSL is implemented as TypeScript classes in `src/timers.ts` rather than a parsed language. The branch goal is to formalize/extend this.

## Tech Stack

- React 19, TypeScript 5, Webpack 5
- No CSS framework — vanilla CSS with dark theme and glassmorphism
- Browser APIs: Web Speech API, HTML5 Audio, Screen Wake Lock API
