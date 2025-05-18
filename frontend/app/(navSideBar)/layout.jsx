import "../globals.css";
import { cookies } from "next/headers";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-side-bar";
import { SidebarInset } from "@/components/ui/sidebar";
import ProtectedRoute from "@/contexts/ProtectedRoute";

export const metadata = {
  title: "PubAnalyzer",
  description: "Analyze PubMed articles",
};

export default async function Layout({ children }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background font-roboto">
        <SidebarProvider defaultOpen={defaultOpen}>
          <div className="flex flex-1 min-h-screen">
            <AppSidebar />
            <div className="flex-1 overflow-auto">
              <SidebarInset className="w-full h-full bg-background">
                {children}
              </SidebarInset>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </ProtectedRoute>
  );
}
