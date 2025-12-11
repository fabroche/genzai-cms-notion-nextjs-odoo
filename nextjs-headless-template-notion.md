# Next.js Headless CMS Project Template - Notion Edition

> Prompt para Claude 4.5 Sonnet para generar proyectos Next.js con Notion como backend headless
> Versión: 1.0.0
> Última actualización: 2025-12-11

---

## 📋 OBJETIVO DEL PROMPT

Crear un proyecto Next.js completo con arquitectura headless usando **Notion** como backend/CMS, siguiendo decisiones arquitectónicas probadas, convenciones de código establecidas y estructura de documentación comprehensiva.

---

## 🎯 INSTRUCCIONES PARA CLAUDE

Cuando recibas una solicitud para crear un nuevo proyecto Next.js con Notion, sigue estos pasos:

### PASO 1: Clarificar Requisitos

Primero pregunta al usuario:

1. **Nombre del proyecto** (ej: "notion-blog", "notion-portfolio")
2. **Tipo de proyecto** (ej: blog, portfolio, wiki, knowledge base, task manager)
3. **ID de la Database de Notion** (puede configurarse después en .env)
4. **Entidades principales** (ej: posts, projects, pages, tasks)
5. **Propiedades de Notion a utilizar** (ej: Title, Date, Tags, Status, Rich Text)
6. **Características específicas** (ej: búsqueda, filtros, sorting, tags)

### PASO 2: Generar Estructura Base

Crea la estructura de carpetas completa siguiendo este template adaptado para Notion:

```
project-name/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── error.tsx           # Global error boundary
│   │   ├── not-found.tsx       # Custom 404 page
│   │   ├── loading.tsx         # Global loading state
│   │   │
│   │   ├── (home)/             # Route group - Home
│   │   │   ├── layout.tsx      # Home-specific layout
│   │   │   ├── page.tsx        # Home page content
│   │   │   ├── loading.tsx     # Loading state
│   │   │   └── error.tsx       # Error boundary
│   │   │
│   │   ├── [entity]/           # Ruta dinámica (ej: /blog, /projects)
│   │   │   ├── layout.tsx      # Layout con navegación
│   │   │   └── page.tsx        # Listado
│   │   │
│   │   ├── [entity]/[id]/      # Detalle (ej: /blog/page-id)
│   │   │   └── page.tsx
│   │   │
│   │   └── api/                # API Routes
│   │       ├── route.ts        # Health check
│   │       ├── pages/
│   │       │   └── route.ts    # GET /api/pages
│   │       └── database/
│   │           └── route.ts    # GET /api/database
│   │
│   ├── components/
│   │   ├── shared/             # Componentes globales
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   └── Loader/
│   │   │
│   │   ├── [section]/          # Componentes por sección
│   │   │   └── [Component]/
│   │   │
│   │   └── [entity]/           # Componentes de entidad
│   │       ├── [Entity]Card/
│   │       ├── [Entity]List/
│   │       └── [Entity]Content/  # Para renderizar contenido de bloques
│   │
│   ├── services/notion/        # Integración con Notion
│   │   ├── index.ts           # Exportaciones públicas
│   │   ├── client.ts          # Cliente de Notion SDK
│   │   ├── database.ts        # Queries a databases
│   │   ├── pages.ts           # Operaciones con páginas
│   │   ├── blocks.ts          # Obtener bloques (contenido)
│   │   ├── transformers.ts    # Transformación de tipos
│   │   └── types.ts           # Tipos raw de Notion API
│   │
│   ├── config/
│   │   └── env.ts             # Variables de entorno
│   │
│   ├── utils/
│   │   ├── notion-helpers.ts  # Helpers para Notion (ej: extraer plain text)
│   │   ├── formatters.ts
│   │   └── validators.ts
│   │
│   ├── assets/
│   │   └── blurDataURLs/      # Placeholders para imágenes
│   │       └── index.ts
│   │
│   └── sass/
│       ├── globals.sass       # Estilos globales
│       ├── main.sass          # Punto de entrada (solo imports)
│       ├── _variables.sass    # Variables de diseño
│       ├── _mixins.sass       # Mixins (opcional)
│       └── [special].module.sass
│
├── public/
│   └── images/                # Imágenes estáticas
│
├── Specs/                     # Documentación técnica
│   ├── README.md
│   ├── architecture/
│   │   ├── project-structure.md
│   │   └── component-patterns.md
│   ├── types/
│   │   ├── notion-types.md        # NUEVO: Tipos de Notion
│   │   └── type-definitions.md
│   ├── api-integration/
│   │   └── notion-integration.md  # NUEVO: Integración Notion
│   ├── guides/
│   │   ├── styles-conventions.md
│   │   └── working-with-notion-content.md  # NUEVO
│   ├── implementation-plans/
│   ├── technical-analysis/
│   └── Onboarding/
│       ├── README.md
│       ├── 01-getting-started.md
│       ├── 02-project-overview.md
│       ├── 03-development-workflow.md
│       ├── 04-coding-standards.md
│       ├── 05-notion-integration.md      # NUEVO
│       └── 06-troubleshooting.md
│
├── types.d.ts                 # Tipos TypeScript globales
├── next.config.ts             # Configuración de Next.js
├── tsconfig.json              # Configuración TypeScript
├── package.json               # Dependencias
├── .env.example               # Template de variables
├── .env.local                 # Variables (no versionado)
├── .gitignore
├── README.md                  # README del proyecto
└── claude.md                  # Memoria técnica para Claude Code
```

