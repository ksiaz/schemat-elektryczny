import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type MeterNodeType = Node<SchematicNodeData, 'meter'>;

// Licznik OSD — prostokat z kWh, trojkaty dwukierunkowe, wejscie lewo wyjscie prawo
export function MeterNode({ data, selected }: NodeProps<MeterNodeType>) {
  const isBidirectional = data.parameters.bidirectional === 'Tak';

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 80 }}>
      {/* Wejscie z lewej */}
      <Handle type="source" position={Position.Left} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', top: 30 }} />

      <svg width="80" height="60" viewBox="0 0 80 60" style={{ overflow: 'visible' }}>
        {/* Opis nad symbolem */}
        <text x="40" y="-4" textAnchor="middle" fontSize="10" fill="#333" fontWeight="bold">{data.label}</text>

        {/* Prostokat licznika */}
        <rect x="6" y="2" width="68" height="56" fill="none" stroke="#333" strokeWidth="1.5" rx="2" />

        {/* kWh */}
        <text x="40" y="28" textAnchor="middle" fontSize="18" fill="#333" fontWeight="bold" fontFamily="monospace">kWh</text>

        {/* Trojkaty dwukierunkowe (kontury) */}
        {isBidirectional && (
          <g>
            {/* Trojkat w prawo (pobor) */}
            <polygon points="28,38 40,44 28,50" fill="none" stroke="#333" strokeWidth="1.2" />
            {/* Trojkat w lewo (oddawanie) */}
            <polygon points="52,38 40,44 52,50" fill="none" stroke="#333" strokeWidth="1.2" />
          </g>
        )}
      </svg>

      {data.parameters.meterType && (
        <div className="text-[9px] text-gray-500">{String(data.parameters.meterType)}</div>
      )}

      {/* Wyjscie z prawej */}
      <Handle type="source" position={Position.Right} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', top: 30 }} />
    </div>
  );
}
