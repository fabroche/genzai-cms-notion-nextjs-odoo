import {AppSidebar} from "@/app/components/app-sidebar"
import {SidebarInset, SidebarProvider,} from "@/app/components/ui/sidebar"
import SurveyList from "@/app/surveys/componets/SurveyList";

export default function Page() {
    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                <SurveyList/>
            </SidebarInset>
        </SidebarProvider>
    )
}