---

## 🏗️ ARQUITECTURA Y DECISIONES TÉCNICAS

### 1. Stack Tecnológico Base

```json
{
  "framework": "Next.js 15+ (App Router)",
  "react": "19+",
  "typescript": "5.x",
  "estilos": "SASS + CSS Modules",
  "utilidades": "classnames",
  "cms": "Notion API",
  "notion-sdk": "@notionhq/client",
  "runtime": "Node.js"
}
```

### 2. Principios Arquitectónicos

#### A. Separación de Responsabilidades

```
app/              → Routing, layouts, orchestration
components/       → UI presentacional
services/notion/  → Lógica de negocio, integración con Notion API
config/           → Configuración
utils/            → Utilidades puras, helpers de Notion
```

#### B. Server-First Approach

**Regla:** Usar Server Components por defecto. Solo Client Components cuando se necesite:
- Hooks de React (useState, useEffect, etc.)
- Interactividad del lado del cliente
- APIs del navegador (localStorage, window, etc.)

```typescript
// ✅ Server Component (por defecto) - Ideal para fetching de Notion
export default async function BlogPage() {
  const posts = await getNotionPages()
  return <PostList posts={posts} />
}

// ✅ Client Component (solo cuando sea necesario)
"use client"
export function InteractiveSearch() {
  const [query, setQuery] = useState("")
  return <div>...</div>
}
```

#### C. Headless Architecture con Notion

```
┌─────────────────────────────────┐
│   Usuario (Browser)             │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│   Next.js Application           │
│   (Frontend)                    │
│   ┌─────────────────────────┐   │
│   │  App Router             │   │
│   │  Components             │   │
│   │  Services Layer         │   │
│   │  (Notion SDK)           │   │
│   └─────────────────────────┘   │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│   Notion API                    │
│   ┌─────────────────────────┐   │
│   │  Databases              │   │
│   │  Pages                  │   │
│   │  Blocks (Content)       │   │
│   └─────────────────────────┘   │
└─────────────────────────────────┘
```

**Beneficios:**
- Notion como CMS sin necesidad de UI personalizada
- Editores pueden trabajar directamente en Notion
- Flexibilidad total en el frontend
- Performance optimizada (SSR + SSG + ISR)
- Contenido rico y estructurado

---

## 📝 TIPOS DE DATOS DE NOTION

### Tipos Raw de Notion API

**Archivo:** `src/services/notion/types.ts`

