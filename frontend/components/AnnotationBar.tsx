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

import AnnotationCard from "@/components/AnnotationCard";

import { usePDFContext } from "@/contexts/PDFContext";

const updateHash = (highlight: IHighlight) => {
  const id = highlight.id;
  window.location.hash = `highlight-${id}`;
};

function AnnotationBar() {
  const {
    highlights,
    highlightTapped,
    resetHighlights,
  } = usePDFContext();

  return (
    <div className="bg-sidebar border-sidebar-border h-full w-full flex flex-col p-2 overflow-hidden">
      <div className="flex-1 overflow-y-auto w-full">
        <ul className="p-0 list-none space-y-2 w-full">
          {highlights.map((highlight, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer transition-colors duration-150 ease-in-out rounded-lg hover:bg-accent w-full"
              onClick={() => {
                updateHash(highlight);
              }}
            >
              <AnnotationCard highlight={highlight} />
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
