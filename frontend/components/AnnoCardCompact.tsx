
import { usePDFContext, PubIHighlight } from "@/contexts/PDFContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calendar,
  CircleX
} from "lucide-react";

function AnnoCardCompact({ highlight }: { highlight: PubIHighlight }) {
  const { highlightTapped } = usePDFContext();

  function handleClick(e) {
    e.preventDefault();
    highlightTapped(null);
  }

  return (
    <div className="w-full">
    <CardTitle className="font-bold">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium">
            {highlight.comment.title || "Untitled"}
          </span>
        </div>
        <Button variant="destructive" onClick={handleClick}><CircleX size={12}/></Button>
      </div>
    </CardTitle>
    <CardDescription className="text-xs text-muted-foreground">
      <div className=" flex items-center gap-2">
        <span>Type: {highlight.content.text ? "Text" : "Image"}</span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {"May 2025"}
        </span>
        <span>•</span>
        <span className="text-xs bg-accent text-muted-foreground px-2 py-1 rounded-full">
          Page {highlight.position.pageNumber}
        </span>
      </div>
    </CardDescription>
  </div>
  );
}

export default AnnoCardCompact;
