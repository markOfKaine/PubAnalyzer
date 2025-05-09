import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import CopyableTextArea from "@/components/CopyableTextArea";

const promptTemplates = [
  {
    id: 1,
    name: "Explain this concept",
    prompt: "Explain this concept in simple terms:",
  },
  { id: 2, name: "Summarize", prompt: "Summarize this passage:" },
  {
    id: 3,
    name: "Find evidence",
    prompt: "What evidence supports or contradicts this claim:",
  },
  {
    id: 4,
    name: "Related research",
    prompt: "Find related research to this topic:",
  },
  { id: 5, name: "Custom prompt...", prompt: "", isCustom: true },
];

function PDFAINote({ content, onNoteConfirm, onCancel }) {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState(null);

    const handlePromptSelect = (value) => {
      const selected = promptTemplates.find((prompt) => prompt.name === value);
      setSelectedPrompt(selected);
      if (selectedPrompt) {
        setTitle(selectedPrompt.prompt + " \"" + content.text.slice(0, 200).trim() + "\"");
      }
    };

  return (
    <>
      <form>
        <div className="grid w-full items-center gap-4 h-lg">
          <div className="flex flex-col space-y-4">
            <Select onValueChange={handlePromptSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a prompt" />
              </SelectTrigger>
              <SelectContent>
                {promptTemplates.map((prompt) => (
                  <SelectItem key={prompt.id} value={prompt.name}>
                    {prompt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Prompt input text area */}
            {selectedPrompt?.isCustom && (
              <Textarea
                id="custom-prompt"
                placeholder="Write your prompt here..."
                className="w-full mh-32"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            )}

            {/* Preselected - prompt preview area */}
            {selectedPrompt && !selectedPrompt.isCustom && (
              <div>
                <Label htmlFor="prompt-preview" className="text-sm">
                  Prompt Preview:
                </Label>
                <Textarea
                  id="prompt-preview"
                  className="w-full resize-none h-32"
                  disabled
                  value={
                    selectedPrompt.prompt + " \"" + content.text + "\""
                  }
                />
              </div>
            )}
          </div>
        </div>
      </form>
      <div className="flex justify-end items-end mt-4 space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="w-1/6"
          onClick={onCancel()}
        >
          Cancel
        </Button>
        <Button
          variant="default"
          size="sm"
          className="bg-primary text-background w-1/6"
          onClick={onNoteConfirm({ title, text, emoji: "💬" })}
        >
          Ask AI
        </Button>
      </div>
    </>
  );
}

export default PDFAINote;
