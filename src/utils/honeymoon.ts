import { HoneymoonDestination, HoneymoonVibe } from '../types/wedding';

export interface HoneymoonMatchResult {
  destination: HoneymoonDestination;
  suitabilityScore: number; // 0 to 100
  budgetFit: 'Within Budget' | 'Slight Stretch' | 'Exceeds Budget';
  varianceAmount: number; // positive = surplus, negative = deficit
  matchingVibes: HoneymoonVibe[];
}

export function matchHoneymoonDestinations(
  remainingBudget: number,
  preferredVibes: HoneymoonVibe[],
  destinations: HoneymoonDestination[]
): HoneymoonMatchResult[] {
  return destinations.map(dest => {
    // 1. Vibe alignment score (0 - 50 pts)
    const matchingVibes = dest.vibes.filter(v => preferredVibes.includes(v));
    const vibeMatchRatio = preferredVibes.length > 0 
      ? matchingVibes.length / preferredVibes.length 
      : 0.5;
    const vibeScore = Math.round(vibeMatchRatio * 50);

    // 2. Budget compatibility score (0 - 50 pts)
    const variance = remainingBudget - dest.estimatedCostTotal;
    let budgetScore = 0;
    let budgetFit: 'Within Budget' | 'Slight Stretch' | 'Exceeds Budget' = 'Within Budget';

    if (variance >= 0) {
      budgetFit = 'Within Budget';
      // Reward destinations well within budget, with optimal sweet spot
      const bufferRatio = remainingBudget > 0 ? dest.estimatedCostTotal / remainingBudget : 0.8;
      budgetScore = Math.round(40 + (bufferRatio * 10));
    } else if (Math.abs(variance) <= 2500) {
      budgetFit = 'Slight Stretch';
      budgetScore = 30;
    } else {
      budgetFit = 'Exceeds Budget';
      budgetScore = Math.max(5, Math.round(20 - (Math.abs(variance) / 1000)));
    }

    const suitabilityScore = Math.min(100, Math.max(0, vibeScore + budgetScore));

    return {
      destination: dest,
      suitabilityScore,
      budgetFit,
      varianceAmount: variance,
      matchingVibes,
    };
  }).sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}
