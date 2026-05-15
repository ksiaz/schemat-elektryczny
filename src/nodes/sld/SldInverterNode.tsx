import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldInverter'>;

export function SldInverterNode({ data, selected }: NodeProps<T>) {
  const typ = String(data.parameters.type ?? 'string');
  const P = data.parameters.power ? `${data.parameters.power}kW` : '';
  const mppt = data.parameters.mppt ?? '';
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 50, height: 60 }}>
      <Handle type="source" position={Position.Top} id="dc" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#b91c1c', left: 25 }} />
      <svg width="50" height="60" viewBox="0 0 50 60" style={{ overflow: 'visible' }}>
        <text x="25" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'U1'}</text>
        <rect x="5" y="6" width="40" height="48" fill="white" stroke="#222" strokeWidth="1.5" />
        <line x1="10" y1="30" x2="40" y2="30" stroke="#222" strokeWidth="1" />
        <text x="15" y="22" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#b91c1c">═</text>
        <text x="35" y="46" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1d4ed8">∼</text>
        <line x1="20" y1="30" x2="30" y2="30" stroke="#222" strokeWidth="1.5" />
        <text x="25" y="66" textAnchor="middle" fontSize="7" fill="#888">{typ} {P} {mppt && `MPPT×${mppt}`}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="ac" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#1d4ed8', left: 25 }} />
    </div>
  );
}
