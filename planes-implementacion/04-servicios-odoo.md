# Fase 04: Servicios de Odoo

> **Objetivo:** Reestructurar la integración con Odoo siguiendo el mismo patrón modular que Notion
> **Complejidad:** Alta
> **Tiempo Estimado:** 2-3 horas
> **Prerequisitos:** Fases 01, 02 y 03 completadas

---

## 📋 DESCRIPCIÓN

Crear servicios modulares para Odoo:
- `client.ts`: Cliente JSON-RPC para Odoo
- `surveys.ts`: Operaciones con Surveys
- `questions.ts`: Operaciones con Survey Questions
- `transformers.ts`: Transformación Odoo RAW → Frontend
- `index.ts`: Exportaciones públicas

---

## 📁 ARCHIVOS A CREAR

```
src/services/odoo/
├── client.ts              # Cliente JSON-RPC (NUEVO)
├── surveys.ts             # Operaciones con Surveys (NUEVO)
├── questions.ts           # Operaciones con Questions (NUEVO)
├── transformers.ts        # Transformación de datos (NUEVO)
├── types.ts               # Ya creado en Fase 02
└── index.ts               # Exportaciones públicas (NUEVO)
```

---

## 🔧 ACCIONES A REALIZAR

### 1. Crear `src/services/odoo/client.ts`

```typescript
import "server-only"
import { env } from '@/src/config/env'
import type { OdooJsonRpcRequest, OdooJsonRpcResponse, OdooContext } from './types'

/**
 * Configuración de Odoo
 */
const ODOO_CONFIG = {
  url: env.ODOO_URL,
  db: env.ODOO_DB,
  username: env.ODOO_USERNAME,
  apiKey: env.ODOO_API_KEY,
} as const

/**
 * Cache del UID de autenticación
 */
let cachedUid: number | null = null

/**
 * Autentica con Odoo y retorna el UID
 */
async function odooAuthenticate(): Promise<number> {
  if (cachedUid) return cachedUid

  const requestBody: OdooJsonRpcRequest = {
    jsonrpc: '2.0',
    method: 'call',
    params: {
      service: 'common',
      method: 'authenticate',
      args: [ODOO_CONFIG.db, ODOO_CONFIG.username, ODOO_CONFIG.apiKey, {}]
    },
    id: Math.floor(Math.random() * 1000000)
  }

  const response = await fetch(`${ODOO_CONFIG.url}/jsonrpc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  })

  if (!response.ok) {
    throw new Error(`Odoo HTTP Error ${response.status}: ${response.statusText}`)
  }

  const data: OdooJsonRpcResponse<number> = await response.json()

  if (data.error) {
    throw new Error(`Odoo Auth Error: ${data.error.message}`)
  }

  if (data.result === undefined) {
    throw new Error('No se recibió UID de Odoo')
  }

  cachedUid = data.result
  return cachedUid
}

/**
 * Ejecuta un método en Odoo usando JSON-RPC
 */
