import type { Persona } from '../../types/personas.types';
import Link from 'next/link';
import styles from './Card.module.css';

interface CardProps {
  persona: Persona;
}

export function Card({ persona }: CardProps) {
  const fullName = [
    persona.nombre,
    persona.nombre2,
    persona.apellido1,
    persona.apellido2,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Link href={`/personas/${persona.id}`} className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.avatar}>
          {persona.avatar && persona.avatar.length > 0 ? (
            <img src={persona.avatar[0]} alt={fullName} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className={styles.cardInfo}>
          <h3 className={styles.cardName}>{fullName}</h3>
          {persona.email && (
            <p className={styles.cardEmail}>{persona.email}</p>
          )}
        </div>
      </div>

      {(persona.contacto || persona.birthdate || persona.startingDate) && (
        <div className={styles.cardDetails}>
          {persona.contacto && (
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Contacto:</span>
              <span className={styles.detailValue}>{persona.contacto}</span>
            </div>
          )}
          {persona.birthdate && (
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Fecha de nacimiento:</span>
              <span className={styles.detailValue}>
                {new Date(persona.birthdate).toLocaleDateString('es-ES')}
              </span>
            </div>
          )}
          {persona.startingDate && (
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Fecha de inicio:</span>
              <span className={styles.detailValue}>
                {new Date(persona.startingDate).toLocaleDateString('es-ES')}
              </span>
            </div>
          )}
        </div>
      )}

      {(persona.proyectoIds && persona.proyectoIds.length > 0) ||
      (persona.tareasIds && persona.tareasIds.length > 0) ||
      (persona.rolesIds && persona.rolesIds.length > 0) ? (
        <div className={styles.cardFooter}>
          {persona.rolesIds && persona.rolesIds.length > 0 && (
            <div className={styles.badgeGroup}>
              <span className={styles.badge}>{persona.rolesIds.length} Roles</span>
            </div>
          )}
          {persona.proyectoIds && persona.proyectoIds.length > 0 && (
            <div className={styles.badgeGroup}>
              <span className={styles.badge}>{persona.proyectoIds.length} Proyectos</span>
            </div>
          )}
          {persona.tareasIds && persona.tareasIds.length > 0 && (
            <div className={styles.badgeGroup}>
              <span className={styles.badge}>{persona.tareasIds.length} Tareas</span>
            </div>
          )}
        </div>
      ) : null}
    </Link>
  );
}