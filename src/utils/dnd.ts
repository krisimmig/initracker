export function calcModifier(abilityScore: number): number | string {
  const modifier =  Math.floor((abilityScore - 10) / 2);
  return (modifier >= 0) ? `+${modifier}` : modifier;
}
