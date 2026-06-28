import { useEffect } from 'react';
import { Position, useUpdateNodeInternals, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, type BaseHandle } from './rotate.ts';
import { SldSymbol } from './SldSymbol.tsx';
import { INK, STROKE } from './sldStyle.ts';

type T = Node<SchematicNodeData, 'sldWindTurbine'>;

const W = 60;
const H = 80;
const cx = W / 2;
const HUB_Y = 22;

// Punkty przylaczenia: wyjscie mocy (dol) + dodatkowe wyjscie (prawa) + PE (lewa krawedz).
const BASE: BaseHandle[] = [
  { id: 'out', pos: Position.Bottom, x: cx, y: H },
  { id: 'out2', pos: Position.Right, x: W, y: 60 },
  { id: 'pe', pos: Position.Left, x: 0, y: 60 },
];

export function SldWindTurbineNode({ id, data, selected }: NodeProps<T>) {
  const power = data.parameters.power ?? '';
  const voltage = data.parameters.voltage ?? '';
  const model = String(data.parameters.model ?? '');

  const rot = normRot(data.rotation);

  // Wymus przeliczenie uchwytow — istniejace wezly musza zarejestrowac nowy punkt.
  const updateNodeInternals = useUpdateNodeInternals();
  useEffect(() => { updateNodeInternals(id); }, [id, rot, updateNodeInternals]);

  const rating = [
    [power && `${power} kW`, voltage && `${voltage} V`].filter(Boolean).join(' '),
    model,
  ].filter(Boolean);

  return (
    <SldSymbol selected={selected} rot={rot} w={W} h={H} handles={BASE}
      label={data.label} rating={rating.length ? rating : undefined}>
      {/* Maszt (wieza) */}
      <line x1={cx} y1={HUB_Y} x2={cx} y2="68" stroke={INK} strokeWidth={STROKE} />
      {/* Lopaty wirnika — uklad 3-lopatowy (gora, dol-lewo, dol-prawo) */}
      <line x1={cx} y1={HUB_Y} x2={cx} y2="4" stroke={INK} strokeWidth={STROKE} />
      <line x1={cx} y1={HUB_Y} x2="45.6" y2="31" stroke={INK} strokeWidth={STROKE} />
      <line x1={cx} y1={HUB_Y} x2="14.4" y2="31" stroke={INK} strokeWidth={STROKE} />
      {/* Piasta */}
      <circle cx={cx} cy={HUB_Y} r="3" fill="white" stroke={INK} strokeWidth={STROKE} />
      {/* Fundament / podstawa */}
      <line x1="22" y1="68" x2="38" y2="68" stroke={INK} strokeWidth={STROKE} />
      {/* Wyjscie mocy AC */}
      <line x1={cx} y1="68" x2={cx} y2={H} stroke={INK} strokeWidth={STROKE} />
      {/* Odgalezienie PE */}
      <line x1={cx} y1="60" x2="0" y2="60" stroke={INK} strokeWidth={STROKE} />
      <text x="2" y="57" textAnchor="start" fontSize="6" fill={INK}>PE</text>
      {/* Dodatkowe wyjscie (prawa) */}
      <line x1={cx} y1="60" x2={W} y2="60" stroke={INK} strokeWidth={STROKE} />
    </SldSymbol>
  );
}
