import { NextResponse } from 'next/server';
import { PersonasService } from '@/app/services/personas.service';

// Desactivar cache en API routes para siempre traer datos frescos
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const personasService = new PersonasService();
    const { personas } = await personasService.list();

    return NextResponse.json({ personas });
  } catch (error) {
    console.error('Error fetching personas:', error);
    return NextResponse.json(
      { error: 'Error fetching personas' },
      { status: 500 }
    );
  }
}
