import { Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, type BaseHandle } from './rotate.ts';
import { SldSymbol } from './SldSymbol.tsx';
import { INK, STROKE, FINE } from './sldStyle.ts';

type T = Node<SchematicNodeData, 'sldSpdAc'>;

const W = 40;
const H = 50;
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 20, y: 0 },
  { id: 'out', pos: Position.Bottom, x: 20, y: H },
];

export function SldSpdAcNode({ data, selected }: NodeProps<T>) {
  const klasa = String(data.parameters.spdClass ?? 'T2');
  const uc = data.parameters.uc ? `UC=${data.parameters.uc}V` : '';

  const rot = normRot(data.rotation);

  return (
    <SldSymbol selected={selected} rot={rot} w={W} h={H} handles={BASE}
      label={data.label} rating={uc || undefined}>
      <line x1="20" y1="0" x2="20" y2="14" stroke={INK} strokeWidth={STROKE} />
      <rect x="12" y="14" width="16" height="20" fill="white" stroke={INK} strokeWidth={STROKE} />
      <text x="20" y="28" textAnchor="middle" fontSize="9" fontWeight="bold" fill={INK}>{klasa}</text>
      <line x1="14" y1="34" x2="26" y2="34" stroke={INK} strokeWidth={FINE} />
      <line x1="18" y1="36" x2="22" y2="36" stroke={INK} strokeWidth={FINE} />
      <line x1="20" y1="38" x2="20" y2="50" stroke={INK} strokeWidth={FINE} strokeDasharray="2,1" />
    </SldSymbol>
  );
}
