import React, { useState, useEffect } from 'react';
import { BotMessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft
} from "lucide-react";


interface AiTipProps {
  onConfirm: (comment: { title: string, text: string; emoji: string }) => void;
  onOpen: () => void;
}

function AiTip({ onConfirm, onOpen }: AiTipProps) {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    onOpen();
  }, [onOpen]);

  function handleClick(e) {
    e.preventDefault();
    
  }
  
  if (!isEditing) {
    return (
      <Button 
      variant="default" 
      size="sm"
      className="flex aspect-square size-8 items-center justify-center bg-primary text-background"
      onClick={() => setIsEditing(true)}
    >
      <BotMessageSquare />
    </Button>
    );
  }
  
  return (
    <Card className="w-[350px] shadow-md">
      <CardHeader className="">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="">Ask AI</CardTitle>
          <Button variant="outline" size="icon" onClick={handleClick}><ArrowLeft size={12}/></Button>
        </div>
      </CardHeader>
      <CardContent className="">
        <li className='flex flex-col gap-2'>
          <Button key="exPrompt1" variant="secondary">Prompt #1</Button>
          <Button key="exPrompt2" variant="secondary">Prompt #2</Button>
          <Button key="exPrompt3" variant="secondary">Prompt #3</Button>
        </li>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="default"
          className="w-1/2 mr-1"
          onClick={() => {
            setIsEditing(false);
          }}
        >
          Cancel
        </Button>
        <Button
          variant="default"
          size="default"
          className="bg-primary text-background w-1/2 ml-1"
          onClick={() => {
            onConfirm({ title, text, emoji: "💬" });
            setIsEditing(false);
          }}
        >
          Save
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AiTip; 