import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldTransferSwitch'>;

// Przelacznik zasilania 1-0-2 — reczny przelacznik dwoch zrodel
export function SldTransferSwitchNode({ data, selected }: NodeProps<T>) {
  const poles = String(data.parameters.poles ?? '4P');
  const In = data.parameters.ratingCurrent ? `${data.parameters.ratingCurrent}A` : '';
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 60, height: 50 }}>
      <Handle type="source" position={Position.Top} id="in1" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 20 }} />
      <Handle type="source" position={Position.Top} id="in2" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 40 }} />
      <svg width="50" height="50" viewBox="0 0 50 50" style={{ overflow: 'visible' }}>
        <text x="25" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label}</text>
        {/* 2 zrodla — doprowadzenia + styki stale */}
        <line x1="15" y1="0" x2="15" y2="14" stroke="#222" strokeWidth="1.5" />
        <line x1="35" y1="0" x2="35" y2="14" stroke="#222" strokeWidth="1.5" />
        <circle cx="15" cy="15" r="1.8" fill="#222" />
        <circle cx="35" cy="15" r="1.8" fill="#222" />
        {/* etykiety pozycji 1 - 0 - 2 */}
        <text x="9" y="13" textAnchor="end" fontSize="7" fontWeight="bold" fill="#222">1</text>
        <text x="41" y="13" fontSize="7" fontWeight="bold" fill="#222">2</text>
        <text x="25" y="10" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#888">0</text>
        {/* mozliwe polozenia styku ruchomego */}
        <line x1="25" y1="18" x2="15" y2="16" stroke="#222" strokeWidth="0.6" strokeDasharray="2,1.5" />
        <line x1="25" y1="18" x2="35" y2="16" stroke="#222" strokeWidth="0.6" strokeDasharray="2,1.5" />
        {/* styk ruchomy w pozycji 0 */}
        <line x1="25" y1="36" x2="25" y2="17" stroke="#222" strokeWidth="2" />
        <circle cx="25" cy="36" r="2" fill="#222" />
        {/* wyjscie wspolne */}
        <line x1="25" y1="36" x2="25" y2="50" stroke="#222" strokeWidth="1.5" />
        <text x="25" y="58" textAnchor="middle" fontSize="7" fill="#888">{poles} {In}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 30 }} />
    </div>
  );
}
