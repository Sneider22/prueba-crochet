import React, { useState, useEffect } from 'react';
import { initialProducts } from './data/products';
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

export default function App() {
  // Load products from LocalStorage if available
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('zafiro_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Error al parsear productos:", e);
      }
    }
    return initialProducts;
  });

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

  // Sync products to LocalStorage
  const saveProducts = (updatedProducts) => {
    setProducts(updatedProducts);
    localStorage.setItem('zafiro_products', JSON.stringify(updatedProducts));
  };

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
    setIsCartOpen(true); // Abre el modal del carrito para confirmación inmediata
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const handleRemoveFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Product Admin operations
  const handleSaveProduct = (productData) => {
    const exists = products.some(p => p.id === productData.id);
    let updated;
    if (exists) {
      updated = products.map(p => p.id === productData.id ? productData : p);
      showToast("¡Producto actualizado exitosamente! ✨", "success");
    } else {
      updated = [productData, ...products];
      showToast("¡Nuevo producto agregado al catálogo! 🎉", "success");
    }
    saveProducts(updated);
  };

  const handleToggleOffer = (id) => {
    const updated = products.map(p => {
      if (p.id === id) {
        if (p.oldPrice) {
          const { oldPrice, ...rest } = p;
          showToast(`Oferta removida de "${p.name}"`, "info");
          return rest;
        } else {
          showToast(`"${p.name}" marcado en OFERTA ✨`, "success");
          return { ...p, oldPrice: Number((p.price * 1.25).toFixed(2)) };
        }
      }
      return p;
    });
    saveProducts(updated);
  };

  const handleDeleteProduct = (id) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;

    if (window.confirm(`¿Estás seguro de eliminar "${prod.name}"?`)) {
      const updated = products.filter(p => p.id !== id);
      saveProducts(updated);
      showToast("Producto eliminado", "info");
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "zafiro_productos_backup.json");
    document.body.appendChild(dlAnchorElem);
    dlAnchorElem.click();
    dlAnchorElem.remove();
    showToast("¡Descarga de respaldo completada! 💾", "success");
  };

  const handleResetDefault = () => {
    if (window.confirm("¿Estás seguro de restablecer el catálogo al estado inicial? Se borrarán los productos creados o editados localmente.")) {
      localStorage.removeItem('zafiro_products');
      setProducts(initialProducts);
      showToast("Catálogo restablecido al estado original 🔄", "info");
    }
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
        onResetDefault={handleResetDefault}
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
