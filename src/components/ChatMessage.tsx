
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
    <div className={`flex gap-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      {!message.isUser && (
        <div className="w-8 h-8 rounded bg-gray-900 flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-3xl ${message.isUser ? 'order-first' : ''}`}>
        <div className={`p-4 rounded-lg ${
          message.isUser 
            ? 'bg-gray-900 text-white ml-auto max-w-md' 
            : 'bg-white border border-gray-200'
        }`}>
          <p className={`text-sm leading-relaxed ${message.isUser ? 'text-white' : 'text-gray-800'}`}>
            {message.content}
          </p>
        </div>
        
        <div className="text-xs text-gray-400 mt-2 px-4">
          {message.timestamp.toLocaleTimeString()}
        </div>

        {/* Research Results */}
        {message.researchData && (
          <div className="mt-6 space-y-8">
            {/* Proteins Section */}
            {message.researchData.proteins && (
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  Protein Structures ({message.researchData.proteins.length})
                </h3>
                <div className="space-y-3">
                  {message.researchData.proteins.map((protein: any) => (
                    <ProteinCard key={protein.id} protein={protein} />
                  ))}
                </div>
              </div>
            )}

            {/* Ligands Section */}
            {message.researchData.ligands && (
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                  Chemical Compounds ({message.researchData.ligands.length})
                </h3>
                <div className="space-y-3">
                  {message.researchData.ligands.map((ligand: any) => (
                    <LigandCard key={ligand.id} ligand={ligand} />
                  ))}
                </div>
              </div>
            )}

            {/* Papers Section */}
            {message.researchData.papers && (
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                  Recent Literature ({message.researchData.papers.length})
                </h3>
                <div className="space-y-3">
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
        <div className="w-8 h-8 rounded bg-gray-600 flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}
