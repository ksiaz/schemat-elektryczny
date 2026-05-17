import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldDcDisconnect'>;

export function SldDcDisconnectNode({ data, selected }: NodeProps<T>) {
  const poles = String(data.parameters.poles ?? '2P');
  const In = data.parameters.ratingCurrent ? `${data.parameters.ratingCurrent}A` : '';
  const Un = data.parameters.ratingVoltage ? `${data.parameters.ratingVoltage}V` : '';
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 60, height: 50 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 30 }} />
      <svg width="50" height="50" viewBox="0 0 50 50" style={{ overflow: 'visible' }}>
        <text x="25" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'QS1'}</text>
        <line x1="25" y1="0" x2="25" y2="12" stroke="#222" strokeWidth="1.5" />
        <line x1="25" y1="12" x2="35" y2="28" stroke="#222" strokeWidth="2" />
        <circle cx="25" cy="12" r="1.5" fill="#222" />
        <circle cx="25" cy="28" r="1.5" fill="#222" />
        <text x="42" y="22" fontSize="9" fontWeight="bold" fill="#b91c1c">DC</text>
        <line x1="25" y1="28" x2="25" y2="50" stroke="#222" strokeWidth="1.5" />
        <text x="25" y="58" textAnchor="middle" fontSize="7" fill="#888">{poles} {In} {Un}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 30 }} />
    </div>
  );
}
