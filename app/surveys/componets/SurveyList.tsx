import {SurveysService} from '@/app/services/encuestas.services';
import {OdooSurveyN8N, SurveyPage, SurveyProperties} from "@/app/types/encuestas.types";
import {SurveyCard} from "@/app/surveys/componets/SurveyCard";
import styles from "@/app/surveys/componets/SurveyList.module.css"

export default async function SurveyList({children}: { children?: React.ReactNode }) {

    return <>
        {children}
    </>
}