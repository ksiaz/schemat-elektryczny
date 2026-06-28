import { Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, type BaseHandle } from './rotate.ts';
import { SldSymbol } from './SldSymbol.tsx';
import { RED, STROKE, FINE } from './sldStyle.ts';

type T = Node<SchematicNodeData, 'sldEStop'>;

const W = 40;
const H = 50;
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 20, y: 0 },
  { id: 'out', pos: Position.Bottom, x: 20, y: H },
];

// Wylacznik awaryjny (ESTOP) — czerwony przycisk grzybkowy ze stykiem rozwiernym (NC).
// Czerwien = swiadomy wyjatek od monochromu (element bezpieczenstwa).
export function SldEStopNode({ data, selected }: NodeProps<T>) {
  const rot = normRot(data.rotation);

  return (
    <SldSymbol selected={selected} rot={rot} w={W} h={H} handles={BASE}
      label={data.label} rating="NC">
      {/* Zacisk gorny */}
      <line x1="20" y1="0" x2="20" y2="15" stroke={RED} strokeWidth={STROKE} />
      {/* Obudowa przycisku */}
      <circle cx="20" cy="25" r="10" fill="white" stroke={RED} strokeWidth={STROKE} />
      {/* Grzybek: czasza + trzonek */}
      <path d="M 13,24 A 7,4 0 0,1 27,24" fill={RED} stroke={RED} strokeWidth={FINE} />
      <line x1="20" y1="24" x2="20" y2="30" stroke={RED} strokeWidth={STROKE} />
      {/* Zacisk dolny */}
      <line x1="20" y1="35" x2="20" y2="50" stroke={RED} strokeWidth={STROKE} />
    </SldSymbol>
  );
}
