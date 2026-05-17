import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, boxDims, gTransform, rotHandle, type BaseHandle } from './rotate.ts';

type T = Node<SchematicNodeData, 'sldDcDisconnect'>;

const W = 60;
const H = 50;
const SHIFT = 5; // (W - svgW) / 2 = (60 - 50) / 2
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 30, y: 0 },
  { id: 'out', pos: Position.Bottom, x: 30, y: H },
];

export function SldDcDisconnectNode({ data, selected }: NodeProps<T>) {
  const poles = String(data.parameters.poles ?? '2P');
  const In = data.parameters.ratingCurrent ? `${data.parameters.ratingCurrent}A` : '';
  const Un = data.parameters.ratingVoltage ? `${data.parameters.ratingVoltage}V` : '';

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
        <text x={box.w / 2} y={box.h + 8} textAnchor="middle" fontSize="7" fill="#888">{poles} {In} {Un}</text>
        <g transform={gTransform(rot, W, H)}>
          <g transform={`translate(${SHIFT} 0)`}>
            <line x1="25" y1="0" x2="25" y2="12" stroke="#222" strokeWidth="1.5" />
            <line x1="25" y1="12" x2="35" y2="28" stroke="#222" strokeWidth="2" />
            <circle cx="25" cy="12" r="1.5" fill="#222" />
            <circle cx="25" cy="28" r="1.5" fill="#222" />
            <text x="42" y="22" fontSize="9" fontWeight="bold" fill="#b91c1c">DC</text>
            <line x1="25" y1="28" x2="25" y2="50" stroke="#222" strokeWidth="1.5" />
          </g>
        </g>
      </svg>
    </div>
  );
}
