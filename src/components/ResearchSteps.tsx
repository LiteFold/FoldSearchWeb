import { useState, useEffect } from "react";
import { Loader2, CheckCircle } from "lucide-react";

// Define research steps with realistic timing (in milliseconds)
const researchSteps = [
  { text: "Initializing search parameters...", duration: 1200 },
  { text: "Searching RCSB PDB for protein structures...", duration: 3500 },
  { text: "Running sequence similarity search with MMseqs2...", duration: 4200 },
  { text: "Querying ChEMBL for known ligands...", duration: 2800 },
  { text: "Fetching recent literature from PubMed and bioRxiv...", duration: 3100 },
  { text: "Analyzing structural homologs with Foldseek...", duration: 4800 },
  { text: "Processing protein search results...", duration: 2200 },
  { text: "Compiling comprehensive research summary...", duration: 1800 },
  { text: "Finalizing results and preparing display...", duration: 1500 }
];

interface ResearchStepsProps {
  isComplete?: boolean;
}

export function ResearchSteps({ isComplete = false }: ResearchStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [stepStartTime, setStepStartTime] = useState<number>(Date.now());

  useEffect(() => {
    if (isComplete) {
      // Complete all steps quickly when done
      setCompletedSteps(new Set(Array.from({ length: researchSteps.length }, (_, i) => i)));
      setCurrentStep(researchSteps.length);
      return;
    }

    // Reset timing when component mounts
    setStepStartTime(Date.now());
    
    const progressSteps = () => {
      let stepIndex = 0;
      let totalElapsed = 0;

      const executeStep = () => {
        if (stepIndex >= researchSteps.length) return;

        const currentStepDef = researchSteps[stepIndex];
        // Add some random variation (±20%) to make it feel more natural
        const randomVariation = 0.8 + Math.random() * 0.4; // 0.8 to 1.2 multiplier
        const stepDuration = Math.floor(currentStepDef.duration * randomVariation);
        
        setCurrentStep(stepIndex);
        
        setTimeout(() => {
          setCompletedSteps(prev => new Set([...prev, stepIndex]));
          stepIndex++;
          totalElapsed += stepDuration;
          
          if (stepIndex < researchSteps.length) {
            // Small delay before starting next step to feel more natural
            setTimeout(executeStep, 200 + Math.random() * 300);
          } else {
            // All steps completed
            setCurrentStep(researchSteps.length);
          }
        }, stepDuration);
      };

      executeStep();
    };

    progressSteps();
  }, [isComplete]);

  const formatElapsedTime = () => {
    const elapsed = Math.floor((Date.now() - stepStartTime) / 1000);
    return `${elapsed}s`;
  };

  return (
    <div className="flex gap-4 max-w-4xl">
      <div className="w-8 h-8 rounded bg-gray-900 flex items-center justify-center flex-shrink-0 mt-1">
        {isComplete || currentStep >= researchSteps.length ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <Loader2 className="w-4 h-4 text-white animate-spin" />
        )}
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 text-sm">
            {isComplete || currentStep >= researchSteps.length ? "Research Completed" : "Research in Progress"}
          </h3>
          <div className="text-xs text-gray-500 font-mono">
            {!isComplete && currentStep < researchSteps.length && formatElapsedTime()}
          </div>
        </div>
        
        <div className="space-y-3">
          {researchSteps.map((step, index) => {
            const isCompleted = completedSteps.has(index);
            const isCurrent = index === currentStep && !isComplete;
            const isUpcoming = index > currentStep && !isComplete;
            
            return (
              <div key={index} className={`flex items-center gap-3 transition-all duration-500 ${
                isCompleted ? 'opacity-100' : 
                isCurrent ? 'opacity-100' : 'opacity-40'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                ) : (
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    isUpcoming ? 'border-gray-300' : 'border-gray-200'
                  }`}></div>
                )}
                <span className={`text-sm transition-colors duration-300 ${
                  isCompleted ? 'text-gray-900 font-medium' : 
                  isCurrent ? 'text-blue-900 font-medium' : 'text-gray-500'
                }`}>
                  {step.text}
                </span>
                {isCurrent && (
                  <div className="ml-auto">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {(isComplete || currentStep >= researchSteps.length) && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Search completed successfully. Results are now available below.
              </p>
              <div className="text-xs text-gray-500 font-mono">
                Total: {formatElapsedTime()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
