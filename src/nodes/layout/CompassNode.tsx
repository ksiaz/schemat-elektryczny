import { type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type CompassNodeType = Node<SchematicNodeData, 'compass'>;

// Wskaznik N-S — obusieczna strzalka z plynnym obracaniem
export function CompassNode({ data, selected }: NodeProps<CompassNodeType>) {
  const rotation = Number(data.parameters.rotation) || 0;

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-1 ring-blue-400' : ''}`} style={{ width: 40, cursor: 'move' }}>
      <svg width="40" height="80" viewBox="0 0 40 80" style={{ overflow: 'visible' }}>
        <g transform={`rotate(${rotation}, 20, 40)`}>
          {/* Strzalka N (gora) — wypelniona */}
          <polygon points="20,2 14,30 26,30" fill="#333" stroke="#333" strokeWidth="1" />
          <text x="20" y="-2" textAnchor="middle" fontSize="12" fill="#333" fontWeight="bold">N</text>

          {/* Linia srodkowa */}
          <line x1="20" y1="30" x2="20" y2="50" stroke="#333" strokeWidth="1.5" />

          {/* Strzalka S (dol) — kontur */}
          <polygon points="20,78 14,50 26,50" fill="none" stroke="#333" strokeWidth="1" />
          <text x="20" y="90" textAnchor="middle" fontSize="12" fill="#333" fontWeight="bold">S</text>
        </g>
      </svg>
    </div>
  );
}
