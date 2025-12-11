import { NextRequest, NextResponse } from 'next/server';
import { SurveysService } from '@/app/services/encuestas.services';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const surveysService = SurveysService.getInstance();
    const survey = await surveysService.getOdooSurveyById(params.id);

    return NextResponse.json(survey);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al obtener la encuesta' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const surveysService = SurveysService.getInstance();
    const body = await request.json();

    const updatedSurvey = await surveysService.updateOdooSurveyById({
      ...body,
      id: parseInt(params.id),
    });

    return NextResponse.json(updatedSurvey);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al actualizar la encuesta' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const surveysService = SurveysService.getInstance();

    // Buscar la página de Notion correspondiente para archivarla
    const notionPages = await surveysService.queryNotionSurveyPages({
      id: params.id,
    });

    if (notionPages.results.length > 0) {
      await surveysService.deleteNotionSurveyPage(notionPages.results[0].id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al eliminar la encuesta' },
      { status: 500 }
    );
  }
}