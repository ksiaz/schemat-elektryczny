import { Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, type BaseHandle } from './rotate.ts';
import { SldSymbol } from './SldSymbol.tsx';
import { INK, STROKE } from './sldStyle.ts';

type T = Node<SchematicNodeData, 'sldBattery'>;

const W = 60;
const H = 50;
const SHIFT = 5; // (W - svgW) / 2 = (60 - 50) / 2
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 30, y: 0 },
];

export function SldBatteryNode({ data, selected }: NodeProps<T>) {
  const cap = data.parameters.capacity ?? '';
  const v = data.parameters.voltage ?? '';
  const chem = String(data.parameters.chemistry ?? 'LiFePO4');

  const rot = normRot(data.rotation);

  return (
    <SldSymbol selected={selected} rot={rot} w={W} h={H} handles={BASE}
      label={data.label} rating={`${chem} ${cap}kWh ${v}V`}>
      <g transform={`translate(${SHIFT} 0)`}>
        {/* doprowadzenie — jeden punkt polaczeniowy od gory */}
        <line x1="25" y1="0" x2="25" y2="12" stroke={INK} strokeWidth={STROKE} />
        {/* prostokat — obudowa magazynu */}
        <rect x="6" y="12" width="38" height="26" rx="2" fill="white" stroke={INK} strokeWidth={STROKE} />
        {/* symbol baterii wewnatrz */}
        <rect x="14" y="19" width="19" height="13" rx="1.5" fill="white" stroke={INK} strokeWidth={STROKE} />
        <rect x="33" y="22.5" width="3" height="6" rx="0.8" fill={INK} />
        <rect x="16.5" y="21.5" width="13" height="8" rx="0.8" fill={INK} />
      </g>
    </SldSymbol>
  );
}
