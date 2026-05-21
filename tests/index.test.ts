import {
  SPELLCRAFT_FEATURE_FLAG_ID,
  createSpellcraftAccessState,
  createSpellcraftPerformanceBudget,
  createSpecializationDecisionTelemetryEvent,
  packageDescriptor,
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
});
