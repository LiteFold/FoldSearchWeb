import React, { useState } from "react";
import { ChevronDown, ChevronRight, Activity, FlaskConical, ExternalLink, Copy, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LigandCard } from "./research-cards/LigandCard";
import { Molecular3DViewer } from "./Molecular3DViewer";
import { cn } from "@/lib/utils";

interface ProteinResult {
  id: string;
  name: string;
  organism: string;
  similarity: string;
  tmScore: number;
  rmsd: number;
  status: "Success" | "Failed" | "Processing";
  created: string;
  resolution: string;
  description: string;
  pdbUrl: string;
  sequence?: string;
  length?: number;
  method?: string;
  // Real data from backend
  realData?: {
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
  };
}

interface LigandResult {
  id: string;
  name: string;
  chemblId?: string;
  activity?: string;
  similarity: string;
  status: "Success" | "Failed" | "Processing";
  created: string;
  description: string;
  smiles?: string;
  properties?: {
    molecularWeight?: number;
    logP?: number;
    hba?: number;
    hbd?: number;
  };
  targets?: string[];
}

interface ExpandableResultsTableProps {
  proteins?: ProteinResult[];
  ligands?: LigandResult[];
  title?: string;
  showPagination?: boolean;
}

export function ExpandableResultsTable({ 
  proteins = [], 
  ligands = [], 
  title = "Research Results",
  showPagination = true 
}: ExpandableResultsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  // Combine and sort results
  const allResults = [
    ...proteins.map(p => ({ ...p, type: 'protein' as const })),
    ...ligands.map(l => ({ ...l, type: 'ligand' as const }))
  ].sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

  const totalResults = allResults.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const paginatedResults = allResults.slice(startIndex, startIndex + resultsPerPage);

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Success":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Success</Badge>;
      case "Failed":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>;
      case "Processing":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Processing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">
          Showing {startIndex + 1}-{Math.min(startIndex + resultsPerPage, totalResults)} of {totalResults} results
        </p>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-gray-100">
            <TableHead className="w-12"></TableHead>
            <TableHead className="font-medium text-gray-700">Type</TableHead>
            <TableHead className="font-medium text-gray-700">Name/ID</TableHead>
            <TableHead className="font-medium text-gray-700">Similarity</TableHead>
            <TableHead className="font-medium text-gray-700">Score</TableHead>
            <TableHead className="font-medium text-gray-700">Status</TableHead>
            <TableHead className="font-medium text-gray-700">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedResults.map((result) => (
            <React.Fragment key={result.id}>
              {/* Main Row */}
              <TableRow 
                className={cn(
                  "cursor-pointer hover:bg-gray-50 transition-colors",
                  expandedRows.has(result.id) && "bg-gray-50"
                )}
                onClick={() => toggleRow(result.id)}
              >
                <TableCell className="text-center">
                  {expandedRows.has(result.id) ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {result.type === 'protein' ? (
                      <Activity className="h-4 w-4 text-blue-600" />
                    ) : (
                      <FlaskConical className="h-4 w-4 text-emerald-600" />
                    )}
                    <span className="text-sm font-medium capitalize">
                      {result.type}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900">{result.name}</div>
                    <div className="text-sm text-gray-500">{result.id}</div>
                    {result.type === 'ligand' && (result as LigandResult).chemblId && (
                      <Badge variant="outline" className="text-xs">
                        {(result as LigandResult).chemblId}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50">
                    {result.similarity}
                  </Badge>
                </TableCell>
                <TableCell>
                  {result.type === 'protein' ? (
                    <div className="space-y-1">
                      <div className="text-sm font-semibold">
                        TM: {(result as ProteinResult).tmScore.toFixed(4)}
                      </div>
                      <div className="text-xs text-gray-500">
                        RMSD: {(result as ProteinResult).rmsd.toFixed(4)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm font-semibold text-gray-600">
                      {(result as LigandResult).activity || 'N/A'}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {getStatusBadge(result.status)}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatDate(result.created)}
                </TableCell>
              </TableRow>

              {/* Expanded Content */}
              {expandedRows.has(result.id) && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7} className="p-0">
                    <div className="bg-gray-50 border-t border-gray-100">
                      <div className="p-6">
                        {result.type === 'protein' ? (
                          <div className="space-y-6">
                            {/* Protein Details Header */}
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-gray-900">Protein Structure Details</h3>
                              <div className="flex gap-2">
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                  ID: {result.id}
                                </Badge>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open((result as ProteinResult).pdbUrl, '_blank')}
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  View in RCSB
                                </Button>
                              </div>
                            </div>

                            {/* Real Data Grid */}
                            {(result as ProteinResult).realData && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                                    Experimental Details
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="text-gray-500">Method:</span>
                                      <p className="font-medium text-gray-900">
                                        {(result as ProteinResult).realData?.method || 'N/A'}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Resolution:</span>
                                      <p className="font-medium text-gray-900">
                                        {(result as ProteinResult).realData?.resolution_A ? 
                                          `${(result as ProteinResult).realData!.resolution_A} Å` : 'N/A'}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Space Group:</span>
                                      <p className="font-medium text-gray-900">
                                        {(result as ProteinResult).realData?.space_group || 'N/A'}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Deposition:</span>
                                      <p className="font-medium text-gray-900">
                                        {(result as ProteinResult).realData?.deposition_date || 'N/A'}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                                    Quality Metrics
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="text-gray-500">R-work:</span>
                                      <p className="font-medium text-gray-900">
                                        {(result as ProteinResult).realData?.r_work || 'N/A'}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">R-free:</span>
                                      <p className="font-medium text-gray-900">
                                        {(result as ProteinResult).realData?.r_free || 'N/A'}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Quality Score:</span>
                                      <p className="font-medium text-gray-900">
                                        {(result as ProteinResult).realData?.quality_score || 'N/A'}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                                    Biological Information
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="text-gray-500">Organisms:</span>
                                      <p className="font-medium text-gray-900">
                                        {(result as ProteinResult).realData?.organisms?.join(', ') || result.organism}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Chains:</span>
                                      <p className="font-medium text-gray-900">
                                        {(result as ProteinResult).realData?.protein_chains?.join(', ') || 'N/A'}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Ligands:</span>
                                      <p className="font-medium text-gray-900">
                                        {(result as ProteinResult).realData?.ligands?.join(', ') || 'None'}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Sequence Length:</span>
                                      <p className="font-medium text-gray-900">
                                        {(result as ProteinResult).realData?.sequence_length || 'N/A'} residues
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Sequence Section */}
                            {(result as ProteinResult).realData?.sequence && (
                              <div className="p-4 bg-white rounded-lg border">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                    Protein Sequence ({(result as ProteinResult).realData?.sequence_length} AA)
                                  </h4>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => copyToClipboard((result as ProteinResult).realData?.sequence || '')}
                                  >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy FASTA
                                  </Button>
                                </div>
                                <div className="bg-gray-50 p-3 rounded border font-mono text-xs break-all max-h-32 overflow-y-auto">
                                  {(result as ProteinResult).realData?.sequence}
                                </div>
                              </div>
                            )}

                            {/* 3D Structure Viewer */}
                            {result.id && (
                              <div className="p-4 bg-white rounded-lg border">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                    3D Protein Structure
                                  </h4>
                                  <Badge variant="outline" className="text-xs">
                                    PDB: {result.id}
                                  </Badge>
                                </div>
                                <div className="h-96 bg-gray-50 rounded border overflow-hidden">
                                  <Molecular3DViewer 
                                    pdbId={result.id}
                                    type="protein"
                                  />
                                </div>
                                <div className="mt-2 text-xs text-gray-500 text-center">
                                  Interactive 3D viewer • Drag to rotate • Scroll to zoom
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {/* Ligand Details using existing LigandCard */}
                            <LigandCard 
                              ligand={{
                                id: result.id,
                                name: result.name,
                                description: result.description,
                                smiles: (result as LigandResult).smiles,
                                chemblId: (result as LigandResult).chemblId,
                                activity: (result as LigandResult).activity,
                                properties: (result as LigandResult).properties,
                                targets: (result as LigandResult).targets
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(startIndex + resultsPerPage, totalResults)} of {totalResults} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "px-3 py-1 text-sm border rounded",
                    isActive 
                      ? "bg-blue-600 text-white border-blue-600" 
                      : "hover:bg-gray-50"
                  )}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 