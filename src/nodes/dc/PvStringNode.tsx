import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type PvStringNodeType = Node<SchematicNodeData, 'pvString'>;

// Panel/String PV — prostokat z trojkatem (symbol generatora PV)
// Styl jak na schematach blokowych polskich instalatorow
export function PvStringNode({ data, selected }: NodeProps<PvStringNodeType>) {
  const panelCount = data.parameters.panelCount || '';
  const model = data.parameters.model || '';

  return (
    <div className={`flex flex-row items-center gap-2 ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      {/* Prostokat z trojkatem — symbol generatora PV */}
      <svg width="80" height="60" viewBox="0 0 80 60">
        <rect x="2" y="2" width="76" height="56" fill="none" stroke="white" strokeWidth="1.5" />
        {/* Trojkat — symbol generatora */}
        <polygon points="20,48 60,48 40,12" fill="none" stroke="white" strokeWidth="1.2" />
        {/* Kreski promieniowania (gora trojkata) */}
        <line x1="30" y1="8" x2="26" y2="2" stroke="white" strokeWidth="0.8" />
        <line x1="40" y1="5" x2="40" y2="0" stroke="white" strokeWidth="0.8" />
      </svg>

      {/* Opis obok symbolu */}
      <div className="flex flex-col text-left">
        <div className="text-xs text-gray-200 leading-tight">
          {panelCount && `${String(panelCount)} szt.`}
        </div>
        {model && (
          <div className="text-[10px] text-gray-400 leading-tight">{String(model)}</div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-red-500 !w-2 !h-2" />
      <Handle type="source" position={Position.Right} id="out-right" className="!bg-red-500 !w-2 !h-2" />
    </div>
  );
}
