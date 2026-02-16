export interface StressResult {
    scenario: string;
    changePercent: number;
    projectedValue: number;
    description: string;
}

export function runStressTests(currentValue: number, composition: any[]): StressResult[] {
    // Simplified logic: Check allocation types to determine sensitivity
    const cryptoExposure = composition.filter(a => a.type === 'Crypto').reduce((sum, a) => sum + a.percentage, 0) / 100;
    const stockExposure = composition.filter(a => a.type === 'Stock' || a.type === 'ETF').reduce((sum, a) => sum + a.percentage, 0) / 100;
    const bondExposure = composition.filter(a => a.type === 'Bond').reduce((sum, a) => sum + a.percentage, 0) / 100;

    // Scenarios

    // 1. Recession (-30% Stocks, -50% Crypto, +5% Bonds)
    const recessionChange = (stockExposure * -0.30) + (cryptoExposure * -0.50) + (bondExposure * 0.05);

    // 2. High Inflation (-10% Stocks, +10% Crypto/Gold, -5% Bonds)
    const inflationChange = (stockExposure * -0.10) + (cryptoExposure * 0.10) + (bondExposure * -0.05);

    // 3. Tech Bull Run (+25% Stocks, +40% Crypto, -2% Bonds)
    const bullChange = (stockExposure * 0.25) + (cryptoExposure * 0.40) + (bondExposure * -0.02);

    return [
        {
            scenario: 'Global Recession',
            changePercent: recessionChange,
            projectedValue: currentValue * (1 + recessionChange),
            description: 'Severe economic downturn'
        },
        {
            scenario: 'High Inflation',
            changePercent: inflationChange,
            projectedValue: currentValue * (1 + inflationChange),
            description: 'Purchasing power decline'
        },
        {
            scenario: 'Tech Bull Run',
            changePercent: bullChange,
            projectedValue: currentValue * (1 + bullChange),
            description: 'Aggressive growth cycle'
        }
    ];
}
