import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Regex patterns for molecular data detection
export const MOLECULAR_PATTERNS = {
  // Protein sequence (amino acid codes)
  PROTEIN_SEQUENCE: /\b[ACDEFGHIKLMNPQRSTVWY]{10,}\b/g,
  // DNA/RNA sequence
  DNA_SEQUENCE: /\b[ATCGU]{10,}\b/g,
  // PDB ID (4 character alphanumeric code)
  PDB_ID: /\b[1-9][A-Za-z0-9]{3}\b/g,
  // SMILES string patterns (common chemical notation)
  SMILES: /\b[CNOSPFClBrI\[\]()=+\-#@\\\/0-9]+\b/g,
  // UniProt ID patterns
  UNIPROT_ID: /\b[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2}\b/g,
  // Chemical formula
  CHEMICAL_FORMULA: /\b[A-Z][a-z]?(\d+)?([A-Z][a-z]?(\d+)?)+\b/g
};

export interface HighlightedSegment {
  text: string;
  type: 'protein_sequence' | 'dna_sequence' | 'pdb_id' | 'smiles' | 'uniprot_id' | 'chemical_formula' | 'text';
  startIndex: number;
  endIndex: number;
}

export function highlightMolecularData(text: string): HighlightedSegment[] {
  const segments: HighlightedSegment[] = [];
  const matches: { match: RegExpMatchArray; type: HighlightedSegment['type'] }[] = [];

  // Find all matches
  Object.entries(MOLECULAR_PATTERNS).forEach(([key, pattern]) => {
    const patternMatches = Array.from(text.matchAll(pattern));
    patternMatches.forEach(match => {
      // Additional validation for SMILES to reduce false positives
      if (key === 'SMILES') {
        const smiles = match[0];
        // Basic SMILES validation: should contain at least one bond or ring notation
        if (smiles.length < 5 || (!smiles.includes('=') && !smiles.includes('-') && !smiles.includes('(') && !smiles.includes('['))) {
          return;
        }
      }
      
      // Additional validation for protein sequences
      if (key === 'PROTEIN_SEQUENCE') {
        const seq = match[0];
        // Check if it's likely a protein sequence (not just repeated characters)
        const uniqueChars = new Set(seq.split(''));
        if (uniqueChars.size < 3) return; // Too repetitive
      }

      matches.push({
        match,
        type: key.toLowerCase().replace('_', '_') as HighlightedSegment['type']
      });
    });
  });

  // Sort matches by start position
  matches.sort((a, b) => a.match.index! - b.match.index!);

  // Build segments, handling overlaps
  let lastIndex = 0;
  matches.forEach(({ match, type }) => {
    const startIndex = match.index!;
    const endIndex = startIndex + match[0].length;

    // Skip overlapping matches
    if (startIndex < lastIndex) return;

    // Add text before match
    if (startIndex > lastIndex) {
      segments.push({
        text: text.slice(lastIndex, startIndex),
        type: 'text',
        startIndex: lastIndex,
        endIndex: startIndex
      });
    }

    // Add the match
    segments.push({
      text: match[0],
      type,
      startIndex,
      endIndex
    });

    lastIndex = endIndex;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      text: text.slice(lastIndex),
      type: 'text',
      startIndex: lastIndex,
      endIndex: text.length
    });
  }

  return segments.length > 0 ? segments : [{ text, type: 'text', startIndex: 0, endIndex: text.length }];
}

export function getHighlightStyles(type: HighlightedSegment['type']): string {
  const baseStyles = "relative font-mono transition-all duration-200";
  
  switch (type) {
    case 'protein_sequence':
      return `${baseStyles} text-blue-700 underline decoration-blue-200 decoration-dotted underline-offset-2 hover:bg-blue-50 hover:decoration-solid`;
    case 'dna_sequence':
      return `${baseStyles} text-emerald-700 underline decoration-emerald-200 decoration-dotted underline-offset-2 hover:bg-emerald-50 hover:decoration-solid`;
    case 'pdb_id':
      return `${baseStyles} text-violet-700 underline decoration-violet-200 decoration-dotted underline-offset-2 hover:bg-violet-50 hover:decoration-solid`;
    case 'smiles':
      return `${baseStyles} text-amber-700 underline decoration-amber-200 decoration-dotted underline-offset-2 hover:bg-amber-50 hover:decoration-solid`;
    case 'uniprot_id':
      return `${baseStyles} text-cyan-700 underline decoration-cyan-200 decoration-dotted underline-offset-2 hover:bg-cyan-50 hover:decoration-solid`;
    case 'chemical_formula':
      return `${baseStyles} text-pink-700 underline decoration-pink-200 decoration-dotted underline-offset-2 hover:bg-pink-50 hover:decoration-solid`;
    default:
      return '';
  }
}

export function getTypeColor(type: HighlightedSegment['type']): string {
  switch (type) {
    case 'protein_sequence':
      return 'bg-blue-500';
    case 'dna_sequence':
      return 'bg-emerald-500';
    case 'pdb_id':
      return 'bg-violet-500';
    case 'smiles':
      return 'bg-amber-500';
    case 'uniprot_id':
      return 'bg-cyan-500';
    case 'chemical_formula':
      return 'bg-pink-500';
    default:
      return 'bg-gray-500';
  }
}

export function getTypeIcon(type: HighlightedSegment['type']): string {
  switch (type) {
    case 'protein_sequence':
      return '🧬';
    case 'dna_sequence':
      return '🔗';
    case 'pdb_id':
      return '🏗️';
    case 'smiles':
      return '⚛️';
    case 'uniprot_id':
      return '🔖';
    case 'chemical_formula':
      return '🧪';
    default:
      return '📝';
  }
}
