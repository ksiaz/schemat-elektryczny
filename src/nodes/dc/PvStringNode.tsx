import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type PvStringNodeType = Node<SchematicNodeData, 'pvString'>;

// String PV — jednokreskowy styl SolarEdge
export function PvStringNode({ data, selected }: NodeProps<PvStringNodeType>) {
  const panelCount = data.parameters.panelCount || '';
  const model = data.parameters.model || '';

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      {/* Port wyjsciowy (do falownika) */}
      <Handle type="source" position={Position.Bottom} id="out" className="!bg-red-500 !w-2 !h-2" />

      <svg width="80" height="60" viewBox="0 0 80 60">
        {/* Symbol paneli — prostokat z przekatna (cela PV) */}
        <rect x="10" y="5" width="60" height="35" fill="none" stroke="black" strokeWidth="1.5" />
        <line x1="10" y1="5" x2="70" y2="40" stroke="black" strokeWidth="0.8" />
        {/* + i - */}
        <text x="18" y="18" fontSize="10" fontWeight="bold">+</text>
        <text x="55" y="35" fontSize="10" fontWeight="bold">−</text>
        {/* Linia wyjsciowa */}
        <line x1="40" y1="40" x2="40" y2="60" stroke="#FF0000" strokeWidth="2" />
      </svg>

      <div className="text-xs font-bold mt-1 text-red-600">{data.label}</div>
      {(panelCount || model) && (
        <div className="text-[10px] text-gray-500">
          {panelCount && `${String(panelCount)}x `}{String(model)}
        </div>
      )}
    </div>
  );
}
