import { Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, type BaseHandle } from './rotate.ts';
import { SldSymbol } from './SldSymbol.tsx';
import { INK, STROKE, FINE } from './sldStyle.ts';

type T = Node<SchematicNodeData, 'sldFuseGpv'>;

const W = 40;
const H = 50;
const SHIFT = 5; // (W - svgW) / 2 = (40 - 30) / 2
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 20, y: 0 },
  { id: 'out', pos: Position.Bottom, x: 20, y: H },
];

export function SldFuseGpvNode({ data, selected }: NodeProps<T>) {
  const In = data.parameters.ratingCurrent ? `${data.parameters.ratingCurrent}A` : '';
  const Un = data.parameters.ratingVoltage ? `${data.parameters.ratingVoltage}V` : '';

  const rot = normRot(data.rotation);

  return (
    <SldSymbol selected={selected} rot={rot} w={W} h={H} handles={BASE}
      label={data.label} rating={`${In} ${Un}`.trim()}>
      <g transform={`translate(${SHIFT} 0)`}>
        <line x1="15" y1="0" x2="15" y2="14" stroke={INK} strokeWidth={STROKE} />
        <rect x="9" y="14" width="12" height="22" fill="white" stroke={INK} strokeWidth={STROKE} />
        <line x1="15" y1="14" x2="15" y2="36" stroke={INK} strokeWidth={FINE} />
        <text x="15" y="29" textAnchor="middle" fontSize="7" fontWeight="bold" fill={INK}>gPV</text>
        <line x1="15" y1="36" x2="15" y2="50" stroke={INK} strokeWidth={STROKE} />
      </g>
    </SldSymbol>
  );
}
