import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, boxDims, gTransform, rotHandle, type BaseHandle } from './rotate.ts';

type T = Node<SchematicNodeData, 'sldDistBoard'>;

const W = 80;
const H = 40;
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 40, y: 0 },
  { id: 'out', pos: Position.Bottom, x: 40, y: H },
];

// Rozdzielnica — prostokat z edytowalnym podpisem (domyslnie RG)
export function SldDistBoardNode({ data, selected }: NodeProps<T>) {
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
        <text x={box.w / 2} y={box.h / 2 + 4} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#222">{data.label}</text>
        <g transform={gTransform(rot, W, H)}>
          <rect x="1" y="1" width="78" height="38" rx="2" fill="white" stroke="#222" strokeWidth="1.8" />
        </g>
      </svg>
    </div>
  );
}
