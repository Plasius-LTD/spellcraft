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
- privacy-safe specialization payloads and spellcraft throughput assumptions
- specialization decision telemetry records
- performance budget metadata for decision evaluation paths

## Demo

```bash
npm run build
node demo/example.mjs
```

## Usage

```ts
import {
  createSpecializationDecisionTelemetryEvent,
  createSpellcraftAccessState,
  createSpellcraftPerformanceBudget,
  createSpellcraftSpecializationRecord,
  defaultSpellcraftThroughputAssumptions,
  spellcraftPrivacyScaleRollout,
} from "@plasius/spellcraft";

const access = createSpellcraftAccessState({
  academyEligible: true,
  authoringMode: "guided",
  declarationFormatVersion: "1.0.0",
});

const specialization = createSpellcraftSpecializationRecord({
  casterSubjectId: "caster-sub-1",
  academyNodeId: "academy-1",
  specializationId: "sigil-weaving",
  authoringMode: access.authoringMode,
  declarationFormatVersion: access.declarationFormatVersion,
  updatedAtIso: new Date().toISOString(),
});

const budget = createSpellcraftPerformanceBudget({
  stage: "declaration-validation",
  targetP95Ms: 75,
  hardTimeoutMs: 150,
  cacheable: false,
  maxDependencyCalls: 2,
});

const event = createSpecializationDecisionTelemetryEvent({
  decisionId: "decision-1",
  stage: "authoring-mode-selection",
  outcome: "allowed",
  durationMs: 32,
  academyEligible: access.academyEligible,
  authoringMode: access.authoringMode,
  declarationFormatVersion: access.declarationFormatVersion,
  observedAt: new Date().toISOString(),
});

console.log(spellcraftPrivacyScaleRollout.featureFlagId);
console.log(defaultSpellcraftThroughputAssumptions.maxDeclarationValidationsPerMinute);
console.log(specialization.specializationId, budget.targetP95Ms, event.stage);
```

## Privacy And Throughput Baseline

The package exports an inherited rollout descriptor for the cross-repo feature
flag `isekai.training-progression.privacy-scale.enabled`.

When that rollout is enabled, package consumers should prefer the minimal
`SpellcraftSpecializationRecord` contract:

- `casterSubjectId` is the only player-linked identifier and is expected to be
  pseudonymous
- profile names, chat text, raw spell declarations, and contact data are
  outside the package contract
- `spellcraftFieldPolicies` documents the retention and sensitivity expectation
  for every exported specialization field
- `defaultSpellcraftThroughputAssumptions` publishes the validated authoring,
  specialization, and declaration-validation envelope used by the package docs
  and tests

## Governance

- ADRs: [docs/adrs](./docs/adrs)
- TDRs: [docs/tdrs](./docs/tdrs)
- Design notes: [docs/design](./docs/design)
