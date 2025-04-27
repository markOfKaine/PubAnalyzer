import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import type {
  Content,
  IHighlight,
  NewHighlight,
  ScaledPosition
} from "react-pdf-highlighter";

const PDFContext = createContext({
  url: "",
  setUrl: (url: string) => {},
  highlights: [],
  setHighlights: (highlights: Array<IHighlight>) => {},
  resetHighlights: () => {},
  addHighlight: (highlight: NewHighlight) => {},
  updateHighlight: (
    highlightId: string,
    position: Partial<ScaledPosition>,
    content: Partial<Content>
  ) => {},
  getHighlightById: (id: string) => undefined,
  resetHash: () => {},
  scrollToHighlightFromHash: () => {},
  scrollViewerRef: (scrollTo: (highlight: IHighlight) => void) => {},
});

export const usePDFContext= () => useContext(PDFContext)

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () => {
  if (typeof window !== 'undefined') {
    return window.location.hash.slice("#highlight-".length);
  }
  return "";
};

const resetHash = () => {
  if (typeof window !== 'undefined') {
    window.location.hash = "";
  }
};

export const PDFProvider = ({ children, initialUrl = "https://arxiv.org/pdf/1708.08021" }) => {
  const [url, setUrl] = useState(initialUrl);
  const [highlights, setHighlights] = useState<Array<IHighlight>>([]);

  const scrollViewerTo = useRef((highlight: IHighlight) => {});

  const getHighlightById = (id: string) => {
    return highlights.find((highlight) => highlight.id === id);
  };

  const scrollToHighlightFromHash = useCallback(() => {
    const highlight = getHighlightById(parseIdFromHash());
    if (highlight) {
      scrollViewerTo.current(highlight);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", 
      scrollToHighlightFromHash, false);
    return () => {
      window.removeEventListener(
        "hashchange",
        scrollToHighlightFromHash,
        false
      );
    };
  }, [scrollToHighlightFromHash]);

  const addHighlight = (highlight: NewHighlight) => {
    console.log("Saving highlight", highlight);
    setHighlights((prevHighlights) => [
      { ...highlight, id: getNextId() },
      ...prevHighlights,
    ]);
  };

  const updateHighlight = (
    highlightId: string,
    position: Partial<ScaledPosition>,
    content: Partial<Content>
  ) => {
    console.log("Updating highlight", highlightId, position, content);
    setHighlights((prevHighlights) =>
      prevHighlights.map((h) => {
        const {
          id,
          position: originalPosition,
          content: originalContent,
          ...rest
        } = h;
        return id === highlightId
          ? {
              id,
              position: { ...originalPosition, ...position },
              content: { ...originalContent, ...content },
              ...rest,
            }
          : h;
      })
    );
  };

  const resetHighlights = () => {
    setHighlights([]);
  };

  const contextValue = {
    url,
    setUrl,
    highlights,
    setHighlights,
    resetHighlights,
    addHighlight,
    updateHighlight,
    getHighlightById,
    resetHash,
    scrollToHighlightFromHash,
    scrollViewerRef: (scrollTo) => {
      scrollViewerTo.current = scrollTo;
      scrollToHighlightFromHash();
    },
  };

  return (
    <PDFContext.Provider value={contextValue}>
      {children}
    </PDFContext.Provider>
  );
}