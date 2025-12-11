import "server-only";
import type {
  OdooContext,
  SearchReadParams,
} from '@/app/types/encuestas.types';

// Configuración de Odoo desde variables de entorno
const ODOO_URL = process.env.ODOO_URL ?? 'http://localhost:8069';
const ODOO_DB = process.env.ODOO_DB ?? '';
const ODOO_USERNAME = process.env.ODOO_USERNAME ?? '';
const ODOO_API_KEY = process.env.ODOO_API_KEY ?? '';

// Interfaces para JSON-RPC
interface JsonRpcRequest {
  jsonrpc: '2.0';
  method?: string;
  params: Record<string, unknown>;
  id?: number;
}

interface JsonRpcResponse<T> {
  jsonrpc: '2.0';
  id?: number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: {
      name?: string;
      debug?: string;
      message?: string;
      arguments?: unknown[];
    };
  };
}

/**
 * Autentica con Odoo usando API Key y retorna el UID del usuario
 * @returns UID del usuario autenticado
 * @throws Error si la autenticación falla
 */



/**
 * Ejecuta un método en Odoo usando JSON-RPC
 * @param model - Nombre del modelo
 * @param method - Método a ejecutar
 * @param args - Argumentos posicionales
 * @param kwargs - Argumentos nombrados
 * @returns Resultado del método
 */
async function executeKw<T = unknown>(
  model: string,
  method: string,
  args: unknown[] = [],
  kwargs: Record<string, unknown> = {}
): Promise<T> {
  const uid = await odooAuthenticate();

  const requestBody: JsonRpcRequest = {
    jsonrpc: '2.0',
    method: 'call',
    params: {
      service: 'object',
      method: 'execute_kw',
      args: [
        ODOO_DB,           // database
        uid,               // user id
        ODOO_API_KEY,      // password (API Key)
        model,             // model
        method,            // method
        args,              // args
        kwargs             // kwargs
      ]
    },
    id: Math.floor(Math.random() * 1000000)
  };

  const response = await fetch(`${ODOO_URL}/jsonrpc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
  }

  const data: JsonRpcResponse<T> = await response.json();

  if (data.error) {
    const errorMsg = data.error.data?.message || data.error.message;
    if (process.env.NODE_ENV === 'development' && data.error.data?.debug) {
      console.error('Odoo Debug:', data.error.data.debug);
    }
    throw new Error(`Odoo Error: ${errorMsg}`);
  }

  if (data.result === undefined) {
    throw new Error('No se recibió resultado de Odoo');
  }

  return data.result;
}

/**
 * Busca y lee registros en Odoo usando search_read
 * @param model - Nombre del modelo de Odoo (ej: 'survey.survey')
 * @param params - Parámetros de búsqueda
 * @returns Array de registros encontrados
 */
export async function odooSearchRead<T = unknown>(
  model: string,
  params: SearchReadParams = {}
): Promise<T[]> {
  const { domain = [], fields = [], limit, offset, order, context } = params;

  const kwargs: Record<string, unknown> = {
    fields,
    domain
  };

  if (limit !== undefined) kwargs.limit = limit;
  if (offset !== undefined) kwargs.offset = offset;
  if (order) kwargs.order = order;
  if (context) kwargs.context = context;

  return executeKw<T[]>(model, 'search_read', [], kwargs);
}

/**
 * Busca IDs de registros en Odoo
 * @param model - Nombre del modelo de Odoo
 * @param domain - Filtros de búsqueda
 * @param limit - Límite de registros
 * @param offset - Offset para paginación
 * @param order - Campo y orden para ordenar
 * @param context - Contexto adicional
 * @returns Array de IDs encontrados
 */
export async function odooSearch(
  model: string,
  domain: SearchReadParams['domain'] = [],
  limit?: number,
  offset?: number,
  order?: string,
  context?: OdooContext
): Promise<number[]> {
  const kwargs: Record<string, unknown> = {};

  if (limit !== undefined) kwargs.limit = limit;
  if (offset !== undefined) kwargs.offset = offset;
  if (order) kwargs.order = order;
  if (context) kwargs.context = context;

  return executeKw<number[]>(model, 'search', [domain], kwargs);
}

/**
 * Lee registros por sus IDs
 * @param model - Nombre del modelo de Odoo
 * @param ids - Array de IDs a leer
 * @param fields - Campos a retornar
 * @param context - Contexto adicional
 * @returns Array de registros
 */
export async function odooRead<T = unknown>(
  model: string,
  ids: number[],
  fields?: string[],
  context?: OdooContext
): Promise<T[]> {
  const kwargs: Record<string, unknown> = {};

  if (fields) kwargs.fields = fields;
  if (context) kwargs.context = context;

  return executeKw<T[]>(model, 'read', [ids], kwargs);
}

/**
 * Obtiene un solo registro por ID
 * @param model - Nombre del modelo de Odoo
 * @param id - ID del registro
 * @param fields - Campos a retornar
 * @param context - Contexto adicional
 * @returns El registro encontrado o null si no existe
 */
export async function odooGetById<T = unknown>(
  model: string,
  id: number,
  fields?: string[],
  context?: OdooContext
): Promise<T | null> {
  try {
    const records = await odooRead<T>(model, [id], fields, context);
    return records.length > 0 ? records[0] : null;
  } catch (error) {
    if (error instanceof Error && error.message.includes('does not exist')) {
      return null;
    }
    throw error;
  }
}

/**
 * Crea un nuevo registro
 * @param model - Nombre del modelo de Odoo
 * @param values - Valores para el nuevo registro
 * @param context - Contexto adicional
 * @returns ID del registro creado
 */
export async function odooCreate(
  model: string,
  values: Record<string, unknown>,
  context?: OdooContext
): Promise<number> {
  const kwargs: Record<string, unknown> = {};
  if (context) kwargs.context = context;

  return executeKw<number>(model, 'create', [values], kwargs);
}

/**
 * Actualiza registros existentes
 * @param model - Nombre del modelo de Odoo
 * @param ids - IDs de los registros a actualizar
 * @param values - Valores a actualizar
 * @param context - Contexto adicional
 * @returns true si la actualización fue exitosa
 */
export async function odooWrite(
  model: string,
  ids: number[],
  values: Record<string, unknown>,
  context?: OdooContext
): Promise<boolean> {
  const kwargs: Record<string, unknown> = {};
  if (context) kwargs.context = context;

  return executeKw<boolean>(model, 'write', [ids, values], kwargs);
}

/**
 * Elimina registros
 * @param model - Nombre del modelo de Odoo
 * @param ids - IDs de los registros a eliminar
 * @param context - Contexto adicional
 * @returns true si la eliminación fue exitosa
 */
export async function odooUnlink(
  model: string,
  ids: number[],
  context?: OdooContext
): Promise<boolean> {
  const kwargs: Record<string, unknown> = {};
  if (context) kwargs.context = context;

  return executeKw<boolean>(model, 'unlink', [ids], kwargs);
}

/**
 * Cuenta registros que coinciden con el dominio
 * @param model - Nombre del modelo
 * @param domain - Filtros de búsqueda
 * @param context - Contexto adicional
 * @returns Número de registros
 */
export async function odooSearchCount(
  model: string,
  domain: SearchReadParams['domain'] = [],
  context?: OdooContext
): Promise<number> {
  const kwargs: Record<string, unknown> = {};
  if (context) kwargs.context = context;

  return executeKw<number>(model, 'search_count', [domain], kwargs);
}
