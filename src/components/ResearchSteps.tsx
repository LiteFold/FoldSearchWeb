import { useState, useEffect } from "react";
import { Loader2, CheckCircle, BarChart3 } from "lucide-react";

// Different step pools for different types of searches
const webResearchSteps = [
  { text: "Initializing web research parameters...", duration: 1000, category: "init" },
  { text: "Configuring search engines and APIs...", duration: 800, category: "init" },
  
  { text: "Searching PubMed for recent publications...", duration: 3200, category: "literature" },
  { text: "Querying bioRxiv preprint servers...", duration: 2800, category: "literature" },
  { text: "Scanning Google Scholar database...", duration: 3500, category: "literature" },
  { text: "Mining research abstracts and keywords...", duration: 2400, category: "literature" },
  { text: "Analyzing citation networks...", duration: 2900, category: "literature" },
  
  { text: "Processing research papers...", duration: 1800, category: "processing" },
  { text: "Extracting key insights and findings...", duration: 2100, category: "processing" },
  { text: "Ranking papers by relevance...", duration: 1600, category: "processing" },
  
  { text: "Generating follow-up protein queries...", duration: 1900, category: "final" },
  { text: "Compiling research summary...", duration: 1400, category: "final" }
];

const proteinSearchSteps = [
  { text: "Initializing protein search parameters...", duration: 1200, category: "init" },
  { text: "Configuring structural databases...", duration: 900, category: "init" },
  
  { text: "Searching RCSB PDB for protein structures...", duration: 3500, category: "pdb" },
  { text: "Querying Protein Data Bank archives...", duration: 3200, category: "pdb" },
  { text: "Scanning AlphaFold structure database...", duration: 3800, category: "pdb" },
  
  { text: "Running sequence similarity search with MMseqs2...", duration: 4200, category: "sequence" },
  { text: "Performing BLAST sequence alignment...", duration: 3900, category: "sequence" },
  { text: "Executing HMM profile searches...", duration: 4500, category: "sequence" },
  
  { text: "Querying ChEMBL for known ligands...", duration: 2800, category: "chembl" },
  { text: "Searching chemical databases...", duration: 2600, category: "chembl" },
  { text: "Analyzing bioactive compounds...", duration: 3100, category: "chembl" },
  
  { text: "Analyzing structural homologs with Foldseek...", duration: 4800, category: "structure" },
  { text: "Computing structural alignments...", duration: 4300, category: "structure" },
  { text: "Evaluating protein fold similarities...", duration: 5100, category: "structure" },
  
  { text: "Processing protein search results...", duration: 2200, category: "processing" },
  { text: "Filtering and ranking candidates...", duration: 1900, category: "processing" },
  { text: "Validating structural data...", duration: 2400, category: "processing" },
  
  { text: "Cross-referencing protein entries...", duration: 1800, category: "final" },
  { text: "Compiling structural analysis...", duration: 2100, category: "final" }
];

const combinedSearchSteps = [
  { text: "Initializing comprehensive search...", duration: 1200, category: "init" },
  { text: "Configuring all databases and APIs...", duration: 1000, category: "init" },
  
  { text: "Searching PubMed for recent publications...", duration: 2800, category: "literature" },
  { text: "Mining research abstracts...", duration: 2400, category: "literature" },
  
  { text: "Searching RCSB PDB for protein structures...", duration: 3500, category: "pdb" },
  { text: "Querying Protein Data Bank archives...", duration: 3200, category: "pdb" },
  
  { text: "Running sequence similarity searches...", duration: 4200, category: "sequence" },
  { text: "Performing structural alignments...", duration: 4500, category: "structure" },
  
  { text: "Querying ChEMBL for bioactive compounds...", duration: 2800, category: "chembl" },
  { text: "Analyzing ligand binding data...", duration: 3100, category: "chembl" },
  
  { text: "Cross-referencing literature with structures...", duration: 2500, category: "processing" },
  { text: "Integrating multi-database results...", duration: 2200, category: "processing" },
  
  { text: "Compiling comprehensive research report...", duration: 2100, category: "final" },
  { text: "Finalizing integrated analysis...", duration: 1800, category: "final" }
];

