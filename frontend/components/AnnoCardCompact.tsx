import { usePDFContext } from "@/contexts/PDFContext";
import { useLLMContext } from "@/contexts/LLMContext";
import { useState } from "react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Calendar, ChevronDown } from "lucide-react"
import Image from "next/image";

function AnnoCardCompact({ highlight }) {
  const { highlightTapped } = usePDFContext();
  const { setMessages } = useLLMContext();
  const [open, setOpen] = useState(false);

  const isAIHighlight = highlight?.chats !== undefined;

  function handleBack(e) {
    e.stopPropagation();
    highlightTapped(null);
    setMessages([]);
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full">
      <div className="flex items-center p-2 justify-between space-x-2">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex-1 justify-start p-0 h-auto">
            <div className="flex items-center gap-2 w-full">
              {isAIHighlight && (
                <Image
                  src="/pubby.png"
                  alt="Pubby Logo"
                  width={24}
                  height={24}
                />
              )}
              <span className="text-lg font-medium truncate flex-1 text-left">
                {highlight.title || "Untitled"}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </div>
          </Button>
        </CollapsibleTrigger>

        <Button
          variant="outline"
          size="sm"
          onClick={handleBack}
          className="ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <CollapsibleContent>
        <div className="p-3 space-y-3">
          {/* Article Metadata */}
          <div className="flex gap-2 flex-wrap space-x-1">
            <Badge variant="secondary" className="">
              Type: {highlight.content.text ? "Text" : "Area Select"}
            </Badge>
            <Badge variant="secondary" className="">
              <FileText className="h-3 w-3" />
              Page {highlight.position.pageNumber}
            </Badge>
            <Badge variant="secondary" className="">
              <Calendar className="h-3 w-3" />
              May 2025
            </Badge>
          </div>

          {/* Highlighted content */}
          <div className="py-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Highlight
            </h3>
            <div className="bg-accent/50 p-3 rounded-md border">
              {highlight.content.text ? (
                <blockquote className="mt-2 pl-2 border-l-2 border-accent-foreground text-sm">
                  {`${highlight.content.text.slice(0, 300).trim()}`}
                </blockquote>
              ) : null}
              {highlight.content.image ? (
                <div className="highlight__image mt-0.5 w-full">
                  <img
                    src={highlight.content.image}
                    alt={"Screenshot"}
                    className="max-w-full"
                  />
                </div>
              ) : null}
            </div>
          </div>

          {/* Notes */}
          {!isAIHighlight && (
            <div className="border-b">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Notes
              </h3>
              <p className="text-sm text-accent-foreground bg-accent/50 p-3 rounded-md border">
                {highlight.comment.text || "No notes added"}
              </p>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default AnnoCardCompact;
