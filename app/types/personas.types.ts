/**
 * Tipos para la base de datos de Personas en Notion
 */
import {
  NotionFile,
  NotionPropertyDate,
  NotionPropertyEmail,
  NotionPropertyPhoneNumber,
  NotionPropertyRelation,
  NotionPropertyRichText,
  NotionPropertyTitle
} from "@/app/types/notion";

// Tipo para las propiedades de Notion tal como vienen de la API
export interface NotionPersonaProperties {
  nombre: {
    type: 'title';
    title: Array<{
      type: 'text';
      text: { content: string };
      plain_text: string;
    }>;
  };
  email: {
    type: 'email';
    email: string | null;
  };
  nombre_2: {
    type: 'rich_text';
    rich_text: Array<{
      type: 'text';
      text: { content: string };
      plain_text: string;
    }>;
  };
  apellido_1: {
    type: 'rich_text';
    rich_text: Array<{
      type: 'text';
      text: { content: string };
      plain_text: string;
    }>;
  };
  apellido_2: {
    type: 'rich_text';
    rich_text: Array<{
      type: 'text';
      text: { content: string };
      plain_text: string;
    }>;
  };
  contacto: {
    type: 'phone_number';
    phone_number: string | null;
  };
  password: {
    type: 'rich_text';
    rich_text: Array<{
      type: 'text';
      text: { content: string };
      plain_text: string;
    }>;
  };
  avatar: {
    type: 'files';
    files: NotionFile[];
  };
  Birthdate: {
    type: 'date';
    date: {
      start: string;
      end: string | null;
    } | null;
  };
  starting_date: {
    type: 'date';
    date: {
      start: string;
      end: string | null;
    } | null;
  };
  Proyecto: {
    type: 'relation';
    relation: Array<{ id: string }>;
  };
  Tareas: {
    type: 'relation';
    relation: Array<{ id: string }>;
  };
  Roles: {
    type: 'relation';
    relation: Array<{ id: string }>;
  };
}

// Tipo para la página completa de Notion
export interface NotionPersonaPage {
  object: 'page';
  id: string;
  created_time: string;
  last_edited_time: string;
  properties: NotionPersonaProperties;
  url: string;
  archived: boolean;
}

// Interfaz limpia para usar en la aplicación
export interface Persona {
  id: string;
  nombre: string;
  nombre2?: string;
  apellido1?: string;
  apellido2?: string;
  email?: string;
  contacto?: string;
  password?: string;
  avatar?: string[];
  birthdate?: string;
  startingDate?: string;
  proyectoIds?: string[];
  tareasIds?: string[];
  rolesIds?: string[];
  createdTime: string;
  lastEditedTime: string;
  url: string;
}

// Tipo para crear una nueva persona
export interface CreatePersonaInput {
  nombre: string;
  nombre2?: string;
  apellido1?: string;
  apellido2?: string;
  email?: string;
  contacto?: string;
  password?: string;
  birthdate?: string;
  startingDate?: string;
  proyectoIds?: string[];
  tareasIds?: string[];
  rolesIds?: string[];
}

// Tipo para actualizar una persona (todos los campos opcionales excepto id)
export interface UpdatePersonaInput {
  id: string;
  nombre?: string;
  nombre2?: string;
  apellido1?: string;
  apellido2?: string;
  email?: string;
  contacto?: string;
  password?: string;
  birthdate?: string;
  startingDate?: string;
  proyectoIds?: string[];
  tareasIds?: string[];
  rolesIds?: string[];
}

// Tipo para filtros de búsqueda
export interface PersonaFilters {
  email?: string;
  nombre?: string;
  rolId?: string;
  proyectoId?: string;
}

// Tipo para respuesta paginada
export interface PaginatedPersonas {
  personas: Persona[];
  hasMore: boolean;
  nextCursor?: string;
}

// Tipo para las propiedades de creación/actualización
export interface NotionPersonaPropertiesInput {
  nombre?: NotionPropertyTitle;
  nombre_2?: NotionPropertyRichText;
  apellido_1?: NotionPropertyRichText;
  apellido_2?: NotionPropertyRichText;
  email?: NotionPropertyEmail;
  contacto?: NotionPropertyPhoneNumber;
  password?: NotionPropertyRichText;
  Birthdate?: NotionPropertyDate;
  starting_date?: NotionPropertyDate;
  Proyecto?: NotionPropertyRelation;
  Tareas?: NotionPropertyRelation;
  Roles?: NotionPropertyRelation;
}