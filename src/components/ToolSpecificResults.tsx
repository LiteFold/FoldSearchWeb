import React, { useState } from "react";
import { ChevronDown, ChevronRight, Activity, Database, Search, Zap, FlaskConical, Microscope, BarChart3, Users, FileText, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ExpandableResultsTable } from "./ExpandableResultsTable";
import { Molecular3DViewer } from "./Molecular3DViewer";
import { cn } from "@/lib/utils";

interface ToolSpecificResultsProps {
  toolResults: Record<string, any>;
  title?: string;
}

// Tool icon mapping
const getToolIcon = (toolName: string) => {
  const toolIconMap: Record<string, React.ReactNode> = {
    'search_structures_tool': <Database className="w-4 h-4" />,
    'search_by_sequence_tool': <Search className="w-4 h-4" />,
    'search_by_structure_tool': <Activity className="w-4 h-4" />,
    'search_by_chemical_tool': <FlaskConical className="w-4 h-4" />,
    'get_high_quality_structures_tool': <Zap className="w-4 h-4" />,
    'get_structure_details_tool': <FileText className="w-4 h-4" />,
    'get_sequences_tool': <BarChart3 className="w-4 h-4" />,
    'compare_structures_tool': <Users className="w-4 h-4" />,
    'analyze_interactions_tool': <Microscope className="w-4 h-4" />,
    'get_structural_summary_tool': <BarChart3 className="w-4 h-4" />,
  };
  
  return toolIconMap[toolName] || <Database className="w-4 h-4" />;
};

