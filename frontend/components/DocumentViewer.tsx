import "react-pdf-highlighter/dist/style.css";
import {
  Highlight,
  PdfHighlighter,
  PdfLoader,
  Popup,
} from "react-pdf-highlighter";
import { usePDFContext } from "@/contexts/PDFContext";
import { AreaHighlight } from "react-pdf-highlighter";
import { useState } from "react";
import { NewNoteCardProps } from "@/components/PDFNewNoteCard";
import PDFNewNoteCard from "@/components/PDFNewNoteCard";


const HighlightPopup = ({
  comment,
}: {
  comment: { title: string; text: string; emoji: string };
}) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.title}
    </div>
  ) : null;

function DocumentViewer() {
  const [newSelection, setNewSelection] = useState<NewNoteCardProps | null>(null);
  const [selectionCardOpen, setSelectionCardOpen] = useState(false);
  const [selectionHelpers, setSelectionHelpers] = useState({
    hideTipAndSelection: () => {},
    transformSelection: () => {}
  });

  const [isAreaSelectionInProgress, setIsAreaSelectionInProgress] = useState(false);
  
  const {
    url,
    highlights,
    addHighlight,
    updateHighlight,
    resetHash,
    scrollViewerRef,
  } = usePDFContext();

  function newSelectionStarted(e) {
    e.preventDefault();
    closeSelectionPanel();
  }

  function closeSelectionPanel() {
    console.log("TW - closeSelectionPanel");
    selectionHelpers.hideTipAndSelection();
    setSelectionCardOpen(false);
    setNewSelection(null);
  }

  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="h-full relative overflow-auto">
        <PdfLoader url={url} beforeLoad={<div>Loading PDF...</div>}>
          {(pdfDocument) => (
            <div className="absolute inset-0" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              
              if (!isAreaSelectionInProgress) {
                newSelectionStarted(e);
              }
              
            }}>
              <PdfHighlighter
                pdfDocument={pdfDocument}
                enableAreaSelection={(event) => 
                {
                  if (event.altKey) {
                    setIsAreaSelectionInProgress(true);
                  }
                  return event.altKey;
                }
                }
                onScrollChange={resetHash}
                scrollRef={scrollViewerRef}
                onSelectionFinished={(
                  position,
                  content,
                  hideTipAndSelection,
                  transformSelection
                ) => {
                  setNewSelection({ position, content });
                  setSelectionHelpers({
                    hideTipAndSelection,
                    transformSelection,
                  });
                  setSelectionCardOpen(true);
                  return null
                }}
                highlightTransform={(
                  highlight,
                  index,
                  setTip,
                  hideTip,
                  viewportToScaled,
                  screenshot,
                  isScrolledTo
                ) => {
                  const isTextHighlight = !highlight.content?.image;
                  const component = isTextHighlight ? (
                    <>
                    <Highlight
                      isScrolledTo={isScrolledTo}
                      position={highlight.position}
                      comment={highlight.comment}
                    />
                    </>
                  ) : (
                    <>
                    <AreaHighlight
                      isScrolledTo={isScrolledTo}
                      highlight={highlight}
                      onChange={(boundingRect) => {
                        updateHighlight(
                          highlight.id,
                          {
                            boundingRect: viewportToScaled(boundingRect),
                          },
                          { image: screenshot(boundingRect) }
                        );
                      }}
                    />
                    {setIsAreaSelectionInProgress(false)}
                    </>
                  );
                  return (
                    <Popup
                      popupContent={<HighlightPopup {...highlight} />}
                      onMouseOver={(popupContent) =>
                        setTip(highlight, (highlight) => popupContent)
                      }
                      onMouseOut={hideTip}
                      key={index}
                    >
                      {component}
                    </Popup>
                  );
                }}
                highlights={highlights}
              ></PdfHighlighter>
            </div>
          )}
        </PdfLoader>
        {selectionCardOpen && newSelection && (
          <div className="absolute bottom-0 left-0 right-0 bg-transparent z-10" 
          onClick={(e) => {e.stopPropagation();}}>
            <>{console.log("TW - PDFNewNoteCard NEW???")}</>
            <PDFNewNoteCard
              position={newSelection?.position}
              content={newSelection?.content}
              transformSelection={selectionHelpers.transformSelection}
              hideTipAndSelection={selectionHelpers.hideTipAndSelection}
              onClose={closeSelectionPanel}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default DocumentViewer;
