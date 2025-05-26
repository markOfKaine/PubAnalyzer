import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { usePDFContext } from "@/contexts/PDFContext";
import { useState } from "react";
import {
  Pencil,
  Calendar,
  ChevronDown,
  ChevronUp,
  UserRoundPen 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Image from "next/image";

function AnnotationCard({ highlightId }) {
  const { highlights, highlightTapped, removeHighlight } = usePDFContext();
  const highlight = highlights.find(h => h.id === highlightId)
  const [expanded, setExpanded] = useState(false);

  const isAIHighlight = highlight?.chats !== undefined;
  
  function expandCard(e) {
    e.preventDefault();
    setExpanded(!expanded);
  }

  function editBtnTapped(e) {
    e.preventDefault();
    highlightTapped(highlight, false, true);
  }

  function aiBtnTapped(e) {
    e.preventDefault();
    highlightTapped(highlight, true, false);
  }

  return (
    <Card
      className={`w-full ${isAIHighlight ? "border-primary" : "border-border"}`}
    >
      <CardHeader className="border-b select-n</Card>one" onClick={expandCard}>
        <CardTitle className="text-sm font-bold">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {highlight.title || "Untitled"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isAIHighlight ? (
                <Image
                  src="/pubby.png"
                  alt="Pubby Logo"
                  width={24}
                  height={24}
                />
              ) : (
                <UserRoundPen size={16} className="text-muted-foreground" />
              )}
            </div>
          </div>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {/* Article Metadata */}
          <div className=" flex items-center gap-2">
            <span>Type: {highlight.content.text ? "Text" : "Area Select"}</span>
            <span>•</span>
            <span>Page {highlight.position.pageNumber}</span>
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
            {/* Highlighted content */}
            <div className="border-b">
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
        </CardContent>
      )}

      {expanded && (
        <CardFooter className="flex items-center">
          <div className="w-full grid grid-cols-2 gap-3">
            {isAIHighlight ? (
              <Button variant="default" onClick={aiBtnTapped}>
                <Image
                  src="/pubby.png"
                  alt="Pubby Logo"
                  width={30}
                  height={30}
                />{" "}
                Ask Pubby
              </Button>
            ) : (
              <Button variant="default" onClick={editBtnTapped}>
                <Pencil size={16} /> Edit Note
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Remove Highlight</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="">
                <AlertDialogHeader className="">
                  <AlertDialogTitle className="">
                    Are you sure you want to remove this highlight?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="">
                    This action cannot be undone and will permanently delete this annotation.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="">
                  <AlertDialogCancel className="">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className=""
                    onClick={() => {
                      console.log("Removing highlight:", highlightId);
                      removeHighlight(highlightId);
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

export default AnnotationCard;
