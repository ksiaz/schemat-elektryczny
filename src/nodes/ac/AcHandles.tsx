import { Handle, Position } from '@xyflow/react';
import { WIRE_COLORS } from '../../constants/index.ts';

// 5 handle'i AC w kolorach zyl — wielokrotnie uzywany w wezlach AC
// Rozmieszczenie: rownomiernie w rzedzie, kazdy w kolorze zyly

const WIRES = [
  { id: 'L1', color: WIRE_COLORS.L1 },
  { id: 'L2', color: WIRE_COLORS.L2 },
  { id: 'L3', color: WIRE_COLORS.L3 },
  { id: 'N', color: WIRE_COLORS.N },
  { id: 'PE', color: WIRE_COLORS.PE },
];

interface AcHandlesProps {
  type: 'target' | 'source';
  position: Position;
  prefix: string; // np. "in" lub "out"
}

export function AcHandles({ type, position, prefix }: AcHandlesProps) {
  return (
    <>
      {WIRES.map((wire, i) => (
        <Handle
          key={`${prefix}-${wire.id}`}
          type={type}
          position={position}
          id={`${prefix}-${wire.id}`}
          className="!w-3 !h-3"
          style={{
            backgroundColor: wire.color,
            left: `${15 + i * 17.5}%`,
          }}
        />
      ))}
    </>
  );
}

// Etykiety zyl — rysowane pod/nad handlemi
export function AcWireLabels({ y, fontSize = 6 }: { y: number; fontSize?: number }) {
  return (
    <>
      {WIRES.map((wire, i) => (
        <text
          key={wire.id}
          x={8 + i * 14}
          y={y}
          textAnchor="middle"
          fontSize={fontSize}
          fill={wire.color}
          fontWeight="bold"
          fontFamily="monospace"
        >
          {wire.id}
        </text>
      ))}
    </>
  );
}
