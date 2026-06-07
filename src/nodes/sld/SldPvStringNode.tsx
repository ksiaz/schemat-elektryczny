import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, boxDims, gTransform, rotHandle, type BaseHandle } from './rotate.ts';

type T = Node<SchematicNodeData, 'sldPvString'>;

const W = 80;
const H = 50;
const SHIFT = 5; // (W - svgW) / 2 = (80 - 70) / 2
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 40, y: 0 },
  { id: 'out', pos: Position.Bottom, x: 40, y: H },
];

export function SldPvStringNode({ data, selected }: NodeProps<T>) {
  const n = data.parameters.panelCount ?? 8;
  const voc = data.parameters.voc ?? '';
  const isc = data.parameters.isc ?? '';
  const mpp = data.parameters.mpp ?? '';

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
        <text x={box.w / 2} y={box.h + 8} textAnchor="middle" fontSize="7" fill="#888">
          {voc && `Voc=${voc}V`} {isc && `Isc=${isc}A`}
        </text>
        {mpp && <text x={box.w / 2} y={box.h + 18} textAnchor="middle" fontSize="7" fill="#888">{`Pmpp=${mpp}W`}</text>}
        <text x={box.w + 4} y={box.h / 2 + 4} textAnchor="start" fontSize="11" fontWeight="bold" fill="#222">{n}×</text>
        <g transform={gTransform(rot, W, H)}>
          <g transform={`translate(${SHIFT} 0)`}>
            <line x1="35" y1="0" x2="35" y2="6" stroke="#222" strokeWidth="1.5" />
            <rect x="14" y="6" width="42" height="28" fill="#eef" stroke="#222" strokeWidth="1.5" />
            <line x1="14" y1="6" x2="56" y2="34" stroke="#222" strokeWidth="0.8" />
            <line x1="56" y1="6" x2="14" y2="34" stroke="#222" strokeWidth="0.8" />
            <line x1="35" y1="34" x2="35" y2="50" stroke="#222" strokeWidth="1.5" />
          </g>
        </g>
      </svg>
    </div>
  );
}
