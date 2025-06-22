import { Message } from "./ChatInterface";
import { PaperCard } from "./research-cards/PaperCard";
import { ToolSpecificResults } from "./ToolSpecificResults";
import { HighlightedText } from "./HighlightedText";
import { BiologicalAnalysisCard } from "./BiologicalAnalysisCard";
import { Badge } from "@/components/ui/badge";
import { User, Bot, File, FileText, AlertCircle, Sparkles } from "lucide-react";

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
    <div className={`py-6 ${message.isUser ? 'bg-transparent' : 'bg-gray-50/50'}`}>
      <div className="w-full max-w-6xl mx-auto flex gap-4 px-6">
        {!message.isUser && (
          <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${
            message.error ? 'bg-red-500' : 'bg-gray-700'
          }`}>
            {message.error ? (
              <AlertCircle className="w-4 h-4 text-white" />
            ) : (
              <Sparkles className="w-4 h-4 text-white" />
            )}
          </div>
        )}
        
        <div className="flex-1 min-w-0 overflow-hidden">
          {/* User message wrapper */}
          <div className={message.isUser ? 
            "bg-white border border-gray-200 rounded-lg p-4 shadow-sm" : 
            ""
          }>
            <div className="prose prose-slate max-w-none">
              <HighlightedText 
                text={message.content}
                maxLength={message.isUser ? 800 : 1200}
                className={message.error ? 'text-red-700' : message.isUser ? 'text-gray-800' : 'text-gray-700'}
              />
            </div>

            {/* Attached Files for User Messages */}
            {message.isUser && message.files && message.files.length > 0 && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Attached Files ({message.files.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {message.files.map((file, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700"
                    >
                      {getFileIcon(file.name)}
                      <span className="text-sm font-medium truncate max-w-32">
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
          </div>

          {/* Error State */}
          {message.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">Connection Error</span>
              </div>
              <p className="text-sm text-red-700">
                Unable to connect to the research backend. Please ensure the service is running at https://foldsearch-production.up.railway.app
              </p>
            </div>
          )}

          {/* Research Results */}
          {(message.researchData || message.biologicalAnalysis) && !message.error && (
            <div className="mt-6 space-y-6">
              {/* Biological Analysis Section - Show First */}
              {message.biologicalAnalysis && (
                <div className="overflow-hidden">
                  <BiologicalAnalysisCard analysis={message.biologicalAnalysis} />
                </div>
              )}

              {/* Tool-Specific Results Section */}
              {message.researchData?.toolResults && Object.keys(message.researchData.toolResults).length > 0 && (
                <div className="overflow-hidden">
                  <ToolSpecificResults 
                    toolResults={message.researchData.toolResults}
                    title="Analysis Results"
                  />
                </div>
              )}

              {/* Research Papers Section */}
              {message.researchData?.papers && message.researchData.papers.length > 0 && (
                <div className="overflow-hidden">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Literature</h3>
                      <p className="text-sm text-gray-500">{message.researchData.papers.length} papers found</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {message.researchData.papers.map((paper: any, index: number) => (
                      <PaperCard key={index} paper={paper} />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty Results State */}
              {!message.biologicalAnalysis &&
               (!message.researchData?.toolResults || Object.keys(message.researchData.toolResults).length === 0) &&
               (!message.researchData?.papers || message.researchData.papers.length === 0) && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">No Results Found</span>
                  </div>
                  <p className="text-sm text-amber-700">
                    No research results were found for this query. Try refining your search terms or checking for typos.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {message.isUser && (
          <div className="w-8 h-8 rounded-md bg-gray-700 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
