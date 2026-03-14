import { Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { AcHandles } from './AcHandles.tsx';

type SpdAcNodeType = Node<SchematicNodeData, 'spdAc'>;

export function SpdAcNode({ data, selected }: NodeProps<SpdAcNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <AcHandles type="target" position={Position.Top} prefix="in" />
      <svg width="70" height="55" viewBox="0 0 70 55">
        <line x1="35" y1="0" x2="35" y2="6" stroke="#333" strokeWidth="1.5" />
        <rect x="15" y="6" width="40" height="34" fill="none" stroke="#333" strokeWidth="1.5" rx="1" />
        <polyline points="38,12 32,22 38,22 30,34" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="30,34 33,30 32,33" fill="#333" />
        <line x1="35" y1="40" x2="35" y2="55" stroke="#333" strokeWidth="1.5" />
      </svg>
      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      {data.parameters.spdType && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.spdType)}</div>
      )}
      <AcHandles type="source" position={Position.Bottom} prefix="out" />
    </div>
  );
}
