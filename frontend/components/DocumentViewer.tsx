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
import { useLLMContext } from "@/contexts/LLMContext";
import PDFNewNoteCard from "@/components/PDFNewNoteCard";

const HighlightPopup = ({
  comment,
}: {
  comment: { text: string; emoji: string };
}) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text.slice(0, 30)}
      {comment.text.length > 30 ? "..." : ""}
    </div>
  ) : null;

function DocumentViewer() {
  const [isAreaSelectionInProgress, setIsAreaSelectionInProgress] = useState(false);
  const { setMessages } = useLLMContext();
  
  const {
    url,
    highlights,
    updateHighlight,
    resetHash,
    scrollViewerRef,
    setShowAIPanel,
    setShowEditNote,
  } = usePDFContext();

  function closeSelectionPanel() {
    setShowAIPanel(false);
    setShowEditNote(false);
    setMessages([]);
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
                closeSelectionPanel();
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
                  return (
                    <PDFNewNoteCard
                      position={position}
                      content={content}
                      transformSelection={transformSelection}
                      hideTipAndSelection={hideTipAndSelection}
                      onClose={closeSelectionPanel}
                    />
                  );
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
      </div>
    </div>
  );
}

export default DocumentViewer;
