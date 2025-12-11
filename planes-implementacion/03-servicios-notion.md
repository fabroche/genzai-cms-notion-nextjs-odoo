# Fase 03: Servicios de Notion

> **Objetivo:** Reestructurar la integración con Notion siguiendo el patrón de servicios modular
> **Complejidad:** Alta
> **Tiempo Estimado:** 2-3 horas
> **Prerequisitos:** Fases 01 y 02 completadas

---

## 📋 DESCRIPCIÓN

Reorganizar los servicios de Notion en módulos especializados:
- `client.ts`: Cliente singleton de Notion SDK
- `database.ts`: Queries a databases
- `pages.ts`: Operaciones CRUD con páginas
- `blocks.ts`: Obtención de contenido (bloques)
- `transformers.ts`: Transformación de tipos RAW → Frontend
- `index.ts`: Exportaciones públicas

---

## 📁 ARCHIVOS A CREAR/MODIFICAR

```
src/services/notion/
├── client.ts              # Cliente Notion SDK (NUEVO)
├── database.ts            # Queries a databases (NUEVO)
├── pages.ts               # Operaciones con páginas (NUEVO)
├── blocks.ts              # Obtener bloques/contenido (NUEVO)
├── transformers.ts        # Transformación de datos (NUEVO)
├── types.ts               # Ya creado en Fase 02
└── index.ts               # Exportaciones públicas (NUEVO)
```

---

## 🔧 ACCIONES A REALIZAR

### 1. Crear `src/services/notion/client.ts`

```typescript
import "server-only"
import { Client } from "@notionhq/client"
import { env } from '@/src/config/env'

/**
 * Cliente singleton de Notion
 * Usar este cliente en todos los servicios de Notion
 */
export const notionClient = new Client({
  auth: env.NOTION_API_KEY,
})

/**
 * IDs de Databases principales
 */
export const DATABASES = {
  PERSONAS: env.NOTION_PERSONAS_DATASOURCE_ID,
  FORMULARIOS: env.NOTION_FORMULARIOS_DATASOURCE_ID,
} as const
```

### 2. Crear `src/services/notion/database.ts`

```typescript
import "server-only"
import { notionClient, DATABASES } from './client'
import type {
  NotionDataSourceQueryParams,
  NotionDatabaseQueryResponse,
  NotionPersonaPage,
} from './types'

/**
 * Query de database con filtros
 */
export async function queryDatabase<T = NotionPersonaPage>(
  databaseId: string,
  params?: Partial<NotionDataSourceQueryParams>
): Promise<NotionDatabaseQueryResponse<T>> {
  const response = await notionClient.dataSources.query({
    data_source_id: databaseId,
    ...params,
  })

  return response as unknown as NotionDatabaseQueryResponse<T>
}

/**
 * Obtener todas las páginas de una database
 */
export async function getDatabasePages<T = NotionPersonaPage>(
  databaseId: string
): Promise<T[]> {
  const response = await queryDatabase<T>(databaseId)
  return response.results
}

/**
 * Query con paginación automática
 */
export async function queryDatabaseWithPagination<T = NotionPersonaPage>(
  databaseId: string,
  params?: Partial<NotionDataSourceQueryParams>
): Promise<T[]> {
  const allResults: T[] = []
  let hasMore = true
  let startCursor: string | undefined = undefined

  while (hasMore) {
    const response = await queryDatabase<T>(databaseId, {
      ...params,
      start_cursor: startCursor,
    })

    allResults.push(...response.results)
    hasMore = response.has_more
    startCursor = response.next_cursor || undefined
  }

  return allResults
}
```

### 3. Crear `src/services/notion/pages.ts`

