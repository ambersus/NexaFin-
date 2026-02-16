import { NextResponse } from 'next/server';

// ── Fallback mock data (guaranteed safe return) ──────────────────
const FALLBACK_DATA = {
    revenue: 25000,
    burn: 40000,
    growth: 8,
    team: 5,
    cash: 40000 * 12,
};

// ── Prompt templates ─────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a venture capital financial analyst.

Generate a realistic early-stage startup financial model.

Return ONLY valid JSON.
No explanation text.`;

function buildUserPrompt(idea: string): string {
    return `Startup idea: ${idea}

Return JSON:
{
  "revenue": monthly revenue number,
  "burn": monthly burn number,
  "growth": monthly growth percent,
  "team": number of employees,
  "cash": total cash in bank
}

Rules:
- revenue 5k–100k
- burn 20k–150k
- growth 2–20
- team 2–15
- cash = burn × 6–18

Return ONLY JSON.`;
}

// ── JSON parsing with cleanup ────────────────────────────────────
function parseFinancialJSON(text: string): Record<string, number> | null {
    // Try direct parse
    try {
        const parsed = JSON.parse(text);
        if (isValidFinancialData(parsed)) return parsed;
    } catch {
        // continue to cleanup
    }

    // Try extracting JSON from markdown code blocks or surrounding text
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
        try {
            const parsed = JSON.parse(jsonMatch[0]);
            if (isValidFinancialData(parsed)) return parsed;
        } catch {
            // fall through
        }
    }

    return null;
}

function isValidFinancialData(obj: unknown): obj is Record<string, number> {
    if (!obj || typeof obj !== 'object') return false;
    const data = obj as Record<string, unknown>;
    return (
        typeof data.revenue === 'number' &&
        typeof data.burn === 'number' &&
        typeof data.growth === 'number' &&
        typeof data.team === 'number' &&
        typeof data.cash === 'number'
    );
}

// ── LLM call helper ─────────────────────────────────────────────
async function callLLM(
    endpoint: string,
    apiKey: string,
    model: string,
    idea: string,
    providerName: string
): Promise<Record<string, number> | null> {
    try {
        console.log(`[BuildSim] Trying ${providerName}...`);

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: buildUserPrompt(idea) },
                ],
                temperature: 0.7,
                max_tokens: 300,
            }),
            signal: AbortSignal.timeout(15000), // 15s timeout
        });

        if (!response.ok) {
            console.error(`[BuildSim] ${providerName} HTTP ${response.status}`);
            return null;
        }

        const json = await response.json();
        const text = json?.choices?.[0]?.message?.content?.trim();

        if (!text) {
            console.error(`[BuildSim] ${providerName} returned empty content`);
            return null;
        }

        console.log(`[BuildSim] ${providerName} raw response:`, text);

        const parsed = parseFinancialJSON(text);
        if (parsed) {
            console.log(`[BuildSim] ✅ ${providerName} returned valid data`);
            return parsed;
        }

        console.error(`[BuildSim] ${providerName} returned unparseable JSON`);
        return null;
    } catch (error) {
        console.error(`[BuildSim] ${providerName} error:`, error);
        return null;
    }
}

// ── POST /api/generate ──────────────────────────────────────────
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const idea = body?.idea;

        if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
            return NextResponse.json(
                { ...FALLBACK_DATA, provider: 'fallback', error: 'No idea provided' },
                { status: 200 }
            );
        }

        // Provider 1: OpenRouter
        const openRouterKey = process.env.OPENROUTER_API_KEY;
        if (openRouterKey) {
            const data = await callLLM(
                'https://openrouter.ai/api/v1/chat/completions',
                openRouterKey,
                'mistralai/mistral-7b-instruct',
                idea.trim(),
                'OpenRouter'
            );
            if (data) {
                return NextResponse.json({ ...data, provider: 'openrouter' });
            }
        } else {
            console.warn('[BuildSim] OPENROUTER_API_KEY not set, skipping');
        }

        // Provider 2: Groq (fallback)
        const groqKey = process.env.GROQ_API_KEY;
        if (groqKey) {
            const data = await callLLM(
                'https://api.groq.com/openai/v1/chat/completions',
                groqKey,
                'llama3-8b-8192',
                idea.trim(),
                'Groq'
            );
            if (data) {
                return NextResponse.json({ ...data, provider: 'groq' });
            }
        } else {
            console.warn('[BuildSim] GROQ_API_KEY not set, skipping');
        }

        // Provider 3: Mock fallback (guaranteed)
        console.log('[BuildSim] ⚠ Both providers failed, using mock fallback');
        return NextResponse.json({ ...FALLBACK_DATA, provider: 'fallback' });
    } catch (error) {
        console.error('[BuildSim] Unexpected error in /api/generate:', error);
        return NextResponse.json(
            { ...FALLBACK_DATA, provider: 'fallback', error: 'Internal error' },
            { status: 200 } // Always 200 — frontend should never see a crash
        );
    }
}
