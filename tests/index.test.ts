import {
  SPELLCRAFT_FEATURE_FLAG_ID,
  SPELLCRAFT_PRIVACY_SCALE_FEATURE_FLAG_ID,
  createSpecializationDecisionTelemetryEvent,
  createSpellcraftAccessState,
  createSpellcraftGuidanceHandoff,
  createSpellcraftPerformanceBudget,
  createSpellcraftSpecializationRecord,
  createSpellcraftThroughputAssumptions,
  defaultSpellcraftThroughputAssumptions,
  isSpellcraftAuthoringMode,
  packageDescriptor,
  spellcraftAuthorityBoundary,
  spellcraftFieldPolicies,
  spellcraftPrivacyScaleRollout,
} from "../src/index.js";

describe("@plasius/spellcraft", () => {
  it("exports the package descriptor", () => {
    expect(packageDescriptor.packageName).toBe("@plasius/spellcraft");
    expect(packageDescriptor.featureFlagId).toBe(SPELLCRAFT_FEATURE_FLAG_ID);
  });

  it("exports an explicit authority boundary", () => {
    expect(spellcraftAuthorityBoundary.authorityOwner).toBe("spellcraft");
    expect(spellcraftAuthorityBoundary.featureFlagId).toBe(
      SPELLCRAFT_FEATURE_FLAG_ID
    );
    expect(spellcraftAuthorityBoundary.guidanceSources).toContain(
      "player-system"
    );
    expect(Object.isFrozen(spellcraftAuthorityBoundary.guidanceSources)).toBe(
      true
    );
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

  it("supports advanced authoring and handoff variants", () => {
    expect(
      createSpellcraftAccessState({
        academyEligible: false,
        authoringMode: "advanced",
        declarationFormatVersion: "2.0.0",
      }).authoringMode
    ).toBe("advanced");

    const handoff = createSpellcraftGuidanceHandoff({
      authorityOwner: "spellcraft",
      featureFlagId: SPELLCRAFT_FEATURE_FLAG_ID,
      guidanceSource: "academy-catalog",
      academyTrack: "academy.chronomancy",
      readiness: "blocked",
      declarationFormatVersion: "2.0.0",
      requestedAuthoringMode: "advanced",
      handoffSummary: "Advanced authoring remains blocked pending academy review.",
    });

    expect(handoff.guidanceSource).toBe("academy-catalog");
    expect(handoff.readiness).toBe("blocked");
  });

  it("rejects invalid spellcraft access state payloads", () => {
    expect(() =>
      createSpellcraftAccessState({
        academyEligible: true,
        authoringMode: "invalid" as never,
        declarationFormatVersion: "1.0.0",
      })
    ).toThrow("authoringMode must be a supported spellcraft authoring mode");

    expect(() =>
      createSpellcraftAccessState({
        academyEligible: true,
        authoringMode: "guided",
        declarationFormatVersion: " ",
      })
    ).toThrow("declarationFormatVersion must be a non-empty string");
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

  it("records deferred and rejected telemetry variants", () => {
    const event = createSpecializationDecisionTelemetryEvent({
      decisionId: "decision-2",
      stage: "academy-eligibility",
      outcome: "rejected",
      durationMs: 0,
      academyEligible: false,
      authoringMode: "advanced",
      declarationFormatVersion: "2.0.0",
      observedAt: "2026-05-22T00:00:00.000Z",
      failureCategory: "policy",
    });

    expect(event.stage).toBe("academy-eligibility");
    expect(event.failureCategory).toBe("policy");
  });

  it("rejects invalid spellcraft telemetry payloads", () => {
    expect(() =>
      createSpecializationDecisionTelemetryEvent({
        decisionId: "",
        stage: "authoring-mode-selection",
        outcome: "allowed",
        durationMs: 32,
        academyEligible: true,
        authoringMode: "guided",
        declarationFormatVersion: "1.0.0",
        observedAt: "2026-05-21T00:00:00.000Z",
      })
    ).toThrow("decisionId must be a non-empty string");

    expect(() =>
      createSpecializationDecisionTelemetryEvent({
        decisionId: "decision-1",
        stage: "unknown" as never,
        outcome: "allowed",
        durationMs: 32,
        academyEligible: true,
        authoringMode: "guided",
        declarationFormatVersion: "1.0.0",
        observedAt: "2026-05-21T00:00:00.000Z",
      })
    ).toThrow("stage must be a supported specialization decision stage");

    expect(() =>
      createSpecializationDecisionTelemetryEvent({
        decisionId: "decision-1",
        stage: "authoring-mode-selection",
        outcome: "unknown" as never,
        durationMs: 32,
        academyEligible: true,
        authoringMode: "guided",
        declarationFormatVersion: "1.0.0",
        observedAt: "2026-05-21T00:00:00.000Z",
      })
    ).toThrow("outcome must be a supported specialization decision outcome");

    expect(() =>
      createSpecializationDecisionTelemetryEvent({
        decisionId: "decision-1",
        stage: "authoring-mode-selection",
        outcome: "allowed",
        durationMs: 32,
        academyEligible: true,
        authoringMode: "invalid" as never,
        declarationFormatVersion: "1.0.0",
        observedAt: "2026-05-21T00:00:00.000Z",
      })
    ).toThrow("authoringMode must be a supported spellcraft authoring mode");

    expect(() =>
      createSpecializationDecisionTelemetryEvent({
        decisionId: "decision-1",
        stage: "authoring-mode-selection",
        outcome: "allowed",
        durationMs: 32,
        academyEligible: true,
        authoringMode: "guided",
        declarationFormatVersion: "1.0.0",
        observedAt: "2026-02-31T00:00:00.000Z",
      })
    ).toThrow("observedAt must be an ISO-8601 timestamp");

    expect(() =>
      createSpecializationDecisionTelemetryEvent({
        decisionId: "decision-1",
        stage: "authoring-mode-selection",
        outcome: "allowed",
        durationMs: -1,
        academyEligible: true,
        authoringMode: "guided",
        declarationFormatVersion: "1.0.0",
        observedAt: "2026-05-21T00:00:00.000Z",
      })
    ).toThrow("durationMs must be a non-negative safe integer");

    expect(() =>
      createSpecializationDecisionTelemetryEvent({
        decisionId: "decision-1",
        stage: "authoring-mode-selection",
        outcome: "allowed",
        durationMs: 32,
        academyEligible: true,
        authoringMode: "guided",
        declarationFormatVersion: "1.0.0",
        observedAt: "2026-05-21T00:00:00.000Z",
        failureCategory: "misconfigured" as never,
      })
    ).toThrow(
      "failureCategory must be a supported specialization failure category"
    );
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

  it("rejects invalid spellcraft performance budgets", () => {
    expect(() =>
      createSpellcraftPerformanceBudget({
        stage: "unknown" as never,
        targetP95Ms: 75,
        hardTimeoutMs: 150,
        cacheable: false,
        maxDependencyCalls: 2,
      })
    ).toThrow("stage must be a supported specialization decision stage");

    expect(() =>
      createSpellcraftPerformanceBudget({
        stage: "declaration-validation",
        targetP95Ms: 75,
        hardTimeoutMs: 50,
        cacheable: false,
        maxDependencyCalls: 2,
      })
    ).toThrow("hardTimeoutMs must be greater than or equal to targetP95Ms");

    expect(() =>
      createSpellcraftPerformanceBudget({
        stage: "academy-eligibility",
        targetP95Ms: 75,
        hardTimeoutMs: 150,
        cacheable: false,
        maxDependencyCalls: -1,
      })
    ).toThrow("maxDependencyCalls must be a non-negative safe integer");
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

  it("creates an explicit guidance handoff payload", () => {
    const handoff = createSpellcraftGuidanceHandoff({
      authorityOwner: "spellcraft",
      featureFlagId: SPELLCRAFT_FEATURE_FLAG_ID,
      guidanceSource: "player-system",
      academyTrack: "academy.evocation",
      readiness: "eligible",
      declarationFormatVersion: "1.0.0",
      requestedAuthoringMode: "guided",
      handoffSummary:
        "Player System guidance has cleared academy gating and is handing authoring authority to spellcraft.",
    });

    expect(handoff.guidanceSource).toBe("player-system");
    expect(handoff.readiness).toBe("eligible");
    expect(Object.isFrozen(handoff)).toBe(true);
  });

  it("rejects invalid spellcraft guidance handoff payloads", () => {
    expect(() =>
      createSpellcraftGuidanceHandoff({
        authorityOwner: "academy" as never,
        featureFlagId: SPELLCRAFT_FEATURE_FLAG_ID,
        guidanceSource: "player-system",
        academyTrack: "academy.evocation",
        readiness: "eligible",
        declarationFormatVersion: "1.0.0",
        requestedAuthoringMode: "guided",
        handoffSummary: "valid",
      })
    ).toThrow("authorityOwner must be spellcraft");

    expect(() =>
      createSpellcraftGuidanceHandoff({
        authorityOwner: "spellcraft",
        featureFlagId: SPELLCRAFT_FEATURE_FLAG_ID,
        guidanceSource: "unknown" as never,
        academyTrack: "academy.evocation",
        readiness: "eligible",
        declarationFormatVersion: "1.0.0",
        requestedAuthoringMode: "guided",
        handoffSummary: "valid",
      })
    ).toThrow("guidanceSource must be a supported spellcraft guidance source");

    expect(() =>
      createSpellcraftGuidanceHandoff({
        authorityOwner: "spellcraft",
        featureFlagId: SPELLCRAFT_FEATURE_FLAG_ID,
        guidanceSource: "player-system",
        academyTrack: "academy.evocation",
        readiness: "not-ready" as never,
        declarationFormatVersion: "1.0.0",
        requestedAuthoringMode: "guided",
        handoffSummary: "valid",
      })
    ).toThrow("readiness must be a supported spellcraft handoff readiness");

    expect(() =>
      createSpellcraftGuidanceHandoff({
        authorityOwner: "spellcraft",
        featureFlagId: SPELLCRAFT_FEATURE_FLAG_ID,
        guidanceSource: "academy-advisor",
        academyTrack: "academy.evocation",
        readiness: "needs-academy-progress",
        declarationFormatVersion: "1.0.0",
        requestedAuthoringMode: "expert" as never,
        handoffSummary: "valid",
      })
    ).toThrow(
      "requestedAuthoringMode must be a supported spellcraft authoring mode"
    );
  });
});
