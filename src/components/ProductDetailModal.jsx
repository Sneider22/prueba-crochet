import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ShoppingBag, Star, Plus, Minus } from 'lucide-react';

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setCurrentImgIndex(0);
    setQuantity(1);
  }, [product]);

  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [product.image || 'logo.jpg'];
  const displayCategory = Array.isArray(product.category) ? product.category[0] : product.category;

  const handlePrevImg = () => {
    setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImg = () => {
    setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-toast">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#ffccd5] max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-[#590d22] shadow-md transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Image Slider */}
        <div className="relative md:w-1/2 bg-[#fff0f3] flex items-center justify-center min-h-[280px]">
          <img
            src={images[currentImgIndex]}
            alt={product.name}
            className="w-full h-full object-cover max-h-[380px]"
            onError={(e) => { e.target.src = 'logo.jpg'; }}
          />

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImg}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-[#590d22] hover:bg-white shadow-md transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNextImg}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-[#590d22] hover:bg-white shadow-md transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
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

        {/* Details Column */}
        <div className="p-6 md:w-1/2 flex flex-col justify-between overflow-y-auto">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#fff0f3] text-[#ff4d6d] text-xs font-extrabold capitalize mb-2">
              {displayCategory}
            </span>

            <h2 className="text-2xl font-black text-[#590d22] leading-tight mb-2">
              {product.name}
            </h2>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-3">
              {[...Array(product.rating || 5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#ffb703] text-[#ffb703]" />
              ))}
            </div>

            <p className="text-sm text-[#800f2f]/80 leading-relaxed mb-4">
              {product.description || "Producto elaborado a mano con hilos de la mejor calidad. Hipolaergénico y suave al tacto."}
            </p>

            <div className="text-3xl font-black text-[#ff4d6d] mb-4">
              ${product.price.toFixed(2)}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4 pt-4 border-t border-[#fff0f3]">
            
            {/* Quantity Controls */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#800f2f]">Cantidad:</span>
              <div className="flex items-center gap-3 bg-[#fff0f3] border border-[#ffccd5] rounded-full px-3 py-1">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-[#590d22] hover:text-[#ff4d6d] font-bold"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-extrabold text-[#590d22] min-w-[20px] text-center text-sm">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-[#590d22] hover:text-[#ff4d6d] font-bold"
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
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#ff8fa3] to-[#ff4d6d] text-white font-bold shadow-lg shadow-[#ff4d6d]/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" /> Agregar al Carrito
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
