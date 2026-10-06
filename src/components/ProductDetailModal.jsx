import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ShoppingBag, Plus, Minus } from 'lucide-react';

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setCurrentImgIndex(0);
    setQuantity(1);
  }, [product]);

  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [product.image || '/logo.jpg'];
  const displayCategory = Array.isArray(product.category) ? product.category[0] : product.category;
  const isOffer = !!(product.old_price || product.oldPrice);
  const oldPriceVal = product.old_price || product.oldPrice;

  const handlePrevImg = () => {
    setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImg = () => {
    setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-toast"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#ffccd5] h-[92vh] max-h-[720px] md:h-[600px] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-30 p-2 rounded-full bg-white/80 hover:bg-white text-[#590d22] shadow-md transition-all cursor-pointer hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Image Slider - Taller & Spacious with Full Image Display */}
        <div className="relative w-full md:w-1/2 h-[350px] sm:h-[390px] md:h-full bg-[#fff0f3] flex items-center justify-center shrink-0 overflow-hidden">
          
          {/* Ambient blurred background image for seamless fit */}
          <img
            src={images[currentImgIndex]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-xl opacity-30 scale-110 pointer-events-none"
            aria-hidden="true"
          />

          {/* Main Crisp Product Image (No cropping, full item visible regardless of upload size) */}
          <img
            src={images[currentImgIndex]}
            alt={product.name}
            className="relative z-10 w-full h-full object-contain p-3 sm:p-4 select-none drop-shadow-md"
            onError={(e) => { e.target.src = '/logo.jpg'; }}
          />

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImg}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 text-[#590d22] hover:bg-white shadow-md transition-all cursor-pointer hover:scale-105"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNextImg}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 text-[#590d22] hover:bg-white shadow-md transition-all cursor-pointer hover:scale-105"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    onClick={() => setCurrentImgIndex(idx)}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                      idx === currentImgIndex ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Details Column - Standardized height layout */}
        <div className="p-4 sm:p-6 md:w-1/2 flex flex-col justify-between h-full overflow-hidden bg-white flex-1 min-h-0">
          
          <div className="flex flex-col flex-1 min-h-0">
            {/* Category & Offer Badges */}
            <div className="flex items-center gap-2 mb-1.5 shrink-0">
              <span className="inline-block px-3 py-1 rounded-full bg-[#fff0f3] text-[#ff4d6d] text-xs font-extrabold capitalize">
                {displayCategory}
              </span>
              {isOffer && (
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[11px] font-extrabold uppercase tracking-wide">
                  Oferta
                </span>
              )}
            </div>

            {/* Product Title */}
            <h2 className="text-lg sm:text-2xl font-black text-[#590d22] leading-tight line-clamp-2 shrink-0">
              {product.name}
            </h2>

            {/* Standardized Description Box */}
            <div className="my-2.5 sm:my-3 flex-1 min-h-[85px] max-h-[135px] bg-[#fff0f3]/40 border border-[#ffccd5]/50 rounded-2xl p-3 sm:p-3.5 overflow-y-auto custom-scrollbar">
              <p className="text-[13px] sm:text-sm text-[#800f2f]/90 font-medium leading-relaxed">
                {product.description || "Producto elaborado a mano con hilos de la mejor calidad. Hipoalergénico y suave al tacto."}
              </p>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-2 mb-1.5 shrink-0">
              <span className="text-2xl sm:text-3xl font-black text-[#ff4d6d]">
                ${product.price.toFixed(2)}
              </span>
              {isOffer && (
                <span className="text-sm sm:text-base font-bold text-[#800f2f]/50 line-through">
                  ${Number(oldPriceVal).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Actions - Anchored at the bottom */}
          <div className="space-y-3 pt-2.5 border-t border-[#fff0f3] shrink-0">
            
            {/* Quantity Controls */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#800f2f]">Cantidad:</span>
              <div className="flex items-center gap-3 bg-[#fff0f3] border border-[#ffccd5] rounded-full px-3 py-1">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-[#590d22] hover:text-[#ff4d6d] font-bold cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-extrabold text-[#590d22] min-w-[20px] text-center text-sm">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-[#590d22] hover:text-[#ff4d6d] font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                onAddToCart(product, quantity);
                onClose();
              }}
              className="w-full py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#ff8fa3] to-[#ff4d6d] text-white font-bold shadow-lg shadow-[#ff4d6d]/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <ShoppingBag className="w-5 h-5" /> Agregar al Carrito
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
