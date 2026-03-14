import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type PvStringNodeType = Node<SchematicNodeData, 'pvString'>;

// Panel/String PV wg IEC 60617
// Prostokat z przekatna (cela fotowoltaiczna) + oznaczenia + i -
export function PvStringNode({ data, selected }: NodeProps<PvStringNodeType>) {
  const panelCount = data.parameters.panelCount || '';
  const model = data.parameters.model || '';

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="source" position={Position.Bottom} id="out" className="!bg-red-500 !w-2 !h-2" />

      <svg width="60" height="55" viewBox="0 0 60 55">
        {/* Prostokat celi PV */}
        <rect x="8" y="5" width="44" height="30" fill="none" stroke="white" strokeWidth="1.5" />
        {/* Przekatna — symbol celi fotowoltaicznej */}
        <line x1="8" y1="35" x2="52" y2="5" stroke="white" strokeWidth="0.8" />
        {/* + u gory */}
        <text x="14" y="16" fontSize="10" fill="white" fontWeight="bold">+</text>
        {/* - u dolu */}
        <text x="42" y="30" fontSize="12" fill="white" fontWeight="bold">−</text>
        {/* Strzalki promieniowania slonecznego */}
        <line x1="20" y1="40" x2="14" y2="48" stroke="#facc15" strokeWidth="1" />
        <polygon points="14,48 17,46 15,44" fill="#facc15" />
        <line x1="30" y1="40" x2="24" y2="48" stroke="#facc15" strokeWidth="1" />
        <polygon points="24,48 27,46 25,44" fill="#facc15" />
      </svg>

      <div className="text-xs font-bold mt-1 text-red-400">{data.label}</div>
      {(panelCount || model) && (
        <div className="text-[10px] text-gray-400">
          {panelCount && `${String(panelCount)}x `}{String(model)}
        </div>
      )}
    </div>
  );
}
