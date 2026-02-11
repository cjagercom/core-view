export function getReactionTimeMultiplier(elapsedMs: number, timeLimitMs: number): number {
  const ratio = elapsedMs / timeLimitMs;
  if (ratio < 0.4) return 1.3; // Fast = instinct, weight higher
  if (ratio < 0.8) return 1.0; // Normal
  return 0.7; // Slow = overthought, weight lower
}
