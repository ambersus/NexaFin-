import { NextResponse } from 'next/server';

// ── Fallback advice (guaranteed safe return) ─────────────────────
function getFallbackAdvice(runway: number, burn: number, revenue: number, growth: number) {
    const assessment =
        runway < 10
            ? 'Your startup is in a critical cash position. Immediate cost reduction is essential.'
            : runway < 15
                ? 'Your runway is moderate, but you should begin preparing for fundraising now.'
                : 'Your cash position is relatively healthy. Focus on growth efficiency.';

    return {
        assessment,
        costAdvice:
            burn > revenue
                ? 'Cut non-essential spending immediately. Reduce marketing spend by 30% and renegotiate vendor contracts. Consider moving to a cheaper office or going fully remote.'
                : 'Your burn-to-revenue ratio is manageable. Look for 10-15% cost optimizations in infrastructure and tooling.',
        hiringAdvice:
            growth > 10
                ? 'Growth justifies selective hiring. Focus on revenue-generating roles first — sales and customer success.'
                : 'Freeze non-critical hiring. Only hire for roles that directly impact revenue or product delivery.',
        fundingAdvice:
            runway < 12
                ? 'Start fundraising immediately. You need at least 6 months of runway buffer before approaching investors.'
                : 'Begin investor conversations 4-6 months before you need capital. Build relationships now, close later.',
        investorMemo:
            `Early-stage startup generating $${(revenue / 1000).toFixed(0)}K MRR with ${growth}% monthly growth. Current runway of ${runway} months with a burn rate of $${(burn / 1000).toFixed(0)}K/mo. The team should focus on improving unit economics and reaching profitability milestones before the next raise.`,
        provider: 'fallback',
    };
}

// ── Prompt templates ─────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a startup CFO and venture investor.

Given startup financial metrics and market conditions,
provide realistic financial strategy advice.

Be concise and practical.
Avoid generic motivational language.`;

function buildUserPrompt(body: Record<string, unknown>): string {
    const scenario = body.scenario as Record<string, unknown> || {};
    return `Startup idea: ${body.idea}

Metrics:
Revenue: ${body.revenue}
Burn: ${body.burn}
Runway months: ${body.runway}
Growth: ${body.growth}%
Team size: ${body.team}
Survival score: ${body.survivalScore}

Scenario:
Recession: ${scenario.recession || false}
Ad cost increase: ${scenario.adCostIncrease || 0}%
Hiring increase: ${scenario.hiringIncrease || 0}
Growth slowdown: ${scenario.growthSlowdown || 0}%

Provide:

1. Survival assessment (1–2 sentences)
2. Cost adjustments
3. Hiring advice
4. Funding strategy (when to raise)
5. Investor memo (short paragraph)

Return structured JSON:
{
  "assessment": "...",
  "costAdvice": "...",
  "hiringAdvice": "...",
  "fundingAdvice": "...",
  "investorMemo": "..."
}

Return ONLY JSON.`;
}

// ── JSON parsing with cleanup ────────────────────────────────────
interface AdviceData {
    assessment: string;
    costAdvice: string;
    hiringAdvice: string;
    fundingAdvice: string;
    investorMemo: string;
}

function parseAdviceJSON(text: string): AdviceData | null {
    const tryParse = (s: string): AdviceData | null => {
        try {
            const parsed = JSON.parse(s);
            if (
                typeof parsed.assessment === 'string' &&
                typeof parsed.costAdvice === 'string' &&
                typeof parsed.hiringAdvice === 'string' &&
                typeof parsed.fundingAdvice === 'string' &&
                typeof parsed.investorMemo === 'string'
            ) {
                return parsed;
            }
        } catch { /* continue */ }
        return null;
    };

    // Direct parse
    const direct = tryParse(text);
    if (direct) return direct;

    // Extract from markdown/surrounding text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        const extracted = tryParse(jsonMatch[0]);
        if (extracted) return extracted;
    }

    return null;
}

// ── LLM call helper ─────────────────────────────────────────────
async function callLLM(
    endpoint: string,
    apiKey: string,
    model: string,
    body: Record<string, unknown>,
    providerName: string
): Promise<(AdviceData & { provider: string }) | null> {
    try {
        console.log(`[BuildSim Advice] Trying ${providerName}...`);

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
                    { role: 'user', content: buildUserPrompt(body) },
                ],
                temperature: 0.7,
                max_tokens: 600,
            }),
            signal: AbortSignal.timeout(20000),
        });

        if (!response.ok) {
            console.error(`[BuildSim Advice] ${providerName} HTTP ${response.status}`);
            return null;
        }

        const json = await response.json();
        const text = json?.choices?.[0]?.message?.content?.trim();

        if (!text) {
            console.error(`[BuildSim Advice] ${providerName} returned empty content`);
            return null;
        }

        console.log(`[BuildSim Advice] ${providerName} raw:`, text.slice(0, 200));

        const parsed = parseAdviceJSON(text);
        if (parsed) {
            console.log(`[BuildSim Advice] ✅ ${providerName} returned valid advice`);
            return { ...parsed, provider: providerName.toLowerCase() };
        }

        console.error(`[BuildSim Advice] ${providerName} returned unparseable JSON`);
        return null;
    } catch (error) {
        console.error(`[BuildSim Advice] ${providerName} error:`, error);
        return null;
    }
}

// ── POST /api/advice ────────────────────────────────────────────
export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body?.idea) {
            return NextResponse.json(
                getFallbackAdvice(12, 40000, 25000, 8),
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
                body,
                'OpenRouter'
            );
            if (data) return NextResponse.json(data);
        }

        // Provider 2: Groq
        const groqKey = process.env.GROQ_API_KEY;
        if (groqKey) {
            const data = await callLLM(
                'https://api.groq.com/openai/v1/chat/completions',
                groqKey,
                'llama3-8b-8192',
                body,
                'Groq'
            );
            if (data) return NextResponse.json(data);
        }

        // Fallback
        console.log('[BuildSim Advice] ⚠ Both providers failed, using fallback');
        return NextResponse.json(
            getFallbackAdvice(
                Number(body.runway) || 12,
                Number(body.burn) || 40000,
                Number(body.revenue) || 25000,
                Number(body.growth) || 8
            )
        );
    } catch (error) {
        console.error('[BuildSim Advice] Unexpected error:', error);
        return NextResponse.json(getFallbackAdvice(12, 40000, 25000, 8), { status: 200 });
    }
}
