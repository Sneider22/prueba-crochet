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

- Acceso protegido por contraseña desde el encabezado.
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

## Configuración de Supabase

### Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

Si no se configura, la app carga los productos locales como fallback.

### Tablas (SQL Editor)

```sql
-- Tabla de productos
CREATE TABLE public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL,
  old_price numeric,
  category text[],
  description text,
  images text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read"   ON public.products FOR SELECT USING (true);
CREATE POLICY "Public insert" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Public delete" ON public.products FOR DELETE USING (true);

-- Tabla de pedidos pendientes
CREATE TABLE public.todos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  status text DEFAULT 'red',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read"   ON public.todos FOR SELECT USING (true);
CREATE POLICY "Public insert" ON public.todos FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON public.todos FOR UPDATE USING (true);
CREATE POLICY "Public delete" ON public.todos FOR DELETE USING (true);
```

### Storage

Crea un bucket llamado `product-images` y configúralo como **público**.

---

## Instalación y uso local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build
```

---

&copy; Zafiro Crochet · Caracas, Venezuela