export async function executeKw<T = unknown>(
  model: string,
  method: string,
  args: unknown[] = [],
  kwargs: Record<string, unknown> = {}
): Promise<T> {
  const uid = await odooAuthenticate()

  const requestBody: OdooJsonRpcRequest = {
    jsonrpc: '2.0',
    method: 'call',
    params: {
      service: 'object',
      method: 'execute_kw',
      args: [
        ODOO_CONFIG.db,
        uid,
        ODOO_CONFIG.apiKey,
        model,
        method,
        args,
        kwargs
      ]
    },
    id: Math.floor(Math.random() * 1000000)
  }

  const response = await fetch(`${ODOO_CONFIG.url}/jsonrpc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  })

  if (!response.ok) {
    throw new Error(`Odoo HTTP Error ${response.status}: ${response.statusText}`)
  }

  const data: OdooJsonRpcResponse<T> = await response.json()

  if (data.error) {
    const errorMsg = data.error.data?.message || data.error.message
    if (process.env.NODE_ENV === 'development' && data.error.data?.debug) {
      console.error('Odoo Debug:', data.error.data.debug)
    }
    throw new Error(`Odoo Error: ${errorMsg}`)
  }

  if (data.result === undefined) {
    throw new Error('No se recibió resultado de Odoo')
  }

  return data.result
}

/**
 * Search
 */
export async function odooSearch(
  model: string,
  domain: any[] = [],
  limit?: number,
  offset?: number,
  order?: string,
  context?: OdooContext
): Promise<number[]> {
  const kwargs: Record<string, unknown> = {}

  if (limit !== undefined) kwargs.limit = limit
  if (offset !== undefined) kwargs.offset = offset
  if (order) kwargs.order = order
  if (context) kwargs.context = context

  return executeKw<number[]>(model, 'search', [domain], kwargs)
}

/**
 * Read
 */
export async function odooRead<T = unknown>(
  model: string,
  ids: number[],
  fields?: string[],
  context?: OdooContext
): Promise<T[]> {
  const kwargs: Record<string, unknown> = {}

  if (fields) kwargs.fields = fields
  if (context) kwargs.context = context

  return executeKw<T[]>(model, 'read', [ids], kwargs)
}

/**
 * Search Read
 */
export async function odooSearchRead<T = unknown>(
  model: string,
  params: {
    domain?: any[]
    fields?: string[]
    limit?: number
    offset?: number
    order?: string
    context?: OdooContext
  } = {}
): Promise<T[]> {
  const { domain = [], fields = [], limit, offset, order, context } = params

  const kwargs: Record<string, unknown> = {
    fields,
    domain
  }

  if (limit !== undefined) kwargs.limit = limit
  if (offset !== undefined) kwargs.offset = offset
  if (order) kwargs.order = order
  if (context) kwargs.context = context

  return executeKw<T[]>(model, 'search_read', [], kwargs)
}

/**
 * Create
 */
export async function odooCreate(
  model: string,
  values: Record<string, unknown>,
  context?: OdooContext
): Promise<number> {
  const kwargs: Record<string, unknown> = {}
  if (context) kwargs.context = context

  return executeKw<number>(model, 'create', [values], kwargs)
}

/**
 * Write (Update)
 */
export async function odooWrite(
  model: string,
  ids: number[],
  values: Record<string, unknown>,
  context?: OdooContext
): Promise<boolean> {
  const kwargs: Record<string, unknown> = {}
  if (context) kwargs.context = context

  return executeKw<boolean>(model, 'write', [ids, values], kwargs)
}

/**
 * Unlink (Delete)
 */
export async function odooUnlink(
  model: string,
  ids: number[],
  context?: OdooContext
): Promise<boolean> {
  const kwargs: Record<string, unknown> = {}
  if (context) kwargs.context = context

  return executeKw<boolean>(model, 'unlink', [ids], kwargs)
}

/**
 * Search Count
 */
export async function odooSearchCount(
  model: string,
  domain: any[] = [],
  context?: OdooContext
): Promise<number> {
  const kwargs: Record<string, unknown> = {}
  if (context) kwargs.context = context

  return executeKw<number>(model, 'search_count', [domain], kwargs)
}

/**
 * Get By ID
 */
export async function odooGetById<T = unknown>(
  model: string,
  id: number,
  fields?: string[],
  context?: OdooContext
): Promise<T | null> {
  try {
    const records = await odooRead<T>(model, [id], fields, context)
    return records.length > 0 ? records[0] : null
  } catch (error) {
    if (error instanceof Error && error.message.includes('does not exist')) {
      return null
    }
    throw error
  }
}
```

### 2. Crear `src/services/odoo/surveys.ts`

```typescript
import "server-only"
import { cache } from "react"
import { odooSearchRead, odooGetById, odooCreate, odooWrite, odooUnlink } from './client'
import type { OdooSurvey } from './types'

const SURVEY_MODEL = 'survey.survey'

/**
 * Obtener todos los surveys
 */
export const getAllSurveys = cache(async (): Promise<OdooSurvey[]> => {
  return odooSearchRead<OdooSurvey>(SURVEY_MODEL, {
    domain: [],
    fields: [
      'id',
      'title',
      'display_name',
      'description',
      'active',
      'question_and_page_ids',
      'answer_duration_avg',
      'is_time_limited',
      'time_limit',
      'session_link',
      'create_date',
      'create_uid',
      'survey_type',
    ],
  })
})

/**
 * Obtener survey por ID
 */
export const getSurveyById = cache(async (id: number): Promise<OdooSurvey | null> => {
  return odooGetById<OdooSurvey>(SURVEY_MODEL, id)
})

/**
 * Crear survey
 */
export async function createSurvey(data: {
  title: string
  description?: string
  survey_type?: 'survey' | 'quiz' | 'certification'
}): Promise<number> {
  return odooCreate(SURVEY_MODEL, data)
}

/**
 * Actualizar survey
 */
export async function updateSurvey(
  id: number,
  data: Partial<OdooSurvey>
): Promise<boolean> {
  return odooWrite(SURVEY_MODEL, [id], data)
}

/**
 * Eliminar survey
 */
export async function deleteSurvey(id: number): Promise<boolean> {
  return odooUnlink(SURVEY_MODEL, [id])
}
```

### 3. Crear `src/services/odoo/transformers.ts`

```typescript
/**
 * Transformadores de Odoo RAW Types → Frontend Types
 */
import type { OdooSurvey, OdooSurveyQuestion } from './types'

/**
 * Helper: Limpiar HTML de Odoo
 */
export function stripHtml(text: string | false): string {
  if (!text) return ''

  let clean = text.replace(/<br\s*\/?>/gi, '\n')
  clean = clean.replace(/<\/div>/gi, '\n')
  clean = clean.replace(/<[^>]*>/g, '')
  clean = clean.replace(/&nbsp;/g, ' ')
  clean = clean.replace(/&amp;/g, '&')
  clean = clean.replace(/&lt;/g, '<')
  clean = clean.replace(/&gt;/g, '>')
  clean = clean.replace(/&quot;/g, '"')
  clean = clean.replace(/\n\s*\n\s*\n/g, '\n\n')

  return clean.trim()
}

/**
 * Transforma OdooSurvey → Survey (frontend type)
 */
export function transformOdooSurveyToSurvey(odooSurvey: OdooSurvey): Survey {
  return {
    id: odooSurvey.id,
    title: stripHtml(odooSurvey.title),
    displayName: stripHtml(odooSurvey.display_name),
    description: stripHtml(odooSurvey.description),
    active: odooSurvey.active,
    questionIds: odooSurvey.question_and_page_ids,
    answerDurationAvg: odooSurvey.answer_duration_avg,
    isTimeLimited: odooSurvey.is_time_limited,
    timeLimit: odooSurvey.time_limit,
    sessionLink: odooSurvey.session_link,
    createDate: odooSurvey.create_date,
    surveyType: odooSurvey.survey_type,
  }
}

/**
 * Transforma SurveyCreateInput → Odoo format
 */
export function surveyCreateInputToOdooFormat(
  input: SurveyCreateInput
): Record<string, unknown> {
  return {
    title: input.title,
    description: input.description || '',
    survey_type: input.surveyType || 'survey',
    is_time_limited: input.isTimeLimited || false,
    time_limit: input.timeLimit || 0,
  }
}
```

### 4. Crear `src/services/odoo/index.ts`

```typescript
/**
 * Odoo Service - Exportaciones públicas
 */

// Client operations
export {
  executeKw,
  odooSearch,
  odooRead,
  odooSearchRead,
  odooCreate,
  odooWrite,
  odooUnlink,
  odooSearchCount,
  odooGetById,
} from './client'

// Survey operations
export {
  getAllSurveys,
  getSurveyById,
  createSurvey,
  updateSurvey,
  deleteSurvey,
} from './surveys'

// Transformers
export {
  stripHtml,
  transformOdooSurveyToSurvey,
  surveyCreateInputToOdooFormat,
} from './transformers'

// Types
export type {
  OdooSurvey,
  OdooSurveyQuestion,
  OdooContext,
} from './types'
```

---

## ✅ CRITERIOS DE ACEPTACIÓN

- [ ] Cliente JSON-RPC funcional
- [ ] Operaciones CRUD para surveys implementadas
- [ ] Transformadores convierten correctamente
- [ ] Caché de autenticación funciona
- [ ] Manejo de errores robusto
- [ ] No hay errores de TypeScript

---

## 🧪 VALIDACIÓN

```typescript
import { getAllSurveys, transformOdooSurveyToSurvey } from '@/src/services/odoo'

const surveys = await getAllSurveys()
const frontendSurveys = surveys.map(transformOdooSurveyToSurvey)
console.log(frontendSurveys[0])
```

---

## 🚀 SIGUIENTE FASE

**Fase 05: Transformadores** (`05-transformadores.md`)

---

**Estado:** Pendiente de Ejecución
