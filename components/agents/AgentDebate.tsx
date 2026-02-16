import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { MessageSquare, Users, Gavel } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface DebateMessage {
    agent: string;
    role: string;
    icon: string;
    color: string;
    message: string;
    round: number;
    replyingTo?: string;
}

interface DebateResult {
    rounds: DebateMessage[];
    consensus: string;
}

export function AgentDebate() {
    const [scenario, setScenario] = useState('');
    const [result, setResult] = useState<DebateResult | null>(null);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleDebate = async () => {
        if (!scenario.trim()) return;
        setLoading(true);
        setResult(null);

        try {
            const res = await fetch('/api/agents/debate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scenario })
            });
            const data = await res.json();
            setResult(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Auto-scroll to bottom of debate
    useEffect(() => {
        if (result && scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [result]);

    const getColorClass = (color: string) => {
        switch (color) {
            case 'blue': return 'bg-blue-900/40 border-blue-800 text-blue-100';
            case 'purple': return 'bg-purple-900/40 border-purple-800 text-purple-100';
            case 'emerald': return 'bg-emerald-900/40 border-emerald-800 text-emerald-100';
            case 'red': return 'bg-red-900/40 border-red-800 text-red-100';
            case 'orange': return 'bg-orange-900/40 border-orange-800 text-orange-100';
            default: return 'bg-gray-800 border-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Users className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">The Boardroom Debate</h2>
                        <p className="text-sm text-gray-400">Pit agents against each other to find the truth.</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <input
                        type="text"
                        value={scenario}
                        onChange={(e) => setScenario(e.target.value)}
                        placeholder="e.g. Should I dump my savings into Bitcoin?"
                        className="flex-1 bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <Button
                        onClick={handleDebate}
                        isLoading={loading}
                        className="bg-indigo-600 hover:bg-indigo-700"
                    >
                        Start Debate
                    </Button>
                </div>
            </div>

            {loading && (
                <div className="py-12 flex flex-col items-center justify-center">
                    <Loader size="lg" text="Agents are arguing..." />
                </div>
            )}

            {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Round 1 */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider justify-center">
                            <span>Round 1: Initial Takes</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {result.rounds.filter(r => r.round === 1).map((msg, i) => (
                                <div key={i} className={`p-4 rounded-xl border ${getColorClass(msg.color)}`}>
                                    <div className="flex items-center gap-2 mb-2 font-bold">
                                        <span>{msg.icon}</span>
                                        <span>{msg.role}</span>
                                    </div>
                                    <p className="text-sm leading-relaxed">&ldquo;{msg.message}&rdquo;</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Round 2 */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider justify-center">
                            <span>Round 2: Crossfire</span>
                        </div>
                        <div className="space-y-3">
                            {result.rounds.filter(r => r.round === 2).map((msg, i) => (
                                <div key={i} className={`flex gap-3 ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl border ${getColorClass(msg.color)}`}>
                                        <div className="text-xs opacity-70 mb-1 flex items-center gap-1">
                                            {msg.icon} {msg.role}
                                            <span className="text-red-400">disagrees with {msg.replyingTo}</span>
                                        </div>
                                        <p className="text-sm">&ldquo;{msg.message}&rdquo;</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Verdict */}
                    <div ref={scrollRef} className="pt-4">
                        <div className="bg-gradient-to-r from-emerald-900/40 to-blue-900/40 border border-emerald-500/30 p-6 rounded-xl text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-emerald-500/5 animate-pulse"></div>
                            <Gavel className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                            <h3 className="text-lg font-bold text-white mb-2">Final Consensus</h3>
                            <p className="text-emerald-100 text-lg font-medium leading-relaxed">
                                {result.consensus}
                            </p>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
