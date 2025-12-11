# Fase 05: Transformadores Centralizados

> **Objetivo:** Centralizar y estandarizar todos los transformadores de datos
> **Complejidad:** Media
> **Tiempo Estimado:** 1 hora
> **Prerequisitos:** Fases 01-04 completadas

---

## 📋 DESCRIPCIÓN

Consolidar todos los transformadores en módulos centralizados y crear utilidades comunes.

---

## 📁 ARCHIVOS A MODIFICAR/CREAR

```
src/utils/
├── formatters.ts          # Formateo de datos (NUEVO)
├── validators.ts          # Validaciones (NUEVO)
└── index.ts               # Exportaciones (NUEVO)
```

---

## 🔧 ACCIONES A REALIZAR

### 1. Crear `src/utils/formatters.ts`

```typescript
/**
 * Utilidades de formateo de datos
 */

/**
 * Formatea una fecha ISO a formato legible
 */
export function formatDate(
  dateString?: string,
  locale: string = 'es-ES'
): string {
  if (!dateString) return ''

  const date = new Date(dateString)

  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Formatea fecha y hora
 */
export function formatDateTime(
  dateString?: string,
  locale: string = 'es-ES'
): string {
  if (!dateString) return ''

  const date = new Date(dateString)

  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Formatea nombre completo de persona
 */
export function formatFullName(persona: Partial<Persona>): string {
  const parts = [
    persona.nombre,
    persona.nombre2,
    persona.apellido1,
    persona.apellido2,
  ].filter(Boolean)

  return parts.join(' ')
}

/**
 * Formatea duración en minutos a formato legible
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours}h`
  }

  return `${hours}h ${remainingMinutes}min`
}

/**
 * Trunca texto largo con elipsis
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}
```

### 2. Crear `src/utils/validators.ts`

```typescript
/**
 * Utilidades de validación
 */

/**
 * Valida formato de email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida que un string no esté vacío
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * Valida UUID
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

/**
 * Valida que un número esté dentro de un rango
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * Valida fecha ISO
 */
export function isValidISODate(dateString: string): boolean {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}
```

### 3. Crear `src/utils/index.ts`

```typescript
/**
 * Utils - Exportaciones públicas
 */

export * from './formatters'
export * from './validators'
```

---

## ✅ CRITERIOS DE ACEPTACIÓN

- [ ] Formatters funcionan correctamente
- [ ] Validators funcionan correctamente
- [ ] Exportaciones centralizadas
- [ ] Tests unitarios (opcional pero recomendado)

---

## 🧪 VALIDACIÓN

```typescript
import { formatDate, formatFullName, isValidEmail } from '@/src/utils'

console.log(formatDate('2025-12-11'))
console.log(isValidEmail('test@example.com'))
```

---

## 🚀 SIGUIENTE FASE

**Fase 06: Migración de Componentes** (`06-migracion-componentes.md`)

---

**Estado:** Pendiente de Ejecución
