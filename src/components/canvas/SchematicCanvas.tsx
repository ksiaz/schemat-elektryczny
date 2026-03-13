import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useOnSelectionChange,
  useReactFlow,
  addEdge,
  type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback } from 'react';
import { useProjectStore, generateNextLabel } from '../../store/projectStore.ts';
import { nodeTypes } from '../../nodes/index.ts';
import { getSheetDimensions } from '../../utils/sheetDimensions.ts';
import { ELEMENT_DEFINITIONS } from '../../constants/index.ts';
import type { SchematicNodeData } from '../../types/index.ts';
import type { Node } from '@xyflow/react';

export function SchematicCanvas() {
  const {
    nodes, edges, schematicFormat,
    setEdges, addNode, pushHistory,
    setSelectedNodeId,
    onNodesChange, onEdgesChange,
  } = useProjectStore();

  const { screenToFlowPosition } = useReactFlow();
  const sheet = getSheetDimensions(schematicFormat);

  // Zaznaczenie wezla
  useOnSelectionChange({
    onChange: ({ nodes: selectedNodes }) => {
      setSelectedNodeId(selectedNodes.length === 1 ? selectedNodes[0].id : null);
    },
  });

  // Polaczenia
  const onConnect = useCallback((connection: Connection) => {
    pushHistory();
    setEdges(addEdge(connection, useProjectStore.getState().edges));
  }, [pushHistory, setEdges]);

  // Drag & drop z sidebar
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const elementId = event.dataTransfer.getData('application/schematic-element');
    if (!elementId) return;

    const definition = ELEMENT_DEFINITIONS.find((d) => d.id === elementId);
    if (!definition) return;

    // Przelicz pozycje ekranowa na wspolrzedne canvas
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    // Domyslne wartosci parametrow
    const parameters: Record<string, string | number> = {};
    for (const param of definition.parameters) {
      if (param.defaultValue !== undefined) {
        parameters[param.key] = param.defaultValue;
      }
    }

    const label = generateNextLabel(definition.designation) || definition.defaultLabel;

    const newNode: Node<SchematicNodeData> = {
      id: `${definition.nodeType}-${Date.now()}`,
      type: definition.nodeType,
      position,
      data: {
        label,
        elementId: definition.id,
        designation: definition.designation,
        parameters,
      },
    };

    // Rozdzielnice sa wieksze — ustaw rozmiar
    if (definition.nodeType === 'enclosure') {
      newNode.style = { width: 220, height: 160 };
    }

    // Sprawdz czy drop laduje na rozdzielnicy — jesli tak, ustaw parentId
    const currentNodes = useProjectStore.getState().nodes;
    const enclosure = currentNodes.find((n) => {
      if (n.type !== 'enclosure') return false;
      const w = (n.style?.width as number) ?? 220;
      const h = (n.style?.height as number) ?? 160;
      return (
        position.x > n.position.x &&
        position.x < n.position.x + w &&
        position.y > n.position.y &&
        position.y < n.position.y + h
      );
    });

    if (enclosure && definition.nodeType !== 'enclosure') {
      // Pozycja relatywna do rodzica
      newNode.position = {
        x: position.x - enclosure.position.x,
        y: position.y - enclosure.position.y,
      };
      newNode.parentId = enclosure.id;
      newNode.extent = 'parent';
    }

    addNode(newNode);
  }, [screenToFlowPosition, addNode]);

  return (
    <div className="flex-1 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[10, 10]}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.2}
        maxZoom={4}
        style={{ width: '100%', height: '100%' }}
      >
        <Background variant={BackgroundVariant.Dots} gap={10} size={1} color="#ddd" />
        <Controls />
        <MiniMap
          pannable
          zoomable
          className="!bg-white !border !border-gray-200"
        />

        {/* Uproszczona ramka arkusza — pelna w Etapie 8 */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: sheet.widthPx,
            height: sheet.heightPx,
            pointerEvents: 'none',
            overflow: 'visible',
          }}
        >
          <rect
            x={0} y={0}
            width={sheet.widthPx} height={sheet.heightPx}
            fill="white" stroke="#999" strokeWidth="1"
          />
          <rect
            x={sheet.workAreaX} y={sheet.workAreaY}
            width={sheet.workAreaWidth} height={sheet.workAreaHeight}
            fill="none" stroke="#ccc" strokeWidth="0.5" strokeDasharray="4,4"
          />
        </svg>
      </ReactFlow>
    </div>
  );
}
