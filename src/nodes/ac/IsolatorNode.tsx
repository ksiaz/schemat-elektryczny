import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type IsolatorNodeType = Node<SchematicNodeData, 'isolator'>;

const POLES = [
  { id: 'L1', color: WIRE_COLORS.L1, offset: 10 },
  { id: 'L2', color: WIRE_COLORS.L2, offset: 30 },
  { id: 'L3', color: WIRE_COLORS.L3, offset: 50 },
  { id: 'N', color: WIRE_COLORS.N, offset: 70 },
];

export function IsolatorNode({ data, selected }: NodeProps<IsolatorNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 80 }}>
      {POLES.map((p) => (
        <Handle key={`in-${p.id}`} type="source" position={Position.Top} id={`in-${p.id}`}
          className="!w-1.5 !h-1.5" style={{ backgroundColor: p.color, left: p.offset }} />
      ))}

      <svg width="80" height="60" viewBox="0 0 80 60" style={{ overflow: 'visible' }}>
        <text x="40" y="-8" textAnchor="middle" fontSize="9" fill="#333" fontWeight="bold">{data.label}</text>
        <text x="40" y="0" textAnchor="middle" fontSize="7" fill="#888">
          {data.parameters.ratingCurrent ? `${String(data.parameters.ratingCurrent)}A` : ''} 3P+N
        </text>

        {/* 4 krzywki — rozlacznik (bez wyzwalaczy) */}
        {POLES.map((p) => (
          <g key={p.id}>
            <line x1={p.offset} y1="4" x2={p.offset} y2="16" stroke={p.color} strokeWidth="1.5" />
            <line x1={p.offset - 3} y1="16" x2={p.offset + 3} y2="16" stroke="#333" strokeWidth="1.5" />
            <line x1={p.offset} y1="16" x2={p.offset + 10} y2="36" stroke="#333" strokeWidth="2" />
            <circle cx={p.offset} cy="40" r="2" fill="#333" />
            <line x1={p.offset} y1="42" x2={p.offset} y2="60" stroke={p.color} strokeWidth="1.5" />
          </g>
        ))}

        {/* Linia sprzegajaca */}
        <line
          x1={POLES[0].offset + 5} y1="26"
          x2={POLES[POLES.length - 1].offset + 5} y2="26"
          stroke="#333" strokeWidth="0.8" strokeDasharray="3,2"
        />

        {/* Symbol rozlacznika — X na styku */}
        <line x1="36" y1="46" x2="44" y2="54" stroke="#333" strokeWidth="0.8" />
        <line x1="44" y1="46" x2="36" y2="54" stroke="#333" strokeWidth="0.8" />
      </svg>

      {POLES.map((p) => (
        <Handle key={`out-${p.id}`} type="source" position={Position.Bottom} id={`out-${p.id}`}
          className="!w-1.5 !h-1.5" style={{ backgroundColor: p.color, left: p.offset }} />
      ))}
    </div>
  );
}
