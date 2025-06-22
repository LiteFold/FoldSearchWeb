import React, { useState } from "react";
import { ChevronDown, ChevronRight, Activity, Database, Dna, Search, Clock, CheckCircle, XCircle, AlertCircle, FlaskConical, BarChart3, Network, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Molecular3DViewer } from "./Molecular3DViewer";
import { cn } from "@/lib/utils";
import { ProteinToolResult, StructureInfo, SequenceInfo, ComparisonInfo, InteractionInfo, StructuralSummaryInfo } from "@/types/search-results";

interface PerToolResultsTableProps {
  toolResults: ProteinToolResult[];
  title?: string;
}

export function PerToolResultsTable({ toolResults, title = "Protein Search Results" }: PerToolResultsTableProps) {
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set());

  const toggleTool = (toolIndex: string) => {
    const newExpanded = new Set(expandedTools);
    if (newExpanded.has(toolIndex)) {
      newExpanded.delete(toolIndex);
    } else {
      newExpanded.add(toolIndex);
    }
    setExpandedTools(newExpanded);
  };

  const getToolIcon = (toolName: string) => {
    const iconMap = {
      "search_structures_tool": <Search className="h-4 w-4 text-blue-600" />,
      "search_by_sequence_tool": <Dna className="h-4 w-4 text-green-600" />,
      "search_by_structure_tool": <BarChart3 className="h-4 w-4 text-purple-600" />,
      "search_by_chemical_tool": <FlaskConical className="h-4 w-4 text-orange-600" />,
      "get_high_quality_structures_tool": <Database className="h-4 w-4 text-indigo-600" />,
      "get_structure_details_tool": <Database className="h-4 w-4 text-cyan-600" />,
      "get_sequences_tool": <Activity className="h-4 w-4 text-emerald-600" />,
      "compare_structures_tool": <BarChart3 className="h-4 w-4 text-pink-600" />,
      "analyze_interactions_tool": <Network className="h-4 w-4 text-red-600" />,
      "get_structural_summary_tool": <FileText className="h-4 w-4 text-gray-600" />
    };
    return iconMap[toolName as keyof typeof iconMap] || <Activity className="h-4 w-4 text-gray-600" />;
  };

  const getToolDisplayName = (toolName: string) => {
    const nameMap = {
      "search_structures_tool": "Structure Search",
      "search_by_sequence_tool": "Sequence Search",
      "search_by_structure_tool": "Structure Similarity",
      "search_by_chemical_tool": "Chemical Search",
      "get_high_quality_structures_tool": "High Quality Structures",
      "get_structure_details_tool": "Structure Details",
      "get_sequences_tool": "Sequence Retrieval",
      "compare_structures_tool": "Structure Comparison",
      "analyze_interactions_tool": "Interaction Analysis",
      "get_structural_summary_tool": "Structural Summary"
    };
    return nameMap[toolName as keyof typeof nameMap] || toolName.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusBadge = (success: boolean) => {
    return success ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />Success
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 border-red-200">
        <XCircle className="w-3 h-3 mr-1" />Failed
      </Badge>
    );
  };

  // 1. Search Structures Tool - Basic PDB search results
  const renderSearchStructuresResults = (toolResult: ProteinToolResult) => {
    if (toolResult.tool_name !== "search_structures_tool") return null;
    const result = toolResult as any;

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Search Parameters</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-gray-500">Query:</span> <span className="font-medium">{result.search_query || 'N/A'}</span></div>
            <div><span className="text-gray-500">Organism:</span> <span className="font-medium">{result.organism || 'Any'}</span></div>
            <div><span className="text-gray-500">Method:</span> <span className="font-medium">{result.method || 'Any'}</span></div>
            <div><span className="text-gray-500">Max Resolution:</span> <span className="font-medium">{result.max_resolution ? `${result.max_resolution}Å` : 'Any'}</span></div>
          </CardContent>
        </Card>

        {toolResult.pdb_ids && toolResult.pdb_ids.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PDB ID</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {toolResult.pdb_ids.slice(0, 10).map((pdbId) => (
                <TableRow key={pdbId}>
                  <TableCell>
                    <Badge variant="outline" className="text-blue-700 bg-blue-50">
                      {pdbId}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {toolResult.scores?.[pdbId]?.toFixed(3) || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" className="text-xs">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    );
  };

  // 2. Search by Sequence Tool - Sequence alignment results
  const renderSearchBySequenceResults = (toolResult: ProteinToolResult) => {
    if (toolResult.tool_name !== "search_by_sequence_tool") return null;
    const result = toolResult as any;

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Sequence Search Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div><span className="text-gray-500">Sequence Type:</span> <span className="font-medium">{result.sequence_type || 'Protein'}</span></div>
              <div><span className="text-gray-500">Identity Cutoff:</span> <span className="font-medium">{result.identity_cutoff ? `${(result.identity_cutoff * 100).toFixed(1)}%` : 'N/A'}</span></div>
              <div><span className="text-gray-500">E-value Cutoff:</span> <span className="font-medium">{result.evalue_cutoff || 'N/A'}</span></div>
            </div>
            {result.sequence && (
              <div>
                <span className="text-gray-500 text-sm">Query Sequence:</span>
                <div className="mt-1 p-2 bg-gray-50 border rounded font-mono text-xs break-all max-h-20 overflow-y-auto">
                  {result.sequence.length > 100 ? `${result.sequence.substring(0, 100)}...` : result.sequence}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {toolResult.pdb_ids && toolResult.pdb_ids.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PDB ID</TableHead>
                <TableHead>Identity Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {toolResult.pdb_ids.slice(0, 10).map((pdbId) => (
                <TableRow key={pdbId}>
                  <TableCell>
                    <Badge variant="outline" className="text-green-700 bg-green-50">
                      {pdbId}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {toolResult.scores?.[pdbId] ? `${(toolResult.scores[pdbId] * 100).toFixed(1)}%` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" className="text-xs">
                      View Alignment
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    );
  };

  // 3. Search by Structure Tool - Structure similarity results
  const renderSearchByStructureResults = (toolResult: ProteinToolResult) => {
    if (toolResult.tool_name !== "search_by_structure_tool") return null;
    const result = toolResult as any;

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Structure Search Parameters</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-gray-500">Reference PDBs:</span> <span className="font-medium">{result.reference_pdb_ids?.join(', ') || 'N/A'}</span></div>
            <div><span className="text-gray-500">Assembly ID:</span> <span className="font-medium">{result.assembly_id || 'N/A'}</span></div>
            <div><span className="text-gray-500">Match Type:</span> <span className="font-medium">{result.match_type || 'N/A'}</span></div>
          </CardContent>
        </Card>

        {result.by_reference && Object.entries(result.by_reference).map(([refPdb, refData]: [string, any]) => (
          <div key={refPdb} className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Similar to {refPdb}</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PDB ID</TableHead>
                  <TableHead>Similarity Score</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {refData.pdb_ids?.slice(0, 5).map((pdbId: string) => (
                  <TableRow key={pdbId}>
                    <TableCell>
                      <Badge variant="outline" className="text-purple-700 bg-purple-50">
                        {pdbId}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {refData.scores?.[pdbId]?.toFixed(3) || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="text-xs">
                        Compare 3D
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    );
  };

  // 4. Search by Chemical Tool - Chemical/ligand search results
  const renderSearchByChemicalResults = (toolResult: ProteinToolResult) => {
    if (toolResult.tool_name !== "search_by_chemical_tool") return null;
    const result = toolResult as any;

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Chemical Search Parameters</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div><span className="text-gray-500">Ligand Name:</span> <span className="font-medium">{result.ligand_name || 'N/A'}</span></div>
            <div><span className="text-gray-500">Identifier Type:</span> <span className="font-medium">{result.identifier_type || 'N/A'}</span></div>
            <div><span className="text-gray-500">Match Type:</span> <span className="font-medium">{result.match_type || 'N/A'}</span></div>
          </CardContent>
          {result.chemical_identifier && (
            <CardContent className="pt-0">
              <div><span className="text-gray-500 text-sm">Chemical Identifier:</span></div>
              <div className="mt-1 p-2 bg-gray-50 border rounded font-mono text-xs break-all">
                {result.chemical_identifier}
              </div>
            </CardContent>
          )}
        </Card>

        {toolResult.pdb_ids && toolResult.pdb_ids.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PDB ID</TableHead>
                <TableHead>Binding Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {toolResult.pdb_ids.slice(0, 10).map((pdbId) => (
                <TableRow key={pdbId}>
                  <TableCell>
                    <Badge variant="outline" className="text-orange-700 bg-orange-50">
                      {pdbId}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {toolResult.scores?.[pdbId]?.toFixed(3) || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" className="text-xs">
                      View Binding
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    );
  };

  // 5. High Quality Structures Tool - Quality-filtered results
  const renderHighQualityStructuresResults = (toolResult: ProteinToolResult) => {
    if (toolResult.tool_name !== "get_high_quality_structures_tool") return null;
    const result = toolResult as any;

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Quality Filters Applied</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div><span className="text-gray-500">Max Resolution:</span> <span className="font-medium">{result.max_resolution ? `${result.max_resolution}Å` : 'N/A'}</span></div>
            <div><span className="text-gray-500">Max R-work:</span> <span className="font-medium">{result.max_r_work || 'N/A'}</span></div>
            <div><span className="text-gray-500">Max R-free:</span> <span className="font-medium">{result.max_r_free || 'N/A'}</span></div>
            <div><span className="text-gray-500">Method:</span> <span className="font-medium">{result.method || 'Any'}</span></div>
            <div><span className="text-gray-500">Min Year:</span> <span className="font-medium">{result.min_year || 'Any'}</span></div>
          </CardContent>
        </Card>

        {toolResult.pdb_ids && toolResult.pdb_ids.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PDB ID</TableHead>
                <TableHead>Quality Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {toolResult.pdb_ids.slice(0, 10).map((pdbId) => (
                <TableRow key={pdbId}>
                  <TableCell>
                    <Badge variant="outline" className="text-indigo-700 bg-indigo-50">
                      {pdbId}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {toolResult.scores?.[pdbId]?.toFixed(3) || 'High'}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" className="text-xs">
                      View Quality
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    );
  };

  // 6. Structure Details Tool - Detailed structure information with 3D viewer
  const renderStructureDetailsResults = (toolResult: ProteinToolResult) => {
    if (toolResult.tool_name !== "get_structure_details_tool") return null;
    const result = toolResult as any;

    return (
      <div className="space-y-6">
        {result.structure_details && Object.entries(result.structure_details).map(([pdbId, details]: [string, StructureInfo]) => (
          <Card key={pdbId} className="border-l-4 border-l-cyan-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-cyan-100 text-cyan-800 border-cyan-200">{pdbId}</Badge>
                  <span className="text-base">{details.title || 'Unknown Structure'}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Structure Information */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-500">Method:</span> <span className="font-medium">{details.method || 'N/A'}</span></div>
                    <div><span className="text-gray-500">Resolution:</span> <span className="font-medium">{details.resolution_A ? `${details.resolution_A}Å` : 'N/A'}</span></div>
                    <div><span className="text-gray-500">R-work:</span> <span className="font-medium">{details.r_work || 'N/A'}</span></div>
                    <div><span className="text-gray-500">R-free:</span> <span className="font-medium">{details.r_free || 'N/A'}</span></div>
                    <div><span className="text-gray-500">Space Group:</span> <span className="font-medium">{details.space_group || 'N/A'}</span></div>
                    <div><span className="text-gray-500">Quality:</span> <span className="font-medium">{details.quality_score || 'N/A'}</span></div>
                  </div>
                  
                  {details.organisms && details.organisms.length > 0 && (
                    <div>
                      <span className="text-gray-500 text-sm">Organisms:</span>
                      <div className="mt-1 space-y-1">
                        {details.organisms.map((org, idx) => (
                          <div key={idx} className="text-sm italic text-gray-700">{org}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {details.ligands && details.ligands.length > 0 && (
                    <div>
                      <span className="text-gray-500 text-sm">Ligands:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {details.ligands.map((ligand, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">{ligand}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3D Structure Viewer */}
                <div className="bg-gray-50 rounded-lg border h-64 flex items-center justify-center">
                  <Molecular3DViewer pdbId={pdbId} type="protein" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // 7. Sequences Tool - Sequence display with viewer
  const renderSequencesResults = (toolResult: ProteinToolResult) => {
    if (toolResult.tool_name !== "get_sequences_tool") return null;
    const result = toolResult as any;

    return (
      <div className="space-y-4">
        {result.sequences && Object.entries(result.sequences).map(([key, seqInfo]: [string, SequenceInfo]) => (
          <Card key={key} className="border-l-4 border-l-emerald-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">{seqInfo.pdb_id}</Badge>
                  <span className="text-sm">Entity {seqInfo.entity_id}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {seqInfo.sequence_length} residues
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Sequence Type:</span> <span className="font-medium">{seqInfo.sequence_type || 'N/A'}</span></div>
                <div><span className="text-gray-500">Molecule Type:</span> <span className="font-medium">{seqInfo.molecule_type || 'N/A'}</span></div>
              </div>
              
              {seqInfo.sequence && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Sequence:</span>
                    <Button size="sm" variant="outline" className="text-xs">
                      Copy FASTA
                    </Button>
                  </div>
                  <div className="p-3 bg-gray-50 border rounded font-mono text-xs break-all max-h-32 overflow-y-auto">
                    {seqInfo.sequence}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // 8. Compare Structures Tool - Comparison results
  const renderCompareStructuresResults = (toolResult: ProteinToolResult) => {
    if (toolResult.tool_name !== "compare_structures_tool") return null;
    const result = toolResult as any;

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Comparison Type: {result.comparison_type}</CardTitle>
          </CardHeader>
        </Card>

        {result.comparisons && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PDB Pair</TableHead>
                <TableHead>Sequence Identity</TableHead>
                <TableHead>Length Diff</TableHead>
                <TableHead>Structural Similarity</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(result.comparisons).map(([key, comp]: [string, ComparisonInfo]) => (
                <TableRow key={key}>
                  <TableCell>
                    <Badge variant="outline" className="text-pink-700 bg-pink-50">
                      {comp.pdb_pair}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {comp.sequence_identity ? `${(comp.sequence_identity * 100).toFixed(1)}%` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {comp.length_difference !== undefined ? `${comp.length_difference}` : 'N/A'}
                  </TableCell>
                  <TableCell className="font-medium">
                    {comp.structural_similarity ? comp.structural_similarity.toFixed(3) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {comp.comparison_note || 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    );
  };

  // 9. Analyze Interactions Tool - Interaction analysis
  const renderAnalyzeInteractionsResults = (toolResult: ProteinToolResult) => {
    if (toolResult.tool_name !== "analyze_interactions_tool") return null;
    const result = toolResult as any;

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Interaction Type: {result.interaction_type}</CardTitle>
          </CardHeader>
        </Card>

        {result.interactions && Object.entries(result.interactions).map(([pdbId, interaction]: [string, InteractionInfo]) => (
          <Card key={pdbId} className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-red-100 text-red-800 border-red-200">{pdbId}</Badge>
                <span className="text-sm">Interaction Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Protein Chains:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {interaction.protein_chains?.map((chain, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">Chain {chain}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Ligands:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {interaction.ligands?.map((ligand, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">{ligand}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Quaternary Structure:</span>
                  <div className="mt-1 text-sm font-medium">
                    {interaction.quaternary_structure?.oligomeric_state || 'N/A'}
                  </div>
                </div>
              </div>

              {interaction.interactions && interaction.interactions.length > 0 && (
                <div>
                  <span className="text-gray-500 text-sm">Interactions:</span>
                  <div className="mt-2 space-y-2">
                    {interaction.interactions.map((int: any, idx: number) => (
                      <div key={idx} className="p-2 bg-gray-50 rounded text-xs">
                        <span className="font-medium">{int.type}:</span> {int.description}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // 10. Structural Summary Tool - Comprehensive summaries
  const renderStructuralSummaryResults = (toolResult: ProteinToolResult) => {
    if (toolResult.tool_name !== "get_structural_summary_tool") return null;
    const result = toolResult as any;

    return (
      <div className="space-y-4">
        {result.summaries && Object.entries(result.summaries).map(([pdbId, summary]: [string, StructuralSummaryInfo]) => (
          <Card key={pdbId} className="border-l-4 border-l-gray-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-gray-100 text-gray-800 border-gray-200">{pdbId}</Badge>
                  <span className="text-base">{summary.title || 'Structural Summary'}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {summary.experimental && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Experimental</h4>
                    <div className="space-y-1 text-xs">
                      <div>Method: {summary.experimental.method}</div>
                      <div>Resolution: {summary.experimental.resolution_A}Å</div>
                      <div>Space Group: {summary.experimental.space_group}</div>
                    </div>
                  </div>
                )}

                {summary.composition && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Composition</h4>
                    <div className="space-y-1 text-xs">
                      <div>Protein Entities: {summary.composition.protein_entities}</div>
                      <div>Total Entities: {summary.composition.total_entities}</div>
                      <div>Ligands: {summary.composition.ligands}</div>
                    </div>
                  </div>
                )}

                {summary.quality && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Quality</h4>
                    <div className="space-y-1 text-xs">
                      <div>Score: {summary.quality.quality_score}</div>
                      <div>R-work: {summary.quality.r_work}</div>
                      <div>R-free: {summary.quality.r_free}</div>
                    </div>
                  </div>
                )}

                {summary.research_relevance && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Research Relevance</h4>
                    <div className="space-y-1 text-xs">
                      {summary.research_relevance.has_ligands && <Badge className="text-xs bg-green-100 text-green-800">Has Ligands</Badge>}
                      {summary.research_relevance.is_complex && <Badge className="text-xs bg-blue-100 text-blue-800">Complex</Badge>}
                      {summary.research_relevance.high_resolution && <Badge className="text-xs bg-purple-100 text-purple-800">High Resolution</Badge>}
                    </div>
                  </div>
                )}
              </div>

              {summary.organisms && summary.organisms.length > 0 && (
                <div>
                  <span className="text-gray-500 text-sm">Organisms:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {summary.organisms.map((org, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs italic">{org}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderToolSpecificContent = (toolResult: ProteinToolResult) => {
    switch (toolResult.tool_name) {
      case "search_structures_tool":
        return renderSearchStructuresResults(toolResult);
      case "search_by_sequence_tool":
        return renderSearchBySequenceResults(toolResult);
      case "search_by_structure_tool":
        return renderSearchByStructureResults(toolResult);
      case "search_by_chemical_tool":
        return renderSearchByChemicalResults(toolResult);
      case "get_high_quality_structures_tool":
        return renderHighQualityStructuresResults(toolResult);
      case "get_structure_details_tool":
        return renderStructureDetailsResults(toolResult);
      case "get_sequences_tool":
        return renderSequencesResults(toolResult);
      case "compare_structures_tool":
        return renderCompareStructuresResults(toolResult);
      case "analyze_interactions_tool":
        return renderAnalyzeInteractionsResults(toolResult);
      case "get_structural_summary_tool":
        return renderStructuralSummaryResults(toolResult);
      default:
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Tool-specific display not implemented for {toolResult.tool_name}</p>
            <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-x-auto">
              {JSON.stringify(toolResult.query_params, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">
          {toolResults.length} tools executed • {toolResults.filter(t => t.success).length} successful
        </p>
      </div>

      {/* Tool Results */}
      <div className="divide-y divide-gray-100">
        {toolResults.map((toolResult, index) => {
          const toolIndex = `${toolResult.tool_name}-${index}`;
          const isExpanded = expandedTools.has(toolIndex);

          return (
            <div key={toolIndex} className="px-6 py-4">
              {/* Tool Header */}
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
                onClick={() => toggleTool(toolIndex)}
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                  
                  <div className="flex items-center gap-2">
                    {getToolIcon(toolResult.tool_name)}
                    <span className="font-medium text-gray-900">
                      {getToolDisplayName(toolResult.tool_name)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Key metrics in collapsed view */}
                  {toolResult.pdb_ids && toolResult.pdb_ids.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {toolResult.pdb_ids.length} results
                    </Badge>
                  )}
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {toolResult.execution_time.toFixed(2)}s
                  </div>
                  
                  {getStatusBadge(toolResult.success)}
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="mt-6 pl-7">
                  {toolResult.success ? (
                    renderToolSpecificContent(toolResult)
                  ) : (
                    <div className="space-y-4">
                      {toolResult.error_message && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <XCircle className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-red-800">Error Details</span>
                          </div>
                          <p className="text-sm text-red-700">{toolResult.error_message}</p>
                        </div>
                      )}
                      
                      {toolResult.warnings && toolResult.warnings.length > 0 && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-800">Warnings</span>
                          </div>
                          {toolResult.warnings.map((warning, idx) => (
                            <p key={idx} className="text-sm text-yellow-700">{warning}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            Total execution time: {toolResults.reduce((sum, t) => sum + t.execution_time, 0).toFixed(2)}s
          </div>
          <div className="flex items-center gap-4">
            <span className="text-green-600 font-medium">
              ✓ {toolResults.filter(t => t.success).length} successful
            </span>
            {toolResults.filter(t => !t.success).length > 0 && (
              <span className="text-red-600 font-medium">
                ✗ {toolResults.filter(t => !t.success).length} failed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 