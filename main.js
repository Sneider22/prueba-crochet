// Estado de la aplicación
function getInitialProducts() {
  const saved = localStorage.getItem('zafiro_products');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.error("Error al cargar productos guardados:", e);
    }
  }
  return typeof products !== 'undefined' ? products : [];
}

let state = {
  products: getInitialProducts(),
  cart: JSON.parse(localStorage.getItem('cart')) || [],
  filter: 'all',
  search: '',
  currentPage: 1,
  itemsPerPage: 6,
  extras: {
    giftBox: 0
  }
};

function saveProductsToStorage() {
  localStorage.setItem('zafiro_products', JSON.stringify(state.products));
  renderApp();
  if (document.getElementById('adminPanelModal')?.classList.contains('active')) {
    renderAdminProducts();
  }
}

// Elementos del DOM
const grid = document.getElementById('product-grid');
const offersGrid = document.getElementById('offers-grid');
const offersContainer = document.getElementById('offers-container');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const searchInput = document.getElementById('search');
const searchSuggestions = document.getElementById('search-suggestions');
const filterButtons = document.querySelectorAll('.filter-btn');

// Mapeo de categorías a emojis
const categoryEmojis = {
  'ramos': '•',
  'snoopy': '•',
  'superheroes': '•',
  'llaveros': '•',
  'personajes': '•',
  'peluches': '•',
};

/* === INICIALIZACIÓN === */
function init() {
  renderApp();
  setupEventListeners();
  updateCartCount();
  setupHistoryManagement();
}

// Manejar el botón "atrás" del navegador
function setupHistoryManagement() {
  window.addEventListener('popstate', (event) => {
    // Cerrar cualquier modal abierto cuando se presiona "atrás"
    const cartModal = document.getElementById('cartModal');
    const productModal = document.getElementById('productModal');
    const loginModal = document.getElementById('loginModal');
    const adminModal = document.getElementById('adminPanelModal');

    if (cartModal.classList.contains('active')) {
      cartModal.classList.remove('active');
    }
    if (productModal.classList.contains('active')) {
      productModal.classList.remove('active');
    }
    if (loginModal.classList.contains('active')) {
      loginModal.classList.remove('active');
    }
    if (adminModal.classList.contains('active')) {
      adminModal.classList.remove('active');
    }
  });
}

/* === RENDERIZADO === */
function renderApp() {
  // 1. Filtrar productos
  let filtered = state.products.filter(p => {
    // Soporte para categorías múltiples (array o string)
    let matchesCategory = state.filter === 'all';
    if (!matchesCategory) {
      if (Array.isArray(p.category)) {
        // Si category es un array, verificar si incluye el filtro
        matchesCategory = p.category.includes(state.filter);
      } else {
        // Si category es un string, comparar directamente
        matchesCategory = p.category === state.filter;
      }
    }
    const searchWords = state.search.toLowerCase().split(' ').filter(word => word.length > 0);
    const matchesSearch = searchWords.every(word =>
      p.name.toLowerCase().includes(word) ||
      (Array.isArray(p.category) ? p.category.some(cat => cat.toLowerCase().includes(word)) : p.category.toLowerCase().includes(word))
    );
    return matchesCategory && matchesSearch;
  });

  // 2. Calcular paginación
  const totalPages = Math.ceil(filtered.length / state.itemsPerPage);
  const startIndex = (state.currentPage - 1) * state.itemsPerPage;
  const endIndex = startIndex + state.itemsPerPage;
  const paginatedProducts = filtered.slice(startIndex, endIndex);

  // 3. Renderizar Grid Principal (solo productos de la página actual)
  grid.innerHTML = paginatedProducts.map(product => createProductCard(product)).join('');

  // 4. Renderizar controles de paginación
  renderPagination(totalPages);

  // 5. Renderizar Ofertas (Solo si no hay búsqueda activa)
  if (state.filter === 'all' && state.search === '') {
    const sensitiveOffers = state.products.filter(p => p.oldPrice);
    if (sensitiveOffers.length > 0) {
      offersContainer.classList.remove('hidden');
      offersGrid.innerHTML = sensitiveOffers.map(product => createProductCard(product, true)).join('');
    } else {
      offersContainer.classList.add('hidden');
    }
  } else {
    offersContainer.classList.add('hidden');
  }
}

