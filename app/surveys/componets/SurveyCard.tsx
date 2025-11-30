import {OdooSurveyN8N, SurveyPage} from "@/app/types/encuestas.types";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/app/components/ui/card";
import {Badge} from "@/app/components/ui/badge";
import {Button} from "@/app/components/ui/button";
import {Clock, FileText, ExternalLink} from "lucide-react";
import styles from "./SurveyCard.module.css";
import Link from "next/link";


interface SurveyCardProps {
    survey: OdooSurveyN8N;
    surveyPageId: SurveyPage['id'];
}

export function SurveyCard({survey, surveyPageId}: SurveyCardProps) {
    const getSurveyTypeBadge = (type: string) => {
        const types: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
            survey: {label: "Encuesta", variant: "default"},
            live_session: {label: "Sesión en vivo", variant: "secondary"},
            assessment: {label: "Evaluación", variant: "outline"},
            custom: {label: "Personalizada", variant: "outline"}
        };
        return types[type] || types.survey;
    };

    const formatDuration = (seconds: number) => {
        const minutes = seconds / 60;
        if (minutes >= 1) {
            return `${minutes.toPrecision(2)} min`;
        }
        return `${seconds.toPrecision(2)} seg`;
    };

    const typeConfig = getSurveyTypeBadge(survey.survey_type);

    return (
        <Card className="hover:shadow-md transition-shadow w-full">
            <Link href={`/surveys/${surveyPageId}`}>
                <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-1">
                            <CardTitle className="text-lg line-clamp-1">{survey.title}</CardTitle>
                            <CardDescription
                                className="line-clamp-2 h-[40px] hover:h-[100px] transform: transition-all duration-300 ease-in-out">{survey.description}</CardDescription>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Badge variant={typeConfig.variant}>{typeConfig.label}</Badge>
                            {survey.active ? (
                                <Badge variant="default" className="bg-green-500">Activa</Badge>
                            ) : (
                                <Badge variant="secondary">Inactiva</Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between text-sm text-neutral-500">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <FileText className="h-4 w-4"/>
                                <span>{survey.question_and_page_ids.length} preguntas</span>
                            </div>
                            {survey.answer_duration_avg > 0 && (
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4"/>
                                    <span>{formatDuration(survey.answer_duration_avg)}</span>
                                </div>
                            )}
                        </div>
                        {survey.session_link && (
                            <Button variant="ghost" size="sm" asChild>
                                <a href={survey.session_link} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4"/>
                                </a>
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}