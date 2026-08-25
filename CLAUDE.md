# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Arcade Vault is intended to be an online game platform where players compete for the highest scores. The project follows the Spec Driven Design workflow described in `README.md`, using `/spec` and `/spec-impl` when those project areas are available.

## Commands

Run from the repository root:

```bash
npm install           # install the package-lock dependencies
npm run dev           # start the development server
npm run lint          # run ESLint
npx tsc --noEmit      # type-check without emitting files
npm run build         # create a production build
npm start             # serve the production build
```

There is currently no test framework or `test` script configured. Do not assume a single-test command exists; add the project’s chosen test tooling and script before documenting one.

## Architecture

- This is a Next.js 16 App Router application. Folders under `app/` define route segments; a `page.tsx` makes a segment public and `layout.tsx` supplies shared UI.
- `app/layout.tsx` is the required root layout. It sets document metadata, loads Geist fonts, imports global styles, and wraps all route content.
- `app/page.tsx` is the current `/` route and is still the create-next-app starter screen. New game/platform UI will grow from this route and additional `app/**/page.tsx` segments.
- Components are Server Components by default. Keep interactive state, event handlers, effects, and browser APIs in narrowly scoped files marked with `"use client"`; pass serializable props across the boundary.
- `app/globals.css` imports Tailwind CSS v4, defines the shared color/font theme variables, and sets global body styles. `postcss.config.mjs` enables Tailwind’s PostCSS plugin.
- `public/` contains static assets served from the site root. Root configuration files define Next.js, TypeScript, ESLint, and dependency behavior; the `@/*` TypeScript path alias resolves from the repository root.

Before changing Next.js-specific code, follow the version-specific guidance in `node_modules/next/dist/docs/` as required by `AGENTS.md`.
