import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, boxDims, gTransform, rotHandle, type BaseHandle } from './rotate.ts';

type T = Node<SchematicNodeData, 'sldFireSwitch'>;

const W = 40;
const H = 50;
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 20, y: 0 },
  { id: 'out', pos: Position.Bottom, x: 20, y: H },
];

export function SldFireSwitchNode({ data, selected }: NodeProps<T>) {
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
          <line x1="20" y1="0" x2="20" y2="13" stroke="#222" strokeWidth="1.5" />
          <circle cx="20" cy="25" r="10" fill="#fee2e2" stroke="#b91c1c" strokeWidth="1.5" />
          <line x1="14" y1="19" x2="26" y2="31" stroke="#b91c1c" strokeWidth="1.5" />
          <line x1="26" y1="19" x2="14" y2="31" stroke="#b91c1c" strokeWidth="1.5" />
          <line x1="20" y1="36" x2="20" y2="50" stroke="#222" strokeWidth="1.5" />
        </g>
        <text x={box.w / 2} y={box.h + 8} textAnchor="middle" fontSize="7" fill="#888">PWP</text>
      </svg>
    </div>
  );
}
