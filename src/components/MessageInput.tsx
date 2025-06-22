import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Paperclip, X, File } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string, files?: File[]) => void;
  isLoading: boolean;
  disabled?: boolean;
}

interface UploadedFile {
  file: File;
  id: string;
}

export function MessageInput({ onSendMessage, isLoading, disabled = false }: MessageInputProps) {
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
    <div className="bg-transparent">
      {/* File Upload Area */}
      {uploadedFiles.length > 0 && (
        <div className="mb-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700">
              Uploaded Files ({uploadedFiles.length}/5)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((uploadedFile) => (
              <Badge
                key={uploadedFile.id}
                className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                {getFileIcon(uploadedFile.file.name)}
                <span className="text-sm font-medium">
                  {uploadedFile.file.name}
                </span>
                <span className="text-xs text-slate-500">
                  ({getFileSize(uploadedFile.file.size)})
                </span>
                <button
                  onClick={() => removeFile(uploadedFile.id)}
                  className="ml-1 hover:bg-slate-300 rounded-full p-1 transition-colors"
                >
                  <X className="w-3 h-3 text-slate-500" />
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
              placeholder={disabled ? "Connect to backend to start searching..." : "Ask about proteins, ligands, structures, or recent research..."}
              className="min-h-[56px] max-h-[200px] resize-none border-2 border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm rounded-2xl placeholder:text-slate-400 pr-14 transition-all"
              disabled={isLoading || disabled}
            />
            
            {/* File Upload Button */}
            <div className="absolute right-4 bottom-4">
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
                className="h-8 w-8 p-0 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={(!message.trim() && uploadedFiles.length === 0) || isLoading || disabled}
            className="h-[56px] px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:bg-slate-100 disabled:text-slate-400 rounded-2xl font-medium transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Help Text */}
        <div className="mt-3 text-center text-xs text-slate-500">
          Press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">Enter</kbd> to send • <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">Shift+Enter</kbd> for new line • Supports FASTA & PDB files
        </div>
      </form>
    </div>
  );
}
