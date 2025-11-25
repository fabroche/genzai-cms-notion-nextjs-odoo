// Notion API Types for Page Objects

export interface NotionUser {
  object: 'user';
  id: string;
}

export interface ExternalCover {
  type: 'external';
  external: {
    url: string;
  };
}

export interface FileCover {
  type: 'file';
  file: {
    url: string;
    expiry_time: string;
  };
}

export type NotionCover = ExternalCover | FileCover;

export interface CustomEmojiIcon {
  type: 'custom_emoji';
  custom_emoji: {
    emoji: string;
  };
}

export interface EmojiIcon {
  type: 'emoji';
  emoji: string;
}

export interface ExternalIcon {
  type: 'external';
  external: {
    url: string;
  };
}

export interface FileIcon {
  type: 'file';
  file: {
    url: string;
    expiry_time: string;
  };
}

export type NotionIcon = CustomEmojiIcon | EmojiIcon | ExternalIcon | FileIcon;

export interface DatabaseParent {
  type: 'data_source_id';
  data_source_id: string;
  database_id: string;
}

export interface PageParent {
  type: 'page_id';
  page_id: string;
}

export interface WorkspaceParent {
  type: 'workspace';
  workspace: true;
}

export type NotionParent = DatabaseParent | PageParent | WorkspaceParent;

// Property value types
export interface RichTextObject {
  type: 'text';
  text: {
    content: string;
    link: { url: string } | null;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href: string | null;
}

export interface TitleProperty {
  id: string;
  type: 'title';
  title: RichTextObject[];
}

export interface RichTextProperty {
  id: string;
  type: 'rich_text';
  rich_text: RichTextObject[];
}

export interface EmailProperty {
  id: string;
  type: 'email';
  email: string | null;
}

export interface PhoneNumberProperty {
  id: string;
  type: 'phone_number';
  phone_number: string | null;
}

export interface DateProperty {
  id: string;
  type: 'date';
  date: {
    start: string;
    end: string | null;
    time_zone: string | null;
  } | null;
}

export interface RelationProperty {
  id: string;
  type: 'relation';
  relation: Array<{
    id: string;
  }>;
  has_more: boolean;
}

export interface MultiSelectProperty {
  id: string;
  type: 'multi_select';
  multi_select: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

export interface SelectProperty {
  id: string;
  type: 'select';
  select: {
    id: string;
    name: string;
    color: string;
  } | null;
}

export interface FilesProperty {
  id: string;
  type: 'files';
  files: Array<{
    name: string;
    type: 'external' | 'file';
    external?: { url: string };
    file?: { url: string; expiry_time: string };
  }>;
}

export interface CheckboxProperty {
  id: string;
  type: 'checkbox';
  checkbox: boolean;
}

export interface NumberProperty {
  id: string;
  type: 'number';
  number: number | null;
}

export interface UrlProperty {
  id: string;
  type: 'url';
  url: string | null;
}

export type NotionProperty =
  | TitleProperty
  | RichTextProperty
  | EmailProperty
  | PhoneNumberProperty
  | DateProperty
  | RelationProperty
  | MultiSelectProperty
  | SelectProperty
  | FilesProperty
  | CheckboxProperty
  | NumberProperty
  | UrlProperty;

// Specific properties for your database
export interface PersonaProperties {
  nombre: TitleProperty;
  apellido_1: RichTextProperty;
  apellido_2: RichTextProperty;
  nombre_2: RichTextProperty;
  email: EmailProperty;
  contacto: PhoneNumberProperty;
  password: RichTextProperty;
  Birthdate: DateProperty;
  starting_date: DateProperty;
  avatar: FilesProperty;
  Proyecto: RelationProperty;
  Tareas: RelationProperty;
  Roles: RelationProperty;
}


// Main Page type
export interface NotionPage<T = Record<string, NotionProperty>> {
  object: 'page';
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: NotionUser;
  last_edited_by: NotionUser;
  cover: NotionCover | null;
  icon: NotionIcon | null;
  parent: NotionParent;
  archived: boolean;
  in_trash: boolean;
  is_locked: boolean;
  properties: T;
  url?: string;
  public_url?: string | null;
}

// Specific type for Persona page
export type PersonaPage = NotionPage<PersonaProperties>;

// Type for expanded relations
export interface PersonaWithRelations extends Omit<PersonaPage, 'properties'> {
  properties: Omit<PersonaProperties, 'Proyecto' | 'Tareas' | 'Roles'> & {
    Proyecto: RelationProperty & { expanded?: NotionPage[] };
    Tareas: RelationProperty & { expanded?: NotionPage[] };
    Roles: RelationProperty & { expanded?: NotionPage[] };
  };
}

// ===================================================================================================================
// ===================================================================================================================
// ===================================================================================================================
// ===================================================================================================================
// Tipos básicos de Notion
export interface NotionRichText {
  type: 'text';
  text: { content: string; link?: { url: string } | null };
  plain_text: string;
  annotations?: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  href?: string | null;
}

export interface NotionTitle {
  type: 'text';
  text: { content: string; link?: { url: string } | null };
  plain_text: string;
  annotations?: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  href?: string | null;
}

export interface NotionRelation {
  id: string;
}

export interface NotionFile {
  name: string;
  type: 'file' | 'external';
  file?: {
    url: string;
    expiry_time: string;
  };
  external?: {
    url: string;
  };
  url?: string;
}

export interface NotionDate {
  start: string;
  end: string | null;
  time_zone?: string | null;
}

// Tipos para propiedades que se envían a Notion
export interface NotionPropertyTitle {
  title: Array<{
    text: { content: string };
  }>;
}

export interface NotionPropertyRichText {
  rich_text: Array<{
    text: { content: string };
  }>;
}

export interface NotionPropertyEmail {
  email: string | null;
}

export interface NotionPropertyPhoneNumber {
  phone_number: string | null;
}

export interface NotionPropertyDate {
  date: {
    start: string;
    end?: string | null;
  } | null;
}

export interface NotionPropertyRelation {
  relation: Array<{ id: string }>;
}

// Tipos para filtros de Notion
export interface NotionFilterEmail {
  property: 'email';
  email: { equals: string };
}

export interface NotionFilterTitle {
  property: 'nombre';
  title: { contains: string };
}

export interface NotionFilterRelation {
  property: 'Roles' | 'Proyecto';
  relation: { contains: string };
}

export type NotionFilter = NotionFilterEmail | NotionFilterTitle | NotionFilterRelation;

export interface NotionFilterGroup {
  and: NotionFilter[];
}

// Tipos para parámetros de query de Notion
export interface NotionDatabaseQueryParams {
  database_id: string;
  filter?: NotionFilter | NotionFilterGroup;
  page_size?: number;
  start_cursor?: string;
}

export interface NotionDataSourceQueryParams {
  data_source_id: string;
  filter?: NotionFilter | NotionFilterGroup;
  page_size?: number;
  start_cursor?: string;
}

// Tipo para opciones de paginación
export interface PaginationOptions {
  pageSize?: number;
  startCursor?: string;
}