// Tool display name mapping
const getToolDisplayName = (toolName: string) => {
  const toolNameMap: Record<string, string> = {
    'search_structures_tool': 'Structure Search',
    'search_by_sequence_tool': 'Sequence Search',
    'search_by_structure_tool': 'Structural Similarity',
    'search_by_chemical_tool': 'Chemical Search',
    'get_high_quality_structures_tool': 'High Quality Structures',
    'get_structure_details_tool': 'Structure Details',
    'get_sequences_tool': 'Sequence Analysis',
    'compare_structures_tool': 'Structure Comparison',
    'analyze_interactions_tool': 'Interaction Analysis',
    'get_structural_summary_tool': 'Structural Summary',
  };
  
  return toolNameMap[toolName] || toolName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Tool description mapping
const getToolDescription = (toolName: string) => {
  const descriptionMap: Record<string, string> = {
    'search_structures_tool': 'Text-based protein structure search with metadata',
    'search_by_sequence_tool': 'Sequence similarity search using alignment algorithms',
    'search_by_structure_tool': '3D structural similarity comparison',
    'search_by_chemical_tool': 'Chemical compound and ligand binding search',
    'get_high_quality_structures_tool': 'High-resolution structure filtering and quality analysis',
    'get_structure_details_tool': 'Comprehensive structural metadata and experimental details',
    'get_sequences_tool': 'Protein sequence retrieval and analysis',
    'compare_structures_tool': 'Multi-structure comparison and alignment',
    'analyze_interactions_tool': 'Protein-protein and protein-ligand interaction analysis',
    'get_structural_summary_tool': 'Research overview and functional classification',
  };
  
  return descriptionMap[toolName] || 'Protein structure analysis tool';
};

export function ToolSpecificResults({ toolResults, title = "Tool-Specific Results" }: ToolSpecificResultsProps) {
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set());

  const toggleTool = (toolName: string) => {
    const newExpanded = new Set(expandedTools);
    if (newExpanded.has(toolName)) {
      newExpanded.delete(toolName);
    } else {
      newExpanded.add(toolName);
    }
    setExpandedTools(newExpanded);
  };

  const formatExecutionTime = (time: number) => {
    return time ? `${time.toFixed(2)}s` : 'N/A';
  };

  const formatMetadataValue = (value: any): string => {
    if (typeof value === 'object' && value !== null) {
      // For objects, try to display in a more readable format
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      return JSON.stringify(value, null, 0).substring(0, 100) + (JSON.stringify(value).length > 100 ? '...' : '');
    }
    return String(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <Badge variant="outline" className="text-sm">
          {Object.keys(toolResults).length} Tools Used
        </Badge>
      </div>

      {Object.entries(toolResults).map(([toolName, toolResult]) => (
        <div key={toolName} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Tool Header */}
          <div 
            className="px-6 py-4 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => toggleTool(toolName)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {expandedTools.has(toolName) ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                  {getToolIcon(toolName)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getToolDisplayName(toolName)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {getToolDescription(toolName)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {toolResult.structures?.length || 0} Results
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatExecutionTime(toolResult.executionTime)}
                  </div>
                </div>
                <Badge 
                  className={cn(
                    "text-xs",
                    toolResult.success ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"
                  )}
                >
                  {toolResult.success ? 'Success' : 'Failed'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Tool Content */}
          {expandedTools.has(toolName) && (
            <div className="p-6">
              {/* Tool Metadata */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Query Parameters
                  </h4>
                  <div className="space-y-1">
                    {toolResult.queryParams && Object.entries(toolResult.queryParams).map(([key, value]) => (
                      <div key={key} className="text-xs">
                        <span className="text-gray-500">{key}:</span>
                        <span className="ml-1 text-gray-900 font-mono">{formatMetadataValue(value)}</span>
                      </div>
                    ))}
                    {(!toolResult.queryParams || Object.keys(toolResult.queryParams).length === 0) && (
                      <span className="text-xs text-gray-400">No parameters available</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Results Summary
                  </h4>
                  <div className="space-y-1 text-xs">
                    <div>
                      <span className="text-gray-500">Total Found:</span>
                      <span className="ml-1 text-gray-900 font-semibold">{toolResult.totalCount || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Returned:</span>
                      <span className="ml-1 text-gray-900 font-semibold">{toolResult.returnedCount || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Execution:</span>
                      <span className="ml-1 text-gray-900 font-semibold">{formatExecutionTime(toolResult.executionTime)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Search Metadata
                  </h4>
                  <div className="space-y-1 text-xs">
                    {toolResult.searchMetadata && Object.entries(toolResult.searchMetadata).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-gray-500">{key}:</span>
                        <span className="ml-1 text-gray-900 font-mono">
                          {formatMetadataValue(value)}
                        </span>
                      </div>
                    ))}
                    {(!toolResult.searchMetadata || Object.keys(toolResult.searchMetadata).length === 0) && (
                      <span className="text-xs text-gray-400">No metadata available</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Structures Table */}
              {toolResult.structures && toolResult.structures.length > 0 && (
                <div>
                  <ExpandableResultsTable
                    proteins={toolResult.structures.map((structure: any) => ({
                      ...structure,
                      // Add additional metadata fields
                      hasSequence: Boolean(structure.sequence),
                      sequenceLength: structure.sequence_length,
                      qualityScore: structure.quality_score,
                      chains: structure.protein_chains,
                      ligandCount: structure.ligands?.length || 0,
                      entityCount: structure.entities?.length || 0,
                      // Pass through all the real backend data
                      realData: {
                        title: structure.title,
                        method: structure.method,
                        resolution_A: structure.resolution_A,
                        r_work: structure.r_work,
                        r_free: structure.r_free,
                        space_group: structure.space_group,
                        deposition_date: structure.deposition_date,
                        organisms: structure.organisms,
                        protein_chains: structure.protein_chains,
                        ligands: structure.ligands,
                        entities: structure.entities,
                        assembly: structure.assembly,
                        quality_score: structure.quality_score,
                        sequence: structure.sequence,
                        sequence_length: structure.sequence_length,
                        molecule_type: structure.molecule_type
                      }
                    }))}
                    title={`${getToolDisplayName(toolName)} - Detailed Results`}
                    showPagination={true}
                  />
                </div>
              )}

              {/* No Results Message */}
              {(!toolResult.structures || toolResult.structures.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No structures found for this tool</p>
                </div>
              )}

              {/* 3D Structure Viewers for top structures with sequences */}
              {toolResult.structures && toolResult.structures.some((s: any) => s.sequence && s.pdb_id) && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">3D Structure Viewers</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {toolResult.structures
                      .filter((structure: any) => structure.sequence && structure.pdb_id)
                      .slice(0, 4) // Show max 4 structures to avoid performance issues
                      .map((structure: any) => (
                        <div key={structure.pdb_id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="p-4 bg-gray-50 border-b">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h5 className="font-medium text-gray-900">{structure.title || structure.pdb_id}</h5>
                                <p className="text-sm text-gray-500">{structure.pdb_id} • {structure.method}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {structure.sequence_length} AA
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div>
                                <span className="text-gray-500">Quality:</span>
                                <span className="ml-1 text-gray-900 font-medium">{structure.quality_score}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Resolution:</span>
                                <span className="ml-1 text-gray-900 font-medium">{structure.resolution}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Organism:</span>
                                <span className="ml-1 text-gray-900 font-medium text-truncate">
                                  {structure.organisms?.join(', ') || structure.organism}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="h-64">
                            <Molecular3DViewer 
                              pdbId={structure.pdb_id}
                              type="protein"
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    Interactive 3D viewers • Drag to rotate • Scroll to zoom • Click and drag to pan
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 