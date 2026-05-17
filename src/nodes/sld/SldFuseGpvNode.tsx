import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldFuseGpv'>;

export function SldFuseGpvNode({ data, selected }: NodeProps<T>) {
  const In = data.parameters.ratingCurrent ? `${data.parameters.ratingCurrent}A` : '';
  const Un = data.parameters.ratingVoltage ? `${data.parameters.ratingVoltage}V` : '';
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 40, height: 50 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333' }} />
      <svg width="30" height="50" viewBox="0 0 30 50" style={{ overflow: 'visible' }}>
        <text x="15" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label}</text>
        <line x1="15" y1="0" x2="15" y2="14" stroke="#222" strokeWidth="1.5" />
        <rect x="9" y="14" width="12" height="22" fill="white" stroke="#222" strokeWidth="1.5" />
        <line x1="15" y1="14" x2="15" y2="36" stroke="#222" strokeWidth="1.2" />
        <text x="15" y="29" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#222">gPV</text>
        <line x1="15" y1="36" x2="15" y2="50" stroke="#222" strokeWidth="1.5" />
        <text x="15" y="58" textAnchor="middle" fontSize="7" fill="#888">{In} {Un}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333' }} />
    </div>
  );
}
