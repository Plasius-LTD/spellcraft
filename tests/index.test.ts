import {
  SPELLCRAFT_FEATURE_FLAG_ID,
  createSpellcraftAccessState,
  createSpellcraftGuidanceHandoff,
  packageDescriptor,
  spellcraftAuthorityBoundary,
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
});
