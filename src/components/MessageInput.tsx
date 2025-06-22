import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Send, Paperclip, X, File } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string, files?: File[]) => void;
  isLoading: boolean;
  disabled?: boolean;
  proteinAgentEnabled?: boolean;
  researchAgentEnabled?: boolean;
  onProteinAgentChange?: (enabled: boolean) => void;
  onResearchAgentChange?: (enabled: boolean) => void;
  connectionStatus?: 'unknown' | 'connected' | 'disconnected';
}

interface UploadedFile {
  file: File;
  id: string;
}

export function MessageInput({ 
  onSendMessage, 
  isLoading, 
  disabled = false,
  proteinAgentEnabled = true,
  researchAgentEnabled = false,
  onProteinAgentChange,
  onResearchAgentChange,
  connectionStatus = 'unknown'
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || uploadedFiles.length > 0) && !isLoading && !disabled) {
      onSendMessage(message.trim(), uploadedFiles.map(uf => uf.file));
      setMessage("");
      setUploadedFiles([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const extension = file.name.toLowerCase().split('.').pop();
      return ['fasta', 'fas', 'fa', 'pdb'].includes(extension || '');
    });

    const newFiles = validFiles.slice(0, 5 - uploadedFiles.length).map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9)
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(uf => uf.id !== id));
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.toLowerCase().split('.').pop();
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
    <TooltipProvider>
      <div className="bg-transparent">
        {/* File Upload Area */}
        {uploadedFiles.length > 0 && (
          <div className="mb-3 p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Uploaded Files ({uploadedFiles.length}/5)
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((uploadedFile) => (
                <Badge
                  key={uploadedFile.id}
                  className="flex items-center gap-2 px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  {getFileIcon(uploadedFile.file.name)}
                  <span className="text-sm font-medium">
                    {uploadedFile.file.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({getFileSize(uploadedFile.file.size)})
                  </span>
                  <button
                    onClick={() => removeFile(uploadedFile.id)}
                    className="ml-1 hover:bg-gray-300 rounded-full p-1 transition-colors"
                  >
                    <X className="w-3 h-3 text-gray-500" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Agent Toggles */}
        <div className="mb-3 flex items-center gap-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Switch
                  checked={proteinAgentEnabled}
                  onCheckedChange={(checked) => {
                    // Protein Search can only be turned off if Research Papers is on
                    if (!checked && !researchAgentEnabled) {
                      return; // Prevent turning off if it's the last enabled agent
                    }
                    onProteinAgentChange?.(checked);
                  }}
                  disabled={connectionStatus !== 'connected'}
                  className="data-[state=checked]:bg-gray-900 data-[state=unchecked]:bg-gray-300 border border-gray-400"
                />
                <span className="text-sm text-gray-700">🧬 Protein Search</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="text-xs">
                <div className="font-medium mb-1">Protein Search Agent</div>
                <div>
                  {proteinAgentEnabled 
                    ? "ON: Searches protein structures, sequences, binding data from PDB, ChEMBL, and AlphaFold databases"
                    : "OFF: Protein structure analysis disabled"
                  }
                </div>
              </div>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Switch
                  checked={researchAgentEnabled}
                  onCheckedChange={(checked) => {
                    // Research Papers can only be turned off if Protein Search is on
                    if (!checked && !proteinAgentEnabled) {
                      return; // Prevent turning off if it's the last enabled agent
                    }
                    onResearchAgentChange?.(checked);
                  }}
                  disabled={connectionStatus !== 'connected'}
                  className="data-[state=checked]:bg-gray-900 data-[state=unchecked]:bg-gray-300 border border-gray-400"
                />
                <span className="text-sm text-gray-700">📚 Research Papers</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="text-xs">
                <div className="font-medium mb-1">Research Paper Search Agent</div>
                <div>
                  {researchAgentEnabled 
                    ? "ON: Searches recent scientific literature from PubMed, bioRxiv, and Google Scholar for papers and insights"
                    : "OFF: Literature search disabled"
                  }
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={disabled ? "Connect to backend to start searching..." : "Ask about proteins, ligands, structures, or recent research..."}
                className="min-h-[48px] max-h-[200px] resize-none border border-gray-200 bg-white focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm rounded-md placeholder:text-gray-400 pr-12 transition-all"
                disabled={isLoading || disabled}
              />
              
              {/* File Upload Button */}
              <div className="absolute right-3 bottom-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".fasta,.fas,.fa,.pdb"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isLoading || disabled || uploadedFiles.length >= 5}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || disabled || uploadedFiles.length >= 5}
                  className="h-6 w-6 p-0 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={(!message.trim() && uploadedFiles.length === 0) || isLoading || disabled}
              className="h-[48px] px-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400 rounded-md font-medium transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Help Text */}
          <div className="mt-2 text-center text-xs text-gray-500">
            Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-600">Enter</kbd> to send • <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-600">Shift+Enter</kbd> for new line • Supports FASTA & PDB files
          </div>
        </form>
      </div>
    </TooltipProvider>
  );
}
