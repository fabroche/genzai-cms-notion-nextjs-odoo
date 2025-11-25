/**
 * Tipos para Odoo - Módulo de Encuestas
 */

export interface OdooSurveyN8N {
  id: number;
  title: string;
  display_name: string;
  description: string;
  active: boolean;
  question_and_page_ids: number[];
  answer_duration_avg: number;
  is_time_limited: boolean;
  time_limit: number;
  session_link: string;
  create_date: string;
  create_uid: [number, string];
  survey_type: surveyType;
}

export type surveyType = "survey" | "live_session" | "assessment" | "custom";

export type CreateOdooSurveyN8N = Pick<OdooSurveyN8N, 'title' | 'display_name' | 'description' | 'survey_type'>

export type UpdateOdooSurveyN8N = Partial<Omit<CreateOdooSurveyN8N, "id">>

export interface OdooSurveyN8NQuestion {
  id: number;
  title: string;
  description: string;
  question_placeholder: string;
  survey_id: [OdooSurveyN8N['id'], OdooSurveyN8N['display_name']];
  session_available: boolean;
  is_page: boolean;
  question_ids: number[];
  is_time_limited: boolean;
  time_limit: number;
  create_uid: [number, string];
  create_date: string;
  survey_type: surveyType;
}

export type CreateOdooSurveyN8NQuestion = Pick<OdooSurveyN8NQuestion, 'title' | 'description' | 'question_placeholder' | 'survey_id'>

export type UpdateOdooSurveyN8NQuestion = OdooSurveyN8NQuestion