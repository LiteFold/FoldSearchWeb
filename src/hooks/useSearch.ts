import { useState } from "react";

// Environment-based API URL configuration
// Set to development mode - change to false for production
const IS_DEVELOPMENT = true;

const API_BASE_URL = IS_DEVELOPMENT 
  ? "http://0.0.0.0:8000" 
  : "https://foldsearch-production.up.railway.app";

console.log(`🔗 API Base URL: ${API_BASE_URL} (${IS_DEVELOPMENT ? 'Development' : 'Production'} mode)`);

// API Interfaces based on updated backend documentation
interface ResearchPaper {
  title: string;
  url: string;
  abstract: string;
}

interface WebSearchTool {
  query: string;
  raw_result: string;
  research_paper: {
    search_result: ResearchPaper[];
  };
  upnext_queries: string[];
}

interface ProteinStructureInfo {
  pdb_id: string;
  title: string;
  method: string;
  resolution_A: number;
  r_work: number;
  r_free: number;
  space_group: string;
  deposition_date: string;
  organisms: string[];
  protein_chains: string[];
  ligands: string[];
  entities: any[];
  assembly: any;
  quality_score: string;
  sequence: string;
  sequence_length: number;
  molecule_type: string;
  score: number;
}

interface BaseProteinSearchResult {
  tool_name: string;
  success: boolean;
  execution_time: number;
  timestamp: string;
  query_params: Record<string, any>;
  error_message: string;
  warnings: string[];
  structures: ProteinStructureInfo[];
  pdb_ids: string[];
  total_count: number;
  returned_count: number;
  scores: Record<string, number>;
  search_metadata: Record<string, any>;
}

export interface BiologicalAnalysis {
  query: string;
  analysis_type: string;
  analysis_text: string;
  timestamp: string;
  processing_time: number;
}

interface CombinedSearchResult {
  query: string;
  tool_results: Record<string, any>; // Tool name -> Tool result
  search_type: "combined" | "web" | "protein" | "none";
  timestamp: string;
  success: boolean;
  error_message: string;
  total_tools_used: number;
  successful_tools: number;
  failed_tools: number;
  total_execution_time: number;
  biological_analysis?: BiologicalAnalysis | null;
}

interface SearchResponse {
  success: boolean;
  message: string;
  data: CombinedSearchResult;
  execution_time: number;
  timestamp: string;
}

interface SearchRequest {
  query: string;
  include_web?: boolean;
  include_protein?: boolean;
  max_protein_queries?: number;
}

interface SearchHook {
  searchData: SearchResponse | null;
  loading: boolean;
  error: string | null;
  search: (request: SearchRequest) => Promise<void>;
  webSearch: (query: string) => Promise<void>;
  proteinSearch: (query: string) => Promise<void>;
  testConnection: () => Promise<boolean>;
}

