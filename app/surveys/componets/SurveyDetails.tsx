import {OdooSurveyN8N} from "@/app/types/encuestas.types";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/app/components/ui/card";
import {Badge} from "@/app/components/ui/badge";
import {Button} from "@/app/components/ui/button";
import {Separator} from "@/app/components/ui/separator";
import {
    Calendar,
    Clock,
    ExternalLink,
    FileText,
    Timer,
    User,
    CheckCircle2,
    XCircle
} from "lucide-react";
import SurveysQuestionList from "@/app/surveys/componets/SurveysQuestionList";
import Link from "next/link";

interface SurveyDetailsProps {
    survey: OdooSurveyN8N;
}

export function SurveyDetails({survey}: SurveyDetailsProps) {
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const typeConfig = getSurveyTypeBadge(survey.survey_type);

    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                    <h1 className="text-3xl font-bold tracking-tight break-words overflow-wrap-anywhere flex-1">{survey.title}</h1>
                    <div className="flex gap-2 flex-shrink-0">
                        <Badge variant={typeConfig.variant}>{typeConfig.label}</Badge>
                        {survey.active ? (
                            <Badge variant="default" className="bg-green-500 gap-1">
                                <CheckCircle2 className="h-3 w-3"/>
                                Activa
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="gap-1">
                                <XCircle className="h-3 w-3"/>
                                Inactiva
                            </Badge>
                        )}
                    </div>
                </div>
                {survey.display_name && survey.display_name !== survey.title && (
                    <p className="text-lg text-neutral-600 break-words">{survey.display_name}</p>
                )}
            </div>

            {/* Descripción */}
            {survey.description && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Descripción</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-neutral-700 whitespace-pre-line break-words overflow-wrap-anywhere">{survey.description}</p>
                    </CardContent>
                </Card>
            )}

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-neutral-100 rounded-lg">
                                <FileText className="h-5 w-5 text-neutral-700"/>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-500">Preguntas</p>
                                <p className="text-2xl font-bold">{survey.question_and_page_ids.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>


                {survey.answer_duration_avg > 0 && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-neutral-100 rounded-lg">
                                    <Clock className="h-5 w-5 text-neutral-700"/>
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500">Duración promedio</p>
                                    <p className="text-2xl font-bold">{formatDuration(survey.answer_duration_avg)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {survey.is_time_limited && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-neutral-100 rounded-lg">
                                    <Timer className="h-5 w-5 text-neutral-700"/>
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500">Límite de tiempo</p>
                                    <p className="text-2xl font-bold">{formatDuration(survey.time_limit)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Preguntas</CardTitle>
                </CardHeader>
                <CardContent>
                    <SurveysQuestionList surveyId={String(survey.id)}/>
                </CardContent>
            </Card>
            {/* Información adicional */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Información</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <Calendar className="h-4 w-4"/>
                            <span>Fecha de creación</span>
                        </div>
                        <span className="text-sm font-medium">{formatDate(survey.create_date)}</span>
                    </div>

                    <Separator/>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <User className="h-4 w-4"/>
                            <span>Creado por</span>
                        </div>
                        <span className="text-sm font-medium">{survey.create_uid[1]}</span>
                    </div>

                    {survey.session_link && (
                        <>
                            <Separator/>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-neutral-600">
                                    <ExternalLink className="h-4 w-4"/>
                                    <span>Enlace de sesión</span>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <a href={survey.session_link} target="_blank" rel="noopener noreferrer">
                                        Abrir
                                        <ExternalLink className="ml-2 h-4 w-4"/>
                                    </a>
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}