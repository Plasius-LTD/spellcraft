# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

### Changed
- Refresh compatible npm dependencies from the registry for the weekly dependency maintenance wave.


- **Added**
  - (placeholder)

- **Changed**
  - Bound npm publication to the exact prepared `main` commit after successful push-triggered CI.
  - (placeholder)

- **Fixed**
  - Moved reviewed CI to explicit GitHub-hosted runners with package-manager caching disabled and added exact-branch manual validation.
  - (placeholder)

- **Security**
  - Removed the npm write-token path, added a fail-closed npm 11.5.1-or-newer OIDC guard, and denied fork PR code access to self-hosted CI.
  - Pinned patched transitive npm dependencies to clear the current audit baseline.
  - (placeholder)

## [0.1.5] - 2026-08-01

- **Added**
  - (placeholder)

- **Changed**
  - (placeholder)

- **Fixed**
  - Reject malformed access-state, telemetry, performance-budget, and guidance-handoff payloads before freezing spellcraft contracts.

- **Security**
  - Added fail-closed source and npm-package admission for the administrative contributor registry and pinned the CI/CD runtime to Node.js 24.18.0 LTS.
  - (placeholder)

## [0.1.4] - 2026-06-22

- **Added**
  - (placeholder)

- **Changed**
  - (placeholder)

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [0.1.3] - 2026-06-22
- bootstrap `@plasius/spellcraft` from the schema package baseline with package governance, docs, tests, and demo scaffolding
- add explicit Player System to spellcraft authority-handoff contracts and boundary documentation
- add privacy-safe specialization contracts, rollout metadata for `isekai.training-progression.privacy-scale.enabled`, and validated spellcraft throughput assumptions
- add specialization-decision telemetry and performance-budget contracts for spellcraft authority paths


[0.1.3]: https://github.com/Plasius-LTD/spellcraft/releases/tag/v0.1.3
[0.1.4]: https://github.com/Plasius-LTD/spellcraft/releases/tag/v0.1.4
[0.1.5]: https://github.com/Plasius-LTD/spellcraft/releases/tag/v0.1.5
