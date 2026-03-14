import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type MeterNodeType = Node<SchematicNodeData, 'meter'>;

export function MeterNode({ data, selected }: NodeProps<MeterNodeType>) {
  const isBidirectional = data.parameters.bidirectional === 'Tak';

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 80 }}>
      <Handle type="source" position={Position.Left} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', top: 30 }} />

      <svg width="80" height="60" viewBox="0 0 80 60" style={{ overflow: 'visible' }}>
        <text x="40" y="-4" textAnchor="middle" fontSize="10" fill="#333" fontWeight="bold">{data.label}</text>

        {/* Prostokat */}
        <rect x="6" y="2" width="68" height="56" fill="none" stroke="#333" strokeWidth="1.5" />

        {/* kWh */}
        <text x="40" y="30" textAnchor="middle" fontSize="18" fill="#333" fontWeight="bold" fontFamily="sans-serif">kWh</text>

        {/* Trojkaty — od siebie: → ← */}
        {isBidirectional && (
          <g>
            {/* → w prawo */}
            <polygon points="22,40 34,46 22,52" fill="none" stroke="#333" strokeWidth="1.2" />
            {/* ← w lewo */}
            <polygon points="58,40 46,46 58,52" fill="none" stroke="#333" strokeWidth="1.2" />
          </g>
        )}
      </svg>

      {data.parameters.meterType && (
        <div className="text-[9px] text-gray-500">{String(data.parameters.meterType)}</div>
      )}

      <Handle type="source" position={Position.Right} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', top: 30 }} />
    </div>
  );
}
