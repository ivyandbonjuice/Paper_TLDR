import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import MermaidRenderer from './MermaidRenderer';
import { BookOpen, Share2, Languages, Layout, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AnalysisResultViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({ result, onReset }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'diagram' | 'translation'>('summary');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `Title: ${result.title}\n\nSummary:\n${result.summary}\n\nKey Points:\n${result.keyPoints.map(p => `- ${p}`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto w-full animate-fade-in pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-slate-800 leading-tight">
            {result.title}
          </h1>
          <button 
             onClick={onReset}
             className="text-slate-400 hover:text-slate-600 text-sm font-medium px-4 py-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            New Analysis
          </button>
        </div>
        <div className="flex gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wide">
            <BookOpen className="w-3 h-3" />
            {result.originalLanguage}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wide">
            AI Generated
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-100/80 p-1 rounded-full inline-flex">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeTab === 'summary' 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('diagram')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeTab === 'diagram' 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Layout className="w-4 h-4" />
            Visual Map
          </button>
          <button
            onClick={() => setActiveTab('translation')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeTab === 'translation' 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Languages className="w-4 h-4" />
            Translation
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {activeTab === 'summary' && (
          <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-slate-800">Executive Summary</h2>
                  <button onClick={handleCopy} className="text-slate-400 hover:text-indigo-600 transition-colors">
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                <div className="prose prose-slate prose-lg text-slate-600 leading-relaxed">
                  <ReactMarkdown>{result.summary}</ReactMarkdown>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-indigo-900 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <BookOpen className="w-24 h-24" />
                </div>
                <h3 className="text-lg font-semibold mb-4 relative z-10">Key Takeaways</h3>
                <ul className="space-y-3 relative z-10">
                  {result.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex gap-3 text-indigo-100 text-sm leading-snug">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'diagram' && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-fade-in">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Concept Map</h2>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Generated by Mermaid.js</span>
             </div>
             <MermaidRenderer chart={result.mermaidDiagram} />
             <p className="text-center text-slate-400 text-sm mt-4">
               This diagram visualizes the structure and flow of concepts extracted from the document.
             </p>
          </div>
        )}

        {activeTab === 'translation' && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-fade-in">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Translated Insights</h2>
            <div className="prose prose-slate prose-lg text-slate-600">
              <ReactMarkdown>{result.translation || "No translation available."}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResultView;