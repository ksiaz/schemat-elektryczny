import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type MainSwitchNodeType = Node<SchematicNodeData, 'mainSwitch'>;

const POLES_MAP: Record<string, { id: string; color: string; offset: number }[]> = {
  '1P': [{ id: 'L1', color: WIRE_COLORS.L1, offset: 50 }],
  '2P': [{ id: 'L1', color: WIRE_COLORS.L1, offset: 30 }, { id: 'N', color: WIRE_COLORS.N, offset: 70 }],
  '3P': [{ id: 'L1', color: WIRE_COLORS.L1, offset: 20 }, { id: 'L2', color: WIRE_COLORS.L2, offset: 50 }, { id: 'L3', color: WIRE_COLORS.L3, offset: 80 }],
  '4P': [{ id: 'L1', color: WIRE_COLORS.L1, offset: 10 }, { id: 'L2', color: WIRE_COLORS.L2, offset: 30 }, { id: 'L3', color: WIRE_COLORS.L3, offset: 60 }, { id: 'N', color: WIRE_COLORS.N, offset: 80 }],
};

export function MainSwitchNode({ data, selected }: NodeProps<MainSwitchNodeType>) {
  const poles = String(data.parameters.poles || '3P');
  const wires = POLES_MAP[poles] ?? POLES_MAP['3P'];

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 100 }}>
      {/* Zaciski glowne — gora */}
      {wires.map((w) => (
        <Handle key={`in-${w.id}`} type="target" position={Position.Top} id={`in-${w.id}`}
          className="!w-1.5 !h-1.5" style={{ backgroundColor: w.color, left: w.offset }} />
      ))}

      {/* Zaciski cewki wybijakowej — prawy bok */}
      <Handle type="target" position={Position.Right} id="coil-L" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#FF0000', top: 20 }} />
      <Handle type="target" position={Position.Right} id="coil-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#0000CD', top: 40 }} />

      <svg width="100" height="60" viewBox="0 0 100 60">
        {/* Krzywki — po jednej na kazdy biegun */}
        {wires.map((w) => (
          <g key={w.id}>
            <line x1={w.offset} y1="0" x2={w.offset} y2="14" stroke={w.color} strokeWidth="1.5" />
            <line x1={w.offset - 4} y1="14" x2={w.offset + 4} y2="14" stroke="#333" strokeWidth="1.5" />
            <line x1={w.offset} y1="14" x2={w.offset + 10} y2="35" stroke="#333" strokeWidth="2" />
            <circle cx={w.offset} cy="38" r="2" fill="#333" />
            <line x1={w.offset} y1="40" x2={w.offset} y2="60" stroke={w.color} strokeWidth="1.5" />
          </g>
        ))}

        {/* Linia sprzegajaca krzywki (mechaniczne polaczenie) */}
        {wires.length > 1 && (
          <line
            x1={wires[0].offset + 5} y1="25"
            x2={wires[wires.length - 1].offset + 5} y2="25"
            stroke="#333" strokeWidth="0.8" strokeDasharray="3,2"
          />
        )}

        {/* Cewka wybijakowa — po prawej */}
        <rect x="70" y="12" width="24" height="32" fill="none" stroke="#333" strokeWidth="1" rx="1" />
        <polyline points="78,18 82,22 78,26 82,30 78,34 82,38" fill="none" stroke="#333" strokeWidth="0.8" />
        <text x="96" y="22" fontSize="6" fill="#FF0000" fontWeight="bold">L</text>
        <text x="96" y="42" fontSize="6" fill="#0000CD" fontWeight="bold">N</text>
      </svg>

      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      {data.parameters.ratingCurrent && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.ratingCurrent)}A {poles}</div>
      )}

      {/* Zaciski glowne — dol */}
      {wires.map((w) => (
        <Handle key={`out-${w.id}`} type="source" position={Position.Bottom} id={`out-${w.id}`}
          className="!w-1.5 !h-1.5" style={{ backgroundColor: w.color, left: w.offset }} />
      ))}
    </div>
  );
}
