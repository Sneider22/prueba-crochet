import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import OffersSection from './components/OffersSection';
import CatalogSection from './components/CatalogSection';
import InfoBar from './components/InfoBar';
import SuggestionsSection from './components/SuggestionsSection';
import FaqSection from './components/FaqSection';
import ProductDetailModal from './components/ProductDetailModal';
import CartModal from './components/CartModal';
import AdminModal from './components/AdminModal';
import ProductFormModal from './components/ProductFormModal';
import Toast from './components/Toast';
import WhatsAppFAB from './components/WhatsAppFAB';
import { supabase } from './lib/supabase';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Load cart from LocalStorage
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Toast notifications queue
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const newToast = { id: Date.now(), message, type };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 4000);
  };

  // Sync cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching products:", error);
        } else if (data) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Cart operations
  const handleAddToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    showToast(`¡"${product.name}" agregado a tu carrito! ✨`, 'success');
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity <= 0) { handleRemoveFromCart(id); return; }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const handleRemoveFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Product Admin operations - Supabase
  const handleSaveProduct = (savedProduct) => {
    // savedProduct viene directo de Supabase ya guardado
    const exists = products.some(p => p.id === savedProduct.id);
    if (exists) {
      setProducts(prev => prev.map(p => p.id === savedProduct.id ? savedProduct : p));
      showToast("¡Producto actualizado exitosamente! ✨", "success");
    } else {
      setProducts(prev => [savedProduct, ...prev]);
      showToast("¡Nuevo producto agregado al catálogo! 🎉", "success");
    }
  };

  const handleToggleOffer = async (id) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;
    const newOldPrice = prod.oldprice ? null : Number((prod.price * 1.25).toFixed(2));
    const { error } = await supabase
      .from('products')
      .update({ oldprice: newOldPrice })
      .eq('id', id);
    if (error) { showToast('Error actualizando oferta', 'error'); return; }
    setProducts(prev => prev.map(p => p.id === id ? { ...p, oldprice: newOldPrice } : p));
    showToast(newOldPrice ? `"${prod.name}" marcado en OFERTA ✨` : `Oferta removida de "${prod.name}"`, newOldPrice ? 'success' : 'info');
  };

  const handleDeleteProduct = async (id) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;
    if (!window.confirm(`¿Estás seguro de eliminar "${prod.name}"?`)) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) { showToast('Error eliminando producto', 'error'); return; }
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast("Producto eliminado", "info");
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const el = document.createElement('a');
    el.setAttribute("href", dataStr);
    el.setAttribute("download", "zafiro_productos_backup.json");
    document.body.appendChild(el);
    el.click();
    el.remove();
    showToast("¡Descarga de respaldo completada! 💾", "success");
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col font-sans pb-12">
      
      {/* Header */}
      <Header
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLogin={() => setIsAdminOpen(true)}
        onResetCatalog={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* Main Content */}
      <main className="flex-1">
        <Hero />
        {loadingProducts ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 rounded-full border-4 border-[#ffccd5] border-t-[#ff4d6d] animate-spin" />
          </div>
        ) : (
          <>
            <OffersSection
              products={products}
              onOpenDetail={(prod) => setSelectedDetailProduct(prod)}
              onAddToCart={(prod) => handleAddToCart(prod, 1)}
            />
            <CatalogSection
              products={products}
              onOpenDetail={(prod) => setSelectedDetailProduct(prod)}
              onAddToCart={(prod) => handleAddToCart(prod, 1)}
            />
          </>
        )}
        <InfoBar />
        <SuggestionsSection onShowToast={showToast} />
        <FaqSection />
      </main>

      {/* Footer */}
      <footer className="bg-[#590d22] text-white py-8 text-center text-xs font-semibold tracking-wider">
        <p>&copy; {new Date().getFullYear()} Zafiro Crochet • Caracas, Venezuela 🧶</p>
      </footer>

      {/* Modals */}
      <ProductDetailModal
        product={selectedDetailProduct}
        onClose={() => setSelectedDetailProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveFromItem={handleRemoveFromCart}
        onClearCart={() => setCart([])}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onOpenProductForm={(prodToEdit) => {
          setEditingProduct(prodToEdit);
          setIsFormOpen(true);
        }}
        onToggleOffer={handleToggleOffer}
        onDeleteProduct={handleDeleteProduct}
        onExportJSON={handleExportJSON}
      />

      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        editingProduct={editingProduct}
        onSaveProduct={handleSaveProduct}
      />

      {/* Notification Banner at bottom */}
      <Toast 
        toasts={toasts}
        onOpenCart={() => setIsCartOpen(true)}
        onCloseToast={(id) => setToasts(prev => prev.filter(t => t.id !== id))}
      />

      {/* WhatsApp Floating Button */}
      <WhatsAppFAB />

    </div>
  );
}
