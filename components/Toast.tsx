import React, { useEffect } from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-[2000] flex flex-col gap-2 max-w-sm w-full pointer-events-none" dir="rtl">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 bg-gray-900/95 text-white backdrop-blur-md rounded-2xl shadow-xl border border-gray-700/60 animate-slideUp">
      <div className="flex items-center gap-2.5">
        {toast.type === 'warning' ? (
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
        ) : toast.type === 'info' ? (
          <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        )}
        <span className="text-xs font-semibold leading-relaxed">{toast.text}</span>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors flex-shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default ToastContainer;
