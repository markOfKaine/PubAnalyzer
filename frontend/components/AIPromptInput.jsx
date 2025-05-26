import { useState } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Send } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useLLMContext } from "@/contexts/LLMContext";
import { usePDFContext } from "@/contexts/PDFContext";

const formSchema = z.object({
  prompt: z.string().min(1, 'Please enter a message'),
});

// Standard structure for chat messages
// interface ChatMessage {
//   id: string;
//   content: string;
//   sender: "user" | "pubby";
//   timestamp: Date;
//   isLoading?: boolean;
// }

function AIPromptInput() {
    const { setMessages, fetchLLMTextResponse } = useLLMContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { selectedHighlight, addOrUpdateHighlightChat } = usePDFContext();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const promptValue = form.watch('prompt');
  const isEmpty = !promptValue || promptValue.trim().length === 0;

  const sendMessageToLLM = async (inputValue) => {
    console.log("Sending message to LLM 1:", inputValue);
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setIsLoading(true);
    setError(null);

    setMessages((prev) => [...prev, userMessage]);
    await addOrUpdateHighlightChat(selectedHighlight, userMessage);
    
    const loadingMessage = {
      id: (Date.now() + 1).toString(),
      content: "",
      sender: "pubby",
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, loadingMessage]);

    try {
        console.log("Sending message to LLM 2:", userMessage.content);
        const aiResponse = await fetchLLMTextResponse(userMessage.content);
        console.log("AI Response:", aiResponse);
        const aiMessage = {
          ...loadingMessage,
          content: aiResponse.response,
          isLoading: false,
        }

        // Updates the previously added loading message with the AI response
        setMessages((prev) =>
            prev.map((msg) =>
              msg.id === loadingMessage.id ? aiMessage : msg
            )
        );

        // Add the AI message to the highlights chat history
        await addOrUpdateHighlightChat(selectedHighlight, aiMessage);

    } catch (error) {
        const errorMessage = {
            ...loadingMessage,
            content: "Sorry, I encountered an error. Please try again.",
            isLoading: false,
        }

        setMessages((prev) =>
            prev.map((msg) =>
              msg.id === loadingMessage.id ? errorMessage : msg
            )
        );

        // Add the AI message to the highlights chat history
        await addOrUpdateHighlightChat(selectedHighlight, errorMessage);
        setError("An error occurred while sending the message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data) => {
    console.log('LLM Prompt Submitted:', data.prompt);
    sendMessageToLLM(data.prompt);
    form.reset();
  };

  const handleKeyDown = (e) => {
    // Lets users add a new line with Shift + Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isEmpty) {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  const handleTextareaInput = (e) => {
    // Adjusts the height of the textarea based on its content
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 300) + 'px';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {error && (
        <div className="mb-2 text-sm text-red-500">
          {error}
        </div>
      )}
      <Form {...form}>
        <div className="relative">
          <div
            className="relative rounded-3xl border border-input shadow-sm bg-card 
                hover:shadow transition-all duration-200 
                focus-within:ring-1 focus-within:ring-primary/50 
                focus-within:border-primary"
          >
            {/* Form Field with Textarea */}
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Message Pubby..."
                      className="w-full pl-4 pr-16 py-4 border-none rounded-3xl resize-none 
                     focus-visible:ring-0 focus-visible:ring-offset-0 
                     placeholder:text-muted-foreground min-h-[60px] max-h-[300px]"
                      rows={1}
                      onKeyDown={handleKeyDown}
                      onInput={handleTextareaInput}
                      style={{
                        height: "auto",
                        minHeight: "60px",
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Submit button */}
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isEmpty}
              size="icon"
              variant="default"
              className="absolute right-3 bottom-3 h-10 w-10 rounded-full transition-all duration-200"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex justify-between items-center mt-2 px-4 text-xs text-muted-foreground/50">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>{promptValue?.length || 0} characters</span>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AIPromptInput;