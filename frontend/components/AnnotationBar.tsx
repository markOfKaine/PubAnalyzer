import type { IHighlight } from "react-pdf-highlighter";
import { Button } from "@/components/ui/button";
import "react-pdf-highlighter/dist/style.css";
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
import AnnotationCard from "@/components/AnnotationCard";
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
              className="p-2 cursor-pointer transition-colors duration-150 ease-in-out rounded-lg hover:bg-accent w-full"
              onClick={() => {
                updateHash(highlight);
              }}
            >
              <AnnotationCard key={highlight.id} highlightId={highlight.id} />
            </li>
          ))}
        </ul>
      </div>
      {/*
      TODO: TW - need to implement a way to delete all highlights from the backend
      Tried to call deletAnnotation for each highlight but the backend
      was not working correctly while doing so.
      Disabling the component for now
    */}
      {/* <div className="pt-4 border-t mt-4 w-full">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="w-full"
              variant="destructive"
              size="sm"
              disabled={highlights.length === 0}
            >
              {highlights.length > 0 ? "Clear highlights" : "No highlights"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="">
            <AlertDialogHeader className="">
              <AlertDialogTitle className="">
                Are you sure you want to remove all highlights for this document?
              </AlertDialogTitle>
              <AlertDialogDescription className="">
                This action cannot be undone and will permanently delete all
                annotations for this document.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="">
              <AlertDialogCancel className="">Cancel</AlertDialogCancel>
              <AlertDialogAction
                className=""
                onClick={() => {
                  console.log("Removing all highlights.");
                  resetHighlights();
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div> */}
    </div>
  );
}

export default AnnotationBar;
