import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Send, Package } from 'lucide-react';

export default function CartModal({ isOpen, onClose, cart, onUpdateQuantity, onRemoveFromItem, onClearCart }) {
  const [giftBoxCount, setGiftBoxCount] = useState(0);

  if (!isOpen) return null;

  const itemsSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const giftBoxCost = giftBoxCount * 3.00;
  const total = itemsSubtotal + giftBoxCost;

  const handleSendWhatsApp = () => {
    if (cart.length === 0) return;

    const phoneNumber = "584142826330";
    
    // Greeting based on time
    const hour = new Date().getHours();
    const greeting = hour >= 6 && hour < 12 ? "Buenos días" : hour >= 12 && hour < 18 ? "Buenas tardes" : "Buenas noches";
    
    let message = `${greeting}, quiero realizar el siguiente pedido de Zafiro Crochet:\n\n`;
    
    cart.forEach(item => {
      const subtotal = item.price * item.quantity;
      message += `• *${item.name}* (x${item.quantity}) - $${subtotal.toFixed(2)}\n`;
    });

    if (giftBoxCount > 0) {
      message += `🎁 Caja de regalo (x${giftBoxCount}) - $${giftBoxCost.toFixed(2)}\n`;
    }

    message += `\n💰 *TOTAL A PAGAR: $${total.toFixed(2)}*`;
    message += `\n\nQuedo atento/a a la confirmación de la disponibilidad y datos de pago. ¡Gracias! ✨`;

    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-toast">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#ffccd5] max-h-[90vh] flex flex-col">
        
        {/* Header — siempre fijo arriba */}
        <div className="p-5 border-b border-[#fff0f3] flex items-center justify-between bg-[#fff0f3]/50 flex-shrink-0">
          <h2 className="text-xl font-extrabold text-[#590d22] flex items-center gap-2">
            Tu Carrito 🛒
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white text-[#590d22] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de productos — SOLO ESTA PARTE HACE SCROLL */}
        <div className="overflow-y-auto flex-1 p-5 space-y-3">
          {cart.length > 0 ? (
            cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[#fff0f3]/40 border border-[#ffccd5]/50">
                <img 
                  src={item.image || (item.images && item.images[0]) || 'logo.jpg'} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover rounded-xl border border-[#ffccd5] flex-shrink-0"
                  onError={(e) => { e.target.src = 'logo.jpg'; }}
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#590d22] text-sm truncate">{item.name}</h4>
                  <div className="text-xs font-semibold text-[#ff4d6d] mt-0.5">
                    ${item.price.toFixed(2)} c/u
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-full border border-[#ffccd5]">
                  <button 
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="text-[#590d22] hover:text-[#ff4d6d]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold min-w-[16px] text-center">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="text-[#590d22] hover:text-[#ff4d6d]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => onRemoveFromItem(item.id)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-[#800f2f]/60">
              <p className="font-semibold">Tu carrito está vacío 🧶</p>
              <p className="text-xs mt-1">Agrega hermosos amigurumis desde el catálogo</p>
            </div>
          )}
        </div>

        {/* Footer — siempre fijo abajo (Empaque + Total + Botón) */}
        {cart.length > 0 && (
          <div className="flex-shrink-0 border-t border-[#fff0f3] bg-white p-4 space-y-3">
            
            {/* Empaque especial */}
            <div>
              <h5 className="text-xs font-extrabold uppercase text-[#800f2f] tracking-wider text-center mb-2">
                ✨ Empaque Especial para Regalo
              </h5>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#fff0f3]/60 border border-[#ffccd5]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#590d22]">Caja decorativa de regalo</div>
                    <div className="text-[11px] text-[#ff4d6d] font-semibold">+$3.00 c/u</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-full border border-[#ffccd5]">
                  <button 
                    onClick={() => setGiftBoxCount(Math.max(0, giftBoxCount - 1))}
                    className="text-[#590d22] hover:text-[#ff4d6d]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold min-w-[16px] text-center">{giftBoxCount}</span>
                  <button 
                    onClick={() => setGiftBoxCount(giftBoxCount + 1)}
                    className="text-[#590d22] hover:text-[#ff4d6d]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between font-extrabold text-[#590d22]">
              <span className="text-sm">TOTAL A PAGAR:</span>
              <span className="text-2xl text-[#ff4d6d]">${total.toFixed(2)}</span>
            </div>

            {/* Botón WhatsApp */}
            <button
              onClick={handleSendWhatsApp}
              className="w-full py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Send className="w-4 h-4" /> Enviar Pedido por WhatsApp
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
