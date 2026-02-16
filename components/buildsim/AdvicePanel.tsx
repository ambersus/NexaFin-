'use client';

import React from 'react';

export interface AdviceData {
    assessment: string;
    costAdvice: string;
    hiringAdvice: string;
    fundingAdvice: string;
    investorMemo: string;
    provider?: string;
}

interface AdvicePanelProps {
    advice: AdviceData | null;
    loading: boolean;
    loadingText?: string;
}

const sections: { key: keyof AdviceData; label: string; icon: string; color: string }[] = [
    { key: 'assessment', label: 'Survival Assessment', icon: '🎯', color: 'border-blue-500/40' },
    { key: 'costAdvice', label: 'Cost Adjustments', icon: '✂️', color: 'border-red-500/40' },
    { key: 'hiringAdvice', label: 'Hiring Strategy', icon: '👥', color: 'border-purple-500/40' },
    { key: 'fundingAdvice', label: 'Funding Timeline', icon: '💰', color: 'border-emerald-500/40' },
    { key: 'investorMemo', label: 'Investor Memo', icon: '📄', color: 'border-yellow-500/40' },
];

const AdvicePanel: React.FC<AdvicePanelProps> = ({ advice, loading, loadingText }) => {
    if (loading) {
        return (
            <div className="bg-gray-800/60 backdrop-blur border border-gray-700 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-white mb-2">🧠 AI CFO Advisor</h3>
                <p className="text-gray-400 text-sm mb-4">{loadingText || 'Analyzing...'}</p>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-4 bg-gray-700 rounded w-1/3 mb-2" />
                            <div className="h-3 bg-gray-700/60 rounded w-full mb-1" />
                            <div className="h-3 bg-gray-700/60 rounded w-4/5" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!advice) return null;

    return (
        <div className="bg-gray-800/60 backdrop-blur border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">🧠 AI CFO Advisor</h3>
                {advice.provider && (
                    <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded">
                        via {advice.provider}
                    </span>
                )}
            </div>

            <div className="space-y-5">
                {sections.map(({ key, label, icon, color }) => {
                    const text = advice[key];
                    if (!text || key === 'provider') return null;
                    return (
                        <div
                            key={key}
                            className={`border-l-2 ${color} pl-4 transition-all duration-300`}
                        >
                            <h4 className="text-sm font-semibold text-gray-300 mb-1">
                                {icon} {label}
                            </h4>
                            <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdvicePanel;
