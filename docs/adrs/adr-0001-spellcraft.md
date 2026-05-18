# ADR-0001: Spellcraft Package Boundary

## Status

Accepted

## Context

Spellcraft authoring needs a package boundary that stays authoritative and academy-gated instead of being absorbed into Player System guidance.

## Decision

`@plasius/spellcraft` will own spellcraft access and authoring-boundary contracts while the Player System remains a guided entry layer.

## Consequences

- Spell authoring authority stays explicit.
- Academy-gated access can be represented independently of UI.
- Future declaration-format work has a package home.
