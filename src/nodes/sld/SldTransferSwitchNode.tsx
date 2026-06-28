import { Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, type BaseHandle } from './rotate.ts';
import { SldSymbol } from './SldSymbol.tsx';
import { INK, STROKE, FINE } from './sldStyle.ts';

type T = Node<SchematicNodeData, 'sldTransferSwitch'>;

const W = 80;
const H = 50;
const BASE: BaseHandle[] = [
  { id: 'in1', pos: Position.Top, x: 20, y: 0 },
  { id: 'in2', pos: Position.Top, x: 60, y: 0 },
  { id: 'out', pos: Position.Bottom, x: 40, y: H },
];

// Przelacznik zasilania 1-0-2 — reczny przelacznik dwoch zrodel
export function SldTransferSwitchNode({ data, selected }: NodeProps<T>) {
  const poles = String(data.parameters.poles ?? '4P');
  const In = data.parameters.ratingCurrent ? `${data.parameters.ratingCurrent}A` : '';

  const rot = normRot(data.rotation);

  return (
    <SldSymbol selected={selected} rot={rot} w={W} h={H} handles={BASE}
      label={data.label} rating={`${poles} ${In}`}>
      {/* 2 zrodla — doprowadzenia + styki stale */}
      <line x1="20" y1="0" x2="20" y2="14" stroke={INK} strokeWidth={STROKE} />
      <line x1="60" y1="0" x2="60" y2="14" stroke={INK} strokeWidth={STROKE} />
      <circle cx="20" cy="15" r="1.8" fill={INK} />
      <circle cx="60" cy="15" r="1.8" fill={INK} />
      {/* etykiety pozycji 1 - 0 - 2 — kontr-obrot, by zawsze byly czytelne */}
      <text x="14" y="13" textAnchor="end" fontSize="7" fontWeight="bold" fill={INK} transform={`rotate(${-rot} 14 13)`}>1</text>
      <text x="66" y="13" fontSize="7" fontWeight="bold" fill={INK} transform={`rotate(${-rot} 66 13)`}>2</text>
      <text x="40" y="10" textAnchor="middle" fontSize="7" fontWeight="bold" fill={INK} transform={`rotate(${-rot} 40 10)`}>0</text>
      {/* mozliwe polozenia styku ruchomego */}
      <line x1="40" y1="18" x2="20" y2="16" stroke={INK} strokeWidth={FINE} strokeDasharray="2,1.5" />
      <line x1="40" y1="18" x2="60" y2="16" stroke={INK} strokeWidth={FINE} strokeDasharray="2,1.5" />
      {/* styk ruchomy w pozycji 0 */}
      <line x1="40" y1="36" x2="40" y2="17" stroke={INK} strokeWidth={STROKE} />
      <circle cx="40" cy="36" r="2" fill={INK} />
      {/* wyjscie wspolne */}
      <line x1="40" y1="36" x2="40" y2="50" stroke={INK} strokeWidth={STROKE} />
    </SldSymbol>
  );
}
