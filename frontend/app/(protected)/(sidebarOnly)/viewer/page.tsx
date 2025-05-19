"use client";

import AppSidebar from "@/components/app-side-bar";
import { usePMContext } from "@/contexts/PubMedContext";
import { FileX, Search, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import PDFViewer from "@/components/PDFViewer";

function DocumentViewerPage() {
  const { pdfURL } = usePMContext();
  const router = useRouter();

  const EmptyStateView = () => (
    <div className="flex h-full">
      <AppSidebar />
      <div className="flex flex-col items-center m-auto max-w-md text-center">
        <div className="rounded-full bg-muted p-6 mb-6">
          <FileX className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No PDF selected</h2>
        <p className="text-muted-foreground mb-6">
          Please select an article from the discovery page or enter a PMC ID to
          view its contents.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push("/discover");
            }}
            className="gap-2"
          >
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
    </div>
  );

  return (
    <>
      {pdfURL ? (
        <PDFViewer pdfURL={pdfURL} />
      ) : (
        <EmptyStateView />
      )}
    </>
  );
}

export default DocumentViewerPage;
