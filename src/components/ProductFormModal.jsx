import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Save, Image as ImageIcon } from 'lucide-react';

const CATEGORY_OPTIONS = [
  { id: 'ramos', label: '🌹 Ramos' },
  { id: 'llaveros', label: '🔑 Llaveros' },
  { id: 'peluches', label: '🧸 Peluches' },
  { id: 'personajes', label: '🎭 Personajes' },
  { id: 'snoopy', label: '🐶 Snoopy' },
  { id: 'personalizados', label: '✨ Personalizados' }
];

export default function ProductFormModal({ isOpen, onClose, editingProduct, onSaveProduct }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [rating, setRating] = useState(5);
  const [description, setDescription] = useState('');
  const [selectedCats, setSelectedCats] = useState([]);
  const [customCat, setCustomCat] = useState('');
  const [imageUrls, setImageUrls] = useState(['']);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || '');
      setPrice(editingProduct.price || '');
      setOldPrice(editingProduct.oldPrice || '');
      setRating(editingProduct.rating || 5);
      setDescription(editingProduct.description || '');

      const cats = Array.isArray(editingProduct.category) ? editingProduct.category : [editingProduct.category];
      setSelectedCats(cats);

      const imgs = editingProduct.images && editingProduct.images.length > 0
        ? editingProduct.images
        : [editingProduct.image || ''];
      setImageUrls(imgs);
    } else {
      setName('');
      setPrice('');
      setOldPrice('');
      setRating(5);
      setDescription('');
      setSelectedCats(['personalizados']);
      setCustomCat('');
      setImageUrls(['']);
    }
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleCategoryToggle = (catId) => {
    if (selectedCats.includes(catId)) {
      setSelectedCats(selectedCats.filter(c => c !== catId));
    } else {
      setSelectedCats([...selectedCats, catId]);
    }
  };

  const handleAddUrlField = () => {
    setImageUrls([...imageUrls, '']);
  };

  const handleUrlChange = (idx, val) => {
    const updated = [...imageUrls];
    updated[idx] = val;
    setImageUrls(updated);
  };

  const handleRemoveUrlField = (idx) => {
    const updated = imageUrls.filter((_, i) => i !== idx);
    setImageUrls(updated.length > 0 ? updated : ['']);
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const base64 = evt.target.result;
        setImageUrls(prev => [...prev.filter(u => u.trim() !== ''), base64]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalCats = [...selectedCats];
    if (customCat.trim() && !finalCats.includes(customCat.trim().toLowerCase())) {
      finalCats.push(customCat.trim().toLowerCase());
    }
    if (finalCats.length === 0) finalCats.push('personalizados');

    const validImages = imageUrls.map(u => u.trim()).filter(u => u.length > 0);
    const mainImg = validImages.length > 0 ? validImages[0] : 'logo.jpg';

    const productData = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name: name.trim(),
      price: parseFloat(price),
      oldPrice: oldPrice ? parseFloat(oldPrice) : undefined,
      rating: parseInt(rating),
      description: description.trim(),
      category: finalCats.length === 1 ? finalCats[0] : finalCats,
      image: mainImg,
      images: validImages.length > 0 ? validImages : [mainImg]
    };

    onSaveProduct(productData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-toast">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#ffccd5] max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-[#fff0f3] flex items-center justify-between bg-[#fff0f3]">
          <h3 className="text-lg font-black text-[#590d22] flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#ff4d6d]" /> 
            {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white text-[#590d22] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#590d22] block mb-1">Nombre del Producto *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Ramo Snoopy Enamorado"
                className="w-full px-3.5 py-2 rounded-xl border border-[#ffccd5] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#ff8fa3]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#590d22] block mb-1">Precio ($ USD) *</label>
              <input
                type="number"
                step="0.5"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="25.00"
                className="w-full px-3.5 py-2 rounded-xl border border-[#ffccd5] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#ff8fa3]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#590d22] block mb-1">Precio Oferta ($ USD) <small className="font-normal text-rose-500">(Opcional)</small></label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                placeholder="30.00"
                className="w-full px-3.5 py-2 rounded-xl border border-[#ffccd5] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#ff8fa3]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#590d22] block mb-1">Puntuación (Estrellas)</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#ffccd5] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#ff8fa3]"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                <option value={3}>⭐⭐⭐ (3 Stars)</option>
              </select>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="text-xs font-bold text-[#590d22] block mb-1.5">Categorías *</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {CATEGORY_OPTIONS.map(cat => {
                const isSelected = selectedCats.includes(cat.id);
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => handleCategoryToggle(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#ff4d6d] text-white shadow-sm'
                        : 'bg-[#fff0f3] text-[#590d22] border border-[#ffccd5]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={customCat}
              onChange={(e) => setCustomCat(e.target.value)}
              placeholder="Otra categoría personalizada (opcional)..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#ffccd5] text-xs focus:outline-none focus:ring-2 focus:ring-[#ff8fa3]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-[#590d22] block mb-1">Descripción *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Medida: 20cm. Material: 100% Acrílico, hipoalergénico 🧶"
              className="w-full px-3.5 py-2 rounded-xl border border-[#ffccd5] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#ff8fa3]"
            />
          </div>

          {/* Images Section */}
          <div>
            <label className="text-xs font-bold text-[#590d22] block mb-1">Imágenes del Producto</label>
            
            <div className="flex items-center gap-3 mb-2">
              <label className="px-4 py-2 rounded-full border border-[#ffccd5] bg-[#fff0f3] text-[#ff4d6d] hover:bg-[#ff8fa3] hover:text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all">
                <Upload className="w-4 h-4" /> Subir desde dispositivo
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>

            <div className="space-y-2">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => handleUrlChange(idx, e.target.value)}
                    placeholder="https://ejemplo.com/foto.jpg o subida local..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-[#ffccd5] text-xs focus:outline-none focus:ring-2 focus:ring-[#ff8fa3]"
                  />
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveUrlField(idx)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddUrlField}
              className="text-xs font-bold text-[#ff4d6d] hover:underline mt-2 inline-flex items-center gap-1"
            >
              + Añadir otra imagen
            </button>
          </div>

          {/* Image Previews */}
          {imageUrls.some(u => u.trim().length > 0) && (
            <div className="flex gap-2 overflow-x-auto pt-2">
              {imageUrls.map((u, i) => u.trim() && (
                <img 
                  key={i} 
                  src={u} 
                  alt="preview" 
                  className="w-16 h-16 object-cover rounded-lg border border-[#ffccd5]" 
                  onError={(e) => { e.target.src = 'logo.jpg'; }}
                />
              ))}
            </div>
          )}

          {/* Submit */}
          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#ff8fa3] to-[#ff4d6d] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Guardar Producto
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-full border border-[#ffccd5] text-[#590d22] font-bold text-sm hover:bg-[#fff0f3] transition-all cursor-pointer"
            >
              Cancelar
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
