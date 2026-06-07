import { useEffect } from 'react';
import { Handle, Position, useUpdateNodeInternals, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, boxDims, gTransform, rotHandle, type BaseHandle } from './rotate.ts';

type T = Node<SchematicNodeData, 'sldController'>;

const W = 60;
const H = 50;

// 2 punkty u gory + 3 punkty na spodzie.
const BASE: BaseHandle[] = [
  { id: 'in1', pos: Position.Top, x: 20, y: 0 },
  { id: 'in2', pos: Position.Top, x: 40, y: 0 },
  { id: 'out1', pos: Position.Bottom, x: 10, y: H },
  { id: 'out2', pos: Position.Bottom, x: 30, y: H },
  { id: 'out3', pos: Position.Bottom, x: 50, y: H },
];

export function SldControllerNode({ id, data, selected }: NodeProps<T>) {
  const desc = String(data.parameters.description ?? '');

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
          {/* Punkty gorne */}
          <line x1="20" y1="0" x2="20" y2="6" stroke="#222" strokeWidth="1.5" />
          <line x1="40" y1="0" x2="40" y2="6" stroke="#222" strokeWidth="1.5" />
          {/* Korpus kontrolera */}
          <rect x="6" y="6" width="48" height="38" rx="2" fill="white" stroke="#222" strokeWidth="1.5" />
          <text x="30" y="28" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#333">KONTR.</text>
          {/* Punkty dolne */}
          <line x1="10" y1="44" x2="10" y2="50" stroke="#222" strokeWidth="1.5" />
          <line x1="30" y1="44" x2="30" y2="50" stroke="#222" strokeWidth="1.5" />
          <line x1="50" y1="44" x2="50" y2="50" stroke="#222" strokeWidth="1.5" />
        </g>
        {desc && <text x={box.w / 2} y={box.h + 8} textAnchor="middle" fontSize="7" fill="#888">{desc}</text>}
      </svg>
    </div>
  );
}
