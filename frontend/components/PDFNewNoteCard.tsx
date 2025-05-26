import { usePDFContext } from "@/contexts/PDFContext";
import { useState, useEffect } from "react";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

function PDFNewNoteCard({
  position,
  content,
  transformSelection,
  hideTipAndSelection,
  onClose,
}) {
  const { addManualHighlight, addAIHighlight, selectedHighlight } = usePDFContext();
  const [activeOption, setActiveOption] = useState(-1);
  
  useEffect(() => {
    console.log("TW - PDFNewNoteCard useEffect");
      transformSelection();
  }, [transformSelection]);
  
  useEffect(() => {
    if (activeOption === -1) {
      return;
    }

    if (!selectedHighlight) {
      console.log(
        "TW - PDFNewNoteCard useEffect - selectedHighlight",
        selectedHighlight
      );
      setActiveOption(-1);
      hideTipAndSelection();
      onClose();
    }
  }, [selectedHighlight]);

  const handleSelect = (index) => {
    setActiveOption(index);
    if (index === 0) {
      addManualHighlight({
        content,
        position,
        comment: {
          text: "",
          emoji: "💬",
        },
        title: "New Note",
      });
    } else if (index === 1) {
      addAIHighlight({
        content,
        position,
        comment: {
          text: "",
          emoji: "💡",
        },
        chats: [],
        title: "New Chat",
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="flex rounded-lg border bg-background shadow-lg space-x-2"
      >
        <Button
          variant={activeOption === 0 ? "default" : "ghost"}
          className="rounded-lg"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSelect(0);
          }}
        >
          <div className="flex items-center justify-center space-x-2 w-24">
            <PenLine size={16} />
            <span>Note</span>
          </div>
        </Button>
        <Button
          variant={activeOption === 1 ? "default" : "ghost"}
          className="rounded-lg"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSelect(1);
          }}
        >
          <div className="flex items-center justify-center space-x-2 w-24">
            <Image src="/pubby.png" alt="Pubby Logo" width={24} height={24} />
            <span>Ask Pubby</span>
          </div>
        </Button>
      </div>
    </div>
  );
}

export default PDFNewNoteCard;
