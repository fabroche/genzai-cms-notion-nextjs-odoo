# Fase 02: Reorganización de Tipos

> **Objetivo:** Separar tipos RAW de API vs tipos del Frontend y organizarlos según el template
> **Complejidad:** Media
> **Tiempo Estimado:** 1-2 horas
> **Prerequisitos:** Fase 01 completada

---

## 📋 DESCRIPCIÓN

En esta fase separaremos los tipos en dos categorías claras:
1. **Tipos RAW de API**: Estructuras exactas retornadas por Notion y Odoo APIs
2. **Tipos de Frontend**: Tipos simplificados y optimizados para uso en componentes

Esta separación mejora el type safety, la mantenibilidad y facilita futuras migraciones de API.

---

## 🎯 OBJETIVOS ESPECÍFICOS

1. Crear `src/services/notion/types.ts` con tipos RAW de Notion API
2. Crear `src/services/odoo/types.ts` con tipos RAW de Odoo API
3. Actualizar `types.d.ts` con tipos simplificados del frontend
4. Eliminar duplicaciones de tipos
5. Mantener compatibilidad con código existente (temporalmente)

---

## 📁 ARCHIVOS A CREAR

```
src/services/notion/types.ts       # Tipos RAW de Notion API
src/services/odoo/types.ts         # Tipos RAW de Odoo API
types.d.ts                          # Tipos Frontend (actualizar)
```

---

## 🔧 ACCIONES A REALIZAR

### 1. Crear `src/services/notion/types.ts`

Este archivo contendrá **SOLO** los tipos raw de la Notion API, sin modificaciones.

**Contenido:**

