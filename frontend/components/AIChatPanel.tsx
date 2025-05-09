import { ChatMessageList } from "./ui/chat/chat-message-list";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "./ui/chat/chat-bubble";
import { PubIHighlight } from "@/contexts/PDFContext";


function AIChatPanel({highlight}: { highlight: PubIHighlight }) {
    console.log("TW - highlight", highlight.id)
    return (
      <div>
        <ChatMessageList>
        {/* 
        // You can map over messages here 
        // Remove these messages and update with actual messages once ai integrated properly
        // */}
        <ChatBubble variant="sent">
          <ChatBubbleAvatar fallback="US" />
          <ChatBubbleMessage variant="sent">
            Hello, how has your day been? I hope you are doing well.
          </ChatBubbleMessage>
        </ChatBubble>
        <ChatBubble variant="received">
          <ChatBubbleAvatar fallback="AI" />
          <ChatBubbleMessage isLoading />
        </ChatBubble>
      </ChatMessageList>
      </div>
    );
}

export default AIChatPanel;

