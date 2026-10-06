import React, { useState, useEffect } from 'react';
import { X, Upload, Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
  const [description, setDescription] = useState('');
  const [selectedCats, setSelectedCats] = useState([]);
  const [customCat, setCustomCat] = useState('');
  
  // Imágenes: pueden ser archivos nuevos o URLs ya existentes
  const [imageFiles, setImageFiles] = useState([]);    // File objects para subir
  const [imagePreviews, setImagePreviews] = useState([]); // URLs preview locales
  const [existingImageUrls, setExistingImageUrls] = useState([]); // URLs ya guardadas en Supabase

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || '');
      setPrice(editingProduct.price || '');
      setOldPrice(editingProduct.oldPrice || '');
      setDescription(editingProduct.description || '');
      const cats = Array.isArray(editingProduct.category)
        ? editingProduct.category
        : [editingProduct.category].filter(Boolean);
      setSelectedCats(cats);
      // Si el producto ya tiene imagen guardada, la mostramos
      const existingImgs = editingProduct.images?.length > 0
        ? editingProduct.images
        : editingProduct.image ? [editingProduct.image] : [];
      setExistingImageUrls(existingImgs);
      setImageFiles([]);
      setImagePreviews([]);
    } else {
      setName('');
      setPrice('');
      setOldPrice('');
      setDescription('');
      setSelectedCats(['personalizados']);
      setCustomCat('');
      setImageFiles([]);
      setImagePreviews([]);
      setExistingImageUrls([]);
    }
    setError('');
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleCategoryToggle = (catId) => {
    setSelectedCats(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Generar previews locales
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImageFiles(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeNewImage = (idx) => {
    URL.revokeObjectURL(imagePreviews[idx]);
    setImageFiles(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const removeExistingImage = (idx) => {
    setExistingImageUrls(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const finalCats = [...selectedCats];
    if (customCat.trim() && !finalCats.includes(customCat.trim().toLowerCase())) {
      finalCats.push(customCat.trim().toLowerCase());
    }
    if (finalCats.length === 0) finalCats.push('personalizados');

    // Validación básica
    if (!name.trim() || !price || finalCats.length === 0 || !description.trim()) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }

    const totalImages = existingImageUrls.length + imageFiles.length;
    if (totalImages === 0) {
      setError('Por favor selecciona al menos una imagen del producto.');
      return;
    }

    setLoading(true);

    try {
      // 1. Subir las imágenes nuevas a Supabase Storage
      const uploadedUrls = [];
      for (const file of imageFiles) {
        const ext = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw new Error(`Error subiendo imagen: ${uploadError.message}`);

        // Obtener la URL pública
        const { data: publicData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicData.publicUrl);
      }

      // 2. Combinar URLs existentes con las nuevas
      const allImageUrls = [...existingImageUrls, ...uploadedUrls];
      const mainImageUrl = allImageUrls[0];

      // 3. Guardar/actualizar en la tabla de Supabase
      // Construimos el objeto sin oldPrice para evitar errores si la columna tiene otro nombre
      const productData = {
        name: name.trim(),
        price: parseFloat(price),
        description: description.trim(),
        category: finalCats.length === 1 ? finalCats[0] : finalCats[0],
        image: mainImageUrl,
      };

      // Solo agregamos old_price si el usuario lo puso
      if (oldPrice) {
        productData.old_price = parseFloat(oldPrice);
      }

      let savedProduct;
      if (editingProduct?.id) {
        // Actualizar producto existente
        const { data, error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
          .select()
          .single();

        if (updateError) throw new Error(updateError.message);
        savedProduct = data;
      } else {
        // Insertar producto nuevo
        const { data, error: insertError } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();

        if (insertError) throw new Error(insertError.message);
        savedProduct = data;
      }

      // 4. Notificar al padre con el producto guardado
      onSaveProduct(savedProduct);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Ocurrió un error al guardar el producto.');
    } finally {
      setLoading(false);
    }
  };

  const totalImages = existingImageUrls.length + imagePreviews.length;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-toast"
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#ffccd5] max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-[#fff0f3] flex items-center justify-between bg-[#fff0f3]">
          <h3 className="text-lg font-black text-[#590d22] flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#ff4d6d]" /> 
            {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white text-[#590d22] cursor-pointer" disabled={loading}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-3 rounded-xl">
              ⚠️ {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
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
              <label className="text-xs font-bold text-[#590d22] block mb-1">
                Precio Tachado <small className="font-normal text-rose-500">(Opcional - para ofertas)</small>
              </label>
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
          </div>

          {/* Categories */}
          <div>
            <label className="text-xs font-bold text-[#590d22] block mb-1.5">Categoría *</label>
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
            <label className="text-xs font-bold text-[#590d22] block mb-2">
              Fotos del Producto * <span className="font-normal text-[#800f2f]/60">({totalImages} seleccionada{totalImages !== 1 ? 's' : ''})</span>
            </label>
            
            {/* Upload button */}
            <label className="w-full flex flex-col items-center justify-center gap-2 py-6 border-2 border-dashed border-[#ffccd5] rounded-2xl bg-[#fff0f3] hover:bg-[#ffe4e8] cursor-pointer transition-all">
              <Upload className="w-6 h-6 text-[#ff4d6d]" />
              <span className="text-xs font-bold text-[#ff4d6d]">Toca aquí para seleccionar fotos</span>
              <span className="text-xs text-[#800f2f]/60">Puedes subir varias a la vez</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>

            {/* Image previews */}
            {totalImages > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {/* Imágenes ya guardadas */}
                {existingImageUrls.map((url, i) => (
                  <div key={`existing-${i}`} className="relative">
                    <img
                      src={url}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded-xl border-2 border-[#ff4d6d]"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-[#ff4d6d]/80 text-white text-[9px] text-center font-bold rounded-b-xl py-0.5">
                        PRINCIPAL
                      </span>
                    )}
                  </div>
                ))}
                {/* Imágenes nuevas */}
                {imagePreviews.map((preview, i) => (
                  <div key={`new-${i}`} className="relative">
                    <img
                      src={preview}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded-xl border-2 border-[#ff8fa3]"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {existingImageUrls.length === 0 && i === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-[#ff8fa3]/80 text-white text-[9px] text-center font-bold rounded-b-xl py-0.5">
                        PRINCIPAL
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#ff8fa3] to-[#ff4d6d] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {imageFiles.length > 0 ? 'Subiendo fotos...' : 'Guardando...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Guardar Producto
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 rounded-full border border-[#ffccd5] text-[#590d22] font-bold text-sm hover:bg-[#fff0f3] transition-all cursor-pointer disabled:opacity-60"
            >
              Cancelar
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
