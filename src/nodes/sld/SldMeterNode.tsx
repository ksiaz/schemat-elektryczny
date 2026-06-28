import { Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, type BaseHandle } from './rotate.ts';
import { SldSymbol } from './SldSymbol.tsx';
import { INK, STROKE, FINE, GLYPH } from './sldStyle.ts';

type T = Node<SchematicNodeData, 'sldMeter'>;

const W = 60;
const H = 50;
const SHIFT = (W - 50) / 2; // 5
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 30, y: 0 },
  { id: 'out', pos: Position.Bottom, x: 30, y: H },
];

export function SldMeterNode({ data, selected }: NodeProps<T>) {
  const bidir = String(data.parameters.direction ?? '1-kier') === '2-kier';

  const rot = normRot(data.rotation);

  return (
    <SldSymbol selected={selected} rot={rot} w={W} h={H} handles={BASE} label={data.label}>
      <g transform={`translate(${SHIFT} 0)`}>
        <line x1="25" y1="0" x2="25" y2="7" stroke={INK} strokeWidth={STROKE} />
        <line x1="25" y1="43" x2="25" y2="50" stroke={INK} strokeWidth={STROKE} />
        <circle cx="25" cy="25" r="18" fill="white" stroke={INK} strokeWidth={STROKE} />
        <text x="25" y="29" textAnchor="middle" fontSize={GLYPH.size} fill={INK}>{bidir ? 'kWh' : 'Wh'}</text>
        {bidir && (
          <>
            <path d="M 8,20 L 4,24 L 8,28" fill="none" stroke={INK} strokeWidth={FINE} />
            <path d="M 42,20 L 46,24 L 42,28" fill="none" stroke={INK} strokeWidth={FINE} />
          </>
        )}
      </g>
    </SldSymbol>
  );
}
