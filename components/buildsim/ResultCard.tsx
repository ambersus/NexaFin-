import React from 'react';

interface ResultCardProps {
    title: string;
    children?: React.ReactNode;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, children }) => {
    return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
            <div className="text-gray-400">
                {children || <p className="italic opacity-50">Waiting for input...</p>}
            </div>
        </div>
    );
};

export default ResultCard;
