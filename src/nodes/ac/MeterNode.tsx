import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type MeterNodeType = Node<SchematicNodeData, 'meter'>;

// Licznik OSD — prostokat z kWh, strzalki dwukierunkowe, symbol 3-faz
export function MeterNode({ data, selected }: NodeProps<MeterNodeType>) {
  const isBidirectional = data.parameters.bidirectional === 'Tak';
  const is3Phase = data.parameters.meterType !== '1-fazowy';

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 80 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 40 }} />

      <svg width="80" height="60" viewBox="0 0 80 60" style={{ overflow: 'visible' }}>
        {/* Opis nad symbolem */}
        <text x="40" y="-4" textAnchor="middle" fontSize="10" fill="#333" fontWeight="bold">{data.label}</text>

        {/* Linia wejsciowa */}
        <line x1="40" y1="0" x2="40" y2="5" stroke="#333" strokeWidth="1.5" />

        {/* Prostokat licznika */}
        <rect x="6" y="5" width="68" height="45" fill="none" stroke="#333" strokeWidth="1.5" rx="2" />

        {/* 3-faz kreska (3 ukosne kreski na przewodzie wejsciowym) */}
        {is3Phase && (
          <g>
            <line x1="44" y1="8" x2="48" y2="14" stroke="#333" strokeWidth="1" />
            <line x1="47" y1="8" x2="51" y2="14" stroke="#333" strokeWidth="1" />
            <line x1="50" y1="8" x2="54" y2="14" stroke="#333" strokeWidth="1" />
          </g>
        )}

        {/* kWh duzy napis */}
        <text x="40" y="32" textAnchor="middle" fontSize="16" fill="#333" fontWeight="bold" fontFamily="monospace">kWh</text>

        {/* Strzalki dwukierunkowe */}
        {isBidirectional && (
          <g>
            <line x1="16" y1="42" x2="64" y2="42" stroke="#333" strokeWidth="1" />
            <polygon points="16,42 21,40 21,44" fill="#333" />
            <polygon points="64,42 59,40 59,44" fill="#333" />
          </g>
        )}

        {/* Linia wyjsciowa */}
        <line x1="40" y1="50" x2="40" y2="60" stroke="#333" strokeWidth="1.5" />
      </svg>

      {data.parameters.meterType && (
        <div className="text-[9px] text-gray-500">{String(data.parameters.meterType)}</div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 40 }} />
    </div>
  );
}
