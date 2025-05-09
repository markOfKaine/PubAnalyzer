import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import type {
  Comment,
  Content,
  IHighlight,
  NewHighlight,
  ScaledPosition,
} from "react-pdf-highlighter";

const PDFContext = createContext<{
  url: string;
  setUrl: (url: string) => void;
  highlights: Array<PubIHighlight>;
  setHighlights: (highlights: Array<PubIHighlight>) => void;
  selectedHighlight: PubIHighlight | null;
  addAIHighlight: (highlight: PubNewHighlight) => void;
  highlightTapped: (
    highlight: PubIHighlight | null,
    showAIPanel?: boolean,
    showEditNote?: boolean
  ) => void;
  resetHighlights: () => void;
  addHighlight: (highlight: PubNewHighlight) => void;
  updateHighlight: (
    highlightId: string,
    position: Partial<ScaledPosition>,
    content: Partial<Content>
  ) => void;
  updateHighlightComment: (
    highlightId: string,
    position: Partial<ScaledPosition>,
    content: { comment?: Partial<PubComment> }
  ) => void;
  getHighlightById: (id: string) => PubIHighlight | undefined;
  resetHash: () => void;
  scrollToHighlightFromHash: () => void;
  scrollViewerRef: (scrollTo: (highlight: PubIHighlight) => void) => void;
  showAIPanel: boolean;
  showEditNote: boolean;
}>({
  url: "",
  setUrl: (url: string) => {},
  highlights: [] as Array<PubIHighlight>,
  setHighlights: (highlights: Array<PubIHighlight>) => {},
  selectedHighlight: null as PubIHighlight | null,
  addAIHighlight: (highlight: PubNewHighlight) => {},
  highlightTapped: (
    highlight: PubIHighlight | null,
    showAIPanel?: boolean,
    showEditNote?: boolean
  ) => {},
  resetHighlights: () => {},
  addHighlight: (highlight: PubNewHighlight) => {},
  updateHighlight: (
    highlightId: string,
    position: Partial<ScaledPosition>,
    content: Partial<Content>
  ) => {},
  updateHighlightComment: (
    highlightId: string,
    position: Partial<ScaledPosition>,
    content: { comment?: Partial<PubComment> }
  ) => {},
  getHighlightById: (id: string) => undefined,
  resetHash: () => {},
  scrollToHighlightFromHash: () => {},
  scrollViewerRef: (scrollTo: (highlight: PubIHighlight) => void) => {},
  showAIPanel: false,
  showEditNote: false,
});

export const usePDFContext = () => useContext(PDFContext);

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () => {
  if (typeof window !== "undefined") {
    return window.location.hash.slice("#highlight-".length);
  }
  return "";
};

const resetHash = () => {
  if (typeof window !== "undefined") {
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

export const PDFProvider = ({
  children,
  initialUrl = "https://arxiv.org/pdf/1708.08021",
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [highlights, setHighlights] = useState<Array<PubIHighlight>>([]);
  const [selectedHighlight, setSelectedHighlight] =
    useState<PubIHighlight>(null);
  const scrollViewerTo = useRef((highlight: PubIHighlight) => {});
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showEditNote, setEditeNote] = useState(false);

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
    console.log("TW - PDFContext useEffect - scrollToHighlightFromHash");
    window.addEventListener("hashchange", scrollToHighlightFromHash, false);
    return () => {
      window.removeEventListener(
        "hashchange",
        scrollToHighlightFromHash,
        false
      );
    };
  }, [scrollToHighlightFromHash]);

  const addHighlight = (highlight: PubNewHighlight) => {
    const newHighlight = { ...highlight, id: getNextId() };
    console.log("Saving highlight", newHighlight);
    setHighlights((prevHighlights) => [newHighlight, ...prevHighlights]);
  };

  const addAIHighlight = (highlight: PubNewHighlight) => {
    const newHighlight = { ...highlight, id: getNextId() };
    console.log("Saving highlight", newHighlight);
    setHighlights((prevHighlights) => [newHighlight, ...prevHighlights]);
    console.log("TW - Setting selected highlight", highlight);
    setSelectedHighlight(newHighlight);
    setShowAIPanel(true);
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

  const updateHighlightComment = (
    highlightId: string,
    position: Partial<ScaledPosition>,
    content: { comment?: Partial<PubComment> }
  ) => {
    console.log("TW - Updating highlight", highlightId, content);
    let updatedHighlight = null;

    // Update the highlights array
    setHighlights((prevHighlights) => {
      const newHighlights = prevHighlights.map((h) => {
        if (h.id !== highlightId) return h;

        // Create the updated highlight
        const updatedH = {
          ...h,
          position: { ...h.position, ...position },
          comment: content.comment
            ? { ...h.comment, ...content.comment }
            : h.comment,
        };

        // Store the updated highlight for later use
        updatedHighlight = updatedH;
        return updatedH;
      });

      console.log("TW - new highlight will be:", updatedHighlight);
      return newHighlights;
    });

    // Update the selected highlight
    if (
      selectedHighlight &&
      selectedHighlight.id === highlightId &&
      content.comment
    ) {
      const updatedSelectedHighlight = {
        ...selectedHighlight,
        position: { ...selectedHighlight.position, ...position },
        comment: {
          ...selectedHighlight.comment,
          ...content.comment,
        },
      };

      setSelectedHighlight(updatedSelectedHighlight);
    }
  };

  const resetHighlights = () => {
    setHighlights([]);
  };

  const highlightTapped = (
    highlight: PubIHighlight | null,
    showAIPanel: boolean = false,
    showEditNote: boolean = false
  ) => {
    setSelectedHighlight(highlight);
    setShowAIPanel(showAIPanel);
    setEditeNote(showEditNote);
    if (highlight) {
      scrollViewerTo.current(highlight);
    }
  };

  const contextValue = {
    url,
    setUrl,
    highlights,
    setHighlights,
    selectedHighlight,
    showAIPanel,
    showEditNote,
    addAIHighlight,
    highlightTapped,
    resetHighlights,
    addHighlight,
    updateHighlight,
    updateHighlightComment,
    getHighlightById,
    resetHash,
    scrollToHighlightFromHash,
    scrollViewerRef: (scrollTo) => {
      scrollViewerTo.current = scrollTo;
      scrollToHighlightFromHash();
    },
  };

  return (
    <PDFContext.Provider value={contextValue}>{children}</PDFContext.Provider>
  );
};
