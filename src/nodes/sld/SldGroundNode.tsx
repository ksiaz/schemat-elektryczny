import { Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, type BaseHandle } from './rotate.ts';
import { SldSymbol } from './SldSymbol.tsx';
import { INK, STROKE, FINE } from './sldStyle.ts';

type T = Node<SchematicNodeData, 'sldGround'>;

const W = 40;
const H = 30;
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 20, y: 0 },
];

export function SldGroundNode({ data, selected }: NodeProps<T>) {
  const re = data.parameters.re ? `RE=${data.parameters.re}Ω` : '';

  const rot = normRot(data.rotation);

  return (
    <SldSymbol selected={selected} rot={rot} w={W} h={H} handles={BASE}
      label={data.label} rating={re || undefined}>
      <line x1="20" y1="0" x2="20" y2="12" stroke={INK} strokeWidth={STROKE} />
      <line x1="6" y1="12" x2="34" y2="12" stroke={INK} strokeWidth={STROKE} />
      <line x1="11" y1="18" x2="29" y2="18" stroke={INK} strokeWidth={STROKE} />
      <line x1="15" y1="24" x2="25" y2="24" stroke={INK} strokeWidth={FINE} />
    </SldSymbol>
  );
}
