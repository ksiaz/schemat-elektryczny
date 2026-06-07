import { useEffect } from 'react';
import { Handle, Position, useUpdateNodeInternals, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, boxDims, gTransform, rotHandle, type BaseHandle } from './rotate.ts';

type T = Node<SchematicNodeData, 'sldWindTurbine'>;

const W = 60;
const H = 80;
const cx = W / 2;
const HUB_Y = 22;

// Punkty przylaczenia: wyjscie mocy (dol) + dodatkowe wyjscie (prawa) + PE (lewa krawedz).
const BASE: BaseHandle[] = [
  { id: 'out', pos: Position.Bottom, x: cx, y: H, color: '#1d4ed8' },
  { id: 'out2', pos: Position.Right, x: W, y: 60, color: '#ea580c' },
  { id: 'pe', pos: Position.Left, x: 0, y: 60, color: '#228B22' },
];

export function SldWindTurbineNode({ id, data, selected }: NodeProps<T>) {
  const power = data.parameters.power ?? '';
  const voltage = data.parameters.voltage ?? '';
  const model = String(data.parameters.model ?? '');

  const rot = normRot(data.rotation);
  const box = boxDims(rot, W, H);

  // Wymus przeliczenie uchwytow — istniejace wezly musza zarejestrowac nowy punkt.
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
          {/* Maszt (wieza) */}
          <line x1={cx} y1={HUB_Y} x2={cx} y2="68" stroke="#222" strokeWidth="1.5" />
          {/* Lopaty wirnika — uklad 3-lopatowy (gora, dol-lewo, dol-prawo) */}
          <line x1={cx} y1={HUB_Y} x2={cx} y2="4" stroke="#222" strokeWidth="1.5" />
          <line x1={cx} y1={HUB_Y} x2="45.6" y2="31" stroke="#222" strokeWidth="1.5" />
          <line x1={cx} y1={HUB_Y} x2="14.4" y2="31" stroke="#222" strokeWidth="1.5" />
          {/* Piasta */}
          <circle cx={cx} cy={HUB_Y} r="3" fill="white" stroke="#222" strokeWidth="1.5" />
          {/* Fundament / podstawa */}
          <line x1="22" y1="68" x2="38" y2="68" stroke="#222" strokeWidth="1.5" />
          {/* Wyjscie mocy AC */}
          <line x1={cx} y1="68" x2={cx} y2={H} stroke="#1d4ed8" strokeWidth="1.5" />
          {/* Odgalezienie PE */}
          <line x1={cx} y1="60" x2="0" y2="60" stroke="#228B22" strokeWidth="1.5" />
          <text x="2" y="57" textAnchor="start" fontSize="6" fill="#228B22">PE</text>
          {/* Dodatkowe wyjscie (prawa) */}
          <line x1={cx} y1="60" x2={W} y2="60" stroke="#ea580c" strokeWidth="1.5" />
        </g>
        <text x={box.w / 2} y={box.h + 8} textAnchor="middle" fontSize="7" fill="#888">
          {power && `${power} kW`} {voltage && `${voltage} V`}
        </text>
        {model && <text x={box.w / 2} y={box.h + 18} textAnchor="middle" fontSize="7" fill="#888">{model}</text>}
      </svg>
    </div>
  );
}
