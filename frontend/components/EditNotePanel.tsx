import PDFManualNote from "@/components/PDFManualNote";
import { usePDFContext } from "@/contexts/PDFContext";
import { PubIHighlight, PubComment } from "@/contexts/PDFContext";

function EditNotePanel({highlight}: { highlight: PubIHighlight }) {
  const { highlightTapped, updateHighlightComment } = usePDFContext();

  function handleNoteConfirm(noteData) {
    return (e) => {
        console.log("TW - saving note edit", highlight.id)
      e.preventDefault();
      updateHighlightComment(
        highlight.id,
        {},
        { comment: noteData }
      );
      highlightTapped(null);
    };
  }

  function handleCancel() {
    return (e) => {
      e.preventDefault();
      highlightTapped(null);
    };
  }

  return (
    <div className="flex flex-col w-full h-full p-4">
      <PDFManualNote
        onNoteConfirm={handleNoteConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default EditNotePanel;
