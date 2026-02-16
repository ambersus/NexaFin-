'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useScenarios } from '@/lib/scenarioStore';
import { PlusCircle } from 'lucide-react';

export const ScenarioBuilder = () => {
    const { addScenario } = useScenarios();
    const [formData, setFormData] = useState({
        name: '',
        type: 'invest' as 'invest' | 'startup' | 'hybrid',
        capital: 10000,
        monthlyContribution: 500,
        riskProfile: 'medium' as 'low' | 'medium' | 'high'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return;

        addScenario({
            name: formData.name,
            type: formData.type,
            inputs: {
                capital: Number(formData.capital),
                monthlyContribution: Number(formData.monthlyContribution),
                riskProfile: formData.riskProfile
            }
        });

        // Reset name for next entry
        setFormData(prev => ({ ...prev, name: '' }));
    };

    return (
        <Card className="h-full">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-400" />
                New Scenario
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-gray-300">Scenario Name</label>
                    <input
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. Quit job & start business"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-300">Type</label>
                        <select
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                        >
                            <option value="invest">Market Investment</option>
                            <option value="startup">Startup Venture</option>
                            <option value="hybrid">Hybrid Approach</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300">Risk Profile</label>
                        <select
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white"
                            value={formData.riskProfile}
                            onChange={e => setFormData({ ...formData, riskProfile: e.target.value as any })}
                        >
                            <option value="low">Low (Conservative)</option>
                            <option value="medium">Medium (Balanced)</option>
                            <option value="high">High (Aggressive)</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-300">Initial Capital ($)</label>
                        <input
                            type="number"
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white"
                            value={formData.capital}
                            onChange={e => setFormData({ ...formData, capital: Number(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300">Monthly Add ($)</label>
                        <input
                            type="number"
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white"
                            value={formData.monthlyContribution}
                            onChange={e => setFormData({ ...formData, monthlyContribution: Number(e.target.value) })}
                        />
                    </div>
                </div>

                <Button type="submit" className="w-full mt-4">
                    Create Scenario
                </Button>
            </form>
        </Card>
    );
};
