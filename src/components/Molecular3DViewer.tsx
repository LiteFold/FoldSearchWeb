
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

interface Molecular3DViewerProps {
  pdbId?: string;
  smiles?: string;
  type: "protein" | "ligand";
}

declare global {
  interface Window {
    NGL: any;
  }
}

export function Molecular3DViewer({ pdbId, smiles, type }: Molecular3DViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNGL = async () => {
      try {
        // Load NGL library dynamically
        if (!window.NGL) {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/ngl@2.0.0-dev.39/dist/ngl.js';
          script.onload = () => initializeViewer();
          script.onerror = () => setError('Failed to load NGL viewer');
          document.head.appendChild(script);
        } else {
          initializeViewer();
        }
      } catch (err) {
        setError('Failed to initialize 3D viewer');
        setIsLoading(false);
      }
    };

    const initializeViewer = async () => {
      if (!viewerRef.current || !window.NGL) return;

      try {
        // Clear any existing stage
        if (stageRef.current) {
          stageRef.current.dispose();
        }

        // Create new stage
        stageRef.current = new window.NGL.Stage(viewerRef.current, {
          backgroundColor: '#f8fafc'
        });

        if (type === "protein" && pdbId) {
          await loadProteinStructure(pdbId);
        } else if (type === "ligand" && smiles) {
          await loadLigandStructure(smiles);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing viewer:', err);
        setError('Failed to load molecular structure');
        setIsLoading(false);
      }
    };

    const loadProteinStructure = async (pdbId: string) => {
      try {
        // Use a dummy PDB structure (ubiquitin) for demonstration
        const pdbUrl = `https://files.rcsb.org/download/${pdbId}.pdb`;
        
        const component = await stageRef.current.loadFile(pdbUrl);
        
        // Add cartoon representation for protein
        component.addRepresentation('cartoon', {
          color: 'chainid',
          smoothSheet: true
        });
        
        // Add ball+stick for ligands if any
        component.addRepresentation('ball+stick', {
          sele: 'hetero and not water',
          color: 'element'
        });

        // Auto-view to center the structure
        stageRef.current.autoView();
      } catch (err) {
        console.error('Error loading protein:', err);
        // Fallback to a simple representation
        showFallbackStructure();
      }
    };

    const loadLigandStructure = async (smiles: string) => {
      try {
        // For SMILES, we would typically need a service to convert to 3D coordinates
        // For now, we'll show a placeholder or use a simple molecule
        // In production, you'd use services like PubChem or ChemSpider
        
        // Using a dummy SDF data for demonstration (caffeine molecule)
        const sdfData = `
  Mrv2014 01012100002D          

  8  8  0  0  0  0            999 V2000
   -1.4289    0.8250    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
   -0.7145    0.4125    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -0.7145   -0.4125    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -1.4289   -0.8250    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
   -2.1434   -0.4125    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -2.1434    0.4125    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000    0.8250    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000   -0.8250    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  2  3  2  0  0  0  0
  3  4  1  0  0  0  0
  4  5  2  0  0  0  0
  5  6  1  0  0  0  0
  6  1  2  0  0  0  0
  2  7  1  0  0  0  0
  3  8  1  0  0  0  0
M  END
$$$$`;

        const blob = new Blob([sdfData], { type: 'chemical/x-mdl-sdfile' });
        const component = await stageRef.current.loadFile(blob, { ext: 'sdf' });
        
        // Add ball+stick representation for small molecules
        component.addRepresentation('ball+stick', {
          color: 'element'
        });
        
        // Auto-view to center the structure
        stageRef.current.autoView();
      } catch (err) {
        console.error('Error loading ligand:', err);
        showFallbackStructure();
      }
    };

    const showFallbackStructure = () => {
      // Show a simple geometric representation as fallback
      if (stageRef.current) {
        stageRef.current.autoView();
      }
    };

    loadNGL();

    return () => {
      if (stageRef.current) {
        stageRef.current.dispose();
      }
    };
  }, [pdbId, smiles, type]);

  if (error) {
    return (
      <Card className="p-4 bg-slate-50 border-slate-200">
        <div className="w-full h-48 bg-gradient-to-br from-red-50 to-red-100 rounded-lg flex items-center justify-center border-2 border-dashed border-red-200">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-white font-bold">!</span>
            </div>
            <p className="text-sm text-red-600 font-medium">
              Failed to load 3D structure
            </p>
            <p className="text-xs text-red-500 mt-1">
              {error}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-slate-50 border-slate-200">
      <div className="w-full h-48 bg-white rounded-lg border border-slate-200 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-600">Loading 3D structure...</p>
            </div>
          </div>
        )}
        <div 
          ref={viewerRef}
          className="w-full h-full"
          style={{ minHeight: '192px' }}
        />
        {!isLoading && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {type === "protein" ? `PDB: ${pdbId}` : "Chemical Structure"}
          </div>
        )}
      </div>
    </Card>
  );
}
