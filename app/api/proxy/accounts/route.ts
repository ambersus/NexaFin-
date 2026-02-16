import { NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/backendClient';

export async function GET() {
    // Try Backend
    const backendData = await fetchBackend<any>('/api/accounts');

    if (backendData) {
        return NextResponse.json(backendData);
    }

    // Fallback Mock Accounts
    return NextResponse.json({
        accounts: [
            { id: '1', name: 'Chase Checking', type: 'Checking', balance: 5430.50 },
            { id: '2', name: 'Chase Savings', type: 'Savings', balance: 12500.00 },
            { id: '3', name: 'Robinhood', type: 'Investment', balance: 8450.25 },
            { id: '4', name: 'Coinbase', type: 'Crypto', balance: 3200.75 },
        ],
        netWorth: 29581.50,
        source: 'mock'
    });
}
