import { useEffect } from 'react';
import { Position, useUpdateNodeInternals, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, type BaseHandle } from './rotate.ts';
import { SldSymbol } from './SldSymbol.tsx';
import { INK, STROKE } from './sldStyle.ts';

type T = Node<SchematicNodeData, 'sldController'>;

const W = 60;
const H = 50;

// 2 punkty u gory + 3 punkty na spodzie + 1 z prawej.
const BASE: BaseHandle[] = [
  { id: 'in1', pos: Position.Top, x: 20, y: 0 },
  { id: 'in2', pos: Position.Top, x: 40, y: 0 },
  { id: 'out1', pos: Position.Bottom, x: 10, y: H },
  { id: 'out2', pos: Position.Bottom, x: 30, y: H },
  { id: 'out3', pos: Position.Bottom, x: 50, y: H },
  { id: 'aux', pos: Position.Right, x: W, y: 30 },
];

export function SldControllerNode({ id, data, selected }: NodeProps<T>) {
  const desc = String(data.parameters.description ?? '');

  const rot = normRot(data.rotation);

  // Wymus przeliczenie uchwytow — zmiana ukladu punktow.
  const updateNodeInternals = useUpdateNodeInternals();
  useEffect(() => { updateNodeInternals(id); }, [id, rot, updateNodeInternals]);

  return (
    <SldSymbol selected={selected} rot={rot} w={W} h={H} handles={BASE}
      label={data.label} rating={desc || undefined}>
      {/* Punkty gorne */}
      <line x1="20" y1="0" x2="20" y2="6" stroke={INK} strokeWidth={STROKE} />
      <line x1="40" y1="0" x2="40" y2="6" stroke={INK} strokeWidth={STROKE} />
      {/* Korpus kontrolera */}
      <rect x="6" y="6" width="48" height="38" rx="2" fill="white" stroke={INK} strokeWidth={STROKE} />
      <text x="30" y="28" textAnchor="middle" fontSize="8" fontWeight="bold" fill={INK}>KONTR.</text>
      {/* Punkty dolne */}
      <line x1="10" y1="44" x2="10" y2="50" stroke={INK} strokeWidth={STROKE} />
      <line x1="30" y1="44" x2="30" y2="50" stroke={INK} strokeWidth={STROKE} />
      <line x1="50" y1="44" x2="50" y2="50" stroke={INK} strokeWidth={STROKE} />
      {/* Punkt prawy */}
      <line x1="54" y1="30" x2="60" y2="30" stroke={INK} strokeWidth={STROKE} />
    </SldSymbol>
  );
}
