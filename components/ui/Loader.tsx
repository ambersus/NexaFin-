import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface LoaderProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ className, size = 'md', text }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
            <Loader2 className={cn("animate-spin text-blue-500", sizeClasses[size])} />
            {text && <p className="text-sm text-gray-400 animate-pulse">{text}</p>}
        </div>
    );
};
