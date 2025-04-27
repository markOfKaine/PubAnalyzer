import type { IHighlight } from "react-pdf-highlighter";
import { Button } from "@/components/ui/button";
import "react-pdf-highlighter/dist/style.css";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { usePDFContext } from "@/contexts/PDFContext";

const updateHash = (highlight: IHighlight) => {
  const id = highlight.id;
  window.location.hash = `highlight-${id}`;
};

function AnnotationBar() {
  const {
    highlights,
    resetHighlights,
  } = usePDFContext();

  return (
    <div className="bg-sidebar border-sidebar-border h-full w-full flex flex-col p-2 overflow-hidden">
      <div className="flex-1 overflow-y-auto w-full">
        <ul className="p-0 list-none space-y-2 w-full">
          {highlights.map((highlight, index) => (
            <li
              key={index}
              className="p-3 cursor-pointer transition-colors duration-150 ease-in-out rounded-md hover:bg-slate-100 w-full"
              onClick={() => {
                updateHash(highlight);
              }}
            >
              <Card className="w-full">
                <CardHeader className="">
                  <CardTitle className="text-sm font-bold">
                    {highlight.comment.title || "Untitled"}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {highlight.comment.text}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center">
                  <div className="w-full">
                    {highlight.content.text ? (
                      <blockquote className="mt-2 pl-2 border-l-2 border-gray-300 text-sm">
                        {`${highlight.content.text.slice(0, 90).trim()}…`}
                      </blockquote>
                    ) : null}
                    {highlight.content.image ? (
                      <div className="highlight__image mt-0.5 w-full">
                        <img src={highlight.content.image} alt={"Screenshot"} className="max-w-full" />
                      </div>
                    ) : null}
                  </div>
                </CardContent>
                <CardFooter className="highlight__location text-xs text-muted-foreground mt-2">
                  Page {highlight.position.pageNumber}
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      </div>
      <div className="pt-4 border-t mt-4 w-full">
        <Button
          onClick={resetHighlights}
          className="w-full"
          variant="destructive"
          size="sm"
          disabled={highlights.length === 0}
        >
          {highlights.length > 0 ? "Clear highlights" : "No highlights"}
        </Button>
      </div>
    </div>
  );
}

export default AnnotationBar;
