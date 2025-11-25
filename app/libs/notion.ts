import "server-only";
import {cache} from "react";
import {Client} from "@notionhq/client";
import {PersonaPage, PersonaWithRelations, NotionPage} from "@/app/types/notion";

// Revalidar cada 60 segundos (ISR)
export const revalidate = process.env.CACHE_MAX_AGE ?? 5;

const notionSecret = process.env.NOTION_SECRET ?? "";

export const notionClient = new Client({
    auth: notionSecret,
});

export const getDatabase = async (dataSourceId: string, property = "nombre"): Promise<PersonaPage[]> => {

    if (!notionSecret || !dataSourceId) {
        throw new Error("NOTION_SECRET or DATASOURCE_ID is not defined");
    }

    const {results} = await notionClient.dataSources.query({
        data_source_id: dataSourceId,
        filter: {
            property: property,
            title: {
                equals: "Frank"
            }
        },
    });

    return results as PersonaPage[];
};

// Función helper para obtener páginas por sus IDs
export const getPagesByIds = async (pageIds: string[]): Promise<NotionPage[]> => {
    if (pageIds.length === 0) return [];

    const pages = await Promise.all(
        pageIds.map(async (id) => {
            try {
                const page = await notionClient.pages.retrieve({ page_id: id });
                return page as NotionPage;
            } catch (error) {
                console.error(`Error fetching page ${id}:`, error);
                return null;
            }
        })
    );

    return pages.filter((page): page is NotionPage => page !== null);
};

// Función para expandir las relaciones de una persona
export const expandPersonaRelations = async (persona: PersonaPage): Promise<PersonaWithRelations> => {
    const [proyectos, tareas, roles] = await Promise.all([
        getPagesByIds(persona.properties.Proyecto.relation.map(r => r.id)),
        getPagesByIds(persona.properties.Tareas.relation.map(r => r.id)),
        getPagesByIds(persona.properties.Roles.relation.map(r => r.id)),
    ]);

    return {
        ...persona,
        properties: {
            ...persona.properties,
            Proyecto: {
                ...persona.properties.Proyecto,
                expanded: proyectos,
            },
            Tareas: {
                ...persona.properties.Tareas,
                expanded: tareas,
            },
            Roles: {
                ...persona.properties.Roles,
                expanded: roles,
            },
        },
    };
};

// Función cacheada con React.cache para deduplación dentro del mismo request
export const fetchPersonas = cache(async (): Promise<PersonaPage[]> => {
    const PERSONAS_DATASOURCE_ID = process.env.NOTION_PERSONAS_DATASOURCE_ID;

    if (!PERSONAS_DATASOURCE_ID) {
        throw new Error("NOTION_PERSONAS_DATASOURCE_ID is not defined");
    }

    const personas = await getDatabase(PERSONAS_DATASOURCE_ID, "nombre");

    return personas;
});

// Nueva función para obtener personas con relaciones expandidas (también cacheada)
export const fetchPersonasWithRelations = cache(async (): Promise<PersonaWithRelations[]> => {
    const personas = await fetchPersonas();

    return await Promise.all(
        personas.map(persona => expandPersonaRelations(persona))
    );
});

// Cachear también getPageById para evitar llamadas duplicadas
export const getPageById = cache(async (pageId: string): Promise<NotionPage | null> => {
    try {
        const page = await notionClient.pages.retrieve({ page_id: pageId });
        return page as NotionPage;
    } catch (error) {
        console.error(`Error fetching page ${pageId}:`, error);
        return null;
    }
});