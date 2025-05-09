import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function PDFManualNote({ onNoteConfirm, onCancel }) {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  
  return (
    <>
      <form>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="title" className="text-sm">
              Title:
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Title here..."
              className="w-full"
              value={title}
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="notes" className="text-sm">
              Notes:
            </Label>
            <Textarea
              id="notes"
              placeholder="Notes here..."
              className="w-full"
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
          onClick={onNoteConfirm({ title, text, emoji: "💬" })}
        >
          Save
        </Button>
      </div>
    </>
  );
}

export default PDFManualNote;