```typescript
// ============================================
// NOTION RAW API TYPES
// Estos tipos reflejan la estructura exacta de la API de Notion
// ============================================

/**
 * Objeto base de usuario de Notion
 */
export interface NotionUser {
  object: "user"
  id: string
  type?: "person" | "bot"
  name?: string
  avatar_url?: string
}

/**
 * Objeto Rich Text - Usado en títulos, textos, etc.
 */
export interface NotionRichText {
  type: "text" | "mention" | "equation"
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

/**
 * Objeto de archivo (para covers, iconos, archivos)
 */
export interface NotionFile {
  type: "file" | "external"
  file?: {
    url: string
    expiry_time: string
  }
  external?: {
    url: string
  }
}

/**
 * Objeto Emoji (para iconos)
 */
export interface NotionEmoji {
  type: "emoji"
  emoji: string
}

/**
 * Parent types - Define dónde vive una página
 */
export type NotionParent =
  | { type: "database_id"; database_id: string }
  | { type: "page_id"; page_id: string }
  | { type: "workspace"; workspace: true }

/**
 * PROPERTY VALUE TYPES
 * Estos son los 20+ tipos de propiedades que Notion soporta
 */

export interface NotionPropertyTitle {
  id: string
  type: "title"
  title: NotionRichText[]
}

export interface NotionPropertyRichText {
  id: string
  type: "rich_text"
  rich_text: NotionRichText[]
}

export interface NotionPropertyNumber {
  id: string
  type: "number"
  number: number | null
}

export interface NotionPropertySelect {
  id: string
  type: "select"
  select: {
    id: string
    name: string
    color: string
  } | null
}

export interface NotionPropertyMultiSelect {
  id: string
  type: "multi_select"
  multi_select: Array<{
    id: string
    name: string
    color: string
  }>
}

export interface NotionPropertyDate {
  id: string
  type: "date"
  date: {
    start: string
    end?: string | null
    time_zone?: string | null
  } | null
}

export interface NotionPropertyPeople {
  id: string
  type: "people"
  people: NotionUser[]
}

export interface NotionPropertyFiles {
  id: string
  type: "files"
  files: NotionFile[]
}

export interface NotionPropertyCheckbox {
  id: string
  type: "checkbox"
  checkbox: boolean
}

export interface NotionPropertyUrl {
  id: string
  type: "url"
  url: string | null
}

export interface NotionPropertyEmail {
  id: string
  type: "email"
  email: string | null
}

export interface NotionPropertyPhone {
  id: string
  type: "phone_number"
  phone_number: string | null
}

export interface NotionPropertyFormula {
  id: string
  type: "formula"
  formula: {
    type: "string" | "number" | "boolean" | "date"
    string?: string | null
    number?: number | null
    boolean?: boolean | null
    date?: {
      start: string
      end?: string | null
    } | null
  }
}

export interface NotionPropertyRelation {
  id: string
  type: "relation"
  relation: Array<{
    id: string
  }>
  has_more: boolean
}

export interface NotionPropertyRollup {
  id: string
  type: "rollup"
  rollup: {
    type: "number" | "date" | "array"
    number?: number | null
    date?: {
      start: string
      end?: string | null
    } | null
    array?: any[]
  }
}

export interface NotionPropertyCreatedTime {
  id: string
  type: "created_time"
  created_time: string
}

export interface NotionPropertyCreatedBy {
  id: string
  type: "created_by"
  created_by: NotionUser
}

export interface NotionPropertyLastEditedTime {
  id: string
  type: "last_edited_time"
  last_edited_time: string
}

export interface NotionPropertyLastEditedBy {
  id: string
  type: "last_edited_by"
  last_edited_by: NotionUser
}

export interface NotionPropertyStatus {
  id: string
  type: "status"
  status: {
    id: string
    name: string
    color: string
  } | null
}

export interface NotionPropertyUniqueId {
  id: string
  type: "unique_id"
  unique_id: {
    prefix: string | null
    number: number
  }
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
  | NotionPropertyPhone
  | NotionPropertyFormula
  | NotionPropertyRelation
  | NotionPropertyRollup
  | NotionPropertyCreatedTime
  | NotionPropertyCreatedBy
  | NotionPropertyLastEditedTime
  | NotionPropertyLastEditedBy
  | NotionPropertyStatus
  | NotionPropertyUniqueId

/**
 * NOTION PAGE OBJECT
 * Representa una página completa de Notion
 */
export interface NotionPage {
  object: "page"
  id: string
  created_time: string
  last_edited_time: string
  created_by: NotionUser
  last_edited_by: NotionUser
  cover: NotionFile | null
  icon: NotionFile | NotionEmoji | null
  parent: NotionParent
  archived: boolean
  in_trash: boolean
  properties: Record<string, NotionProperty>
  url: string
  public_url: string | null
}

/**
 * NOTION DATABASE QUERY RESPONSE
 */
export interface NotionDatabaseQueryResponse {
  object: "list"
  results: NotionPage[]
  next_cursor: string | null
  has_more: boolean
  type: "page"
  page: {}
}

/**
 * NOTION BLOCK TYPES
 * Para renderizar contenido de páginas
 */

export interface NotionBlockBase {
  object: "block"
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
  type: "paragraph"
  paragraph: {
    rich_text: NotionRichText[]
    color: string
  }
}

export interface NotionBlockHeading1 extends NotionBlockBase {
  type: "heading_1"
  heading_1: {
    rich_text: NotionRichText[]
    color: string
    is_toggleable: boolean
  }
}

export interface NotionBlockHeading2 extends NotionBlockBase {
  type: "heading_2"
  heading_2: {
    rich_text: NotionRichText[]
    color: string
    is_toggleable: boolean
  }
}

export interface NotionBlockHeading3 extends NotionBlockBase {
  type: "heading_3"
  heading_3: {
    rich_text: NotionRichText[]
    color: string
    is_toggleable: boolean
  }
}

export interface NotionBlockBulletedList extends NotionBlockBase {
  type: "bulleted_list_item"
  bulleted_list_item: {
    rich_text: NotionRichText[]
    color: string
  }
}

export interface NotionBlockNumberedList extends NotionBlockBase {
  type: "numbered_list_item"
  numbered_list_item: {
    rich_text: NotionRichText[]
    color: string
  }
}

export interface NotionBlockCode extends NotionBlockBase {
  type: "code"
  code: {
    rich_text: NotionRichText[]
    caption: NotionRichText[]
    language: string
  }
}

export interface NotionBlockImage extends NotionBlockBase {
  type: "image"
  image: NotionFile & {
    caption: NotionRichText[]
  }
}

export type NotionBlock =
  | NotionBlockParagraph
  | NotionBlockHeading1
  | NotionBlockHeading2
  | NotionBlockHeading3
  | NotionBlockBulletedList
  | NotionBlockNumberedList
  | NotionBlockCode
  | NotionBlockImage
  // Agregar más tipos según necesidad
```

### Tipos Transformados para el Frontend

**Archivo:** `types.d.ts`

