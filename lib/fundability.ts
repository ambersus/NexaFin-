export interface FundabilityMetrics {
    runwayMonths: number;
    monthlyBurn: number;
    survivalScore: number; // 0-100 from existing BuildSim logic
    growthRate?: number; // Optional, assume flat for MVP if not tracked
}

export function calculateFundability(metrics: FundabilityMetrics): number {
    let score = 0;

    // 1. Survival Score Weight (40%)
    score += (metrics.survivalScore * 0.4);

    // 2. Runway Weight (30%)
    // Ideal runway is 18-24 months. 
    // > 18 months = 100% of this weight
    // < 3 months = 0%
    const runwayScore = Math.min(Math.max((metrics.runwayMonths - 3) / (18 - 3), 0), 1) * 100;
    score += (runwayScore * 0.3);

    // 3. Burn Efficiency (20%)
    // Lower burn is generally better for early stage survival, but we need *some* spend.
    // This is a heuristic: <$10k/mo is "ramen profitable" range (good), >$50k w/o revenue is risky.
    // Simplified: If burn < $20k, full points. If > $100k, 0 points.
    const burnScore = Math.min(Math.max((100000 - metrics.monthlyBurn) / (100000 - 20000), 0), 1) * 100;
    score += (burnScore * 0.2);

    // 4. Growth Potential (10%)
    // Placeholder boost
    score += 10;

    // Clamp 0-100
    return Math.min(Math.max(Math.round(score), 0), 100);
}

export function getFundabilityRating(score: number): { label: string; color: string } {
    if (score >= 80) return { label: 'A+ (VC Ready)', color: 'text-emerald-400' };
    if (score >= 70) return { label: 'A (Fundable)', color: 'text-emerald-500' };
    if (score >= 60) return { label: 'B (Promising)', color: 'text-blue-400' };
    if (score >= 40) return { label: 'C (Risky)', color: 'text-yellow-500' };
    return { label: 'D (Unfundable)', color: 'text-red-500' };
}
