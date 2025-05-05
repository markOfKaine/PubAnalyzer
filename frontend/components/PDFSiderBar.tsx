import AIChatPanel from "@/components/AIChatPanel";
import AnnotationBar from "@/components/AnnotationBar";
import { usePDFContext } from "@/contexts/PDFContext";

function PDFSiderBar() {
  const { selectedHighlight } = usePDFContext();

  return (
    <>
      {selectedHighlight ? (
        <AIChatPanel highlight={selectedHighlight} />
      ) : (
        <AnnotationBar />
      )}
    </>
  );
}

export default PDFSiderBar;
