import {
  SPELLCRAFT_FEATURE_FLAG_ID,
  SPELLCRAFT_PRIVACY_SCALE_FEATURE_FLAG_ID,
  createSpecializationDecisionTelemetryEvent,
  createSpellcraftAccessState,
  createSpellcraftPerformanceBudget,
  createSpellcraftSpecializationRecord,
  createSpellcraftThroughputAssumptions,
  defaultSpellcraftThroughputAssumptions,
  isSpellcraftAuthoringMode,
  packageDescriptor,
  spellcraftFieldPolicies,
  spellcraftPrivacyScaleRollout,
} from "../src/index.js";

describe("@plasius/spellcraft", () => {
  it("exports the package descriptor", () => {
    expect(packageDescriptor.packageName).toBe("@plasius/spellcraft");
    expect(packageDescriptor.featureFlagId).toBe(SPELLCRAFT_FEATURE_FLAG_ID);
  });

  it("creates spellcraft access state", () => {
    const state = createSpellcraftAccessState({
      academyEligible: true,
      authoringMode: "guided",
      declarationFormatVersion: "1.0.0",
    });

    expect(state.academyEligible).toBe(true);
    expect(Object.isFrozen(state)).toBe(true);
  });

  it("creates specialization decision telemetry", () => {
    const event = createSpecializationDecisionTelemetryEvent({
      decisionId: "decision-1",
      stage: "authoring-mode-selection",
      outcome: "allowed",
      durationMs: 32,
      academyEligible: true,
      authoringMode: "guided",
      declarationFormatVersion: "1.0.0",
      observedAt: "2026-05-21T00:00:00.000Z",
    });

    expect(event.stage).toBe("authoring-mode-selection");
    expect(event.durationMs).toBe(32);
    expect(Object.isFrozen(event)).toBe(true);
  });

  it("creates performance budget metadata", () => {
    const budget = createSpellcraftPerformanceBudget({
      stage: "declaration-validation",
      targetP95Ms: 75,
      hardTimeoutMs: 150,
      cacheable: false,
      maxDependencyCalls: 2,
    });

    expect(budget.targetP95Ms).toBe(75);
    expect(Object.isFrozen(budget)).toBe(true);
  });

  it("exports the privacy and scale rollout metadata", () => {
    expect(spellcraftPrivacyScaleRollout.featureFlagId).toBe(
      SPELLCRAFT_PRIVACY_SCALE_FEATURE_FLAG_ID
    );
    expect(spellcraftPrivacyScaleRollout.envOverride).toBe(
      "SPELLCRAFT_PRIVACY_SCALE_ENABLED"
    );
  });

  it("documents immutable minimized specialization field policies", () => {
    expect(spellcraftFieldPolicies).toEqual([
      expect.objectContaining({
        field: "casterSubjectId",
        sensitivity: "pseudonymous",
      }),
      expect.objectContaining({
        field: "academyNodeId",
      }),
      expect.objectContaining({
        field: "specializationId",
      }),
      expect.objectContaining({
        field: "authoringMode",
      }),
      expect.objectContaining({
        field: "declarationFormatVersion",
      }),
      expect.objectContaining({
        field: "updatedAtIso",
        retention: "short-lived",
      }),
    ]);
    expect(Object.isFrozen(spellcraftFieldPolicies)).toBe(true);
    expect(Object.isFrozen(spellcraftFieldPolicies[0])).toBe(true);
    expect(() => {
      (
        spellcraftFieldPolicies[0] as unknown as {
          retention: string;
        }
      ).retention = "short-lived";
    }).toThrow();
  });

  it("creates a minimal specialization record", () => {
    const record = createSpellcraftSpecializationRecord({
      casterSubjectId: "caster-sub-1",
      academyNodeId: "academy-1",
      specializationId: "sigil-weaving",
      authoringMode: "guided",
      declarationFormatVersion: "1.0.0",
      updatedAtIso: "2026-05-20T00:00:00.000Z",
    });

    expect(record.specializationId).toBe("sigil-weaving");
    expect(record.authoringMode).toBe("guided");
    expect(Object.isFrozen(record)).toBe(true);
  });

  it("rejects incomplete specialization identifiers", () => {
    expect(() =>
      createSpellcraftSpecializationRecord({
        casterSubjectId: "",
        academyNodeId: "academy-1",
        specializationId: "sigil-weaving",
        authoringMode: "guided",
        declarationFormatVersion: "1.0.0",
        updatedAtIso: "2026-05-20T00:00:00.000Z",
      })
    ).toThrow("casterSubjectId must be a non-empty string");
  });

  it("rejects unsupported authoring modes", () => {
    expect(isSpellcraftAuthoringMode("guided")).toBe(true);
    expect(isSpellcraftAuthoringMode("invalid")).toBe(false);
    expect(() =>
      createSpellcraftSpecializationRecord({
        casterSubjectId: "caster-sub-1",
        academyNodeId: "academy-1",
        specializationId: "sigil-weaving",
        authoringMode: "invalid" as never,
        declarationFormatVersion: "1.0.0",
        updatedAtIso: "2026-05-20T00:00:00.000Z",
      })
    ).toThrow("authoringMode must be a supported spellcraft authoring mode");
  });

  it("rejects invalid specialization timestamps", () => {
    expect(() =>
      createSpellcraftSpecializationRecord({
        casterSubjectId: "caster-sub-1",
        academyNodeId: "academy-1",
        specializationId: "sigil-weaving",
        authoringMode: "guided",
        declarationFormatVersion: "1.0.0",
        updatedAtIso: "2026-02-31T00:00:00.000Z",
      })
    ).toThrow("updatedAtIso must be an ISO-8601 timestamp");

    expect(() =>
      createSpellcraftSpecializationRecord({
        casterSubjectId: "caster-sub-1",
        academyNodeId: "academy-1",
        specializationId: "sigil-weaving",
        authoringMode: "guided",
        declarationFormatVersion: "1.0.0",
        updatedAtIso: "not-a-date",
      })
    ).toThrow("updatedAtIso must be an ISO-8601 timestamp");
  });

  it("validates positive throughput assumptions", () => {
    expect(defaultSpellcraftThroughputAssumptions.maxConcurrentAuthoringSessions).toBe(
      1_500
    );

    const throughputAssumptions = createSpellcraftThroughputAssumptions({
      maxConcurrentAuthoringSessions: 2_000,
      maxSpecializationDecisionsPerMinute: 14_000,
      maxDeclarationValidationsPerMinute: 35_000,
    });

    expect(throughputAssumptions.maxDeclarationValidationsPerMinute).toBe(
      35_000
    );
    expect(Object.isFrozen(throughputAssumptions)).toBe(true);
    expect(() =>
      createSpellcraftThroughputAssumptions({
        maxConcurrentAuthoringSessions: 0,
        maxSpecializationDecisionsPerMinute: 14_000,
        maxDeclarationValidationsPerMinute: 35_000,
      })
    ).toThrow("maxConcurrentAuthoringSessions must be a positive safe integer");
  });
});
