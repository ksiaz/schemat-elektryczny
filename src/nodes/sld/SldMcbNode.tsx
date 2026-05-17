import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, boxDims, gTransform, rotHandle, type BaseHandle } from './rotate.ts';

type T = Node<SchematicNodeData, 'sldMcb'>;

const W = 40;
const H = 50;
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 20, y: 0 },
  { id: 'out', pos: Position.Bottom, x: 20, y: H },
];

export function SldMcbNode({ data, selected }: NodeProps<T>) {
  const poles = String(data.parameters.poles ?? '1P');
  const curve = String(data.parameters.curve ?? 'B');
  const In = data.parameters.ratingCurrent ?? 16;

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
          <line x1="20" y1="0" x2="20" y2="14" stroke="#222" strokeWidth="1.5" />
          <line x1="20" y1="14" x2="30" y2="30" stroke="#222" strokeWidth="2" />
          <rect x="26" y="22" width="5" height="4" fill="none" stroke="#222" strokeWidth="0.8" />
          <path d="M 16,34 A 4,4 0 0,1 24,34" fill="none" stroke="#222" strokeWidth="0.8" />
          <circle cx="20" cy="37" r="2" fill="#222" />
          <line x1="20" y1="39" x2="20" y2="50" stroke="#222" strokeWidth="1.5" />
        </g>
        <text x={box.w / 2} y={box.h + 8} textAnchor="middle" fontSize="7" fill="#888">{curve}{In}/{poles}</text>
      </svg>
    </div>
  );
}
