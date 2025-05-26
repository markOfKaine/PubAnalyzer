import { usePDFContext } from "@/contexts/PDFContext";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function EditNotePanel() {
  const {
    highlightTapped,
    updateHighlightComment,
    selectedHighlight,
    highlights,
    addHighlight,
  } = usePDFContext();
  const [text, setText] = useState(selectedHighlight?.comment.text || "");

  useEffect(() => {
    if (selectedHighlight) {
      setText(selectedHighlight.comment.text);
    }
  }, [selectedHighlight]);

  function handleNoteConfirm(noteData) {
    console.log("TW - saving note edit", selectedHighlight.id);

    const highlightExists = highlights.some(
      (h) => h.id === selectedHighlight.id
    );

    if (!highlightExists) {
      addHighlight({
        ...selectedHighlight,
        comment: noteData,
      });
    } else {
      updateHighlightComment(
        selectedHighlight.id,
        selectedHighlight.position,
        selectedHighlight.content,
        noteData
      );
    }

    highlightTapped(null);
  }

  if (!selectedHighlight) {
    return <></>;
  }

  return (
    <div className="flex flex-col w-full h-full p-4">
      <form>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="notes" className="text-sm">
              Notes:
            </Label>
            <Textarea
              id="notes"
              placeholder="Enter any notes here..."
              className="w-full min-h-30"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>
      </form>
      <div className="flex justify-end items-end mt-4 space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="w-1/6"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            highlightTapped(null);
          }}
        >
          Cancel
        </Button>
        <Button
          variant="default"
          size="sm"
          className="bg-primary text-background w-1/6"
          disabled={!text}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleNoteConfirm({ text, emoji: "💬" });
          }}>
          Save
        </Button>
      </div>
    </div>
  );
}

export default EditNotePanel;
