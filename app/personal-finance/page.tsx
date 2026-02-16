'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { DollarSign, CreditCard, Wallet, TrendingUp } from 'lucide-react';

interface Account {
    id: string;
    name: string;
    type: string;
    balance: number;
}

interface FinanceData {
    accounts: Account[];
    netWorth: number;
    source?: string;
}

export default function PersonalFinancePage() {
    const [data, setData] = useState<FinanceData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await fetch('/api/proxy/accounts');
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const formatCur = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    if (loading) return <div className="p-12 text-center text-gray-500"><Spinner /></div>;
    if (!data) return <div className="p-12 text-center text-red-400">Failed to load finance data.</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2">Personal Finance</h1>
                <p className="text-gray-400">Overview of your connected accounts and net worth.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Net Worth Card */}
                <Card className="md:col-span-3 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-800">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-blue-500/20 rounded-full">
                            <DollarSign className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-blue-300 uppercase tracking-wider font-semibold">Total Net Worth</p>
                            <h2 className="text-4xl font-bold text-white">{formatCur(data.netWorth)}</h2>
                        </div>
                    </div>
                </Card>

                {data.accounts.map((account) => (
                    <Card key={account.id} className="hover:bg-gray-900/80 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-gray-800 rounded-lg">
                                {account.type === 'Crypto' ? <TrendingUp className="w-5 h-5 text-purple-400" /> :
                                    account.type === 'Investment' ? <Wallet className="w-5 h-5 text-emerald-400" /> :
                                        <CreditCard className="w-5 h-5 text-gray-400" />}
                            </div>
                            <span className="text-xs bg-gray-900 px-2 py-1 rounded text-gray-400">{account.type}</span>
                        </div>

                        <h3 className="font-bold text-gray-200 mb-1">{account.name}</h3>
                        <p className="text-2xl font-bold text-white">{formatCur(account.balance)}</p>
                    </Card>
                ))}
            </div>

            {data.source === 'mock' && (
                <div className="text-center text-xs text-gray-600 mt-8">
                    * Displaying simulated data because the secure backend is unreachable.
                </div>
            )}
        </div>
    );
}
