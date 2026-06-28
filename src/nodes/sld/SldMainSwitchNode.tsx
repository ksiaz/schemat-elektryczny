import { Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, type BaseHandle } from './rotate.ts';
import { SldSymbol } from './SldSymbol.tsx';
import { INK, STROKE, FINE } from './sldStyle.ts';

type T = Node<SchematicNodeData, 'sldMainSwitch'>;

const W = 40;
const H = 50;
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 20, y: 0 },
  { id: 'out', pos: Position.Bottom, x: 20, y: H },
];

export function SldMainSwitchNode({ data, selected }: NodeProps<T>) {
  const poles = String(data.parameters.poles ?? '3P');
  const In = data.parameters.ratingCurrent ? `${data.parameters.ratingCurrent}A` : '';

  const rot = normRot(data.rotation);

  return (
    <SldSymbol selected={selected} rot={rot} w={W} h={H} handles={BASE}
      label={data.label} rating={`${poles} ${In}`}>
      <line x1="20" y1="0" x2="20" y2="12" stroke={INK} strokeWidth={STROKE} />
      <line x1="20" y1="12" x2="30" y2="28" stroke={INK} strokeWidth={STROKE} />
      <circle cx="20" cy="12" r="1.5" fill={INK} />
      <circle cx="20" cy="28" r="1.5" fill={INK} />
      <line x1="16" y1="32" x2="24" y2="40" stroke={INK} strokeWidth={FINE} />
      <line x1="24" y1="32" x2="16" y2="40" stroke={INK} strokeWidth={FINE} />
      <line x1="20" y1="28" x2="20" y2="50" stroke={INK} strokeWidth={STROKE} />
    </SldSymbol>
  );
}
