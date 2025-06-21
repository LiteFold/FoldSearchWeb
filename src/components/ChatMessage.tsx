
import { Message } from "./ChatInterface";
import { ProteinCard } from "./research-cards/ProteinCard";
import { LigandCard } from "./research-cards/LigandCard";
import { PaperCard } from "./research-cards/PaperCard";
import { User, Settings } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex gap-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      {!message.isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
          <Settings className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-4xl ${message.isUser ? 'order-first' : ''}`}>
        <div className={`p-4 rounded-2xl ${
          message.isUser 
            ? 'bg-blue-600 text-white ml-auto max-w-md' 
            : 'bg-white border border-slate-200 shadow-sm'
        }`}>
          <p className={message.isUser ? 'text-white' : 'text-slate-800'}>{message.content}</p>
        </div>
        
        <div className="text-xs text-slate-500 mt-2 px-4">
          {message.timestamp.toLocaleTimeString()}
        </div>

        {/* Research Results */}
        {message.researchData && (
          <div className="mt-6 space-y-6">
            {/* Proteins Section */}
            {message.researchData.proteins && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Similar Proteins ({message.researchData.proteins.length})
                </h3>
                <div className="grid gap-4">
                  {message.researchData.proteins.map((protein: any) => (
                    <ProteinCard key={protein.id} protein={protein} />
                  ))}
                </div>
              </div>
            )}

            {/* Ligands Section */}
            {message.researchData.ligands && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  Known Ligands ({message.researchData.ligands.length})
                </h3>
                <div className="grid gap-4">
                  {message.researchData.ligands.map((ligand: any) => (
                    <LigandCard key={ligand.id} ligand={ligand} />
                  ))}
                </div>
              </div>
            )}

            {/* Papers Section */}
            {message.researchData.papers && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  Recent Literature ({message.researchData.papers.length})
                </h3>
                <div className="grid gap-4">
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
        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}
