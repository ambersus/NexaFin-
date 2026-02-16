/**
 * Financial Health Score Engine
 * Combines metrics from all modules to give a 0-100 score + Grade.
 */

export interface HealthMetrics {
    cashDisplay: string;
    netWorth: number;
    monthlyBurn: number;
    runwayMonths: number;
    portfolioValue: number;
    riskScore: number; // 1-10 (10 is high risk)
}

export interface HealthScoreResult {
    totalScore: number;
    grade: string;
    metrics: {
        liquidity: number; // 0-100
        solvency: number; // 0-100
        growth: number; // 0-100
        stability: number; // 0-100
    };
    summary: string;
}

export function calculateHealthScore(data: Partial<HealthMetrics>): HealthScoreResult {
    // defaults
    const runway = data.runwayMonths || 0;
    const netWorth = data.netWorth || 0;
    const burn = data.monthlyBurn || 0;
    const portfolio = data.portfolioValue || 0;
    const risk = data.riskScore || 5;

    // 1. Liquidity Score (Runway & Cash)
    // 18+ months runway = 100
    let liquidity = Math.min((runway / 18) * 100, 100);
    if (runway === 0 && netWorth > 0) liquidity = 50; // Fallback if just personal finance

    // 2. Solvency (Net Worth vs Burn)
    // Net Worth should be at least 24x monthly burn
    const idealNetWorth = burn > 0 ? burn * 24 : 50000;
    let solvency = Math.min((netWorth / idealNetWorth) * 100, 100);

    // 3. Growth (Portfolio Size & allocation)
    // Simple heuristic: larger portfolio = better growth potential (diminishing returns logic)
    // Target $100k for max score in this demo context
    let growth = Math.min((portfolio / 100000) * 100, 100);

    // 4. Stability (Inverse of Risk)
    let stability = 100 - (risk * 10);

    // Weighted Total
    // Startup focus: Liquidity is king
    // Investing focus: Growth is king
    // We'll take a balanced approach
    const totalScore = Math.round(
        (liquidity * 0.4) +
        (solvency * 0.2) +
        (growth * 0.2) +
        (stability * 0.2)
    );

    // Grade
    let grade = 'F';
    let summary = 'Critical Action Needed';
    if (totalScore >= 90) { grade = 'A+'; summary = 'Excellent Financial Health'; }
    else if (totalScore >= 80) { grade = 'A'; summary = 'Strong Position'; }
    else if (totalScore >= 70) { grade = 'B'; summary = 'Healthy but optimize'; }
    else if (totalScore >= 60) { grade = 'C'; summary = 'Stable but vulnerable'; }
    else if (totalScore >= 40) { grade = 'D'; summary = 'High Risk Detected'; }

    return {
        totalScore,
        grade,
        metrics: {
            liquidity: Math.round(liquidity),
            solvency: Math.round(solvency),
            growth: Math.round(growth),
            stability: Math.round(stability)
        },
        summary
    };
}
