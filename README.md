# @plasius/spellcraft

[![npm version](https://img.shields.io/npm/v/@plasius/spellcraft.svg)](https://www.npmjs.com/package/@plasius/spellcraft)
[![Build Status](https://img.shields.io/github/actions/workflow/status/Plasius-LTD/spellcraft/ci.yml?branch=main&label=build&style=flat)](https://github.com/Plasius-LTD/spellcraft/actions/workflows/ci.yml)
[![coverage](https://img.shields.io/codecov/c/github/Plasius-LTD/spellcraft)](https://codecov.io/gh/Plasius-LTD/spellcraft)
[![License](https://img.shields.io/github/license/Plasius-LTD/spellcraft)](./LICENSE)
[![Code of Conduct](https://img.shields.io/badge/code%20of%20conduct-yes-blue.svg)](./CODE_OF_CONDUCT.md)
[![Security Policy](https://img.shields.io/badge/security%20policy-yes-orange.svg)](./SECURITY.md)
[![Changelog](https://img.shields.io/badge/changelog-md-blue.svg)](./CHANGELOG.md)

Academy-gated spellcraft access, authoring, and validation boundary contracts for Plasius.

Apache-2.0. ESM + CJS builds. TypeScript types included.

## Installation

```bash
npm install @plasius/spellcraft
```

## Scope

`@plasius/spellcraft` owns the authority-side boundary for:

- spellcraft access state
- academy-gated authoring readiness
- declaration preview metadata

## Demo

```bash
npm run build
node demo/example.mjs
```

## Usage

```ts
import { createSpellcraftAccessState } from "@plasius/spellcraft";

const access = createSpellcraftAccessState({
  academyEligible: true,
  authoringMode: "guided",
  declarationFormatVersion: "1.0.0",
});

console.log(access.authoringMode);
```

## Governance

- ADRs: [docs/adrs](./docs/adrs)
- TDRs: [docs/tdrs](./docs/tdrs)
- Design notes: [docs/design](./docs/design)
