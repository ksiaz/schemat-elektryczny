import { Handle, Position } from '@xyflow/react';
import { WIRE_COLORS } from '../../constants/index.ts';

// 5 handle'i AC — stale pozycje px co 20px, wyrownane do siatki 10px
const WIRES = [
  { id: 'L1', color: WIRE_COLORS.L1, offset: 30 },
  { id: 'L2', color: WIRE_COLORS.L2, offset: 50 },
  { id: 'L3', color: WIRE_COLORS.L3, offset: 70 },
  { id: 'N', color: WIRE_COLORS.N, offset: 90 },
  { id: 'PE', color: WIRE_COLORS.PE, offset: 110 },
];

interface AcHandlesProps {
  type: 'target' | 'source';
  position: Position;
  prefix: string;
}

export function AcHandles({ type, position, prefix }: AcHandlesProps) {
  return (
    <>
      {WIRES.map((wire) => (
        <Handle
          key={`${prefix}-${wire.id}`}
          type={type}
          position={position}
          id={`${prefix}-${wire.id}`}
          className="!w-1.5 !h-1.5"
          style={{
            backgroundColor: wire.color,
            left: wire.offset,
          }}
        />
      ))}
    </>
  );
}
