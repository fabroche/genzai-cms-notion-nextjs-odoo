import { Card } from './Card';
import type { Persona } from '../../types/personas.types';
import styles from './CardList.module.css';

interface CardListProps {
  personas: Persona[];
}

export function CardList({ personas }: CardListProps) {
  if (!personas || personas.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No se encontraron personas</p>
      </div>
    );
  }

  return (
    <div className={styles.cardList}>
      <div className={styles.grid}>
        {personas.map((persona) => (
          <Card key={persona.id} persona={persona} />
        ))}
      </div>
    </div>
  );
}