export const DEMO_PRESETS = {
    STARTUP: {
        companyName: "EduAI",
        industry: "EdTech",
        description: "AI-powered personalized tutor for K-12 students.",
        initialCapital: 50000,
        burnRate: 5000,
        revenue: 2000,
        growthRate: 15,
        months: 24,
        teamSize: 3,
        costPerUser: 5,
        marketingBudget: 2000
    },
    PORTFOLIO: {
        amount: 50000,
        risk: 'Medium',
        horizon: '5 Years',
        goal: 'Growth'
    },
    SCENARIO: {
        name: "Startup vs Corp Job",
        type: 'startup' as const, // Casting to match literal type if needed
        capital: 25000,
        monthlyContribution: 0,
        riskProfile: 'high' as const
    },
    AGENTS: {
        query: "I have $50k savings. Should I start an AI business or invest in ETFs?"
    }
};
