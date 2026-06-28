import { Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, type BaseHandle } from './rotate.ts';
import { SldSymbol } from './SldSymbol.tsx';
import { INK, STROKE } from './sldStyle.ts';

type T = Node<SchematicNodeData, 'sldCt'>;

const W = 40;
const H = 40;
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 20, y: 0 },
  { id: 'out', pos: Position.Bottom, x: 20, y: H },
];

export function SldCtNode({ data, selected }: NodeProps<T>) {
  const ratio = String(data.parameters.ratio ?? '100/5A');

  const rot = normRot(data.rotation);

  return (
    <SldSymbol selected={selected} rot={rot} w={W} h={H} handles={BASE}
      label={data.label} rating={ratio}>
      <line x1="20" y1="0" x2="20" y2="6" stroke={INK} strokeWidth={STROKE} />
      <line x1="20" y1="34" x2="20" y2="40" stroke={INK} strokeWidth={STROKE} />
      <circle cx="20" cy="20" r="14" fill="white" stroke={INK} strokeWidth={STROKE} />
      <line x1="8" y1="32" x2="32" y2="8" stroke={INK} strokeWidth={STROKE} />
    </SldSymbol>
  );
}
