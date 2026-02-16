import { NextResponse } from 'next/server';
import { callAI } from '@/lib/aiClient';

export async function POST(request: Request) {
    try {
        const { startupData } = await request.json();

        if (!startupData) {
            return NextResponse.json(
                { error: 'Startup data is required' },
                { status: 400 }
            );
        }

        const systemPrompt = `You are a savvy Venture Capital Associate. Your job is to write a concise Investment Thesis for a startup.
    
    Startup Data provided:
    Runway: ${startupData.runwayMonths} months
    Monthly Burn: $${startupData.monthlyBurn}
    Survival Probability: ${startupData.survivalScore}%
    
    You need to estimate a realistic Valuation and Ask Amount based on these pre-seed/seed metrics.
    
    Output MUST be valid JSON with this structure:
    {
      "valuation": number (estimated pre-money valuation in USD, e.g. 2000000),
      "askAmount": number (recommended raise amount in USD, e.g. 500000),
      "equity": number (percentage points for the ask, e.g. 15),
      "expectedROI": "string (e.g. '10x in 5 years')",
      "risk": "Low" | "Medium" | "High",
      "summary": "2-3 sentence investment thesis on why this is a good/bad deal.",
      "comparable": ["Comp 1", "Comp 2"]
    }`;

        const response = await callAI(systemPrompt, "Generate investment thesis based on the provided metrics.");

        let parsedContent;
        try {
            const cleanJson = response.content.replace(/```json/g, '').replace(/```/g, '').trim();
            parsedContent = JSON.parse(cleanJson);
        } catch (e) {
            console.error('Failed to parse Investment Thesis JSON:', e);
            // Fallback
            parsedContent = {
                valuation: 2000000,
                askAmount: 500000,
                equity: 20,
                expectedROI: "Unknown",
                risk: "High",
                summary: "Analysis failed. Proceed with caution.",
                comparable: ["Unknown"]
            };
        }

        return NextResponse.json(parsedContent);

    } catch (error) {
        console.error('Investment Thesis API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
