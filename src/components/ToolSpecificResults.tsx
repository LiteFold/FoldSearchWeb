import React, { useState } from "react";
import { ChevronDown, ChevronRight, Activity, Database, Search, Zap, FlaskConical, Microscope, BarChart3, Users, FileText, Clock, TrendingUp } from "lucide-react";
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

export function ToolSpecificResults({ toolResults, title = "Analysis Results" }: ToolSpecificResultsProps) {
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
    return time ? `${time.toFixed(1)}s` : 'N/A';
  };

  const totalResults = Object.values(toolResults).reduce((sum, result: any) => 
    sum + (result.structures?.length || 0), 0
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-gray-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">{totalResults} structures from {Object.keys(toolResults).length} tools</p>
        </div>
      </div>

      {/* Tools */}
      <div className="space-y-3">
        {Object.entries(toolResults).map(([toolName, toolResult]) => (
          <div key={toolName} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Tool Header */}
            <div 
              className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleTool(toolName)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {expandedTools.has(toolName) ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                    <div className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center">
                      {getToolIcon(toolName)}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {getToolDisplayName(toolName)}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{toolResult.structures?.length || 0} results</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatExecutionTime(toolResult.executionTime)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Badge 
                  className={cn(
                    "text-xs font-medium",
                    toolResult.success ? "bg-gray-100 text-gray-700" : "bg-red-100 text-red-700"
                  )}
                >
                  {toolResult.success ? 'Success' : 'Failed'}
                </Badge>
              </div>
            </div>

            {/* Tool Content */}
            {expandedTools.has(toolName) && (
              <div className="px-4 pb-4">
                {/* Quick Stats */}
                {toolResult.success && (toolResult.totalCount || toolResult.returnedCount) && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      {toolResult.totalCount && (
                        <div>
                          <div className="text-xl font-bold text-gray-900">{toolResult.totalCount.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">Total Found</div>
                        </div>
                      )}
                      {toolResult.returnedCount && (
                        <div>
                          <div className="text-xl font-bold text-gray-900">{toolResult.returnedCount}</div>
                          <div className="text-xs text-gray-500">Returned</div>
                        </div>
                      )}
                      {toolResult.executionTime && (
                        <div>
                          <div className="text-xl font-bold text-gray-900">{formatExecutionTime(toolResult.executionTime)}</div>
                          <div className="text-xs text-gray-500">Execution Time</div>
                        </div>
                      )}
                      {toolResult.structures?.length && (
                        <div>
                          <div className="text-xl font-bold text-gray-900">{toolResult.structures.length}</div>
                          <div className="text-xs text-gray-500">Structures</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
                      title=""
                      showPagination={true}
                    />
                  </div>
                )}

                {/* No Results Message */}
                {(!toolResult.structures || toolResult.structures.length === 0) && (
                  <div className="text-center py-6 text-gray-400">
                    <Database className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No structures found</p>
                  </div>
                )}

                {/* 3D Structure Viewers - Simplified */}
                {toolResult.structures && toolResult.structures.some((s: any) => s.sequence && s.pdb_id) && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">3D Structure Viewers</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {toolResult.structures
                        .filter((structure: any) => structure.sequence && structure.pdb_id)
                        .slice(0, 2) // Show max 2 structures to reduce overwhelm
                        .map((structure: any) => (
                          <div key={structure.pdb_id} className="border border-gray-200 rounded-md overflow-hidden">
                            <div className="p-3 bg-gray-50 border-b">
                              <h5 className="font-medium text-gray-900 mb-1">{structure.title || structure.pdb_id}</h5>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{structure.pdb_id}</span>
                                <span>{structure.sequence_length} AA</span>
                                {structure.resolution && <span>{structure.resolution}</span>}
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
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 