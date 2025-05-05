import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePDFContext, PubIHighlight } from "@/contexts/PDFContext";
import { useState } from "react";
import {
  MessageSquare,
  Pencil,
  BookOpen,
  ArrowLeft,
  Calendar,
  Share,
  Bookmark,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { GiParrotHead } from "react-icons/gi";

function AnnotationCard({ highlight }: { highlight: PubIHighlight }) {
  const { highlightTapped } = usePDFContext();
  const [expanded, setExpanded] = useState(false);

  function handleClick(e) {
    e.preventDefault();
    
  }

  function expandCard(e) {
    e.preventDefault();
    setExpanded(!expanded);
  }

  function editBtnTapped(e) {
    e.preventDefault();
  }
  function aiBtnTapped(e) {
    e.preventDefault();
    highlightTapped(highlight);
  }

  return (
    <Card className="w-full">
      <CardHeader className="border-b" onClick={expandCard}>
        <CardTitle className="text-sm font-bold">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium">
                {highlight.comment.title || "Untitled"}
              </span>
            </div>
            <span className="text-xs bg-accent text-muted-foreground px-2 py-1 rounded-full">
              Page {highlight.position.pageNumber}
            </span>
          </div>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          <div className=" flex items-center gap-2">
            <span>Type: {highlight.content.text ? "Text" : "Image"}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {"May 2025"}
            </span>
            <div className="flex justify-end ml-auto">
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>
        </CardDescription>
      </CardHeader>

      {expanded && (
        <CardContent className="flex items-center">
          <div className="w-full space-y-4">
            {/* Highlighted text */}
            <div className="border-b">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Highlighted Text
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
            <div className="border-b">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Your Notes
              </h3>
              <p className="text-sm text-accent-foreground bg-accent/50 p-3 rounded-md border">
                {highlight.comment.text || "No notes added"}
              </p>
            </div>
          </div>
        </CardContent>
      )}

      {expanded && (
        <CardFooter className="flex items-center">
          <div className="w-full grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={editBtnTapped}>
              <Pencil size={16} /> Edit Note
            </Button>
            <Button onClick={aiBtnTapped}>
              <GiParrotHead size={16} /> Ask AI
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

export default AnnotationCard;
