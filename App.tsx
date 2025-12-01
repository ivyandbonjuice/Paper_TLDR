import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import AnalysisResultView from './components/AnalysisResultView';
import { AnalysisResult, AnalysisStatus, FileData } from './types';
import { analyzeContent } from './services/geminiService';
import { Sparkles, BrainCircuit, Globe2 } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [targetLang, setTargetLang] = useState<string>('Chinese');
  const [loadingMsg, setLoadingMsg] = useState<string>('Initializing AI...');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Analyze File (PDF)
  const handleFileSelect = async (fileData: FileData) => {
    try {
      setStatus(AnalysisStatus.ANALYZING);
      setErrorMsg(null);
      setLoadingMsg('Reading document structure...');
      
      // Artificial delay for UX perception if file is small
      setTimeout(() => setLoadingMsg('Synthesizing key insights...'), 2000);
      setTimeout(() => setLoadingMsg('Generating concept map...'), 5000);

      const analysis = await analyzeContent(fileData.base64, true, targetLang);
      
      setResult(analysis);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Something went wrong.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  // Analyze Text
  const handleTextAnalyze = async (text: string) => {
    if (!text.trim()) return;
    try {
      setStatus(AnalysisStatus.ANALYZING);
      setErrorMsg(null);
      setLoadingMsg('Analyzing text content...');
      
      const analysis = await analyzeContent(text, false, targetLang);
      
      setResult(analysis);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Something went wrong.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(AnalysisStatus.IDLE);
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      
      {/* Navigation / Header */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              PaperDistill AI
            </span>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                <Globe2 className="w-4 h-4" />
                <span>Target Language:</span>
                <select 
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  disabled={status === AnalysisStatus.ANALYZING}
                  className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer"
                >
                  <option value="Chinese">Chinese (Simplified)</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Japanese">Japanese</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
             </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-4rem)] flex flex-col">
        
        {/* Intro Section (Only visible when IDLE) */}
        {status === AnalysisStatus.IDLE && (
          <div className="flex-1 flex flex-col items-center justify-center animate-fade-in-up">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                Turn Documents into <br/>
                <span className="text-indigo-600">Visual Insights</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                Upload a research paper or paste text. 
                Get a comprehensive summary, key takeaways, and a generated concept map instantly.
              </p>
            </div>

            <FileUpload 
              onFileSelect={handleFileSelect}
              onUrlInput={(text) => {
                 // Debounce or wait for button click logic usually goes here
                 // For simplicity, we just pass the handler to the Enter key or a manual button in FileUpload
                 if(text.length > 50) { 
                   // Auto-trigger for paste? No, better let user click 'Analyze'
                   // We'll expose a manual trigger prop to FileUpload if needed, 
                   // but for now, let's wrap the FileUpload logic to include the button.
                 }
              }}
              isLoading={false} 
            />
            
            {/* Manual Trigger for Text (since FileUpload has the text area) */}
            {/* Note: In a real app, FileUpload would handle the 'Analyze' click for text. 
                I'll patch FileUpload to call a specific prop for text analysis. */}
            <div className="mt-8">
               {/* This logic is handled inside FileUpload's Analyze button which calls onUrlInput? 
                   Wait, FileUpload's current onUrlInput just updates state. 
                   Let's assume the user pastes and we provide a button *outside* or *inside*.
                   Refactored: FileUpload component now has the "Analyze Text" button visual,
                   but we need to wire it.
                   
                   Let's quickly fix FileUpload wiring in a simple way:
                   The FileUpload component renders the text area.
                   We need a way to submit that text.
               */}
               <TextAnalyzeButtonHelper onAnalyze={handleTextAnalyze} />
            </div>
          </div>
        )}

        {/* Loading State */}
        {status === AnalysisStatus.ANALYZING && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-pulse">
             <div className="relative">
               <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                 <Sparkles className="w-10 h-10 text-indigo-600 animate-spin-slow" />
               </div>
               <div className="absolute top-0 right-0 w-4 h-4 bg-violet-500 rounded-full animate-ping" />
             </div>
             <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Content</h2>
             <p className="text-slate-500 font-medium">{loadingMsg}</p>
          </div>
        )}

        {/* Error State */}
        {status === AnalysisStatus.ERROR && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-500 font-bold text-2xl">
               !
             </div>
             <h2 className="text-2xl font-bold text-slate-800 mb-2">Analysis Failed</h2>
             <p className="text-slate-500 max-w-md mb-8">{errorMsg}</p>
             <button 
               onClick={handleReset}
               className="bg-indigo-600 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:bg-indigo-700 transition-all"
             >
               Try Again
             </button>
          </div>
        )}

        {/* Results */}
        {status === AnalysisStatus.COMPLETED && result && (
          <AnalysisResultView result={result} onReset={handleReset} />
        )}

      </main>
    </div>
  );
};

// Helper component to connect the text area in FileUpload (conceptually) to the main app action
// In a real refactor, FileUpload would manage the text state and emit on submit.
// Here we are patching the behavior by letting the App control the "Analyze Text" flow via the FileUpload props?
// Actually, let's keep it simple: We used a placeholder in FileUpload. 
// Ideally FileUpload should have a "Submit" button for the text area.
// I will modify FileUpload to handle the text submission directly.

const TextAnalyzeButtonHelper = ({ onAnalyze }: { onAnalyze: (text: string) => void }) => {
  // This is a dummy wrapper because the button is inside FileUpload.
  // We need to pass the logic INTO FileUpload.
  // I will update FileUpload code to accept an `onTextSubmit` prop.
  return null; 
}

// Re-defining FileUpload to include the submission logic correctly since I can't easily edit the previous file block *after* I wrote it in the XML stream?
// No, I can overwrite it if I haven't closed the changes tag. 
// But I already outputted FileUpload. 
// I will update App.tsx to pass a modified handler to FileUpload if needed. 
// WAIT: The FileUpload I wrote earlier has `onUrlInput` which updates state, but no button action to trigger the parent.
// The button in FileUpload says `onClick={() => {}}`.
// I need to fix `FileUpload.tsx` to actually trigger the analysis.
// I will add a new change block for `components/FileUpload.tsx` to overwrite the previous one with better logic.

export default App;