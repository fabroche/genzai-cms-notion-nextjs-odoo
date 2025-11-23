/**
 * Helpers para transformar datos entre Notion y la aplicaci�n
 */
import type {NotionFile, NotionRelation, NotionRichText, NotionTitle,} from '@/app/types/notion';


// Extrae texto plano de un array de rich_text
function extractRichText(richText: NotionRichText[]): string {
    if (!richText || richText.length === 0) return '';
    return richText.map((rt) => rt.plain_text).join('');
}

// Extrae el t�tulo de una propiedad title
function extractTitle(title: NotionTitle[]): string {
    if (!title || title.length === 0) return '';
    return title.map((t) => t.plain_text).join('');
}

// Extrae IDs de una relaci�n
function extractRelationIds(relation: NotionRelation[]): string[] {
    if (!relation || relation.length === 0) return [];
    return relation.map((r) => r.id);
}

// Extrae URLs de archivos
function extractFileUrls(files: NotionFile[]): string[] {
    if (!files || files.length === 0) return [];
    return files.map((f) => f.url || f.file?.url || f.external?.url).filter((url): url is string => Boolean(url));
}

export {
    extractRichText,
    extractTitle,
    extractRelationIds,
    extractFileUrls,
}