import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, boxDims, gTransform, rotHandle, type BaseHandle } from './rotate.ts';

type T = Node<SchematicNodeData, 'sldMainSwitch'>;

const W = 40;
const H = 50;
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 20, y: 0 },
  { id: 'out', pos: Position.Bottom, x: 20, y: H },
];

export function SldMainSwitchNode({ data, selected }: NodeProps<T>) {
  const poles = String(data.parameters.poles ?? '3P');
  const In = data.parameters.ratingCurrent ? `${data.parameters.ratingCurrent}A` : '';

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
          <line x1="20" y1="0" x2="20" y2="12" stroke="#222" strokeWidth="1.5" />
          <line x1="20" y1="12" x2="30" y2="28" stroke="#222" strokeWidth="2" />
          <circle cx="20" cy="12" r="1.5" fill="#222" />
          <circle cx="20" cy="28" r="1.5" fill="#222" />
          <line x1="16" y1="32" x2="24" y2="40" stroke="#222" strokeWidth="0.9" />
          <line x1="24" y1="32" x2="16" y2="40" stroke="#222" strokeWidth="0.9" />
          <line x1="20" y1="28" x2="20" y2="50" stroke="#222" strokeWidth="1.5" />
        </g>
        <text x={box.w / 2} y={box.h + 8} textAnchor="middle" fontSize="7" fill="#888">{poles} {In}</text>
      </svg>
    </div>
  );
}
