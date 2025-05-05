import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NotebookPen } from 'lucide-react';
import { PubComment } from '@/contexts/PDFContext';


interface TipProps {
  onConfirm: (comment: PubComment) => void;
  onOpen: () => void;
}

function CustomTip({ onConfirm, onOpen }: TipProps) {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    onOpen();
  }, [onOpen]);
  
  if (!isEditing) {
    return (
      <Button 
      variant="default" 
      size="sm"
      className="flex aspect-square size-8 items-center justify-center bg-primary text-secondary-foreground"
      onClick={() => setIsEditing(true)}
    >
      <NotebookPen />
    </Button>
    );
  }
  
  return (
    <Card className="w-[350px] shadow-md">
      <CardHeader className="">
        <CardTitle className="">New Note</CardTitle>
      </CardHeader>
      <CardContent className="">
        <form>
          <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title" className="text-sm">
                Title:
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Title here..."
                className="w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="notes" className="text-sm">
                Notes:
              </Label>
              <Textarea
                id="notes"
                placeholder="Notes here..."
                className="w-full"
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        </form>
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

export default CustomTip; 