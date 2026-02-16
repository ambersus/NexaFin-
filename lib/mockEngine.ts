// BuildSim — Financial Engine
// Survival score, stress tests, founder controls

export interface FinancialData {
    revenue: number;
    burn: number;
    growth: number;
    team: number;
    cash: number;
    runway: number;
    survivalScore: number;
}

// --- Survival Score ---

export function calculateSurvivalScore(
    runway: number,
    growth: number,
    burn: number,
    revenue: number
): number {
    let score = 70;

    if (runway < 12) score -= 20;
    if (runway > 18) score += 10;
    if (growth > 10) score += 10;
    if (burn > revenue) score -= 10;

    return Math.max(5, Math.min(95, score));
}


// --- Phase 2: Stress Test ---


export interface StressTestControls {
    recession: boolean;
    adCostIncrease: number;    // 0–50 (%)
    hiringExpansion: number;   // 0–5 (new employees)
    growthSlowdown: number;    // 0–10 (% reduction)
}

export interface AdjustedFinancialData {
    adjustedBurn: number;
    adjustedGrowth: number;
    adjustedRunway: number;
    adjustedSurvivalScore: number;
}

export function calculateStressTest(
    base: FinancialData,
    controls: StressTestControls
): AdjustedFinancialData {
    // --- Adjust burn (cumulative) ---
    let adjustedBurn = base.burn;
    if (controls.recession) {
        adjustedBurn *= 1.15;
    }
    adjustedBurn *= 1 + controls.adCostIncrease / 100;
    adjustedBurn += controls.hiringExpansion * 8000;
    adjustedBurn = Math.round(adjustedBurn);

    // --- Adjust growth (never below 0) ---
    const adjustedGrowth = Math.max(0, base.growth - controls.growthSlowdown);

    // --- Runway (cash stays constant) ---
    const adjustedRunway = adjustedBurn > 0 ? Math.floor(base.cash / adjustedBurn) : 999;

    // --- Survival score (start from base, apply penalties) ---
    let adjustedSurvivalScore = base.survivalScore;
    if (controls.recession) adjustedSurvivalScore -= 15;
    if (adjustedRunway < 10) adjustedSurvivalScore -= 15;
    if (adjustedGrowth < 5) adjustedSurvivalScore -= 10;
    if (adjustedBurn > base.revenue * 2) adjustedSurvivalScore -= 10;
    adjustedSurvivalScore = Math.max(5, Math.min(95, adjustedSurvivalScore));

    return { adjustedBurn, adjustedGrowth, adjustedRunway, adjustedSurvivalScore };
}

// --- Phase 5: Founder Controls ---

export interface FounderControls {
    startingCapital: number | null;  // null = use AI cash
    plannedHires: number;            // 0–10
    marketingBudget: number;         // 0–50000
}

export function applyFounderControls(
    base: FinancialData,
    controls: FounderControls
): FinancialData {
    // Effective cash
    const cash = controls.startingCapital !== null && controls.startingCapital >= 0
        ? controls.startingCapital
        : base.cash;

    // Adjusted burn
    const burn = base.burn
        + (controls.plannedHires * 9000)
        + controls.marketingBudget;

    // Adjusted growth (marketing boost, capped at +5%)
    const marketingBoost = Math.min(controls.marketingBudget / 20000, 5);
    const growth = base.growth + marketingBoost;

    // Adjusted team
    const team = base.team + controls.plannedHires;

    // Derived
    const runway = burn > 0 ? Math.floor(cash / burn) : 999;
    const survivalScore = calculateSurvivalScore(runway, growth, burn, base.revenue);

    return {
        revenue: base.revenue,
        burn,
        growth: Math.round(growth * 10) / 10,  // 1 decimal
        team,
        cash,
        runway,
        survivalScore,
    };
}
