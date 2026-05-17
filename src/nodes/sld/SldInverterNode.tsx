import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldInverter'>;

export function SldInverterNode({ data, selected }: NodeProps<T>) {
  const typ = String(data.parameters.type ?? 'string');
  const desc = String(data.parameters.description ?? '');
  const isHybrid = typ === 'hybrid';

  // Liczba stringow PV — steruje liczba uchwytow wejsciowych (zlacz)
  const strings = Math.max(1, Math.min(8, Math.round(Number(data.parameters.strings ?? 2))));

  // Szerokosc rosnie z liczba stringow — kazde zlacze = 20 px, wszystko na siatce 20
  const W = Math.max(isHybrid ? 60 : 40, strings * 20 + 20);
  const H = 60;
  const cx = W / 2;

  // Uchwyty PV na gorze — x = 20, 40, 60, ...
  const pvX = Array.from({ length: strings }, (_, i) => (i + 1) * 20);

  // --- Falownik hybrydowy: PV gora, BAT lewa, AC + PE prawa ---
  if (isHybrid) {
    return (
      <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: W, height: H }}>
        {pvX.map((x, i) => (
          <Handle key={`pv${i}`} type="source" position={Position.Top} id={`pv${i + 1}`}
            className="!w-1.5 !h-1.5" style={{ backgroundColor: '#b91c1c', left: x }} />
        ))}
        <Handle type="source" position={Position.Left} id="bat" className="!w-1.5 !h-1.5"
          style={{ backgroundColor: '#ea580c', top: 30 }} />
        <Handle type="source" position={Position.Right} id="ac1" className="!w-1.5 !h-1.5"
          style={{ backgroundColor: '#1d4ed8', top: 20 }} />
        <Handle type="source" position={Position.Right} id="ac2" className="!w-1.5 !h-1.5"
          style={{ backgroundColor: '#1d4ed8', top: 40 }} />

        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
          <text x={cx} y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'U1'}</text>

          {/* doprowadzenia PV (DC) */}
          {pvX.map((x, i) => (
            <line key={i} x1={x} y1="0" x2={x} y2="6" stroke="#b91c1c" strokeWidth="1.5" />
          ))}

          {/* korpus */}
          <rect x="8" y="6" width={W - 16} height="48" rx="2" fill="white" stroke="#222" strokeWidth="1.5" />
          <line x1={cx - 12} y1="42" x2={cx + 12} y2="18" stroke="#222" strokeWidth="1" />
          <text x={cx - 9} y="26" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#b91c1c">═</text>
          <text x={cx + 9} y="44" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1d4ed8">∼</text>

          {/* wejscie baterii — lewa */}
          <line x1="8" y1="30" x2="-2" y2="30" stroke="#ea580c" strokeWidth="1.5" />
          <text x="-4" y="27" textAnchor="end" fontSize="6" fill="#ea580c">BAT</text>

          {/* we/wy AC — prawa */}
          <line x1={W - 8} y1="20" x2={W + 2} y2="20" stroke="#1d4ed8" strokeWidth="1.5" />
          <line x1={W - 8} y1="40" x2={W + 2} y2="40" stroke="#1d4ed8" strokeWidth="1.5" />

          {desc && <text x={cx} y="64" textAnchor="middle" fontSize="7" fill="#888">{desc}</text>}
        </svg>
      </div>
    );
  }

  // --- Falownik stringowy / mikro: PV gora, 1 wyjscie AC dol ---
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: W, height: H }}>
      {pvX.map((x, i) => (
        <Handle key={`pv${i}`} type="source" position={Position.Top} id={`pv${i + 1}`}
          className="!w-1.5 !h-1.5" style={{ backgroundColor: '#b91c1c', left: x }} />
      ))}

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
        <text x={cx} y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'U1'}</text>

        {pvX.map((x, i) => (
          <line key={i} x1={x} y1="0" x2={x} y2="10" stroke="#b91c1c" strokeWidth="1.5" />
        ))}

        <rect x="8" y="10" width={W - 16} height="40" rx="2" fill="white" stroke="#222" strokeWidth="1.5" />
        <line x1={cx - 12} y1="44" x2={cx + 12} y2="16" stroke="#222" strokeWidth="1" />
        <text x={cx - 9} y="28" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#b91c1c">═</text>
        <text x={cx + 9} y="44" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1d4ed8">∼</text>
        <line x1={cx} y1="50" x2={cx} y2="60" stroke="#1d4ed8" strokeWidth="1.5" />

        {desc && <text x={cx} y="68" textAnchor="middle" fontSize="7" fill="#888">{desc}</text>}
      </svg>

      <Handle type="source" position={Position.Bottom} id="ac" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#1d4ed8', left: cx }} />
    </div>
  );
}
