/**
 * Tipos para Odoo - Módulo de Encuestas
 */
import {
  CheckboxProperty,
  DateProperty,
  NotionPage,
  NumberProperty,
  RichTextProperty,
  SelectProperty,
  TitleProperty,
  UrlProperty
} from "@/app/types/notion";

// N8N

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

export type CreateOdooSurveyN8N = Pick<OdooSurveyN8N, 'title' | 'display_name' | 'description' | 'survey_type'> | Partial<OdooSurveyN8N>

export type UpdateOdooSurveyN8N = Partial<Omit<CreateOdooSurveyN8N, "id">>

// Notion

export interface SurveyProperties {
  id: NumberProperty;
  title: TitleProperty;
  display_name: RichTextProperty;
  description: RichTextProperty;
  active: CheckboxProperty;
  question_and_page_ids: RichTextProperty;
  answer_duration_avg: NumberProperty;
  is_time_limited: CheckboxProperty;
  time_limit: NumberProperty;
  session_link: UrlProperty;
  create_date: DateProperty;
  create_uid: RichTextProperty;
  survey_type: SelectProperty;
}

export type SurveyPage = NotionPage<SurveyProperties>;