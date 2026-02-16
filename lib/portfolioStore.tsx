'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface InvestmentItem {
    id: string;
    startupName: string;
    ticker: string;
    valuation: number;
    askAmount: number;
    equity: number;
    shares: number;
    costBasis: number;
    thesisSummary: string;
    fundabilityScore: number;
    risk: string;
    roi: string;
    dateAdded: string;
}

export interface GeneratedAsset {
    symbol: string;
    name: string;
    percentage: number;
    type: string;
    reasoning: string;
    prediction?: any;
}

export interface GeneratedPortfolio {
    strategyName: string;
    description: string;
    expectedReturn: string;
    riskScore: number;
    allocation: GeneratedAsset[];
    totalAmount: number;
}

interface PortfolioContextType {
    investments: InvestmentItem[];
    addInvestment: (item: InvestmentItem) => void;
    removeInvestment: (id: string) => void;
    isLoading: boolean;
    generatedPortfolio: GeneratedPortfolio | null;
    setGeneratedPortfolio: (portfolio: GeneratedPortfolio | null) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
    const [investments, setInvestments] = useState<InvestmentItem[]>([]);
    const [generatedPortfolio, setGeneratedPortfolio] = useState<GeneratedPortfolio | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('genfin_portfolio');
            const storedGen = localStorage.getItem('genfin_generated_portfolio');
            if (stored) setInvestments(JSON.parse(stored));
            if (storedGen) setGeneratedPortfolio(JSON.parse(storedGen));
        } catch (e) {
            console.error('Failed to load portfolio', e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('genfin_portfolio', JSON.stringify(investments));
            if (generatedPortfolio) {
                localStorage.setItem('genfin_generated_portfolio', JSON.stringify(generatedPortfolio));
            } else {
                localStorage.removeItem('genfin_generated_portfolio');
            }
        }
    }, [investments, generatedPortfolio, isLoading]);

    const addInvestment = (item: InvestmentItem) => {
        setInvestments((prev) => [...prev, item]);
    };

    const removeInvestment = (id: string) => {
        setInvestments((prev) => prev.filter((i) => i.id !== id));
    };

    return (
        <PortfolioContext.Provider value={{investments, addInvestment, removeInvestment, isLoading, generatedPortfolio, setGeneratedPortfolio}}>
            {children}
        </PortfolioContext.Provider>
    );
}

export function usePortfolio() {
    const context = useContext(PortfolioContext);
    if (context === undefined) {
        throw new Error('usePortfolio must be used within a PortfolioProvider');
    }
    return context;
}
