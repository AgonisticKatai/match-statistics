# Arquitectura del Proyecto - Screaming Architecture

## 🎯 Filosofía

Este proyecto sigue **Screaming Architecture**: la estructura del código "grita" qué hace la aplicación, no qué tecnologías usa.

Al mirar `/src/features` debes entender inmediatamente que es una app de **estadísticas de partidos** con:

- Gestión de alineaciones
- Control de partidos
- Estadísticas en tiempo real

## 📂 Estructura General

```
match-statistics/
├── src/
│   ├── features/           # ⭐ Core de la app - organizadas por DOMINIO
│   │   ├── lineup/         # Todo sobre alineaciones
│   │   ├── match-control/  # Todo sobre control del partido
│   │   └── statistics/     # Todo sobre estadísticas
│   │
│   ├── shared/             # Código reutilizable entre features
│   │   ├── components/     # UI components genéricos
│   │   ├── hooks/          # Custom hooks genéricos
│   │   ├── types/          # Types globales
│   │   ├── utils/          # Utilidades genéricas
│   │   └── context/        # Estado global (Context + useReducer)
│   │
│   ├── App.tsx            # Root component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
│
├── public/                # Assets estáticos
├── docs/                  # Documentación adicional
└── [config files]         # vite.config.ts, tsconfig.json, etc.
```

## 🏗️ Anatomía de una Feature

Cada feature en `/src/features/[feature-name]/` tiene:

```
feature-name/
├── components/       # UI específica de esta feature
│   ├── FeatureList.tsx
│   ├── FeatureForm.tsx
│   └── FeatureCard.tsx
│
├── hooks/            # Lógica reutilizable de esta feature
│   ├── useFeatureLogic.ts
│   └── useFeatureValidation.ts
│
├── types/            # TypeScript types de esta feature
│   └── index.ts
│
├── utils/            # Helper functions de esta feature
│   └── featureHelpers.ts
│
└── index.ts          # Barrel export - exporta todo lo público
```

## 📊 Flujo de Datos

```
User Action
    ↓
Component (UI)
    ↓
Hook (Logic)
    ↓
Context (Global State)
    ↓
Component (Re-render)
```

## ✅ Reglas de Oro

1. **Organiza por FEATURE, no por tipo de archivo**
   - ❌ `/components/LineupList.tsx`
   - ✅ `/features/lineup/components/LineupList.tsx`

2. **Alta cohesión, bajo acoplamiento**
   - Todo lo de "lineup" está en `/features/lineup/`
   - Las features NO se importan entre sí directamente
   - Usan `/shared` para comunicación

3. **Shared solo para lo REALMENTE compartido**
   - Si solo 1 feature lo usa → va en esa feature
   - Si 2+ features lo usan → puede ir en shared

4. **Cada feature es independiente**
   - Puedes eliminar una feature sin romper las demás
   - Fácil de testear en aislamiento
   - Fácil de escalar

## 🚀 Ventajas

- **Onboarding rápido**: Nuevos devs entienden el dominio instantáneamente
- **Escalable**: Añadir features es trivial
- **Mantenible**: Cambios localizados en una feature
- **Testeable**: Features independientes = tests independientes
- **Framework agnostic**: La arquitectura sobrevive a cambios de tech stack

## 📚 Referencias

- [Screaming Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html)
- [React Folder Structure](https://profy.dev/article/react-folder-structure)
