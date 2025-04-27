"use client";
import AnnotationBar from "@/components/AnnotationBar";
import AppSidebar from "@/components/app-side-bar";
import DocumentViewer from "@/components/DocumentViewer";
import {
  SidebarInset,
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { PDFProvider } from "@/contexts/PDFContext";


function DocumentViewerPage({ pdfUrl = "https://arxiv.org/pdf/1708.08021" }) {
  return (
    <PDFProvider initialUrl={pdfUrl}>
      <div className="flex h-full">
        <div className="h-full">
          <Sidebar
            collapsible="icon"
            className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
          >
            <AppSidebar />
            <Sidebar collapsible="none" className="w-full h-full">
              <SidebarHeader className="gap-3.5 border-b p-4">
                <div className="flex w-full items-center justify-between">
                  <div className="text-base font-medium text-foreground">
                    {/* TODO: TW - Update with documents name */}
                    Document Name Here...
                  </div>
                </div>
                {/* TODO: TW - Can add searchinf of annotations here */}
                {/* <SidebarInput className="" placeholder="Type to search..." /> */}
              </SidebarHeader>
              <SidebarContent className="flex-1">
                <div className="h-full w-full">
                  <AnnotationBar />
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
  );
}

export default DocumentViewerPage;
