import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type SpdDcNodeType = Node<SchematicNodeData, 'spdDc'>;

// SPD DC wg IEC 60617 — identyczny symbol jak SPD AC ale handle DC czerwone
export function SpdDcNode({ data, selected }: NodeProps<SpdDcNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-red-500 !w-2 !h-2" />

      <svg width="36" height="60" viewBox="0 0 36 60">
        <line x1="18" y1="0" x2="18" y2="8" stroke="white" strokeWidth="1.5" />
        <rect x="4" y="8" width="28" height="34" fill="none" stroke="white" strokeWidth="1.5" rx="1" />
        <polyline points="21,14 15,22 21,22 13,34" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <polygon points="13,34 16,30 15,33" fill="white" />
        <line x1="18" y1="42" x2="18" y2="60" stroke="white" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold mt-1 text-gray-200">{data.label}</div>
      {data.parameters.spdType && (
        <div className="text-[10px] text-gray-400">
          {String(data.parameters.spdType)} {data.parameters.uc ? `${String(data.parameters.uc)}V` : ''}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-red-500 !w-2 !h-2" />
    </div>
  );
}
