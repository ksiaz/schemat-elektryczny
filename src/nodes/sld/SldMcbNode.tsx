import { Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, type BaseHandle } from './rotate.ts';
import { SldSymbol } from './SldSymbol.tsx';
import { INK, STROKE, FINE } from './sldStyle.ts';

type T = Node<SchematicNodeData, 'sldMcb'>;

const W = 40;
const H = 50;
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 20, y: 0 },
  { id: 'out', pos: Position.Bottom, x: 20, y: H },
];

export function SldMcbNode({ data, selected }: NodeProps<T>) {
  const poles = String(data.parameters.poles ?? '1P');
  const curve = String(data.parameters.curve ?? 'B');
  const In = data.parameters.ratingCurrent ?? 16;

  const rot = normRot(data.rotation);

  return (
    <SldSymbol selected={selected} rot={rot} w={W} h={H} handles={BASE}
      label={data.label} rating={`${curve}${In}/${poles}`}>
      <line x1="20" y1="0" x2="20" y2="14" stroke={INK} strokeWidth={STROKE} />
      <line x1="20" y1="14" x2="30" y2="30" stroke={INK} strokeWidth={STROKE} />
      <rect x="26" y="22" width="5" height="4" fill="none" stroke={INK} strokeWidth={FINE} />
      <path d="M 16,34 A 4,4 0 0,1 24,34" fill="none" stroke={INK} strokeWidth={FINE} />
      <circle cx="20" cy="37" r="2" fill={INK} />
      <line x1="20" y1="39" x2="20" y2="50" stroke={INK} strokeWidth={STROKE} />
    </SldSymbol>
  );
}
