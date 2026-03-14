import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type InverterNodeType = Node<SchematicNodeData, 'inverter'>;

// Falownik DC/AC wg IEC 60617
// Prostokat, lewa strona: symbol DC (= dwie rownolegale linie), prawa: AC (sinusoida ~)
// Strzalka od DC do AC wskazujaca kierunek konwersji
export function InverterNode({ data, selected }: NodeProps<InverterNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="dc-in" className="!bg-red-500 !w-2 !h-2" />

      <svg width="64" height="54" viewBox="0 0 64 54">
        {/* Linia wejsciowa DC */}
        <line x1="32" y1="0" x2="32" y2="6" stroke="white" strokeWidth="1.5" />

        {/* Prostokat obudowy */}
        <rect x="4" y="6" width="56" height="36" fill="none" stroke="white" strokeWidth="1.5" rx="1" />

        {/* Linia podzialu (przerywana) */}
        <line x1="32" y1="9" x2="32" y2="39" stroke="white" strokeWidth="0.8" strokeDasharray="3,2" />

        {/* Symbol DC po lewej: = (dwie rownolegle linie) */}
        <line x1="14" y1="20" x2="24" y2="20" stroke="white" strokeWidth="1.5" />
        <line x1="14" y1="24" x2="24" y2="24" stroke="white" strokeWidth="1.5" />

        {/* Symbol AC po prawej: sinusoida ~ */}
        <path d="M 38,22 Q 42,16 46,22 Q 50,28 54,22" fill="none" stroke="white" strokeWidth="1.5" />

        {/* Strzalka kierunku konwersji DC→AC */}
        <line x1="20" y1="33" x2="44" y2="33" stroke="white" strokeWidth="1" />
        <polygon points="42,30 48,33 42,36" fill="white" />

        {/* Linia wyjsciowa AC */}
        <line x1="32" y1="42" x2="32" y2="54" stroke="white" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold mt-1 text-gray-200">{data.label}</div>
      {data.parameters.model && (
        <div className="text-[10px] text-gray-400">{String(data.parameters.model)}</div>
      )}
      {data.parameters.power && (
        <div className="text-[10px] text-gray-400">{String(data.parameters.power)} kW</div>
      )}

      <Handle type="source" position={Position.Bottom} id="ac-out" className="!bg-gray-500 !w-2 !h-2" />
    </div>
  );
}
