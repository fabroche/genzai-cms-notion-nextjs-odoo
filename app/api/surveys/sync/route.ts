import {NextRequest, NextResponse} from 'next/server';
import {SurveysService} from '@/app/services/encuestas.services';
import {SurveysQuestionsService} from '@/app/services/encuestasQuestions.services';

export async function POST(request: NextRequest) {
    try {
        const surveysService = SurveysService.getInstance();
        const questionsService = SurveysQuestionsService.getInstance();

        // Sincronizar las encuestas
        const surveys = await surveysService.syncNotionDatabaseWithOdoo();

        // Sincronizar las preguntas de las encuestas
        const questions = await questionsService.syncNotionDatabaseWithOdoo();

        return NextResponse.json({
            message: 'Sincronización completada',
            results: {
                surveys,
                questions
            },
        });
    } catch (error: any) {
        return NextResponse.json(
            {error: error.message || 'Error al sincronizar'},
            {status: 500}
        );
    }
}