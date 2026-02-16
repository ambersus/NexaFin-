'use client';

import React from 'react';
import { useToast } from '@/lib/toastStore';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const ToastProvider = () => {
    const { toasts, dismissToast } = useToast();

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        className="pointer-events-auto min-w-[300px] max-w-sm bg-gray-900/90 backdrop-blur-md border border-gray-800 rounded-lg shadow-xl p-4 flex items-start gap-3 relative overflow-hidden"
                    >
                        {/* Status Line */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${toast.type === 'success' ? 'bg-emerald-500' :
                                toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                            }`} />

                        <div className="mt-0.5">
                            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
                            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
                        </div>

                        <div className="flex-1">
                            <h4 className={`text-sm font-bold ${toast.type === 'success' ? 'text-emerald-400' :
                                    toast.type === 'error' ? 'text-red-400' : 'text-blue-400'
                                }`}>
                                {toast.type === 'success' ? 'Success' :
                                    toast.type === 'error' ? 'Error' : 'Update'}
                            </h4>
                            <p className="text-sm text-gray-300 leading-tight mt-1">
                                {toast.message}
                            </p>
                        </div>

                        <button
                            onClick={() => dismissToast(toast.id)}
                            className="text-gray-500 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
