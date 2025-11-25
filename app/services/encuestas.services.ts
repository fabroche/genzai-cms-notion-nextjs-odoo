/**
 * Servicio CRUD para la base de datos de Personas en Notion
 */

import "server-only";
import {notionClient} from '@/app/libs/notion';

import type {NotionDataSourceQueryParams, NotionFilter, NotionPage, PaginationOptions} from '@/app/types/notion';
import {OdooSurveyN8N, SurveyProperties} from "@/app/types/encuestas.types";
import {PageObjectResponse, PartialPageObjectResponse} from "@notionhq/client";

// ID del data source de Personas en Notion
const ENCUESTAS_DATASOURCE_ID = process.env.NOTION_FORMULARIOS_DATASOURCE_ID ?? '';

// Convierte input de creacion a propiedades de Notion
function createInputToNotionProperties(input: OdooSurveyN8N) {

    const properties = new Map();

    const utilsHashMap = {
        addRishText: (value: string) => {
            return {
                rich_text: [
                    {
                        text: {
                            content: value
                        }
                    }
                ],
            }
        },
        addTitle: (value: string) => {
            return {
                title: [
                    {
                        text: {
                            content: value
                        }
                    }
                ],
            }
        },
        addNumber: (value: number) => {
            return {
                number: value,
            }
        },
        addCheckbox: (value: boolean) => {
            return {
                checkbox: value,
            }
        },
        addDate: (value: string) => {
            return {
                date: {
                    start: value
                }
            }
        },
        addUrl: (value: string) => {
            return {
                url: value
            }
        },
        addSelect: (value: string) => {
            return {
                select: {
                    name: value
                }
            }
        }
    }

    Object.keys(input).forEach((key) => {
        switch (key) {
            case 'id':
                properties.set(key, utilsHashMap.addNumber(input.id));
                break;
            case 'title':
                properties.set(key, utilsHashMap.addTitle(input.title));
                break;
            case 'display_name':
                properties.set(key, utilsHashMap.addRishText(input.display_name));
                break;
            case 'description':
                properties.set(key, utilsHashMap.addRishText(input.description));
                break;
            case 'active':
                properties.set(properties, utilsHashMap.addCheckbox(input.active));
                break;
            case 'question_and_page_ids':
                properties.set(key, utilsHashMap.addRishText(input.question_and_page_ids.toString()));
                break;
            case 'answer_duration_avg':
                properties.set(key, utilsHashMap.addNumber(input.answer_duration_avg));
                break;
            case 'is_time_limited':
                properties.set(key, utilsHashMap.addCheckbox(input.is_time_limited));
                break;
            case 'time_limit':
                properties.set(key, utilsHashMap.addNumber(input.time_limit));
                break;
            case 'session_link':
                properties.set(key, utilsHashMap.addUrl(input.session_link));
                break;
            case 'create_date':
                properties.set(key, utilsHashMap.addDate(input.create_date));
                break;
            case 'create_uid':
                properties.set(key, utilsHashMap.addRishText(input.create_uid.toString()));
                break;
            case 'survey_type':
                properties.set(key, utilsHashMap.addSelect(input.survey_type));
                break;
            default:
                break;
        }
    });

    return properties;
}

// Convierte input de actualizacion a propiedades de Notion
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

export class EncuestasService {

    private static instance: EncuestasService;

    private readonly mapperUtils = {
        richText: (value: string) => ({
            rich_text: [{ text: { content: value } }],
        }),
        title: (value: string) => ({
            title: [{ text: { content: value } }],
        }),
        number: (value: number) => ({ number: value }),
        checkbox: (value: boolean) => ({ checkbox: value }),
        date: (value: string) => ({ date: { start: value } }),
        url: (value: string) => ({ url: value }),
        select: (value: string) => ({ select: { name: value } }),
    };

    private constructor() {}

    public static getInstance(): EncuestasService {
        if (!EncuestasService.instance) {
            EncuestasService.instance = new EncuestasService();
        }
        return EncuestasService.instance;
    }

    mapToNotionProperties(input: OdooSurveyN8N): Record<string, any> {
        return {
            id: this.mapperUtils.number(input.id),
            title: this.mapperUtils.title(input.title),
            display_name: this.mapperUtils.richText(input.display_name),
            description: this.mapperUtils.richText(input.description),
            active: this.mapperUtils.checkbox(input.active),
            question_and_page_ids: this.mapperUtils.richText(input.question_and_page_ids.toString()),
            answer_duration_avg: this.mapperUtils.number(input.answer_duration_avg),
            is_time_limited: this.mapperUtils.checkbox(input.is_time_limited),
            time_limit: this.mapperUtils.number(input.time_limit),
            session_link: this.mapperUtils.url(input.session_link),
            create_date: this.mapperUtils.date(input.create_date),
            create_uid: this.mapperUtils.richText(input.create_uid.toString()),
            survey_type: this.mapperUtils.select(input.survey_type),
        };
    }

    async create(input: OdooSurveyN8N): Promise<PageObjectResponse | PartialPageObjectResponse> {
        const properties = this.mapToNotionProperties(input);

        const page = await notionClient.pages.create({
            parent: {data_source_id: ENCUESTAS_DATASOURCE_ID},
            properties,
        });

        return page;
    }

    async createOrUpdate(input: OdooSurveyN8N): Promise<PageObjectResponse | PartialPageObjectResponse> {
        // Buscar si existe un registro con el mismo ID de Odoo
        const queryParams: NotionDataSourceQueryParams = {
            data_source_id: ENCUESTAS_DATASOURCE_ID,
            filter: {
                property: 'id',
                number: {
                    equals: input.id
                }
            }
        };

        const response = await notionClient.dataSources.query(queryParams);

        // Si existe, actualizar el primer resultado encontrado
        if (response.results && response.results.length > 0) {
            const existingPage = response.results[0] as PageObjectResponse;
            const properties = this.mapToNotionProperties(input);

            const updatedPage = await notionClient.pages.update({
                page_id: existingPage.id,
                properties,
            });

            return updatedPage;
        }

        // Si no existe, crear uno nuevo
        return await this.create(input);
    }

    async getById(encuestaId: string): Promise<any> {
        const page = await notionClient.pages.retrieve({page_id: personaId});
        return page;
    }

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

    async update(input): Promise<any> {
        const {id, ...rest} = input;
        const properties = updateInputToNotionProperties({id, ...rest});

        const page = await notionClient.pages.update({
            page_id: id,
            properties,
        });

        return page;
    }

    async delete(encuestaId: string): Promise<void> {
        await notionClient.pages.update({
            page_id: encuestaId,
            archived: true,
        });
    }

    async restore(encuestaId: string): Promise<any> {
        const page = await notionClient.pages.update({
            page_id: encuestaId,
            archived: false,
        });

        return page;
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