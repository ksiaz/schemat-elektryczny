import { useEffect } from 'react';
import { Position, useUpdateNodeInternals, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, type BaseHandle } from './rotate.ts';
import { SldSymbol } from './SldSymbol.tsx';
import { INK, STROKE, FINE, GLYPH } from './sldStyle.ts';

type T = Node<SchematicNodeData, 'sldGridInverter'>;

const W = 60;
const H = 60;
const cx = W / 2;

// Punkty przylaczenia: wejscie ze zrodla (gora), wyjscie do sieci AC (dol), PE (lewa).
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: cx, y: 0 },
  { id: 'out', pos: Position.Bottom, x: cx, y: H },
  { id: 'pe', pos: Position.Left, x: 0, y: 40 },
];

export function SldGridInverterNode({ id, data, selected }: NodeProps<T>) {
  const power = data.parameters.power ?? '';
  const voltage = data.parameters.voltage ?? '';
  const model = String(data.parameters.model ?? '');

  const rot = normRot(data.rotation);

  // Wymus przeliczenie uchwytow — zmiana wymiarow i ukladu punktow.
  const updateNodeInternals = useUpdateNodeInternals();
  useEffect(() => { updateNodeInternals(id); }, [id, rot, updateNodeInternals]);

  const rating = [
    [power && `${power} kW`, voltage && `${voltage} V`].filter(Boolean).join(' '),
    model,
  ].filter(Boolean);

  return (
    <SldSymbol selected={selected} rot={rot} w={W} h={H} handles={BASE}
      label={data.label} rating={rating.length ? rating : undefined}>
      {/* Wejscie ze zrodla */}
      <line x1={cx} y1="0" x2={cx} y2="10" stroke={INK} strokeWidth={STROKE} />
      {/* Korpus falownika */}
      <rect x="10" y="10" width="40" height="40" rx="2" fill="white" stroke={INK} strokeWidth={STROKE} />
      {/* Przekatna DC/AC */}
      <line x1="18" y1="46" x2="42" y2="14" stroke={INK} strokeWidth={FINE} />
      {/* Wejscie zmienne (gorny-lewy) */}
      <text x={cx - 8} y="28" textAnchor="middle" fontSize={GLYPH.size + 2} fontWeight="bold" fill={INK}>∿</text>
      {/* Wyjscie sieciowe AC (dolny-prawy) */}
      <text x={cx + 8} y="46" textAnchor="middle" fontSize={GLYPH.size + 3} fontWeight="bold" fill={INK}>∼</text>
      {/* Wyjscie do sieci AC */}
      <line x1={cx} y1="50" x2={cx} y2={H} stroke={INK} strokeWidth={STROKE} />
      {/* Odgalezienie PE */}
      <line x1="10" y1="40" x2="0" y2="40" stroke={INK} strokeWidth={STROKE} />
      <text x="2" y="37" textAnchor="start" fontSize="6" fill={INK}>PE</text>
    </SldSymbol>
  );
}
