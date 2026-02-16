import { NextResponse } from 'next/server';
import { generateText } from '@/lib/aiClient'; // Assuming this exists from Phase 2
import { AGENTS } from '@/lib/agents';

export async function POST(request: Request) {
    try {
        const { scenario } = await request.json();

        if (!scenario) {
            return NextResponse.json({ error: 'Scenario is required' }, { status: 400 });
        }

        // We select 3 disparate agents for a lively debate
        const debateAgents = AGENTS.filter(a => ['cfo', 'vc', 'trader'].includes(a.id));

        // Round 1: Initial Opinions
        const round1Promises = debateAgents.map(async (agent) => {
            const prompt = `
                You are playing the role of a ${agent.name} (${agent.role}).
                Your personality: ${agent.systemPrompt}
                
                The user has presented this scenario: "${scenario}"
                
                Give your initial, strong opinion on this in 2 short sentences. 
                Be true to your persona.
            `;

            const response = await generateText(prompt);
            return {
                agent: agent.name,
                role: agent.role,
                icon: agent.icon,
                color: agent.color,
                message: response || "I'm analyzing the numbers...",
                round: 1
            };
        });

        const round1Results = await Promise.all(round1Promises);

        // Round 2: Rebuttal
        // Each agent sees the others' opinions and completely disagrees
        const round2Promises = debateAgents.map(async (agent, index) => {
            // Find an opinion to attack (the next agent in the list, cyclic)
            const target = round1Results[(index + 1) % round1Results.length];

            const prompt = `
                You are a ${agent.name}. 
                The ${target.role} just said: "${target.message}".
                
                You completely disagree. Attack their logic based on your ${agent.role} perspective.
                Keep it punchy, strictly 1 sentence.
            `;

            const response = await generateText(prompt);
            return {
                agent: agent.name,
                role: agent.role,
                icon: agent.icon,
                color: agent.color,
                message: response || "That's ridiculous.",
                round: 2,
                replyingTo: target.role
            };
        });

        const round2Results = await Promise.all(round2Promises);

        // Consensus
        const consensusPrompt = `
            Analyze these opinions on "${scenario}":
            ${round1Results.map(r => `${r.role}: ${r.message}`).join('\n')}
            
            Synthesize a balanced, final verdict that acknowledges the risks but provides a clear path forward.
            Max 2 sentences.
        `;
        const consensus = await generateText(consensusPrompt);

        return NextResponse.json({
            rounds: [...round1Results, ...round2Results],
            consensus: consensus || "Procedural consensus: Diversify and mitigate risks."
        });

    } catch (error) {
        console.error("Debate Error:", error);
        return NextResponse.json({
            rounds: [],
            consensus: "The board could not reach a quorum. Please try again."
        }, { status: 500 });
    }
}
