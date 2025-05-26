import AIChatPanel from "@/components/AIChatPanel";
import AnnotationBar from "@/components/AnnotationBar";
import EditNotePanel from "@/components/EditNotePanel";
import { usePDFContext } from "@/contexts/PDFContext";

function PDFSiderBar() {
  const { 
    showAIPanel, 
    showEditNote 
  } = usePDFContext();


  const getSideBarContent = () => {
    if (showAIPanel) {
      return <AIChatPanel />;
    } else if (showEditNote) {
      return <EditNotePanel />;
    } else {
      return <AnnotationBar />;
    }
  }

  return (
    <>
      {getSideBarContent()}
    </>
  );
}

export default PDFSiderBar;