function renderPagination(totalPages) {
  const paginationContainer = document.getElementById('pagination');
  if (!paginationContainer) return;

  if (totalPages <= 1) {
    paginationContainer.innerHTML = '';
    return;
  }

  let paginationHTML = '<div class="pagination-controls">';

  // Botón anterior
  paginationHTML += `
    <button class="pagination-btn" onclick="changePage(${state.currentPage - 1})" ${state.currentPage === 1 ? 'disabled' : ''}>
      <i class="fa-solid fa-chevron-left"></i>
    </button>
  `;

  // Números de página (Lógica de ventana deslizante - Max 5)
  const maxVisibleButtons = 5;
  let startPage = Math.max(1, state.currentPage - Math.floor(maxVisibleButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

  if (endPage - startPage + 1 < maxVisibleButtons) {
    startPage = Math.max(1, endPage - maxVisibleButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <button class="pagination-btn ${i === state.currentPage ? 'active' : ''}" onclick="changePage(${i})">
        ${i}
      </button>
    `;
  }

  // Botón siguiente
  paginationHTML += `
    <button class="pagination-btn" onclick="changePage(${state.currentPage + 1})" ${state.currentPage === totalPages ? 'disabled' : ''}>
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  `;

  paginationHTML += '</div>';
  paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
  const filtered = state.products.filter(p => {
    let matchesCategory = state.filter === 'all';
    if (!matchesCategory) {
      if (Array.isArray(p.category)) {
        matchesCategory = p.category.includes(state.filter);
      } else {
        matchesCategory = p.category === state.filter;
      }
    }
    const matchesSearch = p.name.toLowerCase().includes(state.search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / state.itemsPerPage);

  if (page < 1 || page > totalPages) return;

  state.currentPage = page;
  renderApp();

  // Scroll suave al inicio del catálogo
  document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
}

function createProductCard(product, isOfferSelect = false) {
  const priceDisplay = product.oldPrice
    ? `<div class="card-price-container">
             <span class="price">$${product.price.toFixed(2)}</span>
             <span class="old-price">$${product.oldPrice.toFixed(2)}</span>
           </div>`
    : `<div class="card-price-container">
             <span class="price">$${product.price.toFixed(2)}</span>
           </div>`;

  const badge = product.oldPrice ? `<span class="card-badge">OFERTA</span>` : '';

  return `
        <article class="card" onclick="openProductModal(${product.id})" style="cursor: pointer;">
            <div class="card-image-container">
                <img src="${product.image}" alt="${product.name}" class="card-img">
                ${badge}
            </div>
            <div class="card-content">
                <span class="card-category">${Array.isArray(product.category) ? product.category[0] : product.category}</span>
                <h3 class="card-title">${product.name}</h3>
                ${priceDisplay}
                ${!isOfferSelect ? `
                <div class="card-actions">
                    <button class="btn btn-outline" style="flex: 1; justify-content: center; padding: 0.5rem;" title="Ver Detalle">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button onclick="event.stopPropagation(); addToCart(${product.id})" class="btn btn-primary" style="flex: 1; justify-content: center; padding: 0.5rem;" title="Agregar al Carrito">
                        <i class="fa-solid fa-cart-shopping"></i>
                    </button>
                </div>` : `
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); addToCart(${product.id})" style="flex: 1; justify-content: center; padding: 0.5rem;" title="Agregar al Carrito">
                        <i class="fa-solid fa-cart-shopping"></i>
                    </button>
                </div>`}
            </div>
        </article>
    `;
}

/* === LÓGICA DEL DETALLE (MODAL) === */
let currentDetailId = null;
let currentImageIndex = 0;
let currentProductImages = [];

function openProductModal(id) {
  const product = state.products.find(p => p.id === id);
  if (!product) return;

  currentDetailId = id;

  // Llenar datos modal
  document.getElementById('detailImage').src = product.image;
  document.getElementById('detailCategory').innerText = product.category;
  document.getElementById('detailName').innerText = product.name;
  document.getElementById('detailDesc').innerText = product.description || "Sin descripción disponible.";
  document.getElementById('detailPrice').innerText = `$${product.price.toFixed(2)}`;
  document.getElementById('qtyInput').value = 1;

  document.getElementById('productModal').classList.add('active');
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
}

function changeQty(delta) {
  const input = document.getElementById('qtyInput');
  let val = parseInt(input.value) + delta;
  if (val < 1) val = 1;
  input.value = val;
}

function addToCartFromModal() {
  if (!currentDetailId) return;
  const qty = parseInt(document.getElementById('qtyInput').value);
  addToCart(currentDetailId, qty);
  closeProductModal();
}

/* === LÓGICA DEL CARRITO === */
function addToCart(id, quantity = 1) {
  const product = state.products.find(p => p.id === id);
  const existing = state.cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    state.cart.push({ ...product, quantity: quantity });
  }

  saveCart();
  updateCartCount();
  showToast(`¡"${product ? product.name : 'Producto'}" agregado al carrito! 🛍️`, 'success');
  openCart(); // Opcional: abrir carrito al agregar para confirmar
}

function removeFromCart(id) {
  state.cart = state.cart.filter(item => item.id !== id);
  saveCart();
  renderCartItems();
  updateCartCount();
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(state.cart));
}

function updateCartCount() {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.innerText = count;
}

/* === MODAL & UI CONTROLS === */
function openCart() {
  document.getElementById('cartModal').classList.add('active');
  renderCartItems();
  renderCartExtras();
  // Agregar estado al historial para manejar el botón "atrás"
  history.pushState({ modal: 'cart' }, '');
}

function closeCart() {
  document.getElementById('cartModal').classList.remove('active');
}

function openProductModal(id) {
  const product = state.products.find(p => p.id === id);
  if (!product) return;

  currentDetailId = id;
  currentImageIndex = 0;

  // Obtener imágenes (usar array si existe, sino crear array con imagen única)
  currentProductImages = product.images || [product.image];

  // Llenar datos modal
  updateProductImage();
  const displayCategory = Array.isArray(product.category) ? product.category[0] : product.category;
  document.getElementById('detailCategory').innerText = displayCategory;
  document.getElementById('detailName').innerText = product.name;
  document.getElementById('detailDesc').innerText = product.description || "Sin descripción disponible.";
  document.getElementById('detailPrice').innerText = `$${product.price.toFixed(2)}`;
  document.getElementById('qtyInput').value = 1;

  // Renderizar indicadores
  renderImageIndicators();

  document.getElementById('productModal').classList.add('active');
  // Agregar estado al historial
  history.pushState({ modal: 'product' }, '');
}

function updateProductImage() {
  const imgElement = document.getElementById('detailImage');
  imgElement.src = currentProductImages[currentImageIndex];

  // Actualizar indicadores activos
  const indicators = document.querySelectorAll('.indicator-dot');
  indicators.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentImageIndex);
  });
}

function renderImageIndicators() {
  const container = document.getElementById('imageIndicators');
  if (currentProductImages.length <= 1) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = currentProductImages.map((_, index) =>
    `<div class="indicator-dot ${index === 0 ? 'active' : ''}" onclick="goToImage(${index})"></div>`
  ).join('');
}

function changeProductImage(direction) {
  currentImageIndex += direction;

  // Loop circular
  if (currentImageIndex < 0) {
    currentImageIndex = currentProductImages.length - 1;
  } else if (currentImageIndex >= currentProductImages.length) {
    currentImageIndex = 0;
  }

  updateProductImage();
}

function goToImage(index) {
  currentImageIndex = index;
  updateProductImage();
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
}

function renderCartItems() {
  if (state.cart.length === 0) {
    cartItemsContainer.innerHTML = '<p style="text-align: center; color: #999; margin-top:2rem;">Tu carrito está vacío ☹️</p>';
    cartTotalElement.innerText = "$0.00";
    return;
  }

  let total = 0;
  cartItemsContainer.innerHTML = state.cart.map(item => {
    total += item.price * item.quantity;
    return `
            <div class="cart-item">
                <div style="display:flex; align-items:center; gap:1rem;">
                    <img src="${item.image}" style="width:50px; height:50px; object-fit:cover; border-radius:8px;">
                    <div>
                        <h4 style="font-size:0.9rem; margin-bottom:0.2rem;">${item.name}</h4>
                        <span style="font-size:0.8rem; color:#666;">$${item.price} x ${item.quantity}</span>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})" style="color: #ff4d6d; background: none; border: none; cursor: pointer;">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
  }).join('');

  cartTotalElement.innerText = `$${total.toFixed(2)}`;
  renderCartExtras(); // Actualizar el total general después de items
}

