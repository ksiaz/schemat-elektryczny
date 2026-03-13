import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type FuseGpvNodeType = Node<SchematicNodeData, 'fuseGpv'>;

export function FuseGpvNode({ data, selected }: NodeProps<FuseGpvNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-red-500 !w-2 !h-2" />

      {/* Bezpiecznik gPV — prostokat waski */}
      <svg width="20" height="45" viewBox="0 0 20 45">
        <line x1="10" y1="0" x2="10" y2="10" stroke="black" strokeWidth="1.5" />
        <rect x="3" y="10" width="14" height="25" fill="white" stroke="black" strokeWidth="1.5" />
        <line x1="10" y1="35" x2="10" y2="45" stroke="black" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold mt-1">{data.label}</div>
      {data.parameters.ratingCurrent && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.ratingCurrent)}A</div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-red-500 !w-2 !h-2" />
    </div>
  );
}
