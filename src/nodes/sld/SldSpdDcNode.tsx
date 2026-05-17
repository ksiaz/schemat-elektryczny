import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, boxDims, gTransform, rotHandle, type BaseHandle } from './rotate.ts';

type T = Node<SchematicNodeData, 'sldSpdDc'>;

const W = 40;
const H = 50;
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 20, y: 0 },
  { id: 'out', pos: Position.Bottom, x: 20, y: H },
];

export function SldSpdDcNode({ data, selected }: NodeProps<T>) {
  const klasa = String(data.parameters.spdClass ?? 'T1+2');
  const uc = data.parameters.uc ? `UC=${data.parameters.uc}V` : '';

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
        <text x={box.w / 2} y={box.h + 8} textAnchor="middle" fontSize="7" fill="#888">DC {uc}</text>
        <g transform={gTransform(rot, W, H)}>
          <line x1="20" y1="0" x2="20" y2="14" stroke="#222" strokeWidth="1.5" />
          <rect x="12" y="14" width="16" height="20" fill="white" stroke="#222" strokeWidth="1.5" />
          <text x="20" y="28" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#222">{klasa}</text>
          <line x1="20" y1="34" x2="20" y2="50" stroke="#222" strokeWidth="0.6" strokeDasharray="2,1" />
        </g>
      </svg>
    </div>
  );
}