function renderCartExtras() {
  const container = document.getElementById('cartExtras');
  if (!container) return;

  container.innerHTML = `
    <h4 class="extras-title">¿Deseas añadir una caja de regalo?</h4>
    <div class="extra-item">
      <div class="extra-main">
        <img src="caja.jpeg" alt="Caja de regalo" class="extra-img">
        <div class="extra-info">
          <span class="extra-name">Caja de regalo</span>
          <span class="extra-price">+$3.00</span>
        </div>
      </div>
      <div class="extra-controls">
        <button onclick="changeExtra('giftBox', -1)">-</button>
        <span class="extra-qty">${state.extras.giftBox}</span>
        <button onclick="changeExtra('giftBox', 1)">+</button>
      </div>
    </div>
  `;

  updateCartTotalWithExtras();
}

function changeExtra(type, delta) {
  state.extras[type] += delta;
  if (state.extras[type] < 0) state.extras[type] = 0;
  renderCartExtras();
}

function updateCartTotalWithExtras() {
  let total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  total += state.extras.giftBox * 3;
  cartTotalElement.innerText = `$${total.toFixed(2)}`;
}

/* === SEARCH SUGGESTIONS === */
function showSearchSuggestions(query) {
  if (!query || query.length < 2) {
    searchSuggestions.classList.remove('active');
    searchSuggestions.innerHTML = '';
    return;
  }

  // Buscar productos que coincidan por palabras clave
  const queryWords = query.toLowerCase().split(' ').filter(word => word.length > 0);
  const matches = state.products.filter(p => {
    return queryWords.every(word =>
      p.name.toLowerCase().includes(word) ||
      (Array.isArray(p.category) ? p.category.some(cat => cat.toLowerCase().includes(word)) : p.category.toLowerCase().includes(word))
    );
  });

  if (matches.length === 0) {
    searchSuggestions.classList.remove('active');
    return;
  }

  searchSuggestions.innerHTML = matches.map(product => `
    <div class="suggestion-item" onclick="selectSuggestion('${product.name}')">
      <strong>${product.name}</strong>
      <span class="suggestion-price">$${product.price.toFixed(2)}</span>
    </div>
  `).join('');

  searchSuggestions.classList.add('active');
}

