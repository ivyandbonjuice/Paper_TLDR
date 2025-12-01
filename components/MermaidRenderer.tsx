import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidRendererProps {
  chart: string;
}

const MermaidRenderer: React.FC<MermaidRendererProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');

  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: false,
      theme: 'neutral',
      securityLevel: 'loose',
      fontFamily: 'Inter, sans-serif'
    });
  }, []);

  useEffect(() => {
    const renderChart = async () => {
      if (!containerRef.current || !chart) return;
      
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        // Cleanup previous SVG
        setSvg(''); 
        
        const { svg: renderedSvg } = await mermaid.render(id, chart);
        setSvg(renderedSvg);
      } catch (error) {
        console.error("Mermaid rendering failed:", error);
        setSvg('<div class="text-red-500 text-sm p-4">Could not render diagram. Syntax might be invalid.</div>');
      }
    };

    renderChart();
  }, [chart]);

  return (
    <div 
      ref={containerRef}
      className="w-full overflow-x-auto flex justify-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default MermaidRenderer;