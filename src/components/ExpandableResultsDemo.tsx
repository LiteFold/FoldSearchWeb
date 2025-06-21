import React from "react";
import { ExpandableResultsTable } from "./ExpandableResultsTable";

// Sample data that mimics the comparison results from the screenshots
const sampleProteins = [
  {
    id: "1UBQ",
    name: "Ubiquitin",
    organism: "Homo sapiens",
    similarity: "98%",
    tmScore: 0.9876,
    rmsd: 1.2345,
    status: "Success" as const,
    created: "2025-01-10T10:30:00Z",
    resolution: "1.8 Å",
    description: "Small regulatory protein found in almost all tissues. Essential for protein degradation and cellular regulation.",
    pdbUrl: "https://www.rcsb.org/structure/1UBQ",
    sequence: "MQIFVKTLTGKTITLEVEPSDTIENVKAKIQDKEGIPPDQQRLIFAGKQLEDGRTLSDYNIQKESTLHLVLRLRGG",
    length: 76,
    method: "X-ray diffraction"
  },
  {
    id: "2XYZ",
    name: "Alpha-synuclein",
    organism: "Homo sapiens",
    similarity: "85%",
    tmScore: 0.7543,
    rmsd: 2.8765,
    status: "Success" as const,
    created: "2025-01-09T14:20:00Z",
    resolution: "2.1 Å",
    description: "Protein involved in synaptic vesicle trafficking and neurotransmitter release. Associated with Parkinson's disease.",
    pdbUrl: "https://www.rcsb.org/structure/2XYZ",
    sequence: "MDVFMKGLSKAKEGVVAAAEKTKQGVAEAAGKTKEGVLYVGSKTKEGVVHGVATVAEKTKEQVTNVGGAVVTGVTAVAQKTVEGAGSIAAATGFVKKDQLGKNEEGAPQEGILEDMPVDPDNEAYEMPSEEGYQDYEPEA",
    length: 140,
    method: "NMR spectroscopy"
  },
  {
    id: "3ABC",
    name: "Lysozyme",
    organism: "Gallus gallus",
    similarity: "92%",
    tmScore: 0.8912,
    rmsd: 1.5678,
    status: "Success" as const,
    created: "2025-01-08T09:15:00Z",
    resolution: "1.5 Å",
    description: "Antimicrobial enzyme that cleaves peptidoglycan in bacterial cell walls. Model protein for structural studies.",
    pdbUrl: "https://www.rcsb.org/structure/3ABC",
    sequence: "KVFGRCELAAAMKRHGLDNYRGYSLGNWVCAAKFESNFNTQATNRNTDGSTDYGILQINSRWWCNDGRTPGSRNLCNIPCSALLSSDITASVNCAKKIVSDGNGMNAWVAWRNRCKGTDVQAWIRGCRL",
    length: 129,
    method: "X-ray diffraction"
  }
];

const sampleLigands = [
  {
    id: "CHEMBL123456",
    name: "Sorafenib",
    chemblId: "CHEMBL628",
    activity: "IC50: 12.5 µM",
    similarity: "94%",
    status: "Success" as const,
    created: "2025-01-10T16:45:00Z",
    description: "Multi-kinase inhibitor used in cancer treatment. Targets VEGFR, PDGFR, and RAF kinases.",
    smiles: "CNC(=O)C1=CC=CC=C1NC(=O)NC2=CC(=C(C=C2)Cl)C(F)(F)F",
    properties: {
      molecularWeight: 464.8,
      logP: 3.8,
      hba: 7,
      hbd: 3
    },
    targets: ["VEGFR-2", "VEGFR-3", "PDGFR-β", "RAF-1"]
  },
  {
    id: "CHEMBL789012",
    name: "Imatinib",
    chemblId: "CHEMBL941",
    activity: "IC50: 0.6 µM",
    similarity: "89%",
    status: "Success" as const,
    created: "2025-01-09T11:30:00Z",
    description: "Tyrosine kinase inhibitor used to treat chronic myelogenous leukemia and gastrointestinal stromal tumors.",
    smiles: "CC1=C(C=C(C=C1)NC(=O)C2=CC=C(C=C2)CN3CCN(CC3)C)NC4=NC=CC(=N4)C5=CN=CC=C5",
    properties: {
      molecularWeight: 493.6,
      logP: 3.0,
      hba: 8,
      hbd: 2
    },
    targets: ["BCR-ABL", "c-KIT", "PDGFR-α"]
  },
  {
    id: "CHEMBL345678",
    name: "Gefitinib",
    chemblId: "CHEMBL939",
    activity: "IC50: 33 nM",
    similarity: "91%",
    status: "Success" as const,
    created: "2025-01-07T13:20:00Z",
    description: "EGFR tyrosine kinase inhibitor used in non-small cell lung cancer treatment.",
    smiles: "COC1=C(C=C2C(=C1)N=CN=C2NC3=CC(=C(C=C3)F)Cl)OCCCN4CCOCC4",
    properties: {
      molecularWeight: 446.9,
      logP: 3.7,
      hba: 7,
      hbd: 1
    },
    targets: ["EGFR", "HER2"]
  }
];

export function ExpandableResultsDemo() {
  return (
    <div className="space-y-8">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Expandable Results Table Demo
        </h1>
        <p className="text-gray-600 mb-8">
          This demonstrates the expandable table component with sample protein and ligand data. 
          Click on any row to expand and see detailed information including interactive molecular viewers.
        </p>
        
        <ExpandableResultsTable
          proteins={sampleProteins}
          ligands={sampleLigands}
          title="Comparison Results"
          showPagination={true}
        />
      </div>
    </div>
  );
} 