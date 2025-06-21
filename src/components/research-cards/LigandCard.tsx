
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Molecular3DViewer } from "../Molecular3DViewer";

interface LigandCardProps {
  ligand: {
    id: string;
    name: string;
    activity: string;
    description: string;
    smiles: string;
    targets: string[];
  };
}

export function LigandCard({ ligand }: LigandCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="border border-slate-200 hover:border-emerald-300 transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="font-semibold text-slate-900">{ligand.name}</h4>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                {ligand.id}
              </Badge>
              <Badge variant="outline" className="text-orange-700 border-orange-200">
                {ligand.activity}
              </Badge>
            </div>
            <p className="text-sm text-slate-600 mb-2">{ligand.description}</p>
            <div className="flex flex-wrap gap-1">
              {ligand.targets.map((target, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {target}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-1" />
              ChEMBL
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
                  <h5 className="font-medium text-slate-900 mb-3">Chemical Properties</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">ChEMBL ID:</span>
                      <span className="font-mono">{ligand.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Activity:</span>
                      <span className="text-orange-600 font-medium">{ligand.activity}</span>
                    </div>
                    <div className="mt-3">
                      <span className="text-slate-600 block mb-1">SMILES:</span>
                      <div className="bg-slate-50 p-2 rounded text-xs font-mono break-all">
                        {ligand.smiles}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h6 className="font-medium text-slate-900 mb-2">Quick Actions</h6>
                    <div className="flex gap-2 flex-wrap">
                      <Button variant="outline" size="sm">Download SDF</Button>
                      <Button variant="outline" size="sm">Similar Compounds</Button>
                      <Button variant="outline" size="sm">ZINC Search</Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-slate-900 mb-3">2D/3D Structure</h5>
                  <Molecular3DViewer smiles={ligand.smiles} type="ligand" />
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