```typescript
// ============================================
// FRONTEND APPLICATION TYPES
// Tipos simplificados y optimizados para uso en componentes
// ============================================

/**
 * Tipo principal de entidad (ejemplo: Post de blog)
 * Este tipo usa SOLO las propiedades necesarias para el frontend
 */
type BlogPostType = {
  id: string
  title: string
  slug: string
  description: string
  publishedDate: string
  author: string
  tags: string[]
  coverImage: string | null
  status: "Published" | "Draft" | "Archived"
  readTime: number | null
}

/**
 * Tipo para el contenido renderizado de una página
 */
type PageContentType = {
  id: string
  blocks: ContentBlock[]
}

/**
 * Bloque de contenido simplificado
 */
type ContentBlock = {
  id: string
  type: "paragraph" | "heading1" | "heading2" | "heading3" | "list" | "code" | "image"
  content: string
  metadata?: {
    language?: string  // Para bloques de código
    caption?: string   // Para imágenes
    url?: string       // Para imágenes
  }
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
interface PageProps {
  params: {
    id: string
  }
  searchParams?: {
    [key: string]: string | string[] | undefined
  }
}
```

### Transformadores de Tipos

**Archivo:** `src/services/notion/transformers.ts`

```typescript
import type { NotionPage, NotionRichText, NotionBlock } from './types'

/**
 * Helper: Extrae texto plano de un array de RichText
 */
export const extractPlainText = (richTextArray: NotionRichText[]): string => {
  return richTextArray.map(rt => rt.plain_text).join('')
}

/**
 * Helper: Extrae URL de cover image
 */
export const extractCoverUrl = (page: NotionPage): string | null => {
  if (!page.cover) return null

  if (page.cover.type === 'external') {
    return page.cover.external?.url ?? null
  }

  if (page.cover.type === 'file') {
    return page.cover.file?.url ?? null
  }

  return null
}

/**
 * Transforma una NotionPage raw a BlogPostType
 * IMPORTANTE: Adaptar según las propiedades de tu database
 */
export const transformNotionPageToPost = (page: NotionPage): BlogPostType => {
  // Extraer propiedades específicas
  const titleProp = page.properties['Title'] || page.properties['Name']
  const descProp = page.properties['Description']
  const dateProp = page.properties['Published']
  const tagsProp = page.properties['Tags']
  const statusProp = page.properties['Status']
  const readTimeProp = page.properties['Read Time']

  // Validar que title exista
  if (!titleProp || titleProp.type !== 'title') {
    throw new Error(`Page ${page.id} missing title property`)
  }

  const title = extractPlainText(titleProp.title)

  return {
    id: page.id,
    title,
    slug: title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''),
    description: descProp?.type === 'rich_text'
      ? extractPlainText(descProp.rich_text)
      : '',
    publishedDate: dateProp?.type === 'date' && dateProp.date
      ? dateProp.date.start
      : page.created_time,
    author: page.created_by.name || 'Unknown',
    tags: tagsProp?.type === 'multi_select'
      ? tagsProp.multi_select.map(tag => tag.name)
      : [],
    coverImage: extractCoverUrl(page),
    status: statusProp?.type === 'status' && statusProp.status
      ? statusProp.status.name as "Published" | "Draft" | "Archived"
      : "Draft",
    readTime: readTimeProp?.type === 'number'
      ? readTimeProp.number
      : null,
  }
}

/**
 * Transforma bloques de Notion a bloques simplificados
 */
export const transformNotionBlocks = (blocks: NotionBlock[]): ContentBlock[] => {
  return blocks.map(block => {
    const base = {
      id: block.id,
    }

    switch (block.type) {
      case 'paragraph':
        return {
          ...base,
          type: 'paragraph' as const,
          content: extractPlainText(block.paragraph.rich_text),
        }

      case 'heading_1':
        return {
          ...base,
          type: 'heading1' as const,
          content: extractPlainText(block.heading_1.rich_text),
        }

      case 'heading_2':
        return {
          ...base,
          type: 'heading2' as const,
          content: extractPlainText(block.heading_2.rich_text),
        }

      case 'heading_3':
        return {
          ...base,
          type: 'heading3' as const,
          content: extractPlainText(block.heading_3.rich_text),
        }

      case 'code':
        return {
          ...base,
          type: 'code' as const,
          content: extractPlainText(block.code.rich_text),
          metadata: {
            language: block.code.language,
          },
        }

      case 'image':
        const imageUrl = block.image.type === 'external'
          ? block.image.external?.url
          : block.image.file?.url

        return {
          ...base,
          type: 'image' as const,
          content: '',
          metadata: {
            url: imageUrl,
            caption: extractPlainText(block.image.caption),
          },
        }

      default:
        return {
          ...base,
          type: 'paragraph' as const,
          content: '',
        }
    }
  })
}
```

---

## 🔌 CAPA DE SERVICIOS (Services Layer) - NOTION

### Estructura

```
services/notion/
├── index.ts           # Exportaciones públicas
├── client.ts          # Cliente Notion SDK
├── database.ts        # Queries a databases
├── pages.ts           # Operaciones con páginas
├── blocks.ts          # Obtener bloques (contenido)
├── transformers.ts    # Transformación de tipos
└── types.ts          # Tipos raw de Notion
```

### Implementación

#### 1. client.ts - Cliente de Notion

