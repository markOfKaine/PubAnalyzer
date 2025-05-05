import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import type {
  Comment,
  Content,
  IHighlight,
  NewHighlight,
  ScaledPosition
} from "react-pdf-highlighter";

const PDFContext = createContext<{
  url: string;
  setUrl: (url: string) => void;
  highlights: Array<PubIHighlight>;
  setHighlights: (highlights: Array<PubIHighlight>) => void;
  selectedHighlight: PubIHighlight | null;
  highlightTapped: (highlight: PubIHighlight) => void;
  resetHighlights: () => void;
  addHighlight: (highlight: PubNewHighlight) => void;
  updateHighlight: (
    highlightId: string,
    position: Partial<ScaledPosition>,
    content: Partial<Content>
  ) => void;
  getHighlightById: (id: string) => PubIHighlight | undefined;
  resetHash: () => void;
  scrollToHighlightFromHash: () => void;
  scrollViewerRef: (scrollTo: (highlight: PubIHighlight) => void) => void;
}>({
  url: "",
  setUrl: (url: string) => {},
  highlights: [] as Array<PubIHighlight>,
  setHighlights: (highlights: Array<PubIHighlight>) => {},
  selectedHighlight: null as PubIHighlight | null,
  highlightTapped: (highlight: PubIHighlight) => {},
  resetHighlights: () => {},
  addHighlight: (highlight: PubNewHighlight) => {},
  updateHighlight: (
    highlightId: string,
    position: Partial<ScaledPosition>,
    content: Partial<Content>
  ) => {},
  getHighlightById: (id: string) => undefined,
  resetHash: () => {},
  scrollToHighlightFromHash: () => {},
  scrollViewerRef: (scrollTo: (highlight: PubIHighlight) => void) => {},
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

export interface PubComment {
  title: string;
  text: string;
  emoji: string;
}

export interface PubNewHighlight extends NewHighlight { 
  comment: PubComment;
}

export interface PubIHighlight extends IHighlight { 
  comment: PubComment;
}

export const PDFProvider = ({ children, initialUrl = "https://arxiv.org/pdf/1708.08021" }) => {
  const [url, setUrl] = useState(initialUrl);
  const [highlights, setHighlights] = useState<Array<PubIHighlight>>([]);
  const [selectedHighlight, setSelectedHighlight] = useState<PubIHighlight>(null);

  const scrollViewerTo = useRef((highlight: PubIHighlight) => {});

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

  const addHighlight = (highlight: PubNewHighlight) => {
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

  const highlightTapped = (highlight: PubIHighlight) => {
    if (highlight) {
      setSelectedHighlight(highlight);
    } else {
      setSelectedHighlight(null);
    }
  }

  const contextValue = {
    url,
    setUrl,
    highlights,
    setHighlights,
    selectedHighlight,
    highlightTapped,
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