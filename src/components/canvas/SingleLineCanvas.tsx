import {
  ReactFlow, Background, BackgroundVariant, Controls, MiniMap,
  useOnSelectionChange, useReactFlow, useUpdateNodeInternals, ConnectionMode,
  type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useRef } from 'react';
import { useProjectStore, generateNextLabel } from '../../store/projectStore.ts';
import { nodeTypes } from '../../nodes/index.ts';
import { edgeTypes } from '../../edges/index.ts';
import { DrawingFrame } from '../drawing-frame/DrawingFrame.tsx';
import { WaypointOverlay } from './WaypointOverlay.tsx';
import { SINGLE_LINE_ELEMENT_DEFINITIONS } from '../../constants/singleLineElements.ts';
import type { SchematicNodeData } from '../../types/index.ts';
import type { Node } from '@xyflow/react';

export function SingleLineCanvas() {
  const {
    singleLineNodes, singleLineEdges,
    setSingleLineEdges, addNode, pushSingleLineHistory,
    setSelectedNodeId, setSelectedEdgeId,
    updateEdgeData,
    onSingleLineNodesChange, onSingleLineEdgesChange,
  } = useProjectStore();

  const { screenToFlowPosition } = useReactFlow();

  // Po obrocie symbolu uchwyty zmieniaja krawedz — wymus przeliczenie pozycji
  // uchwytow, aby podlaczone kable snapowaly do nowej lokalizacji punktu.
  const updateNodeInternals = useUpdateNodeInternals();
  const prevRot = useRef<Record<string, number>>({});
  useEffect(() => {
    for (const n of singleLineNodes) {
      const rot = Number((n.data as SchematicNodeData).rotation ?? 0);
      if (prevRot.current[n.id] !== rot) {
        prevRot.current[n.id] = rot;
        updateNodeInternals(n.id);
      }
    }
  }, [singleLineNodes, updateNodeInternals]);

  useOnSelectionChange({
    onChange: ({ nodes: sel, edges: selE }) => {
      setSelectedNodeId(sel.length === 1 ? sel[0].id : null);
      setSelectedEdgeId(selE.length === 1 ? selE[0].id : null);
    },
  });

  const onConnect = useCallback((connection: Connection) => {
    pushSingleLineHistory();
    const newEdge = {
      id: `e-${connection.source}-${connection.sourceHandle ?? ''}-${connection.target}-${connection.targetHandle ?? ''}-${Date.now()}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      type: 'singleLineCable',
      data: { cableType: 'YDY', cores: 5, crossSection: 6, current: 'AC' as const },
    };
    setSingleLineEdges([...useProjectStore.getState().singleLineEdges, newEdge]);
  }, [pushSingleLineHistory, setSingleLineEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const elementId = event.dataTransfer.getData('application/sld-element');
    if (!elementId) return;

    const definition = SINGLE_LINE_ELEMENT_DEFINITIONS.find((d) => d.id === elementId);
    if (!definition) return;

    const GRID = 20;
    const raw = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const position = {
      x: Math.round(raw.x / GRID) * GRID,
      y: Math.round(raw.y / GRID) * GRID,
    };

    const parameters: Record<string, string | number> = {};
    for (const param of definition.parameters) {
      if (param.defaultValue !== undefined) parameters[param.key] = param.defaultValue;
    }

    const label = definition.designation
      ? (generateNextLabel(definition.designation) || definition.defaultLabel)
      : definition.defaultLabel;

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

    addNode(newNode);
  }, [screenToFlowPosition, addNode]);

  // Dwuklik na edge — dodaj punkt zalamania (manual routing only)
  const onEdgeDoubleClick = useCallback((evt: React.MouseEvent, edge: { id: string; data?: Record<string, unknown> }) => {
    const GRID = 10;
    const raw = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });
    const snapped = { x: Math.round(raw.x / GRID) * GRID, y: Math.round(raw.y / GRID) * GRID };
    const existing = (edge.data?.waypoints as Array<{ x: number; y: number }>) ?? [];
    updateEdgeData(edge.id, { waypoints: [...existing, snapped] });
  }, [screenToFlowPosition, updateEdgeData]);

  return (
    <div className="flex-1 relative">
      <ReactFlow
        nodes={singleLineNodes}
        edges={singleLineEdges}
        onNodesChange={onSingleLineNodesChange}
        onEdgesChange={onSingleLineEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onEdgeDoubleClick={onEdgeDoubleClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: 'singleLineCable' }}
        connectionMode={ConnectionMode.Loose}
        isValidConnection={() => true}
        fitView
        snapToGrid
        snapGrid={[10, 10]}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.1}
        maxZoom={4}
        style={{ width: '100%', height: '100%' }}
      >
        <Background variant={BackgroundVariant.Lines} gap={20} size={1} color="#e8e8e8" />
        <Background id="bg-dots" variant={BackgroundVariant.Dots} gap={10} size={1} color="#ccc" />
        <Controls />
        <MiniMap pannable zoomable className="!bg-white !border !border-gray-200" />
        <DrawingFrame />
      </ReactFlow>
      <WaypointOverlay />
    </div>
  );
}
