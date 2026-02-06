# ⚽ Match Statistics

> Herramienta personal para tomar estadísticas en tiempo real durante partidos de fútbol.

## 📱 Objetivo

Una **PWA mobile-first** para registrar eventos durante partidos de fútbol en directo: goles, tarjetas, cambios, corners, y más. Diseñada para ser **intuitiva** y **rápida** de usar durante un partido.

## 🚀 Quick Start

```bash
# Instalar dependencias
bun install

# Iniciar servidor de desarrollo
bun run dev

# Build para producción
bun run build

# Preview del build
bun run preview

# Lint
bun run lint

# Format
bun run format
```

## 🛠️ Tech Stack

### Core

- ⚛️ **React 19.2** - UI Library (con Actions, useActionState, useEffectEvent)
- 📘 **TypeScript 5** - Type safety (preferencia: `type` sobre `interface`)
- ⚡ **Vite 7.3** - Build tool ultra rápido
- 🔧 **Bun 1.3** - Runtime + Package manager + Bundler + Test runner (todo en uno, 25x más rápido que npm)

### Styling

- 🎨 **Tailwind CSS 4.1** - Utility-first CSS framework
- 📱 **Mobile-first** - Diseño pensado para tablet/móvil

### Linting & Formatting

- 🦀 **Oxlint 1.43** - Linter super rápido (50-100x más que ESLint)
- ✨ **Oxfmt 0.28** - Formatter super rápido (30x más que Prettier, 95%+ compatible)

### PWA

- 📦 **vite-plugin-pwa** - Progressive Web App (instalable desde móvil)
- 📴 **Offline-first** - Funciona sin conexión

### Git Hooks

- 🎣 **Husky 9.1** - Git hooks
- 🚦 **lint-staged 16.2** - Lint solo archivos staged

### State Management

- 🔄 **React Context + useReducer** - Estado global sin librerías extra

## 📂 Arquitectura - Screaming Architecture

El proyecto sigue **Screaming Architecture**: la estructura "grita" qué hace la app.

```
src/
├── features/              # ⭐ Organizadas por DOMINIO
│   ├── lineup/           # Gestión de alineaciones
│   ├── match-control/    # Control del partido (start/pause/end)
│   └── statistics/       # Registro de eventos y estadísticas
│
├── shared/               # Código reutilizable
│   ├── components/       # UI components genéricos
│   ├── hooks/            # Custom hooks genéricos
│   ├── types/            # Types globales
│   ├── utils/            # Utilidades
│   └── context/          # Context API + useReducer
│
├── App.tsx              # Root component
├── main.tsx             # Entry point
└── index.css            # Global styles (Tailwind)
```

👉 Ver [ARCHITECTURE.md](ARCHITECTURE.md) para más detalles.

## 📖 MVP Features

### ✅ Fase 1 - Setup (COMPLETADO)

- [x] Configuración de proyecto (Bun + Vite + React 19)
- [x] Oxlint + Oxfmt
- [x] Husky + lint-staged
- [x] PWA configurado
- [x] Screaming Architecture
- [x] Tailwind CSS
- [x] Context + useReducer inicial

### 🎯 Fase 2 - Core Features (TODO)

- [ ] **Lineup**: Añadir/editar jugadores de ambos equipos
- [ ] **Match Control**: Iniciar/pausar/finalizar partido + cronómetro
- [ ] **Events**: Registrar goles, tarjetas, cambios, corners, tiros
- [ ] **Stats**: Vista en tiempo real de estadísticas
- [ ] **Persistence**: LocalStorage/IndexedDB para no perder datos
- [ ] **Export**: JSON/CSV para análisis posterior

### 🚀 Fase 3 - Mejoras (FUTURO)

- [ ] Histórico de partidos
- [ ] Gráficos y visualizaciones
- [ ] Comparativas entre partidos
- [ ] Mapas de calor
- [ ] Compartir estadísticas

## 🎨 Skills Instalados

Claude Code está equipado con estos skills de Vercel para asegurar calidad:

- ✅ **vercel-react-best-practices** - 40+ reglas de optimización React/Next.js
- ✅ **web-design-guidelines** - 100+ reglas de accesibilidad, performance y UX
- ✅ **vercel-composition-patterns** - Patrones de componentes escalables

## 📝 Diario de Desarrollo

### 2026-02-06 - Día 1: Setup Inicial

**Completado:**

1. ✅ Instalación de Bun 1.3.8
2. ✅ Inicialización de proyecto con Vite 7.3 + React 19.2
3. ✅ Configuración de Oxlint 1.43 + Oxfmt 0.28
4. ✅ Configuración de Husky + lint-staged
5. ✅ Configuración de PWA (vite-plugin-pwa)
6. ✅ Estructura de Screaming Architecture creada
7. ✅ Tailwind CSS 4.1 configurado
8. ✅ Context API + useReducer para estado global
9. ✅ Skills de Vercel instalados

**Decisiones técnicas:**

- Preferencia por `type` sobre `interface` en TypeScript
- Oxlint/Oxfmt en lugar de ESLint/Prettier por velocidad
- Bun en lugar de npm/pnpm por rendimiento
- React Context en lugar de Zustand para mantener MVP simple

**Próximos pasos:**

- Implementar feature `/lineup` (gestión de alineaciones)
- Crear componentes básicos en `/shared/components`
- Implementar cronómetro en `/match-control`

## 🤝 Contribuir

Este es un proyecto personal, pero toda sugerencia es bienvenida.

## 📄 Licencia

MIT

---

**Stack moderno 2026** • React 19 • Bun • Oxlint • Screaming Architecture • PWA
