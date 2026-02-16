import { NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/backendClient';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol required' }, { status: 400 });
    }

    // Try actual ML Backend
    const backendData = await fetchBackend<any>(`/api/predict/${symbol}`);
    if (backendData) {
        return NextResponse.json(backendData);
    }

    // Fallback Mock Prediction
    // Deterministic "random" based on symbol char codes
    const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rand = (seed % 100) / 100;

    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    let prediction = 'Hold';
    let confidence = 50 + (rand * 40); // 50-90%

    if (rand > 0.6) prediction = 'Buy';
    else if (rand < 0.3) prediction = 'Sell';

    return NextResponse.json({
        symbol: symbol.toUpperCase(),
        prediction,
        confidence,
        trend: rand > 0.5 ? 'Up' : 'Down',
        source: 'mock'
    });
}
