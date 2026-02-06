# Features - Screaming Architecture

Esta carpeta contiene las **features principales de la aplicación**, organizadas por dominio.

## 📁 Estructura

Cada feature sigue esta estructura:

```
feature-name/
├── components/     # Componentes UI específicos de esta feature
├── hooks/          # Custom hooks específicos de esta feature
├── types/          # TypeScript types/interfaces específicas
├── utils/          # Funciones helper específicas
└── index.ts        # Barrel export (exporta todo lo público)
```

## 🎯 Features del MVP

### 1. `lineup/` - Gestión de Alineaciones

- Añadir/editar jugadores
- Configurar equipos (local/visitante)
- Posiciones y números de camiseta

### 2. `match-control/` - Control del Partido

- Iniciar/pausar/finalizar partido
- Cronómetro del partido
- Control de tiempo (primer/segundo tiempo)

### 3. `statistics/` - Registro de Eventos

- Goles, tarjetas, cambios
- Corners, tiros, posesión
- Vista en tiempo real de estadísticas

## ✨ Principios

- **Una feature = Un dominio de negocio**
- **Alta cohesión**: Todo lo relacionado está junto
- **Bajo acoplamiento**: Features independientes entre sí
- **Shared para lo común**: Componentes/hooks reutilizables van a `/shared`
