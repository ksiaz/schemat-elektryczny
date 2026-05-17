import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldInverter'>;

export function SldInverterNode({ data, selected }: NodeProps<T>) {
  const typ = String(data.parameters.type ?? 'string');
  const P = data.parameters.power ? `${data.parameters.power}kW` : '';
  const mppt = data.parameters.mppt ?? '';

  // --- Falownik hybrydowy: 2 wejscia PV, 2 we/wy AC, punkt uziemienia PE ---
  if (typ === 'hybrid') {
    return (
      <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 60, height: 60 }}>
        <Handle type="source" position={Position.Top} id="pv1" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#b91c1c', left: 20 }} />
        <Handle type="source" position={Position.Top} id="pv2" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#b91c1c', left: 40 }} />
        <Handle type="source" position={Position.Left} id="pe" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#228B22', top: 30 }} />
        <svg width="50" height="60" viewBox="0 0 50 60" style={{ overflow: 'visible' }}>
          <text x="25" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'U1'}</text>
          {/* 2 doprowadzenia PV (DC) */}
          <line x1="15" y1="0" x2="15" y2="8" stroke="#b91c1c" strokeWidth="1.5" />
          <line x1="35" y1="0" x2="35" y2="8" stroke="#b91c1c" strokeWidth="1.5" />
          {/* korpus */}
          <rect x="6" y="8" width="38" height="40" rx="2" fill="white" stroke="#222" strokeWidth="1.5" />
          <line x1="10" y1="44" x2="40" y2="12" stroke="#222" strokeWidth="1" />
          <text x="16" y="24" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#b91c1c">═</text>
          <text x="34" y="42" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1d4ed8">∼</text>
          {/* punkt uziemienia PE */}
          <line x1="6" y1="30" x2="-4" y2="30" stroke="#228B22" strokeWidth="1.5" />
          <text x="-6" y="27" textAnchor="end" fontSize="6" fill="#228B22">PE</text>
          {/* 2 odprowadzenia we/wy AC */}
          <line x1="15" y1="48" x2="15" y2="60" stroke="#1d4ed8" strokeWidth="1.5" />
          <line x1="35" y1="48" x2="35" y2="60" stroke="#1d4ed8" strokeWidth="1.5" />
          <text x="25" y="68" textAnchor="middle" fontSize="7" fill="#888">hybryda {P} {mppt && `${mppt}×MPPT`}</text>
        </svg>
        <Handle type="source" position={Position.Bottom} id="ac1" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#1d4ed8', left: 20 }} />
        <Handle type="source" position={Position.Bottom} id="ac2" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#1d4ed8', left: 40 }} />
      </div>
    );
  }

  // --- Falownik stringowy / mikro: 1 wejscie DC, 1 wyjscie AC ---
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 60, height: 60 }}>
      <Handle type="source" position={Position.Top} id="dc" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#b91c1c', left: 30 }} />
      <svg width="50" height="60" viewBox="0 0 50 60" style={{ overflow: 'visible' }}>
        <text x="25" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'U1'}</text>
        <rect x="5" y="6" width="40" height="48" fill="white" stroke="#222" strokeWidth="1.5" />
        <line x1="10" y1="30" x2="40" y2="30" stroke="#222" strokeWidth="1" />
        <text x="15" y="22" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#b91c1c">═</text>
        <text x="35" y="46" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1d4ed8">∼</text>
        <line x1="20" y1="30" x2="30" y2="30" stroke="#222" strokeWidth="1.5" />
        <text x="25" y="66" textAnchor="middle" fontSize="7" fill="#888">{typ} {P} {mppt && `MPPT×${mppt}`}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="ac" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#1d4ed8', left: 30 }} />
    </div>
  );
}
