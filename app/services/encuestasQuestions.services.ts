/**
 * Servicio CRUD para la base de datos de Preguntas de Encuestas en Notion
 */

import "server-only";
import {notionClient} from '@/app/libs/notion';

import type {NotionDataSourceQueryParams, NotionFilter, PaginationOptions} from '@/app/types/notion';
import {PageObjectResponse, PartialPageObjectResponse} from "@notionhq/client";
import {
    CreateOdooSurveyN8NQuestion,
    OdooSurveyN8NQuestion,
    SurveyQuestionPage,
    UpdateOdooSurveyN8NQuestion
} from "@/app/types/encuestasQuestions.types";
import {surveyType} from "@/app/types/encuestas.types";

// ID del data source de Preguntas de Encuestas en Notion
const SURVEY_QUESTIONS_DATASOURCE_ID = process.env.NOTION_SURVEY_QUESTIONS_DATASOURCE_ID ?? '';
// URL del webhook de N8N para Odoo Survey Questions
const N8N_WEBHOOK_ODOO_SURVEY_QUESTIONS = process.env.N8N_WEBHOOK_ODOO_SURVEY_QUESTION ?? '';

export class SurveysQuestionsService {

    private static instance: SurveysQuestionsService;

    private readonly mapperUtils = {
        richText: (value: string) => ({
            rich_text: [{text: {content: value}}],
        }),
        title: (value: string) => ({
            title: [{text: {content: value}}],
        }),
        number: (value: number) => ({number: value}),
        checkbox: (value: boolean) => ({checkbox: value}),
        date: (value: string) => ({date: {start: value}}),
        url: (value: string) => ({url: value}),
        select: (value: string) => ({select: {name: value}}),
    };

    private readonly extractorUtils = {
        richText: (property: any): string => {
            if (!property?.rich_text || property.rich_text.length === 0) return '';
            return property.rich_text.map((rt: any) => rt.plain_text || '').join('');
        },
        title: (property: any): string => {
            if (!property?.title || property.title.length === 0) return '';
            return property.title.map((t: any) => t.plain_text || '').join('');
        },
        number: (property: any): number => {
            return property?.number ?? 0;
        },
        checkbox: (property: any): boolean => {
            return property?.checkbox ?? false;
        },
        date: (property: any): string => {
            return property?.date?.start ?? '';
        },
        url: (property: any): string => {
            return property?.url ?? '';
        },
        select: (property: any): string => {
            return property?.select?.name ?? '';
        },
    };

    private constructor() {
    }

    public static getInstance(): SurveysQuestionsService {
        if (!SurveysQuestionsService.instance) {
            SurveysQuestionsService.instance = new SurveysQuestionsService();
        }
        return SurveysQuestionsService.instance;
    }

    mapToNotionProperties(input: OdooSurveyN8NQuestion): Record<string, any> {
        return {
            id: this.mapperUtils.number(input.id),
            title: this.mapperUtils.title(this.stripHtml(input.title)),
            description: this.mapperUtils.richText(this.stripHtml(input.description)),
            question_placeholder: this.mapperUtils.richText(this.stripHtml(input.question_placeholder)),
            survey_id: this.mapperUtils.richText(`${input.survey_id[0]} - ${input.survey_id[1]}`),
            session_available: this.mapperUtils.checkbox(input.session_available),
            is_page: this.mapperUtils.checkbox(input.is_page),
            question_ids: this.mapperUtils.richText(input.question_ids.toString()),
            is_time_limited: this.mapperUtils.checkbox(input.is_time_limited),
            time_limit: this.mapperUtils.number(input.time_limit),
            create_uid: this.mapperUtils.richText(input.create_uid.toString()),
            create_date: this.mapperUtils.date(input.create_date),
            survey_type: this.mapperUtils.select(input.survey_type),
        };
    }

    mapFromNotionPage(page: SurveyQuestionPage | PageObjectResponse): OdooSurveyN8NQuestion {
        const props = (page as SurveyQuestionPage).properties;

        // Parsear survey_id de string a tupla [number, string]
        const surveyIdStr = this.extractorUtils.richText(props.survey_id);
        let surveyId: [number, string] = [0, ''];
        if (surveyIdStr) {
            const match = surveyIdStr.match(/^(\d+)\s*-\s*(.+)$/);
            if (match) {
                surveyId = [parseInt(match[1]), match[2].trim()];
            }
        }

        // Parsear question_ids de string a array de números
        const questionIdsStr = this.extractorUtils.richText(props.question_ids);
        const questionIds = questionIdsStr
            ? questionIdsStr.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
            : [];

        // Parsear create_uid de string a tupla [number, string]
        const createUidStr = this.extractorUtils.richText(props.create_uid);
        let createUid: [number, string] = [0, ''];
        if (createUidStr) {
            try {
                const parsed = JSON.parse(createUidStr);
                if (Array.isArray(parsed) && parsed.length === 2) {
                    createUid = [parsed[0], parsed[1]];
                }
            } catch {
                // Si falla el parseo JSON, intentar extraer del formato string
                const match = createUidStr.match(/(\d+),\s*(.+)/);
                if (match) {
                    createUid = [parseInt(match[1]), match[2]];
                }
            }
        }

        return {
            id: this.extractorUtils.number(props.id),
            title: this.extractorUtils.title(props.title),
            description: this.extractorUtils.richText(props.description),
            question_placeholder: this.extractorUtils.richText(props.question_placeholder),
            survey_id: surveyId,
            session_available: this.extractorUtils.checkbox(props.session_available),
            is_page: this.extractorUtils.checkbox(props.is_page),
            question_ids: questionIds,
            is_time_limited: this.extractorUtils.checkbox(props.is_time_limited),
            time_limit: this.extractorUtils.number(props.time_limit),
            create_uid: createUid,
            create_date: this.extractorUtils.date(props.create_date),
            survey_type: this.extractorUtils.select(props.survey_type) as surveyType,
        };
    }