```typescript
/**
 * NOTION RAW API TYPES
 * Estos tipos reflejan la estructura EXACTA de la API de Notion
 * NO modificar para adaptarlos al frontend - usar transformers para eso
 *
 * Referencia: https://developers.notion.com/reference/intro
 */

// ============================================
// USER & COMMON TYPES
// ============================================

export interface NotionUser {
  object: 'user'
  id: string
  type?: 'person' | 'bot'
  name?: string
  avatar_url?: string
}

// ============================================
// RICH TEXT
// ============================================

export interface NotionRichText {
  type: 'text' | 'mention' | 'equation'
  text?: {
    content: string
    link?: {
      url: string
    } | null
  }
  mention?: {
    type: string
    [key: string]: any
  }
  equation?: {
    expression: string
  }
  annotations: {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
    color: string
  }
  plain_text: string
  href?: string | null
}

// ============================================
// FILES & MEDIA
// ============================================

export interface NotionFile {
  type: 'file' | 'external'
  name?: string
  file?: {
    url: string
    expiry_time: string
  }
  external?: {
    url: string
  }
}

export interface NotionEmoji {
  type: 'emoji'
  emoji: string
}

export type NotionIcon = NotionFile | NotionEmoji

export type NotionCover = NotionFile

// ============================================
// PARENT TYPES
// ============================================

export type NotionParent =
  | { type: 'data_source_id'; data_source_id: string; database_id: string }
  | { type: 'database_id'; database_id: string }
  | { type: 'page_id'; page_id: string }
  | { type: 'workspace'; workspace: true }

// ============================================
// PROPERTY VALUE TYPES
// ============================================

export interface NotionPropertyTitle {
  id: string
  type: 'title'
  title: NotionRichText[]
}

export interface NotionPropertyRichText {
  id: string
  type: 'rich_text'
  rich_text: NotionRichText[]
}

export interface NotionPropertyNumber {
  id: string
  type: 'number'
  number: number | null
}

export interface NotionPropertySelect {
  id: string
  type: 'select'
  select: {
    id: string
    name: string
    color: string
  } | null
}

export interface NotionPropertyMultiSelect {
  id: string
  type: 'multi_select'
  multi_select: Array<{
    id: string
    name: string
    color: string
  }>
}

export interface NotionPropertyDate {
  id: string
  type: 'date'
  date: {
    start: string
    end?: string | null
    time_zone?: string | null
  } | null
}

export interface NotionPropertyPeople {
  id: string
  type: 'people'
  people: NotionUser[]
}

export interface NotionPropertyFiles {
  id: string
  type: 'files'
  files: NotionFile[]
}

export interface NotionPropertyCheckbox {
  id: string
  type: 'checkbox'
  checkbox: boolean
}

export interface NotionPropertyUrl {
  id: string
  type: 'url'
  url: string | null
}

export interface NotionPropertyEmail {
  id: string
  type: 'email'
  email: string | null
}

export interface NotionPropertyPhoneNumber {
  id: string
  type: 'phone_number'
  phone_number: string | null
}

export interface NotionPropertyRelation {
  id: string
  type: 'relation'
  relation: Array<{
    id: string
  }>
  has_more: boolean
}

export interface NotionPropertyStatus {
  id: string
  type: 'status'
  status: {
    id: string
    name: string
    color: string
  } | null
}

/**
 * Union type de todas las propiedades
 */
export type NotionProperty =
  | NotionPropertyTitle
  | NotionPropertyRichText
  | NotionPropertyNumber
  | NotionPropertySelect
  | NotionPropertyMultiSelect
  | NotionPropertyDate
  | NotionPropertyPeople
  | NotionPropertyFiles
  | NotionPropertyCheckbox
  | NotionPropertyUrl
  | NotionPropertyEmail
  | NotionPropertyPhoneNumber
  | NotionPropertyRelation
  | NotionPropertyStatus

// ============================================
// NOTION PAGE OBJECT
// ============================================

export interface NotionPage<T = Record<string, NotionProperty>> {
  object: 'page'
  id: string
  created_time: string
  last_edited_time: string
  created_by: NotionUser
  last_edited_by: NotionUser
  cover: NotionCover | null
  icon: NotionIcon | null
  parent: NotionParent
  archived: boolean
  in_trash: boolean
  properties: T
  url: string
  public_url: string | null
}

// ============================================
// SPECIFIC DATABASE PROPERTIES
// ============================================

/**
 * Propiedades específicas de la database de Personas
 */
export interface NotionPersonaProperties {
  nombre: NotionPropertyTitle
  nombre_2: NotionPropertyRichText
  apellido_1: NotionPropertyRichText
  apellido_2: NotionPropertyRichText
  email: NotionPropertyEmail
  contacto: NotionPropertyPhoneNumber
  password: NotionPropertyRichText
  Birthdate: NotionPropertyDate
  starting_date: NotionPropertyDate
  avatar: NotionPropertyFiles
  Proyecto: NotionPropertyRelation
  Tareas: NotionPropertyRelation
  Roles: NotionPropertyRelation
}

/**
 * Tipo de página de Persona
 */
export type NotionPersonaPage = NotionPage<NotionPersonaProperties>

// ============================================
// QUERY & FILTER TYPES
// ============================================

export interface NotionFilter {
  property: string
  [key: string]: any // Los filtros varían según el tipo de propiedad
}

export interface NotionFilterGroup {
  and?: NotionFilter[]
  or?: NotionFilter[]
}

export interface NotionDatabaseQueryParams {
  database_id: string
  filter?: NotionFilter | NotionFilterGroup
  sorts?: Array<{
    property: string
    direction: 'ascending' | 'descending'
  }>
  page_size?: number
  start_cursor?: string
}

export interface NotionDataSourceQueryParams {
  data_source_id: string
  filter?: NotionFilter | NotionFilterGroup
  sorts?: Array<{
    property: string
    direction: 'ascending' | 'descending'
  }>
  page_size?: number
  start_cursor?: string
}

// ============================================
// RESPONSE TYPES
// ============================================

export interface NotionDatabaseQueryResponse<T = NotionPage> {
  object: 'list'
  results: T[]
  next_cursor: string | null
  has_more: boolean
  type: 'page'
  page: Record<string, unknown>
}

// ============================================
// BLOCK TYPES (para contenido)
// ============================================

export interface NotionBlockBase {
  object: 'block'
  id: string
  parent: {
    type: string
    [key: string]: any
  }
  created_time: string
  last_edited_time: string
  created_by: NotionUser
  last_edited_by: NotionUser
  has_children: boolean
  archived: boolean
  in_trash: boolean
}

export interface NotionBlockParagraph extends NotionBlockBase {
  type: 'paragraph'
  paragraph: {
    rich_text: NotionRichText[]
    color: string
  }
}

export interface NotionBlockHeading1 extends NotionBlockBase {
  type: 'heading_1'
  heading_1: {
    rich_text: NotionRichText[]
    color: string
    is_toggleable: boolean
  }
}

export interface NotionBlockHeading2 extends NotionBlockBase {
  type: 'heading_2'
  heading_2: {
    rich_text: NotionRichText[]
    color: string
    is_toggleable: boolean
  }
}

export interface NotionBlockHeading3 extends NotionBlockBase {
  type: 'heading_3'
  heading_3: {
    rich_text: NotionRichText[]
    color: string
    is_toggleable: boolean
  }
}

export type NotionBlock =
  | NotionBlockParagraph
  | NotionBlockHeading1
  | NotionBlockHeading2
  | NotionBlockHeading3
  // Agregar más tipos según necesidad
```

