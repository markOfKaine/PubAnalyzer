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

import PDFSiderBarHeader from "@/components/PDFSideBarHeader";


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
              <PDFSiderBarHeader className="gap-3.5 border-b p-4"/>
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
  );
}

export default DocumentViewerPage;
