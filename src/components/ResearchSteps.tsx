
import { useState, useEffect } from "react";
import { Loader2, CheckCircle } from "lucide-react";

const researchSteps = [
  "Searching RCSB PDB for protein structures...",
  "Running sequence similarity search with MMseqs2...",
  "Querying ChEMBL for known ligands...",
  "Fetching recent literature from PubMed and bioRxiv...",
  "Analyzing structural homologs with Foldseek...",
  "Compiling comprehensive research summary..."
];

export function ResearchSteps() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev < researchSteps.length - 1 ? prev + 1 : prev));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
        <Loader2 className="w-4 h-4 text-white animate-spin" />
      </div>
      
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-2xl">
        <h3 className="font-semibold text-slate-900 mb-4">Research in Progress</h3>
        
        <div className="space-y-3">
          {researchSteps.map((step, index) => (
            <div key={index} className={`flex items-center gap-3 transition-all duration-300 ${
              index <= currentStep ? 'opacity-100' : 'opacity-40'
            }`}>
              {index < currentStep ? (
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              ) : index === currentStep ? (
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
              )}
              <span className={`text-sm ${
                index <= currentStep ? 'text-slate-900' : 'text-slate-500'
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
