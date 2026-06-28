import { useEffect } from 'react';
import { Position, useUpdateNodeInternals, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, type BaseHandle } from './rotate.ts';
import { SldSymbol } from './SldSymbol.tsx';
import { INK, STROKE } from './sldStyle.ts';

type T = Node<SchematicNodeData, 'sldResistor'>;

const W = 60;
const H = 50;

// Ksztalt jak kontroler — 2 punkty przylaczeniowe wylacznie od gory + PE (lewa krawedz).
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 20, y: 0 },
  { id: 'out', pos: Position.Top, x: 40, y: 0 },
  { id: 'pe', pos: Position.Left, x: 0, y: 40 },
];

export function SldResistorNode({ id, data, selected }: NodeProps<T>) {
  const resistance = data.parameters.resistance ?? '';

  const rot = normRot(data.rotation);

  // Wymus przeliczenie uchwytow — zmiana ukladu punktow.
  const updateNodeInternals = useUpdateNodeInternals();
  useEffect(() => { updateNodeInternals(id); }, [id, rot, updateNodeInternals]);

  return (
    <SldSymbol selected={selected} rot={rot} w={W} h={H} handles={BASE}
      label={data.label} rating={resistance !== '' ? `${resistance} Ω` : undefined}>
      {/* Wyprowadzenia gorne */}
      <line x1="20" y1="0" x2="20" y2="6" stroke={INK} strokeWidth={STROKE} />
      <line x1="40" y1="0" x2="40" y2="6" stroke={INK} strokeWidth={STROKE} />
      {/* Korpus rezystora (prostokat wg PN-EN 60617) */}
      <rect x="6" y="6" width="48" height="38" fill="white" stroke={INK} strokeWidth={STROKE} />
      <text x="30" y="28" textAnchor="middle" fontSize="7" fontWeight="bold" fill={INK}>REZYSTOR</text>
      {/* Odgalezienie PE */}
      <line x1="6" y1="40" x2="0" y2="40" stroke={INK} strokeWidth={STROKE} />
      <text x="2" y="37" textAnchor="start" fontSize="6" fill={INK}>PE</text>
    </SldSymbol>
  );
}