```typescript
import "server-only"
import { cache } from "react"
import { notionClient } from './client'
import type { NotionPage, NotionPersonaPage } from './types'

/**
 * Obtener una página por ID (cacheado)
 */
export const getPageById = cache(async <T = NotionPage>(
  pageId: string
): Promise<T | null> => {
  try {
    const page = await notionClient.pages.retrieve({ page_id: pageId })
    return page as unknown as T
  } catch (error) {
    console.error(`Error fetching page ${pageId}:`, error)
    return null
  }
})

/**
 * Obtener múltiples páginas por IDs
 */
export async function getPagesByIds<T = NotionPage>(
  pageIds: string[]
): Promise<T[]> {
  if (pageIds.length === 0) return []

  const pages = await Promise.all(
    pageIds.map(async (id) => {
      try {
        const page = await notionClient.pages.retrieve({ page_id: id })
        return page as unknown as T
      } catch (error) {
        console.error(`Error fetching page ${id}:`, error)
        return null
      }
    })
  )

  return pages.filter((page): page is T => page !== null)
}

/**
 * Crear una página nueva
 */
export async function createPage<T = NotionPage>(
  databaseId: string,
  properties: Record<string, any>
): Promise<T> {
  const page = await notionClient.pages.create({
    parent: { data_source_id: databaseId },
    properties,
  })

  return page as unknown as T
}

/**
 * Actualizar una página existente
 */
export async function updatePage<T = NotionPage>(
  pageId: string,
  properties: Record<string, any>
): Promise<T> {
  const page = await notionClient.pages.update({
    page_id: pageId,
    properties,
  })

  return page as unknown as T
}

/**
 * Archivar una página (soft delete)
 */
export async function archivePage(pageId: string): Promise<void> {
  await notionClient.pages.update({
    page_id: pageId,
    archived: true,
  })
}

/**
 * Restaurar una página archivada
 */
export async function restorePage<T = NotionPage>(pageId: string): Promise<T> {
  const page = await notionClient.pages.update({
    page_id: pageId,
    archived: false,
  })

  return page as unknown as T
}
```

### 4. Crear `src/services/notion/blocks.ts`

```typescript
import "server-only"
import { cache } from "react"
import { notionClient } from './client'
import type { NotionBlock } from './types'

/**
 * Obtener bloques (contenido) de una página
 */
export const getPageBlocks = cache(async (
  pageId: string
): Promise<NotionBlock[]> => {
  try {
    const response = await notionClient.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    })

    return response.results as unknown as NotionBlock[]
  } catch (error) {
    console.error(`Error fetching blocks for page ${pageId}:`, error)
    return []
  }
})

/**
 * Obtener todos los bloques con paginación automática
 */
export async function getAllPageBlocks(pageId: string): Promise<NotionBlock[]> {
  const allBlocks: NotionBlock[] = []
  let cursor: string | undefined = undefined

  try {
    do {
      const response = await notionClient.blocks.children.list({
        block_id: pageId,
        page_size: 100,
        start_cursor: cursor,
      })

      allBlocks.push(...(response.results as unknown as NotionBlock[]))
      cursor = response.has_more ? response.next_cursor ?? undefined : undefined
    } while (cursor)

    return allBlocks
  } catch (error) {
    console.error('Error fetching all blocks:', error)
    return []
  }
}
```

### 5. Crear `src/services/notion/transformers.ts`