```typescript
import { Client } from '@notionhq/client'
import { env } from '@/config/env'

/**
 * Cliente singleton de Notion
 * Usar este cliente en todos los servicios
 */
export const notionClient = new Client({
  auth: env.NOTION_API_KEY,
})

/**
 * Database ID principal
 * Puede ser configurado por proyecto
 */
export const DATABASE_ID = env.NOTION_DATABASE_ID
```

#### 2. database.ts - Queries a Database

```typescript
import { notionClient, DATABASE_ID } from './client'
import { transformNotionPageToPost } from './transformers'
import type { NotionDatabaseQueryResponse, NotionPage } from './types'

/**
 * Obtiene todas las páginas de la database principal
 * Con filtro opcional de publicación
 */
export const getDatabasePages = async (): Promise<BlogPostType[]> => {
  try {
    const response = await notionClient.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: 'Status',
        status: {
          equals: 'Published',
        },
      },
      sorts: [
        {
          property: 'Published',
          direction: 'descending',
        },
      ],
    }) as unknown as NotionDatabaseQueryResponse

    // Transformar páginas raw a tipos del frontend
    return response.results.map(transformNotionPageToPost)
  } catch (error) {
    console.error('Error fetching Notion database:', error)
    return []
  }
}

/**
 * Query con filtros personalizados
 */
export const queryDatabaseByTag = async (tag: string): Promise<BlogPostType[]> => {
  try {
    const response = await notionClient.databases.query({
      database_id: DATABASE_ID,
      filter: {
        and: [
          {
            property: 'Status',
            status: { equals: 'Published' },
          },
          {
            property: 'Tags',
            multi_select: { contains: tag },
          },
        ],
      },
    }) as unknown as NotionDatabaseQueryResponse

    return response.results.map(transformNotionPageToPost)
  } catch (error) {
    console.error('Error querying by tag:', error)
    return []
  }
}

/**
 * Búsqueda en database
 */
export const searchDatabase = async (query: string): Promise<BlogPostType[]> => {
  try {
    const response = await notionClient.databases.query({
      database_id: DATABASE_ID,
      filter: {
        or: [
          {
            property: 'Title',
            title: { contains: query },
          },
          {
            property: 'Description',
            rich_text: { contains: query },
          },
        ],
      },
    }) as unknown as NotionDatabaseQueryResponse

    return response.results.map(transformNotionPageToPost)
  } catch (error) {
    console.error('Error searching database:', error)
    return []
  }
}
```

#### 3. pages.ts - Operaciones con Páginas

```typescript
import { notionClient } from './client'
import { transformNotionPageToPost } from './transformers'
import type { NotionPage } from './types'

/**
 * Obtiene una página específica por ID
 */
export const getPageById = async (pageId: string): Promise<BlogPostType | null> => {
  try {
    const response = await notionClient.pages.retrieve({
      page_id: pageId,
    }) as unknown as NotionPage

    return transformNotionPageToPost(response)
  } catch (error) {
    console.error(`Error fetching page ${pageId}:`, error)
    return null
  }
}

/**
 * Obtiene metadata de página sin contenido
 */
export const getPageMetadata = async (pageId: string) => {
  try {
    const response = await notionClient.pages.retrieve({
      page_id: pageId,
    }) as unknown as NotionPage

    return {
      id: response.id,
      createdTime: response.created_time,
      lastEditedTime: response.last_edited_time,
      coverUrl: response.cover?.type === 'external'
        ? response.cover.external?.url
        : response.cover?.file?.url,
    }
  } catch (error) {
    console.error('Error fetching page metadata:', error)
    return null
  }
}
```

#### 4. blocks.ts - Obtener Contenido

```typescript
import { notionClient } from './client'
import { transformNotionBlocks } from './transformers'
import type { NotionBlock } from './types'

/**
 * Obtiene todos los bloques (contenido) de una página
 */
export const getPageBlocks = async (pageId: string): Promise<ContentBlock[]> => {
  try {
    const response = await notionClient.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    })

    const blocks = response.results as unknown as NotionBlock[]

    return transformNotionBlocks(blocks)
  } catch (error) {
    console.error(`Error fetching blocks for page ${pageId}:`, error)
    return []
  }
}

/**
 * Obtiene bloques con paginación
 */
export const getAllPageBlocks = async (pageId: string): Promise<ContentBlock[]> => {
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

    return transformNotionBlocks(allBlocks)
  } catch (error) {
    console.error('Error fetching all blocks:', error)
    return []
  }
}
```

#### 5. index.ts - Exportaciones Públicas

```typescript
// Cliente
export { notionClient, DATABASE_ID } from './client'

// Database operations
export {
  getDatabasePages,
  queryDatabaseByTag,
  searchDatabase
} from './database'

// Page operations
export {
  getPageById,
  getPageMetadata
} from './pages'

// Block operations
export {
  getPageBlocks,
  getAllPageBlocks
} from './blocks'

// Transformers (útiles para casos especiales)
export {
  extractPlainText,
  extractCoverUrl,
  transformNotionPageToPost,
  transformNotionBlocks
} from './transformers'

// Types (exportar solo si es necesario en componentes)
export type { NotionPage, NotionProperty, NotionBlock } from './types'
```

### Configuración de Entorno

**config/env.ts:**

