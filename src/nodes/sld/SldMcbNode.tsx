import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldMcb'>;

export function SldMcbNode({ data, selected }: NodeProps<T>) {
  const poles = String(data.parameters.poles ?? '1P');
  const curve = String(data.parameters.curve ?? 'B');
  const In = data.parameters.ratingCurrent ?? 16;
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 40, height: 50 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 20 }} />
      <svg width="40" height="50" viewBox="0 0 40 50" style={{ overflow: 'visible' }}>
        <text x="20" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label}</text>
        <line x1="20" y1="0" x2="20" y2="14" stroke="#222" strokeWidth="1.5" />
        <line x1="20" y1="14" x2="30" y2="30" stroke="#222" strokeWidth="2" />
        <rect x="26" y="22" width="5" height="4" fill="none" stroke="#222" strokeWidth="0.8" />
        <path d="M 16,34 A 4,4 0 0,1 24,34" fill="none" stroke="#222" strokeWidth="0.8" />
        <circle cx="20" cy="37" r="2" fill="#222" />
        <line x1="20" y1="39" x2="20" y2="50" stroke="#222" strokeWidth="1.5" />
        <text x="20" y="58" textAnchor="middle" fontSize="7" fill="#888">{curve}{In}/{poles}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 20 }} />
    </div>
  );
}
