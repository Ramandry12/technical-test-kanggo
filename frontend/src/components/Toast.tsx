import React from "react";
import { useToastStore, type Toast as ToastType } from "../store/toastStore";
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react";

interface ToastItemProps {
  toast: ToastType;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast }) => {
  const removeToast = useToastStore((state) => state.removeToast);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-400" />,
    info: <Info className="w-5 h-5 text-sky-400" />,
  };

  const colors = {
    success: "bg-emerald-950/90 border-emerald-500/30 text-emerald-100",
    error: "bg-rose-950/90 border-rose-500/30 text-rose-100",
    info: "bg-sky-950/90 border-sky-500/30 text-sky-100",
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl border glass shadow-2xl transition-all duration-300 transform translate-x-0 animate-slide-in ${colors[toast.type]}`}
      style={{ minWidth: "300px", maxWidth: "420px" }}
    >
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <p className="text-sm font-medium flex-grow pr-2">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
      >
        <X className="w-4 h-4 text-slate-400 hover:text-slate-100" />
      </button>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
