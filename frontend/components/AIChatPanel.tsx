import { ChatMessageList } from "./ui/chat/chat-message-list";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { useUserContext } from "@/contexts/UserContext";
import { useLLMContext } from "@/contexts/LLMContext";
import { usePDFContext } from "@/contexts/PDFContext";
import { useEffect, useMemo } from "react";
import Image from "next/image";
import AIPromptInput from "@/components/AIPromptInput"
import { PubbyChat } from "@/contexts/PDFContext";

interface ChatMessage extends PubbyChat {
  isLoading?: boolean;
}

function AIChatPanel() {
  const { user } = useUserContext();
  const { messages, setMessages } = useLLMContext();
  const { selectedHighlight } = usePDFContext();

    // Load existing chat history when a highlight is selected
    useEffect(() => {
        if (selectedHighlight?.chats) {
            setMessages(selectedHighlight.chats);
        } else {
            setMessages([]); // Clear messages if no existing chat
        }
    }, [selectedHighlight?.id, setMessages]);

  const userAvatar = useMemo(() => {
    if (!user) return "?";
    const firstInitial = user.first_name.charAt(0).toUpperCase();
    return firstInitial;
  }, [user]);

  const AIChatBubble = (message: ChatMessage) => {
    return (
      <ChatBubble variant="received" key={message.id}>
        <ChatBubbleAvatar src="/pubby.png" fallback="AI" />
        <ChatBubbleMessage isLoading={message.isLoading}>
          {message.content}
        </ChatBubbleMessage>
      </ChatBubble>
    );
  };

  const HumanChatBubble = (message: ChatMessage) => {
    return (
      <ChatBubble variant="sent" key={message.id}>
        <ChatBubbleAvatar fallback={userAvatar} />
        <ChatBubbleMessage variant="sent">{message.content}</ChatBubbleMessage>
      </ChatBubble>
    );
  };

  const chatMessage = (message: ChatMessage) => {
    if (message.sender === "user") {
      return HumanChatBubble(message);
    } else {
      return AIChatBubble(message);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Make this container scrollable but keep it from pushing the input down */}
      <div className="flex-1 overflow-hidden">
        <ChatMessageList className="h-full overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-8 h-full">
              <div className="mb-2">
                <Image
                  src="/pubby.png"
                  alt="Pubby Logo"
                  width={40}
                  height={40}
                />
              </div>
              <p>Ask Pubby a question to get started!</p>
            </div>
          ) : (
            messages.map(chatMessage)
          )}
        </ChatMessageList>
      </div>

      {/* Keep this fixed at the bottom */}
      <div className="flex-shrink-0 border-t">
        <AIPromptInput />
      </div>
    </div>
  );
}

export default AIChatPanel;
