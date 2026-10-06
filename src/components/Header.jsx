import React from 'react';
import { ShoppingBag, Sliders } from 'lucide-react';

export default function Header({ cartCount, onOpenCart, onOpenLogin, onResetCatalog }) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-white/50 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={onResetCatalog}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-gradient-to-tr from-[#ff8fa3] to-[#ffb703] p-0.5 group-hover:scale-105 transition-transform">
            <img 
              src="logo.jpg" 
              alt="Zafiro Crochet" 
              className="w-full h-full object-cover rounded-full"
              onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="80">🎁</text></svg>'; }}
            />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#590d22] tracking-tight group-hover:text-[#ff4d6d] transition-colors">
              Zafiro Crochet
            </h1>
            <span className="text-xs text-[#800f2f] font-medium hidden sm:inline-block">Arte hecho a mano ✨</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenLogin}
            className="w-10 h-10 rounded-full bg-[#fff0f3] border border-[#ffccd5] text-[#590d22] hover:bg-[#ff8fa3] hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-95"
            title="Panel de Administración"
          >
            <Sliders className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-full bg-white border border-[#ffccd5] text-[#ff4d6d] hover:bg-[#fff0f3] transition-all shadow-sm active:scale-95 flex items-center justify-center"
            title="Ver Carrito"
          >
            <ShoppingBag className="w-6 h-6 stroke-[2.2]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#ff4d6d] to-[#ff8fa3] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
