export interface AIResponse {
    content: string;
    provider: 'openrouter' | 'groq' | 'mock';
}

const MOCK_DELAY = 1500;

export async function callAI(systemPrompt: string, userPrompt: string): Promise<AIResponse> {
    const openRouterKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    const groqKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

    // 0. Demo Safety Net: Force Mock Mode
    // Allows manual override in case of API failure during demo
    if (typeof window !== 'undefined' && localStorage.getItem('genfin_force_mock') === 'true') {
        console.warn('⚠️ DEMO MODE: Forcing mock response');
        await new Promise(resolve => setTimeout(resolve, 800)); // Faster mock delay for demo
        return {
            content: generateMockResponse(systemPrompt),
            provider: 'mock',
        };
    }

    // 1. Try OpenRouter
    if (openRouterKey) {
        try {
            const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${openRouterKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://genfin.app', // Required by OpenRouter
                    'X-Title': 'GenFin',
                },
                body: JSON.stringify({
                    model: 'google/gemini-2.0-flash-lite-preview-02-05:free', // Fast & Free
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.7,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                const content = data.choices?.[0]?.message?.content;
                if (content) return { content, provider: 'openrouter' };
            } else {
                const errText = await res.text();
                console.error(`❌ OpenRouter Error (${res.status}):`, errText);
            }
        } catch (e) {
            console.error('OpenRouter Network Error:', e);
        }
    }

    // 2. Try Groq
    if (groqKey) {
        try {
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${groqKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile', // Reliable, current Groq model
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.7,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                const content = data.choices?.[0]?.message?.content;
                if (content) return { content, provider: 'groq' };
            } else {
                const errText = await res.text();
                console.error(`❌ Groq Error (${res.status}):`, errText);
            }
        } catch (e) {
            console.error('Groq Network Error:', e);
        }
    }

    console.warn('⚠️ All AI providers failed. Falling back to mock.');
    // 3. Fallback Mock
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    return {
        content: generateMockResponse(systemPrompt),
        provider: 'mock',
    };
}

function generateMockResponse(systemPrompt: string): string {
    // 0. FinBot (Chat Mode) - Return plain text
    if (systemPrompt.includes('FinBot')) {
        return "System Status: Offline Mode. \n\nI am currently operating in limited demo mode because I cannot connect to the external AI network. \n\nPlease check your internet connection or API keys to enable full intelligence.";
    }

    // Simple heuristic to generate somewhat relevant mock data based on agent persona detected in prompt
    const isCFO = systemPrompt.includes('CFO');
    const isVC = systemPrompt.includes('VC');
    const isRisk = systemPrompt.includes('Risk Manager');
    const isTrader = systemPrompt.includes('Trader');

    const baseResponse = {
        summary: "Mock Analysis: Unable to connect to AI provider.",
        recommendation: "Please configure OPENROUTER_API_KEY or GROQ_API_KEY in .env.local",
        riskLevel: 5,
        keyPoints: ["Check API keys", "Verify internet connection", "Try again later"]
    };

    if (isCFO) {
        return JSON.stringify({
            ...baseResponse,
            summary: "I cannot audit this scenario without a live AI connection. However, standard procedure dictates preserving cash and reviewing burn rate immediately.",
            recommendation: "Review runway and cut non-essential costs.",
            riskLevel: 8
        });
    }

    if (isVC) {
        return JSON.stringify({
            ...baseResponse,
            summary: "The growth potential is unclear without market data. I need the AI engine to evaluate the Total Addressable Market (TAM).",
            recommendation: "Focus on scalability arguments until the system is online.",
            riskLevel: 9
        });
    }

    if (isRisk) {
        return JSON.stringify({
            ...baseResponse,
            summary: "System outage detected. This represents a significant operational risk. We are operating blind.",
            recommendation: "Halt all major decisions until intelligence is restored.",
            riskLevel: 10
        });
    }

    if (isTrader) {
        return JSON.stringify({
            ...baseResponse,
            summary: "Market feed down. No signal. I can't see the charts!",
            recommendation: "Stay flat (cash) until the data feed returns.",
            riskLevel: 5
        });
    }

    return JSON.stringify({
        ...baseResponse,
        summary: "Standard automated response. System offline.",
        recommendation: "Diversify and hold.",
        riskLevel: 3
    });
}

export async function generateText(prompt: string): Promise<string> {
    const response = await callAI('You are a helpful financial AI assistant.', prompt);
    return response.content;
}
