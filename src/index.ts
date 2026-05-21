export interface PackageDescriptor {
  readonly packageName: string;
  readonly featureFlagId: string;
  readonly envPrefix: string;
  readonly summary: string;
}

export type SpellcraftAuthoringMode = "guided" | "advanced";

export type SpellcraftAuthorityOwner = "spellcraft";

export type SpellcraftGuidanceSource =
  | "player-system"
  | "academy-advisor"
  | "academy-catalog";

export type SpellcraftHandoffReadiness =
  | "eligible"
  | "needs-academy-progress"
  | "blocked";

export interface SpellcraftAccessState {
  readonly academyEligible: boolean;
  readonly authoringMode: SpellcraftAuthoringMode;
  readonly declarationFormatVersion: string;
}

export interface SpellcraftAuthorityBoundary {
  readonly authorityOwner: SpellcraftAuthorityOwner;
  readonly featureFlagId: string;
  readonly entryGate: "academy-eligibility";
  readonly guidanceSources: readonly SpellcraftGuidanceSource[];
  readonly validationAuthority: SpellcraftAuthorityOwner;
  readonly executionAuthority: SpellcraftAuthorityOwner;
}

export interface SpellcraftGuidanceHandoff {
  readonly authorityOwner: SpellcraftAuthorityOwner;
  readonly featureFlagId: string;
  readonly guidanceSource: SpellcraftGuidanceSource;
  readonly academyTrack: string;
  readonly readiness: SpellcraftHandoffReadiness;
  readonly declarationFormatVersion: string;
  readonly requestedAuthoringMode: SpellcraftAuthoringMode;
  readonly handoffSummary: string;
}

export const SPELLCRAFT_PACKAGE = "@plasius/spellcraft";
export const SPELLCRAFT_ENV_PREFIX = "SPELLCRAFT";
export const SPELLCRAFT_FEATURE_FLAG_ID = "isekai.spellcraft.enabled";
const SPELLCRAFT_GUIDANCE_SOURCES = Object.freeze([
  "player-system",
  "academy-advisor",
  "academy-catalog",
] as const);

export const packageDescriptor: PackageDescriptor = Object.freeze({
  packageName: SPELLCRAFT_PACKAGE,
  featureFlagId: SPELLCRAFT_FEATURE_FLAG_ID,
  envPrefix: SPELLCRAFT_ENV_PREFIX,
  summary:
    "Academy-gated spellcraft access, authoring, and validation boundary contracts for Plasius.",
});

export const spellcraftAuthorityBoundary: SpellcraftAuthorityBoundary =
  Object.freeze({
    authorityOwner: "spellcraft",
    featureFlagId: SPELLCRAFT_FEATURE_FLAG_ID,
    entryGate: "academy-eligibility",
    guidanceSources: SPELLCRAFT_GUIDANCE_SOURCES,
    validationAuthority: "spellcraft",
    executionAuthority: "spellcraft",
  });

export function createSpellcraftAccessState(
  input: SpellcraftAccessState
): SpellcraftAccessState {
  return Object.freeze({ ...input });
}

export function createSpellcraftGuidanceHandoff(
  input: SpellcraftGuidanceHandoff
): SpellcraftGuidanceHandoff {
  return Object.freeze({ ...input });
}
