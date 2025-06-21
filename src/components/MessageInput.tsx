
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function MessageInput({ onSendMessage, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-slate-200/60 bg-white/80 backdrop-blur-sm p-6">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about proteins, ligands, structures, or recent research..."
              className="min-h-[60px] resize-none border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="h-[60px] px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <div className="mt-3 text-xs text-slate-500 max-w-4xl">
          <span className="font-medium">Pro tip:</span> Be specific with your queries. 
          Try "Find proteins similar to [protein name]" or "Show ligands for [target]"
        </div>
      </form>
    </div>
  );
}
