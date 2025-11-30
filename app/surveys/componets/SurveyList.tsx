import {SurveysService} from '@/app/services/encuestas.services';
import {OdooSurveyN8N, SurveyPage, SurveyProperties} from "@/app/types/encuestas.types";
import {SurveyCard} from "@/app/surveys/componets/SurveyCard";
import styles from "@/app/surveys/componets/SurveyList.module.css"

export default async function SurveyList() {

    const surveysService = SurveysService.getInstance();

    const {results} = await surveysService.getNotionSurveysPages();

    return (<div className={styles.SurveyList}>
        {
            results.map((survey) => {
                const mappedSurvey = surveysService.mapFromNotionPage(survey as SurveyPage);

                return (
                    <SurveyCard key={mappedSurvey.id} survey={mappedSurvey} surveyPageId={survey.id}/>
                )
            })
        }
    </div>)
}