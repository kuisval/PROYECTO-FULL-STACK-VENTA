# Sistema de Ventas

Aplicación web full stack para gestión de ventas, inventario y configuración de una pequeña empresa. Desarrollada con React, Vite y Supabase, Desplegada con VERCEL: https://proyecto-full-stack-venta.vercel.app/ .

## Demo

> Link:https://proyecto-full-stack-venta.vercel.app/
> Para iniciar sesión ingrese el siguiente correo: "empleado1@empresa.com" y la siguente contraseña: "1234"

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

