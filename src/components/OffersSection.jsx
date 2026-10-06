import React from 'react';
import { Tag, ShoppingBag, Sparkles } from 'lucide-react';

export default function OffersSection({ products, onOpenDetail, onAddToCart }) {
  // Compatibilidad: productos de Supabase usan old_price, los locales usan oldPrice
  const getOldPrice = (p) => p.old_price || p.oldPrice || null;
  const offerProducts = products.filter(p => getOldPrice(p));

  if (offerProducts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-4 mb-8 sm:mb-12">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md">
          <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-[#590d22] flex items-center gap-1.5">
            Ofertas Especiales <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
          </h3>
          <p className="text-[11px] sm:text-xs text-[#800f2f]/70 font-medium">Descuentos exclusivos por tiempo limitado</p>
        </div>
      </div>

      {/* Horizontal Swipeable Container on Mobile, Grid on Desktop */}
      <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 overflow-x-auto pb-3 sm:pb-0 scrollbar-none snap-x snap-mandatory">
        {offerProducts.map(product => {
          const mainImg = product.image || (product.images && product.images[0]) || '/logo.jpg';
          return (
            <div 
              key={product.id}
              className="snap-start flex-shrink-0 w-[220px] sm:w-auto bg-white rounded-2xl overflow-hidden border-2 border-rose-200 shadow-md hover:shadow-xl transition-all relative group flex flex-col justify-between"
            >
              {/* Product Image Full Focus */}
              <div 
                onClick={() => onOpenDetail(product)}
                className="relative aspect-square overflow-hidden bg-[#fff0f3] cursor-pointer"
              >
                <img 
                  src={mainImg} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = '/logo.jpg'; }}
                />

                {/* Offer Badge Overlay */}
                <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full shadow-lg tracking-wider uppercase">
                  🔥 OFERTA
                </div>
              </div>

              {/* Minimalist Info Card */}
              <div className="p-3 bg-white flex flex-col justify-between flex-1 gap-2">
                <h4 
                  onClick={() => onOpenDetail(product)}
                  className="font-extrabold text-[#590d22] text-xs sm:text-sm truncate cursor-pointer hover:text-[#ff4d6d]"
                >
                  {product.name}
                </h4>

                <div className="flex items-center justify-between pt-1 border-t border-rose-50">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base sm:text-lg font-black text-rose-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-gray-400 line-through font-semibold">
                      ${getOldPrice(product).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => onAddToCart(product)}
                    className="p-2 rounded-full bg-rose-500 text-white hover:bg-rose-600 shadow-md active:scale-95 transition-all cursor-pointer"
                    title="Agregar al carrito"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
