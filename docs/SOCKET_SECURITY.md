# Socket Security Triage — NestCalc

This document records triage for Socket for GitHub alerts on PR #1 and the
project's dependency hygiene posture.

## Scope

NestCalc is a **local-first client-only PWA**. Runtime dependencies are minimal
(`next`, `react`, `react-dom`, `serwist`). ESLint and Serwist build tooling are
**dev-only** and never ship to the shop-floor install.

## npm install script allowlist

`package.json` `allowScripts` pins reviewed install scripts for toolchain
packages required by Next.js 16 and Serwist:

| Package | Purpose | Triage |
|---------|---------|--------|
| `@swc/core@1.15.32` | Next.js compiler native binary | Required; official Next.js toolchain |
| `esbuild@0.28.1` | Serwist service worker bundling | Required; official Serwist devDep |
| `sharp@0.34.5` | Next.js image optimization native module | Required; official Next.js optional native dep |
| `unrs-resolver@1.12.2` | ESLint import resolver native helper | Dev-only; standard eslint-config-next tree |

## PostCSS advisory (npm audit)

`package.json` `overrides.postcss` pins `^8.5.10` to remediate
[GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93) in
Next's nested PostCSS copy. NestCalc does not stringify untrusted CSS at
runtime; override is defense-in-depth for the build toolchain.

## Socket "Obfuscated code" alerts (transitive dev deps)

Socket flagged four **transitive dev dependencies** from the standard Next.js +
ESLint scaffold. Each was reviewed as **acceptable risk**:

| Package | Chain | Assessment |
|---------|-------|------------|
| `@emnapi/runtime@1.11.1` | `eslint-config-next` → `next` → `@tailwindcss/postcss` | Official Tailwind/Node-API bridge; minified output triggers obfuscation heuristic |
| `damerau-levenshtein@1.0.8` | `eslint-config-next` | Mature string-distance util used by ESLint import rules; dev-only |
| `es-abstract@1.24.2` | `eslint-config-next` | Standard ESLint polyfill/spec package; dev-only |
| `eslint-plugin-react@7.37.5` | `eslint-config-next` | Official React ESLint plugin bundled with Next.js template; dev-only |

These packages cannot be removed without dropping `eslint-config-next` (losing
Next.js lint alignment) or Tailwind PostCSS integration. None execute in the
installed PWA runtime.

PR triage comments:

```text
@SocketSecurity ignore npm/@emnapi/runtime@1.11.1
@SocketSecurity ignore npm/damerau-levenshtein@1.0.8
@SocketSecurity ignore npm/es-abstract@1.24.2
@SocketSecurity ignore npm/eslint-plugin-react@7.37.5
```

Re-review when upgrading `next`, `eslint-config-next`, or `@tailwindcss/postcss`
major versions.