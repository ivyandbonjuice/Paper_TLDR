export interface AnalysisResult {
  title: string;
  summary: string;
  keyPoints: string[];
  mermaidDiagram: string;
  translation?: string;
  originalLanguage: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export type InputMode = 'PDF' | 'TEXT';

export interface FileData {
  base64: string;
  mimeType: string;
  name: string;
}
