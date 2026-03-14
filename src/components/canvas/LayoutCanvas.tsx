import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useReactFlow,
  useOnSelectionChange,
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
    setSelectedNodeId, setSelectedEdgeId,
  } = useProjectStore();

  useOnSelectionChange({
    onChange: ({ nodes: sel, edges: selEdges }) => {
      setSelectedNodeId(sel.length === 1 ? sel[0].id : null);
      setSelectedEdgeId(selEdges.length === 1 ? selEdges[0].id : null);
    },
  });

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

    const GRID = 50; // 1m = 50px
    const raw = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const position = { x: Math.round(raw.x / GRID) * GRID, y: Math.round(raw.y / GRID) * GRID };

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

    // Rozmiary poczatkowe
    if (definition.nodeType === 'building') {
      newNode.style = { width: 150, height: 100 };
    } else if (definition.nodeType === 'layoutLine') {
      const isH = parameters.orientation === 'pozioma';
      newNode.style = isH ? { width: 200, height: 4 } : { width: 4, height: 200 };
    } else if (definition.nodeType === 'ruler') {
      const isH = parameters.orientation === 'pozioma';
      newNode.style = isH ? { width: 50, height: 20 } : { width: 20, height: 50 };
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
        snapGrid={[50, 50]}
        minZoom={0.2}
        maxZoom={4}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Siatka 1m = 50px */}
        <Background variant={BackgroundVariant.Lines} gap={50} size={1} color="#ddd" />
        <Background id="bg-sub" variant={BackgroundVariant.Lines} gap={250} size={1} color="#bbb" />
        <Controls />
        <MiniMap pannable zoomable className="!bg-white !border !border-gray-200" />
      </ReactFlow>
    </div>
  );
}
