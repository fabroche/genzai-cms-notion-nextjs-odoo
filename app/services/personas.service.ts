/**
 * Servicio CRUD para la base de datos de Personas en Notion
 */

import "server-only";
import {cache} from "react";
import {notionClient} from '../libs/notion';
import type {
  CreatePersonaInput,
  NotionPersonaPage,
  PaginatedPersonas,
  Persona,
  PersonaFilters,
  UpdatePersonaInput,
} from '@/app/types/personas.types';

import type {NotionDataSourceQueryParams, NotionFilter, PaginationOptions,} from '@/app/types/notion';

import {extractFileUrls, extractRelationIds, extractRichText, extractTitle,} from '@/app/utils/notion'

// Revalidar cada 60 segundos (ISR)
export const revalidate = process.env.CACHE_MAX_AGE ?? 5;

// ID del data source de Personas en Notion
const PERSONAS_DATASOURCE_ID = process.env.NOTION_PERSONAS_DATASOURCE_ID ?? '';

// Transforma una p�gina de Notion a objeto Persona
function transformNotionPageToPersona(page: NotionPersonaPage): Persona {
  const props = page.properties;

  return {
    id: page.id,
    nombre: extractTitle(props.nombre?.title || []),
    nombre2: extractRichText(props.nombre_2?.rich_text || []) || undefined,
    apellido1: extractRichText(props.apellido_1?.rich_text || []) || undefined,
    apellido2: extractRichText(props.apellido_2?.rich_text || []) || undefined,
    email: props.email?.email || undefined,
    contacto: props.contacto?.phone_number || undefined,
    password: extractRichText(props.password?.rich_text || []) || undefined,
    avatar: extractFileUrls(props.avatar?.files || []),
    birthdate: props.Birthdate?.date?.start || undefined,
    startingDate: props.starting_date?.date?.start || undefined,
    proyectoIds: extractRelationIds(props.Proyecto?.relation || []),
    tareasIds: extractRelationIds(props.Tareas?.relation || []),
    rolesIds: extractRelationIds(props.Roles?.relation || []),
    createdTime: page.created_time,
    lastEditedTime: page.last_edited_time,
    url: page.url,
  };
}

// Convierte input de creaci�n a propiedades de Notion
function createInputToNotionProperties(input: CreatePersonaInput) {
  const properties = {
    nombre: {
      title: [
        {
          text: { content: input.nombre },
        },
      ],
    },
  };

  if (input.nombre2) {
    properties.nombre_2 = {
      rich_text: [{ text: { content: input.nombre2 } }],
    };
  }

  if (input.apellido1) {
    properties.apellido_1 = {
      rich_text: [{ text: { content: input.apellido1 } }],
    };
  }

  if (input.apellido2) {
    properties.apellido_2 = {
      rich_text: [{ text: { content: input.apellido2 } }],
    };
  }

  if (input.email) {
    properties.email = { email: input.email };
  }

  if (input.contacto) {
    properties.contacto = { phone_number: input.contacto };
  }

  if (input.password) {
    properties.password = {
      rich_text: [{ text: { content: input.password } }],
    };
  }

  if (input.birthdate) {
    properties.Birthdate = {
      date: { start: input.birthdate },
    };
  }

  if (input.startingDate) {
    properties.starting_date = {
      date: { start: input.startingDate },
    };
  }

  if (input.proyectoIds && input.proyectoIds.length > 0) {
    properties.Proyecto = {
      relation: input.proyectoIds.map((id) => ({ id })),
    };
  }

  if (input.tareasIds && input.tareasIds.length > 0) {
    properties.Tareas = {
      relation: input.tareasIds.map((id) => ({ id })),
    };
  }

  if (input.rolesIds && input.rolesIds.length > 0) {
    properties.Roles = {
      relation: input.rolesIds.map((id) => ({ id })),
    };
  }

  return properties;
}

// Convierte input de actualizaci�n a propiedades de Notion
function updateInputToNotionProperties(input: UpdatePersonaInput) {
  const properties: any = {};

  if (input.nombre !== undefined) {
    properties.nombre = {
      title: [{ text: { content: input.nombre } }],
    };
  }

  if (input.nombre2 !== undefined) {
    properties.nombre_2 = {
      rich_text: input.nombre2 ? [{ text: { content: input.nombre2 } }] : [],
    };
  }

  if (input.apellido1 !== undefined) {
    properties.apellido_1 = {
      rich_text: input.apellido1 ? [{ text: { content: input.apellido1 } }] : [],
    };
  }

  if (input.apellido2 !== undefined) {
    properties.apellido_2 = {
      rich_text: input.apellido2 ? [{ text: { content: input.apellido2 } }] : [],
    };
  }

  if (input.email !== undefined) {
    properties.email = { email: input.email || null };
  }

  if (input.contacto !== undefined) {
    properties.contacto = { phone_number: input.contacto || null };
  }

  if (input.password !== undefined) {
    properties.password = {
      rich_text: input.password ? [{ text: { content: input.password } }] : [],
    };
  }

  if (input.birthdate !== undefined) {
    properties.Birthdate = {
      date: input.birthdate ? { start: input.birthdate } : null,
    };
  }

  if (input.startingDate !== undefined) {
    properties.starting_date = {
      date: input.startingDate ? { start: input.startingDate } : null,
    };
  }

  if (input.proyectoIds !== undefined) {
    properties.Proyecto = {
      relation: input.proyectoIds.map((id) => ({ id })),
    };
  }

  if (input.tareasIds !== undefined) {
    properties.Tareas = {
      relation: input.tareasIds.map((id) => ({ id })),
    };
  }

  if (input.rolesIds !== undefined) {
    properties.Roles = {
      relation: input.rolesIds.map((id) => ({ id })),
    };
  }

  return properties;
}

