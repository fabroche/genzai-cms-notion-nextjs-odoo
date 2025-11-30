import {SurveyDetails} from "@/app/surveys/componets/SurveyDetails";
import {SurveysService} from "@/app/services/encuestas.services";
import {notFound} from "next/navigation";
import {type SurveyPage} from "@/app/types/encuestas.types";

interface SurveyPageProps {
    params: {
        id: string;
    };
}

export default async function SurveyPage({params}: SurveyPageProps) {
    const surveysService = SurveysService.getInstance();

    try {
        const {id} = await params;

        const surveyPage = await surveysService.getNotionPageById(id);

        const survey = surveysService.mapFromNotionPage(surveyPage as SurveyPage);

        if (!survey) {
            notFound();
        }

        return (
            <div className="container mx-auto py-8 px-4">
                <SurveyDetails survey={survey}/>
            </div>
        );
    } catch (error) {
        console.error('Error al cargar la encuesta:', error);
        notFound();
    }
}