function selectSuggestion(productName) {
  // Actualizar el estado de búsqueda con el nombre seleccionado
  state.search = productName;
  state.filter = 'all'; // Resetear filtro de categoría para asegurar que se encuentre
  state.currentPage = 1; // Ir a la primera página

  // Actualizar el input visualmente (limpiar según petición del usuario)
  searchInput.value = '';

  // Renderizar la aplicación con el nuevo filtro de búsqueda
  renderApp();

  // Cerrar sugerencias
  searchSuggestions.classList.remove('active');

  // Scroll suave al catálogo para ver los resultados
  const catalogSection = document.getElementById('catalogo');
  if (catalogSection) {
    catalogSection.scrollIntoView({ behavior: 'smooth' });
  }
}

function checkoutWhatsApp() {
  if (state.cart.length === 0) return alert("Agrega productos primero :)");

  const phoneNumber = "584142826330";
  const greeting = getGreeting();
  let message = `${greeting}, quiero realizar el siguiente pedido:\n\n`;
  let total = 0;

  state.cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    const emoji = categoryEmojis[item.category] || '•';
    message += `${emoji} *${item.name}* (x${item.quantity}) - $${subtotal.toFixed(2)}\n`;
  });

  // Añadir Extras
  if (state.extras.giftBox > 0) {
    const cost = state.extras.giftBox * 3;
    total += cost;
    message += `🎁 Caja de regalo (x${state.extras.giftBox}) - $${cost.toFixed(2)}\n`;
  }

  message += `\n💰 *TOTAL A PAGAR: $${total.toFixed(2)}*`;
  message += `\n\nQuedo atento a la confirmación. Gracias!`;

  const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

