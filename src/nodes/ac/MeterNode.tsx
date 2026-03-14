import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type MeterNodeType = Node<SchematicNodeData, 'meter'>;

// Licznik kWh — 1 zacisk gora, 1 dol (jednokreskowy)
export function MeterNode({ data, selected }: NodeProps<MeterNodeType>) {
  const isBidirectional = data.parameters.bidirectional === 'Tak';

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 80 }}>
      <Handle type="target" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 40 }} />

      <svg width="80" height="55" viewBox="0 0 80 55">
        <line x1="40" y1="0" x2="40" y2="4" stroke="#333" strokeWidth="1.5" />
        <rect x="4" y="4" width="72" height="47" fill="none" stroke="#333" strokeWidth="1.5" rx="2" />
        <text x="40" y="25" textAnchor="middle" fontSize="14" fill="#333" fontWeight="bold" fontFamily="monospace">kWh</text>
        {isBidirectional && (
          <g>
            <line x1="18" y1="38" x2="62" y2="38" stroke="#333" strokeWidth="0.8" />
            <polygon points="18,38 22,36 22,40" fill="#333" />
            <polygon points="62,38 58,36 58,40" fill="#333" />
          </g>
        )}
      </svg>

      <div className="text-xs font-bold mt-1 text-gray-800">{data.label}</div>
      {data.parameters.meterType && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.meterType)}</div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 40 }} />
    </div>
  );
}
