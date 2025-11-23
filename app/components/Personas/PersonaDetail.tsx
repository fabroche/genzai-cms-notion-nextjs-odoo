import type { Persona } from '../../types/personas.types';
import styles from './PersonaDetail.module.css';

interface PersonaDetailProps {
  persona: Persona;
}

export function PersonaDetail({ persona }: PersonaDetailProps) {
  const fullName = [
    persona.nombre,
    persona.nombre2,
    persona.apellido1,
    persona.apellido2,
  ]
    .filter(Boolean)
    .join(' ');

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const hasRelations =
    (persona.proyectoIds && persona.proyectoIds.length > 0) ||
    (persona.tareasIds && persona.tareasIds.length > 0) ||
    (persona.rolesIds && persona.rolesIds.length > 0);

  return (
    <div className={styles.container}>
      {/* Header con avatar y nombre */}
      <div className={styles.header}>
        <div className={styles.avatar}>
          {persona.avatar && persona.avatar.length > 0 ? (
            <img src={persona.avatar[0]} alt={fullName} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className={styles.headerInfo}>
          <h1 className={styles.name}>{fullName}</h1>
          {persona.email && (
            <p className={styles.email}>
              <svg
                className={styles.emailIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {persona.email}
            </p>
          )}
        </div>
      </div>

      {/* Información de contacto */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Información de Contacto</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Teléfono</span>
            <span className={styles.infoValue}>
              {persona.contacto || 'No especificado'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Email</span>
            <span className={styles.infoValue}>
              {persona.email || 'No especificado'}
            </span>
          </div>
        </div>
      </div>

      {/* Información personal */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Información Personal</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Fecha de Nacimiento</span>
            <span className={styles.infoValue}>
              {formatDate(persona.birthdate)}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Fecha de Inicio</span>
            <span className={styles.infoValue}>
              {formatDate(persona.startingDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Relaciones */}
      {hasRelations && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Relaciones</h2>
          <div className={styles.relationsList}>
            {persona.rolesIds && persona.rolesIds.length > 0 && (
              <div className={styles.relationItem}>
                <span className={styles.relationType}>Roles Asignados</span>
                <span className={styles.relationCount}>
                  {persona.rolesIds.length}
                </span>
              </div>
            )}
            {persona.proyectoIds && persona.proyectoIds.length > 0 && (
              <div className={styles.relationItem}>
                <span className={styles.relationType}>Proyectos</span>
                <span className={styles.relationCount}>
                  {persona.proyectoIds.length}
                </span>
              </div>
            )}
            {persona.tareasIds && persona.tareasIds.length > 0 && (
              <div className={styles.relationItem}>
                <span className={styles.relationType}>Tareas Asignadas</span>
                <span className={styles.relationCount}>
                  {persona.tareasIds.length}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Metadatos */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Metadatos</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Creado</span>
            <span className={styles.infoValue}>
              {formatDate(persona.createdTime)}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Última modificación</span>
            <span className={styles.infoValue}>
              {formatDate(persona.lastEditedTime)}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>ID en Notion</span>
            <span className={styles.infoValue} style={{ fontSize: '0.75rem' }}>
              {persona.id}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}