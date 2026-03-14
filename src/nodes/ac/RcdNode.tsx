import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type RcdNodeType = Node<SchematicNodeData, 'rcd'>;

// RCD 4P: 4 krzywki (L1,L2,L3,N) + toroid roznicowy + przycisk T
export function RcdNode({ data, selected }: NodeProps<RcdNodeType>) {
  const poles = String(data.parameters.poles || '4P');
  const is4P = poles === '4P';
  const wires = is4P
    ? [{ id: 'L1', color: WIRE_COLORS.L1, offset: 10 }, { id: 'L2', color: WIRE_COLORS.L2, offset: 30 }, { id: 'L3', color: WIRE_COLORS.L3, offset: 50 }, { id: 'N', color: WIRE_COLORS.N, offset: 70 }]
    : [{ id: 'L1', color: WIRE_COLORS.L1, offset: 30 }, { id: 'N', color: WIRE_COLORS.N, offset: 50 }];

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 80 }}>
      {wires.map((w) => (
        <Handle key={`in-${w.id}`} type="source" position={Position.Top} id={`in-${w.id}`}
          className="!w-1.5 !h-1.5" style={{ backgroundColor: w.color, left: w.offset }} />
      ))}

      <svg width="80" height="75" viewBox="0 0 80 75">
        {/* Krzywka na kazdy biegun */}
        {wires.map((w) => (
          <g key={w.id}>
            <line x1={w.offset} y1="0" x2={w.offset} y2="10" stroke={w.color} strokeWidth="1.5" />
            <line x1={w.offset} y1="10" x2={w.offset + 8} y2="25" stroke="#333" strokeWidth="1.5" />
            <circle cx={w.offset} cy="28" r="1.5" fill="#333" />
            <line x1={w.offset} y1="30" x2={w.offset} y2="38" stroke={w.color} strokeWidth="1" />
          </g>
        ))}

        {/* Linia sprzegajaca krzywki */}
        {wires.length > 1 && (
          <line
            x1={wires[0].offset + 4} y1="18"
            x2={wires[wires.length - 1].offset + 4} y2="18"
            stroke="#333" strokeWidth="0.8" strokeDasharray="3,2"
          />
        )}

        {/* Toroid — kolko przez ktore przechodza wszystkie przewody */}
        <circle cx="40" cy="48" r="10" fill="none" stroke="#333" strokeWidth="1.2" />
        {/* Przewody przez toroid */}
        {wires.map((w) => (
          <line key={`t-${w.id}`} x1={w.offset} y1="38" x2={w.offset} y2="58" stroke={w.color} strokeWidth="0.8" />
        ))}

        {/* Linie wyjsciowe pod toroidem */}
        {wires.map((w) => (
          <line key={`o-${w.id}`} x1={w.offset} y1="58" x2={w.offset} y2="75" stroke={w.color} strokeWidth="1.5" />
        ))}

        {/* Przycisk T */}
        <text x="75" y="50" fontSize="7" fill="#999" fontFamily="monospace">T</text>
      </svg>

      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      {data.parameters.rcdType && (
        <div className="text-[10px] text-gray-500">
          {String(data.parameters.rcdType)} {String(data.parameters.ratingCurrent ?? '')}A {String(data.parameters.sensitivityCurrent ?? '')}mA
        </div>
      )}

      {wires.map((w) => (
        <Handle key={`out-${w.id}`} type="source" position={Position.Bottom} id={`out-${w.id}`}
          className="!w-1.5 !h-1.5" style={{ backgroundColor: w.color, left: w.offset }} />
      ))}
    </div>
  );
}
