import "@/app/globals.css";
import { cookies } from "next/headers";
import {
    SidebarProvider,
} from "@/components/ui/sidebar"

export const metadata = {
  title: "PubAnalyzer",
  description: "Analyze PubMed articles",
};

export default async function Layout({ children }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <div className="bg-background min-h-screen font-roboto">
        {/* Main page elements are the 'children' */}
        <SidebarProvider
          defaultOpen={defaultOpen}
          style={{
            "--sidebar-width": "40vw",
          }}
        >
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </SidebarProvider>
      </div>
  );
}
