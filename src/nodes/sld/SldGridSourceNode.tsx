import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, boxDims, gTransform, rotHandle, type BaseHandle } from './rotate.ts';

type T = Node<SchematicNodeData, 'sldGridSource'>;

const W = 80;
const H = 40;
const BASE: BaseHandle[] = [
  { id: 'out', pos: Position.Bottom, x: 40, y: H },
];

export function SldGridSourceNode({ data, selected }: NodeProps<T>) {
  const network = String(data.parameters.network ?? '~3/N/PE 400/230 V 50 Hz');

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
          <text x="40" y="12" textAnchor="middle" fontSize="7" fill="#555">{network}</text>
          <polygon points="34,18 46,18 40,30" fill="#222" />
          <line x1="40" y1="30" x2="40" y2="40" stroke="#222" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}
