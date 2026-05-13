# Sistema de Ventas

Aplicación web full stack para gestión de ventas, inventario y configuración de una pequeña empresa. Desarrollada con React, Vite y Supabase, Desplegada con VERCEL: https://proyecto-full-stack-venta.vercel.app/ .

## Demo

> 

## Tecnologías

- **React 19** con JavaScript (ES6+)
- **Vite** como bundler
- **Supabase** — base de datos PostgreSQL + autenticación
- **Styled Components** — estilos con soporte de temas claro/oscuro
- **Zustand** — manejo de estado global
- **React Router DOM** — navegación entre páginas
- **Iconify** — íconos
- **Vercel** - Despliegue de la pagina

## Funcionalidades

- Autenticación con email/contraseña y Google OAuth
- Rutas protegidas (redirige al login si no hay sesión)
- **POS** — punto de venta con carrito, búsqueda de productos y registro de ventas
- **Kardex** — inventario con alertas de stock bajo
- **Reportes** — historial y estadísticas de ventas
- **Configuración** — CRUD de productos, categorías, marcas, usuarios y datos de empresa
- Tema claro / oscuro
- Diseño responsive — bottom navigation en móvil, sidebar en desktop

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/sistema-ventas.git
cd sistema-ventas

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
```

Agrega tus credenciales de Supabase en `.env.local`:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

```bash
# Iniciar en desarrollo
npm run dev
```


## Estructura del proyecto

```
src/
├── components/
│   ├── atomos/          # Componentes base (Title, Icono, Linea)
│   ├── moleculas/       # Botones y elementos compuestos
│   ├── organismos/      # Sidebar, MobileNavbar, ProtectedRoute
│   └── templates/       # HomeTemplate, LoginTemplate
├── context/             # AuthContext (sesión del usuario)
├── pages/               # Páginas principales y subpáginas de configuración
├── store/               # Zustand (auth, tema)
├── styles/              # Variables, temas y estilos globales
├── supabase/            # Cliente de Supabase
└── utils/               # Data estática (links, módulos)
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_SUPABASE_URL` | URL de tu proyecto en Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave pública (anon key) de Supabase |
