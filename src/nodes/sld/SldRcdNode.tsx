import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldRcd'>;

export function SldRcdNode({ data, selected }: NodeProps<T>) {
  const poles = String(data.parameters.poles ?? '2P');
  const rcdType = String(data.parameters.rcdType ?? 'A');
  const In = data.parameters.ratingCurrent ?? 25;
  const sens = data.parameters.sensitivityCurrent ?? 30;
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 40, height: 50 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 20 }} />
      <svg width="40" height="50" viewBox="0 0 40 50" style={{ overflow: 'visible' }}>
        <text x="20" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'F-RCD1'}</text>
        <line x1="20" y1="0" x2="20" y2="12" stroke="#222" strokeWidth="1.5" />
        <polygon points="12,16 28,16 20,32" fill="none" stroke="#222" strokeWidth="1.5" />
        <text x="20" y="27" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#222">Δ</text>
        <line x1="20" y1="32" x2="20" y2="50" stroke="#222" strokeWidth="1.5" />
        <text x="20" y="58" textAnchor="middle" fontSize="7" fill="#888">{rcdType} {In}A {sens}mA/{poles}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 20 }} />
    </div>
  );
}
