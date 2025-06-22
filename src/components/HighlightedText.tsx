import React, { useState } from 'react';
import { highlightMolecularData, getHighlightStyles, getTypeColor, getTypeIcon, HighlightedSegment } from '@/lib/utils';
import { ChevronDown, ChevronUp, Copy, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HighlightedTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

export function HighlightedText({ text, maxLength = 500, className = '' }: HighlightedTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedSegments, setCopiedSegments] = useState<Set<string>>(new Set());
  const [showMolecularSummary, setShowMolecularSummary] = useState(false);
  
  const segments = highlightMolecularData(text);
  const shouldTruncate = text.length > maxLength && !isExpanded;
  const hasMolecularData = segments.some(s => s.type !== 'text');
  
  const displayText = shouldTruncate ? text.slice(0, maxLength) + '...' : text;
  const displaySegments = shouldTruncate ? highlightMolecularData(displayText) : segments;

  const copyToClipboard = async (segment: HighlightedSegment) => {
    if (segment.type === 'text') return;
    
    try {
      await navigator.clipboard.writeText(segment.text);
      setCopiedSegments(prev => new Set(prev).add(`${segment.type}-${segment.startIndex}`));
      setTimeout(() => {
        setCopiedSegments(prev => {
          const newSet = new Set(prev);
          newSet.delete(`${segment.type}-${segment.startIndex}`);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const getTooltipText = (type: HighlightedSegment['type']) => {
    switch (type) {
      case 'protein_sequence':
        return 'Protein Sequence';
      case 'dna_sequence':
        return 'DNA/RNA Sequence';
      case 'pdb_id':
        return 'PDB Structure ID';
      case 'smiles':
        return 'SMILES Structure';
      case 'uniprot_id':
        return 'UniProt ID';
      case 'chemical_formula':
        return 'Chemical Formula';
      default:
        return '';
    }
  };

  const molecularDataSummary = segments.filter(s => s.type !== 'text').reduce((acc, segment) => {
    const count = acc[segment.type] || 0;
    acc[segment.type] = count + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className={`relative ${className}`}>
      <div className="text-sm leading-relaxed text-gray-700">
        {displaySegments.map((segment, index) => {
          if (segment.type === 'text') {
            return (
              <span key={index} className="whitespace-pre-wrap break-words">
                {segment.text}
              </span>
            );
          }

          const segmentKey = `${segment.type}-${segment.startIndex}`;
          const isCopied = copiedSegments.has(segmentKey);
          
          return (
            <span key={index} className="group relative">
              <span
                className={`${getHighlightStyles(segment.type)} cursor-pointer break-all`}
                title={`${getTooltipText(segment.type)} - Click to copy`}
                onClick={() => copyToClipboard(segment)}
              >
                {segment.text}
              </span>
              
              {/* Minimal copy feedback */}
              {isCopied && (
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg z-20 copy-feedback">
                  Copied!
                </span>
              )}
            </span>
          );
        })}
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3">
          {/* Expand/Collapse Button */}
          {text.length > maxLength && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-gray-500 hover:text-gray-700 p-0 h-auto font-medium"
            >
              {isExpanded ? (
                <>
                  Show less <ChevronUp className="w-3 h-3 ml-1" />
                </>
              ) : (
                <>
                  Show more <ChevronDown className="w-3 h-3 ml-1" />
                </>
              )}
            </Button>
          )}
          
          {/* Molecular Data Indicator */}
          {hasMolecularData && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMolecularSummary(!showMolecularSummary)}
              className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto font-medium flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              {Object.keys(molecularDataSummary).length} data type{Object.keys(molecularDataSummary).length > 1 ? 's' : ''} detected
            </Button>
          )}
        </div>
        
        {hasMolecularData && (
          <div className="text-xs text-gray-400">
            Click highlighted items to copy
          </div>
        )}
      </div>
      
      {/* Elegant Molecular Data Summary */}
      {showMolecularSummary && hasMolecularData && (
        <div className="mt-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Molecular Data Found</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(molecularDataSummary).map(([type, count]) => (
              <div key={type} className="flex items-center gap-2 p-2 bg-white rounded border border-gray-100">
                <div className={`w-2 h-2 rounded-full ${getTypeColor(type as HighlightedSegment['type'])}`}></div>
                <span className="text-xs text-gray-600">
                  {getTooltipText(type as HighlightedSegment['type'])}
                </span>
                <span className="text-xs font-medium text-gray-800 ml-auto">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 