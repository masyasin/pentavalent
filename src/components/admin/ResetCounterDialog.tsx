import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ResetCounterDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    currentCount: number;
    isLoading?: boolean;
}

const ResetCounterDialog: React.FC<ResetCounterDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    currentCount,
    isLoading = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-slideUp">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <RotateCcw className="text-orange-600" size={32} />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black text-gray-900 text-center mb-3 tracking-tight">
                    Reset Visitor Counter?
                </h3>

                {/* Description */}
                <div className="space-y-3 mb-8">
                    <p className="text-gray-600 text-center leading-relaxed">
                        You are about to reset the global visitor counter from{' '}
                        <span className="font-black text-orange-600">{currentCount.toLocaleString()}</span>{' '}
                        to <span className="font-black text-gray-900">0</span>.
                    </p>

                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-orange-900">Important Note:</p>
                                <p className="text-sm text-orange-700">
                                    This will only reset the counter display. Visitor logs in analytics will remain intact.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-6 py-3.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-orange-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Resetting...
                            </>
                        ) : (
                            <>
                                <RotateCcw size={18} />
                                Reset to 0
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetCounterDialog;
