import { useReactFlow, useStore } from '@xyflow/react';
import { useCallback, useRef } from 'react';
import { useProjectStore } from '../../store/projectStore.ts';

const GRID = 10;

// Renderuje punkty zagiec jako HTML divy NAD canvasem (nie w SVG edge)
// Dzieki temu mousedown nie propaguje do nodow/rozdzielnic
export function WaypointOverlay() {
  const { screenToFlowPosition, flowToScreenPosition } = useReactFlow();
  const selectedEdgeId = useProjectStore((s) => s.selectedEdgeId);
  const activeSheet = useProjectStore((s) => s.activeSheet);
  const schematicEdges = useProjectStore((s) => s.edges);
  const singleLineEdges = useProjectStore((s) => s.singleLineEdges);
  const layoutEdges = useProjectStore((s) => s.layoutEdges);
  const edges =
    activeSheet === 'singleLine' ? singleLineEdges
    : activeSheet === 'layout' ? layoutEdges
    : schematicEdges;
  // Subskrypcja viewport wymusza re-render przy pan/zoom
  useStore((s) => s.transform);

  const selectedEdge = selectedEdgeId ? edges.find((e) => e.id === selectedEdgeId) : null;
  const waypoints = ((selectedEdge?.data as Record<string, unknown>)?.waypoints ?? []) as Array<{ x: number; y: number }>;

  const dragging = useRef<number | null>(null);

  const onMouseDown = useCallback((e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    e.preventDefault();
    dragging.current = index;

    const onMouseMove = (ev: MouseEvent) => {
      if (dragging.current === null || !selectedEdgeId) return;
      ev.stopPropagation();
      ev.preventDefault();

      const raw = screenToFlowPosition({ x: ev.clientX, y: ev.clientY });
      const snapped = {
        x: Math.round(raw.x / GRID) * GRID,
        y: Math.round(raw.y / GRID) * GRID,
      };

      const updated = [...waypoints];
      updated[dragging.current] = snapped;
      useProjectStore.getState().updateEdgeData(selectedEdgeId, { waypoints: updated });
    };

    const onMouseUp = () => {
      dragging.current = null;
      window.removeEventListener('mousemove', onMouseMove, true);
      window.removeEventListener('mouseup', onMouseUp, true);
    };

    window.addEventListener('mousemove', onMouseMove, true);
    window.addEventListener('mouseup', onMouseUp, true);
  }, [selectedEdgeId, waypoints, screenToFlowPosition]);

  if (!selectedEdge || waypoints.length === 0) return null;

  return (
    <>
      {waypoints.map((wp, i) => {
        const screen = flowToScreenPosition({ x: wp.x, y: wp.y });
        // Pozycja relatywna do .react-flow containera
        const reactFlowEl = document.querySelector('.react-flow');
        const bounds = reactFlowEl?.getBoundingClientRect();
        if (!bounds) return null;

        const left = screen.x - bounds.left;
        const top = screen.y - bounds.top;

        return (
          <div
            key={i}
            onMouseDown={(e) => onMouseDown(e, i)}
            style={{
              position: 'absolute',
              left: left - 7,
              top: top - 7,
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              border: '2px solid white',
              cursor: 'grab',
              zIndex: 99999,
              pointerEvents: 'all',
            }}
          />
        );
      })}
    </>
  );
}
