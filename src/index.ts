export interface PackageDescriptor {
  readonly packageName: string;
  readonly featureFlagId: string;
  readonly envPrefix: string;
  readonly summary: string;
}

export type SpellcraftAuthoringMode = "guided" | "advanced";

export type SpecializationDecisionStage =
  | "academy-eligibility"
  | "declaration-validation"
  | "authoring-mode-selection";

export type SpecializationDecisionOutcome = "allowed" | "deferred" | "rejected";

export type SpecializationFailureCategory =
  | "timeout"
  | "validation"
  | "upstream"
  | "policy";

export interface SpellcraftAccessState {
  readonly academyEligible: boolean;
  readonly authoringMode: SpellcraftAuthoringMode;
  readonly declarationFormatVersion: string;
}

export interface SpecializationDecisionTelemetryEvent {
  readonly decisionId: string;
  readonly stage: SpecializationDecisionStage;
  readonly outcome: SpecializationDecisionOutcome;
  readonly durationMs: number;
  readonly academyEligible: boolean;
  readonly authoringMode: SpellcraftAuthoringMode;
  readonly declarationFormatVersion: string;
  readonly observedAt: string;
  readonly failureCategory?: SpecializationFailureCategory;
}

export interface SpellcraftPerformanceBudget {
  readonly stage: SpecializationDecisionStage;
  readonly targetP95Ms: number;
  readonly hardTimeoutMs: number;
  readonly cacheable: boolean;
  readonly maxDependencyCalls: number;
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

function freezeReadonlyRecord<T extends object>(value: T): T {
  return Object.freeze({ ...value });
}

export function createSpellcraftAccessState(
  input: SpellcraftAccessState
): SpellcraftAccessState {
  return Object.freeze({ ...input });
}

export function createSpecializationDecisionTelemetryEvent(
  input: SpecializationDecisionTelemetryEvent
): SpecializationDecisionTelemetryEvent {
  return freezeReadonlyRecord(input);
}

export function createSpellcraftPerformanceBudget(
  input: SpellcraftPerformanceBudget
): SpellcraftPerformanceBudget {
  return freezeReadonlyRecord(input);
}
