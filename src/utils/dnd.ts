export function calcModifier(abilityScore: number): number {
  return Math.floor((abilityScore - 10) / 2);
}

export function stringifyModifier(abilityScore: number): string {
  if (abilityScore === 0) { return ''; }
  return (abilityScore >= 0) ? `(+${abilityScore})` : `(${abilityScore})`;
}

export function modifierWithSign(abilityScore: number): string {
  const mod = calcModifier(abilityScore);
  if (mod > 0) {
    return `+${mod}`;
  }
  if (mod === 0) { return ''; }
  return `${mod}`;
}

export function stringModifier(abilityScore: number): string {
  return stringifyModifier(calcModifier(abilityScore));
}

