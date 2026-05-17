import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, boxDims, gTransform, rotHandle, type BaseHandle } from './rotate.ts';

type T = Node<SchematicNodeData, 'sldRcbo'>;

const W = 60;
const H = 60;
const SHIFT = (W - 50) / 2; // 5
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 30, y: 0 },
  { id: 'out', pos: Position.Bottom, x: 30, y: H },
];

export function SldRcboNode({ data, selected }: NodeProps<T>) {
  const poles = String(data.parameters.poles ?? '1P+N');
  const curve = String(data.parameters.curve ?? 'B');
  const rcdType = String(data.parameters.rcdType ?? 'A');
  const In = data.parameters.ratingCurrent ?? 16;
  const sens = data.parameters.sensitivityCurrent ?? 30;

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
            <line x1="25" y1="0" x2="25" y2="10" stroke="#222" strokeWidth="1.5" />
            <line x1="25" y1="10" x2="35" y2="22" stroke="#222" strokeWidth="2" />
            <rect x="31" y="16" width="4" height="3" fill="none" stroke="#222" strokeWidth="0.8" />
            <polygon points="17,28 33,28 25,42" fill="none" stroke="#222" strokeWidth="1.5" />
            <text x="25" y="38" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#222">Δ</text>
            <line x1="25" y1="42" x2="25" y2="60" stroke="#222" strokeWidth="1.5" />
          </g>
        </g>
        <text x={box.w / 2} y={box.h + 8} textAnchor="middle" fontSize="7" fill="#888">{curve}{In} {rcdType}/{sens}mA {poles}</text>
      </svg>
    </div>
  );
}
