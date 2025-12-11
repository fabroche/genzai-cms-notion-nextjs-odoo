# Fase 01: Preparación y Análisis

> **Objetivo:** Crear la estructura base de carpetas y archivos necesarios para la refactorización
> **Complejidad:** Baja
> **Tiempo Estimado:** 30 minutos
> **Prerequisitos:** Ninguno

---

## 📋 DESCRIPCIÓN

En esta fase crearemos la estructura base de carpetas que seguirá el template definido. Esta es una fase **no destructiva** que solo crea nuevas carpetas y archivos base, sin modificar código existente.

---

## 🎯 OBJETIVOS ESPECÍFICOS

1. Crear la carpeta `src/` como raíz del código fuente
2. Crear estructura de servicios para Notion y Odoo
3. Crear carpeta `Specs/` para documentación
4. Crear archivos base de configuración
5. Preparar archivos `.gitkeep` para mantener carpetas vacías en git

---

## 📁 ESTRUCTURA A CREAR

```
genzai-cms-nextjs-notion-odoo/
├── src/
│   ├── services/
│   │   ├── notion/
│   │   │   └── .gitkeep
│   │   ├── odoo/
│   │   │   └── .gitkeep
│   │   └── n8n/
│   │       └── .gitkeep
│   │
│   ├── config/
│   │   └── .gitkeep
│   │
│   └── utils/
│       └── .gitkeep
│
├── Specs/
│   ├── architecture/
│   │   └── .gitkeep
│   ├── types/
│   │   └── .gitkeep
│   ├── api-integration/
│   │   └── .gitkeep
│   ├── guides/
│   │   └── .gitkeep
│   └── Onboarding/
│       └── .gitkeep
│
└── planes-implementacion/
    └── [ya existe]
```

---

## 🔧 ACCIONES A REALIZAR

### 1. Crear Carpeta `src/` y Subcarpetas

```bash
# Carpeta raíz de código fuente
mkdir -p src

# Servicios
mkdir -p src/services/notion
mkdir -p src/services/odoo
mkdir -p src/services/n8n

# Configuración
mkdir -p src/config

# Utilidades
mkdir -p src/utils
```

### 2. Crear Carpeta `Specs/` y Subcarpetas

```bash
# Carpeta raíz de documentación
mkdir -p Specs

# Subcarpetas de documentación
mkdir -p Specs/architecture
mkdir -p Specs/types
mkdir -p Specs/api-integration
mkdir -p Specs/guides
mkdir -p Specs/Onboarding
mkdir -p Specs/implementation-plans
mkdir -p Specs/technical-analysis
```

### 3. Crear Archivos `.gitkeep`

Crear archivos `.gitkeep` en cada carpeta vacía para que Git las trackee:

```bash
# src/
touch src/services/notion/.gitkeep
touch src/services/odoo/.gitkeep
touch src/services/n8n/.gitkeep
touch src/config/.gitkeep
touch src/utils/.gitkeep

# Specs/
touch Specs/architecture/.gitkeep
touch Specs/types/.gitkeep
touch Specs/api-integration/.gitkeep
touch Specs/guides/.gitkeep
touch Specs/Onboarding/.gitkeep
touch Specs/implementation-plans/.gitkeep
touch Specs/technical-analysis/.gitkeep
```

### 4. Crear Archivo `src/config/env.ts` (Placeholder)

Este archivo será completado en fases posteriores, pero lo creamos ahora como estructura:

```typescript
/**
 * Configuración de variables de entorno
 * Este archivo centraliza todas las variables de entorno del proyecto
 */

export const env = {
  // Notion Configuration
  NOTION_API_KEY: process.env.NOTION_SECRET ?? '',
  NOTION_PERSONAS_DATASOURCE_ID: process.env.NOTION_PERSONAS_DATASOURCE_ID ?? '',
  NOTION_FORMULARIOS_DATASOURCE_ID: process.env.NOTION_FORMULARIOS_DATASOURCE_ID ?? '',

  // Odoo Configuration
  ODOO_URL: process.env.ODOO_URL ?? '',
  ODOO_DB: process.env.ODOO_DB ?? '',
  ODOO_USERNAME: process.env.ODOO_USERNAME ?? '',
  ODOO_API_KEY: process.env.ODOO_API_KEY ?? '',

  // N8N Configuration
  N8N_WEBHOOK_ODOO_SURVEYS: process.env.N8N_WEBHOOK_ODOO_SURVEYS ?? '',
  N8N_WEBHOOK_ODOO_SURVEYS_QUESTIONS: process.env.N8N_WEBHOOK_ODOO_SURVEYS_QUESTIONS ?? '',

  // Cache Configuration
  CACHE_MAX_AGE: parseInt(process.env.CACHE_MAX_AGE ?? '60', 10),
}

/**
 * Validación de variables de entorno (opcional pero recomendado)
 * Descomentar en producción para asegurar que todas las variables están definidas
 */
export const validateEnv = () => {
  const required = [
    'NOTION_SECRET',
    'NOTION_PERSONAS_DATASOURCE_ID',
    // Agregar más según necesidad
  ]

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

// Ejecutar validación en producción
// if (process.env.NODE_ENV === 'production') {
//   validateEnv()
// }
```

