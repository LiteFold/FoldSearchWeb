import React from 'react';
import { Molecular3DViewer } from './Molecular3DViewer';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

export function SmilesTest() {
  const [selectedSmiles, setSelectedSmiles] = React.useState<string>('');

  const testMolecules = [
    { name: 'Aspirin', smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O' },
    { name: 'Caffeine', smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C' },
    { name: 'Ethanol', smiles: 'CCO' },
    { name: 'Benzene', smiles: 'C1=CC=CC=C1' },
    { name: 'Glucose', smiles: 'C([C@@H]1[C@H]([C@@H]([C@H]([C@H](O1)O)O)O)O)O' }
  ];

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SMILES Visualization Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Test Molecules:</label>
              <div className="flex flex-wrap gap-2">
                {testMolecules.map((molecule) => (
                  <Button
                    key={molecule.name}
                    variant={selectedSmiles === molecule.smiles ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSmiles(molecule.smiles)}
                  >
                    {molecule.name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="custom-smiles" className="block text-sm font-medium mb-2">
                Or enter custom SMILES:
              </label>
              <input
                id="custom-smiles"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter SMILES string..."
                value={selectedSmiles}
                onChange={(e) => setSelectedSmiles(e.target.value)}
              />
            </div>

            {selectedSmiles && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Visualization:</h3>
                <Molecular3DViewer
                  smiles={selectedSmiles}
                  type="ligand"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 