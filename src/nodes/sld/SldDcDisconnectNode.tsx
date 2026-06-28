import { Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, type BaseHandle } from './rotate.ts';
import { SldSymbol } from './SldSymbol.tsx';
import { INK, STROKE, GLYPH } from './sldStyle.ts';

type T = Node<SchematicNodeData, 'sldDcDisconnect'>;

const W = 60;
const H = 50;
const SHIFT = 5; // (W - svgW) / 2 = (60 - 50) / 2
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 30, y: 0 },
  { id: 'out', pos: Position.Bottom, x: 30, y: H },
];

export function SldDcDisconnectNode({ data, selected }: NodeProps<T>) {
  const poles = String(data.parameters.poles ?? '2P');
  const In = data.parameters.ratingCurrent ? `${data.parameters.ratingCurrent}A` : '';
  const Un = data.parameters.ratingVoltage ? `${data.parameters.ratingVoltage}V` : '';

  const rot = normRot(data.rotation);

  return (
    <SldSymbol selected={selected} rot={rot} w={W} h={H} handles={BASE}
      label={data.label} rating={`${poles} ${In} ${Un}`}>
      <g transform={`translate(${SHIFT} 0)`}>
        <line x1="25" y1="0" x2="25" y2="12" stroke={INK} strokeWidth={STROKE} />
        <line x1="25" y1="12" x2="35" y2="28" stroke={INK} strokeWidth={STROKE} />
        <circle cx="25" cy="12" r="1.5" fill={INK} />
        <circle cx="25" cy="28" r="1.5" fill={INK} />
        <text x="42" y="22" fontSize={GLYPH.size} fontWeight="bold" fill={INK}>DC</text>
        <line x1="25" y1="28" x2="25" y2="50" stroke={INK} strokeWidth={STROKE} />
      </g>
    </SldSymbol>
  );
}
