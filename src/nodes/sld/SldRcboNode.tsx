import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldRcbo'>;

export function SldRcboNode({ data, selected }: NodeProps<T>) {
  const poles = String(data.parameters.poles ?? '1P+N');
  const curve = String(data.parameters.curve ?? 'B');
  const rcdType = String(data.parameters.rcdType ?? 'A');
  const In = data.parameters.ratingCurrent ?? 16;
  const sens = data.parameters.sensitivityCurrent ?? 30;
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 60, height: 60 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 30 }} />
      <svg width="50" height="60" viewBox="0 0 50 60" style={{ overflow: 'visible' }}>
        <text x="25" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'F1'}</text>
        <line x1="25" y1="0" x2="25" y2="10" stroke="#222" strokeWidth="1.5" />
        <line x1="25" y1="10" x2="35" y2="22" stroke="#222" strokeWidth="2" />
        <rect x="31" y="16" width="4" height="3" fill="none" stroke="#222" strokeWidth="0.8" />
        <polygon points="17,28 33,28 25,42" fill="none" stroke="#222" strokeWidth="1.5" />
        <text x="25" y="38" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#222">Δ</text>
        <line x1="25" y1="42" x2="25" y2="60" stroke="#222" strokeWidth="1.5" />
        <text x="25" y="68" textAnchor="middle" fontSize="7" fill="#888">{curve}{In} {rcdType}/{sens}mA {poles}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 30 }} />
    </div>
  );
}
