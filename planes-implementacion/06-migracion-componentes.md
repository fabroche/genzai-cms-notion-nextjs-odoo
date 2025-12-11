# Fase 06: Migración de Componentes y Actualización de Imports

> **Objetivo:** Migrar app/ a src/app/ y actualizar todos los imports del proyecto
> **Complejidad:** Alta
> **Tiempo Estimado:** 2-3 horas
> **Prerequisitos:** Fases 01-05 completadas

---

## 📋 DESCRIPCIÓN

Esta es la fase más crítica. Migraremos toda la carpeta `app/` a `src/app/` y actualizaremos todos los imports para usar los nuevos servicios.

---

## ⚠️ IMPORTANTE - ANTES DE EMPEZAR

1. **Hacer backup**: `git commit -am "Pre-migration checkpoint"`
2. **Verificar que no hay errores**: `npm run build`
3. **Prepararse para muchos errores de TypeScript temporales**

---

## 📁 CAMBIOS DE ESTRUCTURA

```
ANTES:                          DESPUÉS:
app/                            src/app/
├── components/                 ├── components/
├── personas/                   ├── personas/
├── surveys/                    ├── surveys/
├── dashboard/                  ├── dashboard/
├── api/                        ├── api/
├── libs/       ❌              (ELIMINAR - reemplazado por src/services/)
├── services/   ❌              (ELIMINAR - migrado a src/services/)
├── types/      ❌              (ELIMINAR - migrado a src/services/*/types.ts)
└── utils/      ❌              (ELIMINAR - migrado a src/utils/)
```

---

## 🔧 ACCIONES A REALIZAR

### 1. Actualizar `tsconfig.json`

```json
{
  "compilerOptions": {
    // ... otras opciones
    "paths": {
      "@/*": ["./*"],
      "@/src/*": ["./src/*"],
      "@/app/*": ["./src/app/*"]
    }
  }
}
```

### 2. Mover `app/` a `src/app/`

```bash
# Opción 1: Mover directamente
mv app src/app

# Opción 2: Copiar primero (más seguro)
cp -r app src/app
# Validar y luego eliminar: rm -rf app
```

### 3. Actualizar Imports en Servicios

**Patrón de búsqueda y reemplazo:**

```
BUSCAR:     from '@/app/types/
REEMPLAZAR: from '@/src/services/
```

Archivos afectados (principales):
- `src/app/personas/[id]/page.tsx`
- `src/app/surveys/page.tsx`
- `src/app/surveys/[id]/page.tsx`
- Todos los componentes

### 4. Actualizar Imports de Servicios

**Patrón antiguo → nuevo:**

```typescript
// ❌ ANTES
import { fetchPersonas } from '@/app/libs/notion'
import { PersonasService } from '@/app/services/personas.service'

// ✅ DESPUÉS
import { getDatabasePages, transformNotionPageToPersona } from '@/src/services/notion'
```

### 5. Actualizar Componentes - Ejemplo Personas

**Antes (`app/personas/page.tsx`):**
```typescript
import { fetchPersonasWithRelations } from '@/app/libs/notion'
import type { PersonaWithRelations } from '@/app/types/notion'

export default async function PersonasPage() {
  const personas = await fetchPersonasWithRelations()
  // ...
}
```

**Después (`src/app/personas/page.tsx`):**
```typescript
import { getDatabasePages, transformNotionPageToPersona, DATABASES } from '@/src/services/notion'

export default async function PersonasPage() {
  const pages = await getDatabasePages(DATABASES.PERSONAS)
  const personas = pages.map(transformNotionPageToPersona)
  // ...
}
```

### 6. Actualizar Componentes - Ejemplo Surveys

**Antes (`app/surveys/page.tsx`):**
```typescript
import { SurveysService } from '@/app/services/encuestas.services'

export default async function SurveysPage() {
  const service = SurveysService.getInstance()
  const surveys = await service.getOdooSurveys()
  // ...
}
```

**Después (`src/app/surveys/page.tsx`):**
```typescript
import { getAllSurveys, transformOdooSurveyToSurvey } from '@/src/services/odoo'

export default async function SurveysPage() {
  const odooSurveys = await getAllSurveys()
  const surveys = odooSurveys.map(transformOdooSurveyToSurvey)
  // ...
}
```

### 7. Actualizar `next.config.ts`

```typescript
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 5,
    },
  },

  // NUEVO: Optimización de imágenes si usas Notion
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.us-west-2.amazonaws.com',
        pathname: '/secure.notion-static.com/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig
```

### 8. Actualizar Configuración de Env

Reemplazar todas las referencias a variables de entorno:

```typescript
// ❌ ANTES
const notionSecret = process.env.NOTION_SECRET ?? ""

// ✅ DESPUÉS
import { env } from '@/src/config/env'
const notionSecret = env.NOTION_API_KEY
```

---

## 🗂️ LISTA DE ARCHIVOS A ACTUALIZAR

### Páginas (Priority 1)
- [ ] `src/app/page.tsx`
- [ ] `src/app/layout.tsx`
- [ ] `src/app/personas/page.tsx`
- [ ] `src/app/personas/[id]/page.tsx`
- [ ] `src/app/surveys/page.tsx`
- [ ] `src/app/surveys/[id]/page.tsx`
- [ ] `src/app/dashboard/page.tsx`

### Componentes (Priority 2)
- [ ] `src/app/components/Personas/PersonaDetail.tsx`
- [ ] `src/app/components/Personas/PersonasListClient.tsx`
- [ ] `src/app/components/Personas/Card.tsx`
- [ ] `src/app/components/Personas/CardList.tsx`
- [ ] `src/app/surveys/componets/SurveyCard.tsx`
- [ ] `src/app/surveys/componets/SurveyList.tsx`
- [ ] `src/app/surveys/componets/SurveyDetails.tsx`

### API Routes (Priority 3)
- [ ] `src/app/api/**/*.ts` (si existen)

---

## ✅ CRITERIOS DE ACEPTACIÓN

- [ ] Toda la carpeta `app/` movida a `src/app/`
- [ ] Todos los imports actualizados
- [ ] No hay referencias a `@/app/libs/`
- [ ] No hay referencias a `@/app/services/` antiguos
- [ ] No hay referencias a `@/app/types/` antiguos
- [ ] `npm run build` compila sin errores
- [ ] Todas las páginas funcionan correctamente
- [ ] No hay errores de TypeScript

---

## 🧪 VALIDACIÓN

```bash
# Verificar estructura
ls -la src/app/

# Buscar imports antiguos que falta actualizar
grep -r "@/app/libs" src/
grep -r "@/app/types" src/
grep -r "@/app/services" src/

# Compilar sin errores
npm run build

# Ejecutar en dev
npm run dev
# Probar todas las rutas manualmente
```

---

## 🔄 ROLLBACK

Si algo sale mal:

```bash
# Restaurar desde Git
git checkout .
git clean -fd

# O restaurar backup
mv src/app.backup src/app
```

---

## 📝 NOTAS IMPORTANTES

1. **No eliminar carpetas antiguas hasta validar**: Mantener `app.backup/` temporalmente
2. **Actualizar de a poco**: Primero páginas, luego componentes
3. **Compilar frecuentemente**: `npm run build` después de cada grupo de cambios
4. **Testing manual**: Probar todas las rutas después de migrar

---

## 🚀 SIGUIENTE FASE

**Fase 07: Documentación** (`07-documentacion.md`)

---

**Estado:** Pendiente de Ejecución
