import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type MeterOsdNodeType = Node<SchematicNodeData, 'meterOsd'>;

export function MeterOsdNode({ data, selected }: NodeProps<MeterOsdNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 80 }}>
      <Handle type="source" position={Position.Left} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', top: 30 }} />
      <Handle type="source" position={Position.Top} id="in-top" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 40 }} />

      <svg width="80" height="60" viewBox="0 0 80 60" style={{ overflow: 'visible' }}>
        <text x="40" y="-4" textAnchor="middle" fontSize="10" fill="#333" fontWeight="bold">{data.label}</text>

        <rect x="6" y="2" width="68" height="56" fill="none" stroke="#333" strokeWidth="1.5" />

        {/* kWh */}
        <text x="40" y="26" textAnchor="middle" fontSize="18" fill="#333" fontWeight="bold" fontFamily="sans-serif">kWh</text>

        {/* Trojkat w prawo ▷ (pobor) */}
        <polygon points="26,34 38,38 26,42" fill="none" stroke="#333" strokeWidth="1.2" />

        {/* Trojkat w lewo ◁ (oddawanie) — pod gornym */}
        <polygon points="54,44 42,48 54,52" fill="none" stroke="#333" strokeWidth="1.2" />
      </svg>

      <Handle type="source" position={Position.Right} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', top: 30 }} />
      <Handle type="source" position={Position.Bottom} id="out-bot" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 40 }} />
    </div>
  );
}
