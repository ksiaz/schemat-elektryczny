import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, boxDims, gTransform, rotHandle, type BaseHandle } from './rotate.ts';

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
  const box = boxDims(rot, W, H);

  return (
    <div className={selected ? 'ring-2 ring-blue-500' : ''} style={{ width: box.w, height: box.h, position: 'relative' }}>
      {BASE.map((b) => {
        const r = rotHandle(b, rot, W, H);
        return (
          <Handle key={b.id} type="source" id={r.id} position={r.position}
            className="!w-1.5 !h-1.5" style={{ backgroundColor: r.color, left: r.left, top: r.top }} />
        );
      })}
      <svg width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} style={{ overflow: 'visible', display: 'block' }}>
        <text x={box.w / 2} y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label}</text>
        <text x={box.w / 2} y={box.h + 8} textAnchor="middle" fontSize="7" fill="#888">{chem} {cap}kWh {v}V</text>
        <g transform={gTransform(rot, W, H)}>
          <g transform={`translate(${SHIFT} 0)`}>
            {/* doprowadzenie — jeden punkt polaczeniowy od gory */}
            <line x1="25" y1="0" x2="25" y2="12" stroke="#222" strokeWidth="1.5" />
            {/* prostokat — obudowa magazynu */}
            <rect x="6" y="12" width="38" height="26" rx="2" fill="white" stroke="#222" strokeWidth="1.8" />
            {/* symbol baterii wewnatrz */}
            <rect x="14" y="19" width="19" height="13" rx="1.5" fill="white" stroke="#222" strokeWidth="1.4" />
            <rect x="33" y="22.5" width="3" height="6" rx="0.8" fill="#222" />
            <rect x="16.5" y="21.5" width="13" height="8" rx="0.8" fill="#16a34a" />
          </g>
        </g>
      </svg>
    </div>
  );
}
