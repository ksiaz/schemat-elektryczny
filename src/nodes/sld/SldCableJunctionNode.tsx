import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, boxDims, gTransform, rotHandle, type BaseHandle } from './rotate.ts';

type T = Node<SchematicNodeData, 'sldCableJunction'>;

const W = 60;
const H = 30;
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 30, y: 0 },
  { id: 'out', pos: Position.Bottom, x: 30, y: H },
];

export function SldCableJunctionNode({ data, selected }: NodeProps<T>) {
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
        <g transform={gTransform(rot, W, H)}>
          <rect x="0" y="0" width="60" height="30" fill="white" stroke="#222" strokeWidth="1.5" />
        </g>
        <text x={box.w / 2} y={box.h / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#222">{data.label}</text>
      </svg>
    </div>
  );
}