// Generate randomized steps for each search type
const generateRandomizedSteps = (searchType: 'web' | 'protein' | 'combined') => {
  let stepPool: typeof webResearchSteps;
  let categories: string[];
  
  switch (searchType) {
    case 'web':
      stepPool = webResearchSteps;
      categories = ['init', 'literature', 'processing', 'final'];
      break;
    case 'protein':
      stepPool = proteinSearchSteps;
      categories = ['init', 'pdb', 'sequence', 'chembl', 'structure', 'processing', 'final'];
      break;
    case 'combined':
      stepPool = combinedSearchSteps;
      categories = ['init', 'literature', 'pdb', 'sequence', 'structure', 'chembl', 'processing', 'final'];
      break;
    default:
      stepPool = combinedSearchSteps;
      categories = ['init', 'literature', 'pdb', 'sequence', 'structure', 'chembl', 'processing', 'final'];
  }
  
  const selectedSteps: typeof stepPool = [];
  
  categories.forEach(category => {
    const categorySteps = stepPool.filter(step => step.category === category);
    if (category === 'init' || category === 'final') {
      // Always include 1 from init and final
      const randomStep = categorySteps[Math.floor(Math.random() * categorySteps.length)];
      if (randomStep) selectedSteps.push(randomStep);
    } else {
      // Randomly include 1-2 steps from other categories
      const numSteps = Math.random() > 0.4 ? 1 : 2;
      const shuffled = [...categorySteps].sort(() => Math.random() - 0.5);
      selectedSteps.push(...shuffled.slice(0, numSteps));
    }
  });
  
  // For web search, keep steps in order (literature flow)
  if (searchType === 'web') {
    return selectedSteps.sort((a, b) => {
      const order = ['init', 'literature', 'processing', 'final'];
      return order.indexOf(a.category) - order.indexOf(b.category);
    });
  }
  
  // For protein and combined, shuffle middle steps (keep init first and final last)
  const initSteps = selectedSteps.filter(s => s.category === 'init');
  const finalSteps = selectedSteps.filter(s => s.category === 'final');
  const middleSteps = selectedSteps.filter(s => s.category !== 'init' && s.category !== 'final')
    .sort(() => Math.random() - 0.5);
  
  return [...initSteps, ...middleSteps, ...finalSteps];
};

interface ResearchStepsProps {
  isComplete?: boolean;
  hasResults?: boolean;
  searchType?: 'web' | 'protein' | 'combined';
}

