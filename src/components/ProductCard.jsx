import React from 'react';
import { Star, ShoppingBag } from 'lucide-react';

export default function ProductCard({ product, onOpenDetail, onAddToCart }) {
  const mainImage = product.image || (product.images && product.images[0]) || '/logo.jpg';
  const displayCategory = Array.isArray(product.category) ? product.category[0] : product.category;
  const isOffer = !!product.oldPrice;

  return (
    <article className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#ffccd5]/60 shadow-sm hover:shadow-xl hover:shadow-[#ff4d6d]/15 transition-all duration-300 flex flex-col h-full">
      
      {/* Image Container */}
      <div 
        onClick={() => onOpenDetail(product)}
        className="relative aspect-square overflow-hidden bg-[#fff0f3] cursor-pointer"
      >
        <img 
          src={mainImage} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = '/logo.jpg'; }}
        />

        {/* Badges */}
        {isOffer && (
          <span className="absolute top-2 left-2 bg-gradient-to-r from-[#ff4d6d] to-[#e11d48] text-white text-[10px] sm:text-xs font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md tracking-wider">
            OFERTA
          </span>
        )}

        <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-md text-[#590d22] text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm border border-white capitalize max-w-[90px] truncate">
          {displayCategory}
        </span>
      </div>

      {/* Content */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-2 sm:gap-3">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-0.5 sm:gap-1 mb-0.5 sm:mb-1">
            {[...Array(product.rating || 5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#ffb703] text-[#ffb703]" />
            ))}
          </div>

          <h3 
            onClick={() => onOpenDetail(product)}
            className="font-extrabold text-[#590d22] text-xs sm:text-base leading-snug group-hover:text-[#ff4d6d] transition-colors cursor-pointer line-clamp-2"
          >
            {product.name}
          </h3>
        </div>

        <div className="pt-1.5 sm:pt-2 border-t border-[#fff0f3] flex items-center justify-between gap-1 sm:gap-2">
          {/* Pricing */}
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm sm:text-xl font-black text-[#ff4d6d]">
                ${product.price.toFixed(2)}
              </span>
              {isOffer && (
                <span className="text-[10px] sm:text-xs text-[#800f2f]/60 line-through font-medium">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Quick Add Button */}
          <button
            onClick={() => onAddToCart(product)}
            className="p-1.5 sm:p-2.5 rounded-full bg-[#fff0f3] text-[#ff4d6d] hover:bg-[#ff4d6d] hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center cursor-pointer"
            title="Agregar al carrito"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

    </article>
  );
}
