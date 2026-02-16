'use client';

import React from 'react';
import { StressTestControls } from '@/lib/mockEngine';

interface StressTestPanelProps {
    controls: StressTestControls;
    onChange: (controls: StressTestControls) => void;
}

const StressTestPanel: React.FC<StressTestPanelProps> = ({ controls, onChange }) => {
    const update = (patch: Partial<StressTestControls>) => {
        onChange({ ...controls, ...patch });
    };

    return (
        <div className="bg-gray-800/60 backdrop-blur border border-gray-700 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-1">⚡ Stress Test Controls</h3>
            <p className="text-gray-500 text-sm mb-6">Adjust scenarios to see real-time impact on your startup</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Recession Toggle */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-gray-300 text-sm font-medium">Recession Mode</label>
                        <button
                            onClick={() => update({ recession: !controls.recession })}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${controls.recession ? 'bg-red-500' : 'bg-gray-600'
                                }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${controls.recession ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                    <p className="text-gray-500 text-xs">
                        {controls.recession ? '🔴 Active — burn +15%' : '⚪ Inactive'}
                    </p>
                </div>

                {/* Ad Cost Increase Slider */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-gray-300 text-sm font-medium">Ad Cost Increase</label>
                        <span className="text-blue-400 font-semibold text-sm tabular-nums">
                            +{controls.adCostIncrease}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={50}
                        value={controls.adCostIncrease}
                        onChange={(e) => update({ adCostIncrease: Number(e.target.value) })}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-gray-600 text-xs">
                        <span>0%</span>
                        <span>50%</span>
                    </div>
                </div>

                {/* Hiring Expansion Slider */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-gray-300 text-sm font-medium">Hiring Expansion</label>
                        <span className="text-purple-400 font-semibold text-sm tabular-nums">
                            +{controls.hiringExpansion} {controls.hiringExpansion === 1 ? 'person' : 'people'}
                        </span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={5}
                        step={1}
                        value={controls.hiringExpansion}
                        onChange={(e) => update({ hiringExpansion: Number(e.target.value) })}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <div className="flex justify-between text-gray-600 text-xs">
                        <span>0</span>
                        <span>5</span>
                    </div>
                </div>

                {/* Growth Slowdown Slider */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-gray-300 text-sm font-medium">Growth Slowdown</label>
                        <span className="text-yellow-400 font-semibold text-sm tabular-nums">
                            −{controls.growthSlowdown}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={10}
                        step={1}
                        value={controls.growthSlowdown}
                        onChange={(e) => update({ growthSlowdown: Number(e.target.value) })}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                    />
                    <div className="flex justify-between text-gray-600 text-xs">
                        <span>0%</span>
                        <span>10%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StressTestPanel;
