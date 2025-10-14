import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

const MermaidDiagram = ({ chart }) => {
  const ref = useRef(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      themeVariables: {
        primaryColor: '#10b981',
        primaryTextColor: '#fff',
        primaryBorderColor: '#059669',
        lineColor: '#6b7280',
        secondaryColor: '#3b82f6',
        tertiaryColor: '#f59e0b',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
      },
    });
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.removeAttribute('data-processed');
      ref.current.innerHTML = chart;
      mermaid.contentLoaded();
    }
  }, [chart]);

  return <div className="mermaid" ref={ref}>{chart}</div>;
};

export default MermaidDiagram;
