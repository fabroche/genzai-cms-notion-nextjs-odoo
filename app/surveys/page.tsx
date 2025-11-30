import SurveysClient from './componets/SurveysClient';
import { SurveysService } from '@/app/services/encuestas.services';
import SurveyList from "@/app/surveys/componets/SurveyList";

export const dynamic = 'force-dynamic';

export default async function SurveysPage() {

  return <SurveyList/>;
}