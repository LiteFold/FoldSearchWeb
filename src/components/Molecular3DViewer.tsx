import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { PluginUIContext } from 'molstar/lib/mol-plugin-ui/context';
import { DefaultPluginUISpec } from 'molstar/lib/mol-plugin-ui/spec';
import { Plugin } from 'molstar/lib/mol-plugin-ui/plugin';
import { createRoot } from 'react-dom/client';
import { Molecule } from 'openchemlib';
import SmilesDrawer from 'smiles-drawer';

interface Molecular3DViewerProps {
  pdbId?: string;
  pdbData?: string;
  smiles?: string;
  type: "protein" | "ligand";
}

export const Molecular3DViewer = forwardRef<any, Molecular3DViewerProps>(({ pdbId, pdbData, smiles, type }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pluginRef = useRef<PluginUIContext | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [use2D, setUse2D] = React.useState(false);

  useImperativeHandle(ref, () => ({
    plugin: pluginRef.current,
    resetView: () => {
      if (pluginRef.current) {
        try {
          pluginRef.current.managers.camera.reset();
          return true;
        } catch (error) {
          console.error('Error resetting view:', error);
          return false;
        }
      }
      return false;
    },
    toggle2D3D: () => {
      if (type === "ligand") {
        setUse2D(!use2D);
      }
    }
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    if (type === "protein") {
      initProteinViewer();
    } else if (type === "ligand") {
      if (use2D) {
        init2DLigandViewer();
      } else {
        init3DLigandViewer();
      }
    }
  }, [pdbId, pdbData, smiles, type, use2D]);

  const initProteinViewer = async () => {
    if (!containerRef.current) return;

    const initPlugin = async () => {
      try {
        if (pluginRef.current) {
          pluginRef.current.dispose();
          pluginRef.current = null;
          containerRef.current!.innerHTML = '';
        }

        // Create simplified Mol* plugin spec
        const spec = {
          ...DefaultPluginUISpec(),
          layout: {
            initial: {
              isExpanded: false,
              showControls: false,
            },
          },
        };

        const plugin = new PluginUIContext(spec);
        await plugin.init();

        pluginRef.current = plugin;

        const pluginContainer = document.createElement('div');
        pluginContainer.style.width = '100%';
        pluginContainer.style.height = '100%';
        containerRef.current!.appendChild(pluginContainer);

        createRoot(pluginContainer).render(<Plugin plugin={plugin} />);

        // Load structure if available
        if (pdbId || pdbData) {
          await loadProteinStructure();
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing Mol* plugin:', error);
        setError('Failed to initialize 3D viewer');
        setIsLoading(false);
      }
    };

    const loadProteinStructure = async () => {
      if (!pluginRef.current) return;

      const plugin = pluginRef.current;

      try {
        await plugin.clear();

        let dataUrl: string;
        let format: 'pdb' | 'mmcif' = 'pdb';

        if (pdbData) {
          // Use provided PDB data
          const blob = new Blob([pdbData], { type: 'text/plain' });
          dataUrl = URL.createObjectURL(blob);
        } else if (pdbId) {
          // Fetch from RCSB PDB
          dataUrl = `https://files.rcsb.org/download/${pdbId}.pdb`;
        } else {
          return;
        }

        const data = await plugin.builders.data.download({ url: dataUrl, isBinary: false });
        const trajectory = await plugin.builders.structure.parseTrajectory(data, format);

        // Apply cartoon representation preset
        await plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default', {
          representationPresetParams: {
            // Only show cartoon representation
            proteinStyle: { name: 'cartoon', params: { alpha: 1.0 } },
            nucleicStyle: { name: 'cartoon', params: { alpha: 1.0 } },
            // Color by chain
            colorTheme: { name: 'chain-id' },
            // Hide ligands and water for simplicity
            showLigand: false,
            showWater: false
          }
        });

        // Center the view
        plugin.managers.camera.reset();

        // Clean up blob URL if created
        if (pdbData && dataUrl.startsWith('blob:')) {
          URL.revokeObjectURL(dataUrl);
        }

      } catch (error) {
        console.error('Error loading protein structure:', error);
        setError('Failed to load protein structure');
      }
    };

    await initPlugin();
  };

  const init3DLigandViewer = async () => {
    if (!containerRef.current || !smiles) return;

    try {
      setIsLoading(true);
      setError(null);

      // Clear container
      containerRef.current.innerHTML = '';

      // Try to use OpenChemLib for 3D coordinates
      try {
        const molecule = Molecule.fromSmiles(smiles);
        
        // Generate SDF format data (OpenChemLib may already have 3D coordinates)
        const sdfData = molecule.toMolfile();

        if (!sdfData) {
          throw new Error('Failed to generate structure data');
        }

        // Initialize Mol* plugin
        const spec = {
          ...DefaultPluginUISpec(),
          layout: {
            initial: {
              isExpanded: false,
              showControls: false,
            },
          },
        };

        const plugin = new PluginUIContext(spec);
        await plugin.init();

        pluginRef.current = plugin;

        const pluginContainer = document.createElement('div');
        pluginContainer.style.width = '100%';
        pluginContainer.style.height = '100%';
        containerRef.current.appendChild(pluginContainer);

        createRoot(pluginContainer).render(<Plugin plugin={plugin} />);

        // Load the SDF data
        const blob = new Blob([sdfData], { type: 'chemical/x-mdl-sdfile' });
        const dataUrl = URL.createObjectURL(blob);

        const data = await plugin.builders.data.download({ url: dataUrl, isBinary: false });
        const trajectory = await plugin.builders.structure.parseTrajectory(data, 'sdf');

        // Apply ball-and-stick representation for small molecules
        await plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default', {
          representationPresetParams: {
            representation: 'ball-and-stick',
            colorTheme: { name: 'element-symbol' },
          }
        });

        // Center the view
        plugin.managers.camera.reset();

        URL.revokeObjectURL(dataUrl);
        setIsLoading(false);
        return;

      } catch (molError) {
        console.error('Error with OpenChemLib 3D conversion:', molError);
        // Fall back to 2D
        throw molError;
      }

    } catch (error) {
      console.error('Error loading 3D ligand structure:', error);
      // Fallback to 2D structure
      setUse2D(true);
    }
  };

  const init2DLigandViewer = async () => {
    if (!containerRef.current || !smiles) return;

    try {
      setIsLoading(true);
      setError(null);

      // Clear container
      containerRef.current.innerHTML = '';

      // Try to use smiles-drawer for 2D visualization
      try {
        // Create a canvas for 2D drawing (more reliable than SVG)
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.objectFit = 'contain';
        canvas.style.backgroundColor = 'white';
        
        containerRef.current.appendChild(canvas);

        // Initialize SmilesDrawer with minimal configuration
        const smilesDrawer = new SmilesDrawer.Drawer({
          width: 400,
          height: 300
        });

        // Parse and draw SMILES
        SmilesDrawer.parse(smiles, function(tree: any) {
          if (tree && canvas) {
            try {
              smilesDrawer.draw(tree, canvas, 'light', false);
              setIsLoading(false);
            } catch (drawError) {
              console.error('Error drawing to canvas:', drawError);
              showFallbackStructure();
            }
          } else {
            console.error('Invalid tree or canvas');
            showFallbackStructure();
          }
        }, function(err: any) {
          console.error('Error parsing SMILES:', err);
          showFallbackStructure();
        });

      } catch (smilesDrawerError) {
        console.error('Error initializing smiles-drawer:', smilesDrawerError);
        showFallbackStructure();
      }

    } catch (error) {
      console.error('Error loading 2D ligand structure:', error);
      showFallbackStructure();
    }
  };

  const showFallbackStructure = () => {
    if (!containerRef.current) return;
    
    setIsLoading(false);
    containerRef.current.innerHTML = '';
    
    const fallbackDiv = document.createElement('div');
    fallbackDiv.className = 'flex items-center justify-center h-full';
    fallbackDiv.innerHTML = `
      <div class="text-center p-4">
        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-500 flex items-center justify-center">
          <span class="text-white font-bold text-lg">⚗️</span>
        </div>
        <p class="text-sm text-gray-600 font-medium mb-1">Chemical Structure</p>
        <p class="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">${smiles}</p>
      </div>
    `;
    containerRef.current.appendChild(fallbackDiv);
  };

  if (error) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-red-50 to-red-100 rounded-lg flex items-center justify-center border-2 border-dashed border-red-200">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-500 flex items-center justify-center">
            <span className="text-white font-bold">!</span>
          </div>
          <p className="text-sm text-red-600 font-medium">
            Failed to load structure
          </p>
          <p className="text-xs text-red-500 mt-1">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-600">
              Loading {type === "protein" ? "protein" : "chemical"} structure...
            </p>
          </div>
        </div>
      )}
      <div 
        ref={containerRef}
        className="w-full h-full absolute inset-0"
      />
      {!isLoading && !error && (
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-2 z-20">
          {type === "protein" ? (
            <span>PDB: {pdbId || 'Custom'}</span>
          ) : (
            <>
              <span>{use2D ? '2D' : '3D'} Structure</span>
              <button
                onClick={() => setUse2D(!use2D)}
                className="ml-1 px-1 py-0.5 bg-white/20 rounded text-xs hover:bg-white/30 transition-colors"
              >
                {use2D ? '3D' : '2D'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
});

Molecular3DViewer.displayName = 'Molecular3DViewer';
