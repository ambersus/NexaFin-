import { useState, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

// Simple event bus for toasts since we want to use it outside components too
type Listener = (toasts: Toast[]) => void;
let listeners: Listener[] = [];
let toasts: Toast[] = [];

export const toastStore = {
    add: (message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { id, message, type };
        toasts = [...toasts, newToast];
        emit();

        // Auto dismiss
        setTimeout(() => {
            toastStore.dismiss(id);
        }, 3000);
    },
    dismiss: (id: string) => {
        toasts = toasts.filter(t => t.id !== id);
        emit();
    },
    subscribe: (listener: Listener) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    },
    getToasts: () => toasts
};

function emit() {
    listeners.forEach(l => l(toasts));
}

// Hook for React components
export function useToast() {
    const [activeToasts, setActiveToasts] = useState<Toast[]>(toastStore.getToasts());

    useEffect(() => {
        return toastStore.subscribe((updatedToasts) => {
            setActiveToasts(updatedToasts);
        });
    }, []);

    return { toasts: activeToasts, addToast: toastStore.add, dismissToast: toastStore.dismiss };
}
