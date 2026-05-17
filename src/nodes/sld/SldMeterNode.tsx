import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, boxDims, gTransform, rotHandle, type BaseHandle } from './rotate.ts';

type T = Node<SchematicNodeData, 'sldMeter'>;

const W = 60;
const H = 50;
const SHIFT = (W - 50) / 2; // 5
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 30, y: 0 },
  { id: 'out', pos: Position.Bottom, x: 30, y: H },
];

export function SldMeterNode({ data, selected }: NodeProps<T>) {
  const bidir = String(data.parameters.direction ?? '1-kier') === '2-kier';

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
        <g transform={gTransform(rot, W, H)}>
          <g transform={`translate(${SHIFT} 0)`}>
            <line x1="25" y1="0" x2="25" y2="7" stroke="#222" strokeWidth="1.5" />
            <line x1="25" y1="43" x2="25" y2="50" stroke="#222" strokeWidth="1.5" />
            <circle cx="25" cy="25" r="18" fill="white" stroke="#222" strokeWidth="1.5" />
            <text x="25" y="29" textAnchor="middle" fontSize="10" fill="#222">{bidir ? 'kWh' : 'Wh'}</text>
            {bidir && (
              <>
                <path d="M 8,20 L 4,24 L 8,28" fill="none" stroke="#222" strokeWidth="1" />
                <path d="M 42,20 L 46,24 L 42,28" fill="none" stroke="#222" strokeWidth="1" />
              </>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
}
