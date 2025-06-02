import { SidebarHeader } from "@/components/ui/sidebar";
import { usePDFContext } from "@/contexts/PDFContext";
import AnnoCardCompact from "@/components/AnnoCardCompact";
import { usePMContext } from "@/contexts/PubMedContext";

function PDFSiderBarHeader({ className }: { className?: string }) {
  const { 
    highlights, 
    selectedHighlight, 
    showAIPanel, 
    showEditNote} = usePDFContext();

    const { selectedArticle } = usePMContext();

  return (
    <SidebarHeader className={className}>
      <div className="flex w-full items-center justify-between">
        <div className="w-full text-base font-medium text-foreground">
          {selectedHighlight && (showAIPanel || showEditNote) ? (
            <AnnoCardCompact highlight={selectedHighlight} />
          ) : (
            <>
              {" "}
              {highlights.length > 0 ? (
                <div>
                    <h2 className="text-lg font-semibold">
                    {selectedArticle?.title
                      ? `${selectedArticle.title.slice(0, 40)}${selectedArticle.title.length > 40 ? "..." : ""}`
                      : "Your Notes"}
                    </h2>
                  <p className="text-sm text-muted-foreground">
                    {highlights.length}{" "}
                    {highlights.length === 1 ? "note" : "notes"}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-lg font-semibold">Your Notes</h2>
                  <p className="text-sm text-muted-foreground">
                    New notes will appear here...
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* TODO: TW - Can add searching of annotations here */}
      {/* <SidebarInput className="" placeholder="Type to search..." /> */}
    </SidebarHeader>
  );
}

export default PDFSiderBarHeader;