```typescript
/**
 * Transformadores de Notion RAW Types → Frontend Types
 */
import type {
  NotionRichText,
  NotionPropertyFiles,
  NotionPropertyRelation,
  NotionPersonaPage,
  NotionCover,
} from './types'

/**
 * Helper: Extrae texto plano de RichText
 */
export function extractPlainText(richTextArray: NotionRichText[]): string {
  if (!richTextArray || richTextArray.length === 0) return ''
  return richTextArray.map(rt => rt.plain_text).join('')
}

/**
 * Helper: Extrae IDs de relaciones
 */
export function extractRelationIds(relation: { id: string }[]): string[] {
  if (!relation || relation.length === 0) return []
  return relation.map(r => r.id)
}

/**
 * Helper: Extrae URLs de archivos
 */
export function extractFileUrls(files: any[]): string[] {
  if (!files || files.length === 0) return []
  return files
    .map(f => f.url || f.file?.url || f.external?.url)
    .filter((url): url is string => Boolean(url))
}

/**
 * Helper: Extrae URL de cover image
 */
export function extractCoverUrl(cover: NotionCover | null): string | null {
  if (!cover) return null

  if (cover.type === 'external') {
    return cover.external?.url ?? null
  }

  if (cover.type === 'file') {
    return cover.file?.url ?? null
  }

  return null
}

/**
 * Transforma NotionPersonaPage → Persona (frontend type)
 */
export function transformNotionPageToPersona(page: NotionPersonaPage): Persona {
  const props = page.properties

  return {
    id: page.id,
    nombre: extractPlainText(props.nombre.title),
    nombre2: extractPlainText(props.nombre_2.rich_text) || undefined,
    apellido1: extractPlainText(props.apellido_1.rich_text) || undefined,
    apellido2: extractPlainText(props.apellido_2.rich_text) || undefined,
    email: props.email.email || undefined,
    contacto: props.contacto.phone_number || undefined,
    avatar: extractFileUrls(props.avatar.files),
    birthdate: props.Birthdate.date?.start || undefined,
    startingDate: props.starting_date.date?.start || undefined,
    proyectoIds: extractRelationIds(props.Proyecto.relation),
    tareasIds: extractRelationIds(props.Tareas.relation),
    rolesIds: extractRelationIds(props.Roles.relation),
    createdTime: page.created_time,
    lastEditedTime: page.last_edited_time,
    url: page.url,
  }
}

/**
 * Transforma PersonaCreateInput → Notion Properties
 */
export function personaCreateInputToNotionProperties(
  input: PersonaCreateInput
): Record<string, any> {
  const properties: Record<string, any> = {
    nombre: {
      title: [{ text: { content: input.nombre } }],
    },
  }

  if (input.nombre2) {
    properties.nombre_2 = {
      rich_text: [{ text: { content: input.nombre2 } }],
    }
  }

  if (input.apellido1) {
    properties.apellido_1 = {
      rich_text: [{ text: { content: input.apellido1 } }],
    }
  }

  if (input.apellido2) {
    properties.apellido_2 = {
      rich_text: [{ text: { content: input.apellido2 } }],
    }
  }

  if (input.email) {
    properties.email = { email: input.email }
  }

  if (input.contacto) {
    properties.contacto = { phone_number: input.contacto }
  }

  if (input.birthdate) {
    properties.Birthdate = {
      date: { start: input.birthdate },
    }
  }

  if (input.startingDate) {
    properties.starting_date = {
      date: { start: input.startingDate },
    }
  }

  if (input.proyectoIds && input.proyectoIds.length > 0) {
    properties.Proyecto = {
      relation: input.proyectoIds.map((id) => ({ id })),
    }
  }

  if (input.tareasIds && input.tareasIds.length > 0) {
    properties.Tareas = {
      relation: input.tareasIds.map((id) => ({ id })),
    }
  }

  if (input.rolesIds && input.rolesIds.length > 0) {
    properties.Roles = {
      relation: input.rolesIds.map((id) => ({ id })),
    }
  }

  return properties
}
```

### 6. Crear `src/services/notion/index.ts`

```typescript
/**
 * Notion Service - Exportaciones públicas
 */

// Cliente
export { notionClient, DATABASES } from './client'

// Database operations
export {
  queryDatabase,
  getDatabasePages,
  queryDatabaseWithPagination,
} from './database'

// Page operations
export {
  getPageById,
  getPagesByIds,
  createPage,
  updatePage,
  archivePage,
  restorePage,
} from './pages'

// Block operations
export {
  getPageBlocks,
  getAllPageBlocks,
} from './blocks'

// Transformers
export {
  extractPlainText,
  extractRelationIds,
  extractFileUrls,
  extractCoverUrl,
  transformNotionPageToPersona,
  personaCreateInputToNotionProperties,
} from './transformers'

// Types (solo exportar si es necesario en código externo)
export type {
  NotionPage,
  NotionPersonaPage,
  NotionProperty,
  NotionBlock,
} from './types'
```

---

## ✅ CRITERIOS DE ACEPTACIÓN

- [ ] Todos los archivos en `src/services/notion/` creados
- [ ] Cliente de Notion funciona correctamente
- [ ] Funciones de database funcionan con paginación
- [ ] Funciones de pages incluyen CRUD completo
- [ ] Transformadores convierten correctamente RAW → Frontend
- [ ] Exportaciones públicas en `index.ts` funcionan
- [ ] No hay errores de TypeScript

---

## 🧪 VALIDACIÓN

```typescript
// Test básico en una página
import { getDatabasePages, transformNotionPageToPersona } from '@/src/services/notion'

const pages = await getDatabasePages(DATABASES.PERSONAS)
const personas = pages.map(transformNotionPageToPersona)
console.log(personas[0])
```

---

## 📝 NOTAS

- No eliminar `app/libs/notion.ts` todavía (Fase 06)
- Los servicios antiguos seguirán funcionando temporalmente
- Usar `"server-only"` en todos los archivos de servicios

---

## 🚀 SIGUIENTE FASE

**Fase 04: Servicios de Odoo** (`04-servicios-odoo.md`)

---

**Estado:** Pendiente de Ejecución
