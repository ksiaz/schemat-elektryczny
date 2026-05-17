import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldSpdDc'>;

export function SldSpdDcNode({ data, selected }: NodeProps<T>) {
  const klasa = String(data.parameters.spdClass ?? 'T1+2');
  const uc = data.parameters.uc ? `UC=${data.parameters.uc}V` : '';
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 40, height: 50 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 20 }} />
      <svg width="40" height="50" viewBox="0 0 40 50" style={{ overflow: 'visible' }}>
        <text x="20" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label}</text>
        <line x1="20" y1="0" x2="20" y2="14" stroke="#222" strokeWidth="1.5" />
        <rect x="12" y="14" width="16" height="20" fill="white" stroke="#222" strokeWidth="1.5" />
        <text x="20" y="28" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#222">{klasa}</text>
        <line x1="20" y1="34" x2="20" y2="50" stroke="#222" strokeWidth="0.6" strokeDasharray="2,1" />
        <text x="20" y="58" textAnchor="middle" fontSize="7" fill="#888">DC {uc}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 20 }} />
    </div>
  );
}
