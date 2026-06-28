import { Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, type BaseHandle } from './rotate.ts';
import { SldSymbol } from './SldSymbol.tsx';
import { INK, STROKE, FINE } from './sldStyle.ts';

type T = Node<SchematicNodeData, 'sldPvString'>;

const W = 80;
const H = 50;
const SHIFT = 5; // (W - svgW) / 2 = (80 - 70) / 2
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 40, y: 0 },
  { id: 'out', pos: Position.Bottom, x: 40, y: H },
];

export function SldPvStringNode({ data, selected }: NodeProps<T>) {
  const n = data.parameters.panelCount ?? 8;
  const voc = data.parameters.voc ?? '';
  const isc = data.parameters.isc ?? '';
  const mpp = data.parameters.mpp ?? '';

  const rot = normRot(data.rotation);

  // Wczesniej: 2 linie opisu pod symbolem + adnotacja „n×" z prawej. SldSymbol
  // kladzie opis z boku (poza osia przewodu) i wspiera wiele linii.
  const rating = [
    [`${n}×`, voc && `Voc=${voc}V`].filter(Boolean).join(' '),
    [isc && `Isc=${isc}A`, mpp && `Pmpp=${mpp}W`].filter(Boolean).join(' '),
  ].filter(Boolean);

  return (
    <SldSymbol selected={selected} rot={rot} w={W} h={H} handles={BASE} label={data.label} rating={rating}>
      <g transform={`translate(${SHIFT} 0)`}>
        <line x1="35" y1="0" x2="35" y2="6" stroke={INK} strokeWidth={STROKE} />
        <rect x="14" y="6" width="42" height="28" fill="white" stroke={INK} strokeWidth={STROKE} />
        <line x1="14" y1="6" x2="56" y2="34" stroke={INK} strokeWidth={FINE} />
        <line x1="56" y1="6" x2="14" y2="34" stroke={INK} strokeWidth={FINE} />
        <line x1="35" y1="34" x2="35" y2="50" stroke={INK} strokeWidth={STROKE} />
      </g>
    </SldSymbol>
  );
}
