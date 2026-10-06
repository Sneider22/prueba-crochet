import React from 'react';
import { Shapes, MapPin, Truck, Store } from 'lucide-react';

export default function InfoBar() {
  const items = [
    { icon: Shapes, title: "Amigurumis", desc: "Diseños únicos a mano" },
    { icon: MapPin, title: "Caracas, Venezuela", desc: "Hecho en casa con amor" },
    { icon: Truck, title: "Envíos Nacionales", desc: "MRW / ZOOM a todo el país" },
    { icon: Store, title: "Tienda Online 24/7", desc: "Catálogo disponible siempre" },
  ];

  return (
    <section className="bg-white/80 border-y border-[#ffccd5] py-8 my-10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-3.5 p-2">
              <div className="p-3 rounded-2xl bg-[#fff0f3] text-[#ff4d6d] shadow-sm">
                <Icon className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="font-extrabold text-[#590d22] text-sm sm:text-base leading-tight">{item.title}</h4>
                <p className="text-xs text-[#800f2f]/70 font-medium">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
