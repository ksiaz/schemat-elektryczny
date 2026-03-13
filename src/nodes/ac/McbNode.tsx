import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type McbNodeType = Node<SchematicNodeData, 'mcb'>;

export function McbNode({ data, selected }: NodeProps<McbNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-gray-700 !w-2 !h-2" />

      {/* Symbol MCB PN-EN 60617 */}
      <svg width="30" height="55" viewBox="0 0 30 55">
        <line x1="15" y1="0" x2="15" y2="10" stroke="black" strokeWidth="1.5" />
        <line x1="15" y1="10" x2="22" y2="25" stroke="black" strokeWidth="1.5" />
        <line x1="10" y1="20" x2="18" y2="20" stroke="black" strokeWidth="1" />
        <line x1="14" y1="16" x2="14" y2="24" stroke="black" strokeWidth="1" />
        <circle cx="15" cy="30" r="2" fill="black" />
        <line x1="15" y1="32" x2="15" y2="55" stroke="black" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold mt-1">{data.label}</div>
      {data.parameters.curve && (
        <div className="text-[10px] text-gray-500">
          {String(data.parameters.curve)}{String(data.parameters.ratingCurrent ?? '')}A
        </div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-gray-700 !w-2 !h-2" />
    </div>
  );
}
