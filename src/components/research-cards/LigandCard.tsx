import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Molecular3DViewer } from "@/components/Molecular3DViewer";
import { Download, Search, ExternalLink, Database, Copy, FlaskConical } from "lucide-react";

interface LigandCardProps {
  ligand: {
    id: string;
    name: string;
    description: string;
    smiles?: string;
    chemblId?: string;
    activity?: string;
    properties?: {
      molecularWeight?: number;
      logP?: number;
      hba?: number;
      hbd?: number;
    };
    targets?: string[];
  };
}

export function LigandCard({ ligand }: LigandCardProps) {
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
                  {ligand.name}
                </h3>
                <div className="flex items-center gap-2">
                  {ligand.chemblId && (
                    <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50">
                      {ligand.chemblId}
                    </Badge>
                  )}
                  {ligand.activity && (
                    <Badge variant="outline" className="text-orange-700 border-orange-200 bg-orange-50">
                      {ligand.activity}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {ligand.description}
            </p>
          </div>

          {/* Chemical Properties */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Molecular Weight</span>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {ligand.properties?.molecularWeight || '342.4'} g/mol
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">LogP</span>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {ligand.properties?.logP || '2.1'}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">H-bond Acceptors</span>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {ligand.properties?.hba || '4'}
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">H-bond Donors</span>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {ligand.properties?.hbd || '2'}
                </p>
              </div>
            </div>
          </div>

          {/* SMILES */}
          {ligand.smiles && (
            <div className="bg-gray-50 rounded-lg p-4">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">SMILES Notation</span>
              <code className="text-xs font-mono bg-white px-3 py-2 rounded border block break-all">
                {ligand.smiles}
              </code>
            </div>
          )}

          {/* Targets */}
          {ligand.targets && ligand.targets.length > 0 && (
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Known Targets</span>
              <div className="flex flex-wrap gap-2">
                {ligand.targets.map((target, index) => (
                  <Badge key={index} variant="outline" className="text-xs text-gray-700 border-gray-200 bg-gray-50">
                    {target}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Bioactivity</span>
              <p className="text-sm text-gray-700 mt-1">Active against 5 protein targets</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Drug-likeness</span>
              <p className="text-sm text-gray-700 mt-1">Passes Lipinski's rule of five</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Clinical Status</span>
              <p className="text-sm text-gray-700 mt-1">Preclinical development</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                <Download className="w-4 h-4 mr-2" />
                Download SDF
              </Button>
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Find Similar
              </Button>
              <Button variant="outline" size="sm">
                <Database className="w-4 h-4 mr-2" />
                ChEMBL
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                Copy SMILES
              </Button>
              <Button variant="ghost" size="sm">
                <FlaskConical className="w-4 h-4 mr-2" />
                Assay Data
              </Button>
              <Button variant="ghost" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                PubChem
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Structure Viewer */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col">
        <div className="p-4 border-b border-gray-100 flex-shrink-0">
          <h4 className="text-sm font-medium text-gray-900">2D/3D Structure</h4>
          <p className="text-xs text-gray-500 mt-1">Interactive chemical structure</p>
        </div>
        <div className="flex-1 bg-white border border-slate-200 relative overflow-hidden">
          {ligand.smiles ? (
            <Molecular3DViewer
              smiles={ligand.smiles}
              type="ligand"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-sm text-gray-400">No structure available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
