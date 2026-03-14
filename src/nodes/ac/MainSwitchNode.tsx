import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type MainSwitchNodeType = Node<SchematicNodeData, 'mainSwitch'>;

const POLES_MAP: Record<string, { id: string; color: string; offset: number }[]> = {
  '1P': [{ id: 'L1', color: WIRE_COLORS.L1, offset: 40 }],
  '2P': [{ id: 'L1', color: WIRE_COLORS.L1, offset: 30 }, { id: 'N', color: WIRE_COLORS.N, offset: 50 }],
  '3P': [{ id: 'L1', color: WIRE_COLORS.L1, offset: 20 }, { id: 'L2', color: WIRE_COLORS.L2, offset: 40 }, { id: 'L3', color: WIRE_COLORS.L3, offset: 60 }],
  '4P': [{ id: 'L1', color: WIRE_COLORS.L1, offset: 10 }, { id: 'L2', color: WIRE_COLORS.L2, offset: 30 }, { id: 'L3', color: WIRE_COLORS.L3, offset: 50 }, { id: 'N', color: WIRE_COLORS.N, offset: 70 }],
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
        {/* Styk ruchomy */}
        <line x1="40" y1="0" x2="40" y2="14" stroke="#333" strokeWidth="1.5" />
        <line x1="36" y1="14" x2="44" y2="14" stroke="#333" strokeWidth="1.5" />
        <line x1="40" y1="14" x2="52" y2="32" stroke="#333" strokeWidth="2" />
        <circle cx="40" cy="35" r="2" fill="#333" />
        <line x1="40" y1="37" x2="40" y2="60" stroke="#333" strokeWidth="1.5" />

        {/* Cewka wybijakowa — prostokat z zygzakiem po prawej */}
        <rect x="70" y="12" width="24" height="32" fill="none" stroke="#333" strokeWidth="1" rx="1" />
        <polyline points="78,18 82,22 78,26 82,30 78,34 82,38" fill="none" stroke="#333" strokeWidth="0.8" />
        {/* Etykiety cewki */}
        <text x="96" y="22" fontSize="6" fill="#FF0000" fontWeight="bold">L</text>
        <text x="96" y="42" fontSize="6" fill="#0000CD" fontWeight="bold">N</text>
        {/* Linia od cewki do styku */}
        <line x1="70" y1="28" x2="52" y2="28" stroke="#333" strokeWidth="0.5" strokeDasharray="2,2" />
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
