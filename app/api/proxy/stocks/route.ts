import { NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/backendClient';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol required' }, { status: 400 });
    }

    // Try Backend
    const backendData = await fetchBackend<any>(`/api/stocks/${symbol}`);

    if (backendData) {
        return NextResponse.json(backendData);
    }

    // Fallback Mock Data
    const mockPrice = (Math.random() * 1000) + 50;
    const mockChange = (Math.random() * 10) - 4;

    return NextResponse.json({
        symbol: symbol.toUpperCase(),
        price: Number(mockPrice.toFixed(2)),
        change: Number(mockChange.toFixed(2)),
        percent: Number((mockChange / mockPrice * 100).toFixed(2)),
        source: 'mock'
    });
}
