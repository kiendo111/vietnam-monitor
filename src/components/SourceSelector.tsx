// src/components/SourceSelector.tsx
import React from 'react';

interface SourceSelectorProps {
  sources: string[];
  selectedSource: string;
  onSelectSource: (source: string) => void;
}

const SourceSelector: React.FC<SourceSelectorProps> = ({ sources, selectedSource, onSelectSource }) => {
  const allSources = ['All', ...sources];

  return (
    <div style={{
      display: 'flex',
      overflowX: 'auto',
      padding: '8px 16px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg2)',
      flexShrink: 0,
    }}>
      {allSources.map(source => (
        <button
          key={source}
          onClick={() => onSelectSource(source)}
          style={{
            background: selectedSource === source ? 'var(--red)' : 'var(--bg3)',
            color: selectedSource === source ? 'white' : 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '6px 12px',
            marginRight: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s',
          }}
        >
          {source}
        </button>
      ))}
    </div>
  );
};

export default SourceSelector;
