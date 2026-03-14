import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type BatteryNodeType = Node<SchematicNodeData, 'battery'>;

export function BatteryNode({ data, selected }: NodeProps<BatteryNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 80 }}>
      <Handle type="source" position={Position.Top} id="dc-plus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.DC, left: 20 }} />
      <Handle type="source" position={Position.Top} id="dc-minus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 40 }} />
      <Handle type="source" position={Position.Top} id="com" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#999', left: 60 }} />
      <svg width="80" height="55" viewBox="0 0 80 55">
        <rect x="4" y="4" width="72" height="47" fill="none" stroke="#333" strokeWidth="1.5" rx="2" />
        <line x1="22" y1="18" x2="22" y2="34" stroke="#333" strokeWidth="3" />
        <line x1="30" y1="22" x2="30" y2="30" stroke="#333" strokeWidth="1.5" />
        <line x1="38" y1="18" x2="38" y2="34" stroke="#333" strokeWidth="3" />
        <line x1="46" y1="22" x2="46" y2="30" stroke="#333" strokeWidth="1.5" />
        <text x="20" y="14" textAnchor="middle" fontSize="7" fill="#FF0000" fontWeight="bold">+</text>
        <text x="40" y="14" textAnchor="middle" fontSize="7" fill="#0000CD" fontWeight="bold">-</text>
        <text x="60" y="14" textAnchor="middle" fontSize="6" fill="#999">COM</text>
      </svg>
      <div className="text-xs font-bold text-gray-800 mt-1">{data.label}</div>
      {data.parameters.model && <div className="text-[10px] text-gray-500">{String(data.parameters.model)}</div>}
      {data.parameters.capacity && <div className="text-[10px] text-gray-500">{String(data.parameters.capacity)} kWh</div>}
      <Handle type="source" position={Position.Bottom} id="pe-housing" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.PE, left: 40 }} />
    </div>
  );
}
