import { useEffect } from 'react';
import { Handle, Position, useUpdateNodeInternals, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, boxDims, gTransform, rotHandle, type BaseHandle } from './rotate.ts';

type T = Node<SchematicNodeData, 'sldResistor'>;

const W = 60;
const H = 50;

// Ksztalt jak kontroler — 2 punkty przylaczeniowe wylacznie od gory + PE (lewa krawedz).
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: 20, y: 0 },
  { id: 'out', pos: Position.Top, x: 40, y: 0 },
  { id: 'pe', pos: Position.Left, x: 0, y: 40, color: '#228B22' },
];

export function SldResistorNode({ id, data, selected }: NodeProps<T>) {
  const resistance = data.parameters.resistance ?? '';

  const rot = normRot(data.rotation);
  const box = boxDims(rot, W, H);

  // Wymus przeliczenie uchwytow — zmiana ukladu punktow.
  const updateNodeInternals = useUpdateNodeInternals();
  useEffect(() => { updateNodeInternals(id); }, [id, rot, updateNodeInternals]);

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
          {/* Wyprowadzenia gorne */}
          <line x1="20" y1="0" x2="20" y2="6" stroke="#222" strokeWidth="1.5" />
          <line x1="40" y1="0" x2="40" y2="6" stroke="#222" strokeWidth="1.5" />
          {/* Korpus rezystora (prostokat wg PN-EN 60617) */}
          <rect x="6" y="6" width="48" height="38" fill="white" stroke="#222" strokeWidth="1.5" />
          <text x="30" y="28" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#333">REZYSTOR</text>
          {/* Odgalezienie PE */}
          <line x1="6" y1="40" x2="0" y2="40" stroke="#228B22" strokeWidth="1.5" />
          <text x="2" y="37" textAnchor="start" fontSize="6" fill="#228B22">PE</text>
        </g>
        {resistance !== '' && (
          <text x={box.w / 2} y={box.h + 8} textAnchor="middle" fontSize="7" fill="#888">{`${resistance} Ω`}</text>
        )}
      </svg>
    </div>
  );
}
