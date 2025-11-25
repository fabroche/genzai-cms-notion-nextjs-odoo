import { NextResponse } from 'next/server';
import { PersonasService } from '@/app/services/personas.service';

// Desactivar cache en API routes para siempre traer datos frescos
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const personasService = new PersonasService();
    const persona = await personasService.getById(id);

    return NextResponse.json({ persona });
  } catch (error) {
    console.error('Error fetching persona:', error);
    return NextResponse.json(
      { error: 'Error fetching persona' },
      { status: 500 }
    );
  }
}
