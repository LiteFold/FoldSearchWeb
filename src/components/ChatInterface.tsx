
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
        content: `I found comprehensive research data for "${content}". Here are the results from multiple databases:`,
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
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg" />
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Protein & Drug Design Research</h1>
            <p className="text-sm text-slate-600">AI-powered search across PDB, ChEMBL, and scientific literature</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Start Your Research</h2>
            <p className="text-slate-600 max-w-md mx-auto">
              Ask about proteins, ligands, or drug targets. I'll search across multiple databases and provide comprehensive research insights.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <button 
                onClick={() => handleSendMessage("Find proteins similar to ubiquitin")}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
              >
                Find proteins similar to ubiquitin
              </button>
              <button 
                onClick={() => handleSendMessage("Show ligands that bind to EGFR")}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
              >
                Show ligands that bind to EGFR
              </button>
              <button 
                onClick={() => handleSendMessage("Latest papers on GPCR structures")}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
              >
                Latest papers on GPCR structures
              </button>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <ResearchSteps />
        )}
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