/* === FILTROS & EVENTOS === */
function setupEventListeners() {
  // Volver arriba al hacer clic en el logo y resetear app
  const logoElements = document.querySelectorAll('.logo-placeholder, .logo-text');
  logoElements.forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      // Resetear estado
      state.search = '';
      state.filter = 'all';
      state.currentPage = 1;

      // Limpiar input visualmente
      searchInput.value = '';

      // Resetear botones de filtro visualmente
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === 'all') btn.classList.add('active');
      });

      // Renderizar y scroll
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Búsqueda con autocompletado (modificado para evitar saltos de layout en móvil)
  searchInput.addEventListener('input', (e) => {
    state.search = e.target.value;
    // state.currentPage = 1; // Se quita el render en vivo
    // renderApp(); // Se quita el render en vivo para evitar saltos
    showSearchSuggestions(e.target.value);
  });

  // Nuevo: Buscar al presionar Enter
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      state.currentPage = 1;
      renderApp();
      searchSuggestions.classList.remove('active');
      // Scroll suave al catálogo para ver los resultados
      const catalogSection = document.getElementById('catalogo');
      if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  // Cerrar sugerencias al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.controls')) {
      searchSuggestions.classList.remove('active');
    }
  });

  // Filtros de Categoría
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remover clase active de todos
      filterButtons.forEach(b => b.classList.remove('active'));
      // Activar el actual
      btn.classList.add('active');

      // Actualizar estado
      state.filter = btn.dataset.category;
      state.search = ''; // Limpiar búsqueda al cambiar de categoría
      searchInput.value = ''; // Limpiar input visualmente

      state.currentPage = 1; // Reset a página 1
      renderApp();
    });
  });

  // Admin Login Logic
  const adminBtn = document.getElementById('adminBtn');
  if (adminBtn) {
    adminBtn.addEventListener('click', () => {
      document.getElementById('loginModal').classList.add('active');
      history.pushState({ modal: 'login' }, '');
    });
  }

  // === TO-DO LIST ADMIN ===
  let todos = JSON.parse(localStorage.getItem('adminTodos')) || [];

  function renderTodos() {
    const container = document.getElementById('todoList');
    if (!container) return;

    container.innerHTML = todos.length === 0
      ? '<p style="text-align:center; color:#999; margin-top:1rem;">No hay pendientes. ¡Buen trabajo! ✨</p>'
      : todos.map((todo, index) => `
          <div class="todo-item">
            <span class="todo-text">${todo}</span>
            <button onclick="deleteTodo(${index})" class="delete-todo">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        `).join('');
  }

  // Global functions for onclick handlers
  window.addTodo = () => {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();

    if (text) {
      todos.unshift(text);
      saveTodos();
      input.value = '';
      renderTodos();
    }
  };

  window.deleteTodo = (index) => {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
  };

  function saveTodos() {
    localStorage.setItem('adminTodos', JSON.stringify(todos));
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('usernameInput').value;
      const pass = document.getElementById('passwordInput').value;

      if ((user === 'sofiavsh' && pass === 'pato123') || (user === 'admin' && pass === 'admin') || pass === 'zafiro') {
        closeLogin();
        openAdminPanel();
      } else {
        showToast("Credenciales incorrectas", "info");
      }
    });
  }
}

