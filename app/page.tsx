import { PersonasService } from "@/app/services/personas.service";
import { CardList } from "@/app/components/Personas/CardList";
import styles from './page.module.css';

export default async function Home() {
  const personasService = new PersonasService();
  const { personas } = await personasService.list();

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Personas</h1>
        <p className={styles.subtitle}>
          {personas.length} {personas.length === 1 ? 'persona' : 'personas'} registradas
        </p>
      </header>

      <div className={styles.content}>
        <CardList personas={personas} />
      </div>
    </main>
  );
}
