
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

  return (
    <Card className="border border-slate-200 hover:border-purple-300 transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="font-semibold text-slate-900 leading-tight">{paper.title}</h4>
              {isPreprintJournal && (
                <Badge variant="outline" className="text-orange-700 border-orange-200 text-xs">
                  Preprint
                </Badge>
              )}
            </div>
            <div className="text-sm text-slate-600 mb-1">
              <span className="font-medium">{paper.authors}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span className="italic">{paper.journal}</span>
              <span>•</span>
              <span>{paper.year}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1" />
                DOI
              </a>
            </Button>
            
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>
      </CardHeader>
      
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="border-t border-slate-100 pt-4">
              <h5 className="font-medium text-slate-900 mb-3">Abstract</h5>
              <p className="text-sm text-slate-700 leading-relaxed mb-4">
                {paper.abstract}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  DOI: {paper.doi}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Save to Library</Button>
                  <Button variant="outline" size="sm">Related Papers</Button>
                  <Button variant="outline" size="sm">Cite</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
