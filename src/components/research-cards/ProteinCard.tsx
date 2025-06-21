import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Download, Search, Database, Copy, BookOpen } from "lucide-react";
import { Molecular3DViewer } from "../Molecular3DViewer";

interface ProteinCardProps {
  protein: {
    id: string;
    name: string;
    similarity: string;
    organism: string;
    resolution: string;
    description: string;
    pdbUrl: string;
  };
}

export function ProteinCard({ protein }: ProteinCardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Metadata and Actions Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {protein.name}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                    {protein.id}
                  </Badge>
                  <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50">
                    {protein.similarity} match
                  </Badge>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {protein.description}
            </p>
          </div>

          {/* Structural Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Resolution</span>
                <p className="text-sm font-semibold text-gray-900 mt-1">{protein.resolution}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Method</span>
                <p className="text-sm font-semibold text-gray-900 mt-1">X-ray diffraction</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Organism</span>
                <p className="text-sm font-semibold text-gray-900 mt-1 italic">{protein.organism}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Length</span>
                <p className="text-sm font-semibold text-gray-900 mt-1">76 residues</p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Function</span>
              <p className="text-sm text-gray-700 mt-1">Post-translational modification, protein degradation</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Disease Relevance</span>
              <p className="text-sm text-gray-700 mt-1">Cancer, neurodegenerative diseases</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Drug Targets</span>
              <p className="text-sm text-gray-700 mt-1">3 known compounds targeting this protein</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Download PDB
              </Button>
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Find Similar
              </Button>
              <Button variant="outline" size="sm">
                <Database className="w-4 h-4 mr-2" />
                UniProt
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                Copy FASTA
              </Button>
              <Button variant="ghost" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Literature
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href={protein.pdbUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View in RCSB
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Structure Viewer */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col">
        <div className="p-4 border-b border-gray-100 flex-shrink-0">
          <h4 className="text-sm font-medium text-gray-900">3D Structure</h4>
          <p className="text-xs text-gray-500 mt-1">Interactive molecular viewer</p>
        </div>
        <div className="flex-1 bg-white border border-slate-200 relative overflow-hidden">
          <Molecular3DViewer pdbId={protein.id} type="protein" />
        </div>
      </div>
    </div>
  );
}
