import AIChatPanel from "@/components/AIChatPanel";
import AnnotationBar from "@/components/AnnotationBar";
import EditNotePanel from "@/components/EditNotePanel";
import { usePDFContext } from "@/contexts/PDFContext";

function PDFSiderBar() {
  const { 
    selectedHighlight, 
    showAIPanel, 
    showEditNote 
  } = usePDFContext();


  const getSideBarContent = () => {
        if (selectedHighlight) {
          if (showAIPanel) {
            return <AIChatPanel highlight={selectedHighlight} />;
          } else if (showEditNote) {
            return <EditNotePanel highlight={selectedHighlight} />;
          }
        }
        
        return <AnnotationBar />;
  }

  return (
    <>
      {getSideBarContent()}
    </>
  );
}

export default PDFSiderBar;
