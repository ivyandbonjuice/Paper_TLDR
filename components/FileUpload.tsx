import React, { useCallback, useState } from 'react';
import { UploadCloud, FileText, ArrowRight } from 'lucide-react';
import { fileToBase64 } from '../services/utils';
import { FileData } from '../types';

interface FileUploadProps {
  onFileSelect: (data: FileData) => void;
  // We repurpose onUrlInput to be the actual submit handler for text
  onUrlInput: (text: string) => void; 
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onUrlInput, isLoading }) => {
  const [textInput, setTextInput] = useState('');

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;

    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type === 'application/pdf') {
      const file = files[0];
      const base64 = await fileToBase64(file);
      onFileSelect({ base64, mimeType: file.type, name: file.name });
    }
  }, [onFileSelect, isLoading]);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading) return;
    
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const base64 = await fileToBase64(file);
      onFileSelect({ base64, mimeType: file.type, name: file.name });
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim().length > 10) {
      onUrlInput(textInput);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in-up">
      {/* Upload Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`
          relative group cursor-pointer
          border-2 border-dashed rounded-3xl p-10 
          transition-all duration-300 ease-in-out
          flex flex-col items-center justify-center text-center
          ${isLoading ? 'opacity-50 cursor-not-allowed border-slate-200' : 'border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/30'}
          bg-white shadow-sm hover:shadow-md
        `}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          disabled={isLoading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        <div className="bg-indigo-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
          <UploadCloud className="w-8 h-8 text-indigo-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          Drop your PDF here
        </h3>
        <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
          Support for research papers, articles, and documents (up to 20MB).
        </p>
        
        <span className="bg-white text-indigo-600 border border-indigo-200 px-6 py-2 rounded-full font-medium shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          Browse Files
        </span>
      </div>

      <div className="flex items-center gap-4 w-full">
        <div className="h-px bg-slate-200 flex-1"></div>
        <span className="text-slate-400 text-sm font-medium">OR PASTE TEXT</span>
        <div className="h-px bg-slate-200 flex-1"></div>
      </div>

      {/* Text/URL Area */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-slate-400 mt-1" />
          <textarea 
            placeholder="Paste article text, abstract, or notes here..."
            className="w-full h-32 resize-none outline-none text-slate-600 placeholder-slate-400 bg-transparent text-sm leading-relaxed"
            disabled={isLoading}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-50">
           <span className="text-xs text-slate-400">
             {textInput.length} characters
           </span>
           <button 
             onClick={handleTextSubmit}
             disabled={textInput.trim().length < 10 || isLoading}
             className={`
               flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm transition-all
               ${textInput.trim().length < 10 
                 ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                 : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'}
             `}
           >
             Analyze Text <ArrowRight className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;