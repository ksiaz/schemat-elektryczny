import { Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { AcHandles } from './AcHandles.tsx';

type MainSwitchNodeType = Node<SchematicNodeData, 'mainSwitch'>;

export function MainSwitchNode({ data, selected }: NodeProps<MainSwitchNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <AcHandles type="target" position={Position.Top} prefix="in" />
      <svg width="70" height="50" viewBox="0 0 70 50">
        <line x1="35" y1="0" x2="35" y2="14" stroke="#333" strokeWidth="1.5" />
        <line x1="31" y1="14" x2="39" y2="14" stroke="#333" strokeWidth="1.5" />
        <line x1="35" y1="14" x2="47" y2="32" stroke="#333" strokeWidth="2" />
        <circle cx="35" cy="35" r="2" fill="#333" />
        <line x1="35" y1="37" x2="35" y2="50" stroke="#333" strokeWidth="1.5" />
      </svg>
      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      {data.parameters.ratingCurrent && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.ratingCurrent)}A</div>
      )}
      <AcHandles type="source" position={Position.Bottom} prefix="out" />
    </div>
  );
}
