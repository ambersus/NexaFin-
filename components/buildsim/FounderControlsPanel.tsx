'use client';

import React from 'react';
import { FounderControls } from '@/lib/mockEngine';

interface FounderControlsPanelProps {
    controls: FounderControls;
    aiCash: number;
    onChange: (controls: FounderControls) => void;
}

const FounderControlsPanel: React.FC<FounderControlsPanelProps> = ({
    controls,
    aiCash,
    onChange,
}) => {
    const update = (patch: Partial<FounderControls>) => {
        onChange({ ...controls, ...patch });
    };

    const formatCurrency = (n: number) => '$' + n.toLocaleString('en-US');

    return (
        <div className="bg-gray-800/60 backdrop-blur border border-gray-700 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-1">🎛️ Founder Controls</h3>
            <p className="text-gray-500 text-sm mb-6">
                Override AI assumptions with your own numbers
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Starting Capital */}
                <div className="space-y-2">
                    <label className="text-gray-300 text-sm font-medium block">
                        Starting Capital ($)
                    </label>
                    <p className="text-gray-500 text-xs">Override AI estimate</p>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                        <input
                            type="number"
                            min={0}
                            step={10000}
                            value={controls.startingCapital !== null ? controls.startingCapital : ''}
                            placeholder={aiCash.toLocaleString('en-US')}
                            onChange={(e) => {
                                const val = e.target.value;
                                update({
                                    startingCapital: val === '' ? null : Math.max(0, Number(val)),
                                });
                            }}
                            className="w-full pl-7 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    {controls.startingCapital !== null && (
                        <button
                            onClick={() => update({ startingCapital: null })}
                            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            ↩ Reset to AI value ({formatCurrency(aiCash)})
                        </button>
                    )}
                </div>

                {/* Planned Hires */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-gray-300 text-sm font-medium">Planned Hires</label>
                        <span className="text-purple-400 font-semibold text-sm tabular-nums">
                            {controls.plannedHires} {controls.plannedHires === 1 ? 'person' : 'people'}
                        </span>
                    </div>
                    <p className="text-gray-500 text-xs">Next 6 months (+$9K/mo each)</p>
                    <input
                        type="range"
                        min={0}
                        max={10}
                        step={1}
                        value={controls.plannedHires}
                        onChange={(e) => update({ plannedHires: Number(e.target.value) })}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <div className="flex justify-between text-gray-600 text-xs">
                        <span>0</span>
                        <span>10</span>
                    </div>
                </div>

                {/* Monthly Marketing Budget */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-gray-300 text-sm font-medium">Marketing Budget</label>
                        <span className="text-emerald-400 font-semibold text-sm tabular-nums">
                            {formatCurrency(controls.marketingBudget)}/mo
                        </span>
                    </div>
                    <p className="text-gray-500 text-xs">
                        Adds to burn, boosts growth (+{Math.min(controls.marketingBudget / 20000, 5).toFixed(1)}%)
                    </p>
                    <input
                        type="range"
                        min={0}
                        max={50000}
                        step={1000}
                        value={controls.marketingBudget}
                        onChange={(e) => update({ marketingBudget: Number(e.target.value) })}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-gray-600 text-xs">
                        <span>$0</span>
                        <span>$50K</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FounderControlsPanel;
