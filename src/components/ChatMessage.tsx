import { Message } from "./ChatInterface";
import { PaperCard } from "./research-cards/PaperCard";
import { ToolSpecificResults } from "./ToolSpecificResults";
import { HighlightedText } from "./HighlightedText";
import { Badge } from "@/components/ui/badge";
import { User, Bot, File, FileText, AlertCircle } from "lucide-react";

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
          <div className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 mt-1 ${
            message.error ? 'bg-red-600' : 'bg-blue-600'
          }`}>
            {message.error ? (
              <AlertCircle className="w-4 h-4 text-white" />
            ) : (
              <Bot className="w-4 h-4 text-white" />
            )}
          </div>
        )}
        
        <div className="flex-1 min-w-0 overflow-hidden">
          {/* Conditional card wrapper for user messages */}
          <div className={message.isUser ? 
            "bg-gray-50/50 border border-gray-100 rounded-xl p-4 shadow-sm" : 
            ""
          }>
            <div className="prose prose-sm max-w-none">
              {/* Use HighlightedText component for better overflow handling and syntax highlighting */}
              <HighlightedText 
                text={message.content}
                maxLength={message.isUser ? 800 : 1200} // Different limits for user vs assistant
                className={message.error ? 'text-red-700' : ''}
              />
            </div>

            {/* Attached Files for User Messages */}
            {message.isUser && message.files && message.files.length > 0 && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
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
                      <span className="text-xs font-medium truncate max-w-32">
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
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">Connection Error</span>
              </div>
              <p className="text-sm text-red-700">
                Unable to connect to the research backend. Please ensure the service is running at http://0.0.0.0:8000
              </p>
            </div>
          )}

          {/* Research Results */}
          {message.researchData && !message.error && (
            <div className="mt-8 space-y-8">
              {/* Tool-Specific Results Section */}
              {message.researchData.toolResults && Object.keys(message.researchData.toolResults).length > 0 && (
                <div className="overflow-hidden"> {/* Add overflow handling */}
                  <ToolSpecificResults 
                    toolResults={message.researchData.toolResults}
                    title="Protein Structure Analysis Results"
                  />
                </div>
              )}

              {/* Research Papers Section - Always in Card Format */}
              {message.researchData.papers && message.researchData.papers.length > 0 && (
                <div className="overflow-hidden"> {/* Add overflow handling */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      Recent Literature ({message.researchData.papers.length})
                    </h3>
                    <Badge variant="outline" className="text-sm">
                      {message.researchData.papers.length} Papers Found
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    {message.researchData.papers.map((paper: any, index: number) => (
                      <PaperCard key={index} paper={paper} />
                    ))}
                  </div>
                </div>
              )}

              {/* Search Summary Card */}


              {/* Empty Results State */}
              {(!message.researchData.toolResults || Object.keys(message.researchData.toolResults).length === 0) &&
               (!message.researchData.papers || message.researchData.papers.length === 0) && (
                <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">No Results Found</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    No research results were found for this query. Try refining your search terms or checking for typos.
                  </p>
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
