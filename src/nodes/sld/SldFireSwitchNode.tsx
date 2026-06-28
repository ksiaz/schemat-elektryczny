import { Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, type BaseHandle } from './rotate.ts';
import { SldSymbol } from './SldSymbol.tsx';
import { INK, STROKE } from './sldStyle.ts';

type T = Node<SchematicNodeData, 'sldFireSwitch'>;

const W = 40;
const H = 50;
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 20, y: 0 },
  { id: 'out', pos: Position.Bottom, x: 20, y: H },
];

export function SldFireSwitchNode({ data, selected }: NodeProps<T>) {
  const rot = normRot(data.rotation);

  return (
    <SldSymbol selected={selected} rot={rot} w={W} h={H} handles={BASE}
      label={data.label} rating="PWP">
      <line x1="20" y1="0" x2="20" y2="13" stroke={INK} strokeWidth={STROKE} />
      <circle cx="20" cy="25" r="10" fill="white" stroke={INK} strokeWidth={STROKE} />
      <line x1="14" y1="19" x2="26" y2="31" stroke={INK} strokeWidth={STROKE} />
      <line x1="26" y1="19" x2="14" y2="31" stroke={INK} strokeWidth={STROKE} />
      <line x1="20" y1="36" x2="20" y2="50" stroke={INK} strokeWidth={STROKE} />
    </SldSymbol>
  );
}
