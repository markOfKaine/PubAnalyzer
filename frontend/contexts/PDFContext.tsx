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
  addManualHighlight: (highlight: PubNewHighlight) => void;
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
    content: Partial<Content>,
    comment?: Partial<PubComment>
  ) => void;
  getHighlightById: (id: string) => PubIHighlight | undefined;
  resetHash: () => void;
  scrollToHighlightFromHash: () => void;
  scrollViewerRef: (scrollTo: (highlight: PubIHighlight) => void) => void;
  showAIPanel: boolean;
  showEditNote: boolean;
  setShowEditNote: (showEditNote: boolean) => void;
  setShowAIPanel: (showAIPanel: boolean) => void;
  addOrUpdateHighlightChat: (
    highlight: PubIHighlight,
    newMessage: PubbyChat
  ) => Promise<void> | void;
}>({
  url: "",
  setUrl: (url: string) => {},
  highlights: [] as Array<PubIHighlight>,
  setHighlights: (highlights: Array<PubIHighlight>) => {},
  selectedHighlight: null as PubIHighlight | null,
  addAIHighlight: (highlight: PubNewHighlight) => {},
  addManualHighlight: (highlight: PubNewHighlight) => {},
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
    content: Partial<Content>,
    comment?: Partial<PubComment>
  ) => {},
  getHighlightById: (id: string) => undefined,
  resetHash: () => {},
  scrollToHighlightFromHash: () => {},
  scrollViewerRef: (scrollTo: (highlight: PubIHighlight) => void) => {},
  showAIPanel: false,
  showEditNote: false,
  setShowEditNote: (showEditNote: boolean) => {},
  setShowAIPanel: (showAIPanel: boolean) => {},
  addOrUpdateHighlightChat: (highlight: PubIHighlight, newMessage: PubbyChat) => {},
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
  text: string;
  emoji: string;
}

export interface PubbyChat {
  id: string;
  content: string;
  sender: "user" | "pubby";
  timestamp: Date;
}

export interface PubNewHighlight extends NewHighlight {
  comment: PubComment;
  chats?: PubbyChat[];
  title?: string;
}

export interface PubIHighlight extends IHighlight {
  comment: PubComment;
  chats?: PubbyChat[];
  title?: string;
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
  const [showEditNote, setShowEditNote] = useState(false);

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
    let title = "";
    const isAIHighlight = highlight?.chats !== undefined;
    const isImageHighlight = highlight.content.image !== undefined;

    if (isImageHighlight) {
      title = isAIHighlight
      ? highlight.chats[0].content.slice(0, 60).trim() + "..."
      : "Area Select - " +
        highlight.comment.text.slice(0, 40).trim() +
        "...";
    } else {
      title = isAIHighlight
      ? highlight.chats[0].content.slice(0, 60).trim() + "..."
      : highlight.comment.text.slice(0, 60).trim() + "...";
    }

    highlight.title = title;
    const newHighlight = { ...highlight, id: getNextId() };
    console.log("Saving highlight", newHighlight);
    setHighlights((prevHighlights) => [newHighlight, ...prevHighlights]);
  };

  const addAIHighlight = (highlight: PubNewHighlight) => {
    const newHighlight = { ...highlight, id: getNextId() };
    setSelectedHighlight(newHighlight);
    setShowEditNote(false);
    setShowAIPanel(true);
  };

  const addManualHighlight = (highlight: PubNewHighlight) => {
    const newHighlight = { ...highlight, id: getNextId() };
    setSelectedHighlight(newHighlight);
    setShowAIPanel(false);
    setShowEditNote(true);
  };

  // Helper function to add highlight to array or update existing highlight's chat
  const addOrUpdateHighlightChat = async (
    highlight: PubIHighlight,
    newMessage: PubbyChat
  ) => {
    if (!highlight) {
      return;
    }

    if (highlight.title === undefined) {
      highlight.title = newMessage.content.slice(0, 60).trim() + "...";
    }

    setHighlights((prevHighlights) => {
      const existingIndex = prevHighlights.findIndex((h) => h.id === highlight.id);

      if (existingIndex === -1) {
        // If Highlight doesn't exist in array then add it with the new message
        const newHighlight = {
          ...highlight,
          chats: [newMessage],
        };
        return [...prevHighlights, newHighlight];
      } else {
        // If Highlight exists then append the new message to its chats
        const updatedHighlights = [...prevHighlights];
        updatedHighlights[existingIndex] = {
          ...updatedHighlights[existingIndex],
          chats: [
            ...(updatedHighlights[existingIndex].chats || []),
            newMessage,
          ],
        };
        return updatedHighlights;
      }
    });

    // Also update selectedHighlight to keep it in sync
    setSelectedHighlight((prev) => {
      if (prev?.id === highlight.id) {
        return {
          ...prev,
          chats: [...(prev.chats || []), newMessage],
        };
      }
      return prev;
    });
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
    content: Partial<Content>,
    comment?: Partial<PubComment>
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
          content: { ...h.content, ...content },
          comment: comment ? { ...h.comment, ...comment } : h.comment,
        };

        // Store the updated highlight for later use
        updatedHighlight = updatedH;
        return updatedH;
      });

      console.log("TW - new highlight will be:", updatedHighlight);
      return newHighlights;
    });

    // Update the selected highlight
    if (selectedHighlight && selectedHighlight.id === highlightId && comment) {
      const updatedSelectedHighlight = {
        ...selectedHighlight,
        position: { ...selectedHighlight.position, ...position },
        comment: {
          ...selectedHighlight.comment,
          ...comment,
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
    console.log("TW - highlightTapped - ", showAIPanel);
    setShowAIPanel(showAIPanel);
    setShowEditNote(showEditNote);
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
    setShowEditNote,
    setShowAIPanel,
    addAIHighlight,
    addManualHighlight,
    addOrUpdateHighlightChat,
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
