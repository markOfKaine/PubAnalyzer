"use client";
import { Copy, CheckCircle } from "lucide-react";
import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function CopyableTextarea({ className, copyable = false, ...props }) {
  const [copied, setCopied] = useState(false);
  const [text, setText] = useState(
    "This is some example text that you can copy."
  );
  const textareaRef = useRef(null);

  const handleCopy = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        className={`w-full ${className}`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        {...props}
      />

      {copyable && (
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <CheckCircle className="h-5 w-5 text-primary" />
          ) : (
            <Copy className="h-5 w-5 text-accent" />
          )}
        </button>
      )}
    </div>
  );
}

export default CopyableTextarea;
