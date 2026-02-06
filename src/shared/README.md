# Shared - Recursos Compartidos

Esta carpeta contiene **código reutilizable** entre features.

## 📁 Estructura

```
shared/
├── components/     # Componentes UI genéricos (Button, Input, Card, etc.)
├── hooks/          # Custom hooks genéricos (useLocalStorage, etc.)
├── types/          # Types globales
├── utils/          # Funciones helper genéricas
└── context/        # Context API + useReducer para estado global
```

## ⚠️ Reglas

- **Solo código REALMENTE compartido**: Si solo 1 feature lo usa, va en esa feature
- **Sin lógica de negocio**: Shared es solo infraestructura
- **Genérico**: Si tiene lógica específica de una feature, no va aquí

## Ejemplos

✅ **Va en shared:**

- Button component genérico
- useLocalStorage hook
- formatDate utility
- Theme context

❌ **NO va en shared:**

- LineupList component (específico de lineup feature)
- useMatchTimer hook (específico de match-control)
- calculateGoalStats (lógica de negocio de statistics)