### 5. Crear Archivo Base `types.d.ts` en la Raíz

```typescript
/**
 * Tipos globales del proyecto
 * Estos son tipos transformados y optimizados para uso en el frontend
 */

// ============================================
// FRONTEND APPLICATION TYPES
// ============================================

/**
 * Tipo principal de Persona (simplificado para frontend)
 */
type Persona = {
  id: string
  nombre: string
  nombre2?: string
  apellido1?: string
  apellido2?: string
  email?: string
  contacto?: string
  avatar?: string[]
  birthdate?: string
  startingDate?: string
  proyectoIds?: string[]
  tareasIds?: string[]
  rolesIds?: string[]
  createdTime: string
  lastEditedTime: string
  url: string
}

/**
 * Tipo principal de Survey (simplificado para frontend)
 */
type Survey = {
  id: number
  title: string
  displayName: string
  description: string
  active: boolean
  questionIds: number[]
  answerDurationAvg: number
  isTimeLimited: boolean
  timeLimit: number
  sessionLink: string
  createDate: string
  surveyType: 'survey' | 'quiz' | 'certification'
}

/**
 * Props de Error Pages
 */
interface ErrorPageProps {
  error: Error
  reset: () => void
}

/**
 * Props de páginas con params dinámicos
 */
interface PageProps<T = Record<string, string>> {
  params: T
  searchParams?: Record<string, string | string[] | undefined>
}

/**
 * Opciones de paginación
 */
interface PaginationOptions {
  pageSize?: number
  startCursor?: string
}

/**
 * Respuesta paginada genérica
 */
interface PaginatedResponse<T> {
  items: T[]
  hasMore: boolean
  nextCursor?: string
}
```

---

## ✅ CRITERIOS DE ACEPTACIÓN

Al finalizar esta fase, debes tener:

- [ ] Carpeta `src/` creada con subcarpetas services, config, utils
- [ ] Carpetas `src/services/notion/`, `src/services/odoo/`, `src/services/n8n/` creadas
- [ ] Carpeta `Specs/` creada con todas sus subcarpetas
- [ ] Archivos `.gitkeep` en todas las carpetas vacías
- [ ] Archivo `src/config/env.ts` creado con configuración base
- [ ] Archivo `types.d.ts` creado en la raíz con tipos globales base
- [ ] Todas las carpetas son visibles en Git

---

## 🧪 VALIDACIÓN

Ejecutar estos comandos para validar:

```bash
# Verificar que las carpetas se crearon
ls -la src/
ls -la src/services/
ls -la Specs/

# Verificar que git reconoce las carpetas
git status

# Verificar estructura completa
tree src/ -L 2
tree Specs/ -L 2
```

---

## 📝 NOTAS IMPORTANTES

1. **No eliminar carpetas existentes**: Esta fase solo crea, no modifica ni elimina
2. **Git tracking**: Los archivos `.gitkeep` aseguran que Git trackee carpetas vacías
3. **Archivos base**: `env.ts` y `types.d.ts` son placeholders que se completarán en fases posteriores
4. **tsconfig.json**: En la Fase 06 actualizaremos el path alias para apuntar a `src/`

---

## 🚀 SIGUIENTE FASE

Una vez completada y validada esta fase, proceder con:
**Fase 02: Reorganización de Tipos** (`02-reorganizacion-tipos.md`)

---

## 🔄 ROLLBACK

Si necesitas revertir esta fase:

```bash
# Eliminar carpetas creadas
rm -rf src/
rm -rf Specs/
rm types.d.ts

# Revertir cambios en git
git checkout .
```

---

**Fecha de Creación:** 2025-12-11
**Estado:** Pendiente de Ejecución
