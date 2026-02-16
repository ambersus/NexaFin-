import { NextResponse } from 'next/server';
import { callAI } from '@/lib/aiClient';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, history } = body;

        // Construct a context-aware system prompt
        // We include history in the prompt context or just use the latest message depending on complexity.
        // For simplicity and speed in this demo, we'll keep it stateless but context-aware.

        const systemPrompt = `You are FinBot, an expert financial AI assistant.
        
        Traits:
        - Professional but approachable
        - Concise answers (max 2-3 sentences unless asked for detail)
        - Focus on startups, investing, and portfolio management
        
        Current User Context:
        - The user is using GenFin, a financial simulation platform.
        - If they ask about "my portfolio", give general advice or ask for specific details as you don't have read access to their live data yet.
        `;

        const response = await callAI(systemPrompt, message);

        return NextResponse.json({
            content: response.content,
            provider: response.provider
        });

    } catch (error) {
        console.error('FinBot API Error:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}