function openAdminPanel() {
  document.getElementById('adminPanelModal').classList.add('active');
  renderAdminProducts();
  history.pushState({ modal: 'admin' }, '');
}

function closeLogin() {
  document.getElementById('loginModal').classList.remove('active');
}

function closeAdminPanel() {
  document.getElementById('adminPanelModal').classList.remove('active');
}

/* === NOTIFICACIONES TOAST === */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-info';
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/* === PESTAÑAS ADMIN === */
function switchAdminTab(tabName) {
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  document.getElementById('adminTabProducts').classList.toggle('active', tabName === 'products');
  document.getElementById('adminTabTodos').classList.toggle('active', tabName === 'todos');
  document.getElementById('adminTabBackup').classList.toggle('active', tabName === 'backup');

  if (tabName === 'products') renderAdminProducts();
  if (tabName === 'todos') {
    if (typeof renderTodos === 'function') renderTodos();
  }
}

/* === GESTOR DE PRODUCTOS EN ADMIN === */
function renderAdminProducts(query = '') {
  const listContainer = document.getElementById('adminProductsList');
  if (!listContainer) return;

  const filterText = (query || document.getElementById('adminSearchInput')?.value || '').toLowerCase();
  
  const filtered = state.products.filter(p => 
    p.name.toLowerCase().includes(filterText) || 
    (Array.isArray(p.category) ? p.category.some(c => c.toLowerCase().includes(filterText)) : p.category.toLowerCase().includes(filterText))
  );

  if (filtered.length === 0) {
    listContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888; padding: 2rem;">No se encontraron productos.</p>';
    return;
  }

  listContainer.innerHTML = filtered.map(product => {
    const mainImg = product.image || (product.images && product.images[0]) || 'logo.jpg';
    const cats = Array.isArray(product.category) ? product.category.join(', ') : product.category;
    const isOffer = !!product.oldPrice;

    return `
      <div class="admin-prod-card">
        <img src="${mainImg}" alt="${product.name}" class="admin-prod-thumb" onerror="this.src='logo.jpg'">
        <div class="admin-prod-info">
          <div class="admin-prod-name">${product.name}</div>
          <div class="admin-prod-meta">
            <span><strong>$${product.price.toFixed(2)}</strong></span>
            ${isOffer ? `<span style="color:#e11d48; font-weight:700;">[OFERTA: $${product.oldPrice.toFixed(2)}]</span>` : ''}
            <span>• ${cats}</span>
          </div>
        </div>
        <div class="admin-prod-actions">
          <button onclick="openProductForm(${product.id})" class="btn-icon-action" title="Editar">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button onclick="toggleOfferAdmin(${product.id})" class="btn-icon-action ${isOffer ? 'btn-icon-danger' : ''}" title="${isOffer ? 'Quitar Oferta' : 'Marcar Oferta'}">
            <i class="fa-solid fa-tag"></i>
          </button>
          <button onclick="deleteProductAdmin(${product.id})" class="btn-icon-action btn-icon-danger" title="Eliminar">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function filterAdminProducts() {
  const query = document.getElementById('adminSearchInput').value;
  renderAdminProducts(query);
}

/* === FORMULARIO CREAR / EDITAR PRODUCTO === */
let formUploadedImages = [];

function openProductForm(productId = null) {
  const formModal = document.getElementById('productFormModal');
  const titleEl = document.getElementById('productFormTitle');
  formUploadedImages = [];

  // Reset inputs
  document.getElementById('formProductId').value = productId || '';
  document.getElementById('formProductName').value = '';
  document.getElementById('formProductPrice').value = '';
  document.getElementById('formProductOldPrice').value = '';
  document.getElementById('formProductRating').value = '5';
  document.getElementById('formProductDesc').value = '';
  document.getElementById('formCustomCategory').value = '';

  // Uncheck all category checkboxes
  document.querySelectorAll('#formCategoryCheckboxes input[type="checkbox"]').forEach(cb => cb.checked = false);

  // Clear image URLs & previews
  const urlList = document.getElementById('imageUrlInputs');
  urlList.innerHTML = '';
  addUrlInputRow();

  document.getElementById('formImagePreviews').innerHTML = '';

  if (productId) {
    const p = state.products.find(item => item.id === productId);
    if (p) {
      titleEl.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Editar Producto: ${p.name}`;
      document.getElementById('formProductName').value = p.name;
      document.getElementById('formProductPrice').value = p.price;
      document.getElementById('formProductOldPrice').value = p.oldPrice || '';
      document.getElementById('formProductRating').value = p.rating || 5;
      document.getElementById('formProductDesc').value = p.description || '';

      // Set category checkboxes
      const prodCats = Array.isArray(p.category) ? p.category : [p.category];
      document.querySelectorAll('#formCategoryCheckboxes input[type="checkbox"]').forEach(cb => {
        if (prodCats.includes(cb.value)) cb.checked = true;
      });

      // Fill images
      const imagesList = p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []);
      urlList.innerHTML = '';
      imagesList.forEach(url => addUrlInputRow(url));
      renderImagePreviews();
    }
  } else {
    titleEl.innerHTML = `<i class="fa-solid fa-box-open"></i> Agregar Nuevo Producto`;
  }

  formModal.classList.add('active');
}

