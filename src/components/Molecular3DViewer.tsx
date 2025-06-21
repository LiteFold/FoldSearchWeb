
import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

interface Molecular3DViewerProps {
  pdbId?: string;
  smiles?: string;
  type: "protein" | "ligand";
}

export function Molecular3DViewer({ pdbId, smiles, type }: Molecular3DViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This is a placeholder for NGL or Mol* viewer integration
    // In a real implementation, you would initialize the 3D viewer here
    console.log(`Initializing ${type} viewer for:`, pdbId || smiles);
  }, [pdbId, smiles, type]);

  return (
    <Card className="p-4 bg-slate-50 border-slate-200">
      <div 
        ref={viewerRef}
        className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300"
      >
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold">3D</span>
          </div>
          <p className="text-sm text-slate-600 font-medium">
            {type === "protein" ? "Protein Structure" : "Molecular Structure"}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {pdbId ? `PDB: ${pdbId}` : "Chemical Structure"}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            NGL/Mol* viewer placeholder
          </p>
        </div>
      </div>
    </Card>
  );
}