    // ========================================
    // MÉTODOS CRUD PARA NOTION
    // ========================================

    async createNotionSurveyQuestion(input: OdooSurveyN8NQuestion): Promise<PageObjectResponse | PartialPageObjectResponse> {
        const properties = this.mapToNotionProperties(input);

        const page = await notionClient.pages.create({
            parent: {data_source_id: SURVEY_QUESTIONS_DATASOURCE_ID},
            properties,
        });

        return page;
    }

    async createOrUpdateNotionSurveyQuestion(input: OdooSurveyN8NQuestion): Promise<PageObjectResponse | PartialPageObjectResponse> {
        // Buscar si existe un registro con el mismo ID de Odoo
        const queryParams: NotionDataSourceQueryParams = {
            data_source_id: SURVEY_QUESTIONS_DATASOURCE_ID,
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
        return await this.createNotionSurveyQuestion(input);
    }

    async getNotionPageById(pageId: string): Promise<PageObjectResponse | PartialPageObjectResponse> {
        const page = await notionClient.pages.retrieve({
            page_id: pageId,
        });
        return page;
    }

    async getNotionSurveyQuestionsPages(options?: PaginationOptions): Promise<{
        results: Array<PageObjectResponse | PartialPageObjectResponse>;
        has_more: boolean;
        next_cursor?: string;
    }> {
        const queryParams: NotionDataSourceQueryParams = {
            data_source_id: SURVEY_QUESTIONS_DATASOURCE_ID,
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

    async queryNotionSurveyQuestionPages(
        filters?: NotionFilter,
        options?: PaginationOptions
    ): Promise<{
        results: Array<PageObjectResponse | PartialPageObjectResponse>;
        hasMore: boolean;
        nextCursor?: string;
    }> {
        const queryParams: NotionDataSourceQueryParams = {
            data_source_id: SURVEY_QUESTIONS_DATASOURCE_ID,
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

    async updateNotionSurveyQuestionPage(notionPageId: string, input: OdooSurveyN8NQuestion): Promise<PageObjectResponse | PartialPageObjectResponse> {
        const properties = this.mapToNotionProperties(input);

        const page = await notionClient.pages.update({
            page_id: notionPageId,
            properties,
        });

        return page;
    }

    async deleteNotionSurveyQuestionPage(notionPageId: string): Promise<void> {
        await notionClient.pages.update({
            page_id: notionPageId,
            archived: true,
        });
    }

    async restoreNotionSurveyQuestionPage(notionPageId: string): Promise<PageObjectResponse | PartialPageObjectResponse> {
        const page = await notionClient.pages.update({
            page_id: notionPageId,
            archived: false,
        });

        return page;
    }

    // ========================================
    // MÉTODOS PARA GESTIÓN CON ODOO/N8N
    // ========================================

    async getOdooSurveyQuestions(): Promise<OdooSurveyN8NQuestion[]> {

        const response = await fetch(N8N_WEBHOOK_ODOO_SURVEY_QUESTIONS);

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(`Odoo Error: ${data.error.data?.message || data.error.message}`);
        }

        return data;
    }

    async getOdooSurveyQuestionsBySurveyId(surveyId: string): Promise<OdooSurveyN8NQuestion[]> {

        const response = await fetch(N8N_WEBHOOK_ODOO_SURVEY_QUESTIONS, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({survey_id: surveyId})
        });

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(`Odoo Error: ${data.error.data?.message || data.error.message}`);
        }

        return data;
    }

    async getOdooSurveyQuestionById(id: string): Promise<OdooSurveyN8NQuestion> {

        const response = await fetch(N8N_WEBHOOK_ODOO_SURVEY_QUESTIONS, {
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

    async updateOdooSurveyQuestionById(changes: UpdateOdooSurveyN8NQuestion): Promise<OdooSurveyN8NQuestion> {

        const response = await fetch(N8N_WEBHOOK_ODOO_SURVEY_QUESTIONS, {
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

    async createOdooSurveyQuestion(surveyQuestion: CreateOdooSurveyN8NQuestion): Promise<OdooSurveyN8NQuestion> {

        const response = await fetch(N8N_WEBHOOK_ODOO_SURVEY_QUESTIONS, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({surveyQuestion})
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

    async syncNotionDatabaseWithOdoo() {
        const surveysQuestionsOdoo = await this.getOdooSurveyQuestions();

        const promisesSurveysQuestions = surveysQuestionsOdoo.map(async (survey: OdooSurveyN8NQuestion) => {

            return await this.createOrUpdateNotionSurveyQuestion(survey)
        })

        const surveys = await Promise.all(promisesSurveysQuestions);

        return surveys
    }

    // ========================================
    // MÉTODOS AUXILIARES
    // ========================================

    // Convertir HTML a texto plano
    stripHtml(text: string): string {
        if (!text) return '';

        // Reemplazar <br> y </div> con saltos de línea
        let clean = text.replace(/<br\s*\/?>/gi, '\n');
        clean = clean.replace(/<\/div>/gi, '\n');

        // Eliminar todas las demás etiquetas HTML
        clean = clean.replace(/<[^>]*>/g, '');

        // Decodificar entidades HTML básicas
        clean = clean.replace(/&nbsp;/g, ' ');
        clean = clean.replace(/&amp;/g, '&');
        clean = clean.replace(/&lt;/g, '<');
        clean = clean.replace(/&gt;/g, '>');
        clean = clean.replace(/&quot;/g, '"');

        // Limpiar líneas vacías múltiples
        clean = clean.replace(/\n\s*\n\s*\n/g, '\n\n');

        return clean.trim();
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