function closeProductForm() {
  document.getElementById('productFormModal').classList.remove('active');
}

function addUrlInputRow(value = '') {
  const container = document.getElementById('imageUrlInputs');
  const div = document.createElement('div');
  div.className = 'url-input-row';
  div.innerHTML = `
    <input type="text" class="prod-img-url" value="${value}" placeholder="Ruta o URL de imagen (ej: fotos productos/snoopy.jpg)" oninput="renderImagePreviews()">
    <button type="button" onclick="removeUrlRow(this)" class="btn-icon-small"><i class="fa-solid fa-xmark"></i></button>
  `;
  container.appendChild(div);
  renderImagePreviews();
}

function removeUrlRow(btn) {
  btn.closest('.url-input-row').remove();
  renderImagePreviews();
}

function handleImageFileUpload(e) {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (event) => {
      formUploadedImages.push(event.target.result);
      addUrlInputRow(event.target.result);
    };
    reader.readAsDataURL(file);
  });
}

function renderImagePreviews() {
  const container = document.getElementById('formImagePreviews');
  if (!container) return;

  const urlInputs = document.querySelectorAll('.prod-img-url');
  const urls = Array.from(urlInputs).map(i => i.value.trim()).filter(val => val.length > 0);

  if (urls.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = urls.map((url, idx) => `
    <div class="preview-thumb-box">
      <img src="${url}" onerror="this.src='logo.jpg'">
    </div>
  `).join('');
}

function handleProductFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('formProductId').value;
  const name = document.getElementById('formProductName').value.trim();
  const price = parseFloat(document.getElementById('formProductPrice').value);
  const oldPriceVal = document.getElementById('formProductOldPrice').value;
  const oldPrice = oldPriceVal ? parseFloat(oldPriceVal) : undefined;
  const rating = parseInt(document.getElementById('formProductRating').value);
  const description = document.getElementById('formProductDesc').value.trim();

  // Categorías seleccionadas
  const selectedCats = Array.from(document.querySelectorAll('#formCategoryCheckboxes input[type="checkbox"]:checked')).map(cb => cb.value);
  const customCat = document.getElementById('formCustomCategory').value.trim();
  if (customCat && !selectedCats.includes(customCat.toLowerCase())) {
    selectedCats.push(customCat.toLowerCase());
  }

  if (selectedCats.length === 0) {
    selectedCats.push('personalizados');
  }

  // Imágenes
  const urlInputs = document.querySelectorAll('.prod-img-url');
  const images = Array.from(urlInputs).map(i => i.value.trim()).filter(val => val.length > 0);
  const mainImage = images.length > 0 ? images[0] : 'logo.jpg';

  if (id) {
    // Editar existente
    const index = state.products.findIndex(p => p.id == id);
    if (index !== -1) {
      state.products[index] = {
        ...state.products[index],
        name,
        price,
        oldPrice,
        rating,
        description,
        category: selectedCats.length === 1 ? selectedCats[0] : selectedCats,
        image: mainImage,
        images: images.length > 0 ? images : [mainImage]
      };
      showToast("¡Producto actualizado exitosamente! ✨", "success");
    }
  } else {
    // Crear nuevo
    const newProduct = {
      id: Date.now(),
      name,
      price,
      oldPrice,
      rating,
      description,
      category: selectedCats.length === 1 ? selectedCats[0] : selectedCats,
      image: mainImage,
      images: images.length > 0 ? images : [mainImage]
    };
    state.products.unshift(newProduct);
    showToast("¡Nuevo producto creado! 🎉", "success");
  }

  saveProductsToStorage();
  closeProductForm();
}

