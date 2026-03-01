export function calcModifier(abilityScore: number): number {
  return Math.floor((abilityScore - 10) / 2);
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
  const modifier = calcModifier(abilityScore);
  if (modifier === 0) { return ''; }
  return (modifier >= 0) ? `(+${modifier})` : `(${modifier})`;
}

