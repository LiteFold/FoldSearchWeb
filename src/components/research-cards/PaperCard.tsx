import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, BookOpen, Search, Quote, Download, Share2 } from "lucide-react";
import { useState } from "react";

interface PaperCardProps {
  paper: {
    title: string;
    authors: string;
    journal: string;
    year: string;
    doi: string;
    abstract: string;
  };
}

export function PaperCard({ paper }: PaperCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isPreprintJournal = paper.journal.toLowerCase().includes('biorxiv') || paper.journal.toLowerCase().includes('arxiv');
  
  // Simulate a full abstract that's longer than the preview
  const fullAbstract = `${paper.abstract} This study utilized advanced computational methods including molecular dynamics simulations and machine learning algorithms to analyze protein-ligand interactions. The findings reveal novel binding mechanisms that could inform drug design strategies. Statistical analysis was performed using multiple comparison correction and effect size calculations. The implications of these results extend to therapeutic applications in oncology and neurodegenerative diseases, suggesting potential targets for pharmaceutical intervention.`;
  
  const previewAbstract = paper.abstract;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 leading-snug flex-1 pr-4">
              {paper.title}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isPreprintJournal && (
                <Badge variant="outline" className="text-orange-700 border-orange-200 bg-orange-50">
                  Preprint
                </Badge>
              )}
              <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                Open Access
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              {paper.authors}
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="italic font-medium">{paper.journal}</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>{paper.year}</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Impact Factor: 12.3</span>
            </div>
          </div>
        </div>

        {/* Abstract */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Quote className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Abstract</span>
          </div>
          <div className="text-sm text-gray-700 leading-relaxed">
            <p className="mb-3">
              {isExpanded ? fullAbstract : previewAbstract}
            </p>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              {isExpanded ? 'Show less' : 'Read full abstract'}
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 py-4 bg-gray-50 rounded-lg px-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">23</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Citations</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">4.2k</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Views</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">89</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Downloads</div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Keywords:</span>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs">Protein Structure</Badge>
              <Badge variant="outline" className="text-xs">Drug Discovery</Badge>
              <Badge variant="outline" className="text-xs">Molecular Dynamics</Badge>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Related Proteins:</span>
            <span className="text-gray-700">Ubiquitin, E3 Ligase, Proteasome</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <code className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {paper.doi}
            </code>
            
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <BookOpen className="w-4 h-4 mr-2" />
                Read Paper
              </Button>
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Related
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  DOI
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