function toggleOfferAdmin(id) {
  const p = state.products.find(item => item.id === id);
  if (!p) return;

  if (p.oldPrice) {
    delete p.oldPrice;
    showToast(`Oferta removida de "${p.name}"`, "info");
  } else {
    p.oldPrice = Number((p.price * 1.25).toFixed(2));
    showToast(`"${p.name}" marcado en OFERTA ✨`, "success");
  }

  saveProductsToStorage();
}

function deleteProductAdmin(id) {
  const p = state.products.find(item => item.id === id);
  if (!p) return;

  if (confirm(`¿Estás seguro de que deseas eliminar "${p.name}"?`)) {
    state.products = state.products.filter(item => item.id !== id);
    saveProductsToStorage();
    showToast("Producto eliminado", "info");
  }
}

/* === RESPALDOS & DATOS === */
function exportProductsJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.products, null, 2));
  const dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "zafiro_productos_backup.json");
  document.body.appendChild(dlAnchorElem);
  dlAnchorElem.click();
  dlAnchorElem.remove();
  showToast("¡Descarga de respaldo completada! 💾", "success");
}

function resetProductsDefault() {
  if (confirm("¿Estás seguro de restablecer el catálogo al estado original? Se borrarán los productos creados o editados localmente.")) {
    localStorage.removeItem('zafiro_products');
    state.products = typeof products !== 'undefined' ? [...products] : [];
    saveProductsToStorage();
    showToast("Catálogo restablecido al estado original 🔄", "info");
  }
}

function sendSuggestion() {
  const input = document.getElementById('suggestionInput').value;
  if (!input.trim()) return alert("Por favor escribe algo :)");

  const phoneNumber = "584142826330";
  const greeting = getGreeting();
  const message = `${greeting}, estoy interesad@ en un amigurumi personalizado de:\n\n✨ ${input}\n`;

  const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');

  document.getElementById('suggestionInput').value = '';
  showToast("¡Sugerencia lista para enviar por WhatsApp! 💬", "success");
}

// Función auxiliar para obtener el saludo según la hora
function getGreeting() {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 6 && hour < 12) {
    return "Buenos días";
  } else if (hour >= 12 && hour < 18) {
    return "Buenas tardes";
  } else {
    return "Buenas noches";
  }
}

// Función para el WhatsApp FAB con mensaje dinámico
function setupWhatsAppFAB() {
  const fab = document.getElementById('whatsappFAB');
  if (!fab) return;

  const phoneNumber = "584142826330";
  const greeting = getGreeting();

  const message = `${greeting}, quisiera hacer un pedido de crochet 🧶`;
  const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

  if (fab) {
    fab.href = url;
  }
}

// Iniciar app
init();
setupWhatsAppFAB();
