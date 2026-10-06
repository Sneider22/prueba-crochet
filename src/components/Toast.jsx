import React from 'react';
import { ShoppingBag, Sparkles, X, ArrowRight } from 'lucide-react';

export default function Toast({ toasts, onOpenCart, onCloseToast }) {
  if (!toasts || toasts.length === 0) return null;

  const latestToast = toasts[toasts.length - 1];

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 animate-toast">
      <div className="bg-gradient-to-r from-[#590d22] via-[#800f2f] to-[#ff4d6d] text-white shadow-2xl border-t border-[#ff8fa3]/40 py-2.5 px-4 sm:px-8 flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
        
        {/* Message Left */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-full bg-white/20 text-[#ffccd5] shrink-0">
            <Sparkles className="w-4 h-4 text-[#ffb703]" />
          </div>
          <span className="truncate">{latestToast.message}</span>
        </div>

        {/* Action Right */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenCart}
            className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white text-[#590d22] hover:bg-[#fff0f3] font-black text-xs transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#ff4d6d]" /> Ver Carrito <ArrowRight className="w-3 h-3 hidden sm:inline" />
          </button>

          {onCloseToast && (
            <button
              onClick={() => onCloseToast(latestToast.id)}
              className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
