import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { usePDFContext } from "@/contexts/PDFContext";

function PDFManualNote({ onNoteConfirm, onCancel }) {
  const { selectedHighlight } = usePDFContext();
  const [text, setText] = useState(selectedHighlight?.text || "");

  useEffect(() => {
    if (selectedHighlight) {
      setText(selectedHighlight.text);
    }
  }, [selectedHighlight]);
  
  return (
    <>
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
        <Button variant="outline" size="sm" className="w-1/6" onClick={onCancel()}>
          Cancel
        </Button>
        <Button
          variant="default"
          size="sm"
          className="bg-primary text-background w-1/6"
          onClick={onNoteConfirm({ text, emoji: "💬" })}
        >
          Save
        </Button>
      </div>
    </>
  );
}

export default PDFManualNote;