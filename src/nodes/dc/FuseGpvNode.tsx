import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type FuseGpvNodeType = Node<SchematicNodeData, 'fuseGpv'>;

// Bezpiecznik gPV — przelotowy (1 wejscie DC, 1 wyjscie DC)
export function FuseGpvNode({ data, selected }: NodeProps<FuseGpvNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!w-3 !h-3" style={{ backgroundColor: WIRE_COLORS.DC }} />

      <svg width="20" height="50" viewBox="0 0 20 50">
        <line x1="10" y1="0" x2="10" y2="10" stroke="#333" strokeWidth="1.5" />
        <rect x="3" y="10" width="14" height="30" fill="none" stroke="#333" strokeWidth="1.5" />
        <line x1="10" y1="10" x2="10" y2="40" stroke="#333" strokeWidth="0.8" />
        <line x1="10" y1="40" x2="10" y2="50" stroke="#333" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      {data.parameters.ratingCurrent && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.ratingCurrent)}A</div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!w-3 !h-3" style={{ backgroundColor: WIRE_COLORS.DC }} />
    </div>
  );
}
