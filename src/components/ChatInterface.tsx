import { useState, useEffect, useRef } from "react";
import { Search, Wifi, WifiOff, Sparkles } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { MessageInput } from "./MessageInput";
import { ChatMessage } from "./ChatMessage";
import { ResearchSteps } from "./ResearchSteps";
import { useSearch, transformSearchData, BiologicalAnalysis } from "../hooks/useSearch";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  researchData?: any;
  biologicalAnalysis?: BiologicalAnalysis | null;
  files?: File[];
  error?: string;
}

interface ChatInterfaceProps {
  onClearMessages?: () => void;
}

export function ChatInterface({ onClearMessages }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearchResults, setHasSearchResults] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const [proteinAgentEnabled, setProteinAgentEnabled] = useState(true); // Default on
  const [researchAgentEnabled, setResearchAgentEnabled] = useState(false); // Default off
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const { searchData, loading, error, search, webSearch, proteinSearch, testConnection } = useSearch();

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
      
      // Create summary message with tool statistics
      const toolsUsed = Object.keys(transformedData.toolResults).length;
      const totalStructures = transformedData.proteinCount;
      const papersFound = transformedData.paperCount;
      const hasBiologicalAnalysis = searchData.data.biological_analysis != null;
      
      // Determine if we have meaningful results
      const hasResults = totalStructures > 0 || papersFound > 0 || toolsUsed > 0 || hasBiologicalAnalysis;
      setHasSearchResults(hasResults);
      
      // Create content based on available results
      let content = "";
      if (hasResults) {
        content = `🎉 Search Complete

`;
        if (hasBiologicalAnalysis) {
          content += `🧠 AI Biological Analysis Generated
`;
        }
        
        content += `📊 Results Summary
`;
        
        // Results summary with clean formatting
        if (totalStructures > 0) {
          content += `• 🧬 ${totalStructures.toLocaleString()} protein structures discovered
`;
        }
        if (papersFound > 0) {
          content += `• 📚 ${papersFound} research papers found
`;
        }
        if (toolsUsed > 0) {
          content += `• 🔧 ${transformedData.totalToolsUsed} analysis tools utilized
`;
        }
        
        content += `
⚡ Performance: ${transformedData.executionTime.toFixed(1)}s execution time`;
      } else {
        content = `❌ Search Complete - No Results

🔍 No matching results found for your query

💡 Suggestions:
• Try different keywords or search terms
• Check spelling and formatting
• Use broader or more specific queries
• Verify connection to databases`;
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content,
        isUser: false,
        timestamp: new Date(),
        biologicalAnalysis: searchData.data.biological_analysis || null,
        researchData: hasResults ? {
          toolResults: transformedData.toolResults,
          papers: transformedData.papers
        } : undefined
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }
  }, [searchData, loading]);

  // Handle search errors
  useEffect(() => {
    if (error && !loading) {
      setHasSearchResults(false); // No results due to error
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I encountered an error while searching: ${error}. Please try again or check if the backend service is running at https://foldsearch-production.up.railway.app.`,
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
      content: `Connection test ${isConnected ? 'successful' : 'failed'}. Backend is ${isConnected ? 'responding' : 'not responding'} at https://foldsearch-production.up.railway.app/health`,
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

    // Determine which API endpoint to use based on toggle state
    if (proteinAgentEnabled && researchAgentEnabled) {
      // Both enabled - use combined search
      await search({
        query: content,
        include_web: true,
        include_protein: true,
        max_protein_queries: 8
      });
    } else if (researchAgentEnabled && !proteinAgentEnabled) {
      // Only research agent enabled - use web search
      await webSearch(content);
    } else if (proteinAgentEnabled && !researchAgentEnabled) {
      // Only protein agent enabled - use protein search
      await proteinSearch(content);
    } else {
      // Neither enabled - show error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Please enable at least one agent (Protein Search or Research Paper Search) to perform a search.",
        isUser: false,
        timestamp: new Date(),
        error: "No agents enabled"
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-md text-gray-600 transition-colors" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Research Assistant</h1>
              <p className="text-sm text-gray-500">AI-powered molecular & literature search</p>
            </div>
          </div>
          
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            {connectionStatus === 'connected' ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                <Wifi className="w-4 h-4" />
                Connected
              </div>
            ) : connectionStatus === 'disconnected' ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-sm font-medium">
                <WifiOff className="w-4 h-4" />
                Disconnected
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                Testing...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto scroll-smooth"
        style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 transparent'
        }}
      >
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center p-6">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-12 h-12 rounded-md bg-gray-100 mx-auto mb-6 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-gray-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Start Your Research</h2>
              <p className="text-gray-600 mb-6 text-base">
                Search protein databases and scientific literature with AI-powered analysis
              </p>
              
              {/* Connection Status Warning */}
              {connectionStatus === 'disconnected' && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-sm text-amber-800">
                    ⚠️ Backend connection failed. Service may be starting up...
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button 
                  onClick={() => handleSendMessage("CRISPR Cas9 high fidelity variants with enhanced specificity")}
                  className="p-3 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm text-left disabled:opacity-50 border border-gray-200 shadow-sm"
                  disabled={connectionStatus !== 'connected' || (!proteinAgentEnabled && !researchAgentEnabled)}
                >
                  <div className="font-medium mb-1">CRISPR Cas9</div>
                  <div className="text-gray-500">High fidelity variants</div>
                </button>
                <button 
                  onClick={() => handleSendMessage("Show ligands that bind to EGFR receptor")}
                  className="p-3 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm text-left disabled:opacity-50 border border-gray-200 shadow-sm"
                  disabled={connectionStatus !== 'connected' || (!proteinAgentEnabled && !researchAgentEnabled)}
                >
                  <div className="font-medium mb-1">EGFR Ligands</div>
                  <div className="text-gray-500">Receptor binding analysis</div>
                </button>
                <button 
                  onClick={() => handleSendMessage("Latest papers on GPCR structure determination")}
                  className="p-3 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm text-left disabled:opacity-50 border border-gray-200 shadow-sm"
                  disabled={connectionStatus !== 'connected' || (!proteinAgentEnabled && !researchAgentEnabled)}
                >
                  <div className="font-medium mb-1">GPCR Structures</div>
                  <div className="text-gray-500">Recent literature</div>
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
            <ResearchSteps 
              isComplete={false} 
              hasResults={hasSearchResults}
              searchType={
                proteinAgentEnabled && researchAgentEnabled ? 'combined' :
                researchAgentEnabled && !proteinAgentEnabled ? 'web' :
                proteinAgentEnabled && !researchAgentEnabled ? 'protein' : 
                'combined'
              }
            />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <MessageInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            disabled={connectionStatus !== 'connected'}
            proteinAgentEnabled={proteinAgentEnabled}
            researchAgentEnabled={researchAgentEnabled}
            onProteinAgentChange={setProteinAgentEnabled}
            onResearchAgentChange={setResearchAgentEnabled}
            connectionStatus={connectionStatus}
          />
        </div>
      </div>
    </div>
  );
}

