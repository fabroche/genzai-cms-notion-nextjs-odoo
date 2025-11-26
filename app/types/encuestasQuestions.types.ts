/**
 * Tipos para Preguntas de Encuestas - Notion
 */
import {
  CheckboxProperty,
  DateProperty,
  NotionPage,
  NumberProperty,
  RichTextProperty,
  SelectProperty,
  TitleProperty
} from "@/app/types/notion";
import {OdooSurveyN8N, surveyType} from "@/app/types/encuestas.types";

// Notion Properties para Survey Questions
export interface SurveyQuestionProperties {
  id: NumberProperty;
  title: TitleProperty;
  description: RichTextProperty;
  question_placeholder: RichTextProperty;
  survey_id: RichTextProperty;
  session_available: CheckboxProperty;
  is_page: CheckboxProperty;
  question_ids: RichTextProperty;
  is_time_limited: CheckboxProperty;
  time_limit: NumberProperty;
  create_uid: RichTextProperty;
  create_date: DateProperty;
  survey_type: SelectProperty;
}

export type SurveyQuestionPage = NotionPage<SurveyQuestionProperties>;

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