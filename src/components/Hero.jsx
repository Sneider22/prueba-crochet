import React from 'react';
import { ArrowDown, Heart, Sparkles } from 'lucide-react';

export default function Hero() {
  const scrollToCatalog = () => {
    const el = document.getElementById('catalogo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 text-center px-4">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ff8fa3]/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-10 right-10 w-48 h-48 bg-[#ffccd5]/30 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#ffccd5] text-xs sm:text-sm font-semibold text-[#800f2f] shadow-sm backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-[#ffb703]" />
          <span>Detalles únicos hechos 100% a mano en Caracas</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-black text-[#590d22] leading-tight tracking-tight">
          Tejido con <span className="bg-gradient-to-r from-[#ff4d6d] to-[#ff8fa3] bg-clip-text text-transparent inline-flex items-center gap-1">amor <Heart className="w-8 h-8 sm:w-12 sm:h-12 fill-[#ff4d6d] text-[#ff4d6d] inline" /></span>
        </h2>

        <p className="text-base sm:text-xl text-[#800f2f]/90 max-w-xl mx-auto font-medium">
          Encuentra ramos eternos, amigurumis de tus personajes favoritos, llaveros y peluches personalizados confeccionados con el corazón.
        </p>

        <div className="pt-4">
          <button
            onClick={scrollToCatalog}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#ff8fa3] to-[#ff4d6d] text-white font-bold text-lg shadow-lg shadow-[#ff4d6d]/30 hover:shadow-xl hover:shadow-[#ff4d6d]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            Ver Catálogo <ArrowDown className="w-5 h-5 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}
