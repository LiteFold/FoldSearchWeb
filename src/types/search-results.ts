// Updated API interfaces based on backend documentation

export interface ResearchPaper {
  title: string;
  url: string;
  abstract: string;
}

export interface WebResearch {
  query: string;
  raw_result: string;
  research_paper: {
    search_result: ResearchPaper[];
  };
  upnext_queries: string[];
}

// Base protein search result interface (common fields)
export interface BaseProteinSearchResult {
  tool_name: string;
  success: boolean;
  execution_time: number;
  timestamp: string;
  query_params: Record<string, any>;
  error_message?: string;
  warnings?: string[];
  pdb_ids?: string[];
  total_count?: number;
  returned_count?: number;
  scores?: Record<string, number>;
}

// Structure information interface
export interface StructureInfo {
  pdb_id: string;
  title?: string;
  method?: string;
  resolution_A?: number;
  r_work?: number;
  r_free?: number;
  space_group?: string;
  deposition_date?: string;
  organisms?: string[];
  ligands?: string[];
  entities?: any[];
  assembly?: any;
  quality_score?: string;
}

// Sequence information interface
export interface SequenceInfo {
  pdb_id: string;
  entity_id: string;
  sequence?: string;
  sequence_length?: number;
  sequence_type?: string;
  molecule_type?: string;
}

// Tool-specific result interfaces
export interface SearchStructuresResult extends BaseProteinSearchResult {
  tool_name: "search_structures_tool";
  search_query?: string;
  organism?: string;
  method?: string;
  max_resolution?: number;
}

export interface SearchBySequenceResult extends BaseProteinSearchResult {
  tool_name: "search_by_sequence_tool";
  sequence?: string;
  sequence_type?: string;
  identity_cutoff?: number;
  evalue_cutoff?: number;
}

export interface SearchByStructureResult extends BaseProteinSearchResult {
  tool_name: "search_by_structure_tool";
  reference_pdb_ids?: string[];
  assembly_id?: string;
  match_type?: string;
  by_reference?: Record<string, {
    pdb_ids: string[];
    total_count: number;
    scores: Record<string, number>;
  }>;
}

export interface SearchByChemicalResult extends BaseProteinSearchResult {
  tool_name: "search_by_chemical_tool";
  chemical_identifier?: string;
  identifier_type?: string;
  ligand_name?: string;
  match_type?: string;
}

export interface GetHighQualityStructuresResult extends BaseProteinSearchResult {
  tool_name: "get_high_quality_structures_tool";
  max_resolution?: number;
  max_r_work?: number;
  max_r_free?: number;
  method?: string;
  min_year?: number;
}

export interface GetStructureDetailsResult extends BaseProteinSearchResult {
  tool_name: "get_structure_details_tool";
  structure_details: Record<string, StructureInfo>;
  include_assembly: boolean;
}

export interface GetSequencesResult extends BaseProteinSearchResult {
  tool_name: "get_sequences_tool";
  sequences: Record<string, SequenceInfo>;
  entity_ids?: string[];
}

export interface ComparisonInfo {
  pdb_pair: string;
  sequence_identity?: number;
  length_difference?: number;
  structural_similarity?: number;
  comparison_note?: string;
}

export interface CompareStructuresResult extends BaseProteinSearchResult {
  tool_name: "compare_structures_tool";
  comparison_type: string;
  comparisons: Record<string, ComparisonInfo>;
  summary?: any;
}

export interface InteractionInfo {
  pdb_id: string;
  protein_chains: string[];
  ligands: string[];
  interactions: any[];
  quaternary_structure?: any;
}

export interface AnalyzeInteractionsResult extends BaseProteinSearchResult {
  tool_name: "analyze_interactions_tool";
  interaction_type: string;
  interactions: Record<string, InteractionInfo>;
}

export interface StructuralSummaryInfo {
  pdb_id: string;
  title?: string;
  experimental?: any;
  composition?: any;
  biological_assembly?: any;
  research_relevance?: any;
  quality?: any;
  organisms?: string[];
}

export interface GetStructuralSummaryResult extends BaseProteinSearchResult {
  tool_name: "get_structural_summary_tool";
  include_quality_metrics: boolean;
  summaries: Record<string, StructuralSummaryInfo>;
}

// Union type for all tool results
export type ProteinToolResult =
  | SearchStructuresResult
  | SearchBySequenceResult
  | SearchByStructureResult
  | SearchByChemicalResult
  | GetHighQualityStructuresResult
  | GetStructureDetailsResult
  | GetSequencesResult
  | CompareStructuresResult
  | AnalyzeInteractionsResult
  | GetStructuralSummaryResult
  | BaseProteinSearchResult;

// Protein search response interface
export interface ProteinSearchResponse {
  query: string;
  tool_results: ProteinToolResult[];
  total_tools_used: number;
  successful_tools: number;
  failed_tools: number;
  total_execution_time: number;
  timestamp: string;
  success: boolean;
}

// Main search data interface
export interface SearchData {
  query: string;
  web_research?: WebResearch;
  protein_search?: ProteinSearchResponse;
  search_type: "combined" | "web" | "protein" | "none";
  timestamp: string;
  success: boolean;
  error_message?: string;
}

// Main API response interface
export interface SearchResponse {
  success: boolean;
  message: string;
  data: SearchData;
  execution_time: number;
  timestamp: string;
}

export interface SearchRequest {
  query: string;
  include_web?: boolean;
  include_protein?: boolean;
  max_protein_queries?: number;
}

export interface SearchHook {
  searchData: SearchResponse | null;
  loading: boolean;
  error: string | null;
  search: (request: SearchRequest) => Promise<void>;
  testConnection: () => Promise<boolean>;
} 