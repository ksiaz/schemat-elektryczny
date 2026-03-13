import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type DcDisconnectNodeType = Node<SchematicNodeData, 'dcDisconnect'>;

export function DcDisconnectNode({ data, selected }: NodeProps<DcDisconnectNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-red-500 !w-2 !h-2" />

      {/* Rozlacznik DC — styk ruchomy */}
      <svg width="30" height="50" viewBox="0 0 30 50">
        <line x1="15" y1="0" x2="15" y2="15" stroke="black" strokeWidth="1.5" />
        <line x1="15" y1="15" x2="25" y2="30" stroke="black" strokeWidth="1.5" />
        <circle cx="15" cy="35" r="2" fill="black" />
        <line x1="15" y1="37" x2="15" y2="50" stroke="black" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold mt-1">{data.label}</div>
      {data.parameters.ratingCurrent && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.ratingCurrent)}A</div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-red-500 !w-2 !h-2" />
    </div>
  );
}
