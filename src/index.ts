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
const SPELLCRAFT_GUIDANCE_SOURCES = Object.freeze([
  "player-system",
  "academy-advisor",
  "academy-catalog",
] as const);
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

function freezeReadonlyRecord<T extends object>(value: T): T {
  return Object.freeze({ ...value });
}

export const spellcraftAuthorityBoundary: SpellcraftAuthorityBoundary =
  Object.freeze({
    authorityOwner: "spellcraft",
    featureFlagId: SPELLCRAFT_FEATURE_FLAG_ID,
    entryGate: "academy-eligibility",
    guidanceSources: SPELLCRAFT_GUIDANCE_SOURCES,
    validationAuthority: "spellcraft",
    executionAuthority: "spellcraft",
  });

export const spellcraftPrivacyScaleRollout: RolloutDescriptor = Object.freeze({
  featureFlagId: SPELLCRAFT_PRIVACY_SCALE_FEATURE_FLAG_ID,
  envOverride: SPELLCRAFT_PRIVACY_SCALE_ENV_OVERRIDE,
  rollbackPlan:
    "Disable the specialization privacy/throughput rollout to fall back to the existing spellcraft access contract surface.",
  summary:
    "Rolls out minimal specialization payloads and documented spellcraft throughput assumptions.",
});

const rawSpellcraftFieldPolicies: readonly SpellcraftFieldPolicy[] = [
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
];

export const spellcraftFieldPolicies: readonly SpellcraftFieldPolicy[] =
  Object.freeze(rawSpellcraftFieldPolicies.map(freezeReadonlyRecord));

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

function isSpecializationDecisionStage(
  value: string
): value is SpecializationDecisionStage {
  return (
    value === "academy-eligibility"
    || value === "declaration-validation"
    || value === "authoring-mode-selection"
  );
}

function isSpecializationDecisionOutcome(
  value: string
): value is SpecializationDecisionOutcome {
  return value === "allowed" || value === "deferred" || value === "rejected";
}

function isSpecializationFailureCategory(
  value: string
): value is SpecializationFailureCategory {
  return (
    value === "timeout"
    || value === "validation"
    || value === "upstream"
    || value === "policy"
  );
}

function isSpellcraftGuidanceSource(
  value: string
): value is SpellcraftGuidanceSource {
  return (SPELLCRAFT_GUIDANCE_SOURCES as readonly string[]).includes(value);
}

function isSpellcraftHandoffReadiness(
  value: string
): value is SpellcraftHandoffReadiness {
  return value === "eligible" || value === "needs-academy-progress" || value === "blocked";
}

export function createSpellcraftAccessState(
  input: SpellcraftAccessState
): SpellcraftAccessState {
  assertNonEmptyString(
    input.declarationFormatVersion,
    "declarationFormatVersion"
  );

  if (!isSpellcraftAuthoringMode(input.authoringMode)) {
    throw new Error(
      "authoringMode must be a supported spellcraft authoring mode"
    );
  }

  return freezeReadonlyRecord(input);
}

export function createSpecializationDecisionTelemetryEvent(
  input: SpecializationDecisionTelemetryEvent
): SpecializationDecisionTelemetryEvent {
  assertNonEmptyString(input.decisionId, "decisionId");
  assertNonEmptyString(
    input.declarationFormatVersion,
    "declarationFormatVersion"
  );
  assertNonEmptyString(input.observedAt, "observedAt");
  assertValidIsoTimestamp(input.observedAt, "observedAt");
  assertNonNegativeSafeInteger(input.durationMs, "durationMs");

  if (!isSpecializationDecisionStage(input.stage)) {
    throw new Error("stage must be a supported specialization decision stage");
  }

  if (!isSpecializationDecisionOutcome(input.outcome)) {
    throw new Error("outcome must be a supported specialization decision outcome");
  }

  if (!isSpellcraftAuthoringMode(input.authoringMode)) {
    throw new Error(
      "authoringMode must be a supported spellcraft authoring mode"
    );
  }

  if (
    input.failureCategory !== undefined
    && !isSpecializationFailureCategory(input.failureCategory)
  ) {
    throw new Error(
      "failureCategory must be a supported specialization failure category"
    );
  }

  return freezeReadonlyRecord(input);
}

