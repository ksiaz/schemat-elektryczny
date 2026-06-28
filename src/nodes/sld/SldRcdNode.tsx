import { Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, type BaseHandle } from './rotate.ts';
import { SldSymbol } from './SldSymbol.tsx';
import { INK, STROKE, GLYPH } from './sldStyle.ts';

type T = Node<SchematicNodeData, 'sldRcd'>;

const W = 40;
const H = 50;
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 20, y: 0 },
  { id: 'out', pos: Position.Bottom, x: 20, y: H },
];

export function SldRcdNode({ data, selected }: NodeProps<T>) {
  const poles = String(data.parameters.poles ?? '2P');
  const rcdType = String(data.parameters.rcdType ?? 'A');
  const In = data.parameters.ratingCurrent ?? 25;
  const sens = data.parameters.sensitivityCurrent ?? 30;

  const rot = normRot(data.rotation);

  return (
    <SldSymbol selected={selected} rot={rot} w={W} h={H} handles={BASE}
      label={data.label} rating={`${rcdType} ${In}A ${sens}mA/${poles}`}>
      <line x1="20" y1="0" x2="20" y2="12" stroke={INK} strokeWidth={STROKE} />
      <polygon points="12,16 28,16 20,32" fill="none" stroke={INK} strokeWidth={STROKE} />
      <text x="20" y="27" textAnchor="middle" fontSize={GLYPH.size} fontWeight="bold" fill={INK}>Δ</text>
      <line x1="20" y1="32" x2="20" y2="50" stroke={INK} strokeWidth={STROKE} />
    </SldSymbol>
  );
}