### 2. Crear `src/services/odoo/types.ts`

**Contenido:**

```typescript
/**
 * ODOO RAW API TYPES
 * Estos tipos reflejan la estructura EXACTA de la API de Odoo
 * NO modificar para adaptarlos al frontend - usar transformers para eso
 *
 * Referencia: https://www.odoo.com/documentation/19.0/developer/reference/external_api.html
 */

// ============================================
// JSON-RPC TYPES
// ============================================

export interface OdooJsonRpcRequest {
  jsonrpc: '2.0'
  method?: string
  params: Record<string, unknown>
  id?: number
}

export interface OdooJsonRpcResponse<T> {
  jsonrpc: '2.0'
  id?: number
  result?: T
  error?: {
    code: number
    message: string
    data?: {
      name?: string
      debug?: string
      message?: string
      arguments?: unknown[]
    }
  }
}

// ============================================
// AUTHENTICATION
// ============================================

export interface OdooAuthResult {
  uid: number
  is_admin: boolean
  user_context: OdooContext
  db: string
  server_version: string
  server_version_info: number[]
}

export interface OdooContext {
  lang?: string
  tz?: string
  uid?: number
  [key: string]: any
}

// ============================================
// SEARCH & READ PARAMS
// ============================================

export type OdooDomain = Array<
  | string
  | [string, string, any]
  | '&'
  | '|'
  | '!'
>

export interface OdooSearchReadParams {
  domain?: OdooDomain
  fields?: string[]
  limit?: number
  offset?: number
  order?: string
  context?: OdooContext
}

// ============================================
// SURVEY TYPES (model: survey.survey)
// ============================================

export type OdooSurveyType = 'survey' | 'quiz' | 'certification'

export interface OdooSurvey {
  id: number
  title: string
  display_name: string
  description: string | false
  active: boolean
  question_and_page_ids: number[]
  answer_duration_avg: number
  is_time_limited: boolean
  time_limit: number
  session_link: string
  create_date: string
  create_uid: [number, string] // Tupla: [id, nombre]
  write_date: string
  write_uid: [number, string]
  survey_type: OdooSurveyType
}

// ============================================
// SURVEY QUESTION TYPES (model: survey.question)
// ============================================

export type OdooQuestionType =
  | 'free_text'
  | 'textbox'
  | 'numerical_box'
  | 'date'
  | 'datetime'
  | 'simple_choice'
  | 'multiple_choice'
  | 'matrix'

export interface OdooSurveyQuestion {
  id: number
  title: string
  question_type: OdooQuestionType
  survey_id: [number, string]
  sequence: number
  is_page: boolean
  is_scored_question: boolean
  description: string | false
  constr_mandatory: boolean
  constr_error_msg: string | false
  suggested_answer_ids: number[]
  matrix_row_ids: number[]
  create_date: string
  write_date: string
}

// ============================================
// COMMON ODOO TYPES
// ============================================

/**
 * Tipo genérico para registros de Odoo
 */
export interface OdooRecord {
  id: number
  display_name?: string
  create_date?: string
  create_uid?: [number, string]
  write_date?: string
  write_uid?: [number, string]
  [key: string]: any
}

/**
 * Respuesta de search (solo IDs)
 */
export type OdooSearchResult = number[]

/**
 * Respuesta de search_count
 */
export type OdooSearchCountResult = number

/**
 * Respuesta de read
 */
export type OdooReadResult<T = OdooRecord> = T[]

/**
 * Respuesta de search_read
 */
export type OdooSearchReadResult<T = OdooRecord> = T[]
```

