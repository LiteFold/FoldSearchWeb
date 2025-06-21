import { Message } from "./ChatInterface";
import { ProteinCard } from "./research-cards/ProteinCard";
import { LigandCard } from "./research-cards/LigandCard";
import { PaperCard } from "./research-cards/PaperCard";
import { Badge } from "@/components/ui/badge";
import { User, Bot, File, FileText } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const getFileIcon = (filename: string) => {
    const extension = filename.toLowerCase().split('.').pop();
    if (['fasta', 'fas', 'fa'].includes(extension || '')) {
      return <FileText className="w-3 h-3" />;
    }
    return <File className="w-3 h-3" />;
  };

  const getFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

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

          {/* Attached Files for User Messages */}
          {message.isUser && message.files && message.files.length > 0 && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">
                  Attached Files ({message.files.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {message.files.map((file, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-2 px-2.5 py-1 bg-white border border-gray-200 text-gray-700"
                  >
                    {getFileIcon(file.name)}
                    <span className="text-xs font-medium">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({getFileSize(file.size)})
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

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
