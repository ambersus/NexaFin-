'use client';

import React, { useState } from 'react';
import { Send, Users, AlertTriangle, TrendingUp, Shield, HelpCircle } from 'lucide-react';
import { useToast } from '@/lib/toastStore';

interface AgentAnalysis {
    agentId: string;
    name: string;
    role: string;
    icon: string;
    color: string;
    summary: string;
    recommendation: string;
    riskLevel: number;
    keyPoints: string[];
    provider?: string;
    error?: boolean;
}

const MultiAgentPanel = () => {
    const { addToast } = useToast();

    const [scenario, setScenario] = useState('');
    const [loading, setLoading] = useState(false);
    const [analyses, setAnalyses] = useState<AgentAnalysis[]>([]);

    const handleAnalyze = async () => {
        if (!scenario.trim()) return;

        setLoading(true);
        setAnalyses([]);

        try {
            const res = await fetch('/api/agents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scenario }),
            });

            if (!res.ok) throw new Error('Analysis failed');

            const data = await res.json();
            setAnalyses(data.analyses);
        } catch (error) {
            console.error(error);
            addToast('Failed to run analysis. Check console.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (level: number) => {
        if (level >= 8) return 'text-red-500';
        if (level >= 5) return 'text-yellow-500';
        return 'text-emerald-500';
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8">
            {/* Input Section */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <Users className="w-6 h-6 text-blue-400" />
                    Multi-Agent Council
                </h2>
                <p className="text-gray-400 mb-6">
                    Describe your financial scenario. 5 specialized AI agents will debate it instantly.
                </p>

                <div className="relative">
                    <textarea
                        value={scenario}
                        onChange={(e) => setScenario(e.target.value)}
                        placeholder="e.g. I have $50K saved. Should I invest in a risky startup or safe index funds? I want to retire in 20 years."
                        className="w-full h-32 bg-gray-950 border border-gray-800 rounded-xl p-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={loading || !scenario.trim()}
                        className={`absolute bottom-4 right-4 px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${loading || !scenario.trim()
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                            }`}
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Consulting...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Analyze
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Results Grid */}
            {analyses.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {analyses.map((agent) => (
                        <div
                            key={agent.agentId}
                            className={`bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300 relative overflow-hidden group`}
                        >
                            <div className={`absolute top-0 left-0 w-1 h-full bg-${agent.color}-500 opacity-50`} />

                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">{agent.icon}</div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg leading-tight">{agent.name}</h3>
                                        <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                                            {agent.role}
                                        </span>
                                    </div>
                                </div>
                                <div className={`text-2xl font-black ${getRiskColor(agent.riskLevel)} tooltip`} title="Risk Level (1-10)">
                                    {agent.riskLevel}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Analysis</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {agent.summary}
                                    </p>
                                </div>

                                <div className="bg-gray-950/50 rounded-lg p-3 border border-gray-800">
                                    <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" /> Recommendation
                                    </h4>
                                    <p className="text-white text-sm font-medium">
                                        {agent.recommendation}
                                    </p>
                                </div>

                                {agent.keyPoints && agent.keyPoints.length > 0 && (
                                    <ul className="space-y-1">
                                        {agent.keyPoints.map((point, idx) => (
                                            <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                                                <div className="mt-1 w-1 h-1 rounded-full bg-gray-600 shrink-0" />
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {agent.provider && (
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] text-gray-600 bg-gray-950 px-2 py-1 rounded-full border border-gray-800">
                                        {agent.provider}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiAgentPanel;
