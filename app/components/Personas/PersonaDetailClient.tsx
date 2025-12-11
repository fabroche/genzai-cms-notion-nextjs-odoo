'use client';

import { usePersona } from '@/app/hooks/usePersonas';
import { PersonaDetail } from './PersonaDetail';
import styles from './PersonaDetailClient.module.css';

interface PersonaDetailClientProps {
  id: string;
}

export function PersonaDetailClient({ id }: PersonaDetailClientProps) {
  const { persona, isLoading, isError } = usePersona(id);

  if (isError) {
    return (
      <div className={styles.error}>
        <p>Error al cargar la persona. Reintentando...</p>
      </div>
    );
  }

  if (isLoading || !persona) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <>
      {/*<div className={styles.autoRefresh}>*/}
      {/*  <span className={styles.dot}></span>*/}
      {/*  <span>Actualización automática cada 5s</span>*/}
      {/*</div>*/}
      <PersonaDetail persona={persona} />
    </>
  );
}
