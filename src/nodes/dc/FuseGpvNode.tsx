import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type FuseGpvNodeType = Node<SchematicNodeData, 'fuseGpv'>;

// Bezpiecznik gPV wg IEC 60617
// Prostokat z linia wewnatrz (element topikowy)
export function FuseGpvNode({ data, selected }: NodeProps<FuseGpvNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-red-500 !w-2 !h-2" />

      <svg width="20" height="50" viewBox="0 0 20 50">
        {/* Linia wejsciowa */}
        <line x1="10" y1="0" x2="10" y2="10" stroke="white" strokeWidth="1.5" />
        {/* Prostokat bezpiecznika */}
        <rect x="3" y="10" width="14" height="30" fill="none" stroke="white" strokeWidth="1.5" />
        {/* Linia topikowa wewnatrz */}
        <line x1="10" y1="10" x2="10" y2="40" stroke="white" strokeWidth="0.8" />
        {/* Linia wyjsciowa */}
        <line x1="10" y1="40" x2="10" y2="50" stroke="white" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold mt-1 text-gray-200">{data.label}</div>
      {data.parameters.ratingCurrent && (
        <div className="text-[10px] text-gray-400">{String(data.parameters.ratingCurrent)}A</div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-red-500 !w-2 !h-2" />
    </div>
  );
}
