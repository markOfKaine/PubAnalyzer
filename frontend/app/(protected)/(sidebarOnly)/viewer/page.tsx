"use client";

import AppSidebar from "@/components/app-side-bar";
import DocumentViewer from "@/components/DocumentViewer";
import PDFSiderBar from "@/components/PDFSiderBar";
import {
  SidebarInset,
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { PDFProvider } from "@/contexts/PDFContext";
import { usePMContext } from "@/contexts/PubMedContext";
import PDFSiderBarHeader from "@/components/PDFSideBarHeader";
import { FileX, Search, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function DocumentViewerPage() {
  const { pdfUrl } = usePMContext();
  const router = useRouter();

  return (
    <div className="flex h-full">
      {pdfUrl ? (
        <PDFProvider initialUrl={pdfUrl}>
          <div>
            <div className="h-full">
              <Sidebar
                collapsible="icon"
                className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
              >
                <AppSidebar />
                <Sidebar collapsible="none" className="w-full h-full">
                  <PDFSiderBarHeader className="gap-3.5 border-b p-4" />
                  <SidebarContent className="flex-1">
                    <div className="h-full w-full">
                      <PDFSiderBar />
                    </div>
                  </SidebarContent>
                </Sidebar>
              </Sidebar>
            </div>

            <div className="flex flex-1 flex-col">
              <SidebarInset className="">
                <DocumentViewer />
              </SidebarInset>
            </div>
          </div>
        </PDFProvider>
      ) : (
        <div className="flex flex-col items-center m-auto max-w-md text-center">
          <div className="rounded-full bg-muted p-6 mb-6">
            <FileX className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            No PDF selected
          </h2>
          <p className="text-muted-foreground mb-6">
            Please select an article from the discovery page or enter a PMC ID to view its contents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" 
            onClick={(e) =>{ 
              e.preventDefault();
              e.stopPropagation();
              router.push("/discover")
            }} 
            className="gap-2">
              <Search className="h-4 w-4" />
              Find articles
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="gap-2"
            >
              <RotateCw className="h-4 w-4" />
              Reload page
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentViewerPage;
