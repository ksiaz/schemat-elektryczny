import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type McbNodeType = Node<SchematicNodeData, 'mcb'>;

// Wylacznik nadpradowy MCB — styk ruchomy z oznaczeniem (styl pogladowy)
export function McbNode({ data, selected }: NodeProps<McbNodeType>) {
  const label = data.parameters.curve
    ? `${String(data.parameters.curve)}${String(data.parameters.ratingCurrent ?? '')}A`
    : `${String(data.parameters.ratingCurrent ?? '')}A`;

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-gray-700 !w-2 !h-2" />

      {/* Styk ruchomy — symbol wylacznika */}
      <svg width="24" height="50" viewBox="0 0 24 50">
        <line x1="12" y1="0" x2="12" y2="14" stroke="white" strokeWidth="1.5" />
        <line x1="12" y1="14" x2="20" y2="32" stroke="white" strokeWidth="2" />
        <circle cx="12" cy="36" r="2" fill="white" />
        <line x1="12" y1="38" x2="12" y2="50" stroke="white" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold text-gray-200">{data.label}</div>
      <div className="text-[10px] text-gray-400">{label}</div>

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-gray-700 !w-2 !h-2" />
    </div>
  );
}
