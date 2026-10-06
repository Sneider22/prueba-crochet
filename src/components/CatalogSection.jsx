import React, { useState, useMemo } from 'react';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'ramos', label: 'Ramos 🌹' },
  { id: 'llaveros', label: 'Llaveros 🔑' },
  { id: 'peluches', label: 'Peluches 🧸' },
  { id: 'personajes', label: 'Personajes 🎭' },
  { id: 'snoopy', label: 'Snoopy 🐶' },
  { id: 'personalizados', label: 'Personalizados ✨' }
];

export default function CatalogSection({ products, onOpenDetail, onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 12 items per page for cleaner pagination

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      let matchesCat = selectedCategory === 'all';
      if (!matchesCat) {
        if (Array.isArray(p.category)) {
          matchesCat = p.category.includes(selectedCategory);
        } else {
          matchesCat = p.category === selectedCategory;
        }
      }

      const queryWords = searchTerm.toLowerCase().trim().split(' ').filter(w => w.length > 0);
      const matchesSearch = queryWords.every(word => {
        const nameMatch = p.name.toLowerCase().includes(word);
        const catMatch = Array.isArray(p.category) 
          ? p.category.some(c => c.toLowerCase().includes(word))
          : p.category.toLowerCase().includes(word);
        return nameMatch || catMatch;
      });

      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const el = document.getElementById('catalogo');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  // Sliding window pagination array (Max 5 buttons)
  const getVisiblePages = () => {
    const maxButtons = 5;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <section id="catalogo" className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-10">
      
      {/* Title */}
      <div className="text-center mb-6 sm:mb-8">
        <h3 className="text-2xl sm:text-4xl font-black text-[#590d22] tracking-tight">
          Nuestras Creaciones 🧶
        </h3>
        <p className="text-xs sm:text-base text-[#800f2f]/80 mt-1">
          Explora todos los modelos o pide un diseño a tu medida
        </p>
      </div>

      {/* Controls Bar */}
      <div className="space-y-3.5 mb-6 sm:mb-8">
        
        {/* Search Input */}
        <div className="max-w-md mx-auto relative px-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar amigurumis, ramos, llaveros..."
            className="w-full pl-10 pr-9 py-2.5 sm:py-3 rounded-full bg-white border border-[#ffccd5] text-[#590d22] placeholder-[#800f2f]/40 focus:outline-none focus:ring-2 focus:ring-[#ff8fa3] shadow-sm transition-all text-xs sm:text-sm font-medium"
          />
          <Search className="w-4 h-4 text-[#800f2f]/50 absolute left-4 top-1/2 -translate-y-1/2" />
          {searchTerm && (
            <button 
              onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[#800f2f]/50 hover:text-[#590d22]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Buttons Chips (Centered on desktop, horizontal scroll on mobile) */}
        <div className="flex items-center justify-start sm:justify-center flex-nowrap sm:flex-wrap gap-1.5 sm:gap-2.5 overflow-x-auto pb-2 px-1 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#ff8fa3] to-[#ff4d6d] text-white shadow-md shadow-[#ff4d6d]/20 scale-105'
                  : 'bg-white text-[#590d22] border border-[#ffccd5] hover:bg-[#fff0f3]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Product Grid (2 columns on mobile, 4 columns on desktop) */}
      {paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 min-h-[350px]">
          {paginatedProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetail={onOpenDetail}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/50 rounded-2xl border border-dashed border-[#ffccd5] px-4">
          <p className="text-base sm:text-lg font-bold text-[#590d22]">No se encontraron productos en esta búsqueda 🌸</p>
          <p className="text-xs sm:text-sm text-[#800f2f]/70 mt-1">Intenta con otros términos o solicita un modelo personalizado</p>
        </div>
      )}

      {/* Responsive Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-2 mt-8">
          <div className="flex items-center justify-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-[#ffccd5] text-[#590d22] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#ff8fa3] hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-sm"
              title="Anterior"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {getVisiblePages().map(pageNum => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-[#ff4d6d] text-white shadow-md scale-105'
                    : 'bg-white text-[#590d22] border border-[#ffccd5] hover:bg-[#fff0f3]'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-[#ffccd5] text-[#590d22] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#ff8fa3] hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-sm"
              title="Siguiente"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <span className="text-[11px] sm:text-xs font-semibold text-[#800f2f]/70">
            Página {currentPage} de {totalPages} ({filteredProducts.length} creaciones)
          </span>
        </div>
      )}

    </section>
  );
}