```typescript
export const env = {
  NOTION_API_KEY: process.env.NOTION_API_KEY ?? '',
  NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID ?? '',
}

// Validación (opcional pero recomendado)
const validateEnv = () => {
  const required = [
    'NOTION_API_KEY',
    'NOTION_DATABASE_ID',
  ]

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`)
  }
}

// Descomentar en producción
// if (process.env.NODE_ENV === 'production') {
//   validateEnv()
// }
```

**.env.example:**

```bash
# Notion Configuration
NOTION_API_KEY="secret_xxxxxxxxxxxxxxxxxxxxx"
NOTION_DATABASE_ID="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Cómo obtener credenciales:
# 1. Crear integración en: https://www.notion.so/my-integrations
# 2. Copiar "Internal Integration Token" como NOTION_API_KEY
# 3. Compartir database con la integración
# 4. Obtener Database ID de la URL de la database
#    URL: https://notion.so/workspace/xxxxx?v=yyyyy
#    ID: xxxxx (antes del ?)
```

---

## 📚 ESTRUCTURA DE DOCUMENTACIÓN (Specs/)

### Specs/types/notion-types.md

```markdown
# Tipos de Datos de Notion

> Definiciones completas de tipos para integración con Notion API
> Última actualización: YYYY-MM-DD

## Estructura General

Notion organiza datos en tres niveles principales:

1. **Databases** - Colecciones de páginas con schema definido
2. **Pages** - Documentos individuales con propiedades
3. **Blocks** - Unidades de contenido dentro de páginas

## Tipos Raw de la API

### NotionPage

[Incluir tipos completos de types.ts]

### Propiedades (Properties)

[Documentar los 20+ tipos de propiedades]

### Bloques (Blocks)

[Documentar tipos de bloques soportados]

## Tipos del Frontend

### BlogPostType (o equivalente)

[Tipo simplificado usado en componentes]

### ContentBlock

[Tipo de bloque simplificado]

## Transformadores

### transformNotionPageToPost

[Documentar la transformación]

### extractPlainText

[Helper para extraer texto]

## Ejemplos

[Ejemplos de uso completos]
```

### Specs/api-integration/notion-integration.md

```markdown
# Integración con Notion API

> Guía completa de integración con Notion
> Última actualización: YYYY-MM-DD

## Configuración Inicial

### 1. Crear Integración en Notion

1. Ir a [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click en "+ New integration"
3. Configurar:
   - Name: [Nombre del proyecto]
   - Associated workspace: [Tu workspace]
   - Capabilities: Read content
4. Copiar "Internal Integration Token"

### 2. Compartir Database

1. Abrir la database en Notion
2. Click en "..." → "Add connections"
3. Seleccionar tu integración

### 3. Obtener Database ID

De la URL de tu database:
```
https://www.notion.so/workspace/1234567890abcdef?v=...
                                ^^^^^^^^^^^^^^^^
                                Database ID
```

## Estructura de la Database

### Propiedades Recomendadas

**Para Blog:**
- Title (title) - Título del post
- Description (rich_text) - Descripción corta
- Published (date) - Fecha de publicación
- Tags (multi_select) - Categorías/tags
- Status (status) - Published, Draft, Archived
- Read Time (number) - Minutos de lectura
- Author (people) - Autor
- Cover (files) - Imagen de portada

**Para Portfolio:**
- Name (title) - Nombre del proyecto
- Description (rich_text) - Descripción
- Date (date) - Fecha del proyecto
- Technologies (multi_select) - Tech stack
- Status (status) - Completed, In Progress
- Link (url) - URL del proyecto
- Images (files) - Screenshots

## Servicios Disponibles

[Documentar cada servicio con ejemplos]

## Rate Limiting

Notion API tiene rate limits:
- 3 requests por segundo
- Usar caché cuando sea posible

## Caching Strategies

[Estrategias de caché ISR, etc.]

## Manejo de Errores

[Patrones de error handling]

## Referencias

- [Notion API Reference](https://developers.notion.com/reference)
- [@notionhq/client SDK](https://github.com/makenotion/notion-sdk-js)
```

### Specs/guides/working-with-notion-content.md

```markdown
# Trabajando con Contenido de Notion

> Guía para renderizar y trabajar con contenido de Notion
> Última actualización: YYYY-MM-DD

## Renderizado de Bloques

### Componente ContentRenderer

[Ejemplo de componente que renderiza bloques]

### Soporte de Tipos de Bloque

[Lista de bloques soportados y cómo renderizarlos]

## Rich Text

### Formato y Anotaciones

[Cómo manejar bold, italic, code, etc.]

### Links y Menciones

[Cómo procesar links]

## Imágenes

### URLs Temporales

Las URLs de imágenes de Notion expiran después de 1 hora.
Estrategias:
1. Re-fetch cuando expire
2. Copiar imágenes a CDN propio
3. Usar ISR con revalidación corta

### Optimización

[Uso de next/image con URLs de Notion]

## Bases de Datos Relacionales

[Cómo manejar propiedades de relación]

## Fórmulas y Rollups

[Cómo usar propiedades computadas]
```

---

## 🎨 ARCHIVOS DE CONFIGURACIÓN

### package.json

```json
{
  "name": "[project-name]",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "sass": "^1.92.0",
    "classnames": "^2.5.0",
    "@notionhq/client": "^2.2.15"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5"
  }
}
```

### next.config.ts

```typescript
import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  // SASS con variables globales
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/sass')],
    prependData: `@import "main.sass"`
  },

  // Optimización de imágenes
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
      // Agregar más patrones según necesidad
    ]
  },

  // ISR para contenido de Notion
  // experimental: {
  //   isrMemoryCacheSize: 0, // Desactivar caché en memoria en producción
  // }
}

