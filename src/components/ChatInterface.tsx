import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MessageInput } from "./MessageInput";
import { ChatMessage } from "./ChatMessage";
import { ResearchSteps } from "./ResearchSteps";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  researchData?: any;
  steps?: string[];
  files?: File[];
}

interface ChatInterfaceProps {
  onClearMessages?: () => void;
}

export function ChatInterface({ onClearMessages }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or loading state changes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Error loading messages from localStorage:', error);
      }
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
    if (onClearMessages) {
      onClearMessages();
    }
  };

  // Expose clearMessages function to parent component
  useEffect(() => {
    if (onClearMessages) {
      (window as any).clearChatMessages = clearMessages;
    }
  }, [onClearMessages]);

  const handleSendMessage = async (content: string, files?: File[]) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
      files: files || [],
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate API delay and show research steps
    setTimeout(() => {
      const fileInfo = files && files.length > 0 
        ? ` (with ${files.length} uploaded file${files.length > 1 ? 's' : ''}: ${files.map(f => f.name).join(', ')})`
        : '';
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Research completed for "${content}"${fileInfo}. Found relevant data across multiple databases.`,
        isUser: false,
        timestamp: new Date(),
        steps: [
          "Searching RCSB PDB for protein structures...",
          "Running sequence similarity search with MMseqs2...",
          "Querying ChEMBL for known ligands...",
          "Fetching recent literature from PubMed and bioRxiv...",
          "Analyzing structural homologs with Foldseek...",
          "Compiling comprehensive research summary..."
        ],
        researchData: {
          proteins: [
            {
              id: "1UBQ",
              name: "Ubiquitin",
              similarity: "98%",
              organism: "Homo sapiens",
              resolution: "1.8 Å",
              description: "Small regulatory protein found in almost all tissues",
              pdbUrl: "https://www.rcsb.org/structure/1UBQ"
            }
          ],
          ligands: [
            {
              id: "CHEMBL123456",
              name: "Ubiquitin-targeting compound",
              activity: "IC50: 12.5 µM",
              description: "Small molecule inhibitor of ubiquitin binding",
              smiles: "CC1=CC=C(C=C1)NC(=O)C2=CC=CC=C2",
              targets: ["Ubiquitin", "E3 ligase"]
            }
          ],
          papers: [
            {
              title: "Recent advances in ubiquitin structure and function",
              authors: "Smith, J. et al.",
              journal: "Nature Structural Biology",
              year: "2024",
              doi: "10.1038/s41594-024-001234",
              abstract: "Recent structural studies have revealed new insights into ubiquitin's regulatory mechanisms..."
            }
          ]
        }
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white px-6 py-3">
        <div className="flex items-center gap-3 max-w-6xl mx-auto">
          <SidebarTrigger className="hover:bg-gray-50 p-2 rounded-md text-gray-500" />
          <div>
            <h1 className="text-base font-medium text-gray-900">Research Assistant</h1>
            <p className="text-xs text-gray-500">AI-powered search across PDB, ChEMBL, and scientific literature</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 md:px-6 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="max-w-2xl mx-auto px-6 text-center">
              <div className="w-10 h-10 rounded-lg bg-blue-600 mx-auto mb-6 flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Start Your Research</h2>
              <p className="text-sm text-gray-600 mb-8">
                Search across protein databases, chemical libraries, and scientific literature to find comprehensive research insights.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button 
                  onClick={() => handleSendMessage("Find proteins similar to ubiquitin")}
                  className="px-4 py-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm text-left"
                >
                  Find proteins similar to ubiquitin
                </button>
                <button 
                  onClick={() => handleSendMessage("Show ligands that bind to EGFR")}
                  className="px-4 py-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm text-left"
                >
                  Show ligands that bind to EGFR
                </button>
                <button 
                  onClick={() => handleSendMessage("Latest papers on GPCR structures")}
                  className="px-4 py-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm text-left"
                >
                  Latest papers on GPCR structures
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="max-w-6xl mx-auto py-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <ResearchSteps />
          )}
          
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
