import { NextResponse } from 'next/server';
import { callAI } from '@/lib/aiClient';

export async function POST(request: Request) {
    try {
        const { amount, risk, horizon, goal } = await request.json();

        if (!amount || !risk) {
            return NextResponse.json(
                { error: 'Amount and risk are required' },
                { status: 400 }
            );
        }

        const systemPrompt = `You are an expert Wealth Manager AI.
    Create a detailed investment portfolio strategy based on the user's profile.
    
    User Profile:
    - Investment Amount: $${amount}
    - Risk Tolerance: ${risk} (Low/Medium/High)
    - Time Horizon: ${horizon}
    - Goal: ${goal}
    
    Output MUST be valid JSON with this structure:
    {
      "strategyName": "string (e.g. 'Aggressive Growth', 'Conservative Income')",
      "description": "2 sentence summary of the strategy",
      "expectedReturn": "string (e.g. '8-10% annually')",
      "riskScore": number (1-10),
      "allocation": [
        { 
          "symbol": "string (e.g. SPY, BND, BTC, AAPL)", 
          "name": "string (Asset Name)", 
          "percentage": number (0-100), 
          "type": "string (Stock/Bond/Crypto/ETF)",
          "reasoning": "short reason for inclusion"
        }
      ]
    }
    Ensure the sum of allocation percentages equals 100.`;

        const response = await callAI(systemPrompt, "Generate my portfolio allocation.");

        let parsedContent;
        try {
            const cleanJson = response.content.replace(/```json/g, '').replace(/```/g, '').trim();
            parsedContent = JSON.parse(cleanJson);
        } catch (e) {
            console.error('Failed to parse Portfolio JSON:', e);
            // Fallback Mock
            parsedContent = {
                strategyName: "Balanced Growth (Fallback)",
                description: "A fallback strategy due to AI generation error.",
                expectedReturn: "5-7%",
                riskScore: 5,
                allocation: [
                    { symbol: "VTI", name: "Total Stock Market", percentage: 50, type: "ETF", reasoning: "Broad market exposure" },
                    { symbol: "BND", name: "Total Bond Market", percentage: 40, type: "ETF", reasoning: "Stability" },
                    { symbol: "GLD", name: "Gold", percentage: 10, type: "Commodity", reasoning: "Hedge" }
                ]
            };
        }

        return NextResponse.json(parsedContent);

    } catch (error) {
        console.error('Portfolio Generation API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
