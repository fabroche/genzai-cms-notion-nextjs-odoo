import { PersonasListClient } from "@/app/components/Personas/PersonasListClient";
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.container}>
      <PersonasListClient />
    </main>
  );
}
