import React from 'react';

export default function WhatsAppFAB() {
  const phoneNumber = "584142826330";
  const hour = new Date().getHours();
  const greeting = hour >= 6 && hour < 12 ? "Buenos días" : hour >= 12 && hour < 18 ? "Buenas tardes" : "Buenas noches";
  const message = `${greeting}, quisiera hacer un pedido de crochet 🧶`;
  const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#ff4d6d] text-white flex items-center justify-center shadow-lg shadow-[#ff4d6d]/40 hover:scale-110 hover:rotate-12 hover:bg-[#ff8fa3] transition-all cursor-pointer group"
      title="Escríbenos por WhatsApp"
    >
      <i className="fa-brands fa-whatsapp text-2xl group-hover:scale-110 transition-transform"></i>
    </a>
  );
}
