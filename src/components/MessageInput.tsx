import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Paperclip, X, File } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string, files?: File[]) => void;
  isLoading: boolean;
}

interface UploadedFile {
  file: File;
  id: string;
}

export function MessageInput({ onSendMessage, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || uploadedFiles.length > 0) && !isLoading) {
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
    <div className="border-t border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-4">
        {/* File Upload Area */}
        {uploadedFiles.length > 0 && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">
                Uploaded Files ({uploadedFiles.length}/5)
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((uploadedFile) => (
                <Badge
                  key={uploadedFile.id}
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50"
                >
                  {getFileIcon(uploadedFile.file.name)}
                  <span className="text-xs font-medium">
                    {uploadedFile.file.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({getFileSize(uploadedFile.file.size)})
                  </span>
                  <button
                    onClick={() => removeFile(uploadedFile.id)}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3 text-gray-500" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about proteins, ligands, structures, or recent research..."
                className="min-h-[52px] max-h-[200px] resize-none border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm rounded-lg placeholder:text-gray-400 pr-12"
                disabled={isLoading}
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
                  disabled={isLoading || uploadedFiles.length >= 5}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || uploadedFiles.length >= 5}
                  className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={(!message.trim() && uploadedFiles.length === 0) || isLoading}
              className="h-[52px] px-5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 rounded-lg font-medium transition-colors"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Help Text */}
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>Supports FASTA (.fasta, .fas, .fa) and PDB (.pdb) files • Max 5 files</span>
          </div>
        </form>
      </div>
    </div>
  );
}
