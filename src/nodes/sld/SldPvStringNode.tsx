import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldPvString'>;

export function SldPvStringNode({ data, selected }: NodeProps<T>) {
  const n = data.parameters.panelCount ?? 8;
  const voc = data.parameters.voc ?? '';
  const isc = data.parameters.isc ?? '';
  const mpp = data.parameters.mpp ?? '';
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 80, height: 50 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 40 }} />
      <svg width="70" height="50" viewBox="0 0 70 50" style={{ overflow: 'visible' }}>
        <text x="35" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label}</text>
        <line x1="35" y1="0" x2="35" y2="6" stroke="#222" strokeWidth="1.5" />
        <rect x="14" y="6" width="42" height="28" fill="#eef" stroke="#222" strokeWidth="1.5" />
        <line x1="14" y1="6" x2="56" y2="34" stroke="#222" strokeWidth="0.8" />
        <line x1="56" y1="6" x2="14" y2="34" stroke="#222" strokeWidth="0.8" />
        <text x="35" y="24" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#222">{n}×</text>
        <line x1="35" y1="34" x2="35" y2="50" stroke="#222" strokeWidth="1.5" />
        <text x="35" y="58" textAnchor="middle" fontSize="7" fill="#888">
          {voc && `Voc=${voc}V`} {isc && `Isc=${isc}A`}
        </text>
        {mpp && <text x="35" y="68" textAnchor="middle" fontSize="7" fill="#888">{`Pmpp=${mpp}W`}</text>}
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 40 }} />
    </div>
  );
}
