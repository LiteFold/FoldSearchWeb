import React from "react";
import { ExpandableResultsTable } from "./ExpandableResultsTable";
import { PerToolResultsTable } from "./PerToolResultsTable";
import { ProteinToolResult } from "@/types/search-results";

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
    id: "CHEMBL25",
    name: "Aspirin",
    description: "Non-steroidal anti-inflammatory drug (NSAID) used for pain relief and inflammation reduction.",
    smiles: "CC(=O)OC1=CC=CC=C1C(=O)O",
    chemblId: "CHEMBL25",
    activity: "IC50: 12.5 µM",
    similarity: "95%",
    status: "Success" as const,
    created: "2025-01-09T16:45:00Z",
    properties: {
      molecularWeight: 180.16,
      logP: 1.19,
      hba: 4,
      hbd: 1
    },
    targets: ["COX-1", "COX-2"]
  },
  {
    id: "CHEMBL112",
    name: "Caffeine",
    description: "Central nervous system stimulant that blocks adenosine receptors.",
    smiles: "CN1C=NC2=C1C(=O)N(C(=O)N2C)C",
    chemblId: "CHEMBL112",
    activity: "Ki: 8.2 µM",
    similarity: "88%",
    status: "Success" as const,
    created: "2025-01-08T12:30:00Z",
    properties: {
      molecularWeight: 194.19,
      logP: -0.07,
      hba: 6,
      hbd: 0
    },
    targets: ["ADORA1", "ADORA2A"]
  }
];

