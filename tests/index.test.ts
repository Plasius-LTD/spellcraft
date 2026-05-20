import {
  SPELLCRAFT_FEATURE_FLAG_ID,
  createSpellcraftAccessState,
  createSpellcraftSpecializationRecord,
  createSpellcraftThroughputAssumptions,
  defaultSpellcraftThroughputAssumptions,
  isSpellcraftAuthoringMode,
  packageDescriptor,
  spellcraftFieldPolicies,
  spellcraftPrivacyScaleRollout,
  SPELLCRAFT_PRIVACY_SCALE_FEATURE_FLAG_ID,
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
  });

  it("exports the privacy and scale rollout metadata", () => {
    expect(spellcraftPrivacyScaleRollout.featureFlagId).toBe(
      SPELLCRAFT_PRIVACY_SCALE_FEATURE_FLAG_ID
    );
    expect(spellcraftPrivacyScaleRollout.envOverride).toBe(
      "SPELLCRAFT_PRIVACY_SCALE_ENABLED"
    );
  });

  it("documents a minimized specialization field policy", () => {
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
    expect(() =>
      createSpellcraftThroughputAssumptions({
        maxConcurrentAuthoringSessions: 0,
        maxSpecializationDecisionsPerMinute: 14_000,
        maxDeclarationValidationsPerMinute: 35_000,
      })
    ).toThrow("maxConcurrentAuthoringSessions must be a positive safe integer");
  });
});
