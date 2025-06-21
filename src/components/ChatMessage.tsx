import { Message } from "./ChatInterface";
import { ProteinCard } from "./research-cards/ProteinCard";
import { LigandCard } from "./research-cards/LigandCard";
import { PaperCard } from "./research-cards/PaperCard";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 py-8 ${message.isUser ? 'bg-white' : 'bg-gray-50'}`}>
      <div className="w-full max-w-6xl mx-auto flex gap-4 px-6">
        {!message.isUser && (
          <div className="w-8 h-8 rounded-sm bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
            <Bot className="w-4 h-4 text-white" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="prose prose-sm max-w-none">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>

          {/* Research Results */}
          {message.researchData && (
            <div className="mt-8 space-y-8">
              {/* Proteins Section */}
              {message.researchData.proteins && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Protein Structures ({message.researchData.proteins.length})
                  </h3>
                  <div className="space-y-4">
                    {message.researchData.proteins.map((protein: any) => (
                      <ProteinCard key={protein.id} protein={protein} />
                    ))}
                  </div>
                </div>
              )}

              {/* Ligands Section */}
              {message.researchData.ligands && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Chemical Compounds ({message.researchData.ligands.length})
                  </h3>
                  <div className="space-y-4">
                    {message.researchData.ligands.map((ligand: any) => (
                      <LigandCard key={ligand.id} ligand={ligand} />
                    ))}
                  </div>
                </div>
              )}

              {/* Papers Section */}
              {message.researchData.papers && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    Recent Literature ({message.researchData.papers.length})
                  </h3>
                  <div className="space-y-4">
                    {message.researchData.papers.map((paper: any, index: number) => (
                      <PaperCard key={index} paper={paper} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {message.isUser && (
          <div className="w-8 h-8 rounded-sm bg-gray-700 flex items-center justify-center flex-shrink-0 mt-1">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
