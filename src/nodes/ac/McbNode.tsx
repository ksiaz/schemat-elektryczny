import { Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { AcHandles } from './AcHandles.tsx';

type McbNodeType = Node<SchematicNodeData, 'mcb'>;

// Wylacznik nadpradowy MCB — styk ruchomy, 5 handli AC (L1/L2/L3/N/PE)
export function McbNode({ data, selected }: NodeProps<McbNodeType>) {
  const label = data.parameters.curve
    ? `${String(data.parameters.curve)}${String(data.parameters.ratingCurrent ?? '')}A`
    : `${String(data.parameters.ratingCurrent ?? '')}A`;

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <AcHandles type="target" position={Position.Top} prefix="in" />

      <svg width="70" height="50" viewBox="0 0 70 50">
        <line x1="35" y1="0" x2="35" y2="14" stroke="#333" strokeWidth="1.5" />
        <line x1="35" y1="14" x2="45" y2="32" stroke="#333" strokeWidth="2" />
        <circle cx="35" cy="36" r="2" fill="#333" />
        <line x1="35" y1="38" x2="35" y2="50" stroke="#333" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      <div className="text-[10px] text-gray-500">{label}</div>

      <AcHandles type="source" position={Position.Bottom} prefix="out" />
    </div>
  );
}
