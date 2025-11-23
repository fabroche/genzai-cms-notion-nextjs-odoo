import { PersonasService } from "@/app/services/personas.service";
import { PersonaDetail } from "@/app/components/Personas/PersonaDetail";
import Link from "next/link";
import styles from './page.module.css';

interface PersonaPageProps {
  params: {
    id: string;
  };
}

export default async function PersonaPage({ params }: PersonaPageProps) {
  const personasService = new PersonasService();
  const { id } = await params;
  const persona = await personasService.getById(id);

  return (
    <main className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.backButtonContainer}>
          <Link href="/" className={styles.backButton}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 12L6 8L10 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Volver a la lista
          </Link>
        </div>

        <PersonaDetail persona={persona} />
      </div>
    </main>
  );
}