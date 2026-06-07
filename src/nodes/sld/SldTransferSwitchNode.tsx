import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, boxDims, gTransform, rotHandle, type BaseHandle } from './rotate.ts';

type T = Node<SchematicNodeData, 'sldTransferSwitch'>;

const W = 80;
const H = 50;
const BASE: BaseHandle[] = [
  { id: 'in1', pos: Position.Top, x: 20, y: 0 },
  { id: 'in2', pos: Position.Top, x: 60, y: 0 },
  { id: 'out', pos: Position.Bottom, x: 40, y: H },
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
          {/* 2 zrodla — doprowadzenia + styki stale */}
          <line x1="20" y1="0" x2="20" y2="14" stroke="#222" strokeWidth="1.5" />
          <line x1="60" y1="0" x2="60" y2="14" stroke="#222" strokeWidth="1.5" />
          <circle cx="20" cy="15" r="1.8" fill="#222" />
          <circle cx="60" cy="15" r="1.8" fill="#222" />
          {/* etykiety pozycji 1 - 0 - 2 — kontr-obrot, by zawsze byly czytelne */}
          <text x="14" y="13" textAnchor="end" fontSize="7" fontWeight="bold" fill="#222" transform={`rotate(${-rot} 14 13)`}>1</text>
          <text x="66" y="13" fontSize="7" fontWeight="bold" fill="#222" transform={`rotate(${-rot} 66 13)`}>2</text>
          <text x="40" y="10" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#888" transform={`rotate(${-rot} 40 10)`}>0</text>
          {/* mozliwe polozenia styku ruchomego */}
          <line x1="40" y1="18" x2="20" y2="16" stroke="#222" strokeWidth="0.6" strokeDasharray="2,1.5" />
          <line x1="40" y1="18" x2="60" y2="16" stroke="#222" strokeWidth="0.6" strokeDasharray="2,1.5" />
          {/* styk ruchomy w pozycji 0 */}
          <line x1="40" y1="36" x2="40" y2="17" stroke="#222" strokeWidth="2" />
          <circle cx="40" cy="36" r="2" fill="#222" />
          {/* wyjscie wspolne */}
          <line x1="40" y1="36" x2="40" y2="50" stroke="#222" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}
