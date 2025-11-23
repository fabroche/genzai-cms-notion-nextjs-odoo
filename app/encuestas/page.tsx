import { EncuestasService } from "@/app/services/encuestas.services";

import styles from './encuestas.module.css';

export default async function Encuestas() {
    const encuestasService = new EncuestasService();
    const {results} = await encuestasService.list();

    console.log(results.map(encuesta => encuesta.properties));

    return (
        <main className={styles.container}>
           <h1>Hola Hola!!!</h1>
        </main>
    );
}
