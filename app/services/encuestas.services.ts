/**
 * Servicio CRUD para la base de datos de Personas en Notion
 */

import "server-only";
import {notionClient} from '../libs/notion';

import type {NotionDataSourceQueryParams, NotionFilter, PaginationOptions} from '@/app/types/notion';

// ID del data source de Personas en Notion
const ENCUESTAS_DATASOURCE_ID = process.env.NOTION_FORMULARIOS_DATASOURCE_ID ?? '';


// Convierte input de creacion a propiedades de Notion
function createInputToNotionProperties(input: any) {
    const properties = new Map();

    Object.keys(input).forEach((key, index) => {
        if (index === 0) {
            properties.set(input, {
                title: [
                    {
                        text: {content: input[key]},
                    },
                ],
            })
        }

        properties.set(key, {
            rich_text: [
                {
                    text: {content: input[key]},
                },
            ],
        })
    })

    return Object.fromEntries(properties.entries());
}

// Convierte input de actualizaci�n a propiedades de Notion
function updateInputToNotionProperties(input: any) {
    const properties = new Map();

    Object.keys(input).forEach((key) => {
        if (key.startsWith("00")) {
            properties.set(key, {
                title: [
                    {
                        text: {
                            content: input[key]
                        }
                    }
                ],
            })
        }

        properties.set(key, {
            rich_text: [
                {
                    text: {
                        content: input[key]
                    }
                }
            ],
        })
    });


    return Object.fromEntries(properties.entries());
}

/**
 * Servicio CRUD para Personas
 */
export class EncuestasService {
    /**
     * CREATE - Crear una nueva Encuesta
     */
    constructor() {
    }

    async create(input): Promise<any> {
        const properties = createInputToNotionProperties(input);

        const page = await notionClient.pages.create({
            parent: {data_source_id: ENCUESTAS_DATASOURCE_ID},
            properties,
        });

        return page;
    }

    /**
     * READ - Obtener una Encuesta por ID
     */
    async getById(encuestaId: string): Promise<any> {
        const page = await notionClient.pages.retrieve({page_id: personaId});
        return page;
    }

    /**
     * READ - Listar todas las personas con paginaci�n
     */
    async list(options?: PaginationOptions): any {
        const queryParams: NotionDataSourceQueryParams = {
            data_source_id: ENCUESTAS_DATASOURCE_ID,
        };

        if (options?.pageSize) {
            queryParams.page_size = options.pageSize;
        }

        if (options?.startCursor) {
            queryParams.start_cursor = options.startCursor;
        }

        const response = await notionClient.dataSources.query(queryParams);

        return {
            results: response.results ?? [],
            has_more: response.has_more,
            next_cursor: response.next_cursor || undefined,
        }
    }

    /**
     * QUERY - Buscar personas con filtros
     */
    async query(
        filters?: NotionFilter,
        options?: PaginationOptions
    ): Promise<any> {
        const queryParams: NotionDataSourceQueryParams = {
            data_source_id: ENCUESTAS_DATASOURCE_ID,
        };

        // Construir filtros de Notion
        if (filters) {
            const notionFilters: NotionFilter[] = [];

            Object.keys(filters).forEach((key) => {
                notionFilters.push({
                    property: key,
                    title: {contains: filters[key]},
                });

            })

            if (notionFilters.length > 0) {
                queryParams.filter =
                    notionFilters.length === 1
                        ? notionFilters[0]
                        : {and: notionFilters};
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
            personas: response.results ?? [],
            hasMore: response.has_more,
            nextCursor: response.next_cursor || undefined,
        };
    }

    /**
     * UPDATE - Actualizar una persona
     */
    async update(input): Promise<any> {
        const {id, ...rest} = input;
        const properties = updateInputToNotionProperties({id, ...rest});

        const page = await notionClient.pages.update({
            page_id: id,
            properties,
        });

        return page;
    }

    /**
     * DELETE - Archivar (eliminar) una persona
     */
    async delete(encuestaId: string): Promise<void> {
        await notionClient.pages.update({
            page_id: encuestaId,
            archived: true,
        });
    }

    /**
     * RESTORE - Restaurar una persona archivada
     */
    async restore(encuestaId: string): Promise<any> {
        const page = await notionClient.pages.update({
            page_id: encuestaId,
            archived: false,
        });

        return page;
    }

    /**
     * Utilidades adicionales
     */

    // Obtener el nombre completo de una persona
    // getFullName(persona: Persona): string {
    //     const parts = [
    //         persona.nombre,
    //         persona.nombre2,
    //         persona.apellido1,
    //         persona.apellido2,
    //     ].filter(Boolean);
    //     return parts.join(' ');
    // }

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

export default EncuestasService;