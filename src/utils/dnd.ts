export function calcModifier(abilityScore: number): number {
  return Math.floor((abilityScore - 10) / 2);
}

export function stringifyModifier(abilityScore: number): string {
  if (abilityScore === 0) { return ''; }
  return (abilityScore >= 0) ? `+${abilityScore}` : `${abilityScore}`;
}
