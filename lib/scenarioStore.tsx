'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { runScenarioSimulation, ScenarioResult } from './scenarioEngine';

export interface Scenario {
    id: string;
    name: string;
    type: 'startup' | 'invest' | 'hybrid';
    inputs: {
        capital: number;
        monthlyContribution: number;
        riskProfile: 'low' | 'medium' | 'high';
    };
    result: ScenarioResult;
    aiAnalysis?: string;
}

interface ScenarioContextType {
    scenarios: Scenario[];
    addScenario: (s: Omit<Scenario, 'id' | 'result'>) => void;
    removeScenario: (id: string) => void;
    runComparison: () => void;
}

const ScenarioContext = createContext<ScenarioContextType | undefined>(undefined);

export function ScenarioProvider({ children }: { children: ReactNode }) {
    const [scenarios, setScenarios] = useState<Scenario[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('genfin_scenarios');
        if (stored) {
            try {
                setScenarios(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to load scenarios', e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('genfin_scenarios', JSON.stringify(scenarios));
    }, [scenarios]);

    const addScenario = (input: Omit<Scenario, 'id' | 'result'>) => {
        const result = runScenarioSimulation(
            input.type,
            input.inputs.capital,
            input.inputs.monthlyContribution,
            input.inputs.riskProfile
        );
        const newScenario: Scenario = {
            ...input,
            id: Date.now().toString(),
            result,
            aiAnalysis: "Select 'Compare' to analyze."
        };
        setScenarios(prev => [...prev, newScenario]);
    };

    const removeScenario = (id: string) => {
        setScenarios(prev => prev.filter(s => s.id !== id));
    };

    const runComparison = () => {
        setScenarios(prev => prev.map(s => ({
            ...s,
            aiAnalysis: s.type === 'startup'
                ? 'High risk, potentially high reward. Success depends on execution.'
                : 'Steady growth expected. Good for wealth preservation.'
        })));
    };

    return (
        <ScenarioContext.Provider value={{scenarios, addScenario, removeScenario, runComparison}}>
            {children}
        </ScenarioContext.Provider>
    );
}

export function useScenarios() {
    const context = useContext(ScenarioContext);
    if (!context) throw new Error('useScenarios must be used within ScenarioProvider');
    return context;
}
