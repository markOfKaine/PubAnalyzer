import "react-pdf-highlighter/dist/style.css";
import {
  Highlight,
  PdfHighlighter,
  PdfLoader,
  Popup,
} from "react-pdf-highlighter";
import { usePDFContext } from "@/contexts/PDFContext";
import { AreaHighlight } from "react-pdf-highlighter";

import CustomTip from "@/components/CustomTip";

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
  const {
    url,
    highlights,
    addHighlight,
    updateHighlight,
    resetHash,
    scrollViewerRef,
  } = usePDFContext();

  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="h-full relative overflow-auto">
        <PdfLoader url={url} beforeLoad={<div>Loading PDF...</div>}>
          {(pdfDocument) => (
            <div className="absolute inset-0">
              <PdfHighlighter
                pdfDocument={pdfDocument}
                enableAreaSelection={(event) => event.altKey}
                onScrollChange={resetHash}
                scrollRef={scrollViewerRef}
                onSelectionFinished={(
                  position,
                  content,
                  hideTipAndSelection,
                  transformSelection
                ) => {
                  return (
                    <div className="flex flex-row gap-2">
                      <CustomTip
                        onOpen={transformSelection}
                        onConfirm={(comment) => {
                          console.log("Comment", comment);
                          addHighlight({
                            content,
                            position,
                            comment: {
                              title: comment.title || "No Title",
                              text: comment.text || "No comment",
                              emoji: "💬",
                            },
                          });
                          hideTipAndSelection();
                        }}
                      />
                      {/* <AiTip
                          onOpen={transformSelection}
                          onConfirm={(comment) => {
                            addHighlight({
                              content,
                              position,
                              comment: {
                                title: comment.title || "No Title",
                                text: comment.text || "No comment",
                                emoji: "💬",
                              },
                            });
                            hideTipAndSelection();
                          }}
                        /> */}
                    </div>
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
                    <Highlight
                      isScrolledTo={isScrolledTo}
                      position={highlight.position}
                      comment={highlight.comment}
                    />
                  ) : (
                    <AreaHighlight
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
                      isScrolledTo={isScrolledTo}
                    />
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
