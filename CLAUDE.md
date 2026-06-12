# World Cup — Developer & Agent Guidelines

## Stack Overview

A modern, type-safe TypeScript React Vite project configured for solo developer and AI agent workflows. Emphasis on strict type-checking, code quality automation, and fast feedback loops.

### Core Tech

- **Framework**: React 18 with TypeScript
- **Build**: Vite 5 (ESM-first, fast dev server)
- **TypeScript**: Strict mode + `noUncheckedIndexedAccess` (catches unsafe index access)
- **Testing**: Vitest + React Testing Library + jsdom
- **Linting**: ESLint 9 (flat config) + TypeScript strict rules
- **Formatting**: Prettier (100 char line width)
- **Dead Code**: Knip (detects unused exports and dependencies)

## Commands

All quality checks bundled into a single command:

```bash
npm run check       # typecheck + lint + format:check + knip + test
npm run dev         # Start Vite dev server (http://localhost:5173)
npm run build       # Typecheck, then build for production
npm run test        # Run tests once (CI mode)
npm run test:watch  # Watch tests during development
npm run lint        # Run ESLint
npm run lint:fix    # Auto-fix linting errors
npm run format      # Auto-format code with Prettier
npm run format:check # Check formatting without modifying
npm run knip        # Report unused code
npm run typecheck   # Check TypeScript without emitting
npm run preview     # Preview production build locally
```

## File Conventions

### Source Structure

```
src/
  main.tsx          # React root + DOM mount
  App.tsx           # Top-level component
  App.test.tsx      # Co-located tests (one level deep)
  index.css         # Global styles
  components/       # Reusable components (optional)
  hooks/            # Custom React hooks (optional)
  utils/            # Utilities and helpers (optional)
  types/            # Shared type definitions (optional)
```

### Import Style

- Relative imports for sibling modules: `import { foo } from "./foo"`
- Absolute imports from `src/` are not configured; use relative imports
- External package imports at the top, then relative imports

### Component Files

- Functional components only (no class components)
- Explicit return type: `function Foo(): JSX.Element { ... }`
- Props interface as `FooProps`, co-located above the component
- One component per file (unless tightly coupled)

### Type Annotations

- Always explicit return types for functions
- Unused variables use `_` prefix: `const _unused = value`
- Index access guarded by TypeScript's `noUncheckedIndexedAccess`
- No `any` type (ESLint disallows it)

## Agent Rules

### Before Modifying Code

1. Run `npm run check` before and after changes to catch regressions
2. Prefer editing existing files over creating new ones
3. Delete unused code completely; avoid `// removed` comments or dead branches

### When Writing

- **No comments** unless the WHY is non-obvious (hidden constraint, workaround, surprising invariant)
- **Describe semantics with names**, not comments — `getUserById` is self-documenting
- **One line max** for explanatory comments; avoid docstrings
- **No backwards-compatibility hacks** — if something is unused, delete it

### Testing

- Test user behavior, not implementation
- Use `userEvent` for realistic interactions (not `fireEvent`)
- Jest/Vitest global matchers are available (test globals: true)
- Place tests as `Component.test.tsx` in the same directory

### Linting & Formatting

- All ESLint failures block merge; `npm run lint:fix` auto-fixes most
- Prettier is non-negotiable; `npm run format` before committing
- Type errors block build; fix them before pushing

### Dead Code Detection

- Knip runs in `npm run check`; fix unused exports immediately
- Remove unused files and dependencies
- Knip ignores test files; safe to keep test utilities

## Configuration Files

- **tsconfig.json**: Core TypeScript settings (strict mode, noUncheckedIndexedAccess)
- **eslint.config.js**: ESLint flat config with strict TS rules and React plugin
- **.prettierrc**: Prettier config (100 char line width, 2-space indent)
- **vitest.config.ts**: Vitest + jsdom + coverage settings
- **vite.config.ts**: Vite dev server & plugin setup
- **knip.config.ts**: Knip dead code detection (entry: src/main.tsx)

## Quick Start

1. `npm install` — Install all dependencies
2. `npm run dev` — Start dev server
3. Edit `src/App.tsx` and save; HMR updates the browser
4. `npm run check` — Run all quality checks before committing
5. `npm run test:watch` — Develop with tests running

## Debugging

- **Type errors**: Run `npm run typecheck` to see the full list
- **Unused code**: Run `npm run knip` to identify dead exports/dependencies
- **Lint errors**: Run `npm run lint` to see issues; `npm run lint:fix` auto-corrects most
- **Test failures**: Run `npm run test:watch` to iterate

## Notes for AI Agents

- **Assume strict TypeScript**: All files are `.ts` or `.tsx` with `strict: true`
- **No implicit `any`**: Every variable, parameter, and return type must be explicit
- **ESLint enforces it**: If something compiles but ESLint fails, fix it — both must pass
- **Tests are integration-focused**: Prefer shallow rendering and user interactions over unit mocking
- **Knip catches leftover code**: Don't leave unused exports; the check will fail
- **The `check` script is the gate**: If `npm run check` passes, the code is ready for production
