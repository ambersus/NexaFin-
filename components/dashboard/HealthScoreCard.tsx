import React from 'react';
import { Card } from '@/components/ui/Card';
import { Activity, TrendingUp, Shield, Wallet } from 'lucide-react';
import { HealthScoreResult } from '@/lib/healthScore';

interface HealthScoreCardProps {
    scoreData: HealthScoreResult;
}

export function HealthScoreCard({ scoreData }: HealthScoreCardProps) {
    const { totalScore, grade, metrics, summary } = scoreData;

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-400';
        if (score >= 60) return 'text-blue-400';
        if (score >= 40) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getProgressColor = (score: number) => {
        if (score >= 80) return 'bg-emerald-500';
        if (score >= 60) return 'bg-blue-500';
        if (score >= 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <Card className="relative overflow-hidden border-t-4 border-t-blue-500">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <Activity className="w-32 h-32" />
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">

                {/* Score Circle / Hero */}
                <div className="flex flex-col items-center justify-center min-w-[120px]">
                    <div className={`text-6xl font-black ${getScoreColor(totalScore)}`}>
                        {totalScore}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gray-800 ${getScoreColor(totalScore)}`}>
                        Grade {grade}
                    </div>
                </div>

                {/* Metrics */}
                <div className="flex-1 w-full space-y-4">
                    <div>
                        <h3 className="text-lg font-bold text-white">Financial Health Score</h3>
                        <p className="text-gray-400 text-sm">{summary}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <MetricBar label="Liquidity" value={metrics.liquidity} icon={Wallet} color={getProgressColor(metrics.liquidity)} />
                        <MetricBar label="Stability" value={metrics.stability} icon={Shield} color={getProgressColor(metrics.stability)} />
                        <MetricBar label="Growth" value={metrics.growth} icon={TrendingUp} color={getProgressColor(metrics.growth)} />
                        <MetricBar label="Solvency" value={metrics.solvency} icon={Activity} color={getProgressColor(metrics.solvency)} />
                    </div>
                </div>
            </div>
        </Card>
    );
}

const MetricBar = ({ label, value, icon: Icon, color }: { label: string, value: number, icon: any, color: string }) => (
    <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
                <Icon className="w-3 h-3" />
                {label}
            </div>
            <span>{value}/100</span>
        </div>
        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
            <div
                className={`h-full rounded-full transition-all duration-1000 ${color}`}
                style={{ width: `${value}%` }}
            />
        </div>
    </div>
);
