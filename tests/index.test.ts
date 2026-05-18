import {
  SPELLCRAFT_FEATURE_FLAG_ID,
  createSpellcraftAccessState,
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
});