export function ResearchSteps({ 
  isComplete = false, 
  hasResults = true, 
  searchType = 'combined' 
}: ResearchStepsProps) {
  const [researchSteps] = useState(() => generateRandomizedSteps(searchType));
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [stepStartTime, setStepStartTime] = useState<number>(Date.now());
  const [showAggregation, setShowAggregation] = useState(false);
  const [aggregationProgress, setAggregationProgress] = useState(0);
  const [stepsCompleted, setStepsCompleted] = useState(false);
  const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isComplete) {
      // Complete all steps quickly when search is fully done
      setCompletedSteps(new Set(Array.from({ length: researchSteps.length }, (_, i) => i)));
      setCurrentStep(researchSteps.length);
      setStepsCompleted(true);
      setShowAggregation(true);
      
      // Quickly finish the progress bar when backend completes
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setAggregationProgress(100);
      return;
    }

    // Reset timing when component mounts
    setStepStartTime(Date.now());
    
    const progressSteps = () => {
      let stepIndex = 0;
      
      const executeStep = () => {
        if (stepIndex >= researchSteps.length) {
          // All regular steps completed, now wait for backend results
          setStepsCompleted(true);
          setCurrentStep(researchSteps.length);
          
          // Wait a bit, then start slow aggregation progress
          setTimeout(() => {
            if (!isComplete) {
              setShowAggregation(true);
              
              // Start slow progress that never completes until backend responds
              let progress = 0;
              const interval = setInterval(() => {
                if (isComplete) {
                  // Backend completed, finish quickly
                  clearInterval(interval);
                  setAggregationProgress(100);
                  return;
                }
                
                // Slow progress that slows down even more as it approaches the limit
                const maxProgress = 88; // Never go above 88% until backend completes
                const remaining = maxProgress - progress;
                const increment = Math.max(0.5, remaining * 0.02 + Math.random() * 1.5); // Slow down as we approach limit
                
                progress = Math.min(maxProgress, progress + increment);
                setAggregationProgress(progress);
                
                // If we hit the max, slow down the interval even more
                if (progress >= maxProgress - 5) {
                  clearInterval(interval);
                  // Super slow progress near the end
                  const slowInterval = setInterval(() => {
                    if (isComplete) {
                      clearInterval(slowInterval);
                      setAggregationProgress(100);
                      return;
                    }
                    progress = Math.min(maxProgress, progress + Math.random() * 0.3);
                    setAggregationProgress(progress);
                  }, 2000 + Math.random() * 3000); // Very slow updates
                  setProgressInterval(slowInterval);
                }
                
              }, 800 + Math.random() * 1200); // Slow base interval
              setProgressInterval(interval);
            }
          }, 1000);
          return;
        }

        const currentStepDef = researchSteps[stepIndex];
        // Add more random variation (±40%) to make it feel more natural
        const randomVariation = 0.6 + Math.random() * 0.8; // 0.6 to 1.4 multiplier
        const stepDuration = Math.floor(currentStepDef.duration * randomVariation);
        
        setCurrentStep(stepIndex);
        
        setTimeout(() => {
          setCompletedSteps(prev => new Set([...prev, stepIndex]));
          stepIndex++;
          
          if (stepIndex < researchSteps.length) {
            // Variable delay before starting next step
            setTimeout(executeStep, 300 + Math.random() * 500);
          } else {
            executeStep(); // Call again to handle completion
          }
        }, stepDuration);
      };

      executeStep();
    };

    progressSteps();
    
    // Cleanup interval on unmount
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [isComplete, hasResults, researchSteps.length]);

  // Handle completion when backend responds
  useEffect(() => {
    if (isComplete && showAggregation && aggregationProgress < 100) {
      // Clear any existing interval
      if (progressInterval) {
        clearInterval(progressInterval);
        setProgressInterval(null);
      }
      // Quickly complete the progress
      setAggregationProgress(100);
    }
  }, [isComplete, showAggregation, aggregationProgress, progressInterval]);

  const formatElapsedTime = () => {
    const elapsed = Math.floor((Date.now() - stepStartTime) / 1000);
    return `${elapsed}s`;
  };

  const isFullyComplete = isComplete && aggregationProgress >= 100;

  return (
    <div className="flex gap-4 max-w-4xl">
      <div className="w-8 h-8 rounded bg-gray-900 flex items-center justify-center flex-shrink-0 mt-1">
        {isFullyComplete ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <Loader2 className="w-4 h-4 text-white animate-spin" />
        )}
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 text-sm">
            {isFullyComplete ? 
              (searchType === 'web' ? "Web Research Completed" : 
               searchType === 'protein' ? "Protein Search Completed" : 
               "Research Completed") : 
              showAggregation ? "Finalizing Search" : 
              (searchType === 'web' ? "Web Research in Progress" : 
               searchType === 'protein' ? "Protein Search in Progress" : 
               "Research in Progress")}
          </h3>
          <div className="text-xs text-gray-500 font-mono">
            {!isFullyComplete && `Total: ${formatElapsedTime()}`}
          </div>
        </div>
        
        <div className="space-y-3">
          {researchSteps.map((step, index) => {
            const isCompleted = completedSteps.has(index);
            const isCurrent = index === currentStep && !stepsCompleted;
            const isUpcoming = index > currentStep && !stepsCompleted;
            
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
          
          {/* Slow progress bar tied to backend timing */}
          {showAggregation && (
            <div className="border-t border-gray-100 pt-4 mt-4">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className={`w-4 h-4 ${aggregationProgress >= 100 ? 'text-green-600' : 'text-orange-600'}`} />
                <span className={`text-sm font-medium ${aggregationProgress >= 100 ? 'text-green-900' : 'text-orange-900'}`}>
                  {aggregationProgress >= 100 ? 'Analysis complete' : 'Collecting and aggregating results...'}
                </span>
                <div className="ml-auto text-xs text-gray-500 font-mono">
                  {Math.round(aggregationProgress)}%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ease-out ${
                    aggregationProgress >= 100 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gradient-to-r from-orange-500 to-yellow-500'
                  }`}
                  style={{ width: `${aggregationProgress}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                {searchType === 'web' ? (
                  <>
                    <div>Processing {Math.floor(aggregationProgress * 0.12 + 8)} research papers...</div>
                    <div>Analyzing {Math.floor(aggregationProgress * 0.08 + 5)} citation networks...</div>
                    {aggregationProgress > 50 && (
                      <div>Generating follow-up protein queries...</div>
                    )}
                  </>
                ) : searchType === 'protein' ? (
                  <>
                    <div>Processing {Math.floor(aggregationProgress * 0.25 + 20)} protein structures...</div>
                    <div>Cross-referencing {Math.floor(aggregationProgress * 0.15 + 8)} molecular structures...</div>
                    {aggregationProgress > 50 && (
                      <div>Compiling structural analysis...</div>
                    )}
                  </>
                ) : (
                  <>
                    <div>Processing {Math.floor(aggregationProgress * 0.23 + 15)} database entries...</div>
                    <div>Cross-referencing {Math.floor(aggregationProgress * 0.15 + 8)} molecular structures...</div>
                    {aggregationProgress > 50 && (
                      <div>Integrating literature with structural data...</div>
                    )}
                  </>
                )}
                {aggregationProgress >= 88 && aggregationProgress < 100 && (
                  <div className="text-orange-600">Waiting for final results from backend...</div>
                )}
                {aggregationProgress >= 100 && (
                  <div className="text-green-600 font-medium">
                    ✓ {searchType === 'web' ? 'Web research' : 
                         searchType === 'protein' ? 'Protein search' : 
                         'Search analysis'} completed
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {isFullyComplete && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {searchType === 'web' ? 'Web research' : 
                 searchType === 'protein' ? 'Protein search' : 
                 'Research'} completed. {hasResults ? "Results are now available below." : "No matching results found."}
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
