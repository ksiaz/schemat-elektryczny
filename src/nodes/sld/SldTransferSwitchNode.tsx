import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, boxDims, gTransform, rotHandle, type BaseHandle } from './rotate.ts';

type T = Node<SchematicNodeData, 'sldTransferSwitch'>;

const W = 60;
const H = 50;
const SHIFT = 5; // (W - svgW) / 2 = (60 - 50) / 2
const BASE: BaseHandle[] = [
  { id: 'in1', pos: Position.Top, x: 20, y: 0 },
  { id: 'in2', pos: Position.Top, x: 40, y: 0 },
  { id: 'out', pos: Position.Bottom, x: 30, y: H },
];

// Przelacznik zasilania 1-0-2 — reczny przelacznik dwoch zrodel
export function SldTransferSwitchNode({ data, selected }: NodeProps<T>) {
  const poles = String(data.parameters.poles ?? '4P');
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
        <text x={box.w / 2} y={box.h + 8} textAnchor="middle" fontSize="7" fill="#888">{poles} {In}</text>
        <g transform={gTransform(rot, W, H)}>
          <g transform={`translate(${SHIFT} 0)`}>
            {/* 2 zrodla — doprowadzenia + styki stale */}
            <line x1="15" y1="0" x2="15" y2="14" stroke="#222" strokeWidth="1.5" />
            <line x1="35" y1="0" x2="35" y2="14" stroke="#222" strokeWidth="1.5" />
            <circle cx="15" cy="15" r="1.8" fill="#222" />
            <circle cx="35" cy="15" r="1.8" fill="#222" />
            {/* etykiety pozycji 1 - 0 - 2 */}
            <text x="9" y="13" textAnchor="end" fontSize="7" fontWeight="bold" fill="#222">1</text>
            <text x="41" y="13" fontSize="7" fontWeight="bold" fill="#222">2</text>
            <text x="25" y="10" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#888">0</text>
            {/* mozliwe polozenia styku ruchomego */}
            <line x1="25" y1="18" x2="15" y2="16" stroke="#222" strokeWidth="0.6" strokeDasharray="2,1.5" />
            <line x1="25" y1="18" x2="35" y2="16" stroke="#222" strokeWidth="0.6" strokeDasharray="2,1.5" />
            {/* styk ruchomy w pozycji 0 */}
            <line x1="25" y1="36" x2="25" y2="17" stroke="#222" strokeWidth="2" />
            <circle cx="25" cy="36" r="2" fill="#222" />
            {/* wyjscie wspolne */}
            <line x1="25" y1="36" x2="25" y2="50" stroke="#222" strokeWidth="1.5" />
          </g>
        </g>
      </svg>
    </div>
  );
}
