export interface PackageDescriptor {
  readonly packageName: string;
  readonly featureFlagId: string;
  readonly envPrefix: string;
  readonly summary: string;
}

export interface RolloutDescriptor {
  readonly featureFlagId: string;
  readonly envOverride: string;
  readonly rollbackPlan: string;
  readonly summary: string;
}

export type SpellcraftAuthoringMode = "guided" | "advanced";
export type SpellcraftFieldSensitivity = "pseudonymous" | "internal";
export type SpellcraftFieldRetention =
  | "authoritative-specialization"
  | "short-lived";

export interface SpellcraftAccessState {
  readonly academyEligible: boolean;
  readonly authoringMode: SpellcraftAuthoringMode;
  readonly declarationFormatVersion: string;
}

export interface SpellcraftSpecializationRecord {
  readonly casterSubjectId: string;
  readonly academyNodeId: string;
  readonly specializationId: string;
  readonly authoringMode: SpellcraftAuthoringMode;
  readonly declarationFormatVersion: string;
  readonly updatedAtIso: string;
}

export interface SpellcraftFieldPolicy {
  readonly field: keyof SpellcraftSpecializationRecord;
  readonly sensitivity: SpellcraftFieldSensitivity;
  readonly retention: SpellcraftFieldRetention;
  readonly justification: string;
}

export interface SpellcraftThroughputAssumptions {
  readonly maxConcurrentAuthoringSessions: number;
  readonly maxSpecializationDecisionsPerMinute: number;
  readonly maxDeclarationValidationsPerMinute: number;
}

export const SPELLCRAFT_PACKAGE = "@plasius/spellcraft";
export const SPELLCRAFT_ENV_PREFIX = "SPELLCRAFT";
export const SPELLCRAFT_FEATURE_FLAG_ID = "isekai.spellcraft.enabled";
export const SPELLCRAFT_PRIVACY_SCALE_FEATURE_FLAG_ID =
  "isekai.training-progression.privacy-scale.enabled";
export const SPELLCRAFT_PRIVACY_SCALE_ENV_OVERRIDE =
  "SPELLCRAFT_PRIVACY_SCALE_ENABLED";

export const packageDescriptor: PackageDescriptor = Object.freeze({
  packageName: SPELLCRAFT_PACKAGE,
  featureFlagId: SPELLCRAFT_FEATURE_FLAG_ID,
  envPrefix: SPELLCRAFT_ENV_PREFIX,
  summary:
    "Academy-gated spellcraft access, authoring, and validation boundary contracts for Plasius.",
});

export const spellcraftPrivacyScaleRollout: RolloutDescriptor = Object.freeze({
  featureFlagId: SPELLCRAFT_PRIVACY_SCALE_FEATURE_FLAG_ID,
  envOverride: SPELLCRAFT_PRIVACY_SCALE_ENV_OVERRIDE,
  rollbackPlan:
    "Disable the specialization privacy/throughput rollout to fall back to the existing spellcraft access contract surface.",
  summary:
    "Rolls out minimal specialization payloads and documented spellcraft throughput assumptions.",
});

export const spellcraftFieldPolicies = Object.freeze<
  readonly SpellcraftFieldPolicy[]
>([
  {
    field: "casterSubjectId",
    sensitivity: "pseudonymous",
    retention: "authoritative-specialization",
    justification:
      "Stable pseudonymous subject identifier is required to associate specialization choices without carrying profile names or contact data.",
  },
  {
    field: "academyNodeId",
    sensitivity: "internal",
    retention: "authoritative-specialization",
    justification:
      "Academy node identifier is the minimum authority boundary needed to evaluate gated spellcraft access.",
  },
  {
    field: "specializationId",
    sensitivity: "internal",
    retention: "authoritative-specialization",
    justification:
      "Opaque specialization identifier captures the chosen path without duplicating full declaration payloads.",
  },
  {
    field: "authoringMode",
    sensitivity: "internal",
    retention: "authoritative-specialization",
    justification:
      "Authoring mode determines which validation and guidance paths are allowed for the specialization state.",
  },
  {
    field: "declarationFormatVersion",
    sensitivity: "internal",
    retention: "authoritative-specialization",
    justification:
      "Declaration format version is the minimum compatibility marker required for spell definition validation.",
  },
  {
    field: "updatedAtIso",
    sensitivity: "internal",
    retention: "short-lived",
    justification:
      "Update timestamp supports bounded replay ordering for high-throughput specialization decisions.",
  },
]);

export const defaultSpellcraftThroughputAssumptions: SpellcraftThroughputAssumptions =
  Object.freeze({
    maxConcurrentAuthoringSessions: 1_500,
    maxSpecializationDecisionsPerMinute: 12_000,
    maxDeclarationValidationsPerMinute: 30_000,
  });

export function isSpellcraftAuthoringMode(
  value: string
): value is SpellcraftAuthoringMode {
  return value === "guided" || value === "advanced";
}

export function createSpellcraftAccessState(
  input: SpellcraftAccessState
): SpellcraftAccessState {
  return Object.freeze({ ...input });
}

function assertNonEmptyString(value: string, label: string): void {
  if (value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function assertPositiveSafeInteger(value: number, label: string): void {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive safe integer`);
  }
}

export function createSpellcraftSpecializationRecord(
  input: SpellcraftSpecializationRecord
): SpellcraftSpecializationRecord {
  assertNonEmptyString(input.casterSubjectId, "casterSubjectId");
  assertNonEmptyString(input.academyNodeId, "academyNodeId");
  assertNonEmptyString(input.specializationId, "specializationId");
  assertNonEmptyString(input.declarationFormatVersion, "declarationFormatVersion");
  assertNonEmptyString(input.updatedAtIso, "updatedAtIso");

  if (!isSpellcraftAuthoringMode(input.authoringMode)) {
    throw new Error("authoringMode must be a supported spellcraft authoring mode");
  }

  return Object.freeze({ ...input });
}

export function createSpellcraftThroughputAssumptions(
  input: SpellcraftThroughputAssumptions
): SpellcraftThroughputAssumptions {
  assertPositiveSafeInteger(
    input.maxConcurrentAuthoringSessions,
    "maxConcurrentAuthoringSessions"
  );
  assertPositiveSafeInteger(
    input.maxSpecializationDecisionsPerMinute,
    "maxSpecializationDecisionsPerMinute"
  );
  assertPositiveSafeInteger(
    input.maxDeclarationValidationsPerMinute,
    "maxDeclarationValidationsPerMinute"
  );

  return Object.freeze({ ...input });
}
