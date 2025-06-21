
import { useState } from "react";
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
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate API delay and show research steps
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Research completed for "${content}". Found relevant data across multiple databases.`,
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
            },
            {
              id: "2L7R",
              name: "Ubiquitin-like protein",
              similarity: "85%",
              organism: "Mus musculus",
              resolution: "2.1 Å",
              description: "Ubiquitin-related modifier protein",
              pdbUrl: "https://www.rcsb.org/structure/2L7R"
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
            },
            {
              id: "CHEMBL789012",
              name: "Proteasome inhibitor",
              activity: "IC50: 8.2 nM",
              description: "Potent inhibitor of 26S proteasome",
              smiles: "CN1CCN(CC1)C2=CC=C(C=C2)C(=O)N",
              targets: ["26S Proteasome", "Ubiquitin pathway"]
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
            },
            {
              title: "Targeting the ubiquitin-proteasome system in cancer therapy",
              authors: "Johnson, M. et al.",
              journal: "bioRxiv",
              year: "2024",
              doi: "10.1101/2024.01.123456",
              abstract: "Novel therapeutic strategies targeting ubiquitin pathways show promise in oncology..."
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
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-md text-gray-600" />
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Research Assistant</h1>
            <p className="text-sm text-gray-500">AI-powered search across PDB, ChEMBL, and scientific literature</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
        {messages.length === 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16">
              <div className="w-12 h-12 rounded bg-gray-900 mx-auto mb-6 flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Start Your Research</h2>
              <p className="text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
                Search across protein databases, chemical libraries, and scientific literature to find comprehensive research insights.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
                <button 
                  onClick={() => handleSendMessage("Find proteins similar to ubiquitin")}
                  className="px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm text-left"
                >
                  Find proteins similar to ubiquitin
                </button>
                <button 
                  onClick={() => handleSendMessage("Show ligands that bind to EGFR")}
                  className="px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm text-left"
                >
                  Show ligands that bind to EGFR
                </button>
                <button 
                  onClick={() => handleSendMessage("Latest papers on GPCR structures")}
                  className="px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm text-left"
                >
                  Latest papers on GPCR structures
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <ResearchSteps />
          )}
        </div>
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
