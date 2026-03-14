import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type PvStringNodeType = Node<SchematicNodeData, 'pvString'>;

// Panel/String PV — prostokat z opisem (styl blokowy, jak na schematach pogladowych)
export function PvStringNode({ data, selected }: NodeProps<PvStringNodeType>) {
  const panelCount = data.parameters.panelCount || '';
  const model = data.parameters.model || '';

  return (
    <div
      className={`flex flex-col items-center justify-center text-center px-3 py-2 min-w-[100px] ${
        selected ? 'ring-2 ring-blue-500' : ''
      }`}
      style={{
        border: '1.5px solid #e0e0e0',
        borderRadius: '2px',
        background: '#252540',
      }}
    >
      <Handle type="source" position={Position.Bottom} id="out" className="!bg-red-500 !w-2 !h-2" />

      {/* Opis: ilosc x model */}
      <div className="text-xs text-gray-200 leading-tight">
        {data.label}
      </div>
      {(panelCount || model) && (
        <div className="text-[10px] text-gray-400 leading-tight mt-0.5">
          {panelCount ? `${String(panelCount)} szt.` : ''}
          {model ? ` ${String(model)}` : ''}
        </div>
      )}
    </div>
  );
}
