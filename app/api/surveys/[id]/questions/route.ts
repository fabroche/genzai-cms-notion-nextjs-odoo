import { NextRequest, NextResponse } from 'next/server';
import { SurveysQuestionsService } from '@/app/services/encuestasQuestions.services';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const questionsService = SurveysQuestionsService.getInstance();
    const questions = await questionsService.getOdooSurveyQuestionsBySurveyId(params.id);

    return NextResponse.json(questions);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al obtener las preguntas' },
      { status: 500 }
    );
  }
}