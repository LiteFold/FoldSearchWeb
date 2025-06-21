import { useState, useEffect, useRef } from "react";
import { Search, Wifi, WifiOff } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { MessageInput } from "./MessageInput";
import { ChatMessage } from "./ChatMessage";
import { ResearchSteps } from "./ResearchSteps";
import { useSearch, transformSearchData } from "../hooks/useSearch";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  researchData?: any;
  files?: File[];
  error?: string;
}

interface ChatInterfaceProps {
  onClearMessages?: () => void;
}

export function ChatInterface({ onClearMessages }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const { searchData, loading, error, search, testConnection } = useSearch();

  // Auto-scroll to bottom when messages change or loading state changes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Test connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await testConnection();
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
    };
    checkConnection();
  }, [testConnection]);

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

  // Handle search results
  useEffect(() => {
    if (searchData && !loading) {
      const transformedData = transformSearchData(searchData);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Research completed for "${transformedData.query}". Found ${transformedData.proteinCount} protein structures and ${transformedData.paperCount} research papers. Execution time: ${transformedData.executionTime.toFixed(2)}s.`,
        isUser: false,
        timestamp: new Date(),
        researchData: {
          proteins: transformedData.proteins,
          papers: transformedData.papers,
        }
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }
  }, [searchData, loading]);

  // Handle search errors
  useEffect(() => {
    if (error && !loading) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I encountered an error while searching: ${error}. Please try again or check if the backend service is running at http://0.0.0.0:8000.`,
        isUser: false,
        timestamp: new Date(),
        error: error
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  }, [error, loading]);

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

  const handleTestConnection = async () => {
    const isConnected = await testConnection();
    setConnectionStatus(isConnected ? 'connected' : 'disconnected');
    
    // Add a test message
    const testMessage: Message = {
      id: Date.now().toString(),
      content: `Connection test ${isConnected ? 'successful' : 'failed'}. Backend is ${isConnected ? 'responding' : 'not responding'} at http://0.0.0.0:8000/health`,
      isUser: false,
      timestamp: new Date(),
      error: isConnected ? undefined : 'Connection failed'
    };
    setMessages(prev => [...prev, testMessage]);
  };

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

    // Make API call to backend
    await search({
      query: content,
      include_web: true,
      include_protein: true,
      max_protein_queries: 5
    });
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white px-6 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="hover:bg-gray-50 p-2 rounded-md text-gray-500" />
            <div>
              <h1 className="text-base font-medium text-gray-900">Research Assistant</h1>
              <p className="text-xs text-gray-500">AI-powered search across PDB, ChEMBL, and scientific literature</p>
            </div>
          </div>
          
          {/* Connection Status & Test Button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {connectionStatus === 'connected' ? (
                <Wifi className="w-4 h-4 text-green-600" />
              ) : connectionStatus === 'disconnected' ? (
                <WifiOff className="w-4 h-4 text-red-600" />
              ) : (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              )}
              <span className={`text-xs font-medium ${
                connectionStatus === 'connected' ? 'text-green-600' : 
                connectionStatus === 'disconnected' ? 'text-red-600' : 'text-gray-500'
              }`}>
                {connectionStatus === 'connected' ? 'Connected' : 
                 connectionStatus === 'disconnected' ? 'Disconnected' : 'Testing...'}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestConnection}
              className="text-xs"
            >
              Test Connection
            </Button>
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
              <p className="text-sm text-gray-600 mb-4">
                Search across protein databases, chemical libraries, and scientific literature to find comprehensive research insights.
              </p>
              
              {/* Connection Status Warning */}
              {connectionStatus === 'disconnected' && (
                <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    ⚠️ Backend connection failed. Make sure the server is running at http://0.0.0.0:8000 and CORS is configured for browser requests.
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button 
                  onClick={() => handleSendMessage("Find proteins similar to ubiquitin")}
                  className="px-4 py-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm text-left disabled:opacity-50"
                  disabled={connectionStatus !== 'connected'}
                >
                  Find proteins similar to ubiquitin
                </button>
                <button 
                  onClick={() => handleSendMessage("Show ligands that bind to EGFR")}
                  className="px-4 py-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm text-left disabled:opacity-50"
                  disabled={connectionStatus !== 'connected'}
                >
                  Show ligands that bind to EGFR
                </button>
                <button 
                  onClick={() => handleSendMessage("Latest papers on GPCR structures")}
                  className="px-4 py-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm text-left disabled:opacity-50"
                  disabled={connectionStatus !== 'connected'}
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
            <ResearchSteps isComplete={false} />
          )}
          
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <MessageInput 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading}
            disabled={connectionStatus !== 'connected'}
          />
        </div>
      </div>
    </div>
  );
}
