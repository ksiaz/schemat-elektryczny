import { Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, type BaseHandle } from './rotate.ts';
import { SldSymbol } from './SldSymbol.tsx';
import { INK, STROKE, FINE, GLYPH } from './sldStyle.ts';

type T = Node<SchematicNodeData, 'sldRcbo'>;

const W = 60;
const H = 60;
const SHIFT = (W - 50) / 2; // 5
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 30, y: 0 },
  { id: 'out', pos: Position.Bottom, x: 30, y: H },
];

export function SldRcboNode({ data, selected }: NodeProps<T>) {
  const poles = String(data.parameters.poles ?? '1P+N');
  const curve = String(data.parameters.curve ?? 'B');
  const rcdType = String(data.parameters.rcdType ?? 'A');
  const In = data.parameters.ratingCurrent ?? 16;
  const sens = data.parameters.sensitivityCurrent ?? 30;

  const rot = normRot(data.rotation);

  return (
    <SldSymbol selected={selected} rot={rot} w={W} h={H} handles={BASE}
      label={data.label} rating={`${curve}${In} ${rcdType}/${sens}mA ${poles}`}>
      <g transform={`translate(${SHIFT} 0)`}>
        <line x1="25" y1="0" x2="25" y2="10" stroke={INK} strokeWidth={STROKE} />
        <line x1="25" y1="10" x2="35" y2="22" stroke={INK} strokeWidth={STROKE} />
        <rect x="31" y="16" width="4" height="3" fill="none" stroke={INK} strokeWidth={FINE} />
        <polygon points="17,28 33,28 25,42" fill="none" stroke={INK} strokeWidth={STROKE} />
        <text x="25" y="38" textAnchor="middle" fontSize={GLYPH.size} fontWeight="bold" fill={INK}>Δ</text>
        <line x1="25" y1="42" x2="25" y2="60" stroke={INK} strokeWidth={STROKE} />
      </g>
    </SldSymbol>
  );
}
