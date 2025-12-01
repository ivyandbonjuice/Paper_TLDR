import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeContent = async (
  content: string, // Base64 for PDF or raw text
  isPdf: boolean,
  targetLanguage: string = 'Chinese'
): Promise<AnalysisResult> => {
  
  const modelId = "gemini-2.5-flash"; // Efficient for large context like PDFs

  const schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "A concise title of the content." },
      summary: { type: Type.STRING, description: "A comprehensive TL;DR summary of the content (2-3 paragraphs)." },
      keyPoints: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "A list of 5-10 critical takeaways or facts from the content."
      },
      mermaidDiagram: { 
        type: Type.STRING, 
        description: "Valid Mermaid.js code (either 'mindmap' or 'graph TD') that visualizes the structure or flow of the content. Do not include markdown code fences." 
      },
      originalLanguage: { type: Type.STRING, description: "The detected language of the source content." },
      translation: { 
        type: Type.STRING, 
        description: `The 'summary' and 'keyPoints' translated into ${targetLanguage}. Format it as a markdown string.` 
      }
    },
    required: ["title", "summary", "keyPoints", "mermaidDiagram", "originalLanguage", "translation"]
  };

  const systemInstruction = `
    You are an expert research assistant and content visualizer. 
    Your goal is to distill complex information into clear, accessible summaries and diagrams.
    
    1. Analyze the input content (PDF or Text).
    2. Generate a structured summary.
    3. Create a Mermaid.js diagram code:
       - Use 'mindmap' for hierarchical concepts.
       - Use 'graph TD' for processes or workflows.
       - Ensure the node labels are concise.
       - IMPORTANT: Return ONLY the raw Mermaid code string, no backticks or 'mermaid' labels.
    4. Provide a translation of the main findings into ${targetLanguage}.
    
    Make the tone professional yet easy to understand for a general audience.
  `;

  let parts: any[] = [];
  
  if (isPdf) {
    parts.push({
      inlineData: {
        data: content,
        mimeType: "application/pdf"
      }
    });
    parts.push({
      text: "Analyze this PDF document."
    });
  } else {
    parts.push({
      text: content
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");

    const result = JSON.parse(jsonText) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze content. Please try again.");
  }
};