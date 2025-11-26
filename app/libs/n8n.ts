import "server-only";
import {
    CreateOdooSurveyN8N,
    OdooSurveyN8N
} from "@/app/types/encuestas.types";
import {
    CreateOdooSurveyN8NQuestion,
    OdooSurveyN8NQuestion,
    UpdateOdooSurveyN8NQuestion
} from "@/app/types/encuestasQuestions.types";

const N8N_WEBHOOK_ODOO_SURVEYS = process.env.N8N_WEBHOOK_ODOO_SURVEYS ?? '';
const N8N_WEBHOOK_ODOO_SURVEY_QUESTION = process.env.N8N_WEBHOOK_ODOO_SURVEY_QUESTION ?? '';

// Surveys

export async function fetchOdooSurveys(): Promise<OdooSurveyN8N[]> {

    const response = await fetch(N8N_WEBHOOK_ODOO_SURVEYS);

    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
        throw new Error(`Odoo Error: ${data.error.data?.message || data.error.message}`);
    }

    // if (!data.result || !data.result.uid) {
    //     throw new Error('Autenticación fallida: No se recibió UID del usuario');
    // }

    return data;
}

export async function fetchOdooSurveyById(id: string): Promise<OdooSurveyN8N> {

    const response = await fetch(N8N_WEBHOOK_ODOO_SURVEYS, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id})
    });

    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
        throw new Error(`Odoo Error: ${data.error.data?.message || data.error.message}`);
    }

    // if (!data.result || !data.result.uid) {
    //     throw new Error('Autenticación fallida: No se recibió UID del usuario');
    // }

    return data[0];
}

export async function updateOdooSurveyById(changes: OdooSurveyN8N): Promise<OdooSurveyN8N> {

    const response = await fetch(N8N_WEBHOOK_ODOO_SURVEYS, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...changes})
    });

    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
        throw new Error(`Odoo Error: ${data.error.data?.message || data.error.message}`);
    }

    // if (!data.result || !data.result.uid) {
    //     throw new Error('Autenticación fallida: No se recibió UID del usuario');
    // }

    return data[0];
}

export async function createOdooSurvey(survey: CreateOdooSurveyN8N): Promise<OdooSurveyN8N> {

    const response = await fetch(N8N_WEBHOOK_ODOO_SURVEYS, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({survey})
    });

    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
        throw new Error(`Odoo Error: ${data.error.data?.message || data.error.message}`);
    }

    // if (!data.result || !data.result.uid) {
    //     throw new Error('Autenticación fallida: No se recibió UID del usuario');
    // }

    return data[0];
}

// Survey Questions

export async function fetchOdooSurveysQuestions(): Promise<OdooSurveyN8NQuestion[]> {

    const response = await fetch(N8N_WEBHOOK_ODOO_SURVEY_QUESTION);

    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
        throw new Error(`Odoo Error: ${data.error.data?.message || data.error.message}`);
    }

    return data;
}

export async function fetchFilteredOdooSurveysQuestionsBySurveyId({survey_id}: { survey_id: string }): Promise<OdooSurveyN8NQuestion[]> {

    const response = await fetch(N8N_WEBHOOK_ODOO_SURVEY_QUESTION, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},

        body: JSON.stringify({survey_id})
    });

    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
        throw new Error(`Odoo Error: ${data.error.data?.message || data.error.message}`);
    }

    // if (!data.result || !data.result.uid) {
    //     throw new Error('Autenticación fallida: No se recibió UID del usuario');
    // }

    return data;
}

export async function fetchOdooSurveyQuestionById(id: string): Promise<OdooSurveyN8NQuestion> {

    const response = await fetch(N8N_WEBHOOK_ODOO_SURVEY_QUESTION, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id})
    });

    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
        throw new Error(`Odoo Error: ${data.error.data?.message || data.error.message}`);
    }

    return data[0];
}

export async function createOdooSurveyQuestion(surveyQuestion: CreateOdooSurveyN8NQuestion): Promise<OdooSurveyN8NQuestion> {

    const response = await fetch(N8N_WEBHOOK_ODOO_SURVEY_QUESTION, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({surveyQuestion})
    });

    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
        throw new Error(`Odoo Error: ${data.error.data?.message || data.error.message}`);
    }

    return data[0];
}

export async function updateOdooSurveyQuestion(changes: UpdateOdooSurveyN8NQuestion): Promise<OdooSurveyN8NQuestion> {

    const response = await fetch(N8N_WEBHOOK_ODOO_SURVEY_QUESTION, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...changes})
    });

    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
        throw new Error(`Odoo Error: ${data.error.data?.message || data.error.message}`);
    }

    return data[0];
}
