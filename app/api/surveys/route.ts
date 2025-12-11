import { NextRequest, NextResponse } from 'next/server';
import { SurveysService } from '@/app/services/encuestas.services';

export async function GET() {
  try {
    const surveysService = SurveysService.getInstance();
    const surveys = await surveysService.getOdooSurveys();

    return NextResponse.json(surveys);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al obtener las encuestas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const surveysService = SurveysService.getInstance();
    const body = await request.json();

    const newSurvey = await surveysService.createOdooSurvey(body);

    return NextResponse.json(newSurvey, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al crear la encuesta' },
      { status: 500 }
    );
  }
}