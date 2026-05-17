import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, boxDims, gTransform, rotHandle, type BaseHandle } from './rotate.ts';

type T = Node<SchematicNodeData, 'sldInverter'>;

const H = 60;

export function SldInverterNode({ data, selected }: NodeProps<T>) {
  const typ = String(data.parameters.type ?? 'string');
  const desc = String(data.parameters.description ?? '');
  const isHybrid = typ === 'hybrid';

  // Liczba stringow PV — steruje liczba uchwytow wejsciowych (zlacz)
  const strings = Math.max(1, Math.min(8, Math.round(Number(data.parameters.strings ?? 2))));

  // Szerokosc rosnie z liczba stringow — kazde zlacze = 20 px
  const W = Math.max(isHybrid ? 60 : 40, strings * 20 + 20);
  const cx = W / 2;
  const pvX = Array.from({ length: strings }, (_, i) => (i + 1) * 20);

  const rot = normRot(data.rotation);
  const box = boxDims(rot, W, H);

  // Uchwyty bazowe (uklad 0 0 W H)
  const base: BaseHandle[] = pvX.map((x, i) => ({
    id: `pv${i + 1}`, pos: Position.Top, x, y: 0, color: '#b91c1c',
  }));
  if (isHybrid) {
    base.push({ id: 'bat', pos: Position.Left, x: 0, y: 30, color: '#ea580c' });
    base.push({ id: 'ac1', pos: Position.Right, x: W, y: 20, color: '#1d4ed8' });
    base.push({ id: 'ac2', pos: Position.Right, x: W, y: 40, color: '#1d4ed8' });
  } else {
    base.push({ id: 'ac', pos: Position.Bottom, x: cx, y: H, color: '#1d4ed8' });
  }

  return (
    <div className={selected ? 'ring-2 ring-blue-500' : ''} style={{ width: box.w, height: box.h, position: 'relative' }}>
      {base.map((b) => {
        const r = rotHandle(b, rot, W, H);
        return (
          <Handle key={b.id} type="source" id={r.id} position={r.position}
            className="!w-1.5 !h-1.5" style={{ backgroundColor: r.color, left: r.left, top: r.top }} />
        );
      })}
      <svg width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} style={{ overflow: 'visible', display: 'block' }}>
        <text x={box.w / 2} y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label}</text>
        <g transform={gTransform(rot, W, H)}>
          {isHybrid ? (
            <>
              {pvX.map((x, i) => (
                <line key={i} x1={x} y1="0" x2={x} y2="6" stroke="#b91c1c" strokeWidth="1.5" />
              ))}
              <rect x="8" y="6" width={W - 16} height="48" rx="2" fill="white" stroke="#222" strokeWidth="1.5" />
              <line x1={cx - 12} y1="42" x2={cx + 12} y2="18" stroke="#222" strokeWidth="1" />
              <text x={cx - 9} y="26" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#b91c1c">═</text>
              <text x={cx + 9} y="44" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1d4ed8">∼</text>
              <line x1="8" y1="30" x2="-2" y2="30" stroke="#ea580c" strokeWidth="1.5" />
              <text x="-4" y="27" textAnchor="end" fontSize="6" fill="#ea580c">BAT</text>
              <line x1={W - 8} y1="20" x2={W + 2} y2="20" stroke="#1d4ed8" strokeWidth="1.5" />
              <line x1={W - 8} y1="40" x2={W + 2} y2="40" stroke="#1d4ed8" strokeWidth="1.5" />
            </>
          ) : (
            <>
              {pvX.map((x, i) => (
                <line key={i} x1={x} y1="0" x2={x} y2="10" stroke="#b91c1c" strokeWidth="1.5" />
              ))}
              <rect x="8" y="10" width={W - 16} height="40" rx="2" fill="white" stroke="#222" strokeWidth="1.5" />
              <line x1={cx - 12} y1="44" x2={cx + 12} y2="16" stroke="#222" strokeWidth="1" />
              <text x={cx - 9} y="28" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#b91c1c">═</text>
              <text x={cx + 9} y="44" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1d4ed8">∼</text>
              <line x1={cx} y1="50" x2={cx} y2="60" stroke="#1d4ed8" strokeWidth="1.5" />
            </>
          )}
        </g>
        {desc && <text x={box.w / 2} y={box.h + 8} textAnchor="middle" fontSize="7" fill="#888">{desc}</text>}
      </svg>
    </div>
  );
}
