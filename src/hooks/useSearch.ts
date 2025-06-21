import { useState } from "react";

const API_BASE_URL = "http://0.0.0.0:8000";

// API Interfaces based on backend documentation
interface ResearchPaper {
  title: string;
  url: string;
  abstract: string;
}

interface WebResearch {
  query: string;
  raw_result: string;
  research_paper: {
    search_result: ResearchPaper[];
  };
  upnext_queries: string[];
}

interface ProteinSearch {
  operation_type: string;
  tool_used: string;
  query_params: {
    combined_queries: number;
  };
  execution_time: number;
  timestamp: string;
  success: boolean;
  error_message?: string;
  warnings?: string;
  pdb_ids: string[];
  total_count: number;
  returned_count: number;
  scores: Record<string, number>;
  raw_response: {
    original_results_count: number;
    deduplicated_pdb_count: number;
    individual_counts: number[];
  };
  successful_retrievals: number;
  failed_retrievals: number;
}

interface SearchData {
  query: string;
  web_research?: WebResearch;
  protein_search?: ProteinSearch;
  search_type: "combined" | "web" | "protein" | "none";
  timestamp: string;
  success: boolean;
  error_message?: string;
}

interface SearchResponse {
  success: boolean;
  message: string;
  data: SearchData;
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

  return { searchData, loading, error, search, testConnection };
};

// Helper function to transform API data to component format
export const transformSearchData = (searchResponse: SearchResponse) => {
  const { data } = searchResponse;
  
  const proteins = data.protein_search?.pdb_ids.map((pdbId, index) => ({
    id: pdbId,
    name: pdbId, // Use PDB ID as name for now
    similarity: "N/A", // Backend doesn't provide similarity directly
    organism: "Unknown", // Backend doesn't provide organism directly
    resolution: "N/A", // Backend doesn't provide resolution directly
    description: `Protein structure ${pdbId} found via combined search`,
    pdbUrl: `https://www.rcsb.org/structure/${pdbId}`,
    score: data.protein_search?.scores[pdbId] || 0,
    tmScore: Math.random() * 0.5 + 0.5, // Mock value - to be replaced with actual data
    rmsd: Math.random() * 2 + 0.5, // Mock value - to be replaced with actual data
    status: 'Success' as const,
    created: data.timestamp,
  })) || [];

  const papers = data.web_research?.research_paper.search_result.map((paper) => ({
    title: paper.title,
    authors: "Various Authors", // Backend doesn't provide authors directly
    journal: "Scientific Journal", // Backend doesn't provide journal directly  
    year: new Date().getFullYear().toString(),
    doi: `10.1000/example.${Math.random().toString(36).substr(2, 9)}`, // Generate mock DOI
    abstract: paper.abstract,
    url: paper.url,
  })) || [];

  return {
    proteins,
    papers,
    query: data.query,
    executionTime: searchResponse.execution_time,
    proteinCount: data.protein_search?.total_count || 0,
    paperCount: data.web_research?.research_paper.search_result.length || 0,
  };
}; 