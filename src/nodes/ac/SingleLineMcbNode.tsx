import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type SingleLineMcbNodeType = Node<SchematicNodeData, 'singleLineMcb'>;

export function SingleLineMcbNode({ data, selected }: NodeProps<SingleLineMcbNodeType>) {
  const label = data.parameters.curve
    ? `${String(data.parameters.curve)}${String(data.parameters.ratingCurrent ?? '')}A`
    : `${String(data.parameters.ratingCurrent ?? '')}A`;

  const horizontal = data.parameters.orientation === 'pozioma';

  if (horizontal) {
    return (
      <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 50, height: 30 }}>
        <Handle type="source" position={Position.Left} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', top: 10 }} />

        <svg width="50" height="30" viewBox="0 0 50 30" style={{ overflow: 'visible' }}>
          <text x="25" y="-4" textAnchor="middle" fontSize="8" fill="#333" fontWeight="bold">{data.label}</text>
          <text x="25" y="28" textAnchor="middle" fontSize="7" fill="#888">{label}</text>

          <line x1="0" y1="10" x2="10" y2="10" stroke="#333" strokeWidth="1.5" />
          <line x1="10" y1="10" x2="28" y2="0" stroke="#333" strokeWidth="2" />
          {/* Wyzwalacz termiczny */}
          <rect x="18" y="1" width="4" height="5" fill="none" stroke="#333" strokeWidth="0.8" />
          {/* Wyzwalacz elektromagnetyczny */}
          <path d="M 32,7 A 4,4 0 0,1 32,15" fill="none" stroke="#333" strokeWidth="0.8" />
          <circle cx="35" cy="10" r="2" fill="#333" />
          <line x1="37" y1="10" x2="50" y2="10" stroke="#333" strokeWidth="1.5" />
        </svg>

        <Handle type="source" position={Position.Right} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', top: 10 }} />
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 30 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 10 }} />

      <svg width="30" height="50" viewBox="0 0 30 50" style={{ overflow: 'visible' }}>
        <text x="15" y="-8" textAnchor="middle" fontSize="9" fill="#333" fontWeight="bold">{data.label}</text>
        <text x="15" y="0" textAnchor="middle" fontSize="7" fill="#888">{label}</text>

        <line x1="10" y1="4" x2="10" y2="14" stroke="#333" strokeWidth="1.5" />
        <line x1="10" y1="14" x2="20" y2="30" stroke="#333" strokeWidth="2" />
        <rect x="16" y="22" width="5" height="4" fill="none" stroke="#333" strokeWidth="0.8" />
        <path d="M 7,34 A 4,4 0 0,1 15,34" fill="none" stroke="#333" strokeWidth="0.8" />
        <circle cx="10" cy="37" r="2" fill="#333" />
        <line x1="10" y1="39" x2="10" y2="50" stroke="#333" strokeWidth="1.5" />
      </svg>

      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 10 }} />
    </div>
  );
}
