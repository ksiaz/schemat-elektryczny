import { Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, type BaseHandle } from './rotate.ts';
import { SldSymbol } from './SldSymbol.tsx';
import { INK, STROKE, RATING } from './sldStyle.ts';

type T = Node<SchematicNodeData, 'sldGridSource'>;

const W = 80;
const H = 40;
const BASE: BaseHandle[] = [
  { id: 'out', pos: Position.Bottom, x: 40, y: H },
];

export function SldGridSourceNode({ data, selected }: NodeProps<T>) {
  const network = String(data.parameters.network ?? '~3/N/PE 400/230 V 50 Hz');
  const rot = normRot(data.rotation);

  return (
    <SldSymbol selected={selected} rot={rot} w={W} h={H} handles={BASE} label={data.label}>
      <text x="40" y="12" textAnchor="middle" fontSize={RATING.size} fill={RATING.fill}>{network}</text>
      <polygon points="34,18 46,18 40,30" fill={INK} />
      <line x1="40" y1="30" x2="40" y2="40" stroke={INK} strokeWidth={STROKE} />
    </SldSymbol>
  );
}