export const useSearch = (): SearchHook => {
  const [searchData, setSearchData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });
      return response.ok;
    } catch (err) {
      console.error("Connection test failed:", err);
      return false;
    }
  };

  const search = async (request: SearchRequest) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Making API request to:", `${API_BASE_URL}/search`);
      console.log("Request payload:", JSON.stringify(request, null, 2));

      // Test connection first
      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error("Cannot connect to backend health endpoint");
      }

      const response = await fetch(`${API_BASE_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(request),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      const data: SearchResponse = await response.json();
      console.log("API Response:", data);
      setSearchData(data);
    } catch (err) {
      console.error("Search error:", err);
      let errorMessage = "An error occurred";
      
      if (err instanceof Error) {
        if (err.message.includes("Failed to fetch")) {
          errorMessage = "CORS or network error. The backend may need CORS configuration for browser requests.";
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const webSearch = async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Making web search API request to:", `${API_BASE_URL}/web-search`);
      console.log("Request payload:", JSON.stringify({ query }, null, 2));

      // Test connection first
      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error("Cannot connect to backend health endpoint");
      }

      const response = await fetch(`${API_BASE_URL}/web-search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      console.log("Web Search API Response:", data);
      
      // Transform web search response to match SearchResponse format
      const transformedData: SearchResponse = {
        success: data.success,
        message: data.message,
        data: {
          query: data.data?.query || query,
          tool_results: {
            web_search_tool: data.data
          },
          search_type: "web",
          timestamp: data.timestamp,
          success: data.success,
          error_message: data.success ? "" : data.message,
          total_tools_used: 1,
          successful_tools: data.success ? 1 : 0,
          failed_tools: data.success ? 0 : 1,
          total_execution_time: data.execution_time,
          biological_analysis: data.data?.biological_analysis || null
        },
        execution_time: data.execution_time,
        timestamp: data.timestamp
      };
      
      setSearchData(transformedData);
    } catch (err) {
      console.error("Web search error:", err);
      let errorMessage = "An error occurred";
      
      if (err instanceof Error) {
        if (err.message.includes("Failed to fetch")) {
          errorMessage = "CORS or network error. The backend may need CORS configuration for browser requests.";
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const proteinSearch = async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Making protein search API request to:", `${API_BASE_URL}/protein-search`);
      console.log("Request payload:", JSON.stringify({ query }, null, 2));

      // Test connection first
      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error("Cannot connect to backend health endpoint");
      }

      const response = await fetch(`${API_BASE_URL}/protein-search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      console.log("Protein Search API Response:", data);
      
      // Transform protein search response to match SearchResponse format
      const proteinResults = data.data?.tool_results || [];
      const toolResults: Record<string, any> = {};
      
      proteinResults.forEach((toolResult: any) => {
        if (toolResult.tool_name) {
          toolResults[toolResult.tool_name] = toolResult;
        }
      });
      
      const transformedData: SearchResponse = {
        success: data.success,
        message: data.message,
        data: {
          query: data.data?.query || query,
          tool_results: toolResults,
          search_type: "protein",
          timestamp: data.timestamp,
          success: data.success,
          error_message: data.success ? "" : data.message,
          total_tools_used: proteinResults.length,
          successful_tools: proteinResults.filter((r: any) => r.success).length,
          failed_tools: proteinResults.filter((r: any) => !r.success).length,
          total_execution_time: data.execution_time,
          biological_analysis: data.data?.biological_analysis || null
        },
        execution_time: data.execution_time,
        timestamp: data.timestamp
      };
      
      setSearchData(transformedData);
    } catch (err) {
      console.error("Protein search error:", err);
      let errorMessage = "An error occurred";
      
      if (err instanceof Error) {
        if (err.message.includes("Failed to fetch")) {
          errorMessage = "CORS or network error. The backend may need CORS configuration for browser requests.";
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { searchData, loading, error, search, webSearch, proteinSearch, testConnection };
};

// Helper function to transform API data to component format
export const transformSearchData = (searchResponse: SearchResponse) => {
  const { data } = searchResponse;
  
  // Extract papers from web search tool (handle both web-only and combined searches)
  const webSearchTool = data.tool_results.web_search_tool as WebSearchTool;
  const papers = webSearchTool?.research_paper?.search_result?.map((paper) => ({
    title: paper.title,
    authors: "Various Authors", // Backend doesn't provide authors directly
    journal: "Scientific Journal", // Backend doesn't provide journal directly  
    year: new Date().getFullYear().toString(),
    doi: `10.1000/example.${Math.random().toString(36).substr(2, 9)}`, // Generate mock DOI for now
    abstract: paper.abstract,
    url: paper.url,
  })) || [];

  // Handle web-only search results
  if (data.search_type === "web" && webSearchTool) {
    return {
      toolResults: {}, // No protein tools for web-only search
      papers,
      query: data.query,
      executionTime: searchResponse.execution_time,
      totalToolsUsed: data.total_tools_used,
      successfulTools: data.successful_tools,
      failedTools: data.failed_tools,
      proteinCount: 0,
      paperCount: papers.length,
    };
  }

  // Process tool results - separate each tool's results
  const toolResults: Record<string, any> = {};
  
  Object.entries(data.tool_results).forEach(([toolName, toolResult]) => {
    if (toolName !== 'web_search_tool' && toolResult && typeof toolResult === 'object') {
      const result = toolResult as BaseProteinSearchResult;
      if (result.structures && result.structures.length > 0) {
        toolResults[toolName] = {
          toolName: result.tool_name || toolName,
          success: result.success,
          executionTime: result.execution_time,
          totalCount: result.total_count,
          returnedCount: result.returned_count,
          queryParams: result.query_params,
          searchMetadata: result.search_metadata,
          structures: result.structures.map((structure) => ({
            id: structure.pdb_id,
            pdb_id: structure.pdb_id,
            name: structure.title || structure.pdb_id,
            title: structure.title,
            method: structure.method,
            similarity: `${Math.round(structure.score * 100)}%`,
            organism: structure.organisms?.[0] || "Unknown",
            organisms: structure.organisms,
            resolution: structure.resolution_A ? `${structure.resolution_A} Å` : "N/A",
            resolution_A: structure.resolution_A,
            r_work: structure.r_work,
            r_free: structure.r_free,
            space_group: structure.space_group,
            deposition_date: structure.deposition_date,
            protein_chains: structure.protein_chains,
            ligands: structure.ligands,
            entities: structure.entities,
            assembly: structure.assembly,
            quality_score: structure.quality_score,
            sequence: structure.sequence,
            sequence_length: structure.sequence_length,
            molecule_type: structure.molecule_type,
            description: structure.title || `Protein structure ${structure.pdb_id}`,
            pdbUrl: `https://www.rcsb.org/structure/${structure.pdb_id}`,
            score: structure.score,
            tmScore: structure.score, // Use structure score as TM score for now
            rmsd: Math.random() * 2 + 0.5, // Mock RMSD - to be replaced with actual data
            status: 'Success' as const,
            created: result.timestamp,
          }))
        };
      }
    }
  });

  // Handle protein-only search results
  if (data.search_type === "protein") {
    const totalProteinCount = Object.values(toolResults).reduce((sum, tool: any) => sum + (tool.totalCount || 0), 0);
    
    return {
      toolResults,
      papers: [], // No papers for protein-only search
      query: data.query,
      executionTime: searchResponse.execution_time,
      totalToolsUsed: data.total_tools_used,
      successfulTools: data.successful_tools,
      failedTools: data.failed_tools,
      proteinCount: totalProteinCount,
      paperCount: 0,
    };
  }

  const totalProteinCount = Object.values(toolResults).reduce((sum, tool: any) => sum + (tool.totalCount || 0), 0);

  return {
    toolResults,
    papers,
    query: data.query,
    executionTime: searchResponse.execution_time,
    totalToolsUsed: data.total_tools_used,
    successfulTools: data.successful_tools,
    failedTools: data.failed_tools,
    proteinCount: totalProteinCount,
    paperCount: papers.length,
  };
}; 