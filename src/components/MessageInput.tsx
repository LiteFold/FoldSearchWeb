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
    <div className="border-t border-gray-100 bg-white">
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about proteins, ligands, structures, or recent research..."
              className="min-h-[48px] max-h-[200px] resize-none border-0 bg-gray-50 focus:ring-1 focus:ring-gray-200 text-sm rounded-lg placeholder:text-gray-400"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="h-[48px] px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="mt-2 text-xs text-gray-400 px-1">
          Press Enter to send, Shift+Enter for new line
        </div>
      </form>
    </div>
  );
}
