import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useReactFlow,
  addEdge,
  type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback } from 'react';
import { useProjectStore } from '../../store/projectStore.ts';
import { layoutNodeTypes } from '../../nodes/layoutNodeTypes.ts';
import { edgeTypes } from '../../edges/index.ts';
import { LAYOUT_ELEMENT_DEFINITIONS } from '../../constants/layoutElements.ts';
import type { SchematicNodeData } from '../../types/index.ts';
import type { Node } from '@xyflow/react';

export function LayoutCanvas() {
  const {
    layoutNodes, layoutEdges,
    setLayoutNodes, setLayoutEdges,
    onLayoutNodesChange, onLayoutEdgesChange,
    pushLayoutHistory,
  } = useProjectStore();

  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback((connection: Connection) => {
    pushLayoutHistory();
    setLayoutEdges(addEdge({ ...connection, type: 'cable' }, useProjectStore.getState().layoutEdges));
  }, [pushLayoutHistory, setLayoutEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const elementId = event.dataTransfer.getData('application/layout-element');
    if (!elementId) return;

    const definition = LAYOUT_ELEMENT_DEFINITIONS.find((d) => d.id === elementId);
    if (!definition) return;

    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

    const parameters: Record<string, string | number> = {};
    for (const param of definition.parameters) {
      if (param.defaultValue !== undefined) {
        parameters[param.key] = param.defaultValue;
      }
    }

    const newNode: Node<SchematicNodeData> = {
      id: `layout-${definition.nodeType}-${Date.now()}`,
      type: definition.nodeType,
      position,
      data: {
        label: definition.defaultLabel,
        elementId: definition.id,
        designation: definition.designation,
        parameters,
      },
    };

    // Budynek i dach sa wieksze
    if (definition.nodeType === 'building') {
      newNode.style = { width: 300, height: 200 };
    }

    pushLayoutHistory();
    setLayoutNodes([...useProjectStore.getState().layoutNodes, newNode]);
  }, [screenToFlowPosition, pushLayoutHistory, setLayoutNodes]);

  return (
    <div className="flex-1 relative">
      <ReactFlow
        nodes={layoutNodes}
        edges={layoutEdges}
        onNodesChange={onLayoutNodesChange}
        onEdgesChange={onLayoutEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={layoutNodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: 'cable' }}
        fitView
        snapToGrid
        snapGrid={[10, 10]}
        minZoom={0.2}
        maxZoom={4}
        style={{ width: '100%', height: '100%' }}
      >
        <Background variant={BackgroundVariant.Lines} gap={20} size={1} color="#e8e8e8" />
        <Background id="bg-dots" variant={BackgroundVariant.Dots} gap={10} size={1} color="#ccc" />
        <Controls />
        <MiniMap pannable zoomable className="!bg-white !border !border-gray-200" />
      </ReactFlow>
    </div>
  );
}
