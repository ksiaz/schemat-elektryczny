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

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: W, height: H }}>
      {pvX.map((x, i) => (
        <Handle key={`pv${i}`} type="source" position={Position.Top} id={`pv${i + 1}`}
          className="!w-1.5 !h-1.5" style={{ backgroundColor: '#b91c1c', left: x }} />
      ))}
      {isHybrid && (
        <Handle type="source" position={Position.Left} id="pe" className="!w-1.5 !h-1.5"
          style={{ backgroundColor: '#228B22', top: 30 }} />
      )}

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
        <text x={cx} y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'U1'}</text>

        {/* doprowadzenia PV (DC) */}
        {pvX.map((x, i) => (
          <line key={i} x1={x} y1="0" x2={x} y2="10" stroke="#b91c1c" strokeWidth="1.5" />
        ))}

        {/* korpus */}
        <rect x="8" y="10" width={W - 16} height="40" rx="2" fill="white" stroke="#222" strokeWidth="1.5" />
        <line x1={cx - 12} y1="44" x2={cx + 12} y2="16" stroke="#222" strokeWidth="1" />
        <text x={cx - 9} y="28" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#b91c1c">═</text>
        <text x={cx + 9} y="44" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1d4ed8">∼</text>

        {/* punkt uziemienia PE (tylko hybryda) */}
        {isHybrid && (
          <>
            <line x1="8" y1="30" x2="-2" y2="30" stroke="#228B22" strokeWidth="1.5" />
            <text x="-4" y="27" textAnchor="end" fontSize="6" fill="#228B22">PE</text>
          </>
        )}

        {/* odprowadzenia AC */}
        {isHybrid ? (
          <>
            <line x1="20" y1="50" x2="20" y2="60" stroke="#1d4ed8" strokeWidth="1.5" />
            <line x1={W - 20} y1="50" x2={W - 20} y2="60" stroke="#1d4ed8" strokeWidth="1.5" />
          </>
        ) : (
          <line x1={cx} y1="50" x2={cx} y2="60" stroke="#1d4ed8" strokeWidth="1.5" />
        )}

        {desc && <text x={cx} y="68" textAnchor="middle" fontSize="7" fill="#888">{desc}</text>}
      </svg>

      {isHybrid ? (
        <>
          <Handle type="source" position={Position.Bottom} id="ac1" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#1d4ed8', left: 20 }} />
          <Handle type="source" position={Position.Bottom} id="ac2" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#1d4ed8', left: W - 20 }} />
        </>
      ) : (
        <Handle type="source" position={Position.Bottom} id="ac" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#1d4ed8', left: cx }} />
      )}
    </div>
  );
}
