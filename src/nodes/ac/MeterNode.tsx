import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type MeterNodeType = Node<SchematicNodeData, 'meter'>;

// Licznik energii kWh — 3-fazowy: L1, L2, L3, N (wejscie i wyjscie)
export function MeterNode({ data, selected }: NodeProps<MeterNodeType>) {
  const isBidirectional = data.parameters.bidirectional === 'Tak';
  const is3Phase = data.parameters.meterType !== '1-fazowy';

  const wires = is3Phase
    ? [{ id: 'L1', color: WIRE_COLORS.L1, offset: 10 }, { id: 'L2', color: WIRE_COLORS.L2, offset: 30 }, { id: 'L3', color: WIRE_COLORS.L3, offset: 50 }, { id: 'N', color: WIRE_COLORS.N, offset: 70 }]
    : [{ id: 'L1', color: WIRE_COLORS.L1, offset: 30 }, { id: 'N', color: WIRE_COLORS.N, offset: 50 }];

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 80 }}>
      {wires.map((w) => (
        <Handle key={`in-${w.id}`} type="target" position={Position.Top} id={`in-${w.id}`}
          className="!w-1.5 !h-1.5" style={{ backgroundColor: w.color, left: w.offset }} />
      ))}

      <svg width="80" height="55" viewBox="0 0 80 55">
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

      {wires.map((w) => (
        <Handle key={`out-${w.id}`} type="source" position={Position.Bottom} id={`out-${w.id}`}
          className="!w-1.5 !h-1.5" style={{ backgroundColor: w.color, left: w.offset }} />
      ))}
    </div>
  );
}
