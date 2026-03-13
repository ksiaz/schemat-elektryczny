import { useProjectStore } from '../../store/projectStore.ts';
import { ELEMENT_DEFINITIONS } from '../../constants/index.ts';
import type { ParameterDefinition } from '../../types/index.ts';

// Pola edycji przewodu (wspolne dla edge'ow)
const EDGE_FIELDS: Record<string, ParameterDefinition[]> = {
  multilineAc: [
    { key: 'cableType', label: 'Typ kabla', type: 'text' },
    { key: 'cableSection', label: 'Przekrój', type: 'text' },
    { key: 'cableLength', label: 'Długość', type: 'text' },
  ],
  dcLine: [
    { key: 'stringLabel', label: 'String', type: 'text' },
    { key: 'cableType', label: 'Typ kabla', type: 'text' },
    { key: 'cableSection', label: 'Przekrój', type: 'text' },
  ],
  cable: [
    { key: 'cableType', label: 'Typ kabla', type: 'text' },
    { key: 'cableSection', label: 'Przekrój', type: 'text' },
    { key: 'cableLength', label: 'Długość', type: 'text' },
  ],
};

function ParameterInput({
  param,
  value,
  onChange,
}: {
  param: ParameterDefinition;
  value: string | number;
  onChange: (val: string | number) => void;
}) {
  if (param.type === 'select' && param.options) {
    return (
      <select
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-1.5 py-1 text-xs border border-gray-300 rounded bg-white focus:border-blue-500 focus:outline-none"
      >
        <option value="">—</option>
        {param.options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={param.type === 'number' ? 'number' : 'text'}
      value={value ?? ''}
      onChange={(e) => {
        const val = param.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value;
        onChange(val);
      }}
      placeholder={param.unit ? `[${param.unit}]` : ''}
      className="w-full px-1.5 py-1 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
    />
  );
}

export function PropertiesPanel() {
  const {
    selectedNodeId, selectedEdgeId,
    nodes, edges,
    updateNodeData, updateEdgeData,
  } = useProjectStore();

  const selectedNode = selectedNodeId
    ? nodes.find((n) => n.id === selectedNodeId)
    : null;

  const selectedEdge = selectedEdgeId
    ? edges.find((e) => e.id === selectedEdgeId)
    : null;

  // --- Panel dla edge (polaczenie/przewod) ---
  if (selectedEdge) {
    const edgeFields = EDGE_FIELDS[selectedEdge.type ?? 'cable'] ?? EDGE_FIELDS.cable;
    const edgeData = (selectedEdge.data ?? {}) as Record<string, unknown>;

    return (
      <aside className="w-60 bg-gray-50 border-l border-gray-200 p-3 overflow-y-auto">
        <h2 className="text-sm font-bold text-gray-700 mb-2">Połączenie</h2>

        <div className="space-y-2">
          <div className="text-xs text-gray-500">
            Typ: <span className="font-medium text-gray-700">
              {selectedEdge.type === 'multilineAc' ? 'AC 5-żyłowy' :
               selectedEdge.type === 'dcLine' ? 'DC jednokreskowy' : 'Kabel'}
            </span>
          </div>

          {edgeFields.map((field) => (
            <div key={field.key}>
              <label className="block text-xs text-gray-500 mb-0.5">
                {field.label}
                {field.unit && <span className="text-gray-400"> [{field.unit}]</span>}
              </label>
              <ParameterInput
                param={field}
                value={String(edgeData[field.key] ?? '')}
                onChange={(val) => updateEdgeData(selectedEdge.id, { [field.key]: val })}
              />
            </div>
          ))}
        </div>
      </aside>
    );
  }

  // --- Panel dla wezla ---
  if (!selectedNode) {
    return (
      <aside className="w-60 bg-gray-50 border-l border-gray-200 p-3">
        <p className="text-sm text-gray-400 italic">
          Zaznacz element na schemacie, aby zobaczyć jego właściwości.
        </p>
      </aside>
    );
  }

  const definition = ELEMENT_DEFINITIONS.find(
    (d) => d.id === selectedNode.data.elementId
  );

  return (
    <aside className="w-60 bg-gray-50 border-l border-gray-200 p-3 overflow-y-auto">
      <h2 className="text-sm font-bold text-gray-700 mb-2">Właściwości</h2>

      <div className="space-y-2">
        {/* Typ elementu (read-only) */}
        <div className="text-xs text-gray-500">
          Typ: <span className="font-medium text-gray-700">{definition?.name ?? '—'}</span>
        </div>

        {/* Etykieta — edytowalna */}
        <div>
          <label className="block text-xs text-gray-500 mb-0.5">Etykieta</label>
          <input
            type="text"
            value={selectedNode.data.label}
            onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
            className="w-full px-1.5 py-1 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none font-bold"
          />
        </div>

        {/* Oznaczenie (read-only) */}
        {selectedNode.data.designation && (
          <div className="text-xs text-gray-500">
            Oznaczenie: <span className="font-mono">{selectedNode.data.designation}</span>
          </div>
        )}

        {/* Parametry — edytowalne */}
        {definition?.parameters.map((param) => (
          <div key={param.key}>
            <label className="block text-xs text-gray-500 mb-0.5">
              {param.label}
              {param.unit && <span className="text-gray-400"> [{param.unit}]</span>}
            </label>
            <ParameterInput
              param={param}
              value={selectedNode.data.parameters[param.key] ?? ''}
              onChange={(val) => {
                const updatedParams = { ...selectedNode.data.parameters, [param.key]: val };
                updateNodeData(selectedNode.id, { parameters: updatedParams });
              }}
            />
          </div>
        ))}
      </div>
    </aside>
  );
}
