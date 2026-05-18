export interface PackageDescriptor {
  readonly packageName: string;
  readonly featureFlagId: string;
  readonly envPrefix: string;
  readonly summary: string;
}

export type SpellcraftAuthoringMode = "guided" | "advanced";

export interface SpellcraftAccessState {
  readonly academyEligible: boolean;
  readonly authoringMode: SpellcraftAuthoringMode;
  readonly declarationFormatVersion: string;
}

export const SPELLCRAFT_PACKAGE = "@plasius/spellcraft";
export const SPELLCRAFT_ENV_PREFIX = "SPELLCRAFT";
export const SPELLCRAFT_FEATURE_FLAG_ID = "isekai.spellcraft.enabled";

export const packageDescriptor: PackageDescriptor = Object.freeze({
  packageName: SPELLCRAFT_PACKAGE,
  featureFlagId: SPELLCRAFT_FEATURE_FLAG_ID,
  envPrefix: SPELLCRAFT_ENV_PREFIX,
  summary:
    "Academy-gated spellcraft access, authoring, and validation boundary contracts for Plasius.",
});

export function createSpellcraftAccessState(
  input: SpellcraftAccessState
): SpellcraftAccessState {
  return Object.freeze({ ...input });
}
