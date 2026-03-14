import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type DcDisconnectNodeType = Node<SchematicNodeData, 'dcDisconnect'>;

// Rozlacznik DC — przelotowy DC+/DC- (wejscie gora, wyjscie dol)
export function DcDisconnectNode({ data, selected }: NodeProps<DcDisconnectNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <Handle type="target" position={Position.Top} id="in-dc-plus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.DC, left: '30%' }} />
      <Handle type="target" position={Position.Top} id="in-dc-minus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: '70%' }} />

      <svg width="50" height="55" viewBox="0 0 50 55">
        <line x1="25" y1="0" x2="25" y2="14" stroke="#333" strokeWidth="1.5" />
        <line x1="21" y1="14" x2="29" y2="14" stroke="#333" strokeWidth="1.5" />
        <line x1="25" y1="14" x2="35" y2="32" stroke="#333" strokeWidth="2" />
        <circle cx="25" cy="35" r="2" fill="#333" />
        <line x1="25" y1="37" x2="25" y2="55" stroke="#333" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      {data.parameters.ratingCurrent && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.ratingCurrent)}A</div>
      )}

      <Handle type="source" position={Position.Bottom} id="out-dc-plus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.DC, left: '30%' }} />
      <Handle type="source" position={Position.Bottom} id="out-dc-minus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: '70%' }} />
    </div>
  );
}
