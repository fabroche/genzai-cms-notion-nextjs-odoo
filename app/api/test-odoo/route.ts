import {NextResponse} from 'next/server';
import {CreateOdooSurveyN8N, OdooSurveyN8N, UpdateOdooSurveyN8N} from '@/app/types/encuestas.types';

import {SurveysQuestionsService} from "@/app/services/encuestasQuestions.services";

import {SurveysService} from "@/app/services/encuestas.services";
import {OdooSurveyN8NQuestion, UpdateOdooSurveyN8NQuestion} from "@/app/types/encuestasQuestions.types";

// Desactivar cache en API routes para siempre traer datos frescos
export const dynamic = 'force-dynamic';
export const revalidate = 0;
const encuestasService = SurveysService.getInstance();
const encuestasQuestionsService = SurveysQuestionsService.getInstance();

/**
 * GET /api/test-odoo
 * Endpoint de prueba para verificar la conexión con Odoo usando JSON-RPC con API Key
 */
export async function GET() {
    try {
        console.log('🔍 Buscando encuestas en Odoo...');

        const surveyChanges: UpdateOdooSurveyN8N = {
            title: "📝 Formulario de Información Esencial del Negocio Actualizado",
            display_name: "📝 Formulario de Información Esencial del Negocio Actualizado X2",
            description: "Esto lo actualice desde NextJS",
            active: true,
            question_and_page_ids: [
                91,
                87,
                88,
                89,
                90
            ],
            answer_duration_avg: 0.01138888888888889,
            is_time_limited: false,
            time_limit: 10,
            session_link: "http://odoo.genzai.cloud/s/3834",
            create_date: "2025-11-23 19:36:10"
        }

        const surveyC: OdooSurveyN8N = {
            id: 159,
            create_uid: [1, "admin"],
            survey_type: "survey",
            title: "📝 Formulario de Información Esencial del Negocio Actualizado",
            display_name: "📝 Formulario de Información Esencial del Negocio Actualizado X2",
            description: "Esto lo actualice desde NextJS",
            active: true,
            question_and_page_ids: [
                91,
                87,
                88,
                89,
                90
            ],
            answer_duration_avg: 0.01138888888888889,
            is_time_limited: false,
            time_limit: 10,
            session_link: "http://odoo.genzai.cloud/s/3834",
            create_date: "2025-11-23 19:36:10"
        }


        const newSurvey: CreateOdooSurveyN8N = {
            title: "Survey Created from NextJS",
            display_name: "Survey Created from NextJS",
            description: "Esto lo cree desde NextJS",
            survey_type: "survey",
        }

        const newSurveyQuestion: UpdateOdooSurveyN8NQuestion = {
            id: 1,
            title: "Survey Question Created from NextJS Updated",
            description: "Survey Question Created from NextJS",
            question_placeholder: "Survey Question Created from NextJS",
            survey_id: [1, "Feedback Form"],
        }



        const surveysQuestionsOdoo = await encuestasQuestionsService.getOdooSurveyQuestions();

        const promisesSurveysQuestions = surveysQuestionsOdoo.map(async (survey: OdooSurveyN8NQuestion) => {

            return await encuestasQuestionsService.createOrUpdateNotionSurveyQuestion(survey)
        })

        const surveys = await Promise.all(promisesSurveysQuestions);


        // const surveysOdoo = await encuestasService.getOdooSurveys();
        //
        // const promisesSurveys = surveysOdoo.map(async (survey: OdooSurveyN8N) => {
        //
        //     return await encuestasService.createOrUpdateNotionSurvey(survey)
        // })
        //
        // const surveys = await Promise.all(promisesSurveys);

        // const surveys = await encuestasService.getById("2b6a78e4-d4fc-8139-a648-eb338b03292a");

        // const surveys = await encuestasService.createNotionSurvey(surveyC);

        // const surveys = await fetchOdooSurveyById("1");
        // const surveys = await createOdooSurvey(newSurvey);
        // const surveys = await updateOdooSurveyById(surveyChanges);

        // const surveys = await fetchOdooSurveysQuestions();
        // const surveys = await fetchFilteredOdooSurveysQuestionsBySurveyId({survey_id: "8"});
        // const surveys = await fetchOdooSurveyQuestionById("69");
        // const surveys = await createOdooSurveyQuestion(newSurveyQuestion);
        // const surveys = await updateOdooSurveyQuestion(newSurveyQuestion);

        console.log("surveys", surveys);
        // console.log("results", results);

        console.log(`✅ Se encontraron ${surveys.length} encuestas`);

        return NextResponse.json({
            success: true,
            message: 'Conexión exitosa con Odoo usando JSON-RPC + API Key',
            surveys: {
                count: surveys.length,
                data: surveys
            }
        });

    } catch (error) {
        console.error('❌ Error en test de Odoo:', error);

        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

        return NextResponse.json(
            {
                success: false,
                error: errorMessage,
                details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
                hint: 'Verifica la configuración en .env.local: ODOO_URL, ODOO_DB, ODOO_USERNAME, ODOO_API_KEY'
            },
            {status: 500}
        );
    }
}
