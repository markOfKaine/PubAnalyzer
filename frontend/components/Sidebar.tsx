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

interface SideBarProps {
  highlights: Array<IHighlight>;
  resetHighlights: () => void;
}

const updateHash = (highlight: IHighlight) => {
  const id = highlight.id;
  window.location.hash = `highlight-${id}`;
};

function Sidebar({ highlights, resetHighlights }: SideBarProps) {
  return (
    <div className="bg-sidebar border-sidebar-border h-full flex flex-col p-4 overflow-hidden">
      {/* TODO: TW - Update with documents name */}
      <h2 className="mb-4 text-xl font-bold">DOCUMENT NAME</h2>
      <div className="flex-1 overflow-y-auto">
        <ul className="p-0 list-none space-y-2">
          {highlights.map((highlight, index) => (
            <li
              key={index}
              className="p-3 cursor-pointer transition-colors duration-150 ease-in-out rounded-md hover:bg-slate-100"
              onClick={() => {
                updateHash(highlight);
              }}
            >
              <Card className="">
                <CardHeader className="">
                  <CardTitle className="text-sm font-bold">
                    {highlight.comment.title || "Untitled"}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {highlight.comment.text}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center">
                  <div>
                    {highlight.content.text ? (
                      <blockquote className="mt-2 pl-2 border-l-2 border-gray-300 text-sm">
                        {`${highlight.content.text.slice(0, 90).trim()}…`}
                      </blockquote>
                    ) : null}
                    {highlight.content.image ? (
                      <div className="highlight__image mt-0.5">
                        <img src={highlight.content.image} alt={"Screenshot"} />
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
      <div className="pt-4 border-t mt-4">
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

export default Sidebar;
