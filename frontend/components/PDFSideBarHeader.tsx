import { SidebarHeader } from "@/components/ui/sidebar";
import { usePDFContext } from "@/contexts/PDFContext";
import AnnoCardCompact from "@/components/AnnoCardCompact";

function PDFSiderBarHeader({ className }: { className?: string }) {
  const { highlights, selectedHighlight } = usePDFContext();

  return (
    <SidebarHeader className={className}>
      <div className="flex w-full items-center justify-between">
        <div className="w-full text-base font-medium text-foreground">
          {/* TODO: TW - Update with documents name */}

          {selectedHighlight ? (
            <AnnoCardCompact highlight={selectedHighlight} />
          ) : (
            <>
              {" "}
              {highlights.length > 0 ? (
                <div>
                  <h2 className="text-lg font-semibold">Your Notes</h2>
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
