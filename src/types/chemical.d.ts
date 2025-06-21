declare module 'openchemlib' {
  export class Molecule {
    static fromSmiles(smiles: string): Molecule;
    static cHelperCIP: number;
    ensureHelperArrays(helper: number): void;
    getConformer(index?: number): any;
    toMolfile(): string;
  }
}

declare module 'smiles-drawer' {
  export default class SmilesDrawer {
    constructor(options?: any);
    
    static parse(smiles: string, success: (tree: any) => void, error: (err: any) => void): void;
    
    static Drawer: new (options?: {
      width?: number;
      height?: number;
      bondThickness?: number;
      bondLength?: number;
      shortBondLength?: number;
      bondSpacing?: number;
      atomVisualization?: string;
      isomeric?: boolean;
      debug?: boolean;
      terminalCarbons?: boolean;
      explicitHydrogens?: boolean;
      overlapSensitivity?: number;
      overlapResolutionIterations?: number;
      compactDrawing?: boolean;
      fontFamily?: string;
      fontSize?: number;
      fontSizeLarge?: number;
      padding?: number;
      experimental?: boolean;
      themes?: {
        [key: string]: {
          [element: string]: string;
        };
      };
    }) => {
      draw(tree: any, canvas: HTMLCanvasElement, theme: string, infoOnly: boolean): void;
    };
  }
} 