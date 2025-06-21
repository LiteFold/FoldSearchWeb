
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="border border-slate-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="font-semibold text-slate-900">{protein.name}</h4>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                {protein.id}
              </Badge>
              <Badge variant="outline" className="text-emerald-700 border-emerald-200">
                {protein.similarity} similar
              </Badge>
            </div>
            <p className="text-sm text-slate-600 mb-2">{protein.description}</p>
            <div className="flex gap-4 text-sm text-slate-500">
              <span><strong>Organism:</strong> {protein.organism}</span>
              <span><strong>Resolution:</strong> {protein.resolution}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={protein.pdbUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1" />
                PDB
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
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-slate-900 mb-3">Structural Details</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">PDB ID:</span>
                      <span className="font-mono">{protein.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Resolution:</span>
                      <span>{protein.resolution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Organism:</span>
                      <span className="italic">{protein.organism}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Sequence Identity:</span>
                      <span className="text-emerald-600 font-medium">{protein.similarity}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h6 className="font-medium text-slate-900 mb-2">Quick Actions</h6>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Download PDB</Button>
                      <Button variant="outline" size="sm">View in PyMOL</Button>
                      <Button variant="outline" size="sm">Sequence</Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-slate-900 mb-3">3D Structure Preview</h5>
                  <Molecular3DViewer pdbId={protein.id} type="protein" />
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
