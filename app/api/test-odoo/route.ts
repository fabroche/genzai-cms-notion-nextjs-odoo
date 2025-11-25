import {NextResponse} from 'next/server';
import {odooSearchRead} from '@/app/libs/odoo';
import {
    CreateOdooSurveyN8N,
    CreateOdooSurveyN8NQuestion,
    OdooSurvey,
    OdooSurveyN8N,
    UpdateOdooSurveyN8N, UpdateOdooSurveyN8NQuestion
} from '@/app/types/encuestas.types';
import {
    fetchOdooSurveys,
    fetchOdooSurveyById,
    updateOdooSurveyById,
    fetchFilteredOdooSurveysQuestions,
    fetchOdooSurveyQuestionById,
    createOdooSurvey,
    createOdooSurveyQuestion,
    fetchOdooSurveysQuestions,
    updateOdooSurveyQuestion
} from '@/app/libs/n8n';

// Desactivar cache en API routes para siempre traer datos frescos
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

        // const surveys = await fetchOdooSurveyById("8");
        // const surveys = await createOdooSurvey(newSurvey);
        // const surveys = await updateOdooSurveyById(surveyChanges);

        // const surveys = await fetchOdooSurveysQuestions();
        // const surveys = await fetchOdooSurveysQuestions({survey_id: "8"});
        // const surveys = await fetchOdooSurveyQuestionById("69");
        // const surveys = await createOdooSurveyQuestion(newSurveyQuestion);
        const surveys = await updateOdooSurveyQuestion(newSurveyQuestion);

        console.log(surveys)

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
