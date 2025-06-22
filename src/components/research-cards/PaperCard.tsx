import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, BookOpen, Quote } from "lucide-react";
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
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="space-y-5">
        {/* Header */}
        <div>
          <div className="flex items-start gap-4 mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 leading-snug mb-2">
                {paper.title}
              </h3>
              <p className="text-sm text-slate-600 mb-2">
                {paper.authors}
              </p>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span className="font-medium">{paper.journal}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span>{paper.year}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {isPreprintJournal && (
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                  Preprint
                </Badge>
              )}
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                Open Access
              </Badge>
            </div>
          </div>
        </div>

        {/* Abstract */}
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Quote className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-700">Abstract</span>
          </div>
          <div className="text-sm text-slate-700 leading-relaxed">
            <p className="mb-3">
              {isExpanded ? fullAbstract : previewAbstract}
            </p>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              {isExpanded ? 'Show less' : 'Read full abstract'}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <code className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
            {paper.doi}
          </code>
          
          <div className="flex gap-2">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <BookOpen className="w-4 h-4 mr-2" />
              Read Paper
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
