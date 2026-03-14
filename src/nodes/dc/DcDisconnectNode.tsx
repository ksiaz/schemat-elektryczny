import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type DcDisconnectNodeType = Node<SchematicNodeData, 'dcDisconnect'>;

// Rozlacznik DC wg IEC 60617 — styk ruchomy (identyczny z rozlacznikiem AC)
export function DcDisconnectNode({ data, selected }: NodeProps<DcDisconnectNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-red-500 !w-2 !h-2" />

      <svg width="30" height="55" viewBox="0 0 30 55">
        <line x1="15" y1="0" x2="15" y2="14" stroke="#333" strokeWidth="1.5" />
        <line x1="11" y1="14" x2="19" y2="14" stroke="#333" strokeWidth="1.5" />
        <line x1="15" y1="14" x2="25" y2="32" stroke="#333" strokeWidth="2" />
        <circle cx="15" cy="35" r="2" fill="#333" />
        <line x1="15" y1="37" x2="15" y2="55" stroke="#333" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold mt-1 text-gray-800">{data.label}</div>
      {data.parameters.ratingCurrent && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.ratingCurrent)}A</div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-red-500 !w-2 !h-2" />
    </div>
  );
}
