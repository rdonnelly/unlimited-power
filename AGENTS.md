# Unlimited Power

React Native (Expo SDK 57, new architecture) app for the Star Wars Unlimited card game: a searchable/filterable card list backed by the `admin.starwarsunlimited.com` API.

## Commands

```bash
npm run dev          # start Expo dev client (requires a pre-built dev client)
npm run check:ts     # typecheck (tsc)
npm run check:lint   # eslint
```

Package manager is **npm**. Node version is pinned in [.nvmrc](.nvmrc).

## Path aliases (required)

Import via aliases, not relative paths — e.g. `@data/Card`, `@hooks/useTheme`. Aliases are declared in **both** [tsconfig.json](tsconfig.json) and [babel.config.js](babel.config.js); keep them in sync.

## Detailed docs

- [Architecture & core libraries](docs/architecture.md) — data layer, UI stack, app-lifecycle wiring
- [Conventions](docs/conventions.md) — theme system, component and data patterns
- [Workflow](docs/workflow.md) — building, submitting, and maintaining patches
- [Common tasks](docs/common-tasks.md) — recipes for adding filters, screens, and theme colors
