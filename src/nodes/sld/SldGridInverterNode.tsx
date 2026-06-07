import { useEffect } from 'react';
import { Handle, Position, useUpdateNodeInternals, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, boxDims, gTransform, rotHandle, type BaseHandle } from './rotate.ts';

type T = Node<SchematicNodeData, 'sldGridInverter'>;

const W = 60;
const H = 60;
const cx = W / 2;

// Punkty przylaczenia: wejscie ze zrodla (gora), wyjscie do sieci AC (dol), PE (lewa).
const BASE: BaseHandle[] = [
  { id: 'in', pos: Position.Top, x: cx, y: 0, color: '#ea580c' },
  { id: 'out', pos: Position.Bottom, x: cx, y: H, color: '#1d4ed8' },
  { id: 'pe', pos: Position.Left, x: 0, y: 40, color: '#228B22' },
];

export function SldGridInverterNode({ id, data, selected }: NodeProps<T>) {
  const power = data.parameters.power ?? '';
  const voltage = data.parameters.voltage ?? '';
  const model = String(data.parameters.model ?? '');

  const rot = normRot(data.rotation);
  const box = boxDims(rot, W, H);

  // Wymus przeliczenie uchwytow — zmiana wymiarow i ukladu punktow.
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
          {/* Wejscie ze zrodla */}
          <line x1={cx} y1="0" x2={cx} y2="10" stroke="#ea580c" strokeWidth="1.5" />
          {/* Korpus falownika */}
          <rect x="10" y="10" width="40" height="40" rx="2" fill="white" stroke="#222" strokeWidth="1.5" />
          {/* Przekatna DC/AC */}
          <line x1="18" y1="46" x2="42" y2="14" stroke="#222" strokeWidth="1" />
          {/* Wejscie zmienne (gorny-lewy) */}
          <text x={cx - 8} y="28" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#ea580c">∿</text>
          {/* Wyjscie sieciowe AC (dolny-prawy) */}
          <text x={cx + 8} y="46" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1d4ed8">∼</text>
          {/* Wyjscie do sieci AC */}
          <line x1={cx} y1="50" x2={cx} y2={H} stroke="#1d4ed8" strokeWidth="1.5" />
          {/* Odgalezienie PE */}
          <line x1="10" y1="40" x2="0" y2="40" stroke="#228B22" strokeWidth="1.5" />
          <text x="2" y="37" textAnchor="start" fontSize="6" fill="#228B22">PE</text>
        </g>
        <text x={box.w / 2} y={box.h + 8} textAnchor="middle" fontSize="7" fill="#888">
          {power && `${power} kW`} {voltage && `${voltage} V`}
        </text>
        {model && <text x={box.w / 2} y={box.h + 18} textAnchor="middle" fontSize="7" fill="#888">{model}</text>}
      </svg>
    </div>
  );
}
