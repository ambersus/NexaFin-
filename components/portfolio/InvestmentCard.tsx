'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check, Plus, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { InvestmentItem } from '@/lib/portfolioStore';
import { getFundabilityRating } from '@/lib/fundability';

interface InvestmentCardProps {
    data: Partial<InvestmentItem>;
    onAdd?: () => void;
    isAdded?: boolean;
    showAddButton?: boolean;
}

export const InvestmentCard: React.FC<InvestmentCardProps> = ({
    data,
    onAdd,
    isAdded = false,
    showAddButton = true
}) => {
    const { label, color } = getFundabilityRating(data.fundabilityScore || 0);

    const formatCurrency = (n?: number) => n ? '$' + n.toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 1 }) : 'N/A';

    return (
        <Card className="border-t-4 border-t-blue-500">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white">{data.startupName || 'Startup'}</h3>
                    <p className="text-xs text-blue-400 font-mono">{data.ticker || 'TCKER'}</p>
                </div>
                <div className={`px-2 py-1 rounded bg-gray-800 text-xs font-bold ${color} border border-gray-700`}>
                    {label} ({data.fundabilityScore})
                </div>
            </div>

            <p className="text-gray-400 text-sm mb-6 leading-relaxed min-h-[3rem]">
                {data.thesisSummary}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-950/50 p-3 rounded-lg border border-gray-800">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Valuation</div>
                    <div className="text-lg font-bold text-white">{formatCurrency(data.valuation)}</div>
                </div>
                <div className="bg-gray-950/50 p-3 rounded-lg border border-gray-800">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Ask</div>
                    <div className="text-lg font-bold text-emerald-400">{formatCurrency(data.askAmount)}</div>
                </div>
                <div className="bg-gray-950/50 p-3 rounded-lg border border-gray-800">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Est. ROI</div>
                    <div className="text-sm font-bold text-purple-400">{data.roi}</div>
                </div>
                <div className="bg-gray-950/50 p-3 rounded-lg border border-gray-800">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Risk Profile</div>
                    <div className="text-sm font-bold text-white flex items-center gap-1">
                        {data.risk === 'High' ? <AlertTriangle className="w-3 h-3 text-red-500" /> : <ShieldCheck className="w-3 h-3 text-emerald-500" />}
                        {data.risk}
                    </div>
                </div>
            </div>

            {showAddButton && (
                <Button
                    onClick={onAdd}
                    disabled={isAdded}
                    className={`w-full ${isAdded ? 'bg-emerald-600/20 text-emerald-500 border-emerald-900/50' : ''}`}
                >
                    {isAdded ? (
                        <>
                            <Check className="w-4 h-4 mr-2" />
                            In Portfolio
                        </>
                    ) : (
                        <>
                            <Plus className="w-4 h-4 mr-2" />
                            Add to Portfolio
                        </>
                    )}
                </Button>
            )}
        </Card>
    );
};
