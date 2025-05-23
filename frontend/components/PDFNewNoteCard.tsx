import { ScaledPosition, Content } from "react-pdf-highlighter";
import { usePDFContext } from "@/contexts/PDFContext";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import ButtonGroup from "@/components/ButtonGroup"
import PDFManualNote from "@/components/PDFManualNote"
import PDFAINote from "@/components/PDFAINote"
import Image from "next/image";

export interface NewNoteCardProps {
  position: ScaledPosition;
  content: Content;
}

function PDFNewNoteCard({
  position,
  content,
  transformSelection,
  hideTipAndSelection,
  onClose,
}) {
  const { addHighlight, addAIHighlight } = usePDFContext();
  const [isAiModeSelected, setIsAiModeSelected] = useState(false);
  const [activeOption, setActiveOption] = useState(0);
  
    useEffect(() => {
      console.log("TW - PDFNewNoteCard useEffect");
        transformSelection();
    }, [transformSelection]);

  const handleSelect = (index) => {
    setActiveOption(index);
    setIsAiModeSelected(index === 1);
    console.log("Selected option:", index);
    console.log("isAiModeSelected:", isAiModeSelected);
  };

  function onNoteConfirm({ title, text, emoji }) {
    return (e) => {
      e.preventDefault();
      addHighlight({
        content,
        position,
        comment: {
          title: title || "No Title",
          text: text || "No comment",
          emoji: "💬",
        },
      });
      onClose();
      console.log({ title, text, emoji });
    };
  }

  function onAINoteConfirm({ title, text, emoji }) {
    return (e) => {
      console.log("TW - PDFNewNoteCard onAINoteConfirm");
      e.preventDefault();
      addAIHighlight({
        content,
        position,
        comment: {
          title: title || "No Title",
          text: text || "No comment",
          emoji: "💬",
        },
      });
      onClose();
    };
  }

  function onCancel() {
    return (e) => {
        e.preventDefault();
        onClose()
    }
  }

  return (
    <div className="flex flex-col items-center">
      <>{console.log("TW - PDFNewNoteCard content", content)}</>
      <div className="mb-2 flex justify-center w-full">
        <ButtonGroup
          options={[
            {
              image: <PenLine size={16} />,
              text: "Note",
            },
            {
              image: (
                <Image
                  src="/pubby.png"
                  alt="Pubby Logo"
                  width={30}
                  height={30}
                />
              ),
              text: "Ask AI",
            },
          ]}
          activeIndex={activeOption}
          onSelect={handleSelect}
        />
      </div>
      <div className="bg-background p-4 rounded-lg shadow-md border-t border-l border-r w-full">
        {/* MARK: TW - This will display a preview of the highlight in the 'add new note' card*/}
        {/* <div className="bg-accent/50 p-3 rounded-md border">
          {content.text ? (
            <blockquote className="mt-2 pl-2 border-l-2 border-accent-foreground text-sm">
              {`${content.text.slice(0, 200).trim()}`}
              <>{console.log("TW - PDFNewNoteCard text", content.text)}</>
            </blockquote>
          ) : null}
          {content.image ? (
            <blockquote className="mt-2 pl-2 border-l-2 border-accent-foreground text-sm flex items-center">
              <Image size={16} />
              <span className="ml-2">Selected Area/Image</span>
              <>{console.log("TW - PDFNewNoteCard image", content.image)}</>
            </blockquote>
          ) : null}
        </div> */}
        <div>
          {isAiModeSelected && activeOption === 1 ? (
            <PDFAINote content={content} onAINoteConfirm={onAINoteConfirm} onCancel={onCancel} />
          ) : (
            <PDFManualNote onNoteConfirm={onNoteConfirm} onCancel={onCancel} />
          )}
        </div>
      </div>
    </div>
  );
}

export default PDFNewNoteCard;
