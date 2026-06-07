import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, boxDims, gTransform, rotHandle, type BaseHandle } from './rotate.ts';

type T = Node<SchematicNodeData, 'sldGround'>;

const W = 40;
const H = 30;
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 20, y: 0, color: '#228B22' },
];

export function SldGroundNode({ data, selected }: NodeProps<T>) {
  const re = data.parameters.re ? `RE=${data.parameters.re}Ω` : '';

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
        {data.label && (
          <text x={box.w + 3} y={box.h / 2 + 3} textAnchor="start" fontSize="9" fontWeight="bold" fill="#333">{data.label}</text>
        )}
        <text x={box.w / 2} y={box.h + 8} textAnchor="middle" fontSize="7" fill="#888">{re}</text>
        <g transform={gTransform(rot, W, H)}>
          <line x1="20" y1="0" x2="20" y2="12" stroke="#228B22" strokeWidth="1.5" />
          <line x1="6" y1="12" x2="34" y2="12" stroke="#228B22" strokeWidth="2" />
          <line x1="11" y1="18" x2="29" y2="18" stroke="#228B22" strokeWidth="1.5" />
          <line x1="15" y1="24" x2="25" y2="24" stroke="#228B22" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
}