/**
 * Servicio CRUD para Personas
 */
export class PersonasService  {

  constructor() {}

  async create(input: CreatePersonaInput): Promise<Persona> {
    const properties = createInputToNotionProperties(input);

    const page = await notionClient.pages.create({
      parent: { data_source_id: PERSONAS_DATASOURCE_ID },
      properties,
    });

    return transformNotionPageToPersona(page as any as NotionPersonaPage);
  }

  /**
   * READ - Obtener una persona por ID (cacheado)
   */
  getById = cache(async (personaId: string): Promise<Persona> => {
    const page = await notionClient.pages.retrieve({ page_id: personaId });
    return transformNotionPageToPersona(page as any as NotionPersonaPage);
  });

  /**
   * READ - Listar todas las personas con paginaci�n (cacheado)
   */
  list = cache(async (options?: PaginationOptions): Promise<PaginatedPersonas> => {
    const queryParams: NotionDataSourceQueryParams = {
      data_source_id: PERSONAS_DATASOURCE_ID,
    };

    if (options?.pageSize) {
      queryParams.page_size = options.pageSize;
    }

    if (options?.startCursor) {
      queryParams.start_cursor = options.startCursor;
    }

    const response = await notionClient.dataSources.query(queryParams);

    console.log(response.results[0].properties.Tareas.relation);

    return {
      personas: response.results.map(transformNotionPageToPersona),
      hasMore: response.has_more,
      nextCursor: response.next_cursor || undefined,
    };
  });

  /**
   * QUERY - Buscar personas con filtros (cacheado por combinación de filtros)
   */
  query = cache(async (
    filters?: PersonaFilters,
    options?: PaginationOptions
  ): Promise<PaginatedPersonas> => {
    const queryParams: NotionDataSourceQueryParams = {
      data_source_id: PERSONAS_DATASOURCE_ID,
    };

    // Construir filtros de Notion
    if (filters) {
      const notionFilters: NotionFilter[] = [];

      if (filters.email) {
        notionFilters.push({
          property: 'email',
          email: { equals: filters.email },
        });
      }

      if (filters.nombre) {
        notionFilters.push({
          property: 'nombre',
          title: { contains: filters.nombre },
        });
      }

      if (filters.rolId) {
        notionFilters.push({
          property: 'Roles',
          relation: { contains: filters.rolId },
        });
      }

      if (filters.proyectoId) {
        notionFilters.push({
          property: 'Proyecto',
          relation: { contains: filters.proyectoId },
        });
      }

      if (notionFilters.length > 0) {
        queryParams.filter =
          notionFilters.length === 1
            ? notionFilters[0]
            : { and: notionFilters };
      }
    }

    if (options?.pageSize) {
      queryParams.page_size = options.pageSize;
    }

    if (options?.startCursor) {
      queryParams.start_cursor = options.startCursor;
    }

    const response = await notionClient.dataSources.query(queryParams);

    return {
      personas: response.results.map(transformNotionPageToPersona),
      hasMore: response.has_more,
      nextCursor: response.next_cursor || undefined,
    };
  });

  /**
   * UPDATE - Actualizar una persona
   */
  async update(input: UpdatePersonaInput): Promise<Persona> {
    const { id, ...rest } = input;
    const properties = updateInputToNotionProperties({ id, ...rest });

    const page = await notionClient.pages.update({
      page_id: id,
      properties,
    });

    return transformNotionPageToPersona(page as any as NotionPersonaPage);
  }

  /**
   * DELETE - Archivar (eliminar) una persona
   */
  async delete(personaId: string): Promise<void> {
    await notionClient.pages.update({
      page_id: personaId,
      archived: true,
    });
  }

  /**
   * RESTORE - Restaurar una persona archivada
   */
  async restore(personaId: string): Promise<Persona> {
    const page = await notionClient.pages.update({
      page_id: personaId,
      archived: false,
    });

    return transformNotionPageToPersona(page as any as NotionPersonaPage);
  }

  /**
   * Utilidades adicionales
   */

  // Obtener el nombre completo de una persona
  getFullName(persona: Persona): string {
    const parts = [
      persona.nombre,
      persona.nombre2,
      persona.apellido1,
      persona.apellido2,
    ].filter(Boolean);
    return parts.join(' ');
  }

  // Validar email
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Formatear fecha
  formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}

export default PersonasService;