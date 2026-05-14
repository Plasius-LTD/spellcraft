import { createSpellcraftAccessState, packageDescriptor } from "../dist/index.js";

const state = createSpellcraftAccessState({
  academyEligible: true,
  authoringMode: "guided",
  declarationFormatVersion: "1.0.0",
});

console.log(packageDescriptor);
console.log(state);
