import { useProjectStore } from '../../store/projectStore.ts';
import { ELEMENT_DEFINITIONS } from '../../constants/index.ts';

export function PropertiesPanel() {
  const { selectedNodeId, nodes } = useProjectStore();

  const selectedNode = selectedNodeId
    ? nodes.find((n) => n.id === selectedNodeId)
    : null;

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

      <div className="space-y-2 text-sm">
        <div>
          <span className="text-gray-500">Typ:</span>{' '}
          <span className="font-medium">{definition?.name ?? '—'}</span>
        </div>
        <div>
          <span className="text-gray-500">Etykieta:</span>{' '}
          <span className="font-medium">{selectedNode.data.label}</span>
        </div>
        <div>
          <span className="text-gray-500">Oznaczenie:</span>{' '}
          <span className="font-mono">{selectedNode.data.designation || '—'}</span>
        </div>

        {/* Parametry — read-only; edycja w Etapie 4 */}
        {definition?.parameters.map((param) => (
          <div key={param.key}>
            <span className="text-gray-500">{param.label}:</span>{' '}
            <span className="font-medium">
              {String(selectedNode.data.parameters[param.key] ?? '—')}
              {param.unit && selectedNode.data.parameters[param.key] ? ` ${param.unit}` : ''}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
