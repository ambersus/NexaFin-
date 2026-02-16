export interface ScenarioProjection {
    year: number;
    value: number;
    upperBound: number;
    lowerBound: number;
}

export interface ScenarioResult {
    netWorth5Year: number;
    bestCase: number;
    worstCase: number;
    riskScore: number; // 1-10
    projections: ScenarioProjection[];
}

export function runScenarioSimulation(
    type: 'startup' | 'invest' | 'hybrid',
    capital: number,
    monthlyContribution: number,
    riskProfile: 'low' | 'medium' | 'high'
): ScenarioResult {
    const years = 5;
    const projections: ScenarioProjection[] = [];
    let currentVal = capital;
    let highVal = capital;
    let lowVal = capital;

    // Base rates per risk/type
    let baseGrowth = 0.07; // Default 7%
    let volatility = 0.10; // 10% swing

    if (type === 'invest') {
        if (riskProfile === 'low') { baseGrowth = 0.04; volatility = 0.05; }
        if (riskProfile === 'medium') { baseGrowth = 0.08; volatility = 0.12; }
        if (riskProfile === 'high') { baseGrowth = 0.12; volatility = 0.20; }
    } else if (type === 'startup') {
        // Startups have high failure rate but high potential
        baseGrowth = riskProfile === 'low' ? 0.0 : 0.25; // "Low" risk startup is oxymoron, treated as stagnation
        if (riskProfile === 'medium') { baseGrowth = 0.40; volatility = 0.50; }
        if (riskProfile === 'high') { baseGrowth = 0.80; volatility = 0.90; }
    } else { // Hybrid
        baseGrowth = 0.15;
        volatility = 0.25;
    }

    // 5 Year Iteration
    for (let i = 1; i <= years; i++) {
        // Add contribution
        currentVal += (monthlyContribution * 12);
        highVal += (monthlyContribution * 12);
        lowVal += (monthlyContribution * 12);

        // Apply Growth
        currentVal = currentVal * (1 + baseGrowth);
        highVal = highVal * (1 + baseGrowth + (volatility * 0.5)); // Optimistic
        lowVal = lowVal * (1 + baseGrowth - volatility); // Pessimistic

        // Startup penalty logic: Low value can hit 0
        if (type === 'startup' && lowVal < 0) lowVal = 0;

        projections.push({
            year: i,
            value: Math.round(currentVal),
            upperBound: Math.round(highVal),
            lowerBound: Math.round(lowVal)
        });
    }

    // Risk Score Calculation
    let riskScore = 5;
    if (type === 'startup') riskScore = 9;
    if (type === 'invest' && riskProfile === 'low') riskScore = 2;
    if (type === 'invest' && riskProfile === 'high') riskScore = 7;
    if (type === 'hybrid') riskScore = 6;

    return {
        netWorth5Year: Math.round(currentVal),
        bestCase: Math.round(highVal),
        worstCase: Math.round(lowVal),
        riskScore,
        projections
    };
}