export function createSpellcraftPerformanceBudget(
  input: SpellcraftPerformanceBudget
): SpellcraftPerformanceBudget {
  assertPositiveSafeInteger(input.targetP95Ms, "targetP95Ms");
  assertPositiveSafeInteger(input.hardTimeoutMs, "hardTimeoutMs");
  assertNonNegativeSafeInteger(input.maxDependencyCalls, "maxDependencyCalls");

  if (!isSpecializationDecisionStage(input.stage)) {
    throw new Error("stage must be a supported specialization decision stage");
  }

  if (input.hardTimeoutMs < input.targetP95Ms) {
    throw new Error("hardTimeoutMs must be greater than or equal to targetP95Ms");
  }

  return freezeReadonlyRecord(input);
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

function assertNonNegativeSafeInteger(value: number, label: string): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${label} must be a non-negative safe integer`);
  }
}

const iso8601DateRegex =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/;

function getDaysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function assertValidIsoTimestamp(value: string, label: string): void {
  const match = iso8601DateRegex.exec(value);
  if (!match || Number.isNaN(Date.parse(value))) {
    throw new Error(`${label} must be an ISO-8601 timestamp`);
  }

  const [, yearRaw, monthRaw, dayRaw, hourRaw, minuteRaw, secondRaw] = match;
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  const second = Number(secondRaw);

  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > getDaysInMonth(year, month) ||
    hour > 23 ||
    minute > 59 ||
    second > 59
  ) {
    throw new Error(`${label} must be an ISO-8601 timestamp`);
  }
}

export function createSpellcraftSpecializationRecord(
  input: SpellcraftSpecializationRecord
): SpellcraftSpecializationRecord {
  assertNonEmptyString(input.casterSubjectId, "casterSubjectId");
  assertNonEmptyString(input.academyNodeId, "academyNodeId");
  assertNonEmptyString(input.specializationId, "specializationId");
  assertNonEmptyString(
    input.declarationFormatVersion,
    "declarationFormatVersion"
  );
  assertNonEmptyString(input.updatedAtIso, "updatedAtIso");
  assertValidIsoTimestamp(input.updatedAtIso, "updatedAtIso");

  if (!isSpellcraftAuthoringMode(input.authoringMode)) {
    throw new Error(
      "authoringMode must be a supported spellcraft authoring mode"
    );
  }

  return freezeReadonlyRecord(input);
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

  return freezeReadonlyRecord(input);
}

export function createSpellcraftGuidanceHandoff(
  input: SpellcraftGuidanceHandoff
): SpellcraftGuidanceHandoff {
  assertNonEmptyString(input.featureFlagId, "featureFlagId");
  assertNonEmptyString(input.academyTrack, "academyTrack");
  assertNonEmptyString(
    input.declarationFormatVersion,
    "declarationFormatVersion"
  );
  assertNonEmptyString(input.handoffSummary, "handoffSummary");

  if (input.authorityOwner !== "spellcraft") {
    throw new Error("authorityOwner must be spellcraft");
  }

  if (!isSpellcraftGuidanceSource(input.guidanceSource)) {
    throw new Error("guidanceSource must be a supported spellcraft guidance source");
  }

  if (!isSpellcraftHandoffReadiness(input.readiness)) {
    throw new Error("readiness must be a supported spellcraft handoff readiness");
  }

  if (!isSpellcraftAuthoringMode(input.requestedAuthoringMode)) {
    throw new Error(
      "requestedAuthoringMode must be a supported spellcraft authoring mode"
    );
  }

  return freezeReadonlyRecord(input);
}
