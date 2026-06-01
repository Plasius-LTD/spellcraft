# Spellcraft Privacy And Throughput Baseline

## Goal

Define the minimal specialization payload and validated throughput assumptions
exported by `@plasius/spellcraft`.

## Contract Additions

- `SpellcraftSpecializationRecord` exposes only the pseudonymous caster
  subject, academy node identifier, specialization identifier, authoring mode,
  declaration format version, and update timestamp.
- `spellcraftFieldPolicies` documents the sensitivity, retention, and
  justification for every specialization field.
- `spellcraftPrivacyScaleRollout` publishes the inherited
  `isekai.training-progression.privacy-scale.enabled` control and local env
  override.
- `defaultSpellcraftThroughputAssumptions` and
  `createSpellcraftThroughputAssumptions` document and validate the expected
  envelope for authoring sessions, specialization decisions, and declaration
  validation throughput.

## Exclusions

- profile names, contact data, and raw chat or moderation payloads
- full spell declaration bodies beyond the exported format version marker
- academy UI or gameplay presentation logic
