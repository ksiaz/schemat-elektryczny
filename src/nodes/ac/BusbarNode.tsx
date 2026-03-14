import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type BusbarNodeType = Node<SchematicNodeData, 'busbar'>;

const BUSBAR_COLORS: Record<string, string> = {
  PE: WIRE_COLORS.PE,
  PEN: '#228B22',
  N: WIRE_COLORS.N,
};

// Szyna PE/PEN/N — 8 zaciskow u gory co 20px, 1 na dole (do uziemienia)
export function BusbarNode({ data, selected }: NodeProps<BusbarNodeType>) {
  const busbarType = String(data.parameters.busbarType || 'PE');
  const color = BUSBAR_COLORS[busbarType] || '#333';

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 180 }}>
      {/* 8 zaciskow u gory co 20px */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Handle key={`in-${i}`} type="target" position={Position.Top} id={`in-${i + 1}`}
          className="!w-1.5 !h-1.5" style={{ backgroundColor: color, left: 10 + i * 20 }} />
      ))}

      <svg width="180" height="16" viewBox="0 0 180 16">
        <rect x="0" y="5" width="180" height="6" fill={color} rx="1" />
      </svg>

      <div className="text-xs font-bold mt-1" style={{ color }}>{data.label}</div>

      {/* 1 zacisk na dole */}
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: color, left: 90 }} />
    </div>
  );
}
