import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useOnSelectionChange,
  useReactFlow,
  ConnectionMode,
  type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback } from 'react';
import { useProjectStore, generateNextLabel } from '../../store/projectStore.ts';
import { nodeTypes } from '../../nodes/index.ts';
import { edgeTypes } from '../../edges/index.ts';
import { DrawingFrame } from '../drawing-frame/DrawingFrame.tsx';
import { ELEMENT_DEFINITIONS } from '../../constants/index.ts';
import type { SchematicNodeData } from '../../types/index.ts';
import type { Node } from '@xyflow/react';

export function SchematicCanvas() {
  const {
    nodes, edges, edgeType, routingMode,
    setEdges, addNode, pushHistory,
    setSelectedNodeId, setSelectedEdgeId,
    updateEdgeData,
    onNodesChange, onEdgesChange,
  } = useProjectStore();

  const { screenToFlowPosition } = useReactFlow();

  // Zaznaczenie wezla lub edge
  useOnSelectionChange({
    onChange: ({ nodes: selectedNodes, edges: selectedEdges }) => {
      setSelectedNodeId(selectedNodes.length === 1 ? selectedNodes[0].id : null);
      setSelectedEdgeId(selectedEdges.length === 1 ? selectedEdges[0].id : null);
    },
  });

  // Polaczenia — typ edge z toolbara, bez limitu duplikatow
  const onConnect = useCallback((connection: Connection) => {
    pushHistory();
    const newEdge = {
      id: `e-${connection.source}-${connection.sourceHandle ?? ''}-${connection.target}-${connection.targetHandle ?? ''}-${Date.now()}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      type: edgeType,
      data: {},
    };
    setEdges([...useProjectStore.getState().edges, newEdge]);
  }, [pushHistory, setEdges, edgeType]);

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

    // Przelicz pozycje ekranowa na wspolrzedne canvas, snap do siatki 20px
    const GRID = 20;
    const raw = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const position = {
      x: Math.round(raw.x / GRID) * GRID,
      y: Math.round(raw.y / GRID) * GRID,
    };

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

  // Dwuklik na edge — dodaj punkt zalamania (tryb reczny)
  const onEdgeDoubleClick = useCallback((_event: React.MouseEvent, edge: { id: string; data?: Record<string, unknown> }) => {
    if (routingMode !== 'manual') return;

    const flowPosition = screenToFlowPosition({
      x: _event.clientX,
      y: _event.clientY,
    });

    const existingWaypoints = (edge.data?.waypoints as Array<{ x: number; y: number }>) ?? [];
    const newWaypoints = [...existingWaypoints, { x: flowPosition.x, y: flowPosition.y }];

    updateEdgeData(edge.id, { waypoints: newWaypoints });
  }, [routingMode, screenToFlowPosition, updateEdgeData]);

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
        onEdgeDoubleClick={onEdgeDoubleClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: 'multilineAc' }}
        connectionMode={ConnectionMode.Loose}
        isValidConnection={() => true}
        fitView
        snapToGrid
        snapGrid={[10, 10]}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.2}
        maxZoom={4}
        style={{ width: '100%', height: '100%' }}
      >
        <Background variant={BackgroundVariant.Lines} gap={20} size={1} color="#e8e8e8" />
        <Background id="bg-dots" variant={BackgroundVariant.Dots} gap={10} size={1} color="#ccc" />
        <Controls />
        <MiniMap
          pannable
          zoomable
          className="!bg-white !border !border-gray-200"
        />

        {/* Ramka rysunkowa z tabelka */}
        <DrawingFrame />
      </ReactFlow>
    </div>
  );
}
