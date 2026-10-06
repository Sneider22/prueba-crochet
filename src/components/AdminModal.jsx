import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Tag, Download, RotateCcw, Search, CheckSquare, Package, Database, Lock, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const normalizeTodo = (item) => {
  if (typeof item === 'string') {
    return { id: 'local_' + Math.random().toString(36).substring(2, 9), title: item, status: 'red' };
  }
  return {
    id: item.id || 'local_' + Math.random().toString(36).substring(2, 9),
    title: item.title || item.name || '',
    status: item.status || 'red'
  };
};

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

  // Semáforo Pendientes state
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('adminTodos');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.map(normalizeTodo) : [];
    } catch {
      return [];
    }
  });
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [todoFilter, setTodoFilter] = useState('all'); // 'all', 'red', 'yellow', 'green'
  const [loadingTodos, setLoadingTodos] = useState(false);

  // Fetch todos from Supabase when tab is open
  useEffect(() => {
    if (!isOpen || !isAuthenticated || activeTab !== 'todos') return;

    const fetchTodos = async () => {
      if (!supabase) return;
      try {
        setLoadingTodos(true);
        const { data, error } = await supabase
          .from('todos')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const normalized = data.map(normalizeTodo);
          setTodos(normalized);
          localStorage.setItem('adminTodos', JSON.stringify(normalized));
        }
      } catch (err) {
        console.error("Error fetching todos from Supabase:", err);
      } finally {
        setLoadingTodos(false);
      }
    };

    fetchTodos();
  }, [isOpen, isAuthenticated, activeTab]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if ((username === 'sofiavsh' && password === 'pato123') || (username === 'admin' && password === 'admin') || password === 'zafiro') {
      setIsAuthenticated(true);
    } else {
      alert("Credenciales incorrectas");
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    const titleText = newTodoTitle.trim();
    const tempItem = {
      id: 'temp_' + Date.now(),
      title: titleText,
      status: 'red'
    };

    const updatedList = [tempItem, ...todos];
    setTodos(updatedList);
    localStorage.setItem('adminTodos', JSON.stringify(updatedList));
    setNewTodoTitle('');

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('todos')
          .insert({ title: titleText, status: 'red' })
          .select()
          .single();

        if (!error && data) {
          const realItem = normalizeTodo(data);
          setTodos(prev => {
            const newList = prev.map(t => t.id === tempItem.id ? realItem : t);
            localStorage.setItem('adminTodos', JSON.stringify(newList));
            return newList;
          });
        }
      } catch (err) {
        console.error("Error saving todo to Supabase:", err);
      }
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const updatedList = todos.map(t => t.id === id ? { ...t, status: newStatus } : t);
    setTodos(updatedList);
    localStorage.setItem('adminTodos', JSON.stringify(updatedList));

    if (supabase && (typeof id === 'number' || (typeof id === 'string' && !id.startsWith('local_') && !id.startsWith('temp_')))) {
      try {
        await supabase.from('todos').update({ status: newStatus }).eq('id', id);
      } catch (err) {
        console.error("Error updating todo status in Supabase:", err);
      }
    }
  };

  const handleDeleteTodo = async (id) => {
    const updatedList = todos.filter(t => t.id !== id);
    setTodos(updatedList);
    localStorage.setItem('adminTodos', JSON.stringify(updatedList));

    if (supabase && (typeof id === 'number' || (typeof id === 'string' && !id.startsWith('local_') && !id.startsWith('temp_')))) {
      try {
        await supabase.from('todos').delete().eq('id', id);
      } catch (err) {
        console.error("Error deleting todo from Supabase:", err);
      }
    }
  };

  const filteredAdminProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (Array.isArray(p.category) ? p.category.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) : p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredTodos = todos.filter(t => todoFilter === 'all' || t.status === todoFilter);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-toast"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#ffccd5] h-[90vh] max-h-[640px] flex flex-col">
        
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
            <div className="flex border-b border-[#ffccd5] bg-white px-4 pt-2 gap-2 overflow-x-auto shrink-0">
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
            <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
              
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[55vh] overflow-y-auto custom-scrollbar pr-1">
                    {filteredAdminProducts.map(p => {
                      const isOffer = !!(p.old_price || p.oldPrice);
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

              {/* TAB 2: TODOS / PEDIDOS PENDIENTES CON SEMÁFORO Y SUPABASE */}
              {activeTab === 'todos' && (
                <div className="space-y-3.5 max-w-2xl mx-auto">
                  
                  {/* Single-line Add Form (Default Red Status) */}
                  <form onSubmit={handleAddTodo} className="flex items-center gap-2 bg-[#fff0f3] p-1.5 rounded-full border border-[#ffccd5]">
                    <input
                      type="text"
                      value={newTodoTitle}
                      onChange={(e) => setNewTodoTitle(e.target.value)}
                      placeholder="Añadir pedido (ej: Snoopy aviador para el viernes)..."
                      className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm font-medium text-[#590d22] placeholder-[#800f2f]/50 focus:outline-none"
                    />

                    <button
                      type="submit"
                      className="px-4.5 py-2 rounded-full bg-gradient-to-r from-[#ff8fa3] to-[#ff4d6d] text-white text-xs sm:text-sm font-extrabold shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" /> Añadir
                    </button>
                  </form>

                  {/* Combined Filter & Counter Bar */}
                  <div className="flex items-center justify-between gap-1 bg-white p-1 rounded-2xl border border-[#ffccd5] overflow-x-auto text-xs font-bold">
                    {[
                      { id: 'all', label: `Todos (${todos.length})` },
                      { id: 'red', label: `🔴 Por empezar (${todos.filter(t => t.status === 'red').length})` },
                      { id: 'yellow', label: `🟡 En proceso (${todos.filter(t => t.status === 'yellow').length})` },
                      { id: 'green', label: `🟢 Listo (${todos.filter(t => t.status === 'green').length})` }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setTodoFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex-1 text-center ${
                          todoFilter === tab.id
                            ? 'bg-[#ff4d6d] text-white shadow-sm'
                            : 'text-[#800f2f] hover:bg-[#fff0f3]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Orders List */}
                  <div className="space-y-2.5 max-h-[50vh] overflow-y-auto custom-scrollbar pr-1">
                    {loadingTodos ? (
                      <div className="text-center py-8 text-xs text-[#800f2f] font-bold flex justify-center items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#ff4d6d]" /> Cargando pedidos de Supabase...
                      </div>
                    ) : filteredTodos.length > 0 ? (
                      filteredTodos.map((todo) => {
                        const statusConfig = {
                          red: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-800' },
                          yellow: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800' },
                          green: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800' }
                        }[todo.status || 'red'];

                        return (
                          <div 
                            key={todo.id} 
                            className={`p-3.5 rounded-2xl border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${statusConfig.bg}`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs sm:text-sm font-extrabold ${statusConfig.text}`}>
                                {todo.title}
                              </p>
                            </div>

                            {/* Semáforo Switcher & Delete Button */}
                            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-black/5">
                              
                              <div className="flex items-center gap-1 bg-white/80 p-1 rounded-full border border-black/10 shadow-inner">
                                <button
                                  onClick={() => handleUpdateStatus(todo.id, 'red')}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all cursor-pointer ${
                                    todo.status === 'red' ? 'bg-rose-500 text-white scale-110 shadow-md font-bold' : 'hover:bg-rose-100 opacity-60'
                                  }`}
                                  title="🔴 Por empezar"
                                >
                                  🔴
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(todo.id, 'yellow')}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all cursor-pointer ${
                                    todo.status === 'yellow' ? 'bg-amber-500 text-white scale-110 shadow-md font-bold' : 'hover:bg-amber-100 opacity-60'
                                  }`}
                                  title="🟡 En proceso"
                                >
                                  🟡
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(todo.id, 'green')}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all cursor-pointer ${
                                    todo.status === 'green' ? 'bg-emerald-500 text-white scale-110 shadow-md font-bold' : 'hover:bg-emerald-100 opacity-60'
                                  }`}
                                  title="🟢 Listo"
                                >
                                  🟢
                                </button>
                              </div>

                              <button
                                onClick={() => handleDeleteTodo(todo.id)}
                                className="p-1.5 rounded-full bg-white text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-200 cursor-pointer"
                                title="Eliminar pedido"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-xs text-[#800f2f]/60 bg-[#fff0f3]/50 rounded-2xl border border-dashed border-[#ffccd5]">
                        <p className="font-semibold">No hay pedidos registrados en esta categoría ✨</p>
                      </div>
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
