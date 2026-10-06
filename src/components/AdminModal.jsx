import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Tag, Download, RotateCcw, Search, CheckSquare, Package, Database, Lock } from 'lucide-react';

export default function AdminModal({ 
  isOpen, 
  onClose, 
  products, 
  onOpenProductForm, 
  onToggleOffer, 
  onDeleteProduct, 
  onExportJSON, 
  onResetDefault 
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'todos', 'backup'
  const [searchQuery, setSearchQuery] = useState('');
  const [todos, setTodos] = useState(() => JSON.parse(localStorage.getItem('adminTodos')) || []);
  const [newTodo, setNewTodo] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if ((username === 'sofiavsh' && password === 'pato123') || (username === 'admin' && password === 'admin') || password === 'zafiro') {
      setIsAuthenticated(true);
    } else {
      alert("Credenciales incorrectas");
    }
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      const updated = [newTodo.trim(), ...todos];
      setTodos(updated);
      localStorage.setItem('adminTodos', JSON.stringify(updated));
      setNewTodo('');
    }
  };

  const handleDeleteTodo = (idx) => {
    const updated = todos.filter((_, i) => i !== idx);
    setTodos(updated);
    localStorage.setItem('adminTodos', JSON.stringify(updated));
  };

  const filteredAdminProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (Array.isArray(p.category) ? p.category.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) : p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-toast">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#ffccd5] max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-[#fff0f3] flex items-center justify-between bg-[#fff0f3]">
          <h2 className="text-xl font-black text-[#590d22] flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#ff4d6d]" /> Panel Zafiro Admin
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white text-[#590d22] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Login Form Screen */}
        {!isAuthenticated ? (
          <div className="p-8 max-w-sm mx-auto w-full text-center space-y-6 my-auto">
            <div className="w-16 h-16 bg-[#fff0f3] rounded-full border border-[#ffccd5] text-[#ff4d6d] flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-[#590d22]">Acceso Restringido</h3>
              <p className="text-xs text-[#800f2f]/70 mt-1">Ingresa tus credenciales de administradora</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3 text-left">
              <div>
                <label className="text-xs font-bold text-[#590d22] block mb-1">Usuario</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Usuario"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ffccd5] text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8fa3]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#590d22] block mb-1">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ffccd5] text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8fa3]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#ff8fa3] to-[#ff4d6d] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer mt-2"
              >
                Entrar al Panel
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="flex border-b border-[#ffccd5] bg-white px-4 pt-2 gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2.5 rounded-t-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all border-t border-x cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-[#ff4d6d] text-white border-[#ff4d6d]'
                    : 'bg-transparent text-[#800f2f] border-transparent hover:bg-[#fff0f3]'
                }`}
              >
                <Package className="w-4 h-4" /> Catálogo ({products.length})
              </button>

              <button
                onClick={() => setActiveTab('todos')}
                className={`px-4 py-2.5 rounded-t-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all border-t border-x cursor-pointer ${
                  activeTab === 'todos'
                    ? 'bg-[#ff4d6d] text-white border-[#ff4d6d]'
                    : 'bg-transparent text-[#800f2f] border-transparent hover:bg-[#fff0f3]'
                }`}
              >
                <CheckSquare className="w-4 h-4" /> Pedidos / Pendientes ({todos.length})
              </button>

              <button
                onClick={() => setActiveTab('backup')}
                className={`px-4 py-2.5 rounded-t-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all border-t border-x cursor-pointer ${
                  activeTab === 'backup'
                    ? 'bg-[#ff4d6d] text-white border-[#ff4d6d]'
                    : 'bg-transparent text-[#800f2f] border-transparent hover:bg-[#fff0f3]'
                }`}
              >
                <Database className="w-4 h-4" /> Respaldos
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-5 flex-1 overflow-y-auto">
              
              {/* TAB 1: PRODUCTS MANAGER */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:w-72">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar producto a editar..."
                        className="w-full pl-9 pr-3 py-2 rounded-full border border-[#ffccd5] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#ff8fa3]"
                      />
                      <Search className="w-4 h-4 text-[#800f2f]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>

                    <button
                      onClick={() => onOpenProductForm(null)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-gradient-to-r from-[#ff8fa3] to-[#ff4d6d] text-white text-xs font-extrabold shadow-md flex items-center justify-center gap-2 hover:shadow-lg cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Nuevo Producto
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[55vh] overflow-y-auto pr-1">
                    {filteredAdminProducts.map(p => {
                      const isOffer = !!p.oldPrice;
                      return (
                        <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-[#ffccd5] shadow-sm hover:shadow-md transition-all">
                          <img
                            src={p.image || (p.images && p.images[0]) || 'logo.jpg'}
                            alt={p.name}
                            className="w-14 h-14 object-cover rounded-xl border border-[#ffccd5]"
                            onError={(e) => { e.target.src = 'logo.jpg'; }}
                          />

                          <div className="flex-1 min-w-0">
                            <h4 className="font-extrabold text-[#590d22] text-xs truncate">{p.name}</h4>
                            <div className="text-xs text-[#800f2f]/80 mt-0.5 flex items-center gap-1.5 flex-wrap">
                              <span className="font-extrabold text-[#ff4d6d]">${p.price.toFixed(2)}</span>
                              {isOffer && (
                                <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                  OF: ${p.oldPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => onOpenProductForm(p)}
                              className="p-1.5 rounded-full bg-[#fff0f3] text-[#590d22] hover:bg-[#ff4d6d] hover:text-white transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => onToggleOffer(p.id)}
                              className={`p-1.5 rounded-full transition-colors ${
                                isOffer ? 'bg-rose-500 text-white' : 'bg-[#fff0f3] text-[#590d22] hover:bg-rose-100 hover:text-rose-600'
                              }`}
                              title={isOffer ? 'Quitar Oferta' : 'Marcar Oferta'}
                            >
                              <Tag className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => onDeleteProduct(p.id)}
                              className="p-1.5 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: TODOS PENDIENTES */}
              {activeTab === 'todos' && (
                <div className="space-y-4 max-w-lg mx-auto">
                  <p className="text-xs text-[#800f2f]/80 text-center font-medium">
                    Anota aquí los amigurumis o encargos de tejido pendientes por entregar.
                  </p>

                  <form onSubmit={handleAddTodo} className="flex gap-2">
                    <input
                      type="text"
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      placeholder="Ej: Snoopy aviador para entregarlo el viernes..."
                      className="flex-1 px-4 py-2.5 rounded-full border border-[#ffccd5] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#ff8fa3]"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-full bg-[#ff4d6d] text-white text-xs font-bold shadow-md hover:bg-[#ff8fa3] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Añadir
                    </button>
                  </form>

                  <div className="space-y-2">
                    {todos.length > 0 ? (
                      todos.map((todo, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#fff0f3] border border-[#ffccd5]">
                          <span className="text-xs font-semibold text-[#590d22]">{todo}</span>
                          <button
                            onClick={() => handleDeleteTodo(idx)}
                            className="p-1 text-rose-500 hover:text-rose-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[#800f2f]/60 text-center py-6">No hay tareas pendientes. ¡Todo listo! ✨</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: BACKUP */}
              {activeTab === 'backup' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="p-5 rounded-2xl bg-white border border-[#ffccd5] space-y-3">
                    <h4 className="font-extrabold text-[#590d22] text-sm flex items-center gap-2">
                      <Download className="w-4 h-4 text-[#ff4d6d]" /> Descargar Respaldos (JSON)
                    </h4>
                    <p className="text-xs text-[#800f2f]/80 leading-relaxed">
                      Genera un archivo JSON con todos los productos actuales para guardarlo en tu computadora o usarlo en producción.
                    </p>
                    <button
                      onClick={onExportJSON}
                      className="w-full py-2.5 rounded-full border-2 border-[#ff8fa3] text-[#ff4d6d] font-extrabold text-xs hover:bg-[#ff8fa3] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" /> Exportar a JSON
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-rose-200 space-y-3">
                    <h4 className="font-extrabold text-rose-600 text-sm flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" /> Restablecer a Inicial
                    </h4>
                    <p className="text-xs text-[#800f2f]/80 leading-relaxed">
                      Borra las modificaciones guardadas en este navegador y restaura el catálogo original inicial.
                    </p>
                    <button
                      onClick={onResetDefault}
                      className="w-full py-2.5 rounded-full border-2 border-rose-500 text-rose-600 font-extrabold text-xs hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" /> Restablecer Catálogo
                    </button>
                  </div>
                </div>
              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
}
