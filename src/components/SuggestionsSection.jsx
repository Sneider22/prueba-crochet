import React, { useState } from 'react';
import { Lightbulb, Send } from 'lucide-react';

export default function SuggestionsSection({ onShowToast }) {
  const [suggestion, setSuggestion] = useState('');

  const handleSend = () => {
    if (!suggestion.trim()) return alert("Por favor escribe una idea :)");

    const phoneNumber = "584142826330";
    const hour = new Date().getHours();
    const greeting = hour >= 6 && hour < 12 ? "Buenos días" : hour >= 12 && hour < 18 ? "Buenas tardes" : "Buenas noches";
    
    const message = `${greeting}, estoy interesad@ en un amigurumi personalizado de:\n\n✨ ${suggestion.trim()}\n`;
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
    setSuggestion('');
    if (onShowToast) onShowToast("¡Sugerencia lista para enviar por WhatsApp! 💬", "success");
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-10 my-8">
      <div className="bg-gradient-to-r from-[#fff0f3] via-white to-[#fff0f3] rounded-3xl p-8 border border-[#ffccd5] shadow-sm text-center space-y-4">
        
        <div className="inline-flex p-3 rounded-full bg-amber-100 text-amber-600 shadow-inner">
          <Lightbulb className="w-8 h-8" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-[#590d22]">
          ¡Danos tus ideas! 💡
        </h3>

        <p className="text-sm sm:text-base text-[#800f2f]/80 max-w-md mx-auto">
          ¿Tienes una idea en mente para un regalo o personaje especial? Escríbela aquí y te enviamos presupuesto sin compromiso.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto pt-2">
          <input
            type="text"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="Ej: Quiero un Spiderman colgante para el carro..."
            className="flex-1 px-5 py-3.5 rounded-full bg-white border border-[#ffccd5] text-sm text-[#590d22] placeholder-[#800f2f]/40 focus:outline-none focus:ring-2 focus:ring-[#ff8fa3] shadow-sm"
          />

          <button
            onClick={handleSend}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#ff8fa3] to-[#ff4d6d] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            Enviar <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