export default nextConfig
```

---

## 📋 EJEMPLO DE PÁGINA CON NOTION

### app/(home)/page.tsx

```typescript
import { getDatabasePages } from '@/services/notion'
import { PostList } from '@/components/blog/PostList'

export const revalidate = 3600 // ISR: revalidar cada hora

export default async function HomePage() {
  const posts = await getDatabasePages()

  return (
    <main>
      <h1>Latest Posts</h1>
      <PostList posts={posts} />
    </main>
  )
}

export const metadata = {
  title: 'Blog - Home',
  description: 'Latest blog posts from Notion',
}
```

### app/blog/[id]/page.tsx

```typescript
import { getPageById, getPageBlocks, getDatabasePages } from '@/services/notion'
import { ContentRenderer } from '@/components/blog/ContentRenderer'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    id: string
  }
}

export const revalidate = 3600 // ISR

export default async function BlogPostPage({ params }: PageProps) {
  const [post, blocks] = await Promise.all([
    getPageById(params.id),
    getPageBlocks(params.id),
  ])

  if (!post) {
    notFound()
  }

  return (
    <article>
      <header>
        <h1>{post.title}</h1>
        <time>{post.publishedDate}</time>
        <div>{post.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      </header>

      <ContentRenderer blocks={blocks} />
    </article>
  )
}

// Generate static paths para SSG
export async function generateStaticParams() {
  const posts = await getDatabasePages()

  return posts.map(post => ({
    id: post.id,
  }))
}

// Generate metadata
export async function generateMetadata({ params }: PageProps) {
  const post = await getPageById(params.id)

  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}
```

---

## 📝 COMPONENTE CONTENT RENDERER

### components/blog/ContentRenderer/ContentRenderer.tsx

```typescript
import styles from './ContentRenderer.module.sass'
import Image from 'next/image'
import { blurImage } from '@/assets/blurDataURLs'

interface ContentRendererProps {
  blocks: ContentBlock[]
}

export const ContentRenderer = ({ blocks }: ContentRendererProps) => {
  return (
    <div className={styles.ContentRenderer}>
      {blocks.map(block => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={block.id} className={styles.ContentRenderer__paragraph}>
                {block.content}
              </p>
            )

          case 'heading1':
            return (
              <h1 key={block.id} className={styles.ContentRenderer__h1}>
                {block.content}
              </h1>
            )

          case 'heading2':
            return (
              <h2 key={block.id} className={styles.ContentRenderer__h2}>
                {block.content}
              </h2>
            )

          case 'heading3':
            return (
              <h3 key={block.id} className={styles.ContentRenderer__h3}>
                {block.content}
              </h3>
            )

          case 'code':
            return (
              <pre key={block.id} className={styles.ContentRenderer__code}>
                <code data-language={block.metadata?.language}>
                  {block.content}
                </code>
              </pre>
            )

          case 'image':
            if (!block.metadata?.url) return null

            return (
              <figure key={block.id} className={styles.ContentRenderer__figure}>
                <Image
                  src={block.metadata.url}
                  alt={block.metadata.caption || 'Image'}
                  width={800}
                  height={600}
                  placeholder="blur"
                  blurDataURL={blurImage}
                  className={styles.ContentRenderer__image}
                />
                {block.metadata.caption && (
                  <figcaption>{block.metadata.caption}</figcaption>
                )}
              </figure>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
```

---

## ✅ CHECKLIST DE GENERACIÓN

### Estructura Base
- [ ] Crear estructura completa de carpetas
- [ ] Configurar package.json con @notionhq/client
- [ ] Configurar tsconfig.json con path alias
- [ ] Configurar next.config.ts con SASS e images de Notion
- [ ] Crear .gitignore
- [ ] Crear .env.example con variables de Notion

### Tipos y Servicios
- [ ] src/services/notion/types.ts (tipos raw completos)
- [ ] src/services/notion/client.ts (cliente Notion)
- [ ] src/services/notion/database.ts (queries)
- [ ] src/services/notion/pages.ts (operaciones páginas)
- [ ] src/services/notion/blocks.ts (contenido)
- [ ] src/services/notion/transformers.ts (transformación)
- [ ] src/services/notion/index.ts (exportaciones)
- [ ] types.d.ts con tipos del frontend
- [ ] src/config/env.ts

### Archivos Esenciales
- [ ] src/app/layout.tsx (root layout)
- [ ] src/app/page.tsx (home page)
- [ ] src/app/error.tsx
- [ ] src/app/not-found.tsx

### Componentes Base
- [ ] Header componente
- [ ] Footer componente
- [ ] Loader componente
- [ ] ContentRenderer componente (para bloques de Notion)
- [ ] [Entity]Card componente
- [ ] [Entity]List componente

### Estilos
- [ ] src/sass/_variables.sass
- [ ] src/sass/main.sass
- [ ] src/sass/globals.sass

### Documentación (Specs/)
- [ ] Specs/README.md
- [ ] Specs/architecture/project-structure.md
- [ ] Specs/types/notion-types.md ⭐ NUEVO
- [ ] Specs/types/type-definitions.md
- [ ] Specs/api-integration/notion-integration.md ⭐ NUEVO
- [ ] Specs/guides/styles-conventions.md
- [ ] Specs/guides/working-with-notion-content.md ⭐ NUEVO
- [ ] Specs/Onboarding/README.md
- [ ] Specs/Onboarding/01-getting-started.md
- [ ] Specs/Onboarding/02-project-overview.md
- [ ] Specs/Onboarding/03-development-workflow.md
- [ ] Specs/Onboarding/04-coding-standards.md
- [ ] Specs/Onboarding/05-notion-integration.md ⭐ NUEVO
- [ ] Specs/Onboarding/06-troubleshooting.md

### Raíz
- [ ] README.md del proyecto
- [ ] claude.md (memoria técnica)

---

## 🔍 VALIDACIÓN FINAL

Antes de entregar el proyecto, verifica:

1. **Compila sin errores:** `npm run build`
2. **TypeScript sin errores:** Verificar tipado completo
3. **Credenciales de Notion configuradas** en .env.local
4. **Database compartida** con la integración
5. **Tipos de Notion completos** en types.ts
6. **Transformadores funcionando** correctamente
7. **Documentación completa** en Specs/
8. **README.md claro** con setup de Notion
9. **claude.md actualizado** con contexto Notion
10. **ISR configurado** para revalidación de contenido

---

## 🚨 ERRORES COMUNES Y SOLUCIONES

### 1. Error: "Unauthorized" de Notion API

**Causa:** API key inválida o database no compartida

**Solución:**
- Verificar NOTION_API_KEY en .env.local
- Compartir database con integración en Notion
- Verificar capabilities de la integración

### 2. Error: "Object not found" al query database

**Causa:** Database ID incorrecto o no compartido

**Solución:**
- Verificar NOTION_DATABASE_ID
- Asegurarse que la integración tiene acceso

### 3. Imágenes no cargan

**Causa:** URLs de Notion expiran o dominio no permitido

**Solución:**
- Agregar dominios de Notion a remotePatterns
- Usar ISR con revalidación frecuente
- Considerar copiar imágenes a CDN propio

### 4. Error: Property not found

**Causa:** Nombre de propiedad incorrecto en transformador

**Solución:**
- Verificar nombres exactos de propiedades en Notion
- Usar API para inspeccionar schema: `databases.retrieve()`
- Ajustar transformadores según schema real

---

## 💡 MEJORES PRÁCTICAS CON NOTION

1. **Usar ISR (Incremental Static Regeneration)**
   - `revalidate` en páginas para actualizar contenido
   - Balance entre freshness y performance

2. **Implementar caché de queries**
   - React Query o SWR para queries frecuentes
   - Reducir llamadas a Notion API

3. **Manejo de Rate Limits**
   - Implementar retry logic con backoff
   - Batch requests cuando sea posible

4. **Optimización de Imágenes**
   - Usar CDN propio para imágenes críticas
   - Implementar blur placeholders

5. **Type Safety**
   - Mantener types.ts sincronizado con schema
   - Usar validación en runtime (Zod, Yup)

6. **Error Handling Robusto**
   - Graceful degradation
   - Fallbacks para contenido faltante

7. **SEO Optimization**
   - generateMetadata para cada página
   - Structured data para rich snippets

---

## 📚 RECURSOS Y REFERENCIAS

- [Notion API Documentation](https://developers.notion.com/reference)
- [@notionhq/client SDK](https://github.com/makenotion/notion-sdk-js)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SASS Documentation](https://sass-lang.com/documentation/)

---

## 🎯 EJEMPLO DE USO DEL PROMPT

**Usuario:** "Crea un proyecto Next.js con Notion como backend para un blog de tecnología"

**Claude debe:**
1. Clarificar: propiedades de Notion necesarias (Title, Published, Tags, etc.)
2. Generar estructura completa
3. Configurar integración con Notion SDK
4. Crear tipos raw completos de Notion API
5. Crear transformadores de tipos
6. Crear servicios: database, pages, blocks
7. Crear componentes: PostCard, PostList, ContentRenderer
8. Generar toda la documentación en Specs/
9. Crear archivos de configuración
10. Proporcionar instrucciones de setup con Notion

---

**FIN DEL TEMPLATE - NOTION EDITION**

Este prompt debe resultar en un proyecto Next.js completo, production-ready, con integración robusta con Notion como headless CMS, incluyendo tipado completo de la API de Notion, transformadores de datos, y documentación comprehensiva específica para Notion.