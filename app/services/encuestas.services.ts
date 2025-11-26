/**
 * Servicio CRUD para la base de datos de Encuestas en Notion
 */

import "server-only";
import {notionClient} from '@/app/libs/notion';

import type {NotionDataSourceQueryParams, NotionFilter, PaginationOptions} from '@/app/types/notion';
import {CreateOdooSurveyN8N, OdooSurveyN8N} from "@/app/types/encuestas.types";
import {PageObjectResponse, PartialPageObjectResponse} from "@notionhq/client";
import {OdooSurveyN8NQuestion} from "@/app/types/encuestasQuestions.types";

// ID del data source de Encuestas en Notion
const ENCUESTAS_DATASOURCE_ID = process.env.NOTION_FORMULARIOS_DATASOURCE_ID ?? '';
// URL del webhook de N8N para Odoo
const N8N_WEBHOOK_ODOO_SURVEYS = process.env.N8N_WEBHOOK_ODOO_SURVEYS ?? '';

export class SurveysService {

    private static instance: SurveysService;

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

    public static getInstance(): SurveysService {
        if (!SurveysService.instance) {
            SurveysService.instance = new SurveysService();
        }
        return SurveysService.instance;
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

    async createNotionSurvey(input: OdooSurveyN8N): Promise<PageObjectResponse | PartialPageObjectResponse> {
        const properties = this.mapToNotionProperties(input);

        const page = await notionClient.pages.create({
            parent: {data_source_id: ENCUESTAS_DATASOURCE_ID},
            properties,
        });

        return page;
    }

    async createOrUpdateNotionSurvey(input: OdooSurveyN8N): Promise<PageObjectResponse | PartialPageObjectResponse> {
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
        return await this.createNotionSurvey(input);
    }

    async getNotionPageById(pageId: string): Promise<PageObjectResponse | PartialPageObjectResponse> {
        const page = await notionClient.pages.retrieve({
            page_id: pageId,
        });
        return page;
    }

    async getNotionSurveysPages(options?: PaginationOptions): Promise<{
        results: Array<PageObjectResponse | PartialPageObjectResponse>;
        has_more: boolean;
        next_cursor?: string;
    }> {
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
        };
    }

    async queryNotionSurveyPages(
        filters?: NotionFilter,
        options?: PaginationOptions
    ): Promise<{
        results: Array<PageObjectResponse | PartialPageObjectResponse>;
        hasMore: boolean;
        nextCursor?: string;
    }> {
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
            results: response.results ?? [],
            hasMore: response.has_more,
            nextCursor: response.next_cursor || undefined,
        };
    }

    async updateNotionSurveyPage(notionPageId: string, input: OdooSurveyN8N): Promise<PageObjectResponse | PartialPageObjectResponse> {
        const properties = this.mapToNotionProperties(input);

        const page = await notionClient.pages.update({
            page_id: notionPageId,
            properties,
        });

        return page;
    }

    async deleteNotionSurveyPage(notionPageId: string): Promise<void> {
        await notionClient.pages.update({
            page_id: notionPageId,
            archived: true,
        });
    }

    async restoreNotionSurveyPage(encuestaId: string): Promise<PageObjectResponse | PartialPageObjectResponse> {
        const page = await notionClient.pages.update({
            page_id: encuestaId,
            archived: false,
        });

        return page;
    }

    async syncNotionDatabaseWithOdoo() {
        const surveyN8NS = await this.getOdooSurveys();

        const promisesSurveysQuestions = surveyN8NS.map(async (survey: OdooSurveyN8N) => {

            return await this.createOrUpdateNotionSurvey(survey)
        })

        const surveys = await Promise.all(promisesSurveysQuestions);

        return surveys
    }

    async getOdooSurveys(): Promise<OdooSurveyN8N[]> {

        const response = await fetch(N8N_WEBHOOK_ODOO_SURVEYS);

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(`Odoo Error: ${data.error.data?.message || data.error.message}`);
        }

        return data;
    }

    async getOdooSurveyById(id: string): Promise<OdooSurveyN8N> {

        const response = await fetch(N8N_WEBHOOK_ODOO_SURVEYS, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id})
        });

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(`Odoo Error: ${data.error.data?.message || data.error.message}`);
        }

        return data[0];
    }

    async updateOdooSurveyById(changes: OdooSurveyN8N): Promise<OdooSurveyN8N> {

        const response = await fetch(N8N_WEBHOOK_ODOO_SURVEYS, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({...changes})
        });

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(`Odoo Error: ${data.error.data?.message || data.error.message}`);
        }

        return data[0];
    }

    async createOdooSurvey(survey: CreateOdooSurveyN8N): Promise<OdooSurveyN8N> {

        const response = await fetch(N8N_WEBHOOK_ODOO_SURVEYS, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({survey})
        });

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(`Odoo Error: ${data.error.data?.message || data.error.message}`);
        }

        // if (!data.result || !data.result.uid) {
        //     throw new Error('Autenticación fallida: No se recibió UID del usuario');
        // }

        return data[0];
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