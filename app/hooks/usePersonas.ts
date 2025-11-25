'use client';

import useSWR from 'swr';
import type { Persona } from '@/app/types/personas.types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function usePersonas() {
  const { data, error, isLoading, mutate } = useSWR<{ personas: Persona[] }>(
    '/api/personas',
    fetcher,
    {
      refreshInterval: 1000, // Polling cada 5 segundos
      revalidateOnFocus: true, // Revalidar cuando la ventana obtiene foco
      revalidateOnReconnect: true, // Revalidar al reconectar
      dedupingInterval: 2000, // Evitar duplicados en 2 segundos
    }
  );

  return {
    personas: data?.personas ?? [],
    isLoading,
    isError: error,
    mutate, // Para forzar revalidación manual
  };
}

export function usePersona(id: string) {
  const { data, error, isLoading, mutate } = useSWR<{ persona: Persona }>(
    id ? `/api/personas/${id}` : null,
    fetcher,
    {
      refreshInterval: 1000, // Polling cada 5 segundos
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    }
  );

  return {
    persona: data?.persona,
    isLoading,
    isError: error,
    mutate,
  };
}
