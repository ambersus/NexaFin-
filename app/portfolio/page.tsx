'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@/lib/portfolioStore';
import { InvestmentCard } from '@/components/portfolio/InvestmentCard';
import { PortfolioView } from '@/components/portfolio/PortfolioView';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PieChart, Download, Plus, Wand2, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { GeneratedPortfolio } from '@/lib/portfolioStore';
import { DEMO_PRESETS } from '@/lib/demoData';
import { Confetti } from '@/components/ui/Confetti';
import { useToast } from '@/lib/toastStore';

export default function PortfolioPage() {
    const { investments, isLoading, generatedPortfolio, setGeneratedPortfolio } = usePortfolio();
    const [isGenerating, setIsGenerating] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        amount: 10000,
        risk: 'Medium',
        horizon: '10 Years',
        goal: 'Wealth Growth'
    });

    const { addToast } = useToast();
    const [showConfetti, setShowConfetti] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setShowConfetti(false);
        try {
            const res = await fetch('/api/portfolio/generate', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            const newPortfolio: GeneratedPortfolio = {
                ...data,
                totalAmount: Number(formData.amount)
            };
            setGeneratedPortfolio(newPortfolio);
            setShowConfetti(true);
            addToast('Portfolio Strategy Generated!', 'success');
        } catch (e) {
            console.error(e);
            addToast('Failed to generate portfolio.', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    if (isLoading) return <div className="p-10 text-center text-gray-500">Loading portfolio...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-12 relative">
            <Confetti active={showConfetti} />

            {/* ── Section 1: Dashboard Header ── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Portfolio Manager</h1>
                    <p className="text-gray-400 mt-1">Unified view of Startup Investments & AI Strategies.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/startup-builder">
                        <Button variant="primary" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            New Startup Deal
                        </Button>
                    </Link>
                </div>
            </div>

            {/* ── Section 2: AI Portfolio Generator ── */}
            <section>
                {!generatedPortfolio ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Intro / Upsell */}
                        <div className="lg:col-span-1 space-y-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Wand2 className="w-5 h-5 text-blue-400" />
                                AI Wealth Architect
                            </h2>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Let our multi-agent AI design a personalized asset allocation strategy for you.
                                It balances stocks, bonds, and alternative assets based on your unique risk profile.
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                                onClick={() => {
                                    setFormData({ ...DEMO_PRESETS.PORTFOLIO, amount: 50000 });
                                }}
                            >
                                <Wand2 className="w-3 h-3 mr-2" />
                                Load Demo Profile
                            </Button>
                            <div className="p-4 bg-blue-900/10 border border-blue-900/30 rounded-lg">
                                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Features</div>
                                <ul className="space-y-2 text-sm text-gray-300">
                                    <li className="flex items-center gap-2">✓ Instant Custom Strategy</li>
                                    <li className="flex items-center gap-2">✓ ML-Powered Stock Signals</li>
                                    <li className="flex items-center gap-2">✓ Recession Stress Testing</li>
                                </ul>
                            </div>
                        </div>

                        {/* Input Form */}
                        <Card className="lg:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Investment Amount ($)</label>
                                    <input
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Risk Tolerance</label>
                                    <select
                                        value={formData.risk}
                                        onChange={(e) => setFormData({ ...formData, risk: e.target.value })}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                        <option>Degen</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Time Horizon</label>
                                    <select
                                        value={formData.horizon}
                                        onChange={(e) => setFormData({ ...formData, horizon: e.target.value })}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option>1-3 Years</option>
                                        <option>5-10 Years</option>
                                        <option>10-20 Years</option>
                                        <option>20+ Years</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Primary Goal</label>
                                    <input
                                        type="text"
                                        value={formData.goal}
                                        onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={handleGenerate}
                                isLoading={isGenerating}
                                className="w-full h-12 text-lg"
                            >
                                Generate Portfolio Strategy
                            </Button>
                        </Card>
                    </div>
                ) : (
                    <PortfolioView
                        portfolio={generatedPortfolio}
                        onReset={() => setGeneratedPortfolio(null)}
                    />
                )}
            </section>

            {/* ── Section 3: Startup Investments ── */}
            <section className="pt-8 border-t border-gray-800">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-emerald-400" />
                    Venture Capital Holdings
                </h2>

                {investments.length === 0 ? (
                    <div className="text-center py-10 bg-gray-900/30 rounded-xl border border-dashed border-gray-800">
                        <p className="text-gray-500">No startup investments yet. Use the Startup Builder to generate deals.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {investments.map((item) => (
                            <InvestmentCard
                                key={item.id}
                                data={item}
                                showAddButton={false}
                            />
                        ))}
                    </div>
                )}
            </section>

        </div>
    );
}
