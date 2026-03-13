import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type GroundNodeType = Node<SchematicNodeData, 'ground'>;

export function GroundNode({ data, selected }: NodeProps<GroundNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-green-600 !w-2 !h-2" />

      {/* Symbol uziomu PN-EN 60617: 3 poziome linie malejace */}
      <svg width="40" height="40" viewBox="0 0 40 40">
        <line x1="20" y1="0" x2="20" y2="15" stroke="black" strokeWidth="1.5" />
        <line x1="6" y1="15" x2="34" y2="15" stroke="black" strokeWidth="1.5" />
        <line x1="10" y1="22" x2="30" y2="22" stroke="black" strokeWidth="1.5" />
        <line x1="14" y1="29" x2="26" y2="29" stroke="black" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold mt-1">{data.label}</div>
      {data.parameters.resistance && (
        <div className="text-[10px] text-gray-500">RE={String(data.parameters.resistance)}Ω</div>
      )}
    </div>
  );
}
