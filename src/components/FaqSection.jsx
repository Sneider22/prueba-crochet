import React from 'react';
import { HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: "¿Cómo realizar un pedido?",
    a: "Para realizar un pedido envíanos el producto en el que estás interesado o una imagen de referencia. Trabajamos bajo pedido abonando el 50% de inicial para comenzar."
  },
  {
    q: "¿Cuánto tiempo demoran en confeccionar un tejido?",
    a: "Generalmente tomamos de 3 a 5 días hábiles dependiendo de la complejidad y la cola de pedidos de la semana."
  },
  {
    q: "¿Hacen diseños personalizados?",
    a: "¡Sí! Realizamos amigurumis personalizados de seres queridos, mascotas, ramos temáticos o tus personajes favoritos. Escríbenos a WhatsApp con tu foto e idea."
  },
  {
    q: "¿Cuáles son los métodos de pago?",
    a: "Aceptamos Pago Móvil, Zelle o Efectivo en Divisas (entregas en Caracas). Requerimos el 50% de abono para iniciar el trabajo."
  },
  {
    q: "¿Entregas personales y envíos?",
    a: "Entregas personales sin costo en La California Norte (Caracas). Servicio de Delivery en Caracas con costo adicional y envíos nacionales por MRW o ZOOM cobro a destino."
  },
  {
    q: "¿Qué materiales utilizan?",
    a: "Trabajamos con hilo 100% acrílico hipoalergénico de alta calidad e hilo chenille esponjoso para los peluches más acolchados."
  }
];

export default function FaqSection() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex p-2.5 rounded-full bg-rose-100 text-rose-600 mb-2">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h3 className="text-3xl font-black text-[#590d22]">Preguntas Frecuentes</h3>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => (
          <details key={idx} className="group bg-white rounded-2xl border border-[#ffccd5]/70 shadow-sm overflow-hidden transition-all">
            <summary className="p-4 font-bold text-[#590d22] text-sm sm:text-base cursor-pointer list-none flex items-center justify-between group-open:bg-[#fff0f3]/50">
              <span>{faq.q}</span>
              <span className="text-[#ff4d6d] font-bold group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 text-[13px] sm:text-sm text-[#800f2f]/90 font-medium leading-relaxed border-t border-[#fff0f3]">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
