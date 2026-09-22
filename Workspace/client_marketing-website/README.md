# AI Travel Manager — Marketing Website

A marketing site for the AI Travel Manager, built with **React + Vite + TypeScript + Tailwind CSS**.

## Tech Stack

- [React 18](https://react.dev/) — UI framework
- [Vite 5](https://vitejs.dev/) — build tool & dev server
- [TypeScript 5](https://www.typescriptlang.org/) — type safety
- [Tailwind CSS 3](https://tailwindcss.com/) — utility-first styling
- [React Router 6](https://reactrouter.com/) — client-side routing
- [react-helmet-async](https://github.com/staylor/react-helmet-async) — per-page `<title>` & meta tags
- [ESLint 9](https://eslint.org/) — linting (flat config)
- [Prettier 3](https://prettier.io/) — code formatting

---

## Getting Started

### Install dependencies

```bash
npm install
```

### Start the dev server

```bash
npm run dev
```

Opens at **http://localhost:3000**

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local dev server on port 3000 |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across all source files |
| `npm run lint:fix` | Run ESLint and auto-fix issues |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without writing (CI-safe) |
| `npm run type-check` | Run TypeScript compiler check (`tsc --noEmit`) |

---

## Brand Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#0A74DA` | Deep sky blue — buttons, links, highlights |
| `accent` | `#F5A623` | Warm orange — CTAs, badges |
| Font | Inter | Headings (bold), body (regular) |

Use via Tailwind: `bg-primary`, `text-accent`, etc.

---

## Deployment

Build the static assets and deploy the `dist/` folder to any static host:

```bash
npm run build
```
