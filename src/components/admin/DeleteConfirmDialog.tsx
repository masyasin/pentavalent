import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X, AlertCircle } from 'lucide-react';

interface DeleteConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    itemName?: string;
    isLoading?: boolean;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Deletion",
    message = "Are you sure you want to permanently delete this item? This action cannot be undone.",
    itemName,
    isLoading = false
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md"
                    />

                    {/* Dialog Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        {/* Warning Top Accent */}
                        <div className="h-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>

                        <div className="p-8 md:p-10">
                            {/* Header Icon */}
                            <div className="flex justify-center mb-8">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-[2rem] bg-red-50 flex items-center justify-center text-red-500 animate-pulse">
                                        <Trash2 size={40} />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-10 h-10 rounded-2xl bg-white shadow-xl border border-red-100 flex items-center justify-center text-red-600">
                                        <AlertTriangle size={20} />
                                    </div>
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="text-center space-y-4">
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
                                    {title}
                                </h3>
                                <div className="space-y-3">
                                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                        {message}
                                    </p>
                                    {itemName && (
                                        <div className="inline-block px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl">
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Target Item</p>
                                            <p className="text-red-600 font-bold tracking-tight">{itemName}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-10">
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex-1 px-8 py-4 border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all uppercase tracking-widest text-[10px] active:scale-95 disabled:opacity-50"
                                >
                                    Return Back
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onConfirm();
                                    }}
                                    disabled={isLoading}
                                    className="flex-[1.5] px-8 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-200 flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] active:scale-95 disabled:opacity-50 group"
                                >
                                    {isLoading ? (
                                        <RefreshCw className="animate-spin" size={16} />
                                    ) : (
                                        <>
                                            <Trash2 size={16} className="group-hover:rotate-12 transition-transform" />
                                            CONFIRM DELETE
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Close Icon (Top Right) */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors"
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Subtle Patterns */}
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-50"></div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// Help for icons
const RefreshCw = ({ className, size }: { className?: string, size?: number }) => (
    <svg
        className={className}
        width={size} height={size}
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
        <path d="M21 2v6h-6m-9 10H2v-6h6m10.1-9.1a9 9 0 1 0 2 12" />
    </svg>
);

export default DeleteConfirmDialog;