// Comprehensive sample tool results demonstrating all 10 tool types
const comprehensiveToolResults: ProteinToolResult[] = [
  // 1. Search Structures Tool
  {
    tool_name: "search_structures_tool",
    success: true,
    execution_time: 1.23,
    timestamp: "2025-01-10T10:30:00Z",
    query_params: {
      query: "insulin",
      limit: 100,
      organism: null,
      method: null,
      max_resolution: null
    },
    pdb_ids: ["1BOM", "1BZV", "2FHW", "4INS", "5ENA"],
    total_count: 508,
    returned_count: 100,
    scores: {
      "1BOM": 1.0,
      "1BZV": 0.999,
      "2FHW": 0.987,
      "4INS": 0.965,
      "5ENA": 0.945
    },
    search_query: "insulin",
    organism: null,
    method: null,
    max_resolution: null
  },

  // 2. Search by Sequence Tool
  {
    tool_name: "search_by_sequence_tool",
    success: true,
    execution_time: 2.45,
    timestamp: "2025-01-10T10:32:30Z",
    query_params: {
      sequence: "MALWMRLLPLLALLALWGPDPAAAFVNQHLCGSHLVEALYLVCGERGFFYTPKTRREAEDLQVGQVELGGGPGAGSLQPLALEGSLQKRGIVEQCCTSICSLYQLENYCN",
      sequence_type: "protein",
      identity_cutoff: 0.5,
      evalue_cutoff: 1.0
    },
    pdb_ids: ["4INS", "3W11", "1ZNI", "5ENA"],
    total_count: 24,
    returned_count: 24,
    scores: {
      "4INS": 0.98,
      "3W11": 0.95,
      "1ZNI": 0.89,
      "5ENA": 0.85
    },
    sequence: "MALWMRLLPLLALLALWGPDPAAAFVNQHLCGSHLVEALYLVCGERGFFYTPKTRREAEDLQVGQVELGGGPGAGSLQPLALEGSLQKRGIVEQCCTSICSLYQLENYCN",
    sequence_type: "protein",
    identity_cutoff: 0.5,
    evalue_cutoff: 1.0
  },

  // 3. Search by Structure Tool
  {
    tool_name: "search_by_structure_tool",
    success: true,
    execution_time: 3.12,
    timestamp: "2025-01-10T10:35:42Z",
    query_params: {
      reference_pdb_ids: ["1UBQ"],
      assembly_id: "1",
      match_type: "relaxed"
    },
    pdb_ids: ["2D3A", "1CMX", "3NS8", "2K6D"],
    total_count: 45,
    returned_count: 25,
    reference_pdb_ids: ["1UBQ"],
    assembly_id: "1", 
    match_type: "relaxed",
    by_reference: {
      "1UBQ": {
        pdb_ids: ["2D3A", "1CMX", "3NS8", "2K6D"],
        total_count: 45,
        scores: {
          "2D3A": 0.92,
          "1CMX": 0.88,
          "3NS8": 0.83,
          "2K6D": 0.79
        }
      }
    }
  },

  // 4. Search by Chemical Tool
  {
    tool_name: "search_by_chemical_tool",
    success: true,
    execution_time: 1.87,
    timestamp: "2025-01-10T10:37:29Z",
    query_params: {
      chemical_identifier: "C10H16N5O13P3",
      identifier_type: "SMILES",
      ligand_name: "ATP",
      match_type: "graph-relaxed"
    },
    pdb_ids: ["5ATP", "6GTP", "7ADP", "1ATP", "2ATP"],
    total_count: 156,
    returned_count: 50,
    scores: {
      "5ATP": 1.0,
      "6GTP": 0.89,
      "7ADP": 0.76,
      "1ATP": 0.98,
      "2ATP": 0.94
    },
    chemical_identifier: "C10H16N5O13P3",
    identifier_type: "SMILES",
    ligand_name: "ATP",
    match_type: "graph-relaxed"
  },

  // 5. High Quality Structures Tool
  {
    tool_name: "get_high_quality_structures_tool",
    success: true,
    execution_time: 0.95,
    timestamp: "2025-01-10T10:38:24Z",
    query_params: {
      max_resolution: 2.0,
      max_r_work: 0.25,
      max_r_free: 0.28,
      method: "X-RAY DIFFRACTION",
      min_year: 2000
    },
    pdb_ids: ["5D8V", "1EJG", "3P4J", "7BNF", "6M0J"],
    total_count: 89,
    returned_count: 89,
    scores: {
      "5D8V": 0.95,
      "1EJG": 0.93,
      "3P4J": 0.91,
      "7BNF": 0.89,
      "6M0J": 0.87
    },
    max_resolution: 2.0,
    max_r_work: 0.25,
    max_r_free: 0.28,
    method: "X-RAY DIFFRACTION",
    min_year: 2000
  },

  // 6. Structure Details Tool
  {
    tool_name: "get_structure_details_tool",
    success: true,
    execution_time: 1.34,
    timestamp: "2025-01-10T10:39:58Z",
    query_params: {
      pdb_ids: ["1UBQ", "4INS"],
      include_assembly: true
    },
    pdb_ids: ["1UBQ", "4INS"],
    structure_details: {
      "1UBQ": {
        pdb_id: "1UBQ",
        title: "Ubiquitin at 1.8 Angstroms resolution",
        method: "X-RAY DIFFRACTION",
        resolution_A: 1.8,
        r_work: 0.19,
        r_free: 0.23,
        space_group: "P 21 21 21",
        deposition_date: "1998-01-07",
        organisms: ["Homo sapiens"],
        ligands: [],
        quality_score: "Excellent"
      },
      "4INS": {
        pdb_id: "4INS",
        title: "Insulin structure complex",
        method: "X-RAY DIFFRACTION",
        resolution_A: 2.1,
        r_work: 0.21,
        r_free: 0.26,
        space_group: "P 1",
        deposition_date: "2012-11-15",
        organisms: ["Homo sapiens"],
        ligands: ["ZN", "MG"],
        quality_score: "Good"
      }
    },
    include_assembly: true
  },

  // 7. Sequences Tool
  {
    tool_name: "get_sequences_tool",
    success: true,
    execution_time: 0.67,
    timestamp: "2025-01-10T10:40:25Z",
    query_params: {
      pdb_ids: ["1UBQ", "4INS"],
      entity_ids: ["1"]
    },
    pdb_ids: ["1UBQ", "4INS"],
    sequences: {
      "1UBQ_1": {
        pdb_id: "1UBQ",
        entity_id: "1",
        sequence: "MQIFVKTLTGKTITLEVEPSDTIENVKAKIQDKEGIPPDQQRLIFAGKQLEDGRTLSDYNIQKESTLHLVLRLRGG",
        sequence_length: 76,
        sequence_type: "Protein",
        molecule_type: "Protein"
      },
      "4INS_1": {
        pdb_id: "4INS", 
        entity_id: "1",
        sequence: "MALWMRLLPLLALLALWGPDPAAAFVNQHLCGSHLVEALYLVCGERGFFYTPKTRREAEDLQVGQVELGGGPGAGSLQPLALEGSLQKRGIVEQCCTSICSLYQLENYCN",
        sequence_length: 108,
        sequence_type: "Protein",
        molecule_type: "Protein"
      }
    },
    entity_ids: ["1"]
  },

  // 8. Compare Structures Tool
  {
    tool_name: "compare_structures_tool",
    success: true,
    execution_time: 2.18,
    timestamp: "2025-01-10T10:42:43Z",
    query_params: {
      pdb_ids: ["1UBQ", "4INS", "1BOM"],
      comparison_type: "both"
    },
    comparison_type: "both",
    comparisons: {
      "1UBQ_4INS": {
        pdb_pair: "1UBQ_4INS",
        sequence_identity: 0.12,
        length_difference: 32,
        structural_similarity: 0.35,
        comparison_note: "Different protein families, limited similarity"
      },
      "1UBQ_1BOM": {
        pdb_pair: "1UBQ_1BOM",
        sequence_identity: 0.08,
        length_difference: 45,
        structural_similarity: 0.28,
        comparison_note: "Unrelated structures"
      },
      "4INS_1BOM": {
        pdb_pair: "4INS_1BOM",
        sequence_identity: 0.95,
        length_difference: 2,
        structural_similarity: 0.97,
        comparison_note: "Nearly identical insulin variants"
      }
    }
  },

  // 9. Analyze Interactions Tool
  {
    tool_name: "analyze_interactions_tool",
    success: true,
    execution_time: 1.93,
    timestamp: "2025-01-10T10:44:36Z",
    query_params: {
      pdb_ids: ["5ATP", "4INS"],
      interaction_type: "all"
    },
    interaction_type: "all",
    interactions: {
      "5ATP": {
        pdb_id: "5ATP",
        protein_chains: ["A", "B"],
        ligands: ["ATP", "MG"],
        interactions: [
          {
            type: "protein-ligand",
            description: "ATP binding site interaction with Mg2+ coordination"
          },
          {
            type: "protein-protein",
            description: "Dimer interface interactions"
          }
        ],
        quaternary_structure: {
          oligomeric_state: "dimer",
          oligomeric_count: 2
        }
      },
      "4INS": {
        pdb_id: "4INS",
        protein_chains: ["A", "B"],
        ligands: ["ZN"],
        interactions: [
          {
            type: "protein-ligand",
            description: "Zinc coordination in insulin hexamer"
          }
        ],
        quaternary_structure: {
          oligomeric_state: "hexamer",
          oligomeric_count: 6
        }
      }
    }
  },

  // 10. Structural Summary Tool
  {
    tool_name: "get_structural_summary_tool",
    success: true,
    execution_time: 1.76,
    timestamp: "2025-01-10T10:46:12Z",
    query_params: {
      pdb_ids: ["1UBQ", "4INS"],
      include_quality_metrics: true
    },
    include_quality_metrics: true,
    summaries: {
      "1UBQ": {
        pdb_id: "1UBQ",
        title: "Ubiquitin - regulatory protein",
        experimental: {
          method: "X-RAY DIFFRACTION",
          resolution_A: 1.8,
          space_group: "P 21 21 21"
        },
        composition: {
          protein_entities: 1,
          total_entities: 1,
          ligands: 0,
          unique_organisms: 1
        },
        biological_assembly: {
          oligomeric_state: "monomer"
        },
        research_relevance: {
          has_ligands: false,
          is_complex: false,
          high_resolution: true
        },
        quality: {
          quality_score: "Excellent",
          resolution_A: 1.8,
          r_work: 0.19,
          r_free: 0.23
        },
        organisms: ["Homo sapiens"]
      },
      "4INS": {
        pdb_id: "4INS",
        title: "Insulin hormone complex",
        experimental: {
          method: "X-RAY DIFFRACTION",
          resolution_A: 2.1,
          space_group: "P 1"
        },
        composition: {
          protein_entities: 2,
          total_entities: 4,
          ligands: 2,
          unique_organisms: 1
        },
        biological_assembly: {
          oligomeric_state: "hexamer"
        },
        research_relevance: {
          has_ligands: true,
          is_complex: true,
          high_resolution: true
        },
        quality: {
          quality_score: "Good",
          resolution_A: 2.1,
          r_work: 0.21,
          r_free: 0.26
        },
        organisms: ["Homo sapiens"]
      }
    }
  },

  // 11. Failed Tool Example
  {
    tool_name: "search_by_sequence_tool",
    success: false,
    execution_time: 0.12,
    timestamp: "2025-01-10T10:47:00Z",
    query_params: {
      sequence: "INVALID_SEQUENCE_WITH_NUMBERS123",
      sequence_type: "protein",
      identity_cutoff: 0.9,
      evalue_cutoff: 0.001
    },
    error_message: "Invalid sequence format - sequence contains non-standard amino acid characters",
    warnings: ["Sequence should only contain standard amino acid letters (A-Z)"]
  }
];

export function ExpandableResultsDemo() {
  return (
    <div className="space-y-8">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Protein Search Tools Demo
        </h1>
        <p className="text-gray-600 mb-8">
          This demonstrates the complete per-tool results display system with all 10 protein search tools. 
          Each tool has specialized display formats, viewers, and error handling.
        </p>
        
        {/* Comprehensive Per-Tool Results Display */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Per-Tool Results Display (Complete)</h2>
          <p className="text-gray-600 mb-6">
            Each tool execution is displayed separately with tool-specific metadata, specialized tables, 
            3D structure viewers, sequence viewers, and appropriate error handling.
          </p>
          <PerToolResultsTable 
            toolResults={comprehensiveToolResults}
            title="Complete Protein Search Tool Results"
          />
        </div>

        {/* Legacy Combined Results Display */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Combined Results Display (Legacy)</h2>
          <p className="text-gray-600 mb-6">
            Traditional combined view of protein and ligand results for backward compatibility.
          </p>
          <ExpandableResultsTable
            proteins={sampleProteins}
            ligands={sampleLigands}
            title="Combined Comparison Results"
            showPagination={true}
          />
        </div>
      </div>
    </div>
  );
} 