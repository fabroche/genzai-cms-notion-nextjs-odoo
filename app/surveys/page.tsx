import SurveysClient from './componets/SurveysClient';
import {SurveysService} from '@/app/services/encuestas.services';
import SurveyList from "@/app/surveys/componets/SurveyList";
import styles from "@/app/surveys/componets/SurveyList.module.css";
import {SurveyPage} from "@/app/types/encuestas.types";
import {SurveyCard} from "@/app/surveys/componets/SurveyCard";

export const dynamic = 'force-dynamic';

export default async function SurveysPage() {
    const surveysService = SurveysService.getInstance();

    const {results} = await surveysService.getNotionSurveysPages();

    return <SurveyList>
        <div className={styles.SurveyList}>
            {
                results.map((survey) => {
                    const mappedSurvey = surveysService.mapFromNotionPage(survey as SurveyPage);

                    return (
                        <SurveyCard key={mappedSurvey.id} survey={mappedSurvey} surveyPageId={survey.id}/>
                    )
                })
            }
        </div>
    </SurveyList>
}