'use client';
import React, { useRef } from "react";
import {
  PdfLoader,
  PdfHighlighter,
  Popup,
  Highlight,
  AreaHighlight
} from "react-pdf-highlighter";

import "react-pdf-highlighter/dist/style.css";

// Component for the highlight popup
const HighlightPopup = ({ comment }) => (
  <div className="bg-white shadow-md rounded p-2 max-w-sm">
    {comment.text ? (
      <div className="text-sm">{comment.text}</div>
    ) : (
      <div className="text-sm italic text-gray-500">Add a comment</div>
    )}
    {comment.emoji && <div className="mt-1">{comment.emoji}</div>}
  </div>
);

function DocumentViewer({ pdfUrl = "https://arxiv.org/pdf/1708.08021" }) {
  const scrollViewerTo = useRef(null);
  const [highlights, setHighlights] = React.useState([]);

  // Function to add a new highlight
  const addHighlight = (highlight) => {
    setHighlights([...highlights, { ...highlight, id: Date.now() }]);
  };

  // Function to update an existing highlight
  const updateHighlight = (id, position, content) => {
    setHighlights(
      highlights.map((h) => {
        if (h.id === id) {
          return {
            ...h,
            position: { ...h.position, ...position },
            content: { ...h.content, ...content }
          };
        }
        return h;
      })
    );
  };

  // Function to reset hash
  const resetHash = () => {
    window.location.hash = "";
  };

  // Function to scroll to highlight from hash
  const scrollToHighlightFromHash = () => {
    const highlight = getHighlightById(parseIdFromHash());
    if (highlight && scrollViewerTo.current) {
      scrollViewerTo.current(highlight);
    }
  };

  // Function to get highlight by id
  const getHighlightById = (id) => {
    return highlights.find(highlight => highlight.id === id);
  };

  // Function to parse id from hash
  const parseIdFromHash = () => {
    const hash = window.location.hash.slice("#highlight-".length);
    return hash ? parseInt(hash, 10) : null;
  };

  return (
    <div className="w-full h-full">
      <div className="pdf-viewer rounded-lg px-4 py-5 relative" style={{ position: "relative", height: "100vh" }}>
        <PdfLoader url={pdfUrl} beforeLoad={<div>Loading PDF...</div>}>
          {(pdfDocument) => (
            <>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
                <PdfHighlighter
                  pdfDocument={pdfDocument}
                  enableAreaSelection={(event) => event.altKey}
                  onScrollChange={resetHash}
                  scrollRef={(scrollTo) => {
                    scrollViewerTo.current = scrollTo;
                    scrollToHighlightFromHash();
                  }}
                  onSelectionFinished={(
                    position,
                    content,
                    hideTipAndSelection,
                    transformSelection
                  ) => {
                    addHighlight({
                      position,
                      content,
                      comment: { text: "", emoji: "" },
                    });
                    hideTipAndSelection();
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
                        isScrolledTo={isScrolledTo}
                        highlight={highlight}
                        onChange={(boundingRect) => {
                          updateHighlight(
                            highlight.id,
                            { boundingRect: viewportToScaled(boundingRect) },
                            { image: screenshot(boundingRect) }
                          );
                        }}
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
                />
              </div>
            </>
          )}
        </PdfLoader>
      </div>
    </div>
  );
}


export default DocumentViewer;
