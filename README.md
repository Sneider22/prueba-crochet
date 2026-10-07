# Zafiro Crochet

Plataforma web para la tienda y administración de **Zafiro Crochet**, una marca de piezas hechas a mano en Caracas, Venezuela. Incluye catálogo de productos, carrito de compras con integración a WhatsApp y un panel de administración con gestión de inventario, pedidos pendientes y respaldos — todo sincronizado con Supabase en tiempo real.

---

## Funcionalidades

### Tienda

- Catálogo dinámico con filtros por categoría y búsqueda en tiempo real.
- Sección de ofertas destacada, separada del catálogo principal.
- Modal de detalle por producto con galería de imágenes, descripción completa y selector de cantidad.
- Las imágenes se muestran completas sin recortes, con dimensiones consistentes sin importar el formato original.
- Carrito de compras persistente (LocalStorage) con control de cantidades y opción de empaque para regalo.
- Envío del pedido directo a WhatsApp con el detalle formateado y un saludo dinámico según la hora del día.

### Panel de administración (Zafiro Admin)

- Acceso protegido.
- Crear, editar y eliminar productos con carga múltiple de fotos a Supabase Storage.
- Marcar o desmarcar productos en oferta con un toque; el precio anterior se calcula automáticamente.
- Gestión de pedidos pendientes con semáforo de estatus:
  - **Rojo** — Por empezar (asignado automáticamente al crear el pedido).
  - **Amarillo** — En proceso.
  - **Verde** — Listo o entregado.
- Filtros por estatus con contadores en tiempo real, sincronizados con Supabase.
- Respaldo del catálogo completo en formato JSON descargable.

---

## Tecnologías

| Capa | Herramienta |
|---|---|
| Frontend | React 18 + Vite |
| Estilos | Tailwind CSS |
| Base de datos | Supabase (PostgreSQL) |
| Almacenamiento de imágenes | Supabase Storage |
| Iconos | Lucide React |
| Persistencia offline | LocalStorage |

---

&copy; Zafiro Crochet · Caracas, Venezuela
