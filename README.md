# [Conway's Game of Life](https://game-of-life.fanglin.me/)

[![Build and Deploy](https://github.com/fang-lin/game-of-life/actions/workflows/build-and-deploy.yml/badge.svg?branch=master)](https://github.com/fang-lin/game-of-life/actions/workflows/build-and-deploy.yml)

An interactive implementation of [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) built with React and TypeScript.

## Features

- Pan and zoom the infinite grid
- Draw cells by clicking, or pick from 25+ built-in patterns (still lifes, oscillators, spaceships, methuselahs, glider guns)
- Rotate patterns with arrow keys
- Adjustable simulation speed (6 levels)
- Toggle grid style (Dark / Blank / None) and dead cell visualization
- Share any state via URL
- Touch support for mobile devices

## Tech Stack

- **React 18** with function components and hooks
- **TypeScript 5** with strict mode
- **Vite** for development and production builds
- **Vitest** for unit testing (86 tests)
- **styled-components** for CSS-in-JS
- **Canvas 2D** API for rendering
- **Vercel** for deployment with preview environments

## Architecture

```
src/
  App.tsx                  # Main component: state, events, routing
  App.functions.ts         # URL param parsing, coordinate math, constants
  Canvas/
    Canvas.tsx             # Type definitions (Coordinate, Size)
    Canvas.functions.tsx   # Canvas 2D drawing (grid, cells, wipe)
    Canvas.styles.tsx      # Styled canvas element
    LifeMap.ts             # Game of Life engine (neighbor counting, O(8N))
    HashLife.ts            # HashLife algorithm (quadtree, for future superstep)
  Panels/                  # Control panel and pattern picker
  Patterns/                # 25+ pattern definitions (JSON)
  Theme.ts                 # Color constants
```

### Evolution Algorithm

The simulation uses a **neighbor counting** algorithm:

1. For each alive cell, increment a counter for all 8 neighbors (8N operations)
2. Cells with count = 3 are born; alive cells with count = 2 survive
3. Total complexity: **O(8N)** per generation, where N = alive cell count

A [HashLife](https://en.wikipedia.org/wiki/Hashlife) implementation (quadtree with memoized step) is included for future superstep/time-jump features.

## Development

```bash
npm install
npm start         # dev server on localhost:3000
npm test          # run 86 unit tests
npm run lint      # ESLint
npm run build     # production build to build/
```

Requires Node.js >= 22 and npm >= 10.

## CI/CD

GitHub Actions pipeline on every push to `master`:

1. **lint-and-test** — ESLint + Vitest
2. **deploy-preview** — Vercel preview (PRs only)
3. **deploy-production** — Vercel production
4. **release** — semantic-release with conventional commits

## License

MIT
