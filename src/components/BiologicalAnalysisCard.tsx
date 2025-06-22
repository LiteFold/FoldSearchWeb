import { Brain, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BiologicalAnalysis } from "../hooks/useSearch";

interface BiologicalAnalysisCardProps {
  analysis: BiologicalAnalysis;
}

export function BiologicalAnalysisCard({ analysis }: BiologicalAnalysisCardProps) {
  const formatAnalysisType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getAnalysisTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'protein_analysis':
        return 'bg-gray-100 text-gray-700';
      case 'molecular_analysis':
        return 'bg-gray-100 text-gray-700';
      case 'biological_summary':
        return 'bg-gray-100 text-gray-700';
      case 'research_synthesis':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="mb-4 border border-gray-200 bg-gray-50/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
            <Brain className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-gray-900">AI Biological Analysis</h3>
              <Sparkles className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex items-center gap-3">
              <Badge 
                variant="secondary" 
                className={`${getAnalysisTypeColor(analysis.analysis_type)} border-0`}
              >
                {formatAnalysisType(analysis.analysis_type)}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-3 h-3" />
                {analysis.processing_time.toFixed(1)}s processing time
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-slate max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {analysis.analysis_text}
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Generated for query: "{analysis.query}"
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 