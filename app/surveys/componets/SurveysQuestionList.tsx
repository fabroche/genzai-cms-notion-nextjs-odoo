import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {SurveysQuestionsService} from "@/app/services/encuestasQuestions.services"
import {SurveyQuestionPage} from "@/app/types/encuestasQuestions.types";

interface SurveysQuestionList {
    surveyId: string;
}

export default async function SurveysQuestionList({surveyId}: SurveysQuestionList) {


    const surveysQuestionsService = SurveysQuestionsService.getInstance();

    const {results} = await surveysQuestionsService.queryNotionSurveyQuestionPages({
        survey_id: surveyId
    });

    const fields = {
        title: "Title",
        description: "Description",
        session_available: "Session Available",
        is_time_limited: "Is Time Limited",
        time_limit: "Time Limit",
        create_date: "Create Date",
    }

    const tableHeaders = Object.values(fields);

    if (!results) {
        return (
            <div>No questions found for this survey</div>
        )
    }

    return (
        <Table>
            <TableCaption>All Questions in this survey.</TableCaption>
            <TableHeader>
                <TableRow>
                    {tableHeaders.map((header) => {
                        return (
                            <TableHead key={header} className="w-[100px]">{header}</TableHead>
                        )
                    })
                    }
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    results.map((question) => {
                        const mappedQuestion = surveysQuestionsService.mapFromNotionPage(question as SurveyQuestionPage);

                        return (
                            <TableRow key={question.id}>
                                <TableCell className="font-medium">{mappedQuestion.title}</TableCell>
                                <TableCell>{mappedQuestion.description === "false" ? "" : mappedQuestion.description}</TableCell>
                                <TableCell>{mappedQuestion.session_available ? "Yes" : "No"}</TableCell>
                                <TableCell>{mappedQuestion.is_time_limited ? "Yes" : "No"}</TableCell>
                                <TableCell>{mappedQuestion.time_limit}</TableCell>
                                <TableCell>{mappedQuestion.create_date}</TableCell>
                            </TableRow>
                        )
                    })
                }
            </TableBody>
        </Table>
    );
}