### 3. Actualizar `types.d.ts` en la Raíz

Actualizar el archivo creado en Fase 01 con tipos completos del frontend:

```typescript
/**
 * TIPOS GLOBALES DEL FRONTEND
 * Estos son tipos SIMPLIFICADOS y optimizados para uso en componentes React
 *
 * IMPORTANTE: Estos tipos son el resultado de TRANSFORMAR los tipos RAW de las APIs
 * Ver transformers en:
 * - src/services/notion/transformers.ts
 * - src/services/odoo/transformers.ts
 */

// ============================================
// PERSONA (desde Notion)
// ============================================

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

type PersonaCreateInput = {
  nombre: string
  nombre2?: string
  apellido1?: string
  apellido2?: string
  email?: string
  contacto?: string
  birthdate?: string
  startingDate?: string
  proyectoIds?: string[]
  tareasIds?: string[]
  rolesIds?: string[]
}

type PersonaUpdateInput = {
  id: string
  nombre?: string
  nombre2?: string
  apellido1?: string
  apellido2?: string
  email?: string
  contacto?: string
  birthdate?: string
  startingDate?: string
  proyectoIds?: string[]
  tareasIds?: string[]
  rolesIds?: string[]
}

type PersonaFilters = {
  email?: string
  nombre?: string
  rolId?: string
  proyectoId?: string
}

// ============================================
// SURVEY (desde Odoo)
// ============================================

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

type SurveyQuestion = {
  id: number
  title: string
  questionType: string
  surveyId: number
  surveyName: string
  sequence: number
  isPage: boolean
  isScoredQuestion: boolean
  description: string
  isMandatory: boolean
  errorMessage: string
}

type SurveyCreateInput = {
  title: string
  description?: string
  surveyType?: 'survey' | 'quiz' | 'certification'
  isTimeLimited?: boolean
  timeLimit?: number
}

// ============================================
// PAGINATION
// ============================================

interface PaginationOptions {
  pageSize?: number
  startCursor?: string
}

interface PaginatedResponse<T> {
  items: T[]
  hasMore: boolean
  nextCursor?: string
}

type PaginatedPersonas = PaginatedResponse<Persona>
type PaginatedSurveys = PaginatedResponse<Survey>

// ============================================
// PAGE PROPS
// ============================================

interface ErrorPageProps {
  error: Error
  reset: () => void
}

interface PageProps<T = Record<string, string>> {
  params: T
  searchParams?: Record<string, string | string[] | undefined>
}

// ============================================
// COMMON TYPES
// ============================================

type DateString = string // ISO 8601 format
type UUID = string
```

---

## ✅ CRITERIOS DE ACEPTACIÓN

Al finalizar esta fase:

- [ ] Archivo `src/services/notion/types.ts` creado con tipos RAW completos
- [ ] Archivo `src/services/odoo/types.ts` creado con tipos RAW completos
- [ ] Archivo `types.d.ts` actualizado con tipos del frontend
- [ ] Los tipos están correctamente documentados con JSDoc
- [ ] No hay duplicación de tipos entre archivos
- [ ] TypeScript no muestra errores en los archivos de tipos

---

## 🧪 VALIDACIÓN

```bash
# Verificar que los archivos existen
ls -la src/services/notion/types.ts
ls -la src/services/odoo/types.ts
ls -la types.d.ts

# Verificar sintaxis de TypeScript
npx tsc --noEmit
```

---

## 📝 NOTAS IMPORTANTES

1. **Convención de nombres**:
   - Tipos RAW: Prefijo `Notion` u `Odoo` (ej: `NotionPage`, `OdooSurvey`)
   - Tipos Frontend: Sin prefijo (ej: `Persona`, `Survey`)

2. **No modificar código existente todavía**: Los tipos antiguos en `app/types/` se mantendrán hasta la Fase 06

3. **Documentación**: Cada tipo debe tener un comentario JSDoc explicando su propósito

---

## 🚀 SIGUIENTE FASE

**Fase 03: Servicios de Notion** (`03-servicios-notion.md`)

---

**Fecha de Creación:** 2025-12-11
**Estado:** Pendiente de Ejecución
