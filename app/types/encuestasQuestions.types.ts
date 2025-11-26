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
  TitleProperty,
  RelationProperty
} from "@/app/types/notion";
import { OdooSurveyN8NQuestion } from "@/app/types/encuestas.types";

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

// Re-exportar tipos de Odoo para facilitar importaciones
export type { OdooSurveyN8NQuestion } from "@/app/types/encuestas.types";
export type { CreateOdooSurveyN8NQuestion } from "@/app/types/encuestas.types";
export type { UpdateOdooSurveyN8NQuestion } from "@/app/types/encuestas.types";