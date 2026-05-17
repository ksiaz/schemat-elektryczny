import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldMainSwitch'>;

export function SldMainSwitchNode({ data, selected }: NodeProps<T>) {
  const poles = String(data.parameters.poles ?? '3P');
  const In = data.parameters.ratingCurrent ? `${data.parameters.ratingCurrent}A` : '';
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 40, height: 50 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 20 }} />
      <svg width="40" height="50" viewBox="0 0 40 50" style={{ overflow: 'visible' }}>
        <text x="20" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label}</text>
        <line x1="20" y1="0" x2="20" y2="12" stroke="#222" strokeWidth="1.5" />
        <line x1="20" y1="12" x2="30" y2="28" stroke="#222" strokeWidth="2" />
        <circle cx="20" cy="12" r="1.5" fill="#222" />
        <circle cx="20" cy="28" r="1.5" fill="#222" />
        <line x1="16" y1="32" x2="24" y2="40" stroke="#222" strokeWidth="0.9" />
        <line x1="24" y1="32" x2="16" y2="40" stroke="#222" strokeWidth="0.9" />
        <line x1="20" y1="28" x2="20" y2="50" stroke="#222" strokeWidth="1.5" />
        <text x="20" y="58" textAnchor="middle" fontSize="7" fill="#888">{poles} {In}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 20 }} />
    </div>
  );
}
