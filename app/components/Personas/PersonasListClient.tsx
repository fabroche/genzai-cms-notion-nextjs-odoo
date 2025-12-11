'use client';

import { usePersonas } from '@/app/hooks/usePersonas';
import { CardList } from './CardList';
import styles from './PersonasListClient.module.css';

export function PersonasListClient() {
  const { personas, isLoading, isError } = usePersonas();

  if (isError) {
    return (
      <div className={styles.error}>
        <p>Error al cargar las personas. Reintentando...</p>
      </div>
    );
  }

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>Personas</h1>
        <p className={styles.subtitle}>
          {isLoading ? (
            <span className={styles.loading}>Cargando...</span>
          ) : (
            <>
              {personas.length} {personas.length === 1 ? 'persona' : 'personas'} registradas
            </>
          )}
        </p>
        {/*<div className={styles.autoRefresh}>*/}
        {/*  <span className={styles.dot}></span>*/}
        {/*  <span>Actualización automática cada 5s</span>*/}
        {/*</div>*/}
      </header>

      <div className={styles.content}>
        <CardList personas={personas} />
      </div>
    </>
  );
}
