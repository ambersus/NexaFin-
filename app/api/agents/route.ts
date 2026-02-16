import { NextResponse } from 'next/server';
import { AGENTS } from '@/lib/agents';
import { callAI } from '@/lib/aiClient';

export async function POST(request: Request) {
    try {
        const { scenario } = await request.json();

        if (!scenario) {
            return NextResponse.json(
                { error: 'Scenario is required' },
                { status: 400 }
            );
        }

        // Run all agents in parallel
        const agentPromises = AGENTS.map(async (agent) => {
            try {
                const response = await callAI(agent.systemPrompt, scenario);

                let parsedContent;
                try {
                    // Attempt to parse JSON from AI response
                    // Sometimes AI might wrap JSON in markdown code blocks, strip them
                    const cleanJson = response.content.replace(/```json/g, '').replace(/```/g, '').trim();
                    parsedContent = JSON.parse(cleanJson);
                } catch (e) {
                    console.error(`Failed to parse JSON for agent ${agent.id}:`, e);
                    parsedContent = {
                        summary: "AI response format error.",
                        recommendation: "Consult raw logs.",
                        riskLevel: 5,
                        keyPoints: ["Format Error"]
                    };
                }

                return {
                    agentId: agent.id,
                    name: agent.name,
                    icon: agent.icon,
                    role: agent.role,
                    color: agent.color,
                    provider: response.provider,
                    ...parsedContent,
                };
            } catch (error) {
                console.error(`Agent ${agent.id} failed:`, error);
                return {
                    agentId: agent.id,
                    name: agent.name,
                    icon: agent.icon,
                    role: agent.role,
                    color: agent.color,
                    summary: "Agent failed to respond.",
                    recommendation: "System error.",
                    riskLevel: 0,
                    keyPoints: [],
                    error: true,
                };
            }
        });

        const analyses = await Promise.all(agentPromises);

        return NextResponse.json({ analyses });

    } catch (error) {
        console.error('Multi-agent API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
